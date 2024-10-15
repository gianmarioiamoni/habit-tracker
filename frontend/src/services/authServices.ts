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

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`, {
      withCredentials: true, 
    });
    return { user: response.data.user, error: null }; 
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        user: null,
        // error: error.response ? error.response.data.message : "Unknown error",
        error: "Authentication error",
      };
    } else {
      return {
        user: null,
        error: "Unknown error",
      };
    }
  }
};

export const logout = async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};
