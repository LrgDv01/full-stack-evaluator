import { useState, useEffect, useCallback, useRef } from 'react';
import { taskService } from '../api/taskService';

/* -------------------------------------------
 - initial `loading` used only for first load
 - `syncing` used for background operations (create/update/delete/reorder/toggle)
 - optimistic updates for better UX (revert on failure)
 ------------------------------------------- */
export function useTaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);   // initial load
  const [syncing, setSyncing] = useState(false);  // background operations
  const [error, setError] = useState(null);

  const mountedRef = useRef(false);

  // Refresh: Async fetch with loading/syncing states
  const refresh = useCallback(async () => {
    try {
      if (!mountedRef.current) {
        // initial load
        setLoading(true);
      } else {
        // background refresh
        setSyncing(true);
      }
      const data = await taskService.getAll();
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
      console.error('refresh tasks error', err);
    } finally {
      if (!mountedRef.current) {
        setLoading(false);
        //  setTimeout(() => {
        //     setLoading(false);
        //   }, 100); // delay for 0.5 second (500 ms)
        mountedRef.current = true;
      } else {
        setSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ---------------------------
     CRUD operations (optimistic)
     - create: append locally then confirm with API
     - update: patch locally then confirm
     - remove: remove locally then confirm
     - reorder: update local order and send to server
     - toggle: flip locally then send to server
     All revert on failure.
  ----------------------------*/

  const create = async (title, userId, description) => {
    setSyncing(true);
    const dto = {
      title: title.trim(),
      description: description?.trim() || null,
      isCompleted: false,
      userId,
      order: tasks.length ? Math.max(...tasks.map((t) => t.order ?? 0)) + 1 : 0,
    };
    // Optimistic: Temp ID for immediate UI add
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...dto, id: tempId };
    setTasks((prev) => [optimistic, ...prev]);

    try {
      const created = await taskService.create(dto);
      const payload = created?.data ?? created;

      if (payload) {
        // replace temp with server result
        setTasks((prev) => prev.map((t) => (t.id === tempId ? payload : t)));
        return payload;
      } else {
        // server returned 204 or empty — best effort: refresh from server
        await refresh();
        return optimistic; // return optimistic item if caller expects something
      }
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      console.error('create task failed', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const update = async (id, updates) => {
    setSyncing(true);
    const prevTasks = tasks;
    // optimistic local update
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      const updated = await taskService.update(id, updates);
      const payload = updated?.data ?? updated;

      if (payload) {
        // server returned updated object -> replace optimistic with payload
        setTasks((cur) => cur.map((t) => (t.id === id ? payload : t)));
        return payload;
      } else {
        // server returned 204 No Content -> keep the optimistic merged version
        // find the optimistic item and return it
        const optimistic = (tasks.find((t) => t.id === id) || {}).id === id
          ? { ...updates, id } // fallback merged
          : (prevTasks.find((t) => t.id === id) || { id, ...updates });

        // ensure state contains merged object
        setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...updates } : t)));
        return optimistic;
      }
    } catch (err) {
      // revert on failure
      setTasks(prevTasks);
      console.error('update task failed', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };


  const remove = async (id) => {
    const prev = tasks;
    // optimistic remove
    setTasks((cur) => cur.filter((t) => t.id !== id));
    setSyncing(true);
    try {
      await taskService.delete(id);
      return true;
    } catch (err) {
      // revert
      setTasks(prev);
      console.error('delete task failed', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const reorder = async (newList) => {
    // newList is array of tasks (ordered). We optimistically set order indexes locally.
    const prev = tasks;
    setTasks(newList.map((t, idx) => ({ ...t, order: idx })));
    setSyncing(true);
    try {
      const updates = newList.map((t, idx) => ({ id: t.id, order: idx }));
      await taskService.reorder(updates);
      return true;
    } catch (err) {
      setTasks(prev);
      console.error('reorder failed', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  const toggle = async (idOrTask) => {
    const id = typeof idOrTask === 'object' && idOrTask !== null ? idOrTask.id : idOrTask;
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      // If not found, attempt a refresh
      await refresh();
      return;
    }
    const prev = tasks;
    const newVal = !task.isCompleted;
    // optimistic toggle
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, isCompleted: newVal } : t)));
    setSyncing(true);
    try {
      await taskService.toggle(id, newVal);
      return true;
    } catch (err) {
      setTasks(prev);
      console.error('toggle failed', err);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  return {
    tasks,
    loading,
    syncing,
    error,
    create,
    update,
    remove,
    reorder,
    toggle,
    refresh, // manual refresh when you want guaranteed server state
  };
}










