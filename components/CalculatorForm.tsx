import React, { useState, useEffect } from 'react';
import type { CalculationParams, PizzaStyle, DoughMethod, PrebuiltRecipe, TegliaShape, TegliaThickness, CustomRecipe } from '../types';
import { Card } from './Card';
import { SliderInput } from './SliderInput';
import { StepSlider } from './StepSlider';
import { Tabs } from './Tabs';
import { TEGLIA_SHAPES, TEGLIA_THICKNESS_LEVELS, TEGLIA_THICKNESS_MAP } from '../constants';
import { RecipeDetailModal } from './RecipeDetailModal';


interface CalculatorFormProps {
  params: CalculationParams;
  onParamChange: <K extends keyof CalculationParams>(param: K, value: CalculationParams[K]) => void;
  onStyleChange: (style: PizzaStyle) => void;
  onMethodChange: (method: DoughMethod) => void;
  pizzaStyles: PizzaStyle[];
  doughMethods: DoughMethod[];
  recipes: Record<PizzaStyle, PrebuiltRecipe[]>;
  customRecipes: CustomRecipe[];
  selectedRecipeIdentifier: string | null;
  onRecipeSelect: (recipe: PrebuiltRecipe | CustomRecipe) => void;
  onDeleteCustomRecipe: (id: string) => void;
}

const icons = {
  hydration: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500 rotate-180" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2C6.66 2 4 4.8 4 8.13 4 12.42 10 18 10 18s6-5.58 6-9.87C16 4.8 13.34 2 10 2z" /></svg>,
  salt: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1h-2V4H7v1H5V4zM5 7h10v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="11" r="1" /><circle cx="10" cy="14" r="1" /></svg>,
  freshYeast: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" /><path fillRule="evenodd" d="M2 5a3 3 0 013-3h10a3 3 0 013 3v5a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v5a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd" /></svg>,
  malt: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-700" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 9a1 1 0 000 2h14a1 1 0 100-2H3zM2 13a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>,
  oliveOil: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 10.155a5.964 5.964 0 013.522-3.522.5.5 0 01.66.66 4.964 4.964 0 00-2.936 2.936.5.5 0 01-.66-.66z" clipRule="evenodd" /></svg>,
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{children}</h3>
);

const NumberInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
}> = ({ label, value, onChange, step = 1, min = 1 }) => {
  const handleIncrement = () => onChange(value + step);
  const handleDecrement = () => {
    const newValue = value - step;
    onChange(newValue >= min ? newValue : min);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      onChange(numValue);
    } else if (e.target.value === '') {
      // Allow clearing the input
    } else {
      onChange(min);
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (isNaN(numValue) || numValue < min) {
      onChange(min);
    }
  }

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label={`Decrease ${label}`}
          className="px-4 h-11 flex items-center justify-center border border-r-0 border-gray-300 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#D94F2B] focus:outline-none z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          step={step}
          min={min}
          className="w-full px-2 h-11 text-center border-y border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#D94F2B] focus:border-[#D94F2B] focus:outline-none z-0 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          aria-label={`Increase ${label}`}
          className="px-4 h-11 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-[#D94F2B] focus:outline-none z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
    </div>
  );
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  params,
  onParamChange,
  onStyleChange,
  onMethodChange,
  pizzaStyles,
  doughMethods,
  recipes,
  customRecipes,
  selectedRecipeIdentifier,
  onRecipeSelect,
  onDeleteCustomRecipe,
}) => {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState<PrebuiltRecipe | null>(null);
  const [activeRecipeTab, setActiveRecipeTab] = useState<'pre-built' | 'my-recipes'>('pre-built');
  
  const { 
    pizzaStyle, 
    tegliaShape, tegliaDiameter, tegliaLength, tegliaWidth, tegliaThickness,
    focacciaShape, focacciaDiameter, focacciaLength, focacciaWidth, focacciaThickness 
  } = params;
  
  const recipesForStyle = recipes[pizzaStyle] || [];
  const customRecipesForStyle = customRecipes.filter(r => r.pizzaStyle === pizzaStyle);

  const isTeglia = pizzaStyle === 'Teglia';
  const isFocaccia = pizzaStyle === 'Focaccia';
  const showTrayControls = isTeglia || isFocaccia;

  useEffect(() => {
    // When pizza style changes, collapse the recipe list and switch to pre-built
    setShowAllRecipes(false);
    setActiveRecipeTab('pre-built');
  }, [pizzaStyle]);

  // Effect to auto-calculate ball weight for Teglia or Focaccia pizza
  useEffect(() => {
    if (!showTrayControls) return;

    const shape = isTeglia ? tegliaShape : focacciaShape;
    const diameter = isTeglia ? tegliaDiameter : focacciaDiameter;
    const length = isTeglia ? tegliaLength : focacciaLength;
    const width = isTeglia ? tegliaWidth : focacciaWidth;
    const thickness = isTeglia ? tegliaThickness : focacciaThickness;
    
    const thicknessMultiplier = TEGLIA_THICKNESS_MAP[thickness];
    let area = 0;

    if (shape === 'round') {
        const radius = diameter / 2;
        area = Math.PI * radius * radius;
    } else { // square
        area = length * width;
    }

    const baseWeight = area / 2; // Dough weight calculation factor
    const newWeight = Math.round(baseWeight * thicknessMultiplier);

    if (newWeight > 0) {
        onParamChange('ballWeight', newWeight);
    }
  }, [
    pizzaStyle, 
    tegliaShape, tegliaDiameter, tegliaLength, tegliaWidth, tegliaThickness, 
    focacciaShape, focacciaDiameter, focacciaLength, focacciaWidth, focacciaThickness,
    onParamChange
  ]);

  const displayedRecipes = showAllRecipes ? recipesForStyle : recipesForStyle.slice(0, 2);

  return (
    <>
      <Card>
        <div className="space-y-8">
          <div>
            <SectionHeader>Pizza Style</SectionHeader>
            <Tabs options={pizzaStyles} selected={params.pizzaStyle} onSelect={(opt) => onStyleChange(opt as PizzaStyle)} />
          </div>

          {(recipesForStyle.length > 0 || customRecipesForStyle.length > 0) && (
            <div>
              <SectionHeader>Recipes</SectionHeader>
              <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                <button
                  onClick={() => setActiveRecipeTab('pre-built')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${activeRecipeTab === 'pre-built' ? 'border-b-2 border-[#D94F2B] text-[#D94F2B]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  Pre-built
                </button>
                <button
                  onClick={() => setActiveRecipeTab('my-recipes')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${activeRecipeTab === 'my-recipes' ? 'border-b-2 border-[#D94F2B] text-[#D94F2B]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  My Recipes ({customRecipesForStyle.length})
                </button>
              </div>

              {activeRecipeTab === 'pre-built' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayedRecipes.map(recipe => (
                      <div key={recipe.name} className="relative">
                        <button
                          type="button"
                          onClick={() => onRecipeSelect(recipe)}
                          className={`w-full h-full text-left p-3 pr-10 rounded-lg border-2 transition-all duration-200 ${
                            selectedRecipeIdentifier === recipe.name
                              ? 'border-[#D94F2B] bg-[#D94F2B]/10 dark:bg-[#D94F2B]/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-[#D94F2B]/50 dark:hover:border-[#D94F2B] bg-slate-50 dark:bg-slate-800/50'
                          }`}
                        >
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{recipe.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
                        </button>
                        <button
                          type="button"
                          aria-label={`View details for ${recipe.name}`}
                          onClick={(e) => { e.stopPropagation(); setDetailedRecipe(recipe); }}
                          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D94F2B]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  {recipesForStyle.length > 2 && (
                    <div className="mt-4 text-center">
                      <button type="button" onClick={() => setShowAllRecipes(prev => !prev)} className="text-sm font-semibold text-[#D94F2B] hover:text-[#c04524] dark:hover:text-orange-400 focus:outline-none focus:underline">
                        {showAllRecipes ? 'Show Less' : `Show ${recipesForStyle.length - 2} more...`}
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {activeRecipeTab === 'my-recipes' && (
                customRecipesForStyle.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customRecipesForStyle.map(recipe => (
                       <div key={recipe.id} className="relative">
                        <button
                          type="button"
                          onClick={() => onRecipeSelect(recipe)}
                          className={`w-full h-full text-left p-3 pr-10 rounded-lg border-2 transition-all duration-200 ${
                            selectedRecipeIdentifier === recipe.id
                              ? 'border-[#D94F2B] bg-[#D94F2B]/10 dark:bg-[#D94F2B]/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-[#D94F2B]/50 dark:hover:border-[#D94F2B] bg-slate-50 dark:bg-slate-800/50'
                          }`}
                        >
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{recipe.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete recipe ${recipe.name}`}
                          onClick={(e) => { e.stopPropagation(); onDeleteCustomRecipe(recipe.id); }}
                          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p>You haven't saved any {pizzaStyle} recipes yet.</p>
                    <p className="text-sm mt-1">Create a recipe and click "Save" in the results panel.</p>
                  </div>
                )
              )}

            </div>
          )}
          
          <div>
            <SectionHeader>Dough Method</SectionHeader>
            <Tabs options={doughMethods} selected={params.doughMethod} onSelect={(opt) => onMethodChange(opt as DoughMethod)} />
          </div>

          <div>
            <SectionHeader>Quantity</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label="Number of Dough Balls" value={params.ballCount} onChange={(v) => onParamChange('ballCount', v)} min={1} />
            </div>

            {showTrayControls && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Tray Size &amp; Thickness</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">Define your tray size to automatically calculate the required dough weight.</p>
                  
                  <Tabs 
                    options={TEGLIA_SHAPES} 
                    selected={isTeglia ? params.tegliaShape : params.focacciaShape} 
                    onSelect={(v) => onParamChange(isTeglia ? 'tegliaShape' : 'focacciaShape', v as TegliaShape)} 
                  />

                  {(isTeglia ? params.tegliaShape : params.focacciaShape) === 'square' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <NumberInput 
                        label="Length (cm)" 
                        value={isTeglia ? params.tegliaLength : params.focacciaLength} 
                        onChange={(v) => onParamChange(isTeglia ? 'tegliaLength' : 'focacciaLength', v)} 
                        min={10} 
                      />
                      <NumberInput 
                        label="Width (cm)" 
                        value={isTeglia ? params.tegliaWidth : params.focacciaWidth} 
                        onChange={(v) => onParamChange(isTeglia ? 'tegliaWidth' : 'focacciaWidth', v)} 
                        min={10} 
                      />
                    </div>
                  ) : (
                    <NumberInput 
                      label="Diameter (cm)" 
                      value={isTeglia ? params.tegliaDiameter : params.focacciaDiameter} 
                      onChange={(v) => onParamChange(isTeglia ? 'tegliaDiameter' : 'focacciaDiameter', v)} 
                      min={10} 
                    />
                  )}

                  <StepSlider 
                    label="Thickness"
                    options={TEGLIA_THICKNESS_LEVELS}
                    value={isTeglia ? params.tegliaThickness : params.focacciaThickness}
                    onChange={(v) => onParamChange(isTeglia ? 'tegliaThickness' : 'focacciaThickness', v as TegliaThickness)}
                  />
              </div>
            )}
            <div className="mt-4">
              <NumberInput label="Weight per Ball (gr)" value={params.ballWeight} onChange={(v) => onParamChange('ballWeight', v)} step={10} min={10} />
            </div>
          </div>

          <div>
            <SectionHeader>Dough Parameters</SectionHeader>
            <div className="space-y-4">
                <SliderInput icon={icons.hydration} label="Hydration" value={params.hydration} onChange={(v) => onParamChange('hydration', v)} min={40} max={100} step={0.5} unit="%" />
                <SliderInput icon={icons.salt} label="Salt" value={params.salt} onChange={(v) => onParamChange('salt', v)} min={0} max={5} step={0.1} unit="%" />
                <SliderInput icon={icons.freshYeast} label="Fresh Yeast" value={params.freshYeast} onChange={(v) => onParamChange('freshYeast', v)} min={0} max={3} step={0.1} unit="%" />
                <SliderInput icon={icons.malt} label="Malt" value={params.malt} onChange={(v) => onParamChange('malt', v)} min={0} max={5} step={0.1} unit="%" />
                <SliderInput icon={icons.oliveOil} label="Olive Oil" value={params.oliveOil} onChange={(v) => onParamChange('oliveOil', v)} min={0} max={10} step={0.1} unit="%" />
            </div>
          </div>

          {params.doughMethod === 'Biga' && (
            <div>
              <SectionHeader>Biga Parameters</SectionHeader>
              <div className="space-y-4">
                  <SliderInput label="Biga Percentage" value={params.bigaPercentage} onChange={(v) => onParamChange('bigaPercentage', v)} min={10} max={100} unit="%" />
                  <SliderInput label="Biga Hydration" value={params.bigaHydration} onChange={(v) => onParamChange('bigaHydration', v)} min={40} max={60} unit="%" />
                  <SliderInput label="Biga Fresh Yeast" value={params.bigaFreshYeast} onChange={(v) => onParamChange('bigaFreshYeast', v)} min={0} max={1} step={0.01} unit="%" />
              </div>
            </div>
          )}

          {params.doughMethod === 'Poolish' && (
            <div>
              <SectionHeader>Poolish Parameters</SectionHeader>
              <div className="space-y-4">
                  <SliderInput label="Poolish Percentage" value={params.poolishPercentage} onChange={(v) => onParamChange('poolishPercentage', v)} min={10} max={50} unit="%" />
                  <SliderInput label="Maturation Hours" value={params.poolishHours} onChange={(v) => onParamChange('poolishHours', v)} min={1} max={18} unit="h" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {detailedRecipe && (
        <RecipeDetailModal
          recipe={detailedRecipe}
          onClose={() => setDetailedRecipe(null)}
        />
      )}
    </>
  );
};