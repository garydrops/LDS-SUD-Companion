import React from 'react';
import type { ActiveTab } from '../types';
import { BookIcon, SparklesIcon, SettingsIcon } from './icons';
import { useI18n } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onOpenSettings }) => {
  const { t } = useI18n();

  const navButtonClasses = (tabName: ActiveTab) =>
    `flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
      activeTab === tabName
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-slate-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-900 dark:text-gray-200">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40 shadow-sm dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-bVoh2c2t5hVj1y2Gtf4L-Rwbw23Y2hJgQ&s" alt="LDS Companion Logo" className="h-10 w-10 rounded-full object-cover" />
              <h1 className="ml-3 text-xl font-bold text-gray-800 hidden sm:block dark:text-gray-100">
                LDS Companion
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 p-1 bg-gray-100 rounded-full dark:bg-slate-800">
                 <button
                  onClick={() => setActiveTab('assistant')}
                  className={navButtonClasses('assistant')}
                   aria-pressed={activeTab === 'assistant'}
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>{t('assistant')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className={navButtonClasses('tracker')}
                  aria-pressed={activeTab === 'tracker'}
                >
                  <BookIcon className="w-5 h-5" />
                  <span>{t('reading')}</span>
                </button>
              </nav>
              <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors"
                aria-label={t('openSettings')}
              >
                <SettingsIcon className="w-6 h-6"/>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;