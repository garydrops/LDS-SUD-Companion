import React from 'react';
import type { AppSettings, Theme, Language, FontSize } from '../types';
import { CloseIcon } from './icons';
import { useI18n } from '../i18n';

interface SettingsModalProps {
    settings: AppSettings;
    onSettingsChange: (newSettings: AppSettings) => void;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSettingsChange, onClose }) => {
    const { t } = useI18n();

    const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const SettingRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
        <div className="flex justify-between items-center py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
            <label className="font-semibold text-gray-700 dark:text-gray-300">{label}</label>
            <div>{children}</div>
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="settings-title" className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <CloseIcon className="w-8 h-8" />
                        <span className="sr-only">{t('close')}</span>
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    <SettingRow label={t('theme')}>
                        <select
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value as Theme)}
                            className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2"
                        >
                            <option value="light">{t('themeLight')}</option>
                            <option value="dark">{t('themeDark')}</option>
                        </select>
                    </SettingRow>

                    <SettingRow label={t('language')}>
                         <select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value as Language)}
                            className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2"
                        >
                            <option value="pt-BR">Português (BR)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                        </select>
                    </SettingRow>

                    <SettingRow label={t('textSize')}>
                        <select
                            value={settings.fontSize}
                            onChange={(e) => handleSettingChange('fontSize', e.target.value as FontSize)}
                            className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md p-2"
                        >
                            <option value="sm">{t('textSizeSmall')}</option>
                            <option value="base">{t('textSizeMedium')}</option>
                            <option value="lg">{t('textSizeLarge')}</option>
                        </select>
                    </SettingRow>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;