import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange, min, max, step = 1, unit = '', icon }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
     const numValue = parseFloat(e.target.value);
     if (isNaN(numValue) || numValue < min) {
       onChange(min);
     } else if (numValue > max) {
        onChange(max);
     }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {icon}
          {label}
        </label>
        <div className="relative">
          <input 
            type="number" 
            value={value} 
            onChange={handleInputChange}
            onBlur={onBlur}
            min={min}
            max={max}
            step={step}
            className="w-24 text-right p-1 pr-7 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-[#D94F2B] focus:border-[#D94F2B] appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 dark:text-gray-400 pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
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
      </div>
    </div>
  );
};