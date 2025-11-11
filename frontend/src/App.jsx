import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/App.css';
import { Toaster } from 'react-hot-toast';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Tasks = lazy(() => import('./pages/Tasks'));

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  return (
    <div className={` dark:bg-gray-900 min-h-screen `}>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full" />
            </div>
          }
        >
          <Routes>
            <Route element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>}>
              <Route path="/" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/users" element={<Users />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;