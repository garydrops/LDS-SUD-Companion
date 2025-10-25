import React, { useState, useEffect, useCallback } from 'react';
import type { Book, Progress } from '../types';
import { CloseIcon } from './icons';
import { useI18n } from '../i18n';

interface ChapterModalProps {
  volumeId: string;
  book: Book;
  progress: Progress;
  onClose: () => void;
  onProgressChange: (newProgress: Progress) => void;
}

const ChapterModal: React.FC<ChapterModalProps> = ({ volumeId, book, progress, onClose, onProgressChange }) => {
  const { t } = useI18n();
  const progressKey = `${volumeId}_${book.id}`;
  
  const [localChapterProgress, setLocalChapterProgress] = useState<boolean[]>(
      (progress[progressKey] as boolean[]) || Array(book.chapters).fill(false)
  );
  
  useEffect(() => {
      setLocalChapterProgress((progress[progressKey] as boolean[]) || Array(book.chapters).fill(false));
  }, [book, progress, progressKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleProgressUpdate = useCallback((newChapterProgress: boolean[]) => {
    const newProgress = {
        ...progress,
        [progressKey]: newChapterProgress,
    };
    // Clean up old notes if they exist
    const notesKey = `${progressKey}_notes`;
    if (notesKey in newProgress) {
        delete (newProgress as any)[notesKey];
    }
    onProgressChange(newProgress);
  }, [progress, progressKey, onProgressChange]);
  
  const toggleChapter = (chapterIndex: number) => {
    const newChapterProgress = [...localChapterProgress];
    newChapterProgress[chapterIndex] = !newChapterProgress[chapterIndex];
    setLocalChapterProgress(newChapterProgress);
    handleProgressUpdate(newChapterProgress);
  };
  
  const toggleAll = (markAsComplete: boolean) => {
    const newChapterProgress = Array(book.chapters).fill(markAsComplete);
    setLocalChapterProgress(newChapterProgress);
    handleProgressUpdate(newChapterProgress);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{book.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        
        <div className="flex-shrink-0 flex gap-4 p-5 pt-4 border-b border-gray-200 dark:border-slate-700">
          <button onClick={() => toggleAll(true)} className="w-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">{t('markAll')}</button>
          <button onClick={() => toggleAll(false)} className="w-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">{t('unmarkAll')}</button>
        </div>
        
        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
            {Array.from({ length: book.chapters }, (_, i) => {
              const chapterNum = i + 1;
              const isCompleted = localChapterProgress[i];
              return (
                <button
                  key={chapterNum}
                  onClick={() => toggleChapter(i)}
                  className={`aspect-square w-full rounded-lg transition-colors duration-150 font-semibold ${isCompleted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600'}`}
                >
                  {chapterNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterModal;