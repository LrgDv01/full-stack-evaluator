import { useEffect, useState } from 'react';
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/tasks')
      .then(res => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setError('Unexpected data format');
        }
      })
      .catch(err => setError('Failed to fetch tasks: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  console.log(" TEST TASK ", typeof(tasks));
  console.log(" TEST VALUE ", tasks);
  console.log(" TEST LENGTH ", tasks.length);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.isDone ? '✅' : '❌'}  
          </li>
        ))}
      </ul>
      <button>Add Task</button>
      <button>Update Task</button>
      <button>Delete Task</button>

    </div>
  );
}

export default Tasks;
