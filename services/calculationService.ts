import type { CalculationParams, CalculationResult, IngredientSet } from '../types';
import { POOLISH_YEAST_MAP } from '../constants';

const round = (value: number) => Math.round(value * 100) / 100;

const getPoolishYeastPercent = (hours: number): number => {
  const validHours = Object.keys(POOLISH_YEAST_MAP).map(Number);
  const closestHour = validHours.reduce((prev, curr) => 
    (Math.abs(curr - hours) < Math.abs(prev - hours) ? curr : prev)
  );
  return POOLISH_YEAST_MAP[closestHour];
};


export const calculateDough = (params: CalculationParams): CalculationResult => {
  const totalDoughWeight = params.ballCount * params.ballWeight;

  const oilPercent = params.pizzaStyle === 'Romana' && params.oliveOil === 0 ? 3 : params.oliveOil;

  const flourFactor = 1 +
    (params.hydration / 100) +
    (params.salt / 100) +
    (oilPercent / 100) +
    (params.malt / 100) +
    (params.freshYeast / 100);

  const totalFlour = totalDoughWeight / flourFactor;

  switch (params.doughMethod) {
    case 'Biga':
      return calculateBiga(params, totalFlour, totalDoughWeight, oilPercent);
    case 'Poolish':
      return calculatePoolish(params, totalFlour, totalDoughWeight, oilPercent);
    case 'Diretto':
    default:
      return calculateDirect(params, totalFlour, totalDoughWeight, oilPercent);
  }
};

const calculateDirect = (params: CalculationParams, totalFlour: number, totalDoughWeight: number, oilPercent: number): CalculationResult => {
  const finalDough: IngredientSet = {
    flour: round(totalFlour),
    water: round(totalFlour * (params.hydration / 100)),
    salt: round(totalFlour * (params.salt / 100)),
    freshYeast: round(totalFlour * (params.freshYeast / 100)),
    oliveOil: round(totalFlour * (oilPercent / 100)),
    malt: round(totalFlour * (params.malt / 100)),
  };
  finalDough.total = Object.values(finalDough).reduce((sum, val) => sum + val, 0);

  return {
    finalDough,
    totalDoughWeight: round(totalDoughWeight),
    totalFlour: round(totalFlour)
  };
};

const calculateBiga = (params: CalculationParams, totalFlour: number, totalDoughWeight: number, oilPercent: number): CalculationResult => {
  const bigaFlour = totalFlour * (params.bigaPercentage / 100);
  const bigaWater = bigaFlour * (params.bigaHydration / 100);
  const bigaYeast = bigaFlour * (params.bigaFreshYeast / 100);

  const preferment: IngredientSet & { name: string } = {
    name: 'Biga',
    flour: round(bigaFlour),
    water: round(bigaWater),
    freshYeast: round(bigaYeast),
    salt: 0,
    oliveOil: 0,
    malt: 0
  };
  preferment.total = Object.values(preferment).reduce((sum, val) => sum + val, 0);

  const finalDough: IngredientSet = {
    flour: round(totalFlour - bigaFlour),
    water: round(totalFlour * (params.hydration / 100) - bigaWater),
    salt: round(totalFlour * (params.salt / 100)),
    freshYeast: round(totalFlour * (params.freshYeast / 100) - bigaYeast),
    oliveOil: round(totalFlour * (oilPercent / 100)),
    malt: round(totalFlour * (params.malt / 100)),
  };
  finalDough.total = Object.values(finalDough).reduce((sum, val) => sum + val, 0);

  return {
    finalDough,
    preferment,
    totalDoughWeight: round(totalDoughWeight),
    totalFlour: round(totalFlour)
  };
};

const calculatePoolish = (params: CalculationParams, totalFlour: number, totalDoughWeight: number, oilPercent: number): CalculationResult => {
  const poolishYeastPercent = getPoolishYeastPercent(params.poolishHours);
  
  const poolishFlour = totalFlour * (params.poolishPercentage / 100);
  const poolishWater = poolishFlour; // 100% hydration
  const poolishYeast = poolishFlour * (poolishYeastPercent / 100);

  const preferment: IngredientSet & { name: string } = {
    name: 'Poolish',
    flour: round(poolishFlour),
    water: round(poolishWater),
    freshYeast: round(poolishYeast),
    salt: 0,
    oliveOil: 0,
    malt: 0
  };
  preferment.total = Object.values(preferment).reduce((sum, val) => sum + val, 0);

  const finalDough: IngredientSet = {
    flour: round(totalFlour - poolishFlour),
    water: round(totalFlour * (params.hydration / 100) - poolishWater),
    salt: round(totalFlour * (params.salt / 100)),
    freshYeast: round(totalFlour * (params.freshYeast / 100) - poolishYeast),
    oliveOil: round(totalFlour * (oilPercent / 100)),
    malt: round(totalFlour * (params.malt / 100)),
  };
  finalDough.total = Object.values(finalDough).reduce((sum, val) => sum + val, 0);

  return {
    finalDough,
    preferment,
    totalDoughWeight: round(totalDoughWeight),
    totalFlour: round(totalFlour)
  };
};