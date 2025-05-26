import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_TABLE_PICK_API_URL,
})

export default api


