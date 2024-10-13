import axios from "axios";

// Axios client

const api = axios.create({
  baseURL: "/", 
  withCredentials: true, // Automatically send cookies with requests
});

export default api;
