import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    // If there's no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If there's a token, make the protected route available
    return <>{children}</>;
};

export default ProtectedRoute;
