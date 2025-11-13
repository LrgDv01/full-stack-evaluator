import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Headers';

export default function Layout({darkMode, toggleDarkMode}) {
  // State: Manages sidebar for mobile/desktop; default true for desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Open sidebar by default on desktop
  useEffect(() => {
    // Resize listener for responsive sidebar; 768px as md breakpoint (Tailwind default)
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    // Cleanup: Prevents memory leaks on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle function: Simple invert for sidebar control
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    // Root: Applies dark class globally; flex for sidebar + content layout
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        // Assumes: Backdrop for mobile overlay; z-20 to layer under header
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