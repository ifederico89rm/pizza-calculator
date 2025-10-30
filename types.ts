// FIX: This self-import causes declaration conflicts with types defined in this file.
// import type { PizzaStyle, DoughMethod } from './types';

export type PizzaStyle = 'Napoletana' | 'Romana' | 'Teglia' | 'Focaccia';
export type DoughMethod = 'Diretto' | 'Biga' | 'Poolish';

export interface CalculationParams {
  pizzaStyle: PizzaStyle;
  doughMethod: DoughMethod;
  ballCount: number;
  ballWeight: number;
  hydration: number;
  salt: number;
  oliveOil: number;
  malt: number;
  freshYeast: number;
  
  // Biga specific
  bigaPercentage: number;
  bigaHydration: number;
  bigaFreshYeast: number;

  // Poolish specific
  poolishPercentage: number;
  poolishHours: number;
}

export interface IngredientSet {
  flour: number;
  water: number;
  salt: number;
  freshYeast: number;
  oliveOil: number;
  malt: number;
  total?: number;
}

export interface CalculationResult {
  finalDough: IngredientSet;
  preferment?: IngredientSet & { name: string };
  totalDoughWeight: number;
  totalFlour: number;
}

export interface PrebuiltRecipe {
  name: string;
  description: string;
  params: {
    doughMethod: DoughMethod;
    hydration: number;
    salt: number;
    oliveOil: number;
    malt: number;
    freshYeast: number;
    
    // Optional Biga/Poolish params
    bigaPercentage?: number;
    bigaHydration?: number;
    bigaFreshYeast?: number;

    poolishPercentage?: number;
    poolishHours?: number;
  };
}
