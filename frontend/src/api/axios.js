import axios from 'axios';

const api = axios.create({
  baseURL: '/api',               // <-- ONLY HERE
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: global error interceptor (nice for dev)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;