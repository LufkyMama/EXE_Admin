import axios from "axios";

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL 
  : "/api";      

export const api = axios.create({
    baseURL,
    withCredentials: false,
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// log lỗi cơ bản
api.interceptors.response.use(
  (r) => r,
  (err) => { console.error("[API ERROR]", err?.response); throw err; }
);

export default api;