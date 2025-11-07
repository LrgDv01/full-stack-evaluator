// src/pages/Tasks/Tasks.jsx
import { useState } from 'react';
import Button from '../../components/Buttons/Button';
import UserForm from '../../components/UserForm';
import Modal from '../../components/modals/modal.jsx';
import SortableTaskItem from '../../components/Tasks/SortableTaskItem';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';



function Tasks({ tasks: propTasks = [], onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );





  // Filter tasks
  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  // Drag end handler
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
      console.error('Failed to save order:', err.message);
      onRefresh?.();
    }
  };

  // Task handlers
  const handleCreateTask = async (title) => {
    try {
      if (!currentUser) {
        alert('Please select a user before creating a task');
        setShowCreateModal(false);
        return;
      }
      await createTask(title, currentUser.id);
      setShowCreateModal(false);
    } catch (err) {
      alert(`Create failed: ${err.message}`);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await deleteTask(id);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
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
                    darkMode={darkMode}
                    onToggle={task => updateTask(task, { isDone: !task.isDone })}
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

        {/* Create Modal */}
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
              {!currentUser && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                  Please select a user before creating a task
                </div>
              )}
            <form onSubmit={(e) => { 
                  e.preventDefault();
                  const title = e.target.title.value;
                  if (title.trim()) {
                    handleCreateTask(title);
                  }
                }} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="taskTitle" className="block font-medium">
                    Task Title
                  </label>
                  <input
                    id="taskTitle"
                    name="title"
                    type="text"
                    placeholder="Enter your task here..."
                    required
                    autoFocus
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    type="button"
                    label="Cancel" 
                    onClick={() => setShowCreateModal(false)} 
                    className={`${
                      darkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  />
                  <Button 
                    type="submit" 
                    label="Create Task"
                    disabled={!currentUser}
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white ${
                      !currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  />
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