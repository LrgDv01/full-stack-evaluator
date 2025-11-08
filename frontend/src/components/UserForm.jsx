import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import Button from './Buttons/Button';

const InputField = ({ label, type = 'text', name, value, onChange, error, required = true }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2.5 border rounded-lg transition-colors
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        dark:bg-gray-700 dark:border-gray-600 dark:text-white
        ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'}
      `}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
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
      setFormData({ ...initialData, password: '' });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format';
    }
    if (!userId && !formData.password) errors.password = 'Password is required';
    if (!userId && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError(null); // Clear API error on any change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setApiError(null);
    setLoading(true);

    try {
      if (userId) {
        await api.updateUser(userId, formData);
      } else {
        await api.createUser(formData);
      }
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {userId ? 'Update User' : 'Create User'}
      </h2>
      
      <InputField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={validationErrors.name}
      />

      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
      />

      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        required={!userId}
      />

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {apiError}
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          label={loading ? 'Processing...' : (userId ? 'Update User' : 'Create User')}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        />
      </div>
    </form>
  );
};

export default UserForm;