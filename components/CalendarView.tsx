
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Task, SupportedLanguage } from '../types';
import { formatDate, t, getNowString, sanitize, getWeekdays } from '../constants';
import { useTodoStore } from '../store/useTodoStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getHolidays } from '../constants/holidays';

interface CalendarViewProps {
  tasks: Task[];
  language: SupportedLanguage;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, language }) => {
  const { 
    state, 
    updateCalendarNav, 
    updateTask, 
    activeInput, 
    setActiveInput, 
    setDraft, 
    submitDraft,
    calendarDraftCoords 
  } = useTodoStore();
  const { calendarNavDate, calendarViewType: view, country, region, holidayAwareness, draft } = state;
  
  const currentDate = useMemo(() => new Date(calendarNavDate + 'T00:00:00'), [calendarNavDate]);
  const isMuted = ['ultra-low', 'photophobia'].includes(state.visualPreset);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowMinutes, setNowMinutes] = useState(0);

  useEffect(() => {
    if (activeInput === 'calendar' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeInput]);

  useEffect(() => {
    // Center scroll on 8 AM or current time
    if (view === 'weekly' && scrollRef.current) {
      scrollRef.current.scrollTop = 380; // Adjusted for smaller mobile height
    }
  }, [view]);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setNowMinutes(d.getHours() * 60 + d.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const holidays = useMemo(() => {
    if (!holidayAwareness) return [];
    return getHolidays(currentDate.getFullYear(), country, region);
  }, [currentDate, country, region, holidayAwareness]);

  const days = useMemo(() => {
    if (view === 'monthly') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const startDay = new Date(firstDayOfMonth);
      startDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
      const calendarDays = [];
      for (let i = 0; i < 42; i++) {
        calendarDays.push(new Date(startDay));
        startDay.setDate(startDay.getDate() + 1);
      }
      return calendarDays;
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      return new Array(7).fill(0).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
      });
    }
  }, [view, currentDate]);

  // Use Intl via helper
  const dayLabels = useMemo(() => getWeekdays(language), [language]);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const handleDayClick = (date: Date) => {
    setActiveInput('calendar', null, { date: formatDate(date), time: null });
  };

  const navigateMonth = (direction: number) => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + direction);
    updateCalendarNav(formatDate(next));
  };

  const handleDropReschedule = (e: React.DragEvent, dateStr: string, timeStr: string | null = null) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      const newTime = timeStr !== null ? timeStr : (task ? task.time : null);
      updateTask(taskId, { date: dateStr, time: newTime });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSaveTask = () => {
    submitDraft({ date: calendarDraftCoords.date, time: calendarDraftCoords.time });
  };

  const renderMonthly = () => (
    <div className="grid grid-cols-7 gap-0.5 md:gap-2 auto-rows-fr pb-8">
      {dayLabels.map(d => (
        <div key={d} className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center py-1 md:py-2 select-none">
          {d}
        </div>
      ))}
      
      {days.map((day, idx) => {
        const dateStr = formatDate(day);
        const isToday = dateStr === getNowString();
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const dayTasks = tasks.filter(t => t.date === dateStr && !t.completed);
        const isCreatingHere = activeInput === 'calendar' && calendarDraftCoords.date === dateStr && !calendarDraftCoords.time;
        const holiday = holidays.find(h => h.date === dateStr);

        return (
          <div 
            key={idx} 
            onClick={() => handleDayClick(day)}
            onDragOver={onDragOver}
            onDrop={(e) => handleDropReschedule(e, dateStr, null)}
            className={`
              min-h-[60px] md:min-h-[120px] p-0.5 md:p-1.5 rounded-lg md:rounded-2xl transition-all cursor-pointer relative group flex flex-col gap-0.5 md:gap-1.5
              ${isCurrentMonth ? 'bg-comfort-panel dark:bg-white/5 shadow-sm hover:shadow-md' : 'bg-transparent opacity-30 grayscale'}
              ${isToday && isCurrentMonth ? 'ring-1 md:ring-2 ring-indigo-500 ring-offset-1 md:ring-offset-2 ring-offset-comfort-light dark:ring-offset-black z-10' : ''}
              ${holiday ? 'bg-amber-500/5' : ''}
            `}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[9px] md:text-xs font-bold w-4 h-4 md:w-6 md:h-6 flex items-center justify-center rounded-full transition-colors
                ${isToday 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : (isCurrentMonth ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600')}
              `}>
                {day.getDate()}
              </span>
              {holiday && <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-500/50" />}
            </div>

            <div className="flex-1 flex flex-col gap-0.5 md:gap-1 overflow-hidden">
              {dayTasks.map(t => (
                <div 
                  key={t.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', t.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  className={`
                    text-[7px] md:text-[9px] font-bold px-1 py-0.5 md:px-2 md:py-1 rounded-sm md:rounded-lg truncate cursor-grab active:cursor-grabbing transition-all icon-muted shadow-sm border-l-2 md:border-l-[3px] leading-tight
                    ${isMuted 
                       ? 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300 border-gray-400' 
                       : 'bg-gray-50 text-gray-700 dark:bg-white/10 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-white/20 border-indigo-500'
                    }
                  `}
                  style={{ opacity: 'var(--icon-opacity)' }}
                >
                  {sanitize(t.title)}
                </div>
              ))}
              {isCreatingHere && (
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveTask(); if (e.key === 'Escape') setActiveInput('none'); }}
                  onBlur={() => { if (draft === '') setActiveInput('none'); }}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none outline-none text-[8px] md:text-[9px] font-bold p-0.5 md:p-1 rounded md:rounded-lg shadow-lg ring-1 md:ring-2 ring-indigo-500 z-20"
                  placeholder="..."
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWeekly = () => (
    <div className="flex flex-col h-[65vh] bg-comfort-panel dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-comfort-border dark:border-white/5 relative">
      {/* Header */}
      <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr] border-b border-comfort-border dark:border-white/5 bg-comfort-surface/30 dark:bg-white/5 backdrop-blur-md z-20 sticky top-0">
        <div className="w-10 md:w-14 border-r border-comfort-border dark:border-white/5 bg-comfort-light/50 dark:bg-white/5" />
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dateStr = formatDate(day);
            const holiday = holidays.find(h => h.date === dateStr);
            const isToday = formatDate(day) === getNowString();
            return (
              <div key={i} className={`py-2 md:py-3 text-center border-r border-comfort-border/30 dark:border-white/5 last:border-0 ${holiday ? 'bg-amber-500/5' : ''}`}>
                <div className="text-[8px] md:text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dayLabels[i]}</div>
                <div className={`text-xs md:text-base font-bold mt-0.5 md:mt-1 w-6 h-6 md:w-8 md:h-8 mx-auto flex items-center justify-center rounded-full transition-all
                   ${isToday ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-105 md:scale-110' : 'text-gray-700 dark:text-gray-300'}
                `}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Scrollable Grid */}
      <div className="flex-1 overflow-y-auto relative bg-comfort-light/30 dark:bg-transparent scroll-smooth" ref={scrollRef}>
        <div className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr] relative min-h-full">
          
          {/* Time Column */}
          <div className="flex flex-col border-r border-comfort-border dark:border-white/5 bg-comfort-surface/20 dark:bg-white/2">
            {hours.map(h => (
              <div key={h} className="h-12 md:h-16 text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 flex items-start justify-center pt-2 relative">
                {h.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-7 relative divide-x divide-comfort-border dark:divide-white/5">
            {/* Current Time Indicator Line (Crosses all days) */}
            <div 
              className="absolute left-0 right-0 h-px bg-red-500/80 z-30 pointer-events-none flex items-center shadow-[0_0_8px_rgba(239,68,68,0.4)] transition-all duration-1000" 
              style={{ top: `${(nowMinutes / 1440) * 100}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 -ml-[4px]" />
            </div>

            {days.map(day => {
              const dateStr = formatDate(day);
              return (
                <div key={dateStr} className="relative group/col">
                  {hours.map(h => {
                    const hourStr = `${h.toString().padStart(2, '0')}:00`;
                    const isCreatingHere = activeInput === 'calendar' && calendarDraftCoords.date === dateStr && calendarDraftCoords.time === hourStr;
                    
                    // FIXED: Flexible time matching logic
                    const hourTasks = tasks.filter(t => {
                      if (!t.date || t.date !== dateStr || t.completed || !t.time) return false;
                      const taskHour = parseInt(t.time.split(':')[0], 10);
                      return taskHour === h;
                    });
                    
                    return (
                      <div 
                        key={h}
                        onClick={() => setActiveInput('calendar', null, { date: dateStr, time: hourStr })}
                        onDragOver={onDragOver}
                        onDrop={(e) => handleDropReschedule(e, dateStr, hourStr)}
                        className="h-12 md:h-16 border-b border-comfort-border/20 dark:border-white/5 relative group/slot hover:bg-indigo-500/5 transition-colors"
                      >
                         {/* Hour Line Highlight (Desktop) */}
                        <div className="absolute inset-x-0 top-0 h-px bg-transparent group-hover/slot:bg-indigo-500/20 transition-colors" />

                        {hourTasks.map(t => (
                          <div 
                            key={t.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', t.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            className={`absolute inset-x-0.5 top-0.5 text-[7px] md:text-[8px] font-bold px-1 py-0.5 md:px-1.5 md:py-1 rounded-sm md:rounded shadow-sm z-10 truncate cursor-grab active:cursor-grabbing hover:brightness-110 transition-all border-l-2
                               ${isMuted 
                                 ? 'bg-gray-200 text-gray-700 border-gray-400' 
                                 : 'bg-indigo-500/10 text-indigo-600 border-indigo-500 dark:text-indigo-300 dark:bg-indigo-500/20'
                               }
                            `}
                          >
                            {sanitize(t.title)}
                          </div>
                        ))}

                        {isCreatingHere && (
                          <div className="absolute inset-0 z-20 p-0.5 flex items-start pt-1">
                            <input
                              ref={inputRef}
                              value={draft}
                              onChange={e => setDraft(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleSaveTask(); if (e.key === 'Escape') setActiveInput('none'); }}
                              onBlur={() => { if (draft === '') setActiveInput('none'); }}
                              className="w-full bg-gray-50 dark:bg-zinc-800 border-none outline-none text-[8px] md:text-[9px] font-bold p-1 rounded ring-2 ring-indigo-500 shadow-xl"
                              placeholder="..."
                              autoFocus
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full select-none pb-24">
      {/* Rebranded Mobile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-8 px-1">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col">
            <motion.h2 
              key={calendarNavDate}
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-3xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter leading-none"
            >
              {new Intl.DateTimeFormat(language, { month: 'long' }).format(currentDate)}
            </motion.h2>
            <span className="text-xs md:text-sm font-bold text-gray-400 dark:text-gray-600 tracking-widest">
              {new Intl.DateTimeFormat(language, { year: 'numeric' }).format(currentDate)}
            </span>
          </div>
          
          <div className="flex md:hidden gap-1 bg-comfort-surface dark:bg-white/5 p-1 rounded-lg">
            <button onClick={() => navigateMonth(-1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white dark:hover:bg-white/10 transition-colors active:scale-95 text-gray-600 text-xs">◀️</button>
            <button onClick={() => navigateMonth(1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white dark:hover:bg-white/10 transition-colors active:scale-95 text-gray-600 text-xs">▶️</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
           <div className="hidden md:flex gap-1">
            <button onClick={() => navigateMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-comfort-surface hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-gray-500 active:scale-95">◀️</button>
            <button onClick={() => navigateMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-comfort-surface hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-gray-500 active:scale-95">▶️</button>
          </div>

          <div className="flex bg-comfort-surface dark:bg-white/5 rounded-xl p-0.5 md:p-1 shadow-inner w-full md:w-auto">
            <button 
              onClick={() => updateCalendarNav(calendarNavDate, 'weekly')} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase rounded-lg transition-all 
                ${view === 'weekly' 
                   ? 'bg-gray-50 dark:bg-zinc-800 text-indigo-500 shadow-sm transform scale-105'
                   : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {t('week', language)}
            </button>
            <button 
              onClick={() => updateCalendarNav(calendarNavDate, 'monthly')} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase rounded-lg transition-all
                ${view === 'monthly' 
                   ? 'bg-gray-50 dark:bg-zinc-800 text-indigo-500 shadow-sm transform scale-105'
                   : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {t('month', language)}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={view + calendarNavDate}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'monthly' ? renderMonthly() : renderWeekly()}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-6 md:mt-8 text-center md:hidden">
        <p className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">
           Tap day to add · Hold to drag
        </p>
      </div>
    </div>
  );
};
