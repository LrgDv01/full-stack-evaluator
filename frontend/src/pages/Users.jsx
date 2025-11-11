import UserList from '../components/users/UserList';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Users() {
  const [darkMode] = useDarkMode();

  return (
    <div className={`space-y-8 h-full ${darkMode ? 'dark:bg-gray-700' : 'dark:bg-gray-100'}`}>
      <h1 className="text-3xl font-bold">Users</h1>
      <UserList darkMode={darkMode} />
    </div>
  );
}
