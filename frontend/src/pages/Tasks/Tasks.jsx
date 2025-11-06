// src/pages/Tasks/Tasks.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from '../../components/Buttons/Button';
import UserForm from '../../components/UserForm';

function Tasks({ tasks: propTasks = [], onRefresh }) {
  // Local state only if no tasks passed from App (fallback)
  const [tasks, setTasks] = useState(propTasks);
  const [loading, setLoading] = useState(!propTasks.length);
  const [error, setError] = useState(null);

  // Only fetch if we didn't receive tasks from parent
  useEffect(() => {
    if (propTasks.length > 0) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError('Failed to fetch tasks: ' + (err.response?.data?.title || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [propTasks]);

  // Create new task
  const createTask = async (title) => {
    if (!title.trim()) return alert('Title is required');

    try {
      // First ensure a user exists (you'll have a current user later)
      // For now, assume userId = 1 exists (create via UserForm first)
      const payload = { title, isDone: false, userId: 1 };
      await api.post('/tasks', payload);
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Failed to create task: ' + (err.response?.data?.title || err.message));
    }
  };

  // Toggle task completion
  const toggleTask = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        isDone: !task.isDone,
      });
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Failed to update task: ' + (err.response?.data?.title || err.message));
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Failed to delete task: ' + (err.response?.data?.title || err.message));
    }
  };

  if (loading) return <p className="text-center">Loading tasks...</p>;
  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* UserForm stays at top — creates users needed for tasks */}
      <UserForm onSuccess={onRefresh} />

      <h1 className="p-4 m-5 text-3xl font-bold text-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        Tasks
      </h1>

      <div className="p-6 m-5 bg-white rounded-xl border-2 border-gray-300 shadow-lg">
        {tasks.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No tasks yet. Create a user first, then add a task!
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task)}
                    className="text-2xl"
                    aria-label={task.isDone ? 'Mark undone' : 'Mark done'}
                  >
                    {task.isDone ? 'Completed' : 'Pending'}
                  </button>
                  <span
                    className={`text-lg ${
                      task.isDone ? 'line-through text-gray-500' : 'font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Task Button */}
      <div className="flex justify-center mt-6">
        <Button
          label="Add Task"
          onClick={() => {
            const title = prompt('Enter task title:');
            if (title) createTask(title);
          }}
        />
      </div>
    </div>
  );
}

export default Tasks;