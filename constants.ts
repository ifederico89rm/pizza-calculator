import type { CalculationParams, PizzaStyle, DoughMethod } from './types';

export const PIZZA_STYLES: PizzaStyle[] = ['Napoletana', 'Romana', 'Teglia', 'Focaccia'];
export const DOUGH_METHODS: DoughMethod[] = ['Diretto', 'Biga', 'Poolish'];

export const DEFAULT_PARAMS: CalculationParams = {
  pizzaStyle: 'Napoletana',
  doughMethod: 'Diretto',
  ballCount: 4,
  ballWeight: 250,
  hydration: 65,
  salt: 2.5,
  oliveOil: 0,
  malt: 0.5,
  freshYeast: 0.2,
  
  bigaPercentage: 50,
  bigaHydration: 45,
  bigaFreshYeast: 0.1,

  poolishPercentage: 30,
  poolishHours: 8,
};

// Mapping from poolish maturation hours to fresh yeast percentage
export const POOLISH_YEAST_MAP: { [key: number]: number } = {
  1: 2.0,
  2: 1.0,
  3: 0.75, // Interpolated
  4: 0.5,
  5: 0.5,
  6: 0.3,
  7: 0.3,
  8: 0.1,
  9: 0.1,
  10: 0.05,
  11: 0.05,
  12: 0.05,
  13: 0.03,
  14: 0.03,
  15: 0.01,
  16: 0.01,
  17: 0.01,
  18: 0.01,
};