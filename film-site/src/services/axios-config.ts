import axios from "axios";

const BASE_URL = "https://seng365.csse.canterbury.ac.nz/api/v1";
const apiClient = () => {
    const defaultOptions = {
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
        }
    };

    return axios.create(defaultOptions);
};

export default apiClient();