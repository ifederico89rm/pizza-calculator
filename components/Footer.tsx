
import React from 'react';
import { useLanguage } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-transparent mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.builtWith')}. {t('footer.version')} 1.8</p>
      </div>
    </footer>
  );
};
