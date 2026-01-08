import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../constants';
import { SupportedLanguage, SectionType } from '../types';
import { useTodoStore } from '../store/useTodoStore';

interface FocusMantrasProps {
  language: SupportedLanguage;
}

export const FocusMantras: React.FC<FocusMantrasProps> = ({ language }) => {
  const { state, getSortedTasks } = useTodoStore();
  
  const mantra = useMemo(() => {
    if (state.focusSession.active) return t('mantra_focus', language);
    
    const sorted = getSortedTasks();
    const busyCount = (sorted[SectionType.NOW]?.length || 0) + (sorted[SectionType.TODAY]?.length || 0);
    const hour = new Date().getHours();

    if (busyCount === 0) return t('mantra_empty', language);
    if (hour >= 18 || hour < 5) return t('mantra_night', language);
    if (hour >= 5 && hour < 11) return t('mantra_morning', language);
    if (busyCount > 4) return t('mantra_busy', language);

    // Default to busy mantra if none other applies
    return t('mantra_busy', language);
  }, [state.focusSession.active, state.tasks, language, getSortedTasks]);

  return (
    <div className="w-full flex justify-center py-4 mb-2 select-none pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.p
          key={mantra}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.4, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-gray-700 dark:text-gray-400 text-center max-w-xs leading-relaxed"
        >
          {mantra}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
