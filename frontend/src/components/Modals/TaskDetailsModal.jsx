import React from 'react';
import { AlignLeft, Calendar, Check, User } from 'lucide-react';
import Modal from './modal';
import Button from '../buttons/Button';

const TaskDetailsModal = ({ isDarkMode, task, onClose, onEdit }) => {
  // Guard: Early return if no task to avoid errors
  if (!task) return null;

  return (
    <Modal isDarkMode={isDarkMode} title="Task Details" onClose={onClose}>
      {/* Layout: Spaced sections for readability; p-6 for padding */}
      <div className="p-6 space-y-6"> 
        {/* Title and Status */}
        <div className="space-y-2">
          {/* Dynamic: Status badge colors based on completion */}
          <h2 className="text-2xl font-semibold flex items-center justify-between">
            {task.title}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              task.isCompleted 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }`}>
              {task.isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ">
            <AlignLeft className="h-5 w-5" />
            <h3 className="font-medium">Description</h3>
          </div>
          <div className="pl-7">
            {task.description ? (
              <p className=" whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="italic">
                No description provided
              </p>
            )}
          </div>
        </div>

        {/* Task Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ">
            <User className="h-5 w-5" />
            <span>Assigned to User ID: {task.userId}</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Calendar className="h-5 w-5" />
            <span>Order: {task.order}</span>
          </div>
        </div>

        {/* Actions */}
        {/* Border: Separates actions for clarity */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            isDarkMode={isDarkMode}
            variant="secondary"
            label="Close"
            onClick={onClose}
          />
          {/* Reasoning: Edit closes details modal for single-view flow */}
          <Button
            type="button"
            isDarkMode={isDarkMode}
            variant="primary"
            label="Edit Task"
            onClick={() => {
              onEdit(task);
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;