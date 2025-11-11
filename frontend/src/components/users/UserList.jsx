import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserForm from './UserForm';
import { useUsers } from '../../hooks/useUsers';
import Button from '../buttons/Button';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import SearchBar from '../tasks/SearchBar';
import { toast } from 'react-hot-toast'; // Add react-hot-toast

export default function UserList({ darkMode }) {
  const { users, loading, error, addUser, setUsers } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openForm = (user = null) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleSuccess = (updatedUser) => {
    if (selectedUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
      );
      toast.success('User updated successfully');
    } else {
      addUser(updatedUser);
      toast.success('User created successfully');
    }
    closeForm();
  };

  const handleDelete = async (id) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== id)); // Optimistic UI
    toast.promise(
      api.delete(`/users/${id}`),
      {
        loading: 'Deleting user...',
        success: 'User deleted successfully',
        error: 'Failed to delete user',
      }
    ).catch(() => setUsers(originalUsers)); // Revert on failure
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  if (loading) return <p className="text-center py-8">Loading users…</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="relative m-5 p-3">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="flex flex-row justify-between items-center gap-3 w-full">
          <SearchBar
            isDarkmode={darkMode}
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />

          <Button
            label="Add User"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => openForm()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          />
        </div>
      </div>

      {/* User Table */}
      <div
        className={`overflow-x-auto rounded-lg shadow-md ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <table className="w-full border-collapse">
          <thead
            className={`text-left text-sm uppercase ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Total Tasks</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className={`transition-colors text-start ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <td className="px-6 py-3">{u.id}</td>
                  <td className="px-6 py-3 flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-indigo-500" />
                    {u.name || '—'}
                  </td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 text-center">{u.taskCount || 0}</td>
                  <td className="px-6 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => openForm(u)}
                      className="p-2 rounded hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteUserId(u.id)}
                      className="p-2 rounded hover:bg-red-500/20 text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeForm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div
                className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${
                  darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
                }`}
              >
                <div className="flex justify-between items-center border-b px-5 py-3">
                  <h3 className="text-lg font-semibold">
                    {selectedUser ? 'Edit User' : 'Create User'}
                  </h3>
                  <button
                    onClick={closeForm}
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <UserForm
                  userId={selectedUser?.id}
                  initialData={selectedUser}
                  onSuccess={handleSuccess}
                  isDarkmode={darkMode}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <DeleteConfirmationModal
          isDarkmode={darkMode}
          title="User"
          onConfirm={() => {
            handleDelete(deleteUserId);
            setDeleteUserId(null);
          }}
          onCancel={() => setDeleteUserId(null)}
        />
      )}
    </div>
  );
}
