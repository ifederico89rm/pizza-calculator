import React, { useState, useEffect } from 'react';
import type { CalculationParams, DoughStyle, DoughMethod, PrebuiltRecipe, TegliaShape, TegliaThickness, CustomRecipe } from '../types';
import { Card } from './Card';
import { SliderInput } from './SliderInput';
import { StepSlider } from './StepSlider';
import { Tabs } from './Tabs';
import { TEGLIA_SHAPES, TEGLIA_THICKNESS_LEVELS, TEGLIA_THICKNESS_MAP } from '../constants';
import { RecipeDetailModal } from './RecipeDetailModal';
import { useLanguage } from '../i18n';


interface CalculatorFormProps {
  params: CalculationParams;
  onParamChange: <K extends keyof CalculationParams>(param: K, value: CalculationParams[K]) => void;
  onDoughStyleChange: (style: DoughStyle) => void;
  onMethodChange: (method: DoughMethod) => void;
  doughStyles: DoughStyle[];
  doughMethods: DoughMethod[];
  recipes: Record<DoughStyle, PrebuiltRecipe[]>;
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
  butter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M4 8a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" /></svg>,
  sugar: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M6 2a1 1 0 00-1 1v1H4a1 1 0 000 2h1v1a1 1 0 001 1h2a1 1 0 001-1V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H6zM4 9a1 1 0 011-1h1v1a1 1 0 01-1 1H4a1 1 0 01-1-1zm2 2a1 1 0 00-1 1v1H4a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2H7v-1a1 1 0 00-1-1zm4-2a1 1 0 011-1h1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1zm2 2a1 1 0 00-1 1v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1zM9 2a1 1 0 00-1 1v1H7a1 1 0 100 2h1v1a1 1 0 102 0V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H9z" /></svg>,
  wholeEgg: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-200" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 00-5 5c0 3.866 5 11 5 11s5-7.134 5-11a5 5 0 00-5-5z" /></svg>,
  eggYolk: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a4 4 0 100 8 4 4 0 000-8z" /><path fillRule="evenodd" d="M1.018 7.243a1 1 0 011.314-1.503l.035.029 2.406 1.925a1 1 0 01-1.22 1.598l-2.43-1.95a1 1 0 01-.105-.099zM15.227 5.77a1 1 0 011.313 1.504l-2.43 1.95a1 1 0 01-1.22-1.598l2.3-1.825.037-.031z" clipRule="evenodd" /></svg>,
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
  const { t } = useLanguage();
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
          aria-label={t('form.aria.decrease', { label })}
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
          aria-label={t('form.aria.increase', { label })}
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
  onDoughStyleChange,
  onMethodChange,
  doughStyles,
  doughMethods,
  recipes,
  customRecipes,
  selectedRecipeIdentifier,
  onRecipeSelect,
  onDeleteCustomRecipe,
}) => {
  const { t } = useLanguage();
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [detailedRecipe, setDetailedRecipe] = useState<PrebuiltRecipe | null>(null);
  const [activeRecipeTab, setActiveRecipeTab] = useState<'pre-built' | 'my-recipes'>('pre-built');
  
  const { 
    doughStyle, 
    tegliaShape, tegliaDiameter, tegliaLength, tegliaWidth, tegliaThickness,
    focacciaShape, focacciaDiameter, focacciaLength, focacciaWidth, focacciaThickness 
  } = params;
  
  const recipesForStyle = recipes[doughStyle] || [];
  const customRecipesForStyle = customRecipes.filter(r => r.doughStyle === doughStyle);

  const isTeglia = doughStyle === 'Teglia Romana';
  const isFocaccia = doughStyle === 'Focaccia';
  const showTrayControls = isTeglia || isFocaccia;

  useEffect(() => {
    // When dough style changes, collapse the recipe list and switch to pre-built
    setShowAllRecipes(false);
    setActiveRecipeTab('pre-built');
  }, [doughStyle]);

  // Effect to ensure poolish percentage doesn't exceed hydration
  useEffect(() => {
    if (params.doughMethod === 'Poolish' && params.poolishPercentage > params.hydration) {
      onParamChange('poolishPercentage', params.hydration);
    }
  }, [params.hydration, params.doughMethod, params.poolishPercentage, onParamChange]);

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
    doughStyle, 
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
            <SectionHeader>{t('form.doughStyle')}</SectionHeader>
            <Tabs 
              options={doughStyles} 
              selected={params.doughStyle} 
              onSelect={(opt) => onDoughStyleChange(opt as DoughStyle)}
              translateFn={(key) => t(`doughStyles.${key}`)}
            />
          </div>

          {(recipesForStyle.length > 0 || customRecipesForStyle.length > 0) && (
            <div>
              <SectionHeader>{t('form.recipes.title')}</SectionHeader>
              <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                <button
                  onClick={() => setActiveRecipeTab('pre-built')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${activeRecipeTab === 'pre-built' ? 'border-b-2 border-[#D94F2B] text-[#D94F2B]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  {t('form.recipes.prebuilt')}
                </button>
                <button
                  onClick={() => setActiveRecipeTab('my-recipes')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${activeRecipeTab === 'my-recipes' ? 'border-b-2 border-[#D94F2B] text-[#D94F2B]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  {t('form.recipes.myRecipes')} ({customRecipesForStyle.length})
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
                          aria-label={t('form.aria.viewDetails', { recipeName: recipe.name })}
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
                        {showAllRecipes ? t('form.recipes.showLess') : t('form.recipes.showMore', { count: recipesForStyle.length - 2 })}
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
                          aria-label={t('form.aria.deleteRecipe', { recipeName: recipe.name })}
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
                    <p>{t('form.recipes.noCustomRecipes', { doughStyle: t(`doughStyles.${doughStyle}`) })}</p>
                    <p className="text-sm mt-1">{t('form.recipes.noCustomRecipesHint')}</p>
                  </div>
                )
              )}

            </div>
          )}
          
          <div>
            <SectionHeader>{t('form.doughMethod')}</SectionHeader>
            <Tabs 
              options={doughMethods} 
              selected={params.doughMethod} 
              onSelect={(opt) => onMethodChange(opt as DoughMethod)} 
              translateFn={(key) => t(`doughMethods.${key}`)}
            />
          </div>

          <div>
            <SectionHeader>{t('form.quantity.title')}</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput label={t('form.quantity.ballCount')} value={params.ballCount} onChange={(v) => onParamChange('ballCount', v)} min={1} />
            </div>

            {showTrayControls && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('form.quantity.tray.title')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">{t('form.quantity.tray.description')}</p>
                  
                  <Tabs 
                    options={TEGLIA_SHAPES} 
                    selected={isTeglia ? params.tegliaShape : params.focacciaShape} 
                    onSelect={(v) => onParamChange(isTeglia ? 'tegliaShape' : 'focacciaShape', v as TegliaShape)} 
                    translateFn={(key) => t(`tegliaShapes.${key}`)}
                  />

                  {(isTeglia ? params.tegliaShape : params.focacciaShape) === 'square' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <NumberInput 
                        label={`${t('form.quantity.tray.length')} (cm)`}
                        value={isTeglia ? params.tegliaLength : params.focacciaLength} 
                        onChange={(v) => onParamChange(isTeglia ? 'tegliaLength' : 'focacciaLength', v)} 
                        min={10} 
                      />
                      <NumberInput 
                        label={`${t('form.quantity.tray.width')} (cm)`}
                        value={isTeglia ? params.tegliaWidth : params.focacciaWidth} 
                        onChange={(v) => onParamChange(isTeglia ? 'tegliaWidth' : 'focacciaWidth', v)} 
                        min={10} 
                      />
                    </div>
                  ) : (
                    <NumberInput 
                      label={`${t('form.quantity.tray.diameter')} (cm)`}
                      value={isTeglia ? params.tegliaDiameter : params.focacciaDiameter} 
                      onChange={(v) => onParamChange(isTeglia ? 'tegliaDiameter' : 'focacciaDiameter', v)} 
                      min={10} 
                    />
                  )}

                  <StepSlider 
                    label={t('form.quantity.tray.thickness')}
                    options={TEGLIA_THICKNESS_LEVELS}
                    value={isTeglia ? params.tegliaThickness : params.focacciaThickness}
                    onChange={(v) => onParamChange(isTeglia ? 'tegliaThickness' : 'focacciaThickness', v as TegliaThickness)}
                    translateFn={(key) => t(`tegliaThicknesses.${key}`)}
                  />
              </div>
            )}
            <div className="mt-4">
              <NumberInput label={`${t('form.quantity.ballWeight')} (gr)`} value={params.ballWeight} onChange={(v) => onParamChange('ballWeight', v)} step={10} min={10} />
            </div>
          </div>

          <div>
            <SectionHeader>{t('form.parameters.title')}</SectionHeader>
            {params.doughStyle === 'Buns' ? (
              <div className="space-y-4">
                <SliderInput icon={icons.hydration} label={t('ingredients.milk')} value={params.hydration} onChange={(v) => onParamChange('hydration', v)} min={40} max={100} step={0.5} unit="%" />
                <SliderInput icon={icons.butter} label={t('ingredients.butter')} value={params.oliveOil} onChange={(v) => onParamChange('oliveOil', v)} min={0} max={30} step={0.5} unit="%" />
                <SliderInput icon={icons.sugar} label={t('ingredients.sugar')} value={params.sugar} onChange={(v) => onParamChange('sugar', v)} min={0} max={30} step={0.5} unit="%" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <NumberInput label={t('ingredients.wholeEgg')} value={params.wholeEgg} onChange={(v) => onParamChange('wholeEgg', v)} min={0} />
                  <NumberInput label={t('ingredients.eggYolk')} value={params.eggYolk} onChange={(v) => onParamChange('eggYolk', v)} min={0} />
                </div>
                <SliderInput icon={icons.malt} label={t('ingredients.malt')} value={params.malt} onChange={(v) => onParamChange('malt', v)} min={0} max={10} step={0.1} unit="%" />
                <SliderInput icon={icons.salt} label={t('ingredients.salt')} value={params.salt} onChange={(v) => onParamChange('salt', v)} min={0} max={5} step={0.1} unit="%" />
                <SliderInput icon={icons.freshYeast} label={t('ingredients.freshYeast')} value={params.freshYeast} onChange={(v) => onParamChange('freshYeast', v)} min={0} max={10} step={0.1} unit="%" />
              </div>
            ) : (
              <div className="space-y-4">
                <SliderInput icon={icons.hydration} label={t('ingredients.hydration')} value={params.hydration} onChange={(v) => onParamChange('hydration', v)} min={40} max={100} step={0.5} unit="%" />
                <SliderInput icon={icons.salt} label={t('ingredients.salt')} value={params.salt} onChange={(v) => onParamChange('salt', v)} min={0} max={5} step={0.1} unit="%" />
                <SliderInput icon={icons.freshYeast} label={t('ingredients.freshYeast')} value={params.freshYeast} onChange={(v) => onParamChange('freshYeast', v)} min={0} max={3} step={0.1} unit="%" />
                <SliderInput icon={icons.malt} label={t('ingredients.malt')} value={params.malt} onChange={(v) => onParamChange('malt', v)} min={0} max={5} step={0.1} unit="%" />
                <SliderInput icon={icons.oliveOil} label={t('ingredients.oliveOil')} value={params.oliveOil} onChange={(v) => onParamChange('oliveOil', v)} min={0} max={10} step={0.1} unit="%" />
              </div>
            )}
          </div>

          {params.doughMethod === 'Biga' && (
            <div>
              <SectionHeader>{t('form.parameters.biga.title')}</SectionHeader>
              <div className="space-y-4">
                  <SliderInput label={t('form.parameters.biga.percentage')} value={params.bigaPercentage} onChange={(v) => onParamChange('bigaPercentage', v)} min={10} max={100} unit="%" />
                  <SliderInput label={t('form.parameters.biga.hydration')} value={params.bigaHydration} onChange={(v) => onParamChange('bigaHydration', v)} min={40} max={60} unit="%" />
                  <SliderInput label={t('form.parameters.biga.yeast')} value={params.bigaFreshYeast} onChange={(v) => onParamChange('bigaFreshYeast', v)} min={0} max={1} step={0.01} unit="%" />
              </div>
            </div>
          )}

          {params.doughMethod === 'Poolish' && (
            <div>
              <SectionHeader>{t('form.parameters.poolish.title')}</SectionHeader>
              <div className="space-y-4">
                  <SliderInput label={t('form.parameters.poolish.percentage')} value={params.poolishPercentage} onChange={(v) => onParamChange('poolishPercentage', v)} min={10} max={params.hydration} unit="%" />
                  <SliderInput label={t('form.parameters.poolish.hours')} value={params.poolishHours} onChange={(v) => onParamChange('poolishHours', v)} min={1} max={18} unit="h" />
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
