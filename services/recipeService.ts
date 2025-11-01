import type { CustomRecipe } from '../types';

const STORAGE_KEY = 'pizza-custom-recipes';

export const getCustomRecipes = (): CustomRecipe[] => {
    try {
        const recipesJSON = localStorage.getItem(STORAGE_KEY);
        return recipesJSON ? JSON.parse(recipesJSON) : [];
    } catch (error) {
        console.error("Failed to load custom recipes from localStorage:", error);
        return [];
    }
};

export const saveCustomRecipes = (recipes: CustomRecipe[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
        console.error("Failed to save custom recipes to localStorage:", error);
    }
};
