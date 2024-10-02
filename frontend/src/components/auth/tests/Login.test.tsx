import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock the login function to return a valid token
jest.mock('../../../services/authServices', () => ({
    login: jest.fn(() =>
        Promise.resolve({
            data: { token: 'mockToken' }, // Restituisci un oggetto con la proprietà `data`
        })
    ),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock window.alert
global.alert = jest.fn();

// Create a new query client for the test
const queryClient = new QueryClient();

describe('Login Component', () => {
    test('renders the login form', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </QueryClientProvider>
        );

        // Check if email and password fields are present
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('submits the form with valid inputs', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </QueryClientProvider>
        );

        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Log the calls to navigate for debugging
        console.log('Navigate calls:', mockNavigate.mock.calls);

        // Wait for the mutation and check if navigate has been called
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));

        // Ensure the token is saved in localStorage
        expect(localStorage.getItem('token')).toBe('mockToken');
    });
});



