import { format } from 'date-fns';

import { Habit } from '../../../interfaces/Habit';

interface HabitListItemShowFormProps {
    habit: Habit
}

export default function HabitListItemShowForm({ habit }: HabitListItemShowFormProps): JSX.Element {
    return (
        <form>
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
        </form>
    )
}