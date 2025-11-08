import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../modals/modal';
import Button from '../Buttons/Button';

const DeleteConfirmationModal = ({ title, onConfirm, onCancel }) => {
  return (
    <Modal onClose={onCancel}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Task
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            label="Cancel"
            onClick={onCancel}
          />
          <Button
            variant="danger"
            label="Delete"
            onClick={onConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;