import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useTodoStore } from './store/useTodoStore';
import { SECTION_ORDER, t } from './constants';
import { metrics } from './services/metricsService';
import { TaskInput } from './components/TaskInput';
import { Section } from './components/Section';
import { TaskRow } from './components/TaskRow';
import { CalendarView } from './components/CalendarView';
import { FocusTimer } from './components/FocusTimer';
import { Footer } from './components/Footer';
import { Landing } from './components/Landing';
import { CommandPalette } from './components/CommandPalette';
import { FocusMantras } from './components/FocusMantras';

export default function App() {
  const { 
    state,
    activeInput,
    setActiveInput,
    addTask, 
    updateTask, 
    deleteTask, 
    reorderTasks,
    toggleSection, 
    getSortedTasks,
    toggleFocus,
    updateFocusTime,
    endFocus,
    toggleView,
    toggleTheme,
    undoLastCompletion,
    setShowLanding,
    hasUndo,
    setDraft
  } = useTodoStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCPOpen, setIsCPOpen] = useState(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<any>(null);
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // CRITICAL FIX: Added state.tasks to dependency array to force re-calculation on any data change
  const sortedTasks = useMemo(() => getSortedTasks(), [getSortedTasks, currentTime, state.tasks]);
  const lang = state.language;

  const isMuted = ['ultra-low', 'photophobia'].includes(state.visualPreset);
  const isDarkMode = state.theme === 'dark' || state.theme === 'night';

  useEffect(() => {
    if (activeInput === 'main' && state.viewMode === 'calendar') {
      toggleView();
    }
  }, [activeInput, state.viewMode, toggleView]);

  useEffect(() => {
    const onScroll = () => {
      isScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => isScrolling.current = false, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleView = () => {
    if (state.viewMode === 'list') metrics.markCalendarOpen();
    else metrics.markCalendarClosed();
    toggleView();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

      // 1. Meta Shortcuts
      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === 'z') {
          if (hasUndo) { e.preventDefault(); undoLastCompletion(); }
          return;
        }
        if (e.key === 'k') {
          e.preventDefault();
          setIsCPOpen(prev => !prev);
          return;
        }
        return; // Do not intercept other system shortcuts
      }

      if (e.key.toLowerCase() === 'f' && !isInput) { 
        e.preventDefault(); 
        toggleFocus(); 
        return; 
      }

      if (e.key === 'Escape') {
        if (state.focusSession.active) endFocus();
        else {
          setActiveInput('none');
          setIsCPOpen(false);
        }
        return;
      }

      // 2. Type-to-Add (Block if mod keys are pressed)
      if (activeInput !== 'none' || state.focusSession.active || state.viewMode === 'calendar' || isScrolling.current || e.altKey || e.isComposing || isInput) return;
      
      if (e.key.length === 1) {
          e.preventDefault();
          metrics.record('early_typing');
          setDraft(state.draft + e.key);
          setActiveInput('main');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFocus, endFocus, setActiveInput, hasUndo, undoLastCompletion, state.focusSession.active, activeInput, state.viewMode, state.draft, setDraft]);

  if (state.showLanding) return <Landing language={lang} onOpenApp={() => setShowLanding(false)} />;

  return (
    <MotionConfig transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
      <div className="relative flex-1 flex flex-col">
        <AnimatePresence>
          {state.focusSession.active && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-comfort-light/50 dark:bg-black/40 backdrop-blur-sm z-40 pointer-events-none" />
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[1100px] mx-auto px-5 md:px-10 lg:px-20 pt-8 md:pt-16 pb-12 selection:bg-indigo-500 selection:text-white relative flex-1 flex flex-col" >
          <header className="flex items-center justify-between mb-10 md:mb-16 select-none relative z-10">
            <div className="cursor-pointer" onClick={() => setShowLanding(true)}>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-0.5">To-Do To-Did</h1>
              <p className="text-[10px] md:text-xs text-gray-700 dark:text-gray-500 font-bold uppercase tracking-widest">{t('tagline', lang)}</p>
            </div>
            <div className="flex items-center gap-1.5 md:gap-3">
              <button 
                onClick={toggleTheme} 
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl transition-all text-lg icon-muted ${isMuted ? 'bg-comfort-surface dark:bg-white/5 grayscale' : 'bg-comfort-surface dark:bg-white/5 hover:bg-comfort-border dark:hover:bg-white/10'}`} 
                style={{ opacity: 'var(--icon-opacity)' }}
              >
                <span className={isDarkMode ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]' : 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]'}>
                  {isDarkMode ? '🌙' : '☀️'}
                </span>
              </button>
              <button onClick={handleToggleView} className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl transition-all text-lg icon-muted ${state.viewMode === 'calendar' ? (isMuted ? 'bg-gray-500 text-white shadow-none' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20') : (isMuted ? 'bg-comfort-surface dark:bg-white/5 grayscale text-gray-400' : 'bg-comfort-surface dark:bg-white/5 hover:bg-comfort-border dark:hover:bg-white/10') }`} style={{ opacity: 'var(--icon-opacity)' }} >
                {state.viewMode === 'calendar' ? '📝' : '📅'}
              </button>
            </div>
          </header>

          <main className="max-w-2xl mx-auto w-full flex-1 relative z-10">
            <TaskInput onAdd={addTask} language={lang} />
            <AnimatePresence mode="wait">
              {state.viewMode === 'list' ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20">
                  {SECTION_ORDER.map((sectionType, index) => (
                    <Section key={sectionType} type={sectionType} language={lang} count={sortedTasks[sectionType]?.length || 0} collapsed={state.collapsedSections.has(sectionType)} onToggle={() => toggleSection(sectionType)} onDrop={(taskId) => reorderTasks(taskId, sectionType)} index={index}>
                      {sortedTasks[sectionType]?.map(task => (
                        <TaskRow key={task.id} task={task} language={lang} onUpdate={updateTask} onDelete={deleteTask} />
                      ))}
                    </Section>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CalendarView tasks={state.tasks} onUpdate={updateTask} language={lang} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          
          <FocusMantras language={lang} />
          <Footer language={lang} isFocusActive={state.focusSession.active} />
          
          <FocusTimer active={state.focusSession.active} timeLeft={state.focusSession.timeLeft} mode={state.focusSession.mode} language={lang} onUpdate={updateFocusTime} onClose={endFocus} />

          <CommandPalette isOpen={isCPOpen} onClose={() => setIsCPOpen(false)} language={lang} />

          <AnimatePresence>
            {hasUndo && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
                <button onClick={undoLastCompletion} className="px-8 py-3 rounded-full bg-comfort-panel dark:bg-zinc-800 shadow-2xl border border-comfort-border dark:border-white/5 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-500 transition-colors">↩️ {t('undo', lang)}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
}