import { useState, useEffect } from 'react';
import Button from '../../components/Buttons/Button';
import UserForm from '../../components/UserForm';
import Modal from '../../components/modals/modal.jsx';
import SortableTaskItem from '../../components/Tasks/SortableTaskItem';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { fetchUsers } from '../../api/userService'; // Add if not there (from earlier)

function Tasks({ tasks: propTasks = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]); // For dropdown
  const [darkMode, setDarkMode] = useDarkMode();
  
  const {
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
  } = useTaskManagement(propTasks, onRefresh);

  // Fetch users for selection
  useEffect(() => {
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
    const newIndex = filteredTasks.findIndex(t => t.id === over.id);
    const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);

    try {
      await updateTaskOrder(newTasks);
    } catch (err) {
      alert(`Failed to save order: ${err.message}`);
      onRefresh?.();
    }
  };

  const handleCreateTask = async (title) => {
    if (!currentUser) {
      alert('Please select a user first');
      return;
    }
    try {
      await createTask(title, currentUser.id);
      setShowCreateModal(false);
    } catch (err) {
      alert(`Create failed: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (error) return <div className="text-red-600 text-center p-4 bg-red-50 rounded">{error}</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header - Responsive flex */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* User Controls - Modern card style */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <select
            value={currentUser?.id || ''}
            onChange={(e) => setCurrentUser(users.find(u => u.id === Number(e.target.value)) || null)}
            className={`w-full p-2 border rounded-lg mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
          >
            <option value="">Select User</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.email}</option>)}
          </select>
          <UserForm onSuccess={(user) => {
            setUsers([...users, user]);
            setCurrentUser(user);
            onRefresh?.();
          }} />
        </div>

        {/* Task Controls */}
        <div className="flex justify-end mb-4">
          <Button
            label={<><Plus className="inline h-5 w-5 mr-1" /> Add Task</>}
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all"
          />
        </div>

        {/* Task List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400 italic">No tasks yet. Create one!</p>
              ) : (
                filteredTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    onToggle={(t) => updateTask(t, { isDone: !t.isDone })}
                    onEdit={(t) => { setEditingTask(t); setNewTitle(t.title); }}
                    onDelete={handleDeleteTask}
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

        {/* Create Modal - Improved UX with conditional warning */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <div className={darkMode ? 'text-white' : 'text-gray-900'}>
              <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
              {!currentUser && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Please select a user first
                </div>
              )}
              <form onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.title.value;
                if (title.trim()) handleCreateTask(title);
              }} className="space-y-4">
                <input
                  name="title"
                  type="text"
                  placeholder="Enter task title..."
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" label="Cancel" onClick={() => setShowCreateModal(false)} className={darkMode ? 'bg-gray-700' : 'bg-gray-200'} />
                  <Button type="submit" label="Create" disabled={!currentUser} className="bg-indigo-600 text-white disabled:opacity-50" />
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Tasks;