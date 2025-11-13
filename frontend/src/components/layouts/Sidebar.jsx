import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, ListTodo, ChevronLeft, List } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
];

export default function Sidebar({ darkMode, isOpen, toggleOpen }) {
  return (
    // Aside: Fixed for mobile, relative for desktop; transform for slide animation
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out
        overflow-y-auto shadow-xl
        ${darkMode ? 'bg-gray-900 dark:bg-gray-900 text-gray-200' : 'bg-gray-400 dark:bg-indigo-100 text-gray-800'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 md:translate-x-0 md:relative
        ${isOpen ? 'md:w-64' : 'md:w-20'}
      `}
    >
      {/* Collapse/Expand Button */}
      <div className="hidden md:flex justify-end my-6 me-2">
        <button
          onClick={toggleOpen}
          // Custom styles: Transparent button with border for subtle toggle
          className={`flex items-center gap-2 textsm font-medium bg-transparent border-2 border-indigo-400 py-0.5 w-15
            hover:text-indigo-600 dark:hover:text-indigo-700 transition-colors dark:hover:border-indigo-700 
              ${darkMode ? 'bg-gray-900 dark:bg-gray-900 text-gray-200' : '  dark:text-indigo-700'}`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <>
              <ChevronLeft className="h-6 w-6" />
              <span className={`${!isOpen && 'hidden'}`}></span>
            </>
          ) : (
            <>
              <List className="h-6 w-6" />
              <span className={`${!isOpen && 'hidden'}`}></span>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              // NavLink: Active state for highlighting; closes mobile on click
                <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    onClick={() => window.innerWidth < 768 && toggleOpen()}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                        isActive ? 'bg-indigo-500 text-white hover:text-white dark:hover:bg-indigo-700'
                            : darkMode ? 'hover:bg-gray-300 dark:hover:bg-gray-300 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-400 text-gray'
                        }`
                    }
                    >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <IconComponent className="h-5 w-5 flex-shrink-0" />
                         {/* Wrapper keeps width smooth even when closed  */}
                        <motion.div
                            className="overflow-hidden"
                            animate={{
                                width: isOpen ? 'auto' : 0,
                                opacity: isOpen ? 1 : 0,
                                y: isOpen ? 0 : 5, // slide down slightly when closing
                            }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                            <span className="whitespace-nowrap">{item.label}</span>
                        </motion.div>
                    </div>
                </NavLink>
            );
        })}
      </nav>
    </aside>
  );
}
