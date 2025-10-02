import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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