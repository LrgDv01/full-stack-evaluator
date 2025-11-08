import api from './axios';

export const taskService = {
  getAll: async () => (await api.get('/tasks')).data,
  create: async (dto) => (await api.post('/tasks', dto)).data,
  update: async (id, dto) => (await api.put(`/tasks/${id}`, dto)).data,
  delete: async (id) => api.delete(`/tasks/${id}`),
  reorder: async (updates) => api.patch('/tasks/reorder', updates),
  toggle: async (id, isCompleted) => (await api.patch(`/tasks/${id}/toggle`, isCompleted)).data,
};

