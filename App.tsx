import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import { SaveRecipeModal } from './components/SaveRecipeModal';
import type { CalculationParams, CalculationResult, DoughStyle, DoughMethod, PrebuiltRecipe, CustomRecipe } from './types';
import { calculateDough } from './services/calculationService';
import { getCustomRecipes, saveCustomRecipes } from './services/recipeService';
import { DOUGH_STYLES, DOUGH_METHODS, DEFAULT_PARAMS } from './constants';
import { PREBUILT_RECIPES } from './data/recipes';

const App: React.FC = () => {
  const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [selectedRecipeIdentifier, setSelectedRecipeIdentifier] = useState<string | null>(null);
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>(() => getCustomRecipes());
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  // Effect to persist custom recipes to localStorage whenever they change
  useEffect(() => {
    saveCustomRecipes(customRecipes);
  }, [customRecipes]);

  const handleParamChange = useCallback(<K extends keyof CalculationParams>(param: K, value: CalculationParams[K]) => {
    setSelectedRecipeIdentifier(null); // Any manual change deselects any recipe
    setParams(prevParams => ({ ...prevParams, [param]: value }));
  }, []);

  const handleDoughStyleChange = useCallback((style: DoughStyle) => {
    setSelectedRecipeIdentifier(null);
    setParams(prev => ({
      ...DEFAULT_PARAMS, 
      doughStyle: style, 
      ballCount: style === 'Buns' ? 18 : (prev.doughStyle === 'Buns' ? DEFAULT_PARAMS.ballCount : prev.ballCount),
      ballWeight: style === 'Buns' ? 100 : DEFAULT_PARAMS.ballWeight
    }));
  }, []);

  const handleMethodChange = useCallback((method: DoughMethod) => {
    setSelectedRecipeIdentifier(null);
    setParams(prev => ({ ...prev, doughMethod: method }));
  }, []);
  
  const handleRecipeSelect = useCallback((recipe: PrebuiltRecipe | CustomRecipe) => {
    // Check if it's a custom recipe by looking for the 'id' property
    if ('id' in recipe) {
      setParams(recipe.params);
      setSelectedRecipeIdentifier(recipe.id);
    } else { // It's a pre-built recipe
      setParams(prevParams => {
        const newState = {
          ...DEFAULT_PARAMS,
          doughStyle: prevParams.doughStyle,
          ballCount: prevParams.ballCount,
          ballWeight: prevParams.ballWeight,
        };
        return { ...newState, ...recipe.params };
      });
      setSelectedRecipeIdentifier(recipe.name);
    }
  }, []);
  
  const handleSaveCustomRecipe = useCallback((name: string, description: string) => {
    const newRecipe: CustomRecipe = {
      id: Date.now().toString(),
      name,
      description,
      doughStyle: params.doughStyle,
      params: { ...params }, // Save a snapshot of the current params
    };
    setCustomRecipes(prev => [...prev, newRecipe]);
    setIsSaveModalOpen(false);
  }, [params]);

  const handleDeleteCustomRecipe = useCallback((recipeId: string) => {
    setCustomRecipes(prev => prev.filter(r => r.id !== recipeId));
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
              onDoughStyleChange={handleDoughStyleChange}
              onMethodChange={handleMethodChange}
              doughStyles={DOUGH_STYLES}
              doughMethods={DOUGH_METHODS}
              recipes={PREBUILT_RECIPES}
              customRecipes={customRecipes}
              selectedRecipeIdentifier={selectedRecipeIdentifier}
              onRecipeSelect={handleRecipeSelect}
              onDeleteCustomRecipe={handleDeleteCustomRecipe}
            />
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay 
              results={results} 
              params={params}
              onOpenSaveModal={() => setIsSaveModalOpen(true)}
            />
          </div>
        </div>
      </main>
      <Footer />
      {isSaveModalOpen && (
        <SaveRecipeModal 
          onSave={handleSaveCustomRecipe}
          onClose={() => setIsSaveModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;