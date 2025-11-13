import {  Menu, X, Sun, Moon, ListTodoIcon } from 'lucide-react';
import Button from '../buttons/Button';

export default function Header({
  darkMode,
  toggleDarkMode,
  isSidebarOpen,
  toggleSidebar,
}) {
  return (
    // Design choice: Sticky header for persistent nav; shadow for depth
    <header className={`sticky top-0 z-30 flex items-center justify-between p-4   shadow-md transition-colors
          ${ darkMode ? 'bg-gray-800 dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-200'}`}>
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        // md:hidden for responsive; aria-label for accessibility
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Title */}
       <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex pb-3">
            <ListTodoIcon className="h-8 w-8 text-indigo-600 me-3"/> Task Manager
        </h1>
      
      {/* Dark-mode toggle – custom Button */}
        <Button
        type="toggle"
        isDarkMode={darkMode}
        // Icons switch with mode; className for sizing override
        icon={darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        onClick={toggleDarkMode}
        className="w-10 h-10"
        aria-label="Toggle dark mode"
      />
    </header>
  );
}