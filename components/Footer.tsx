
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-transparent mt-12 py-6">
    <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Dough Calculator. Built with passion for home-made pizza. Version 1.6</p>
    </div>
  </footer>
);
