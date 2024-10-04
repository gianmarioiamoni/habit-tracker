import { Habit } from "../../interfaces/Habit";

interface HabitListItemProps {
    habit: Habit;
}

/**
 * A single item in the list of habits.
 *
 * @returns A JSX element representing a single habit item.
 */
export default function HabitListItem({ habit }: HabitListItemProps): JSX.Element {
    return (
        <li
            key={habit._id}
            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
        >
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
                <p className="text-gray-600">{habit.description}</p>
                <sub className="text-gray-500">Frequency: {habit.frequency}</sub>
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
    )
}