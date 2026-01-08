import React, { useEffect, useRef } from 'react';
import { FOCUS_WORK_MINUTES, FOCUS_BREAK_MINUTES, t } from '../constants';
import { SupportedLanguage } from '../types';

interface FocusTimerProps {
  active: boolean;
  timeLeft: number | null;
  mode: 'work' | 'break';
  language: SupportedLanguage;
  taskTitle?: string;
  onUpdate: (time: number, mode: 'work' | 'break') => void;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ 
  active, 
  timeLeft, 
  mode, 
  language,
  taskTitle, 
  onUpdate, 
  onClose 
}) => {
  const timerRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  
  const currentSeconds = timeLeft ?? FOCUS_WORK_MINUTES * 60;

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearInterval(timerRef.current);
      endTimeRef.current = null;
      return;
    }

    // Set end time based on current time left
    endTimeRef.current = Date.now() + (currentSeconds * 1000);

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const remaining = Math.round((endTimeRef.current! - now) / 1000);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mode === 'work') {
          try {
            new Notification(t('notif_focus', language), { body: t('notif_work_done', language) });
          } catch (e) {}
          onUpdate(FOCUS_BREAK_MINUTES * 60, 'break');
        } else {
          try {
            new Notification(t('notif_focus', language), { body: t('notif_break_done', language) });
          } catch (e) {}
          onClose();
        }
      } else {
        // Only update if the second has actually changed to avoid over-rendering
        if (remaining !== timeLeft) {
          onUpdate(remaining, mode);
        }
      }
    }, 200); // Check every 200ms for responsiveness

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, mode, onUpdate, onClose, language]);

  if (!active) return null;

  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-comfort-light dark:bg-black text-center p-8">
      <div className="max-w-md w-full">
        <div className="mb-2 text-indigo-500 uppercase tracking-widest text-sm font-bold">
          {mode === 'break' ? '☕ ' + t('break_mode', language) : '🔥 ' + t('focus_mode', language)}
        </div>
        
        {taskTitle && (
          <h2 className="text-2xl font-semibold mb-12 text-gray-900 dark:text-gray-100">
            {taskTitle}
          </h2>
        )}

        <div className="text-[120px] font-thin leading-none tracking-tighter mb-12 tabular-nums text-comfort-text dark:text-gray-200">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-comfort-surface dark:bg-white/10 hover:bg-comfort-border dark:hover:bg-white/20 font-semibold transition-all flex items-center justify-center gap-2 icon-muted"
            style={{ opacity: 'var(--icon-opacity)' }}
          >
            🛑 {t('end_session', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
