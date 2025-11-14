

import React from 'react';

interface StepSliderProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  translateFn?: (key: string) => string;
}

export const StepSlider: React.FC<StepSliderProps> = ({ label, options, value, onChange, icon, translateFn = (key) => key }) => {
  const valueIndex = options.indexOf(value);
  const maxIndex = options.length - 1;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    onChange(options[newIndex]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {icon}
          {label}
        </label>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{translateFn(value)}</span>
      </div>
      <div className="relative pt-2">
        <input
          type="range"
          min="0"
          max={maxIndex}
          value={valueIndex > -1 ? valueIndex : 0}
          onChange={handleSliderChange}
          step="1"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-[#D94F2B]
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-[#D94F2B]
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-none
          "
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 -mx-1">
          {options.map((option) => (
            <span key={option} className="flex-1 text-center capitalize">{translateFn(option)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
