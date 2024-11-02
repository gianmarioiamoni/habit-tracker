import { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import 'chart.js/auto';


interface ChartDataProps {
    data: any;
}

export default function ProgressChart({ data }: ChartDataProps): JSX.Element {

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
        <div className="chart-container bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-8 text-center">Habit Progress Chart</h2>
            <div className="relative h-64">
                <Bar data={chartData} options={chartOptions as ChartOptions<'bar'>} />
            </div>
        </div>
    )
}