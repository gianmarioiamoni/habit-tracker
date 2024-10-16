import { useState } from "react";

import { Habit } from "../../interfaces/Habit";

export function useEditHabit(
  initialHabit: Habit,
  onSaveEdit: (editedHabit: Habit) => void
) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState<Habit>(initialHabit);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedHabit((prev) => ({ ...prev, [name]: value }));
  };

  // Handle start date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedHabit((prev) => ({
      ...prev,
      startDate: new Date(e.target.value),
    }));
  };

  // Save and cancel handlers
  const handleSave = () => {
    onSaveEdit(editedHabit);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedHabit(initialHabit);
    setIsEditing(false);
  };

  return {
    isEditing,
    editedHabit,
    handleInputChange,
    handleDateChange,
    handleSave,
    handleCancel,
    setIsEditing,
  };
}
