import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';

function Login(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Mutation to send login request
    const mutation = useMutation(async () => {
        const response = await login({ email, password });
        return response;
    }, {
        onSuccess: (data) => {
            // save JWT to local storage
            localStorage.setItem('token', data.token);
            // navigate to a protect route after login
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
            alert("An error occurred during login");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;

