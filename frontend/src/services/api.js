// URL base de tu backend
export const BASE_URL = "http://localhost:3000/";

// Helper de Axios
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
