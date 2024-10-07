import { render, screen, fireEvent } from "@testing-library/react";
import HabitAddForm from "../HabitAddForm";
import { Habit } from "../../../interfaces/Habit";

// Props mocks
const mockNewHabit: Habit = {
    _id: "",
    title: "",
    description: "",
    frequency: "",
    startDate: new Date(),
};

const mockSetNewHabit = jest.fn();
const mockHandleAddHabit = jest.fn();
const mockOnClose = jest.fn();

describe("HabitAddForm", () => {
    it("renders the form correctly", () => {
        render(
            <HabitAddForm
                newHabit={mockNewHabit}
                setNewHabit={mockSetNewHabit}
                handleAddHabit={mockHandleAddHabit}
                onClose={mockOnClose}
            />
        );

        // Check if the form is rendered correctly and inputs are present
        expect(screen.getByLabelText(/Habit Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    });

    it("calls setNewHabit when the title input is changed", () => {
        render(
            <HabitAddForm
                newHabit={mockNewHabit}
                setNewHabit={mockSetNewHabit}
                handleAddHabit={mockHandleAddHabit}
                onClose={mockOnClose}
            />
        );

        // Look for the title input and change its value
        const titleInput = screen.getByLabelText(/Habit Title/i);
        fireEvent.change(titleInput, { target: { value: "New Habit Title" } });

        // Check if the setNewHabit function was called
        expect(mockSetNewHabit).toHaveBeenCalledWith({
            ...mockNewHabit,
            title: "New Habit Title",
        });
    });

    it("calls handleAddHabit when the form is submitted", () => {
        render(
            <HabitAddForm
                newHabit={mockNewHabit}
                setNewHabit={mockSetNewHabit}
                handleAddHabit={mockHandleAddHabit}
                onClose={mockOnClose}
            />
        );

        // Mock the form submission
        const form = screen.getByRole("form");
        fireEvent.submit(form);

        // Verify that the handleAddHabit function was called
        expect(mockHandleAddHabit).toHaveBeenCalled();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(
            <HabitAddForm
                newHabit={mockNewHabit}
                setNewHabit={mockSetNewHabit}
                handleAddHabit={mockHandleAddHabit}
                onClose={mockOnClose}
            />
        );

        // Look for the cancel button and click it
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        // Verify that the onClose function was called
        expect(mockOnClose).toHaveBeenCalled();
    });
});
