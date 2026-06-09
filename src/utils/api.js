import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-management-backend-nine.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
