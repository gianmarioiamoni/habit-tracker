import { format } from "date-fns";
import { Habit } from "../../../interfaces/Habit";

interface HabitListItemProgressListProps {
    habit: Habit;
    handleDeleteProgress: (entryDate: Date) => void; // Funzione per gestire la cancellazione
}

export default function HabitListItemProgressHistory({
    habit,
    handleDeleteProgress,
}: HabitListItemProgressListProps): JSX.Element {
    return (
        <div className="mt-4">
            <sub className="text-gray-800 font-semibold">Progress History:</sub>
            <ul className="list-disc ml-4 text-gray-600">
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
        </div>
    );
}
