import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TasksDashboard from './pages/Tasks/TasksDashboard';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/App.css';

function App() {
  const [darkMode] = useDarkMode();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <Router>
          <Routes>
            <Route path="/tasks" element={<TasksDashboard />} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;