import { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import 'chart.js/auto';


interface CompletionChartProps {
    data: any;
}
export default function CompletionChart({ data }: CompletionChartProps): JSX.Element {

    // Completion Chart data configuration
    const pieChartData = {
        labels: ['Completed Habits', 'Active Habits'],
        datasets: [
            {
                data: [
                    data?.totalDaysCompleted || 0,
                    (data?.totalHabits || 0) - (data?.totalDaysCompleted || 0),
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Percentage of Completed vs. Active Habits' },
        },
    };

    return (
        <div className="chart-container bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-8 text-center">Completion Percentage</h2>
            <div className="relative h-64">
                <Pie data={pieChartData} options={pieChartOptions} />
            </div>
        </div>
    )
}