import { useState, useEffect } from 'react';
import { Plus, Sun, Moon, ListTodoIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import Button from '../components/buttons/Button.jsx';
import Modal from '../components/modals/modal.jsx';
import TaskList from '../components/tasks/TaskList.jsx'; // Assuming this wraps SortableTaskItem
import TaskForm from '../components/tasks/TaskForm.jsx';
import SearchBar from '../components/tasks/SearchBar.jsx'; // Or implement as input if missing
import UserForm from '../components/users/UserForm.jsx';
import { useTaskManagement } from '../hooks/useTaskManagement.js';
// import { useDarkMode } from '../hooks/useDarkMode.js';
import { fetchUsers } from '../api/userService.js'; // For fetching users
// import { useUsers } from '../hooks/useUsers.js';        

function Tasks({darkMode}) {
  // UI States - Grouped for readability
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Null or task object for edit modal
  const [currentUser, setCurrentUser] = useState(null); // Selected user for task creation
  const [users, setUsers] = useState([]); // List of users for dropdown
  // const {user, addUser } = useUsers(); 


  // Hooks - Data and theme
  // const { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask, updateTaskOrder } = useTaskManagement(); // Stable, no props
  const {
    tasks,
    loading,
    error,
    create,           // ← renamed
    update,           // ← renamed
    remove: deleteTask,     // ← alias for clarity
    toggle: toggleTask,     // ← alias
    reorder: updateTaskOrder, // ← alias
  } = useTaskManagement();
  // const [darkMode, toggleDarkMode] = useDarkMode();

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
// Handlers
const handleCreate = async (data) => {
  if (!currentUser) {
    alert('Please select a user first');
    return;
  }
  try {
    await create(data.title, currentUser.id, data.description);
    setShowCreateModal(false);
  } catch (err) {
    console.error('Create failed:', err);
    alert(`Create failed: ${err.message || 'Unknown error'}`);
  }
};

const handleUpdate = async (data) => {
  try {
    await update(editingTask.id, {
      ...editingTask,
      title: data.title,
      description: data.description,
    });
    setEditingTask(null);
  } catch (err) {
    console.error('Update failed:', err);
    alert(`Update failed: ${err.message || 'Unknown error'}`);
  }
};

const handleDelete = async (id) => {
  // if (!window.confirm('Delete this task?')) return;
  try {
    await deleteTask(id); // ← this now works because of alias
  } catch (err) {
    console.error('Delete failed:', err);
    alert(`Delete failed: ${err.message || 'Unknown error'}`);
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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode}`}>

      <div className="mx-auto p-6">
        {/* Header - Flexible for responsiveness */}
        {/* User Management - Card for visual separation */}
     
        {/* Search */}
        <div className="px-2">
          <div className="mb-3 flex justify-between items-center">
            <SearchBar isDarkmode={darkMode} value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />
            <Button  isDarkmode={darkMode} label={<><Plus className="h-5 w-5 mr-1"/> Add Task</>} 
                      onClick={() => setShowCreateModal(true)} /> 
          </div>
          {/* Task List */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <TaskList
              isDarkmode={darkMode}
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onToggle={toggleTask}
            />
          </DndContext>

          {/* Create Modal */}
          {showCreateModal && (
            <Modal isDarkMode={darkMode} onClose={() => setShowCreateModal(false)}>
              <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
              {!currentUser && <p className="mb-4 text-yellow-600">Please select a user first.</p>}
               <h2 className="text-2xl font-semibold mb-4">Select User</h2>
                <select
                  value={currentUser?.id || ''}
                  onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || null)}
                  className={`w-full p-2 border rounded-2xl mb-4 ${darkMode ? 'bg-gray-600 border-gray-600' : 'bg-gray-300 dark:bg-gray-300 border-gray-400'}`}
                >
                  <option value="">Select User</option>
                  {users.map(user => <option key={user.id} value={user.id}>{user.email}</option>)}
                </select>
              <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} disabled={!currentUser} />
            </Modal>
          )}

          {/* Edit Modal */}
          {editingTask && (
            <Modal isDarkMode={darkMode} onClose={() => setEditingTask(null)}>
              <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
              <TaskForm task={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;