import './styles/App.css'
import Tasks from "./pages/Tasks/Tasks"
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.get('/api/tasks') // Uses proxy from vite.config.js
    .then(res => console.log('Tasks:', res.data))
    .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  return (
    <div className="app">
      <h1 className='font-bold text-5xl'>📝 React Task Evaluator</h1>
      <Tasks />
    </div>
  );
}

export default App
