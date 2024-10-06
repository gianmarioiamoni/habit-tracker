import React, { useState } from "react";
import { format } from "date-fns";

import { Habit } from "../../interfaces/Habit";
import ConfirmationDialog from "../ui/ConfirmationDialog";

import { useEditHabit } from "../../hooks/useEditHabit";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";

import { frequencyOptions } from "../../utils/frequencyOptions"; 

interface HabitListItemProps {
    habit: Habit;
    onSaveEdit: (editedHabit: Habit) => void;
    onDeleteHabit: (habitId: string) => void;
}

export default function HabitListItem({ habit, onSaveEdit, onDeleteHabit }: HabitListItemProps): JSX.Element {

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


    return (
        <li className="bg-white shadow-md rounded-lg p-4 sm:flex sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
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
                        {/* <select
                            name="frequency"
                            value={editedHabit.frequency}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="working days">Working Days</option>
                            <option value="weekend">Weekend</option>
                        </select> */}
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
            </div>
            <div className="flex sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 sm:justify-end">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label="Save Changes"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Cancel Changes"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        {/* Edit Habit Button */}
                        <button
                            onClick={() => setIsEditing(true)}
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
                        {/* Delete Habit Button */}
                        <button
                            className="text-red-500 hover:text-red-600 transition duration-300"
                            aria-label="Delete Habit"
                            onClick={handleDelete}
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

