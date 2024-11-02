import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { useToast } from '../../../contexts/ToastContext';
import 'chart.js/auto';

import { getWeeklyOrMonthlyProgressData } from '../../../services/habitServices';

interface WeeklyOrMonthlyProgressChartProps {
    timeFilter: string
}
export default function WeeklyOrMonthlyProgressChart({ timeFilter }: WeeklyOrMonthlyProgressChartProps ): JSX.Element {
    const { showInfo, showError } = useToast();

    // Query for monthly or weekly progress
    const { data: weeklyOrMonthlyProgress, error: weeklyOrMonthlyProgressError, isLoading: isWeeklyOrMonthlyProgressLoading } = useQuery(
        ['weeklyOrMonthlyProgress', timeFilter],
        () => getWeeklyOrMonthlyProgressData(timeFilter)
    );

    useEffect(() => {
        if (isWeeklyOrMonthlyProgressLoading) {
            showInfo("Loading daily progress data...");
        }
    }, [isWeeklyOrMonthlyProgressLoading, showInfo]);

    useEffect(() => {
        if (weeklyOrMonthlyProgressError) {
            showError("An error occurred while fetching daily progress data: " + weeklyOrMonthlyProgressError);
        }
    }, [weeklyOrMonthlyProgressError, showError]);

    if (!weeklyOrMonthlyProgress) {
        return <p>No data available for the selected period.</p>;
    }

    // weeklyOrMonthlyProgress is an array of objects {period: date, habits: [{_id: id, count: count}]} where period is the date and habits is an array of objects {_id: id, count: count}
    // It must be tranformed in an array of objects {period: date, habits: {_id: id, count: [count]} where period is the date and habits is an object {_id: id, count: [count]} where _id is the id and count is an array of count}
    const weeklyOrMonthlyProgressArray = weeklyOrMonthlyProgress.map(
        ({ period, habits }: { period: string; habits: { _id: string; count: number }[] }) => ({
            period,
            counts: habits.map(({ _id, count }) => count)
        })
    );

    // Weekly or Monthly progress chart data configuration
    const weeklyOrMonthlyChartData = {
        labels: weeklyOrMonthlyProgressArray ? weeklyOrMonthlyProgressArray.map((item: any) => item.period) : [],
        datasets: weeklyOrMonthlyProgressArray ? weeklyOrMonthlyProgressArray.map((habitData: any, index: number) => ({
            label: `Weekly/Monthly`,
            data: habitData.counts,
            backgroundColor: `rgba(${(index * 50) % 255}, 99, 132, 0.6)`,
            borderColor: `rgba(${(index * 50) % 255}, 99, 132, 1)`,
            borderWidth: 1,
        })) : []
    };

    const weeklyOrMonthlyChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Weekly or Monthly Habit Completions' },
        },
        scales: {
            x: { stacked: false },
            y: { beginAtZero: true, stacked: false }
        }
    };


    return (
        <div className="chart-container bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-8 text-center">Weekly/Monthly Progress Chart</h2>
            <div className="relative h-64">
                <Bar data={weeklyOrMonthlyChartData} options={weeklyOrMonthlyChartOptions} />
            </div>
        </div> 
    );
}