import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext'; 

function Signup(): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { signup: signupContext } = useAuth(); // get login function from AuthContext
    const { setErrorMessage, setSuccessMessage } = useMessage();

    const { mutate, isLoading, error } = useMutation(signupContext, {
        onSuccess: (data) => {
            setSuccessMessage("User signed up successfully!");
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
            setErrorMessage("An error occurred during signup");
        }
    });

    if (error instanceof Error) {
        setErrorMessage("An error occurred during signup");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ name, email, password });
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
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a>
                </p>
            </div>
        </div >
    )
};

export default Signup;
