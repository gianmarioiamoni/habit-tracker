import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import { getDashboardData } from '../../services/habitServices';
import { useToast } from '../../contexts/ToastContext';
import 'chart.js/auto';

import DailyProgressChart from './elements/DailyProgressChart';
import ProgressChart from './elements/ProgressChart';
import CompletionChart from './elements/CompletionChart';
import WeeklyOrMonthlyProgressChart from './elements/WeeklyOrMonthlyProgressChart';
import StatisticsTable from './elements/StatisticsTable';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function HabitsDashboard(): JSX.Element {
    const [timeFilter, setTimeFilter] = useState('7'); // Default: last 7 days 
    const { showInfo, showError } = useToast();


    // Fetch data based on the selected time filter
    const { data, error, isLoading } = useQuery(['dashboardData', timeFilter], () => getDashboardData(timeFilter));

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
                <StatisticsTable data={data} />

                {/* Progress Chart Section */}
                <ProgressChart data={data} />

                {/* Pie Chart section for completion percentage */}
                <CompletionChart data={data} />

                {/* Daily Chart section */}
                <DailyProgressChart timeFilter={timeFilter} />

                {/* Weekly or Monthly Chart section */}
                <WeeklyOrMonthlyProgressChart timeFilter={timeFilter} />

            </div>
        </div>
    );
}