import { useState, useEffect } from 'react';
import api from '../api/axios.js';

export function useTaskManagement(propTasks = [], onRefresh) {
  const [tasks, setTasks] = useState(propTasks);
  const [loading, setLoading] = useState(!propTasks.length);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (propTasks.length > 0) {
      setTasks(propTasks);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError(err.response?.data?.title || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [propTasks]);

  const createTask = async (title, userId) => {
    if (!title.trim() || !userId) return;
    try {
      const maxOrder = Math.max(...tasks.map(t => t.order || 0), -1);
      await api.post('/tasks', {
        title: title.trim(),
        isDone: false,
        userId,
        order: maxOrder + 1
      });
      onRefresh?.();
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const updateTask = async (task, updates) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, ...updates });
      onRefresh?.();
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      onRefresh?.();
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const updateTaskOrder = async (newTasks) => {
    try {
      await Promise.all(
        newTasks.map((task, idx) =>
          api.put(`/tasks/${task.id}`, { ...task, order: idx })
        )
      );
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    tasks,
    loading,
    error,
    editingTask,
    setEditingTask,
    newTitle,
    setNewTitle,
    createTask,
    updateTask,
    deleteTask,
    updateTaskOrder
  };
}