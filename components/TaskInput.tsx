import React, { useRef, useEffect } from 'react';
import { SupportedLanguage, Priority } from '../types';
import { t, PRIORITY_COLORS } from '../constants';
import { useTodoStore } from '../store/useTodoStore';

interface TaskInputProps {
  language: SupportedLanguage;
  onAdd: any; // Keep prop for compatibility, though store method is preferred
}

export const TaskInput: React.FC<TaskInputProps> = ({ language }) => {
  const { state, activeInput, setActiveInput, setDraft, setDraftPriority, submitDraft } = useTodoStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeInput === 'main' && inputRef.current) inputRef.current.focus();
    else if (activeInput !== 'main' && inputRef.current === document.activeElement) inputRef.current.blur();
  }, [activeInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDraft();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeInput === 'main' && !state.focusSession.active) {
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); setDraftPriority(Priority.LOW); }
        if (e.key === '2') { e.preventDefault(); setDraftPriority(Priority.MEDIUM); }
        if (e.key === '3') { e.preventDefault(); setDraftPriority(Priority.HIGH); }
      }
    }
    if (e.key === 'Escape') setActiveInput('none');
  };

  const cycleDraftPriority = () => {
    let next: Priority;
    switch(state.draftPriority) {
      case Priority.LOW: next = Priority.MEDIUM; break;
      case Priority.MEDIUM: next = Priority.HIGH; break;
      case Priority.HIGH: next = Priority.LOW; break;
      default: next = Priority.MEDIUM;
    }
    setDraftPriority(next);
  };

  const isMuted = ['ultra-low', 'photophobia'].includes(state.visualPreset);
  
  const getPriorityHint = () => {
    const p = state.draftPriority;
    const label = t('priority_label', language);
    const key = p === Priority.LOW ? '1' : p === Priority.MEDIUM ? '2' : '3';
    return `${label}: ${p} (Alt+${key})`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative group mb-8 flex items-center gap-3">
      <button 
        type="button" 
        onClick={cycleDraftPriority} 
        className={`w-4 h-14 rounded-2xl shrink-0 transition-all duration-300 hover:brightness-110 active:scale-90 shadow-lg flex flex-col items-center justify-center overflow-hidden border-2 border-transparent hover:border-white/10 ${PRIORITY_COLORS[state.draftPriority]} icon-muted`} 
        title={getPriorityHint()} 
        tabIndex={-1}
        style={{ opacity: isMuted ? 'var(--icon-opacity)' : 1 }}
      >
        <span className="text-[10px] font-black text-white/50 select-none">
          {state.draftPriority === Priority.LOW ? '1' : state.draftPriority === Priority.MEDIUM ? '2' : '3'}
        </span>
      </button>
      <div className="relative flex-1">
        <input 
          ref={inputRef} 
          type="text" 
          value={state.draft} 
          onFocus={() => setActiveInput('main')} 
          onKeyDown={handleKeyDown} 
          onChange={(e) => setDraft(e.target.value)} 
          placeholder={t('add_placeholder', language)} 
          autoComplete="off" 
          className="w-full pl-6 pr-4 py-4 text-xl font-medium bg-comfort-surface dark:bg-white/5 border-0 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-gray-500 text-gray-900 dark:text-white transition-all shadow-xl" 
        />
      </div>
    </form>
  );
};