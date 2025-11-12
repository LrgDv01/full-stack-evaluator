import UserList from '../components/users/UserList';

export default function Users({darkMode}) {
  return (
    <div className={`space-y-8 h-full ${darkMode.pagesBgMode}`}>
      <h1 className="text-3xl font-bold p-7">Users</h1>
      <UserList darkMode={darkMode} />
    </div>
  );
}
