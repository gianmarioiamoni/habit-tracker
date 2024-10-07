/**
 * What is being tested:
 * 
 * HabitList without habits: We check that the component renders correctly with the message "No habits found" when there are no habits.
 * 
 * HabitList with habits: We verify that habits are correctly displayed when passed.
 * 
 * Opening the habit add form: We test that clicking the "New Habit" button shows the habit add form.
 * 
 * Loading message: We test that a loading message is shown when the habits are being loaded.
 * 
 * Error handling: We verify that an error message is displayed when there is an issue loading the habits.
 * 
 * User name display: We check that the user's name is correctly displayed in the welcome message.
 */

// import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HabitList from '../HabitList';
import { useHabits } from '../../../hooks/useHabits';
import { useMessage } from '../../../contexts/MessageContext';
import { useAuth } from '../../../contexts/AuthContext';

jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;


jest.mock('../../../hooks/useHabits');
jest.mock('../../../contexts/MessageContext');
jest.mock('../../../contexts/AuthContext');

describe('HabitList component', () => {
    const mockSetSuccessMessage = jest.fn();
    const mockSetErrorMessage = jest.fn();
    const mockSetInfoMessage = jest.fn();
    const mockUser = { name: 'John Doe' };
    const mockSetIsModalOpen = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock for useMessage context
        (useMessage as jest.Mock).mockReturnValue({
            setSuccessMessage: mockSetSuccessMessage,
            setErrorMessage: mockSetErrorMessage,
            setInfoMessage: mockSetInfoMessage,
        });

        // Mock for useAuth context
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
        });

        // Default mock for useHabits hook
        (useHabits as jest.Mock).mockReturnValue({
            habits: [],
            isLoading: false,
            isError: false,
            error: null,
            newHabit: { title: '', description: '', frequency: '', startDate: '' },
            setNewHabit: jest.fn(),
            isModalOpen: false,
            setIsModalOpen: mockSetIsModalOpen,
            handleAddHabit: jest.fn(),
            handleSaveEdit: jest.fn(),
            handleDeleteHabit: jest.fn(),
        });
    });

    test('renders habit list with no habits', () => {
        render(<HabitList />);

        // Check if the heading and button are rendered
        expect(screen.getByText(/your habits/i)).toBeInTheDocument();
        expect(screen.getByText('+ New Habit')).toBeInTheDocument();

        // Check that no habits message is shown
        expect(screen.getByText('No habits found')).toBeInTheDocument();
    });

    test('renders habits when provided', () => {
        const mockHabits = [
            { _id: '1', title: 'Habit 1', description: 'Description 1', frequency: 'daily', startDate: new Date() },
            { _id: '2', title: 'Habit 2', description: 'Description 2', frequency: 'weekly', startDate: new Date() },
        ];

        (useHabits as jest.Mock).mockReturnValueOnce({
            ...useHabits(),
            habits: mockHabits,
        });

        render(<HabitList />);

        // Check that habits are rendered
        expect(screen.getByText('Habit 1')).toBeInTheDocument();
        expect(screen.getByText('Habit 2')).toBeInTheDocument();
    });

    test('opens the habit add form when clicking the New Habit button', () => {
        (useHabits as jest.Mock).mockReturnValueOnce({
            ...useHabits(),
            isModalOpen: true,
        });

        render(<HabitList />);

        // Click on New Habit button
        const newHabitButton = screen.getByText('+ New Habit');
        fireEvent.click(newHabitButton);

        // Check if HabitAddForm is rendered
        expect(screen.getByText('Add New Habit')).toBeInTheDocument();
    });

    test('displays loading message when loading habits', () => {
        (useHabits as jest.Mock).mockReturnValueOnce({
            ...useHabits(),
            isLoading: true,
        });

        render(<HabitList />);

        // Check if loading message is set
        expect(mockSetInfoMessage).toHaveBeenCalledWith('Loading habits...');
    });

    test('displays error message when there is an error loading habits', () => {
        const mockError = { message: 'Failed to load habits' };

        (useHabits as jest.Mock).mockReturnValueOnce({
            ...useHabits(),
            isError: true,
            error: mockError,
        });

        render(<HabitList />);

        // Check if error message is set
        expect(mockSetErrorMessage).toHaveBeenCalledWith('Failed to load habits');
    });

    test('displays the user name in the welcome message', () => {
        render(<HabitList />);

        // Check if user name is displayed
        expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    });
});
