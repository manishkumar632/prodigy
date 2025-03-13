import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/token/`, { username, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};

export const getAccessToken = () => localStorage.getItem("access");
