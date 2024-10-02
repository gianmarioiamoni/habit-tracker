import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';
import { signup } from '../../../services/authServices';

// Mocking the signup function
jest.mock('../../../services/authServices', () => ({
    signup: jest.fn(() => Promise.resolve({})), // Simulazione di una registrazione riuscita
}));

describe('Signup Component', () => {
    const queryClient = new QueryClient();

    // Mocking window.alert
    beforeAll(() => {
        window.alert = jest.fn(); // Mocka la funzione alert
    });

    beforeEach(() => {
        jest.clearAllMocks(); // Resetta i mock prima di ogni test
    });

    test('renders the signup form', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </QueryClientProvider>
        );

        expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    });

    test('submits the form with valid inputs', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </QueryClientProvider>
        );

        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

        // Wait for the alert to be called
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('User signed up successfully!'));
    });

    test('displays an error message when signup fails', async () => {
        (signup as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Signup failed')));

        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </QueryClientProvider>
        );

        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

        // Wait for the error message to be displayed
        await waitFor(() => expect(screen.getByText(/An error occurred: Signup failed/i)).toBeInTheDocument());
    });
});

