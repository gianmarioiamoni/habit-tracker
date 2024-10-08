import { format } from "date-fns";
import { Habit } from "../../interfaces/Habit";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import { useEditHabit } from "../../hooks/useEditHabit";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";
import { frequencyOptions } from "../../utils/frequencyOptions";
import { completeHabit } from "../../services/habitServices";
import { useMessage } from "../../contexts/MessageContext";


interface HabitListItemProps {
    habit: Habit;
    onSaveEdit: (editedHabit: Habit) => void;
    onDeleteHabit: (habitId: string) => void;
}

export default function HabitListItem({ habit, onSaveEdit, onDeleteHabit }: HabitListItemProps): JSX.Element {
    const { setErrorMessage } = useMessage();

    const {
        isEditing,
        editedHabit,
        handleInputChange,
        handleDateChange,
        handleSave,
        handleCancel,
        setIsEditing,
    } = useEditHabit(habit, onSaveEdit);

    const {
        isDialogOpen,
        handleDelete,
        handleConfirmDelete,
        handleCancelDelete,
    } = useDeleteHabit(habit, onDeleteHabit);

    const handleCompletion = async () => {
        try {
            await completeHabit(habit._id);

            // Local state update
            const updatedHabit = {
                ...habit,
                progress: [...habit.progress, new Date()] // Add current date to progress
            };
            // update habit on HabitList
            onSaveEdit(updatedHabit);
        } catch (error) {
            setErrorMessage("Error in completing habit");
        }
    };

    return (
        <li className="bg-white shadow-md rounded-lg p-4 space-y-4 sm:flex sm:justify-between sm:items-start sm:space-y-0">
            
            {/* Habit Details */}
            <div className="sm:flex-1">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="title"
                            value={editedHabit.title}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            name="description"
                            value={editedHabit.description}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        />
                        <select
                            name="frequency"
                            value={editedHabit.frequency}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        >
                            {frequencyOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {editedHabit.startDate && (
                            <input
                                type="date"
                                value={format(editedHabit.startDate, "yyyy-MM-dd")}
                                onChange={handleDateChange}
                                className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                            />
                        )}
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
                        <p className="text-gray-600">{habit.description}</p>
                        <sub className="text-gray-500">Frequency: {habit.frequency}</sub>
                        {habit.startDate && (
                            <>
                                <br />
                                <sub className="text-gray-600 font-semibold">
                                    Start Date: {format(new Date(habit.startDate), "dd-MM-yyyy")}
                                </sub>
                            </>
                        )}
                    </>
                )}

                {/* Progress History Section */}
                <div className="mt-4">
                    <sub className="text-gray-800 font-semibold">Progress History:</sub>
                    <ul className="list-disc ml-4 text-gray-600">
                        {habit.progress && habit.progress.length > 0 ? (
                            habit.progress.map((entry, index) => (
                                <li key={index} className="text-xs ml-4">
                                    {format(new Date(entry), "dd-MM-yyyy")}
                                </li>
                            ))
                        ) : (
                            <li>No progress recorded yet</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Actions for all screens (icons, reduced size for small screens) */}
            <div className="flex flex-row space-x-4 justify-end">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-xs sm:text-base"
                            aria-label="Save Changes"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-600 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-xs sm:text-base"
                            aria-label="Cancel Changes"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleCompletion}
                            className="bg-green-600 text-white p-1 sm:p-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label="Complete Habit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-600 text-white p-1 sm:p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            aria-label="Edit Habit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12l-9.293 9.293a1 1 0 00-.293.707V21a1 1 0 001 1h.293a1 1 0 00.707-.293L12 15m3 0l6.293-6.293a1 1 0 00.293-.707V8a1 1 0 00-1-1h-.293a1 1 0 00-.707.293L12 15"
                                />
                            </svg>
                        </button>
                        <button
                            className="text-red-500 hover:text-red-600 p-1 sm:p-2 rounded-full transition duration-300"
                            aria-label="Delete Habit"
                            onClick={handleDelete}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-6 sm:h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                message={`Are you sure you want to delete the habit "${habit.title}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </li>
    );
}
