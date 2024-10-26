import React, { createContext, useContext, useEffect, useState } from 'react';

import {
    login as loginService,
    signup as signupService,
    logout as logoutService,
    checkAuthStatus as checkAuthStatusService,
    loginWithGoogle as loginWithGoogleService
} from '../services/authServices';

interface UserType {
    id: number;
    name: string;
    email: string;
} 
// Context definition
interface AuthContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    isLoggedIn: boolean;
    login: (userData: { email: string, password: string, captchaToken: string | null}) => any;
    signup: (userData: { name: string, email: string, password: string }) => any;
    logout: () => void;
    checkAuthStatus: () => void;
    loading: boolean;
    authenticateWithGoogle: (tokenResponse: any) => any;
}

// Context creation 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // define user of type UserType as state and set it to an empty user
    const [user, setUser] = useState<UserType | null>({ id: 0, name: '', email: '' });
    const [loading, setLoading] = useState<boolean>(true);

    
    useEffect(() => {
        // Call API to verify auth status 
        const verifyLogin = async () => {
            setLoading(true);
            const { user } = await checkAuthStatusService();
            if (user) {
                setIsLoggedIn(true);  
                setUser(user);        
            } else {
                setIsLoggedIn(false); 
                setUser(null);
            }
            setLoading(false);
        };

        verifyLogin();
    }, []);


    const login = async (userData: { email: string, password: string, captchaToken: string | null }) => {
        try {
            const data = await loginService(userData);
            setUser({ name: data.name, email: data.email, id: data._id });
            setIsLoggedIn(true);
            return data;
        } catch (error) {
            console.error("authContext - login() - error:", error);
            throw error;
        }

    };

    const signup = async (userData: { name: string, email: string, password: string }) => {
        // Perform login logic
        try {
            const data = await signupService(userData);
            setUser({ name: data.name, email: data.email, id: data._id });
            setIsLoggedIn(true);
            return data;
        } catch (error) {
            console.log("Error during login:", error);
            throw error;
        }

    };

    const logout = async () => {
        setIsLoggedIn(false);
        setUser({ id: 0, name: '', email: '' });
        try {
            await logoutService();
        } catch (error) {
            console.log("Error during logout:", error);
            throw error;
        }
    };

    const checkAuthStatus = async () => {
        try {
            await checkAuthStatusService(); 
        } catch (error) {
            console.log("error during checkAuthStatus:", error);
            throw error;
        }
    };

    const authenticateWithGoogle = async (tokenResponse: any) => {
        try {
            const data = await loginWithGoogleService(tokenResponse.credential);
            setUser({ name: data.name, email: data.email, id: data._id });
            setIsLoggedIn(true);
            return data;
        } catch (error) {
            console.error("authContext - Google authentication() - error:", error);
            throw error;
        }
    };


    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, loading, login, signup, logout, checkAuthStatus, authenticateWithGoogle }}>
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

