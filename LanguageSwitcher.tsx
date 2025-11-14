import React from 'react';
import { useLanguage } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, t } = useLanguage();

  const { setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  const nextLanguageLabel = language === 'en' ? t('language.switchToItalian') : t('language.switchToEnglish');
  const nextLanguageEmoji = language === 'en' ? '🇮🇹' : '🇬🇧';

  return (
    <button
      onClick={toggleLanguage}
      aria-label={nextLanguageLabel}
      title={nextLanguageLabel}
      className="flex items-center justify-center h-10 w-10 text-xl font-medium bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-900 transition-colors"
    >
      {nextLanguageEmoji}
    </button>
  );
};
