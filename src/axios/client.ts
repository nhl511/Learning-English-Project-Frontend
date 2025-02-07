import axios from "axios";

export const apiCaller = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    timeout: 10 * 1000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiCaller.interceptors.response.use(
    response => response.data,
    error => error?.response?.data,
);