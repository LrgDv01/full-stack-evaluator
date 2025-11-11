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
  const pagesBgMode = darkMode ? 'bg-gray-700 dark:bg-gray-700' : 'dark:bg-indigo-200 text-gray-600'
  const componentsBgMode = darkMode ? 'bg-gray-500 dark:bg-gray-500' : 'bg-gray-400 dark:bg-gray-400 text-gray-600'
  return (
    <div className={` dark:bg-gray-900 min-h-screen `}>
      
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <Toaster position="top-right"  />
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
              <Route path="/" element={<Dashboard darkMode={{pagesBgMode, componentsBgMode}} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/users" element={<Users darkMode={{pagesBgMode, componentsBgMode}} toggleDarkMode={toggleDarkMode}/>} />
              <Route path="/tasks" element={<Tasks darkMode={pagesBgMode} toggleDarkMode={toggleDarkMode}/>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;