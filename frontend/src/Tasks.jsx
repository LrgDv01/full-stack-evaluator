import { useEffect, useState } from 'react';
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/task')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    // const arr = [
    //     {
    //       id : 0,
    //       title : "Magtanim",
    //       rewards : "Foods",
    //       isDone : true,
    //       isRecieved : true,
    //     },
    //     {
    //       id : 1,
    //       title : "Magluto",
    //       rewards : "Foods",
    //       isDone : true,
    //       isRecieved : true,
    //     }
    // ];

  // setTasks(arr)
  }, []);
  console.log(" TEST TASK ", typeof(tasks));
  console.log(" TEST VALUE ", tasks);
  console.log(" TEST LENGTH ", tasks.length);


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
