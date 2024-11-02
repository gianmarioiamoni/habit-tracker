import api from "./api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getDashboardData = async (timeFilter: string) => {
  const response = await api.get(
    `${API_URL}/habits/dashboard?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const getDailyProgressData = async (
  timeFilter: string
): Promise<Record<string, number>> => {
  try {
    const response = await api.get(
      `${API_URL}/habits/dashboard/daily-progress?timeFilter=${timeFilter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching daily progress data:", error);
    throw error;
  }
};

export async function getWeeklyOrMonthlyProgressData(timeFilter: string) {
  // Supponi che la tua API accetti un parametro timeFilter per ottenere i dati
  const response = await api.get(
    `${API_URL}/habits/dashboard/weekly-or-monthly-progress?timeFilter=${timeFilter}`
  );
  return response.data;
}
