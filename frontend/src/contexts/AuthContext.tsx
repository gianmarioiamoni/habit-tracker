import React, { createContext, useContext, useState } from 'react';

// Context definition
interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

// Context creation 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
    
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
