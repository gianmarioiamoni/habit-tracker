import { useState } from "react";

import { Habit } from "../interfaces/Habit";

export function useDeleteHabit(
  habit: Habit,
  onDeleteHabit: (habitId: string) => void
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteHabit(habit._id); // Call parent function to delete the habit
    setIsDialogOpen(false); // Close dialog
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false); // Close dialog
  };

  return {
    isDialogOpen,
      handleDelete,
      handleConfirmDelete,
      handleCancelDelete
  }
};
