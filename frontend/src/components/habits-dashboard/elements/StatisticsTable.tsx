interface StatisticsTableProps {
    data: any
}

export default function StatisticsTable({ data }: StatisticsTableProps): JSX.Element {

    if (!data) {
        return <p>No data available for the selected period.</p>;
    }

    return (
        <div className="statistics bg-gray-100 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Habit Dashboard</h1>
            <div className="text-lg space-y-4">
                <p className="text-blue-600"><strong>Total Habits:</strong> {data.totalHabits}</p>
                <p className="text-blue-600"><strong>Total Days Completed:</strong> {data.totalDaysCompleted}</p>
            </div>

            <h2 className="text-xl font-semibold my-6">Most Frequent Habits</h2>
            <ul className="list-disc pl-8 space-y-2">
                {data.mostFrequentHabit.map((habit: any) => (
                    <li key={habit._id} className="mb-2">
                        <strong>{habit.title}</strong> - {habit.progress.length} completions
                    </li>
                ))}
            </ul>
        </div>
    )
}