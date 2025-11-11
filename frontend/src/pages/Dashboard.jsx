import { useTaskManagement } from '../hooks/useTaskManagement';
import { useUsers } from '../hooks/useUsers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { motion } from 'framer-motion'; // 👈 optional if you want a fade-in wrapper

export default function Dashboard({darkMode}) {
  const { tasks } = useTaskManagement();
  const { users } = useUsers();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalUsers = users.length;

  const chartData = users.map((u) => ({
    name: u.email.split('@')[0],
    total: tasks.filter((t) => t.userId === u.id).length,
    done: tasks.filter((t) => t.userId === u.id && t.isCompleted).length,
  }));

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: ClipboardList,
      color: 'bg-indigo-500',
    },
    {
      title: 'Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-amber-500',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className={`space-y-8 p-7 h-full ${darkMode ? 'bg-gray-700 dark:bg-gray-700' : 'bg-gray-300 text-gray-600'} `}>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      {/* --- Stat Cards Section --- */}
      <div className="grid gap-6 md:grid-cols-3">
      
        {statCards.map(({ title, value, icon: Icon, color }) => (
          <motion.div
            key={title}
            className={`p-6 rounded-xl shadow-md flex items-center justify-between
              ${darkMode ? 'bg-gray-800 dark:bg-gray-800' : 'bg-gray-500 text-gray-100'}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Chart Section --- */}
      {chartData.length > 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tasks per User
          </h2>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'currentColor' }}
                  stroke="currentColor"
                />
                <YAxis
                  tick={{ fill: 'currentColor' }}
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    border: 'none',
                  }}
                />
                <Legend />

                {/* --- Animated Bars --- */}
                <Bar
                  dataKey="total"
                  fill="#6366f1"
                  name="Total Tasks"
                  radius={[6, 6, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="done"
                  fill="#10b981"
                  name="Completed"
                  radius={[6, 6, 0, 0]}
                  animationBegin={150}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          No user or task data available.
        </div>
      )}
    </div>
  );
}
