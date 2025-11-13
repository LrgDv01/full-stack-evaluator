import api from './axios';

export const taskService = {
  getAll: async () => (await api.get('/tasks')).data,   // GET /tasks → returns TaskResponse[]
  create: async (dto) => (await api.post('/tasks', dto)).data,   // POST /tasks → expects TaskItemDto, returns created TaskResponse
  update: async (id, dto) => (await api.put(`/tasks/${id}`, dto)).data,  // PUT /tasks/{id} → full replacement with TaskItemDto    
  delete: async (id) => api.delete(`/tasks/${id}`), // DELETE /tasks/{id} → no body, 204 NoContent expected
  reorder: async (updates) => api.patch('/tasks/reorder', updates), // PATCH /tasks/reorder → array of TaskOrderUpdateDto
  toggle: async (id, isCompleted) => (await api.patch(`/tasks/${id}/toggle`, isCompleted)).data, // PATCH /tasks/{id}/toggle → raw bool in body
};

