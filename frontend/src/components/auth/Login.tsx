import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import validator from 'validator';

import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';

function Login(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const { login: loginContext, user } = useAuth();

    const { setSuccessMessage, setErrorMessage } = useMessage();

    // Show validation errors if any
    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            validationErrors.email && setErrorMessage(validationErrors.email);
            validationErrors.password && setErrorMessage(validationErrors.password);
        }
    }, [validationErrors, setErrorMessage]);

    // Show login error and success message
    useEffect(() => {
        if (loginError) {
            setErrorMessage("Invalid email or password.");
        }
    }, [loginError, setErrorMessage]);

    useEffect(() => {
        if (isSuccess) {
            setSuccessMessage(`Welcome back to Habit Tracker` + (user?.name ? `, ${user?.name}!` : '!'));
        }
    }, [isSuccess, setSuccessMessage, user?.name]);

    // Mutation to send login request
    const mutation = useMutation(async () => {
        console.log('email', email, 'password', password);
        const response = await loginContext({ email, password });
        return response;
    }, {
        onSuccess: (data) => {
            navigate('/dashboard');
            setLoginError(null);
            setIsSuccess(true);
            // setSuccessMessage("Welcome to Habit Tracker!");
        },
        onError: (error: any) => {
            console.error(error);
            setLoginError("Invalid email or password");
            setIsSuccess(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setValidationErrors({});

        // VALIDATION
        const newErrors: { email?: string; password?: string } = {};

        if (!validator.isEmail(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (validator.isEmpty(password)) {
            newErrors.password = "Password is required";
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        mutation.mutate();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-500">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

