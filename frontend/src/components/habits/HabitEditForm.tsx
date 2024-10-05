import React from "react";
import { Habit } from "../../interfaces/Habit";
import { format } from "date-fns";

interface HabitEditFormProps {
    newHabit: Habit;
    setNewHabit: React.Dispatch<React.SetStateAction<Habit>>;
    handleAddHabit: (e: React.FormEvent) => void;
    onClose: () => void;
};

export default function HabitEditForm(
    { newHabit, setNewHabit, handleAddHabit, onClose }: HabitEditFormProps
): JSX.Element {

    const handleNewHabitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewHabit({ ...newHabit, [e.target.name]: e.target.value });
    };

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewHabit({ ...newHabit, frequency: e.target.value });
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isoDate = new Date(e.target.value);  // ISO format
        setNewHabit({ ...newHabit, startDate: isoDate });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
                <form onSubmit={handleAddHabit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Habit Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newHabit.title}
                            onChange={handleNewHabitChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={newHabit.description}
                            onChange={handleNewHabitChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    {/* Frequency */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Frequency</label>
                        <select
                            name="frequency"
                            value={newHabit.frequency}
                            onChange={handleFrequencyChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="working-days">Working days</option>
                            <option value="weekend">Weekend</option>
                        </select>
                    </div>
                    {/* Start Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            onChange={handleStartDateChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
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
                </form>
            </div>
        </div>
    );
}
