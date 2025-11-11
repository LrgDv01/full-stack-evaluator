import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import Button from '../buttons/Button';

const InputField = ({
  isDarkmode,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = true,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2 ms-2 text-start">
      {label}
      {required && <span className="text-red-500 ml-2">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2.5 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
        isDarkmode
          ? 'bg-gray-700 text-gray-200 border-gray-600'
          : 'bg-gray-100 text-gray-800 border-gray-300'
      } ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" /> {error}
      </p>
    )}
  </div>
);

const UserForm = ({ isDarkmode, userId = null, onSuccess, initialData = null }) => {
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Invalid email format';
    if (!userId) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6)
        errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setValidationErrors((p) => ({ ...p, [name]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = userId
        ? await api.put(`/users/${userId}`, formData)
        : await api.post('/users', formData);
      onSuccess(res.data);
    } catch (err) {
      setApiError(err.response?.data?.title || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5">
      <InputField
        isDarkmode={isDarkmode}
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={validationErrors.name}
      />
      <InputField
        isDarkmode={isDarkmode}
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
      />
      <InputField
        isDarkmode={isDarkmode}
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        required={!userId}
      />

      {apiError && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> {apiError}
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={loading}
          label={loading ? 'Processing...' : userId ? 'Update User' : 'Create User'}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        />
      </div>
    </form>
  );
};

export default UserForm;
