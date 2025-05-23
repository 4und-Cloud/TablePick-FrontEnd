import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_TABLE_PICK_API_URL || "http://localhost:8080",
})

export default api


// import axios from "axios";
//
// const api = axios.create({
//     baseURL: process.env.REACT_APP_TABLE_PICK_API_URL,
// });
//
// export default api;
