import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { getScriptures } from '../constants';
import type { Progress, Book, Volume, Language } from '../types';
import ChapterModal from './ChapterModal';
import { ArrowLeftIcon, CalendarIcon, CloseIcon } from './icons';
import { useI18n } from '../i18n';

const calculateProgress = (progressKey: string, totalChapters: number, progress: Progress) => {
    const progressArray = progress[progressKey] as boolean[] || [];
    let completed = 0;
    for (let i = 0; i < totalChapters; i++) {
        if (progressArray[i]) {
            completed++;
        }
    }
    return { completed, total: totalChapters };
};

const calculateDailyGoal = (goalDate: string | undefined, total: number, completed: number) => {
    if (!goalDate) return null;

    const target = new Date(goalDate + 'T23:59:59');
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (target < now) return null;

    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const chaptersRemaining = total - completed;

    if (chaptersRemaining <= 0) return '0.0';
    
    return (chaptersRemaining / diffDays).toFixed(1);
};


const GoalModal: React.FC<{
  volumeName: string;
  currentGoal: string | undefined;
  onClose: () => void;
  onSave: (date: string) => void;
  onRemove: () => void;
}> = ({ volumeName, currentGoal, onClose, onSave, onRemove }) => {
    const { t } = useI18n();
    const [date, setDate] = useState(currentGoal || new Date().toISOString().split('T')[0]);

    const handleSave = () => {
        if (date) {
            onSave(date);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('readingGoalFor', { volumeName })}</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <label htmlFor="goal-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('targetDate')}</label>
                    <input 
                        type="date"
                        id="goal-date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700">
                    {currentGoal && (
                         <button onClick={onRemove} className="text-sm text-red-600 dark:text-red-400 hover:underline">{t('removeGoal')}</button>
                    )}
                    <div className="flex-grow"></div>
                    <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">{t('save')}</button>
                </div>
            </div>
        </div>
    );
};


const VolumeGrid: React.FC<{ onVolumeSelect: (volumeId: string) => void, progress: Progress, scriptures: { [key: string]: Volume } }> = ({ onVolumeSelect, progress, scriptures }) => {
    const { t } = useI18n();
    const bgClasses: { [key: string]: string } = {
        bom: 'bg-gradient-to-br from-teal-500 to-green-700',
        dc: 'bg-gradient-to-br from-slate-500 to-gray-700',
        pgp: 'bg-gradient-to-br from-purple-500 to-indigo-700',
        ot: 'bg-gradient-to-br from-amber-600 to-yellow-800',
        nt: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {Object.keys(scriptures).map((volumeId) => {
                const volume = scriptures[volumeId];
                const { completed, total } = volume.books.reduce((acc, book) => {
                    const p = calculateProgress(`${volumeId}_${book.id}`, book.chapters, progress);
                    return {
                        completed: acc.completed + p.completed,
                        total: acc.total + p.total,
                    };
                }, { completed: 0, total: 0 });

                const percentage = total > 0 ? (completed / total) * 100 : 0;
                const goalDate = progress[`${volumeId}_goalDate`] as string | undefined;
                const dailyGoal = calculateDailyGoal(goalDate, total, completed);

                return (
                    <button
                        key={volumeId}
                        onClick={() => onVolumeSelect(volumeId)}
                        className={`scripture-card text-white p-4 rounded-xl shadow-lg flex flex-col justify-between aspect-[3/4] transition-all duration-300 hover:scale-105 hover:shadow-2xl ${bgClasses[volumeId]}`}
                    >
                        <h2 className="text-2xl lg:text-3xl font-bold text-left drop-shadow-md">{volume.name}</h2>
                        <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                             <div className="flex justify-between items-center mb-1 text-sm font-medium">
                                <span>{t('progress')}</span>
                                <span>{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2.5">
                                <div className="bg-white h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                             <div className="text-xs text-center text-gray-200 mt-2">{completed} / {total}</div>
                            
                            {dailyGoal && dailyGoal !== '0.0' && (
                                <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{dailyGoal} {t('chaptersPerDayShort')}</span>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

const BookList: React.FC<{ volume: Volume, volumeId: string, progress: Progress, onBookSelect: (book: Book) => void, onBack: () => void, onProgressChange: (progress: Progress) => void }> = ({ volume, volumeId, progress, onBookSelect, onBack, onProgressChange }) => {
    const { t } = useI18n();
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const goalDateKey = `${volumeId}_goalDate`;
    const goalDate = progress[goalDateKey] as string | undefined;

    const handleGoalSave = (date: string) => {
        const newProgress = { ...progress, [goalDateKey]: date };
        onProgressChange(newProgress);
        setIsGoalModalOpen(false);
    };

    const handleGoalRemove = () => {
        const { [goalDateKey]: _, ...rest } = progress;
        onProgressChange(rest);
        setIsGoalModalOpen(false);
    };

    const { completed, total } = useMemo(() => {
        return volume.books.reduce((acc, book) => {
            const p = calculateProgress(`${volumeId}_${book.id}`, book.chapters, progress);
            return {
                completed: acc.completed + p.completed,
                total: acc.total + p.total,
            };
        }, { completed: 0, total: 0 });
    }, [volume.books, volumeId, progress]);


    const dailyGoal = useMemo(() => {
        return calculateDailyGoal(goalDate, total, completed);
    }, [goalDate, total, completed]);

    return (
        <div>
            <div className="flex items-center mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    <ArrowLeftIcon className="w-5 h-5" />
                    {t('backToLibrary')}
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{volume.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('progress')}: {total > 0 ? ((completed / total) * 100).toFixed(0) : 0}%
                    </p>
                </div>
                 <div className="text-right">
                    {dailyGoal !== null ? (
                        <div>
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{dailyGoal}</p>
                            <p className="text-base text-gray-600 dark:text-gray-400">{t('chaptersPerDay')}</p>
                            <button onClick={() => setIsGoalModalOpen(true)} className="text-sm text-blue-500 hover:underline mt-1">{t('editGoal')}</button>
                        </div>
                    ) : (
                         <button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                            <CalendarIcon className="w-5 h-5"/>
                            <span>{t('setGoal')}</span>
                         </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {volume.books.map(book => {
                    const { completed, total } = calculateProgress(`${volumeId}_${book.id}`, book.chapters, progress);
                    const percentage = total > 0 ? (completed / total) * 100 : 0;

                    return (
                        <button 
                            key={book.id} 
                            onClick={() => onBookSelect(book)}
                            className="w-full text-left bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{book.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('chaptersRead', { completed, total })}</p>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </button>
                    );
                })}
            </div>
            {isGoalModalOpen && (
                <GoalModal 
                    volumeName={volume.name}
                    currentGoal={goalDate}
                    onClose={() => setIsGoalModalOpen(false)}
                    onSave={handleGoalSave}
                    onRemove={handleGoalRemove}
                />
            )}
        </div>
    );
};


const ScriptureTracker: React.FC = () => {
    const { t, language } = useI18n();
    const [view, setView] = useState<'volumes' | 'books'>('volumes');
    const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [progress, setProgress] = useState<Progress>(() => {
        try {
            const savedProgress = localStorage.getItem('scriptureProgress');
            return savedProgress ? JSON.parse(savedProgress) : {};
        } catch (error) {
            console.error("Failed to parse scripture progress from localStorage", error);
            return {};
        }
    });

    const scriptures = useMemo(() => getScriptures(language as Language), [language]);

    const handleProgressChange = useCallback((newProgress: Progress) => {
        setProgress(newProgress);
        localStorage.setItem('scriptureProgress', JSON.stringify(newProgress));
    }, []);

    const handleVolumeSelect = useCallback((volumeId: string) => {
        setSelectedVolumeId(volumeId);
        setView('books');
    }, []);

    const handleBookSelect = useCallback((book: Book) => {
        setSelectedBook(book);
    }, []);

    const handleBack = useCallback(() => {
        setView('volumes');
        setSelectedVolumeId(null);
    }, []);
    
    const memoizedProgress = useMemo(() => progress, [progress]);

    return (
        <div className="container mx-auto">
             {view === 'volumes' && <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('myLibrary')}</h1>}
            {view === 'volumes' ? (
                <VolumeGrid onVolumeSelect={handleVolumeSelect} progress={memoizedProgress} scriptures={scriptures} />
            ) : selectedVolumeId && (
                <BookList 
                    volume={scriptures[selectedVolumeId]}
                    volumeId={selectedVolumeId} 
                    progress={memoizedProgress}
                    onBookSelect={handleBookSelect}
                    onBack={handleBack}
                    onProgressChange={handleProgressChange}
                />
            )}
            {selectedBook && selectedVolumeId && (
                <ChapterModal
                    volumeId={selectedVolumeId}
                    book={selectedBook}
                    progress={progress}
                    onClose={() => setSelectedBook(null)}
                    onProgressChange={handleProgressChange}
                />
            )}
        </div>
    );
};

export default ScriptureTracker;