import type { CalculationParams, DoughStyle, DoughMethod, TegliaShape, TegliaThickness } from './types';

export const DOUGH_STYLES: DoughStyle[] = ['Napoletana', 'Tonda Romana', 'Teglia Romana', 'Focaccia', 'Bread', 'Buns'];
export const DOUGH_METHODS: DoughMethod[] = ['Direct', 'Biga', 'Poolish'];

export const TEGLIA_SHAPES: TegliaShape[] = ['square', 'round'];
export const TEGLIA_THICKNESS_LEVELS: readonly TegliaThickness[] = ['very thin', 'thin', 'normal', 'thick', 'very thick'];
export const TEGLIA_THICKNESS_MAP: { [key in TegliaThickness]: number } = {
  'very thin': 0.70,
  'thin': 0.85,
  'normal': 1.00,
  'thick': 1.10,
  'very thick': 1.20,
};

export const DEFAULT_PARAMS: CalculationParams = {
  doughStyle: 'Napoletana',
  doughMethod: 'Direct',
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

  tegliaShape: 'square',
  tegliaDiameter: 32,
  tegliaLength: 40,
  tegliaWidth: 30,
  tegliaThickness: 'normal',

  focacciaShape: 'square',
  focacciaDiameter: 32,
  focacciaLength: 40,
  focacciaWidth: 30,
  focacciaThickness: 'normal',

  sugar: 0,
  wholeEgg: 0,
  eggYolk: 0,
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