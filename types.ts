export type PizzaStyle = 'Napoletana' | 'Romana' | 'Teglia' | 'Focaccia';
export type DoughMethod = 'Direct' | 'Biga' | 'Poolish';
export type TegliaShape = 'square' | 'round';
export type TegliaThickness = 'very thin' | 'thin' | 'normal' | 'thick' | 'very thick';

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

  // Teglia specific
  tegliaShape: TegliaShape;
  tegliaDiameter: number;
  tegliaLength: number;
  tegliaWidth: number;
  tegliaThickness: TegliaThickness;

  // Focaccia specific
  focacciaShape: TegliaShape;
  focacciaDiameter: number;
  focacciaLength: number;
  focacciaWidth: number;
  focacciaThickness: TegliaThickness;
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
  // Detailed instructions
  wFlourPreferment?: string;
  wFlourFinalDough: string;
  bulkFermentation: string;
  proofing: string;
  baking: string;
}

export interface CustomRecipe {
  id: string;
  name: string;
  description: string;
  pizzaStyle: PizzaStyle;
  params: CalculationParams;
}