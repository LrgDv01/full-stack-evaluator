import api from './axios';

// GET /users → returns UserResponse[] (no password hash)
export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

// POST /users → UserDto (plain password) → returns created user (no hash)
export const createUser = async (user) => {
  const res = await api.post('/users', user);
  return res.data;
};

// PUT /users/{id} → partial UserDto (password optional)
export const updateUser = async (id, user) => {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
};

// DELETE /users/{id} → cascades task removal (hard-delete)
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
