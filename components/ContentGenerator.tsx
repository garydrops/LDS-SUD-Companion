import React, { useState, useCallback, useMemo } from 'react';
import type { UploadedFile, GeneratorOptions, Language } from '../types';
import { generateLdsContent, suggestHymn, generateMoreQuestions } from '../services/geminiService';
import { LoadingIcon, CopyIcon, PrintIcon, PdfIcon, UploadIcon, SparklesIcon, PlusCircleIcon } from './icons';
import { useI18n } from '../i18n';

// Add type declarations for `window.jspdf` and `window.html2canvas` to resolve TypeScript errors.
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

// Helper to convert Markdown-like syntax to HTML
const formatTextToHtml = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');
};

interface ContentGeneratorProps {
    language: Language;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ language }) => {
    const { t } = useI18n();
    
    const audienceOptions = useMemo(() => ({
        'Adults': t('audienceAdults'),
        'Youth': t('audienceYouth'),
        'Children': t('audienceChildren'),
    }), [t]);

    const generationModeOptions = useMemo(() => ({
        'Full Text': t('genModeFull'),
        'Topics Only': t('genModeTopics'),
    }), [t]);

    const doctrinalSources = useMemo(() => [
        t('sourceScriptures'), 
        t('sourceGC'), 
        t('sourceLiahona'), 
        t('sourceCFM'), 
        t('sourceManuals'), 
        t('sourceDiscourses')
    ], [t]);

    const [isLoading, setIsLoading] = useState(false);
    const [isHymnLoading, setIsHymnLoading] = useState(false);
    const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [hymnSuggestion, setHymnSuggestion] = useState<string | null>(null);
    
    const [formState, setFormState] = useState<GeneratorOptions>({
        theme: '',
        contextText: '',
        time: '10',
        audience: audienceOptions['Adults'],
        generationMode: generationModeOptions['Full Text'],
        sources: [doctrinalSources[0], doctrinalSources[1]],
        uploadedFile: null,
    });
    const [activeTab, setActiveTab] = useState<'discurso' | 'aula'>('discurso');

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    }, []);

    const handleSourceChange = useCallback((source: string) => {
        setFormState(prevState => {
            const newSources = prevState.sources.includes(source)
                ? prevState.sources.filter(s => s !== source)
                : [...prevState.sources, source];
            return { ...prevState, sources: newSources };
        });
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setFormState(prevState => ({ ...prevState, uploadedFile: null }));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setFormState(prevState => ({
                ...prevState,
                uploadedFile: { name: file.name, base64Data: base64String, mimeType: file.type }
            }));
        };
        reader.readAsDataURL(file);
    }, []);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.theme) {
            setError(t('errorFillTheme'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setHymnSuggestion(null);

        try {
            const content = await generateLdsContent(activeTab, formState, language);
            setResult(content);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('errorUnknown');
            if (errorMessage === 'ERRO_DOUTRINA') {
                 setError(t('errorDoctrine'));
            } else {
                 setError(t('errorGeneratingContent', { message: errorMessage }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestHymn = async () => {
        if (!formState.theme && !formState.contextText) {
            setError(t('errorHymnSuggest'));
            return;
        }
        setIsHymnLoading(true);
        setHymnSuggestion(null);
        setError(null);
        try {
            const suggestion = await suggestHymn(formState.theme, formState.contextText, formState.audience, language);
            setHymnSuggestion(suggestion);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('errorUnknown');
            setError(t('errorSuggestingHymns', { message: errorMessage }));
        } finally {
            setIsHymnLoading(false);
        }
    };

    const handleMoreQuestions = async () => {
        if (!result) return;
        setIsQuestionsLoading(true);
        setError(null);
        try {
            const questions = await generateMoreQuestions(result, formState.audience, language);
            setResult(prevResult => `${prevResult}\n\n**${t('additionalQuestions')}:**\n${questions}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('errorUnknown');
            setError(t('errorGeneratingQuestions', { message: errorMessage }));
        } finally {
            setIsQuestionsLoading(false);
        }
    };
    
    const handlePrint = () => {
        const content = document.getElementById('result-content')?.innerHTML;
        if (content) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow?.document.write(`<html><head><title>${t('printContent')}</title>`);
            printWindow?.document.write('<style>body { font-family: Inter, sans-serif; color: black; } strong { font-weight: 700; }</style>');
            printWindow?.document.write('</head><body>');
            printWindow?.document.write(content);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.print();
        }
    };
    
    const handleCopy = () => {
        const text = document.getElementById('result-content')?.innerText;
        if(text){
            navigator.clipboard.writeText(text);
            alert(t('copiedToClipboard'));
        }
    };

    const handlePdf = async () => {
        const { jsPDF } = window.jspdf;
        const contentElement = document.getElementById('result-content');
        if (contentElement && window.html2canvas) {
          contentElement.style.color = 'black'; // Ensure text is black for PDF
          const canvas = await window.html2canvas(contentElement, { scale: 2, backgroundColor: '#ffffff' });
          contentElement.style.color = ''; // Reset color
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
          pdf.save("generated-content.pdf");
        }
    };

    const tabClasses = (tabName: 'discurso' | 'aula') => {
        const isActive = activeTab === tabName;
        return `px-6 py-3 font-semibold text-base rounded-t-lg border transition-colors ${
            isActive 
                ? 'bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 border-b-white dark:border-b-slate-800/50 text-blue-600 dark:text-white -mb-px' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-slate-900/40'
        }`;
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('contentGeneratorTitle')}</h1>
                <SparklesIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>

            <div>
                <div role="tablist" className="flex border-b border-gray-200 dark:border-slate-700">
                    <button role="tab" aria-selected={activeTab === 'discurso'} onClick={() => setActiveTab('discurso')} className={tabClasses('discurso')}>
                        {t('tabTalk')}
                    </button>
                    <button role="tab" aria-selected={activeTab === 'aula'} onClick={() => setActiveTab('aula')} className={tabClasses('aula')}>
                        {t('tabLesson')}
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-b-xl rounded-tr-xl shadow-lg border-x border-b border-gray-200 dark:border-slate-700">
                    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('centralTheme')}</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" name="theme" id="theme" value={formState.theme} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700" />
                                    <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2 bg-gray-300/80 hover:bg-gray-400/50 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md border border-gray-300 dark:border-slate-500 transition-colors whitespace-nowrap">
                                        <span>{t('attachFile')}</span>
                                    </label>
                                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </div>
                                {formState.uploadedFile && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('fileLabel')} {formState.uploadedFile.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="contextText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pasteReferenceText')}</label>
                                <textarea name="contextText" id="contextText" rows={3} value={formState.contextText} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('timeLabel')}</label>
                                    <input type="number" name="time" id="time" value={formState.time} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700" />
                                </div>
                                <div>
                                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('audienceLabel')}</label>
                                    <select name="audience" id="audience" value={formState.audience} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700">
                                        {Object.values(audienceOptions).map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                {activeTab === 'discurso' && (
                                    <div>
                                        <label htmlFor="generationMode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('generationModeLabel')}</label>
                                        <select name="generationMode" id="generationMode" value={formState.generationMode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700">
                                            {Object.values(generationModeOptions).map(opt => <option key={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('doctrinalSourcesLabel')}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {doctrinalSources.map(source => (
                                        <button type="button" key={source} onClick={() => handleSourceChange(source)} className={`p-3 border rounded-md text-center cursor-pointer transition-colors text-sm font-medium ${formState.sources.includes(source) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-300/70 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600'}`}>
                                            {source}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 pt-4">
                                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? <LoadingIcon className="w-6 h-6" /> : <SparklesIcon className="w-6 h-6" />}
                                    <span>{isLoading ? t('generating') : (activeTab === 'discurso' ? t('generateTalk') : t('generateLesson'))}</span>
                                </button>
                                {activeTab === 'aula' && (
                                    <button type="button" onClick={handleSuggestHymn} disabled={isHymnLoading} className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md border border-gray-300 dark:border-slate-600 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50">
                                       {isHymnLoading && <LoadingIcon className="w-5 h-5" />} <span>{t('suggestHymn')}</span>
                                    </button>
                                )}
                                {hymnSuggestion && <div className="text-sm p-3 rounded-md bg-gray-50 dark:bg-slate-700/50 border dark:border-slate-600 whitespace-pre-line text-center" dangerouslySetInnerHTML={{ __html: formatTextToHtml(hymnSuggestion) }} />}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {error && <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
            
            {(isLoading || result) && (
              <div id="output-panel" className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">{t('generatedContent')}</h2>
                      {result && (
                          <div className="flex space-x-2">
                              <button onClick={handleCopy} title={t('copy')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><CopyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                              <button onClick={handlePdf} title={t('saveAsPdf')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><PdfIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                              <button onClick={handlePrint} title={t('print')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><PrintIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
                          </div>
                      )}
                  </div>
                  <div id="result-content" className="prose dark:prose-invert max-w-none prose-p:my-2 prose-h3:my-3">
                      {isLoading && (
                          <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                          </div>
                      )}
                      {result && <div dangerouslySetInnerHTML={{ __html: formatTextToHtml(result) }} />}
                  </div>
                  {result && activeTab === 'aula' && (
                      <div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-4">
                          <button onClick={handleMoreQuestions} disabled={isQuestionsLoading} className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:hover:bg-blue-900/80 dark:text-blue-300 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50">
                              {isQuestionsLoading && <LoadingIcon className="w-5 h-5" />} <PlusCircleIcon className="w-5 h-5"/> <span>{t('generateMoreQuestions')}</span>
                          </button>
                      </div>
                  )}
              </div>
            )}
        </div>
    );
};

export default ContentGenerator;