import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({isDarkmode, value, onChange, onClear }) => {
  return (
    <div className="relative md:w-6/12">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkmode ? 'text-gray-400' : 'text-gray-500 '}`}/>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className={`w-full pl-10 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500focus:border-blue-500 
              ${isDarkmode ? 'bg-gray-600 dark:bg-gray-600 border-gray-300 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-300' 
                : 'bg-gray-300 dark:border-gray-400 text-gray dark:text-gray-700 placeholder-gray-500 dark:placeholder-gray-500'}`}
      />
      {value && (
        <button
          onClick={onClear}
          className={`p-1 rounded-3xl absolute right-3 top-1/2 transform -translate-y-1/2 
            ${isDarkmode ? 'bg-gray-200 dark:bg-gray-200 text-gray-500 hover:text-gray-600 dark:hover:text-gray-600' 
              : 'bg-gray-500 dark:bg-gray-500 text-gray-200 hover:text-gray-300 dark:hover:text-gray-300' }`}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;