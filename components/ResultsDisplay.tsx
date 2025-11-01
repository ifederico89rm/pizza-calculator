import React from 'react';
import type { CalculationResult, IngredientSet, CalculationParams } from '../types';
import { Card } from './Card';

interface ResultsDisplayProps {
  results: CalculationResult | null;
  params: CalculationParams;
  onOpenSaveModal: () => void;
}

const IngredientTable: React.FC<{ title: string; ingredients: IngredientSet }> = ({ title, ingredients }) => (
  <div>
    <h3 className="text-2xl font-bold mb-3 text-[#D94F2B] dark:text-[#D94F2B]">{title}</h3>
    <ul className="space-y-2">
      {Object.entries(ingredients)
        .filter(([key, value]) => typeof value === 'number' && value > 0 && key !== 'name' && key !== 'total')
        .map(([key, value], index) => (
        <li key={key} className={`flex justify-between items-center p-3 rounded-lg ${index % 2 === 0 ? 'bg-slate-100 dark:bg-slate-800/60' : 'bg-transparent'}`}>
          <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{(value as number).toFixed(1)}gr</span>
        </li>
      ))}
      {ingredients.total && ingredients.total > 0 && (
         <li className="flex justify-between items-center p-3 bg-slate-200 dark:bg-slate-700 rounded-lg mt-3">
          <span className="font-bold text-gray-800 dark:text-gray-200">Total</span>
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{ingredients.total.toFixed(0)}gr</span>
        </li>
      )}
    </ul>
  </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, params, onOpenSaveModal }) => {
  if (!results) {
    return (
      <div className="sticky top-8">
        <Card>
          <div className="text-center text-gray-500 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <h3 className="mt-2 text-lg font-semibold">Your recipe is waiting</h3>
            <p className="mt-1 text-sm text-slate-500">Adjust the parameters on the left to get started.</p>
          </div>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (!results || !params) return;

    const formatIngredients = (ingredients: IngredientSet) => {
      return Object.entries(ingredients)
        .filter(([key, value]) => typeof value === 'number' && value > 0 && key !== 'name' && key !== 'total')
        .map(([key, value]) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
          return `${formattedKey}: ${(value as number).toFixed(1)}gr`;
        })
        .join('\n');
    };

    let message = `🍕 *My ${params.pizzaStyle} Pizza Recipe* 🍕\n\n`;

    message += `*Configuration:*\n`;
    message += `- Method: ${params.doughMethod}\n`;
    message += `- Balls: ${params.ballCount} x ${params.ballWeight}gr\n`;
    message += `- Hydration: ${params.hydration}%\n`;
    message += `- Salt: ${params.salt}%\n`;
    if (params.oliveOil > 0) message += `- Olive Oil: ${params.oliveOil}%\n`;
    if (params.malt > 0) message += `- Malt: ${params.malt}%\n`;
    message += `\n`;

    if (params.doughMethod === 'Biga') {
      message += `*Biga Parameters:*\n`;
      message += `- Percentage: ${params.bigaPercentage}%\n`;
      message += `- Hydration: ${params.bigaHydration}%\n`;
      message += `- Yeast: ${params.bigaFreshYeast}%\n\n`;
    }

    if (params.doughMethod === 'Poolish') {
      message += `*Poolish Parameters:*\n`;
      message += `- Percentage: ${params.poolishPercentage}%\n`;
      message += `- Maturation: ${params.poolishHours} hours\n\n`;
    }

    if (params.pizzaStyle === 'Teglia' || params.pizzaStyle === 'Focaccia') {
      const isTeglia = params.pizzaStyle === 'Teglia';
      const shape = isTeglia ? params.tegliaShape : params.focacciaShape;
      const thickness = isTeglia ? params.tegliaThickness : params.focacciaThickness;
      
      message += `*Tray Info:*\n`;
      if (shape === 'round') {
        const diameter = isTeglia ? params.tegliaDiameter : params.focacciaDiameter;
        message += `- Shape: Round (${diameter}cm)\n`;
      } else {
        const length = isTeglia ? params.tegliaLength : params.focacciaLength;
        const width = isTeglia ? params.tegliaWidth : params.focacciaWidth;
        message += `- Shape: Square (${length} x ${width}cm)\n`;
      }
      message += `- Thickness: ${thickness}\n\n`;
    }

    message += `*Totals:*\n`;
    message += `- Total Flour: ${results.totalFlour.toFixed(0)}gr\n`;
    message += `- Total Dough: ${results.totalDoughWeight.toFixed(0)}gr\n\n`;

    if (results.preferment) {
      message += `*${results.preferment.name} Ingredients:*\n`;
      message += `${formatIngredients(results.preferment)}\n\n`;
    }

    message += `*Final Dough Ingredients:*\n`;
    message += `${formatIngredients(results.finalDough)}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="sticky top-8">
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Recipe</h2>
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg">
              <div>
                  <p className="font-semibold text-slate-600 dark:text-slate-400">Total Flour</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{results.totalFlour.toFixed(0)}gr</p>
              </div>
              <div>
                  <p className="font-semibold text-slate-600 dark:text-slate-400">Total Dough</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{results.totalDoughWeight.toFixed(0)}gr</p>
              </div>
            </div>
          </div>
                    
          {results.preferment && (
            <>
             <hr className="border-slate-200 dark:border-slate-700" />
              <IngredientTable title={results.preferment.name} ingredients={results.preferment} />
            </>
          )}

          <hr className="border-slate-200 dark:border-slate-700" />
          <IngredientTable title="Final Dough" ingredients={results.finalDough} />

          <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenSaveModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#D94F2B] rounded-lg hover:bg-[#c04524] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm3 1h4v2H8V5zm0 4h4v2H8V9z" /></svg>
              Save Recipe
            </button>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#1DA851] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] dark:focus:ring-offset-slate-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.225.651 4.315 1.731 6.086l.287.492-1.24 4.515 4.639-1.219.452.273zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.203 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Share on WhatsApp
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};