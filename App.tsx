import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import type { CalculationParams, CalculationResult, PizzaStyle, DoughMethod, PrebuiltRecipe } from './types';
import { calculateDough } from './services/calculationService';
import { PIZZA_STYLES, DOUGH_METHODS, DEFAULT_PARAMS } from './constants';
import { PREBUILT_RECIPES } from './data/recipes';

const App: React.FC = () => {
  const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<PrebuiltRecipe | null>(null);

  const handleParamChange = useCallback(<K extends keyof CalculationParams>(param: K, value: CalculationParams[K]) => {
    setSelectedRecipe(null); // Any manual change creates a custom recipe
    setParams(prevParams => ({ ...prevParams, [param]: value }));
  }, []);

  const handleStyleChange = useCallback((style: PizzaStyle) => {
    setSelectedRecipe(null);
    setParams(prev => ({...prev, ...DEFAULT_PARAMS, pizzaStyle: style}));
  }, []);

  const handleMethodChange = useCallback((method: DoughMethod) => {
    setSelectedRecipe(null);
    setParams(prev => ({ ...prev, doughMethod: method }));
  }, []);

  const handleRecipeSelect = useCallback((recipe: PrebuiltRecipe) => {
    setSelectedRecipe(recipe);
    setParams(prevParams => {
      // Create a new base state from defaults, but keep user's quantity and selected style
      const newState = {
        ...DEFAULT_PARAMS,
        pizzaStyle: prevParams.pizzaStyle,
        ballCount: prevParams.ballCount,
        ballWeight: prevParams.ballWeight,
      };
      // Merge recipe params on top
      return { ...newState, ...recipe.params };
    });
  }, []);

  useEffect(() => {
    const newResults = calculateDough(params);
    setResults(newResults);
  }, [params]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <CalculatorForm
              params={params}
              onParamChange={handleParamChange}
              onStyleChange={handleStyleChange}
              onMethodChange={handleMethodChange}
              pizzaStyles={PIZZA_STYLES}
              doughMethods={DOUGH_METHODS}
              recipes={PREBUILT_RECIPES}
              selectedRecipe={selectedRecipe}
              onRecipeSelect={handleRecipeSelect}
            />
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;