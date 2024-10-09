import { format } from "date-fns";
import { Habit } from "../../interfaces/Habit";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import { useEditHabit } from "../../hooks/useEditHabit";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";
import { frequencyOptions } from "../../utils/frequencyOptions";
import { completeHabit } from "../../services/habitServices";
import { useMessage } from "../../contexts/MessageContext";

import HabitListItemEditForm from "./elements/HabitListItemEditForm";
import HabitListItemShowForm from "./elements/HabitListItemShowForm";
import HabitListItemProgressHistory from "./elements/HabitListItemProgressHistory";
import HabitListItemActionButtons from "./elements/HabitListItemActionButtons";


interface HabitListItemProps {
    habit: Habit;
    onSaveEdit: (editedHabit: Habit) => void;
    onDeleteHabit: (habitId: string) => void;
}

export default function HabitListItem({ habit, onSaveEdit, onDeleteHabit }: HabitListItemProps): JSX.Element {
    const { setErrorMessage } = useMessage();

    // EDIT
    const {
        isEditing,
        editedHabit,
        handleInputChange,
        handleDateChange,
        handleSave,
        handleCancel,
        setIsEditing,
    } = useEditHabit(habit, onSaveEdit);

    // DELETE
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

    const handleDeleteProgress = (entryDate: Date) => {
        const updatedHabit = { ...habit, progress: habit.progress.filter((entry) => new Date(entry).getTime() !== entryDate.getTime()) };
        onSaveEdit(updatedHabit);
    };


    return (
        <li className="bg-white shadow-md rounded-lg p-4 space-y-4 sm:flex sm:justify-between sm:items-start sm:space-y-0">
            
            {/* Habit Details */}
            <div className="sm:flex-1">
                {isEditing ? (
                    <HabitListItemEditForm
                        editedHabit={editedHabit}
                        handleInputChange={handleInputChange}
                        handleDateChange={handleDateChange}
                    />
                
                ) : (
                    <HabitListItemShowForm habit={habit} />
                )}

                {/* Progress History Section */}
                <HabitListItemProgressHistory habit={habit} handleDeleteProgress={handleDeleteProgress}/>

            </div>

            {/* Actions */}
            <HabitListItemActionButtons
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleCompletion={handleCompletion}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleDelete={handleDelete}
            />   

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
