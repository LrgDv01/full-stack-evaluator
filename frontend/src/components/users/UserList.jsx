import UserForm from '../UserForm';
import UserCard from './UserCard';
import { useUsers } from '../../hooks/useUsers';

export default function UserList({ onUserSelect, darkMode }) {
  const { users, loading, error, addUser } = useUsers();

  if (loading) return <p className="text-center py-8">Loading users…</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="space-y-6">
           {/* <UserForm isDarkmode ={darkMode} 
            onSuccess={(newUser) => {
              addUser(newUser);
              setCurrentUser(newUser);
            }} 
          /> */}
  
      <UserForm
        onSuccess={(newUser) => {
          addUser(newUser);
          onUserSelect?.(newUser);
        }}
        darkMode={darkMode}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {users.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            onSelect={onUserSelect}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}