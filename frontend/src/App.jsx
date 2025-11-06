// src/App.jsx
import './styles/App.css';
import Tasks from './pages/Tasks/Tasks.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  // State for the list of tasks and any fetch error
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tasks when the app loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks'); // Vite proxy → http://localhost:5215/api/tasks
        setTasks(res.data);
        setError(null);
      } catch (err) {
        // Friendly message for the UI; also log full error for debugging
        const msg = err.response?.data?.title || err.message || 'Failed to load tasks';
        setError(msg);
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="app">
      <h1 className="font-bold text-5xl">React Task Evaluator</h1>

      {/* Show error banner if something went wrong */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Pass tasks (and a refetch function) down to the Tasks page */}
      <Tasks tasks={tasks} onRefresh={() => window.location.reload()} />
    </div>
  );
}

export default App;