export default function UserCard({ user, isSelected, onSelect, darkMode }) {
  return (
    <div
      onClick={() => onSelect(user)}
      className={`p-4 rounded-lg cursor-pointer transition-all
        ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}
        hover:shadow-md`}
    >
      <p className="font-medium">{user.name || user.email}</p>
      <p className="text-sm opacity-80">{user.email}</p>
    </div>
  );
}