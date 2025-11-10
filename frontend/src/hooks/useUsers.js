import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        setError(e.message ?? 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addUser = (newUser) => setUsers((prev) => [...prev, newUser]);

  return { users, loading, error, addUser };
};