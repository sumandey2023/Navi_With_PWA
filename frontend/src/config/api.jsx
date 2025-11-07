import axios from "axios";
import baseUrl from "./baseUrl";

const url = `${baseUrl}/api`;

const api = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
