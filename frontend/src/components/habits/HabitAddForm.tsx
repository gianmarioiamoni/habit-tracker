import React from "react";

import { Habit } from "../../interfaces/Habit";

import { frequencyOptions } from "../../utils/frequencyOptions";

interface HabitAddFormProps {
    newHabit: Habit;
    setNewHabit: React.Dispatch<React.SetStateAction<Habit>>;
    handleAddHabit: (e: React.FormEvent) => void;
    onClose: () => void;
};

export default function HabitAddForm(
    { newHabit, setNewHabit, handleAddHabit, onClose }: HabitAddFormProps
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
                <form onSubmit={handleAddHabit} role="form">
                    {/* Title */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">Habit Title</label>
                        <input
                            id="title"
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
                        <label htmlFor="description" className="block text-gray-700">Description</label>
                        <input
                            id="description"
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
                        <label htmlFor="frequency" className="block text-gray-700">Frequency</label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={newHabit.frequency}
                            onChange={handleFrequencyChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        >
                            {frequencyOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                    </div>
                    {/* Start Date */}
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-gray-700">Start Date</label>
                        <input
                            id="startDate"
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
                            type="button"
                            className="bg-gray-300 py-2 px-4 rounded-md hover:bg-gray-400"
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Add Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
