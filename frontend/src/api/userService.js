// frontend/src/api/userService.js
import api from './axios';

export const fetchUsers = async () => {
  const res = await api.get('/api/users');
  return res.data;
};

export const createUser = async (user) => {
  const res = await api.post('/api/users', user);
  return res.data;
};