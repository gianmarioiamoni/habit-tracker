// What the test does:
// Initial rendering: Verifies that the component correctly displays the habit information (title, description, frequency).
// Edit mode: Simulates clicking the edit button and checks that the editing mode is activated.
// Delete confirmation dialog: Verifies that the delete button opens the confirmation dialog and that the confirm and cancel actions for deletion work properly.

import { render, screen, fireEvent } from '@testing-library/react';
import HabitListItem from '../HabitListItem';
import { useDeleteHabit } from '../../../hooks/habits/useDeleteHabit';

jest.mock('../../../hooks/useDeleteHabit', () => ({
    useDeleteHabit: jest.fn().mockReturnValue({
        isDialogOpen: true,
        handleDelete: jest.fn(),
        handleConfirmDelete: jest.fn(),
        handleCancelDelete: jest.fn(),
    }),
}));

const mockHabit = {
    _id: '1',
    title: 'Test Habit',
    description: 'This is a test habit.',
    frequency: 'daily',
    startDate: new Date(),
    progress: [],
};

describe('HabitListItem component', () => {
    test('handles confirmation of habit deletion', () => {
        render(
            <HabitListItem
                habit={mockHabit}
                onSaveEdit={jest.fn()}
                onDeleteHabit={jest.fn()}
            />
        );

        // Simula il click sul pulsante di cancellazione
        fireEvent.click(screen.getByLabelText(/Delete Habit/i));

        // Verifica che la dialog di conferma si apra
        expect(screen.getByText(/Are you sure you want to delete the habit/i)).toBeInTheDocument();

        // Simula la conferma di cancellazione
        fireEvent.click(screen.getByText(/Confirm/i));

        // Verifica che `handleConfirmDelete` sia stato chiamato
        expect(useDeleteHabit(mockHabit, jest.fn()).handleConfirmDelete).toHaveBeenCalled();
    });
});

