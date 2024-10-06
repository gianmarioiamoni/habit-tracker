import axios from "axios";

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
//   const response = await axios.delete(`${API_URL}/habits/${habitId}`);
  const response = await api.delete(`${API_URL}/habits/${habitId}`);
  return response.data;
};
