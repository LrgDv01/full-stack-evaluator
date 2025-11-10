import React, { useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Trash2, Edit2, Undo, Eye } from 'lucide-react';
import Button from '../buttons/Button';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import TaskDetailsModal from '../modals/TaskDetailsModal';

/* -------------------------------------------------
   TaskItem – unchanged except for the prop name
   ------------------------------------------------- */
const TaskItem = ({
  task,
  isDarkMode,
  onEdit,
  onDelete,
  onToggle,               // <-- renamed from onToggleComplete
  onView,
  }) => {
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
      className={`group flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all 
           ${ task.isCompleted ? (isDarkMode ? 'bg-gray-700 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700' 
                : 'bg-gray-300 dark:bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-400') 
              : (isDarkMode ? 'bg-gray-400 dark:bg-gray-400 hover:bg-gray-300 dark:hover:bg-gray-300 ' 
                : 'bg-gray-600 dark:bg-gray-600 hover:bg-gray-700 dark:hover:bg-gray-700') }`}
    >
      {/*  handle drag  */}
      <button
        {...attributes}
        {...listeners}
        className={`border-none touch-none 
                
         ${ task.isCompleted ? (isDarkMode ? ' dark:bg-gray-800 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-100' 
              : 'bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-gray-200') 
            : (isDarkMode ? ' dark:bg-gray-700 dark:hover:bg-gray-500 text-gray-300 hover:text-gray-200' 
              : 'bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-200') }` }
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* title / description  */}
      <div className={`flex-1 text-start ps-3 min-w-0`}>
        <h3 
          className={`text-sm font-bold  
            ${task.isCompleted ? ( isDarkMode ? 'line-through text-gray-400 dark:text-gray-400' 
                : 'line-through text-gray-600 dark:text-gray-600')
              : ( isDarkMode ? ' text-gray-700 dark:text-gray-700' 
                : ' text-gray-400 dark:text-gray-200')}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className={`mt-1 ps-2 text-sm truncate 
          ${task.isCompleted ? (isDarkMode ? 'text-gray-400 dark:text-gray-400' : 'text-gray-600 dark:text-gray-600') 
            : (isDarkMode ? 'text-gray-700 dark:text-gray-700' : 'text-gray-200 dark:text-gray-200')}`}>
            {task.description}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant=""
          size="sm"
          icon={task.isCompleted ? <Undo className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          onClick={() => onToggle(task.id)}     
          className={`relative ${
            task.isCompleted
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-600'
              : 'bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-600'
          }`}
          aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {/* tooltip omitted for brevity */}
        </Button>

        {/* View / Edit / Delete buttons */}
        <Button
          variant="secondary"
          size="sm"
          icon={<Eye className="h-5 w-5" />}
          onClick={() => onView(task)}
          aria-label="View task details"
        />
        <Button
          variant="primary"
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

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isDarkmode={isDarkMode}
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

/*  TaskList --------------------------  */
const TaskList = ({ isDarkmode, tasks, onEdit, onDelete, onToggle }) => {  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  return (
    <SortableContext items={tasks.map((t) => t.id)}>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isDarkMode={isDarkmode}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}               // <-- forward the same name
            onView={handleViewDetails}
          />
        ))}
      </div>
      {isDetailsOpen && (
        <TaskDetailsModal
          isDarkMode={isDarkmode}
          task={selectedTask}
          onClose={() => setIsDetailsOpen(false)}
          onEdit={onEdit}
        />
      )}
    </SortableContext>
  );
};

export default TaskList;