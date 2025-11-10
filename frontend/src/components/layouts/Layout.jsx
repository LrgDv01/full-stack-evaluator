// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Layout() {
  const [darkMode] = useDarkMode();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar darkMode={darkMode} />
      <main className="md:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}