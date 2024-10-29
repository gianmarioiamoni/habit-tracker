import api from "../services/api";

import { Habit } from "../interfaces/Habit";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const createHabit = async (habitData: any) => {
  const response = await api.post(`${API_URL}/habits`, habitData);
  return response.data;
};

export const getHabits = async () => {
  const response = await api.get(`${API_URL}/habits`);
  return response.data;
};

export const updateHabit = async (habit: Habit) => {
  const response = await api.put(`${API_URL}/habits/${habit._id}`, habit);
  return response.data;
};

export const deleteHabit = async (habitId: string) => {
  const response = await api.delete(`${API_URL}/habits/${habitId}`);
  return response.data;
};

export const completeHabit = async (habitId: string) => {
  const response = await api.put(`${API_URL}/habits/${habitId}/complete`);
  return response.data;
};

export const getDashboardData = async (timeFilter: string) => {
  const response = await api.get(
    `${API_URL}/habits/dashboard?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const getDailyProgressData = async (timeFilter: string): Promise<Record<string, number>> => {
  try {
    const response = await api.get(
      `${API_URL}/habits/dashboard/daily-progress?timeFilter=${timeFilter}`,
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