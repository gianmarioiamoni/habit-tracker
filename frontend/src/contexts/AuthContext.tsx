import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    login as loginService,
    signup as signupService,
    logout as logoutService,
    checkAuthStatus as checkAuthStatusService
} from '../services/authServices';

interface UserType {
    id: number;
    name: string;
    email: string;
} 
// Context definition
interface AuthContextType {
    user: UserType | null;
    error: string | null;
    isLoggedIn: boolean;
    login: (userData: { email: string, password: string }) => any;
    signup: (userData: { name: string, email: string, password: string }) => any;
    logout: () => void;
    checkAuthStatus: () => void;
}

// Context creation 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // define user of type UserType as state and set it to an empty user
    const [user, setUser] = useState<UserType | null>({ id: 0, name: '', email: '' });
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        // Call API to verify auth status 
        const verifyLogin = async () => {
            const { user } = await checkAuthStatusService();
            if (user) {
                setIsLoggedIn(true);  // L'utente è loggato
                setUser(user);        // Imposta le informazioni dell'utente
                setError(null);       // Nessun errore
            } else {
                setIsLoggedIn(false); // L'utente non è loggato
                setUser(null);
                // setError(error);      // Memorizza l'errore
            }
        };

        verifyLogin();
    }, []);


    const login = async (userData: { email: string, password: string }) => {
        try {
            const data = await loginService(userData);
            setUser({ name: data.name, email: data.email, id: data._id });
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
            const data = await checkAuthStatusService(); 
            setUser(data.user);
            setIsLoggedIn(true);
        } catch {
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, error, isLoggedIn, login, signup, logout, checkAuthStatus }}>
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

