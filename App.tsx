import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import ScriptureTracker from './components/ScriptureTracker';
import ContentGenerator from './components/ContentGenerator';
import SettingsModal from './components/SettingsModal';
import type { ActiveTab, AppSettings } from './types';
import { I18nProvider } from './i18n';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'pt-BR',
    fontSize: 'base',
  });

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // This effect handles SAVING settings to localStorage
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  useEffect(() => {
    // This effect handles APPLYING the theme to the document
    if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);


  useEffect(() => {
    const fontSizeMap = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' };
    const classesToRemove = Object.values(fontSizeMap);
    document.body.classList.remove(...classesToRemove);
    document.body.classList.add(fontSizeMap[settings.fontSize]);
  }, [settings.fontSize]);


  const handleSetTab = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <I18nProvider language={settings.language}>
      <Layout activeTab={activeTab} setActiveTab={handleSetTab} onOpenSettings={() => setIsSettingsOpen(true)}>
        <div className="pt-24 pb-8">
          {activeTab === 'tracker' && <ScriptureTracker />}
          {activeTab === 'assistant' && <ContentGenerator language={settings.language}/>}
        </div>
        {isSettingsOpen && (
          <SettingsModal 
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </Layout>
    </I18nProvider>
  );
};

export default App;