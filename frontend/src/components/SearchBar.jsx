import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({isDarkmode, value, onChange, onClear }) => {
  return (
    // Relative: For absolute icon positioning
    <div className="relative md:w-6/12">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkmode.darkMode ? 'text-gray-400' : 'text-gray-500 '}`}/>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=". . ."
        className={`w-full pl-10 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500focus:border-blue-500 
              ${isDarkmode.componentsBgMode}`}
      />
      {value && (
        // Clear button: Appears only if value; right-aligned
        <button
          onClick={onClear}
          className={`p-1 rounded-3xl absolute right-3 top-1/2 transform -translate-y-1/2 
            ${isDarkmode.componentsBgMode}`}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;