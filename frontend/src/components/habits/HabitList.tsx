import React from "react";
import { useQuery } from "react-query";

import { useMessage } from "../../contexts/MessageContext";

import { getHabits } from "../../services/habitServices";

interface Habit {
    _id: string;
    name: string;
    description: string;
}

function HabitList(): JSX.Element {
    const { setErrorMessage, setInfoMessage } = useMessage();

    // Fetch data using useQuery
    const { data: habits, isLoading, isError, error } = useQuery<Habit[], Error>(
        "habits",
        getHabits);

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
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    + New Habit
                </button>
            </div>
            {habits?.length ? (
                <ul className="space-y-4">
                    {habits.map((habit) => (
                        <li
                            key={habit._id}
                            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                                <p className="text-gray-600">{habit.description}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    aria-label="Edit Habit"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12l-9.293 9.293a1 1 0 00-.293.707V21a1 1 0 001 1h.293a1 1 0 00.707-.293L12 15m3 0l6.293-6.293a1 1 0 00.293-.707V8a1 1 0 00-1-1h-.293a1 1 0 00-.707.293L12 15m0 0l6.293-6.293m-9 9.293L9 21"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-600 transition duration-300"
                                    aria-label="Delete Habit"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No habits found</p>
            )}
        </div>
    )
}

export default HabitList;


