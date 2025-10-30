import type { PizzaStyle, PrebuiltRecipe } from '../types';

export const PREBUILT_RECIPES: Record<PizzaStyle, PrebuiltRecipe[]> = {
  Napoletana: [
    {
      name: "Classic Neapolitan",
      description: "A traditional recipe for a soft, airy crust, using the direct method.",
      params: {
        doughMethod: 'Diretto',
        hydration: 65,
        salt: 2.8,
        freshYeast: 0.2,
        malt: 0,
        oliveOil: 0,
      }
    }
  ],
  Romana: [],
  Teglia: [],
  Focaccia: [],
};
