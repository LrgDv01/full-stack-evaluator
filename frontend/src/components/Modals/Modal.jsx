import { X } from 'lucide-react';

function Modal({ isDarkMode, children, onClose, title = '' }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200
          ${isDarkMode.pagesBgMode} `}>
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 
                py-1 rounded-3xl ${isDarkMode.darkMode ? 'dark:bg-gray-800' : 'dark:bg-gray-600'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default Modal;