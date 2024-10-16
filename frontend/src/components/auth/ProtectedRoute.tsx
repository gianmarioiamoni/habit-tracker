import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from "../../contexts/AuthContext";


interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const { isLoggedIn, loading } = useAuth();
    console.log("ProtectedRoute isLoggedIn: ", isLoggedIn)
    // if the user is not authenticated, redirect to the login page 
    if (loading) {
        return <></> 
    }
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If the user is authenticated, render the protected route
    return <>{children}</>;
}

export default ProtectedRoute;
