
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionType, SupportedLanguage } from '../types';
import { t } from '../constants';

interface SectionProps {
  type: SectionType;
  count: number;
  collapsed: boolean;
  language: SupportedLanguage;
  onToggle: () => void;
  onDrop?: (taskId: string, section: SectionType) => void;
  children: React.ReactNode;
  index: number;
}

export const Section: React.FC<SectionProps> = ({ type, count, collapsed, language, onToggle, onDrop, children, index }) => {
  const [isOver, setIsOver] = useState(false);

  if (count === 0 && type !== SectionType.TODAY) return null;

  const getLabel = () => {
    switch (type) {
      case SectionType.NOW: return t('now', language);
      case SectionType.TODAY: return t('today', language);
      case SectionType.TOMORROW: return t('tomorrow', language);
      case SectionType.FUTURE: return t('future', language);
      case SectionType.DID: return t('did', language);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const onDragLeave = () => {
    setIsOver(false);
  };

  const onDropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onDrop) {
      onDrop(taskId, type);
    }
  };

  return (
    <motion.div 
      id={`section-${type}`}
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropHandler}
      className={`mb-6 md:mb-8 transition-colors duration-200 rounded-2xl ${isOver ? 'bg-indigo-500/5' : ''}`}
    >
      <button 
        onClick={onToggle}
        className="flex items-center gap-3 w-full py-2 group select-none outline-none"
      >
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors">
          {getLabel()}
        </span>
        <div className="flex-1 h-px bg-comfort-surface dark:bg-white/5" />
        <span className="text-[9px] md:text-[10px] font-bold tabular-nums text-gray-700 dark:text-gray-500 bg-comfort-surface dark:bg-white/5 px-2 py-0.5 rounded-full">
          {Math.max(0, count)}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex flex-col gap-0.5 md:gap-1">
              {count === 0 && type === SectionType.TODAY && (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                  <svg className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-600 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div className="text-sm text-gray-600 font-light italic">
                    {t('clear_mind', language)}
                  </div>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
