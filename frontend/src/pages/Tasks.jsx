import { useState, useEffect } from 'react';
import { Plus, ListTodo, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import TaskList from '../components/tasks/TaskList.jsx';
import TaskForm from '../components/tasks/TaskForm.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useTaskManagement } from '../hooks/useTaskManagement.js';
import { fetchUsers } from '../api/userService.js';
import { toast } from 'react-hot-toast';

export default function Tasks({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  // const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editingTask, setEditingTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const {
    tasks,
    loading,   // initial
    syncing,   // background operations
    error,
    create,
    update,
    remove: deleteTask,
    toggle: toggleTask,
    reorder: updateTaskOrder,
    refresh,
  } = useTaskManagement();

  // Function: Opens create form
  const openForm = (user = null) => {
    setSelectedUser(user);
    setShowCreateModal(true);
  };

  const closeForm = () => {
    setShowCreateModal(false);
    setSelectedUser(null);
  };


  useEffect(() => {
    // Load: Fetch users for dropdown
    const loadUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    loadUsers();
  }, []);
  
  // Sensors: For DnD pointer/keyboard support
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  // console.log('TASK: ', task.title.toLowerCase().includes(q));

  // Filter: Case-insensitive on title/desc; sort by order
  const filteredTasks = tasks
  .filter((task) => {
    if (!task) return false; // guard against undefined elements
    const q = (searchTerm || '').toLowerCase();
    const title = (task.title || '').toLowerCase();
    const desc = (task.description || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  })
  .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
    const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
    try {
      await updateTaskOrder(newTasks);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleCreate = async (data) => {
    if (!currentUser) {
      alert('Please select a user first');
      return;
    }
    try {
      await create(data.title, currentUser.id, data.description);
      // setShowCreateModal(false);
      toast.success(selectedUser ? 'Task updated' : 'Task Added');
      closeForm();
      // no forced refresh needed — create is optimistic
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
    try {
      await deleteTask(id);
      // optimistic remove happened in hook; no refresh necessary
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Delete failed: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    // initial full-page loading on first mount only
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    
    <div className={`transition-colors duration-300 h-full ${darkMode.pagesBgMode}`}>
      <h1 className="text-3xl font-bold p-7">Tasks</h1>
      <div className="mx-auto p-6">
        {/* Header */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"> */}
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {syncing && <span className="ml-3 text-sm text-gray-500">Saving...</span>}
          </h1>

          <div className="flex justify-between items-center gap-3 mb-3">
            <SearchBar isDarkmode={darkMode} value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />
            <Button
              type="button"
              isDarkMode={darkMode}
              label={<><Plus className="h-5 w-5 mr-1" /> Add Task</>}
              onClick={() => openForm()}
            />
          </div>
        {/* </div> */}

        {/* Task list card */}
        <div className={`rounded-xl shadow p-4 md:p-6 transition-all max-h-[740px] overflow-y-auto [scrollbar-width:none]
            [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${darkMode.componentsBgMode}`}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <TaskList
                isDarkMode={darkMode}
                tasks={filteredTasks}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onToggle={toggleTask}
              />
          </DndContext>
          {filteredTasks.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No tasks found. Try adding one!
            </div>
          )}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div className="fixed inset-0 bg-black/50 z-40" onClick={closeForm} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${darkMode.darkMode ? 'dark:bg-gray-800 text-gray-100' 
                    : 'dark:bg-gray-600 text-white'}`}>
                  <div className="flex justify-between items-center border-b px-5 py-3">
                    <h3 className="text-lg font-semibold">{selectedUser ? 'Edit User' : 'Create User'}</h3>
                    <button onClick={closeForm} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-center py-0
                       text-lg rounded-full">✕</button>
                  </div>
                  <div className={`space-y-4 p-6 bg-gray-100 ${darkMode.componentsBgMode}`}>
                    <label className="block text-lg font-bold ">Select User</label>
                    {/* Dropdown: Required for task ownership */}
                    <select
                      value={currentUser?.id || ''}
                      onChange={(e) => setCurrentUser(users.find((u) => u.id === Number(e.target.value)) || null)}
                      className={`w-full p-2 border rounded-lg dark:bg-gray-600 dark:text-white`}
                    >
                      <option value="">Select a user</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.email}
                        </option>
                      ))}
                    </select>
                    <TaskForm isDarkMode={darkMode} onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} disabled={!currentUser} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        {editingTask && (
          <Modal isDarkMode={darkMode} title="Edit Task" onClose={() => setEditingTask(null)}>
            <TaskForm isDarkMode={darkMode} task={editingTask} onSubmit={handleUpdate} onCancel={() => setEditingTask(null)} />
          </Modal>
        )}
      </div>
    </div>
  );
}




