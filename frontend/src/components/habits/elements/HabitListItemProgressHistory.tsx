import { format } from "date-fns";

import { Habit } from "../../../interfaces/Habit";

interface HabitListItemProgressListProps {
    habit: Habit
}

export default function HabitListItemProgressHistory({ habit }: HabitListItemProgressListProps ): JSX.Element {
    return (
        <div className="mt-4">
            <sub className="text-gray-800 font-semibold">Progress History:</sub>
            <ul className="list-disc ml-4 text-gray-600">
                {habit.progress && habit.progress.length > 0 ? (
                    habit.progress.map((entry, index) => (
                        <li key={index} className="text-xs ml-4">
                            {format(new Date(entry), "dd-MM-yyyy")}
                        </li>
                    ))
                ) : (
                    <li>No progress recorded yet</li>
                )}
            </ul>
        </div>
    )
}