import { useTaskManagement } from '../hooks/useTaskManagement';
import { useUsers } from '../hooks/useUsers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { tasks } = useTaskManagement();
  const { users } = useUsers();

  const data = users.map((u) => ({
    name: u.email.split('@')[0],
    total: tasks.filter((t) => t.userId === u.id).length,
    done: tasks.filter((t) => t.userId === u.id && t.isDone).length,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <p className="text-2xl font-bold">{tasks.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <p className="text-2xl font-bold">
            {tasks.filter((t) => t.isDone).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
      </div>

      {data.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="mb-4 text-xl font-semibold">Tasks per User</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
              <Bar dataKey="done" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}