import { useState, useEffect, useCallback } from 'react';
import {
  fetchUsers as apiFetchUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '../api/userService';


// Custom hook to manage user data (CRUD + sync)
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from backend
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetchUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users on initial mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Add or update user in local state (no API call)
  const addOrUpdateUser = (user) => {
    if (!user) return;
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.map((u) => (u.id === user.id ? { ...u, ...user } : u));
      }
      return [user, ...prev];
    });
  };

  // Create a new user (API + local)
  const create = async (payload) => {
    const created = await apiCreateUser(payload);
    const normalized = created?.data ?? created;
    addOrUpdateUser(normalized);
    return normalized;
  };

  // Update an existing user (API + local)
  const update = async (id, payload) => {
    const updated = await apiUpdateUser(id, payload);
    const normalized = updated?.data ?? updated;
    addOrUpdateUser(normalized);
    return normalized;
  };

  // Delete user (API + local)
  const remove = async (id) => {
    await apiDeleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    loading,
    error,
    setUsers,
    addOrUpdateUser,
    create,
    update,
    remove,
    refetchUsers: fetchUsers, 
  };
};




