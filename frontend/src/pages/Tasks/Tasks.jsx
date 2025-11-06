// src/pages/Tasks/Tasks.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from '../../components/Buttons/Button';
import UserForm from '../../components/UserForm';
import Modal from '../../components/modals/modal';
import { Search, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

function Tasks({ tasks: propTasks = [], onRefresh }) {
  const [tasks, setTasks] = useState(propTasks);
  const [loading, setLoading] = useState(!propTasks.length);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Will hold user from UserForm

  // Fetch tasks only if not passed from parent
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

  // Filter tasks by search
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create task
  const createTask = async (title) => {
    if (!title.trim()) return;
    if (!currentUser) return alert('Please create a user first.');

    try {
      await api.post('/tasks', {
        title,
        isDone: false,
        userId: currentUser.id,
      });
      setShowCreateModal(false);
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Failed to create: ' + (err.response?.data?.title || err.message));
    }
  };

  // Update task
  const updateTask = async (task, updates) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, ...updates });
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.title || err.message));
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      onRefresh?.() || window.location.reload();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.title || err.message));
    }
  };

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;
  if (error) return <div className="text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Tasks
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* UserForm + Create Button */}
      <div className="flex justify-between items-center mb-6">
        <UserForm onSuccess={(user) => { setCurrentUser(user); onRefresh?.(); }} />
        <Button
          label={<><Plus className="inline h-5 w-5 mr-1" /> Add Task</>}
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm ? 'No matching tasks.' : 'No tasks yet. Create one!'}
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Toggle */}
                <button
                  onClick={() => updateTask(task, { isDone: !task.isDone })}
                  className="text-xl"
                >
                  {task.isDone ? 'Completed' : 'Pending'}
                </button>

                {/* In-place Edit */}
                {editingTask?.id === task.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateTask(task, { title: newTitle });
                      setEditingTask(null);
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 px-3 py-1 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button type="submit" className="text-green-600">
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex-1">
                    <span
                      className={`text-lg font-medium ${
                        task.isDone ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="block text-sm text-gray-500">
                      by {task.user?.email || 'Unknown'}
                    </span>
                  </div>
                )}

                {/* Edit Button */}
                {editingTask?.id !== task.id && (
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setNewTitle(task.title);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Edit2 className="h-5 w-5 text-indigo-600" />
                  </button>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const title = e.target.title.value;
              createTask(title);
            }}
            className="space-y-4"
          >
            <input
              name="title"
              type="text"
              placeholder="Task title..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                label="Cancel"
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-300 text-gray-700"
              />
              <Button type="submit" label="Create" />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Tasks;