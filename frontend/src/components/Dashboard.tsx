import { useQuery } from 'react-query';
import api from '../services/api'; // Axios service

// const Dashboard: React.FC = () => {
    function Dashboard(): JSX.Element {
    
    const { data, error, isLoading } = useQuery('userData', async () => {
        const response = await api.get('http://localhost:5000/habits');
        return response.data;
    });

    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <p>Data: {JSON.stringify(data)}</p>
        </div>
    );
};

export default Dashboard;
