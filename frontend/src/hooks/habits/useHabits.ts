import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useToast} from "../../contexts/ToastContext";
import { Habit } from "../../interfaces/Habit";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
} from "../../services/habitServices";

export function useHabits() {
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();

  const [newHabit, setNewHabit] = useState<Habit>({
    _id: "",
    title: "",
    description: "",
    frequency: "",
    startDate: new Date(),
    progress: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // GET ALL HABITS
  const {
    data: habits,
    isLoading,
    isError,
  } = useQuery<Habit[], Error>("habits", getHabits);

  // ADD NEW HABIT
  const addHabitMutation = useMutation(createHabit, {
    onSuccess: () => {
      queryClient.invalidateQueries("habits");
      showSuccess("Habit added successfully!");
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      showError(err.message);
    },
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    addHabitMutation.mutate(newHabit);
  };

  // EDIT HABIT
  const updateHabitMutation = useMutation(updateHabit, {
    onSuccess: () => {
      queryClient.invalidateQueries("habits");
      showSuccess("Habit updated successfully!");
    },
    onError: (err: any) => {
      showError(err.message);
    },
  });

  const handleSaveEdit = (updatedHabit: Habit) => {
    updateHabitMutation.mutate(updatedHabit);
  };

  // DELETE HABIT
  const deleteMutation = useMutation(deleteHabit, {
    onSuccess: () => {
      queryClient.invalidateQueries("habits");
      showSuccess("Habit deleted successfully!");
    },
    onError: (err: any) => {
      showError(err.message);
    },
  });

  const handleDeleteHabit = (habitId: string) => {
    deleteMutation.mutate(habitId);
  };

  return {
    habits,
    isLoading,
    isError,
    newHabit,
    setNewHabit,
    isModalOpen,
    setIsModalOpen,
    handleAddHabit,
    handleSaveEdit,
    handleDeleteHabit,
  };
}
