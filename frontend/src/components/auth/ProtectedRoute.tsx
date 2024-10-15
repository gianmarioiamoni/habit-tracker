import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from "../../contexts/AuthContext";
import { useMessage } from '../../contexts/MessageContext';


interface ProtectedRouteProps {
    children: React.ReactNode;
}

// function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
//     const token = localStorage.getItem('token');

//     // If there's no token, redirect to the login page
//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     // If there's a token, make the protected route available
//     return <>{children}</>;
// };

// export default ProtectedRoute;
function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const { isLoggedIn, checkAuthStatus } = useAuth();
    const { setInfoMessage } = useMessage();
    const [loading, setLoading] = useState(true); // Stato per gestire il caricamento

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuthStatus(); // Verifica se l'utente è autenticato
            } catch (error) {
                console.log("User is not authenticated:", error);
            } finally {
                setLoading(false); // Fine del caricamento
            }
        };

        verifyAuth();
    }, [checkAuthStatus]);

    // Mostra uno stato di caricamento finché non abbiamo una risposta dal server
    if (loading) {
        setInfoMessage('Verifying user authentication...');
    }

    // Se l'utente non è autenticato, viene rediretto al login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Se l'utente è autenticato, viene mostrata la route protetta
    return <>{children}</>;
}

export default ProtectedRoute;
