import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_TABLE_PICK_API_URL,
});

export default api;