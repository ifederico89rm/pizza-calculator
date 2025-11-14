import React, { useEffect } from 'react';
import type { PrebuiltRecipe } from '../types';
import { Card } from './Card';
import { useLanguage } from '../i18n';

interface RecipeDetailModalProps {
  recipe: PrebuiltRecipe;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-[#D94F2B] mb-2">{title}</h4>
    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{children}</div>
  </div>
);

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose }) => {
  const { t } = useLanguage();

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

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h3 id="recipe-title" className="text-3xl font-bold text-gray-800 dark:text-gray-200">{recipe.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{recipe.description}</p>
            </div>
            <button
              onClick={onClose}
              aria-label={t('recipeDetail.close')}
              className="p-2 -mt-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <hr className="my-6 border-slate-200 dark:border-slate-700" />

          <div className="space-y-6">
            <DetailSection title={t('recipeDetail.flourStrength')}>
              {recipe.wFlourPreferment && `${t('recipeDetail.preferment')}: ${recipe.wFlourPreferment}\n`}
              {`${t('recipeDetail.finalDough')}: ${recipe.wFlourFinalDough}`}
            </DetailSection>

            <DetailSection title={t('recipeDetail.bulkFermentation')}>
              {recipe.bulkFermentation}
            </DetailSection>

            <DetailSection title={t('recipeDetail.proofing')}>
              {recipe.proofing}
            </DetailSection>

            <DetailSection title={t('recipeDetail.baking')}>
              {recipe.baking}
            </DetailSection>
          </div>
        </Card>
      </div>
    </div>
  );
};
