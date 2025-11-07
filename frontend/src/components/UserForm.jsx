import React, { useState } from 'react';
import api from '../api/axios';  // Import  axios instance

const UserForm = ({ userId = null, onSuccess }) => {  // Props: userId for update mode, onSuccess callback
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);  // For API error messages
  const [loading, setLoading] = useState(false);  // Show spinner during request

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Clear old errors
    setLoading(true);  // Start loading

    try {
      if (userId) {
        // Update mode
        await api.updateUser(userId, formData);
      } else {
        // Create mode
        await api.createUser(formData);
      }
      onSuccess();  // Callback, refresh list or redirect
    } catch (err) {
      setError(err);  // Set error message from backend like "Email already registered")
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{userId ? 'Update User' : 'Create User'}</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={!userId}  // Optional for update
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Error in red with Tailwind */}

      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? 'Saving...' : (userId ? 'Update' : 'Create')}
      </button>
    </form>
  );
};

export default UserForm;