import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useMessage } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";
import { getHabits, createHabit, updateHabit, deleteHabit } from "../../services/habitServices";
import HabitEditForm from "./HabitEditForm";
import HabitListItem from "./HabitListItem";
import { Habit } from "../../interfaces/Habit";


function HabitList(): JSX.Element {
    const { setSuccessMessage, setErrorMessage, setInfoMessage } = useMessage();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [newHabit, setNewHabit] = useState({ _id: "", title: "", description: "", frequency: "", startDate: new Date() });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data using useQuery
    const { data: habits, isLoading, isError, error } = useQuery<Habit[], Error>(
        "habits",
        getHabits
    );

    // ADD NEW HABIT
    // useQuery to refetch habits after a new one is added
    const addHabitMutation = useMutation(createHabit, {
        onSuccess: () => {
            // Refetch the habits after a new one is added
            queryClient.invalidateQueries("habits"); 
            setSuccessMessage("Habit added successfully!");
            setIsModalOpen(false); // Close modal
        },
        onError: (err: any) => {
            setErrorMessage(err.message);
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
            setSuccessMessage("Habit updated successfully!");
        },
        onError: (err: any) => {
            setErrorMessage(err.message);
        },
    });

    // Function to handle editing save of an habit
    const handleSaveEdit = (updatedHabit: Habit) => {
        updateHabitMutation.mutate(updatedHabit); 
    };

    // DELETE HABIT
    const deleteMutation = useMutation(deleteHabit, {
        onSuccess: () => {
            queryClient.invalidateQueries("habits");
            setSuccessMessage("Habit deleted successfully!");
        },
        onError: (err: any) => {
            setErrorMessage(err.message);
        },
    });

    const handleDeleteHabit = (habitId: string) => {
        deleteMutation.mutate(habitId);
    };


    if (isLoading) {
        setInfoMessage("Loading habits...");
    }

    if (isError && error) {
        setErrorMessage(error.message);
    }

    return (
        <div className="container mx-auto px-24 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Habits</h2>
                <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Habit
                </button>
            </div>
            <h3 className="text-center mb-8 sm:text-left">Welcome, {user?.name}</h3>

            {isModalOpen && (
                <HabitEditForm
                    newHabit={newHabit}
                    setNewHabit={setNewHabit}
                    handleAddHabit={handleAddHabit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Habit list section */}
            <div className="overflow-y-auto max-h-[70vh]">
                {habits?.length ? (
                    <ul className="space-y-4">
                        {habits.map((habit) => (
                            <HabitListItem key={habit._id}
                                habit={habit}
                                onSaveEdit={handleSaveEdit}
                                onDeleteHabit={handleDeleteHabit}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">No habits found</p>
                )}
            </div>
        </div>
    );
}

export default HabitList;



