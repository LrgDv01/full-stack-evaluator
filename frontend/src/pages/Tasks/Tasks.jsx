import { useState, useEffect } from 'react';
import { Plus, Sun, Moon, Search as SearchIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import Button from '../../components/Buttons/Button';
import Modal from '../../components/modals/modal.jsx';
import TaskList from '../../components/Tasks/TaskList'; // Assuming this wraps SortableTaskItem
import TaskForm from '../../components/Tasks/TaskForm';
import SearchBar from '../../components/Tasks/SearchBar'; // Or implement as input if missing
import UserForm from '../../components/UserForm';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useDarkMode } from '../../hooks/useDarkMode';
import { fetchUsers } from '../../api/userService'; // For fetching users

function Tasks() {
  // UI States - Grouped for readability
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Null or task object for edit modal
  const [currentUser, setCurrentUser] = useState(null); // Selected user for task creation
  const [users, setUsers] = useState([]); // List of users for dropdown

  // Hooks - Data and theme
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask, updateTaskOrder } = useTaskManagement(); // Stable, no props
  const [darkMode, toggleDarkMode] = useDarkMode();

  // Fetch users on mount - Handle errors gracefully
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Failed to load users:', err);
        // TODO: Show user-friendly error (e.g., toast)
      }
    };
    loadUsers();
  }, []);

  // DnD Setup - Sensors for pointer/keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Filtered and Sorted Tasks - Memoize if performance issues arise
  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  // Handlers - Keep async and error-handled
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
    const newIndex = filteredTasks.findIndex(t => t.id === over.id);
    const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);

    try {
      await updateTaskOrder(newTasks);
    } catch (err) {
      console.error('Failed to update order:', err);
      // TODO: Revert UI or show error
    }
  };

  const handleCreate = async (data) => {
    if (!currentUser) {
      alert('Please select a user first'); // Or use a better UI feedback
      return;
    }
    try {
      await createTask(data.title, currentUser.id, data.description);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Create failed:', err);
      alert(`Create failed: ${err.message}`);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTask(editingTask.id, {
        ...editingTask, // Preserve userId, isDone, order, etc.
        title: data.title,
        description: data.description,
      });
      setEditingTask(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Render - Handle loading/error first
  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin h-10 w-10 border-t-4 border-indigo-600 rounded-full" /></div>;
  }
  if (error) {
    return <div className="text-red-600 text-center p-4 bg-red-50 rounded">{error}</div>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header - Flexible for responsiveness */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Task Manager</h1>
          <div className="flex items-center gap-4">
            <Button icon={darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} onClick={toggleDarkMode} />
            <Button label={<><Plus className="inline h-5 w-5 mr-1" /> Add Task</>} onClick={() => setShowCreateModal(true)} />
          </div>
        </div>

        {/* User Management - Card for visual separation */}
        <div className={`mb-8 p-6 rounded-xl shadow-md transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-4">Select User</h2>
          <select
            value={currentUser?.id || ''}
            onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || null)}
            className={`w-full p-2 border rounded-lg mb-4 ${darkMode ? 'bg-gray-700 border-gray-700' : 'bg-white border-gray-300'}`}
          >
            <option value="">Select User</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.email}</option>)}
          </select>
          <UserForm onSuccess={(newUser) => {
            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
          }} />
        </div>

        {/* Search */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />

        {/* Task List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <TaskList
            tasks={filteredTasks}
            darkMode={darkMode}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onToggle={toggleTask}
          />
        </DndContext>

        {/* Create Modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            {!currentUser && <p className="mb-4 text-yellow-600">Please select a user first.</p>}
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} disabled={!currentUser} />
          </Modal>
        )}

        {/* Edit Modal */}
        {editingTask && (
          <Modal onClose={() => setEditingTask(null)}>
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <TaskForm task={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Tasks;