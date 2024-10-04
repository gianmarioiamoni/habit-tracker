import axios from "axios";

import api from "../services/api";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const createHabit = async (habitData: any) => {
  const response = await axios.post(`${API_URL}/habits`, habitData);
  return response.data;
};

export const getHabits = async () => {
    //   const response = await axios.get(`${API_URL}/habits`);
  const response = await api.get('http://localhost:5000/habits');
  return response.data;
};

export const updateHabit = async (habitId: string, habitData: any) => {
  const response = await axios.put(`${API_URL}/habits/${habitId}`, habitData);
  return response.data;
};

export const deleteHabit = async (habitId: string) => {
  const response = await axios.delete(`${API_URL}/habits/${habitId}`);
  return response.data;
};
