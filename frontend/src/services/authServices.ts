import axios from "axios";

const API_URL = "http://localhost:5000/auth";

export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
},
) => {
  const response = await axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true, 
  });
  return response.data;
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = () => {
    
};
