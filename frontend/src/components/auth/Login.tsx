// import React, { useState } from 'react';
// import { useMutation } from 'react-query';
// import { login } from '../../services/authServices';

// const Login: React.FC = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const { mutate, isLoading, error } = useMutation(login, {
//         onSuccess: (data) => {
//             alert('Logged in successfully!');
//             // Salva il token e fai il redirect se necessario
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         mutate({ email, password });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-4">Login</h2>

//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Email"
//                     className="w-full p-2 mb-4 border border-gray-300 rounded"
//                 />

//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Password"
//                     className="w-full p-2 mb-4 border border-gray-300 rounded"
//                 />

//                 {error instanceof Error &&
//                     <p className="text-red-500">
//                         An error occurred: {error.message}
//                     </p>
//                 }

//                 <button
//                     type="submit"
//                     className="bg-blue-500 text-white p-2 rounded w-full"
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Logging in...' : 'Login'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Mutation to send login request
    const mutation = useMutation(async () => {
        const response = await axios.post('/api/auth/login', { email, password });
        return response.data;
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

