import React from 'react';

interface TabsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  translateFn?: (key: string) => string;
}

export const Tabs: React.FC<TabsProps> = ({ options, selected, onSelect, translateFn = (key) => key }) => {
  const gridColsClass = options.length === 3 ? 'grid-cols-3' : (options.length > 3 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2');
  
  return (
    <div className={`grid ${gridColsClass} gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-700 focus:ring-[#D94F2B] ${
            selected === option
              ? 'bg-[#D94F2B] text-white shadow'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          {translateFn(option)}
        </button>
      ))}
    </div>
  );
};
