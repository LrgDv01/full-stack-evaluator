import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, Sun, Moon } from 'lucide-react';

import Button from '../../components/Buttons/Button';
import Modal from '../../components/modals/modal';
import TaskList from '../../components/Tasks/TaskList';
import TaskForm from '../../components/Tasks/TaskForm';
import SearchBar from '../../components/Tasks/SearchBar';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function TasksDashboard() {
  /* ---------- UI state ---------- */
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);   // plain object or null
  const [search, setSearch] = useState('');
  const [dark, toggleDark] = useDarkMode();

  /* ---------- Data hook (no onRefresh) ---------- */
  const {
    tasks,
    loading,
    error,
    create,
    update,
    remove,
    toggle,
    reorder,
  } = useTaskManagement();   // <-- no props → stable

  /* ---------- DnD sensors ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /* ---------- Search & sort ---------- */
  const filtered = tasks
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  /* ---------- Drag-end ---------- */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = filtered.findIndex(t => t.id === active.id);
    const newIdx = filtered.findIndex(t => t.id === over.id);
    const newList = arrayMove(filtered, oldIdx, newIdx);

    await reorder(newList);
  };

  /* ---------- Create / Update handlers ---------- */
  const handleCreate = async (data) => {
    await create(data.title, 1, data.description); // TODO: real userId
    setShowCreate(false);
  };

  const handleUpdate = async (data) => {
    // Preserve existing task properties while updating title and description
    await update(editing.id, {
      ...editing, // Keep existing properties (userId, isCompleted, order)
      title: data.title,
      description: data.description
    });
    setEditing(null);
  };

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-t-4 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Task Manager</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            onClick={() => toggleDark()} // FIXED ME
          />
          <Button
            variant="primary"
            label="Add Task"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowCreate(true)}
          />
        </div>
      </header>

      <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <TaskList
          tasks={filtered}
          onEdit={setEditing}
          onDelete={remove}
          onToggleComplete={toggle}
        />
      </DndContext>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create Task" onClose={() => setShowCreate(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(null)}>
          <TaskForm
            task={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}