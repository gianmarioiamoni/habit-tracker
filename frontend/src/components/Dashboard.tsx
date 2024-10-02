import { useQuery } from 'react-query';
import api from '../services/api'; // Axios service

const Dashboard: React.FC = () => {
    const { data, error, isLoading } = useQuery('userData', async () => {
        const response = await api.get('/protected-route');
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
