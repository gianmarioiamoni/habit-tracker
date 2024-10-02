import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { signup } from '../../services/authServices';

function Signup(): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate, isLoading, error } = useMutation(signup, {
        onSuccess: (data) => {
            alert('User signed up successfully!');
            // Puoi fare il redirect qui se necessario
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ name, email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />

                {error instanceof Error &&
                    <p className="text-red-500">
                        An error occurred: {error.message}
                    </p>
                }

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing up...' : 'Signup'}
                </button>
            </form>
        </div>
    );
};

export default Signup;
