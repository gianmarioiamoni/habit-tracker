import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../components/auth/Login';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('should login a user', async () => {
    render(
        <BrowserRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </BrowserRouter>
    );

    // Simula l'input dell'utente
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
        target: { value: 'gianmario.iamoni@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
        target: { value: 'gianma67' },
    });

    fireEvent.click(screen.getByText(/Login/i));

    // Aspetta che l'utente venga loggato
    await waitFor(() => {
        expect(screen.getByText(/Welcome to Habit Tracker!/i)).toBeInTheDocument();
    });
});
