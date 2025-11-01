import React from 'react';

interface TabsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ options, selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl">
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
          {option}
        </button>
      ))}
    </div>
  );
};