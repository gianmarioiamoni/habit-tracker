import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useMessage } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";
import { getHabits, createHabit } from "../../services/habitServices";
import HabitEditForm from "./HabitEditForm";
import HabitListItem from "./HabitListItem";
import { Habit } from "../../interfaces/Habit";


function HabitList(): JSX.Element {
    const { setErrorMessage, setInfoMessage } = useMessage();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [newHabit, setNewHabit] = useState({ _id: "", title: "", description: "", frequency: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data using useQuery
    const { data: habits, isLoading, isError, error } = useQuery<Habit[], Error>(
        "habits",
        getHabits
    );

    const mutation = useMutation(createHabit, {
        onSuccess: () => {
            // Refetch the habits after a new one is added
            queryClient.invalidateQueries("habits"); 
            setInfoMessage("Habit added successfully!");
            setIsModalOpen(false); // Close modal
        },
        onError: (err: any) => {
            setErrorMessage(err.message);
        },
    });


    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(newHabit); // Send new habit to the backend
    };

    if (isLoading) {
        setInfoMessage("Loading habits...");
    }

    if (isError && error) {
        setErrorMessage(error.message);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Habits</h2>
                <button
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsModalOpen(true)} // Open the modal when clicking "New Habit"
                >
                    + New Habit
                </button>
            </div>
            <h3>Welcome, {user?.name}</h3>
            {/* Add New habit section */}
            {isModalOpen && (
                <HabitEditForm
                    newHabit={newHabit}
                    setNewHabit={setNewHabit}
                    handleAddHabit={handleAddHabit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Habit list section  */}
            {habits?.length ? (
                <ul className="space-y-4">
                    {habits.map((habit) => (
                        <HabitListItem key={habit._id} habit={habit} />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No habits found</p>
            )}
        </div>
    );
}

export default HabitList;



