import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',  // Uses .env or proxy (from earlier setup)
});

// User endpoints
api.createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;  // Returns created user (e.g., { id, email })
  } catch (error) {
    throw error.response?.data || 'Error creating user';  // Throws backend error (e.g., "Email already registered")
  }
};

api.updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;  // Returns updated user or NoContent (handle as needed)
  } catch (error) {
    throw error.response?.data || 'Error updating user';
  }
};

export default api;