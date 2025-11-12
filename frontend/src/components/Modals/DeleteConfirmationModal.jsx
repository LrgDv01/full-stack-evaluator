import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './modal';
import Button from '../buttons/Button';

const DeleteConfirmationModal = ({ isDarkmode, title, onConfirm, onCancel }) => {
  return (
    <Modal isDarkMode={isDarkmode} onClose={onCancel}>
      <div>
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-200 flex items-center justify-center mb-5">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <div className='ms-3'>
            <h3 className="text-lg font-bold">
              Delete Task
            </h3>
            <p className="my-3 text-sm  ">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            isDarkMode={isDarkmode}
            variant="secondary"
            label="Cancel"
            onClick={onCancel}
          />
          <Button
            type="submit"
            isDarkMode={isDarkmode}
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