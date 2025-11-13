import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../buttons/Button';

const TaskForm = ({ isDarkMode, task = null, onSubmit, onCancel }) => {
  // State: FormData for title/desc; defaults from task if editing
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      // Sync: Populate form on task prop change for edit mode
      setFormData({
        title: task.title || '',
        description: task.description || '',
      });
    }
  }, [task]);

  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handling: Show API message; keep form open for retry
      setError(err.response?.data || err.message || 'Failed to save task');
      // Don't close form on error so user can try again
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {/* Label: Required star for validation cue */}
        <label htmlFor="title" className="block text-sm font-medium text-start mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:border-gray-600 dark:bg-gray-600 dark:text-white"
          required
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-start mb-1">
          Description
        </label>
        {/* Textarea: Rows=3 for multi-line; optional placeholder */}
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                dark:border-gray-600 dark:bg-gray-600 dark:text-white`}
          placeholder="Enter task description (optional)"
        />
      </div>

      {error && (
        // Feedback: Red alert for errors
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/50 dark:text-red-200">
          {error}
        </div>
      )}
      
      {/* Actions: Disable on loading; dynamic label */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          isDarkMode={isDarkMode}
          type="button"
          variant="secondary"
          label="Cancel"
          onClick={onCancel}
          disabled={loading}
        />
        <Button
          isDarkMode={isDarkMode}
          type="submit"
          variant="primary"
          label={loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          disabled={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  );
};

export default TaskForm;