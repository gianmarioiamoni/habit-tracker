import ReCAPTCHA from 'react-google-recaptcha';

import { GoogleLogin } from '@react-oauth/google';

import { useLogin } from '../../hooks/auth/useLogin';

function Login(): JSX.Element {
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit,
        showCaptcha,
        onCaptchaVerify,
        onGoogleLoginSuccess,

    } = useLogin();
    
    
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

                    {/* reCAPTCHA component */}
                    {showCaptcha && (
                        <ReCAPTCHA
                            sitekey="6LdsSWgqAAAAACKDqqfAwtSusM-G0PdchvLngQ9n" 
                            onChange={onCaptchaVerify} // Callback function to handle reCAPTCHA verification
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Login
                    </button>
                    
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/signup" className="text-indigo-600 hover:text-indigo-500">Sign up</a>
                </p>
                {/* Google login */}
                <div className="mt-6">
                    <GoogleLogin
                        onSuccess={credentialResponse => onGoogleLoginSuccess(credentialResponse)}
                        onError={() => console.log('Login Failed')}
                        locale="en"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
