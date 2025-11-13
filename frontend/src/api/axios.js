import axios from 'axios';

const api = axios.create({
  baseURL: '/api',               // Proxy to backend in dev (Vite proxy) – no CORS in prod
  timeout: 10_000,              // 10 s – protects UI from hanging on slow network
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global error logger – helps surface API quirks during dev without crashing UI
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;