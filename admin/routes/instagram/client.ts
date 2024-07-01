import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://api.instagram.com',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

export default axiosClient;