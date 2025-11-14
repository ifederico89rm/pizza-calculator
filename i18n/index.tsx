import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { en } from './locales/en';
import { it } from './locales/it';
import { PREBUILT_RECIPES as recipesEn } from '../data/recipes.en';
import { PREBUILT_RECIPES as recipesIt } from '../data/recipes.it';
import type { PrebuiltRecipe, DoughStyle } from '../types';

type Language = 'en' | 'it';

const translations: Record<Language, any> = { en, it };
const recipeData = { en: recipesEn, it: recipesIt };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  recipes: Record<DoughStyle, PrebuiltRecipe[]>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to resolve nested keys like "form.doughStyle"
const resolve = (path: string, obj: any): string | undefined => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : undefined;
  }, obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLang = localStorage.getItem('app-language');
      return (storedLang === 'en' || storedLang === 'it') ? storedLang : 'it'; // Default to Italian
    } catch {
      return 'it';
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem('app-language', lang);
    } catch (error) {
      console.error("Could not save language to localStorage", error);
    }
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = resolve(key, translations[language]) || resolve(key, translations.en) || key;

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{{${rKey}}}`, String(replacements[rKey]));
        });
    }

    return translation;
  }, [language]);

  const recipes = useMemo(() => recipeData[language], [language]);

  const value = { language, setLanguage, t, recipes };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
