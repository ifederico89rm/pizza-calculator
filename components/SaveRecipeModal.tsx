import React, { useState, useEffect } from 'react';
import { Card } from './Card';

interface SaveRecipeModalProps {
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

export const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), description.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-recipe-title"
    >
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-start">
              <h3 id="save-recipe-title" className="text-2xl font-bold text-gray-800 dark:text-gray-200">Save Custom Recipe</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close save recipe modal"
                className="p-2 -mt-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Name</label>
                <input
                  type="text"
                  id="recipe-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-[#D94F2B] focus:border-[#D94F2B]"
                  placeholder="e.g., My Weekend Special"
                />
              </div>
              <div>
                <label htmlFor="recipe-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                  id="recipe-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-[#D94F2B] focus:border-[#D94F2B]"
                  placeholder="e.g., High hydration, 48h cold ferment"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#D94F2B] rounded-md hover:bg-[#c04524] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-800 disabled:opacity-50"
                disabled={!name.trim()}
              >
                Save Recipe
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
