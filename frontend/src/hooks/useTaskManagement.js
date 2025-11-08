// src/hooks/useTaskManagement.js
import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../api/taskService';

export function useTaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable refresh – no external onRefresh dependency
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load only
  useEffect(() => {
    refresh();
  }, [refresh]);

  // ----- CRUD helpers (all call refresh at the end) -----
  const create = async (title, userId, description) => {
    const dto = {
      title: title.trim(),
      description: description?.trim() || null,
      isCompleted: false,
      userId,
      order: Math.max(...tasks.map(t => t.order), -1) + 1,
    };
    await taskService.create(dto);
    await refresh();
  };

  const update = async (id, updates) => {
    try {
      // Ensure required fields are present
      if (!updates.userId) {
        throw new Error('Task update requires userId');
      }
      
      await taskService.update(id, {
        userId: updates.userId,
        title: updates.title,
        description: updates.description,
        isCompleted: updates.isCompleted ?? false,
        order: updates.order ?? 0
      });
      
      await refresh();
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err; // Re-throw to let component handle UI feedback
    }
  };

  const remove = async (id) => {
    await taskService.delete(id);
    await refresh();
  };

  const reorder = async (newList) => {
    const updates = newList.map((t, idx) => ({ id: t.id, order: idx }));
    await taskService.reorder(updates);
    await refresh();
  };

  // Accept either an id or a task object for convenience and add a defensive check
  const toggle = async (idOrTask) => {
    const id = (typeof idOrTask === 'object' && idOrTask !== null) ? idOrTask.id : idOrTask;
    const task = tasks.find(t => t.id === id);
    if (!task) {
      // If task is not found, avoid throwing and log a helpful message
      // Caller may call toggle during a stale render – refresh instead
      console.warn('toggle: task not found for id', id);
      await refresh();
      return;
    }

    await taskService.toggle(id, !task.isCompleted);
    await refresh();
  };

  return {
    tasks,
    loading,
    error,
    create,
    update,
    remove,
    reorder,
    toggle,
    refresh, // expose if caller wants manual refresh
  };
}