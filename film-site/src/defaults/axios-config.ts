import axios from "axios";

const BASE_URL = "http://localhost:4941/api/v1";
const apiClient = () => {
    const defaultOptions = {
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": setAuth(),
        }
    };

    return axios.create(defaultOptions);
};

const setAuth = () => {
    return localStorage.getItem("X-Authorization") ? localStorage.getItem("X-Authorization") : '';
}

export default apiClient();