import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import Button from './Buttons/Button';

// Helper component for inputs (keeps main form clean)
const InputField = ({ label, type = 'text', name, value, onChange, error, required = true }) => (
  <div className="mb-4 transition-all duration-200 ease-in-out">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2.5 border rounded-lg transition-all duration-200
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md
        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
        ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
      `}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const UserForm = ({ userId = null, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' }); // Don't pre-fill password for security
    }
  }, [initialData]);

  // Small validation function for maintainability
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Invalid email format';
    if (!userId) { // Only validate password for create
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: undefined })); // Clear specific error
    setApiError(null); // Reset API error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      let updatedUser;
      if (userId) {
        // Assume api.updateUser exists; implement if not (PUT /api/users/{id})
        updatedUser = await api.put(`/users/${userId}`, formData);
      } else {
        updatedUser = await api.post('/users', formData);
      }
      onSuccess(updatedUser.data); // Pass back the response data
    } catch (err) {
      setApiError(err.response?.data?.title || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-fade-in-up"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {userId ? 'Update User' : 'Create User'}
      </h2>
      
      <InputField label="Name" name="name" value={formData.name} onChange={handleChange} error={validationErrors.name} />
      <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={validationErrors.email} />
      <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={validationErrors.password} required={!userId} />

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {apiError}
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={loading}
          label={loading ? 'Processing...' : (userId ? 'Update User' : 'Create User')}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
        />
      </div>
    </form>
  );
};

export default UserForm;