// src/pages/Tasks/Tasks.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Button from '../../components/Buttons/Button';
import UserForm from '../../components/UserForm';
import Modal from '../../components/modals/modal.jsx';
import { 
  Search, Plus, Edit2, Trash2, Check, X, GripVertical, Moon, Sun 
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTaskItem({ task, onToggle, onEdit, onDelete, isEditing, newTitle, setNewTitle, onSaveEdit, onCancelEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-white rounded-xl border ${
        isDragging ? 'border-indigo-400 shadow-lg' : 'border-gray-200 shadow-sm'
      } hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Toggle */}
        <button onClick={() => onToggle(task)} className="text-xl">
          {task.isDone ? 'Completed' : 'Pending'}
        </button>

        {/* In-place Edit */}
        {isEditing ? (
          <form onSubmit={onSaveEdit} className="flex items-center gap-2 flex-1">
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
            <button type="button" onClick={onCancelEdit} className="text-red-600">
              <X className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="flex-1">
            <span className={`text-lg font-medium ${task.isDone ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            <span className="block text-sm text-gray-500">
              by {task.user?.email || 'Unknown'}
            </span>
          </div>
        )}

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 transition"
          >
            <Edit2 className="h-5 w-5 text-indigo-600" />
          </button>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition text-red-600"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

function Tasks({ tasks: propTasks = [], onRefresh }) {
  const [tasks, setTasks] = useState(propTasks);
  const [loading, setLoading] = useState(!propTasks.length);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved === 'true' : prefersDark;
    setDarkMode(initial);
    if (initial) document.documentElement.classList.add('dark');
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Fetch tasks
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

  // Filter tasks
  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.order - b.order); // Assuming order field exists

  // Drag end handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
    const newIndex = filteredTasks.findIndex(t => t.id === over.id);
    const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);

    // Update local state
    setTasks(prev => {
      const updated = [...prev];
      newTasks.forEach((task, idx) => {
        const original = updated.find(t => t.id === task.id);
        if (original) original.order = idx;
      });
      return updated;
    });

    // Persist order to backend
    try {
      await Promise.all(
        newTasks.map((task, idx) =>
          api.put(`/tasks/${task.id}`, { ...task, order: idx })
        )
      );
    } catch (err) {
      alert(`Failed to save order: ${err.message}`);
      console.error('Failed to save order:', err.message);
      onRefresh?.();
    }
  };

  // CRUD operations (same as before, with order support)
  const createTask = async (title) => {
    if (!title.trim() || !currentUser) return;
    try {
      const maxOrder = Math.max(...tasks.map(t => t.order || 0), -1);
      await api.post('/tasks', {
        title,
        isDone: false,
        userId: currentUser.id,
        order: maxOrder + 1
      });
      setShowCreateModal(false);
      onRefresh?.();
    } catch (err) {
      alert(`Create failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const updateTask = async (task, updates) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, ...updates });
      onRefresh?.();
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      onRefresh?.();
    } catch (err) {
      alert(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">Error: {error}</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <UserForm onSuccess={(user) => { setCurrentUser(user); onRefresh?.(); }} />
          <Button
            label={<><Plus className="inline h-5 w-5 mr-1" /> Add Task</>}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          />
        </div>

        {/* Task List with Dnd */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No matching tasks.' : 'No tasks yet. Create one!'}
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onToggle={updateTask}
                    onEdit={(t) => { setEditingTask(t); setNewTitle(t.title); }}
                    onDelete={deleteTask}
                    isEditing={editingTask?.id === task.id}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    onSaveEdit={(e) => {
                      e.preventDefault();
                      updateTask(task, { title: newTitle });
                      setEditingTask(null);
                    }}
                    onCancelEdit={() => setEditingTask(null)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* Create Modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); createTask(e.target.title.value); }} className="space-y-4">
              <input
                name="title"
                type="text"
                placeholder="Task title..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <div className="flex justify-end gap-2">
                <Button label="Cancel" onClick={() => setShowCreateModal(false)} className="bg-gray-300 text-gray-700" />
                <Button type="submit" label="Create" />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Tasks;