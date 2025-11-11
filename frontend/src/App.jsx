import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/App.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Tasks = lazy(() => import('./pages/Tasks'));

function App() {
  const [darkMode] = useDarkMode();
  console.log('APP : ', darkMode)
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Router>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin h-12 w-12 border-t-4 border-indigo-600 rounded-full" />
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
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