import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Chart, ChartOptions, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Scatter } from 'react-chartjs-2';

import { getDashboardData } from '../../services/habitServices';
import { useToast } from '../../contexts/ToastContext';
import 'chart.js/auto';

import { getDailyProgressData, getWeeklyOrMonthlyProgressData } from '../../services/habitServices'; 


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function HabitsDashboard(): JSX.Element {
    const [timeFilter, setTimeFilter] = useState('7'); // Default: ultimi 7 giorni
    const { showInfo, showError } = useToast();


    // Fetch data based on the selected time filter
    const { data, error, isLoading } = useQuery(['dashboardData', timeFilter], () => getDashboardData(timeFilter));

    // Query per i dati di progresso giornaliero
    const { data: dailyProgress, error: progressError, isLoading: isProgressLoading } = useQuery(
        ['dailyProgress', timeFilter],
        () => getDailyProgressData(timeFilter)
    );
    console.log("dailyProgress:", dailyProgress);

    // Query per i dati di progresso settimanale o mensile
    const { data: weeklyOrMonthlyProgress, error: weeklyOrMonthlyProgressError, isLoading: isWeeklyOrMonthlyProgressLoading } = useQuery(
        ['weeklyOrMonthlyProgress', timeFilter],
        () => getWeeklyOrMonthlyProgressData(timeFilter)
    );

    // Filtering handler
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

    // Verify if data is available and if there is the property `mostFrequentHabit`
    if (!data || !data.mostFrequentHabit) {
        return <p>No data available for the selected period.</p>;
    }

    if (!dailyProgress || !weeklyOrMonthlyProgress) {
        return <p>No data available for the selected period.</p>;
    }

    console.log("weeklyOrMonthlyProgress:", weeklyOrMonthlyProgress);

    // DATA TRANSFORMATION FOR CHARTS
    // dailyProgress is an object {data: count} where data is the date and count is the number of completions
    // It must be transformed in an array of objects {_id: date, count: count}
    const dailyProgressArray = Object.entries(dailyProgress).map(([date, count]) => ({ _id: date, count }));
    console.log("dailyProgressArray:", dailyProgressArray);

    // weeklyOrMonthlyProgress is an array of objects {period: date, habits: [{_id: id, count: count}]} where period is the date and habits is an array of objects {_id: id, count: count}
    // It must be tranformed in an array of objects {period: date, habits: {_id: id, count: [count]} where period is the date and habits is an object {_id: id, count: [count]} where _id is the id and count is an array of count}
    
    const weeklyOrMonthlyProgressArray = weeklyOrMonthlyProgress.map(
        ({ period, habits }: { period: string; habits: { _id: string; count: number }[] }) => ({
            period,
            counts: habits.map(({ _id, count }) => count) 
        })
    );
    console.log("weeklyOrMonthlyProgressArray:", weeklyOrMonthlyProgressArray);

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
    console.log("dailyChartData:", dailyChartData);

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

    // Weekly or Monthly progress chart data configuration
    const weeklyOrMonthlyChartData = {
        labels: weeklyOrMonthlyProgressArray ? weeklyOrMonthlyProgressArray.map((item: any) => item.period) : [],
        datasets: weeklyOrMonthlyProgressArray ? weeklyOrMonthlyProgressArray.map((habitData: any, index: number) => ({
            label: `Weekly/Monthly`,  
            data: habitData.counts, /////// we suppose Counts is an array of countings per each period
            backgroundColor: `rgba(${(index * 50) % 255}, 99, 132, 0.6)`,
            borderColor: `rgba(${(index * 50) % 255}, 99, 132, 1)`,
            borderWidth: 1,
        })) : []
    };
    console.log("weeklyOrMonthlyChartData:", weeklyOrMonthlyChartData);

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

    // Pie Chart data configuration
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
        <div className="dashboard container mx-auto px-4 py-10">
            {/* Time period filter */}
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

            {/* CHARTS SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Statistics section */}
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

                {/* Progress Chart Section */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-8 text-center">Habit Progress Chart</h2>
                    <div className="relative h-64">
                        <Bar data={chartData} options={chartOptions as ChartOptions<'bar'>} />
                    </div>
                </div>

                {/* Pie Chart section for completion percentage */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-8 text-center">Completion Percentage</h2>
                    <div className="relative h-64">
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>

                {/* Daily Chart section */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-8 text-center">Daily Progress Chart</h2>
                    <div className="relative h-64">
                        <Line data={dailyChartData} options={dailyChartOptions} />
                        {/* <Scatter data={dailyChartData} options={dailyChartOptions} /> */}
                    </div>
                </div>

                {/* Weekly or Monthly Chart section */}
                <div className="chart-container bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-8 text-center">Weekly/Monthly Progress Chart</h2>
                    <div className="relative h-64">
                        <Bar data={weeklyOrMonthlyChartData} options={weeklyOrMonthlyChartOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
}