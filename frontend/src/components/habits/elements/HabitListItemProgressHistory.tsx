import { useState } from "react";
import { format } from "date-fns";
import { Habit } from "../../../interfaces/Habit";

interface HabitListItemProgressListProps {
    habit: Habit;
    handleDeleteProgress: (entryDate: Date) => void;
}

export default function HabitListItemProgressHistory({
    habit,
    handleDeleteProgress,
}: HabitListItemProgressListProps): JSX.Element {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <div className="mt-4">
            <div className="flex items-center">
                <sub className="text-gray-800 font-semibold">Progress History:</sub>
                <div className="relative ml-2 flex items-center group">
                    {/* Expansion button */}
                    <button
                        onClick={toggleExpanded}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center mt-1"
                        aria-label={isExpanded ? "Hide Progress History" : "Show Progress History"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isExpanded ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
                            />
                        </svg>
                    </button>
                    {/* Tooltip for expansion button */}
                    <div className="absolute -top-6 -right-8 w-40 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isExpanded ? "Hide Progress History" : "Show Progress History"}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <ul className="list-disc ml-4 text-gray-600 mt-2">
                    {habit.progress && habit.progress.length > 0 ? (
                        habit.progress.map((entry, index) => (
                            <li key={index} className="text-xs ml-4 flex items-center">
                                <span className="mr-2">{format(new Date(entry), "dd-MM-yyyy")}</span>
                                <div className="relative group">
                                    <button
                                        onClick={() => handleDeleteProgress(new Date(entry))}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete Progress Entry"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-32 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        Delete Progress Entry
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-xs ml-4 text-orange-400">No progress recorded yet</li>
                    )}
                </ul>
            )}
        </div>
    );
}

