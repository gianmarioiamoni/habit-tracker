import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartOptions, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getDashboardData } from '../../services/habitServices';
import { useToast} from '../../contexts/ToastContext';
import 'chart.js/auto';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HabitsDashboard(): JSX.Element {
    const [timeFilter, setTimeFilter] = useState('7'); // Default filter: Last 7 days
    const { showInfo, showError } = useToast();

    // Fetch data based on the selected time filter
    const { data, error, isLoading } = useQuery(['dashboardData', timeFilter], () => getDashboardData(timeFilter));

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeFilter(event.target.value);
    };

    // useEffects to show messages after the rendering
    useEffect(() => {
        if (isLoading) {
            showInfo("Loading dashboard...");
        }
    }, [isLoading, showInfo]);

    useEffect(() => {
        if (error) {
            showError("An error occurred while fetching dashboard data: " + error);
        }
    }, [error, showError]);

    // Verify if data is available and if there is the property `mostFrequentHabit`
    if (!data || !data.mostFrequentHabit) {
        return <p>No data available for the selected period.</p>;
    }

    // Chart Data Configuration
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
            {/* Filtro per il periodo di tempo */}
            <div className="mb-8 flex justify-end">
                <label htmlFor="timeFilter" className="mr-2 font-semibold">Filter by:</label>
                <select
                    id="timeFilter"
                    value={timeFilter}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg p-2">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="all">All time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Statistics Section */}
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

                {/* Chart Section */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-8 text-center">Habit Progress Chart</h2>
                    <div className="relative h-64">
                        <Bar data={chartData} options={chartOptions as ChartOptions<'bar'>} />
                    </div>
                </div>
            </div>
        </div>
    );
}

