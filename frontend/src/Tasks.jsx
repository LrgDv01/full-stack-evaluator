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
      <h1 className=' p-4 m-5 text-3xl font-bold rounded-xl'>Tasks</h1>
      <div className='p-4 m-5 text-l rounded-xl border-2 border-gray-300'>
       
      {tasks.length === 0 ? 
      (
        <p>- No task at the moment, comeback for later.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.title} {task.isDone ? '✅' : '❌'}
            </li>
          ))}
        </ul>
      )}
 
      </div>
      <div className='flex justify-center'> 
        <button className='bg-blue-500 p-2 m-3 w-1/4'>Add Task</button>
        <button className='bg-blue-500 p-2 m-3 w-1/4'>Update Task</button>
        <button className='bg-blue-500 p-2 m-3 w-1/4'>Delete Task</button>
      </div>
    </div>
  );
}

export default Tasks;
