import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Headers';

export default function Layout({darkMode, toggleDarkMode}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar darkMode={darkMode} isOpen={isSidebarOpen} toggleOpen={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-600">
          <Outlet darkMode={darkMode}/>
        </main>
      </div>
    </div>
  );
}