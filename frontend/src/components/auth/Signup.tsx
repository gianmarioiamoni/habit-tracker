import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { sanitizeEmail } from '../../utils/normalize';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { GoogleLogin } from '@react-oauth/google'; // Aggiunto

function Signup(): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { signup: signupContext, authenticateWithGoogle } = useAuth(); // Aggiunto loginWithGoogle
    const { showSuccess, showError } = useToast();

    const { mutate, isLoading, error } = useMutation(signupContext, {
        onSuccess: (data) => {
            showSuccess("User signed up successfully!");
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
            showError("An error occurred during signup");
        }
    });

    if (error instanceof Error) {
        showError("An error occurred during signup");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            showError("Invalid email format");
            return;
        }

        if (!validator.isLength(password, { min: 6 })) {
            showError("Password must be at least 6 characters");
            return;
        }

        const sanitizedEmail = sanitizeEmail(email);
        const sanitizedName = validator.escape(name);

        mutate({ name: sanitizedName, email: sanitizedEmail, password });
    };

    // Funzione per gestire il successo del Google signup
    const onGoogleSignupSuccess = async (tokenResponse: any) => {
        try {
            await authenticateWithGoogle(tokenResponse); 
            showSuccess("Signup with Google was successful!");
            navigate('/dashboard');
        } catch (error) {
            showError("An error occurred during Google signup");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Signup</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />

                    <button
                        type="submit"
                        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Signup'}
                    </button>
                </form>

                {/* Google signup */}
                <div className="mt-6">
                    <GoogleLogin
                        onSuccess={credentialResponse => onGoogleSignupSuccess(credentialResponse)}
                        onError={() => console.log('Signup Failed')}
                        locale="en"
                    />
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a>
                </p>
            </div>
        </div>
    )
};

export default Signup;

