import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import TasksDashboard from './pages/Tasks/TasksDashboard';
import Tasks from './pages/Tasks/Tasks';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/App.css';

function App() {
  const [darkMode] = useDarkMode();  // Read state for any root-level styles

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Router>
        <Routes>
          <Route path="/tasks" element={<Tasks />} />
          {/* <Route path="/tasks" element={<TasksDashboard />} /> */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;