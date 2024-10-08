import { format } from "date-fns";

import { frequencyOptions } from "../../../utils/frequencyOptions";

import {Habit} from "../../../interfaces/Habit";

interface HabitListItemEditFormProps {
    editedHabit: Habit;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} 

export default function HabitListItemEditForm(
    { editedHabit, handleInputChange, handleDateChange }: HabitListItemEditFormProps
): JSX.Element {
    return (
            <form>
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
            </form>
    )
}