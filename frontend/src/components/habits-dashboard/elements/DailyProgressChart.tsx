import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useToast } from '../../../contexts/ToastContext';

import 'chart.js/auto';

import { getDailyProgressData } from '../../../services/habitServices';


interface DailyProgressChartProps {
    timeFilter: string
}

export default function DailyProgressChart({ timeFilter }: DailyProgressChartProps): JSX.Element {
    const { showInfo, showError } = useToast();

    // Query for daily progress data 
    const { data: dailyProgress, error: progressError, isLoading: isProgressLoading } = useQuery(
        ['dailyProgress', timeFilter],
        () => getDailyProgressData(timeFilter)
    );

    useEffect(() => {
        if (isProgressLoading) {
            showInfo("Loading daily progress data...");
        }
    }, [isProgressLoading, showInfo]);

    useEffect(() => {
        if (progressError) {
            showError("An error occurred while fetching daily progress data: " + progressError);
        }
    }, [progressError, showError]);

    if (!dailyProgress) {
        return <p>No data available for the selected period.</p>;
    }

    // DATA TRANSFORMATION FOR CHARTS
    // dailyProgress is an object {data: count} where data is the date and count is the number of completions
    // It must be transformed in an array of objects {_id: date, count: count}
    const dailyProgressArray = Object.entries(dailyProgress).map(([date, count]) => ({ _id: date, count }));

    // daily chart data configuration 
    const dailyChartData = {
        labels: dailyProgressArray && Array.isArray(dailyProgressArray) ? dailyProgressArray.map((item: { _id: any; }) => item._id) : [],
        datasets: [
            {
                label: 'Daily Completions',
                data: dailyProgressArray && Array.isArray(dailyProgressArray) ? dailyProgressArray.map((item: { count: any; }) => item.count) : [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                tension: 0.1,
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 10
            },
        ],
    };

    const dailyChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Daily Habit Progress',
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Date' },
            },
            y: {
                title: { display: true, text: 'Completions' },
                beginAtZero: true,
            },
        },
    };


    return (
        <div className="chart-container bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-8 text-center">Daily Progress Chart</h2>
            <div className="relative h-64">
                <Line data={dailyChartData} options={dailyChartOptions} />
                {/* <Scatter data={dailyChartData} options={dailyChartOptions} /> */}
            </div>
        </div>
    )
}