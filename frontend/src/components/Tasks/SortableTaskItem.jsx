import { Check, X, Edit2, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTaskItem({ 
  task, 
  onToggle, 
  onEdit, 
  onDelete, 
  isEditing, 
  newTitle, 
  setNewTitle, 
  onSaveEdit, 
  onCancelEdit,
  darkMode 
}) {
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
    transition: transition + ', border-color 0.2s, box-shadow 0.2s',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 rounded-xl border
        ${isDragging 
          ? 'border-indigo-400 shadow-lg scale-[1.02]' 
          : 'border-gray-200 shadow-sm hover:border-gray-300'
        }
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}
        transform transition-all duration-200`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <button 
          onClick={() => onToggle(task)} 
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            task.isDone 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {task.isDone ? 'Completed' : 'Pending'}
        </button>

        {isEditing ? (
          <form onSubmit={onSaveEdit} className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`flex-1 px-3 py-1 border rounded-md focus:ring-2 focus:ring-indigo-500 
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-indigo-300'
                }`}
              autoFocus
            />
            <button type="submit" className="text-green-600 hover:text-green-700">
              <Check className="h-5 w-5" />
            </button>
            <button type="button" onClick={onCancelEdit} className="text-red-600 hover:text-red-700">
              <X className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="flex-1">
            <span className={`text-lg font-medium ${task.isDone ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              by {task.user?.email || 'Unknown'}
            </span>
          </div>
        )}

        {!isEditing && (
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 transition"
          >
            <Edit2 className="h-5 w-5 text-indigo-600" />
          </button>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SortableTaskItem;