import React from 'react';
import PWAInstallButton from './PWAInstallButton';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <svg className="h-10 w-auto text-[#D94F2B]" viewBox="0 0 100 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="25" fontFamily="'Luckiest Guy', cursive" fontSize="30" textAnchor="middle">ALL</text>
          <text x="50" y="55" fontFamily="'Luckiest Guy', cursive" fontSize="30" textAnchor="middle">STYLES</text>
          <text x="50" y="85" fontFamily="'Luckiest Guy', cursive" fontSize="30" textAnchor="middle">PIZZA</text>
        </svg>
        <h1 className="ml-4 text-3xl text-slate-800 dark:text-slate-200">Dough Calculator</h1>
      </div>
      <PWAInstallButton />
    </div>
  </header>
);