import React, { useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Trash2, Edit2, Undo, Eye } from 'lucide-react';  // NEW: Added Eye for view button.
import Button from '../Buttons/Button';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import TaskDetailsModal from '../Modals/TaskDetailsModal';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete, onView }) => {  // NEW: Added onView prop.
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
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
      className={`group flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${
        task.isCompleted ? 'bg-gray-50 dark:bg-gray-900' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium ${
          task.isCompleted
            ? 'text-gray-500 line-through'
            : 'text-gray-900 dark:text-white'
        }`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="sm"
          icon={task.isCompleted ? <Undo className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          onClick={() => onToggleComplete(task.id)}
          className={`relative ${task.isCompleted ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'hover:bg-green-100 hover:text-green-600'}`}
          aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
            {task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          </span>
        </Button>
        {/* NEW: Added View Details button before Edit/Delete. */}
        <Button
          variant="secondary"
          size="sm"
          icon={<Eye className="h-5 w-5" />}
          onClick={() => onView(task)}
          aria-label="View task details"
        />
        <Button
          variant="secondary"
          size="sm"
          icon={<Edit2 className="h-5 w-5" />}
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        />
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 className="h-5 w-5" />}
          onClick={() => setShowDeleteModal(true)}
          aria-label="Delete task"
        />
      </div>
      
      {showDeleteModal && (
        <DeleteConfirmationModal
          title={task.title}
          onConfirm={() => {
            onDelete(task.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  // NEW: State for managing the details modal.
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // NEW: Handler to open the modal with the selected task.
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  return (
    <SortableContext items={tasks.map(task => task.id)}>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onView={handleViewDetails}  // NEW: Pass the view handler.
          />
        ))}
      </div>
      {/* NEW: Conditionally render the details modal. */}
      {isDetailsOpen && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setIsDetailsOpen(false)}
          onEdit={onEdit}  // Reuse the existing onEdit prop.
        />
      )}
    </SortableContext>
  );
};

export default TaskList;