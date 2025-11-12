import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, UserCircle2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserForm from './UserForm';
import { useUsers } from '../../hooks/useUsers';
import Button from '../buttons/Button';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import SearchBar from '../SearchBar';
import { toast } from 'react-hot-toast';

export default function UserList({ darkMode }) {
  const { users, loading, error, setUsers,
        addOrUpdateUser, create, update,
        refetchUsers, remove} = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const openForm = (user = null) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  // onSuccess is called from UserForm with the normalized user object
  const handleSuccess = (returnedUser) => {
    const user = returnedUser?.data ?? returnedUser;
    addOrUpdateUser(user); //  update locally
    toast.success(selectedUser ? 'User updated' : 'User created');
    closeForm();
    refetchUsers(); // instantly sync from backend
  };

  const handleDelete = async (id) => {
    // optimistic remove
    const original = [...users];
    setUsers(original.filter((u) => u.id != id));
    setDeletingId(id);
    try {
      await remove(id); // calls API and also removes from state (safe)
      toast.success('User deleted');
    } catch (err) {
      console.error('Delete failed', err);
      setUsers(original); // revert
      toast.error('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const q = searchTerm.toLowerCase();
    return users.filter((u) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }, [searchTerm, users]);

  if (loading) return <p className="text-center py-8">Loading users…</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className={`relative m-5 p-3`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="flex flex-row justify-between items-center gap-3 w-full">
          <SearchBar isDarkmode={darkMode} value={searchTerm} onChange={setSearchTerm} onClear={() => setSearchTerm('')} />
          <Button type="button" isDarkMode={darkMode} label="Add User" icon={<Plus className="w-4 h-4" />} onClick={() => openForm()} className="bg-indigo-600 hover:bg-indigo-700 text-white" />
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-lg shadow-md ${darkMode.componentsBgMode}`}>
        <table className="w-full border-collapse">
          <thead className={`text-left text-sm uppercase text-white ${darkMode.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-500 text-gray-700'}`}>
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Total Tasks</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className={`text-left text-sm uppercase ${darkMode.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className={`transition-colors text-start`}>
                  <td className="px-6 py-3">{u.id}</td> 
                  <td className="px-6 py-3 flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-indigo-400" /> {u.name || '—'}
                  </td>
                  <td className="px-6 py-3"> 
                    <p className='flex items-center gap-2' > <Mail  className="w-5 h-5 text-red-400"/> {u.email || '—'}</p>
                  </td> 
                  <td className="px-6 py-3 text-center">{u.taskCount ?? 0}</td>
                  <td className="px-6 py-3 flex justify-center gap-3">
                    <Button type="button" isDarkMode={darkMode} variant="primary" size="sm" icon={<Edit className="h-5 w-5" />} onClick={() => openForm(u)} aria-label="Edit user" />
                    <Button type="button" isDarkMode={darkMode} variant="danger" size="sm" icon={deletingId === u.id ? <svg className="w-4 h-4 animate-spin" 
                        viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" 
                        strokeLinecap="round"/></svg> : <Trash2 className="h-5 w-5" />} onClick={() => setDeleteUserId(u.id)} 
                        aria-label="Delete user" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-40" onClick={closeForm} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${darkMode.darkMode ? 'dark:bg-gray-800 text-gray-100' : 'dark:bg-gray-600 text-white'}`}>
                <div className="flex justify-between items-center border-b px-5 py-3">
                  <h3 className="text-lg font-semibold">{selectedUser ? 'Edit User' : 'Create User'}</h3>
                  <button onClick={closeForm} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-center py-0
                       text-lg rounded-full">✕</button>
                </div>
                <UserForm isDarkmode={darkMode} userId={selectedUser?.id} initialData={selectedUser} onSuccess={handleSuccess} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
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