import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, signup as signupService } from '../services/authServices';

interface UserType {
    id: number;
    name: string;
    email: string;
}
// Context definition
interface AuthContextType {
    user: UserType;
    isLoggedIn: boolean;
    login: (userData: { email: string, password: string }) => any;
    signup: (userData: { name: string, email: string, password: string }) => any;
    logout: () => void;
}

// Context creation 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // define user of type UserType as state and set it to an empty user
    const [user, setUser] = useState<UserType>({ id: 0, name: '', email: '' });

    // Check if the user is already logged in when page load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // if the token is present, the user is logged in
            setIsLoggedIn(true);

            // Retrieve user info from the token 
            // decode JWT token to extract user info from it
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (savedUser && savedUser.id) {
                setUser(savedUser);  // Set the user details from localStorage
            }
        }
    }, []); 


    const login = async (userData: { email: string, password: string }) => {
        // Perform login logic
        try {
            const data = await loginService(userData);
            setUser({ name: data.name, email: data.email, id: data._id });
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
            return data;
        } catch (error) {
            console.log("Error during login:", error);
            throw error;
        }

    };

    const signup = async (userData: { name: string, email: string, password: string }) => {
        // Perform login logic
        try {
            const data = await signupService(userData);
            setUser({ name: data.name, email: data.email, id: data._id });
            localStorage.setItem('token', data.token);
            setIsLoggedIn(true);
            return data;
        } catch (error) {
            console.log("Error during login:", error);
            throw error;
        }

    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        setUser({ id: 0, name: '', email: '' });
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

