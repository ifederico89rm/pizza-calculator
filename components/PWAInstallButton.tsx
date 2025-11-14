import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';

const PWAInstallButton: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Detect if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if app is not already installed from homescreen
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSDevice && !isStandalone) {
      setIsIos(true);
      setShowInstallButton(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isIOSDevice) {
        setShowInstallButton(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };
  
  if (!showInstallButton) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={t('header.installApp')}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span className="hidden sm:inline">{t('header.installApp')}</span>
      </button>

      {showIosInstructions && (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowIosInstructions(false)}
        >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{t('pwa.ios.title')}</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{t('pwa.ios.description')}</p>
                <div className="flex justify-center items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                   <span>{t('pwa.ios.tap')}</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                   </svg>
                   <span>{t('pwa.ios.addToHome')}</span>
                </div>
                 <button onClick={() => setShowIosInstructions(false)} className="mt-6 w-full px-4 py-2 bg-[#D94F2B] text-white font-semibold rounded-lg hover:bg-[#c04524] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D94F2B] dark:focus:ring-offset-slate-800">
                    {t('pwa.ios.gotIt')}
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallButton;
