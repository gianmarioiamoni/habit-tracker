import { useQuery } from 'react-query';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getDashboardData } from '../../services/habitServices';
import { useMessage } from '../../contexts/MessageContext';
import 'chart.js/auto';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HabitsDashboard(): JSX.Element {
    const { data, error, isLoading } = useQuery('dashboardData', getDashboardData);

    const { setErrorMessage, setInfoMessage } = useMessage();

    if (isLoading) {
        setInfoMessage("Loading dashboard...");
        return <></>;
    }

    if (error) {
        setErrorMessage("An error occurred while fetching dashboard data: " + error);
        return <></>;
    }

    const chartData = {
        labels: data.mostFrequentHabit.map((habit: any) => habit.title),
        datasets: [
            {
                label: 'Completions',
                data: data.mostFrequentHabit.map((habit: any) => habit.progress.length),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'Most Frequent Habits'
            },
        },
    };

    return (
        <div className="dashboard container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Statistics Section */}
                <div className="statistics bg-gray-100 rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-12 text-center">Your Habit Dashboard</h1>
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

                {/* Chart Section */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-12 text-center">Habit Progress Chart</h2>
                    <div className="relative h-64">
                        <Bar data={chartData} options={chartOptions as ChartOptions<'bar'>} />
                    </div>
                </div>
            </div>
        </div>
    );
}
