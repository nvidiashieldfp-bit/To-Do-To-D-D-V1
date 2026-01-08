import React, { useEffect, useState, useMemo } from 'react';
import { SupportedLanguage } from '../types';
import { useTodoStore } from '../store/useTodoStore';
import { getHolidays } from '../constants/holidays';

interface FooterProps {
  language: SupportedLanguage;
  isFocusActive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ language, isFocusActive }) => {
  const { state } = useTodoStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    if (!state.showStats || state.tasks.length === 0) return null;
    const total = state.tasks.length;
    let weekends = 0;
    let holidaysCount = 0;

    const currentYear = new Date().getFullYear();
    const annualHolidays = getHolidays(currentYear, state.country, state.region);
    const holidayStrings = new Set(annualHolidays.map(h => h.date));

    state.tasks.forEach(t => {
      if (!t.date) return;
      const d = new Date(t.date);
      const day = d.getDay();
      if (day === 0 || day === 6) weekends++;
      if (holidayStrings.has(t.date)) holidaysCount++;
    });

    return {
      total,
      weekendPct: Math.round((weekends / total) * 100),
      holidayPct: Math.round((holidaysCount / total) * 100)
    };
  }, [state.tasks, state.showStats, state.country, state.region]);

  const year = now.getFullYear();
  
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  };

  const localizedDate = new Intl.DateTimeFormat(language, dateOptions).format(now);
  const localizedTime = new Intl.DateTimeFormat(language, timeOptions).format(now);

  return (
    <footer 
      data-testid="app-footer"
      className={`mt-auto pt-16 pb-6 md:pb-12 text-center select-none cursor-default transition-none !transition-none
        ${isFocusActive ? 'hidden' : 'opacity-20 dark:opacity-10 hover:opacity-100'}
      `}
    >
      <div className="flex flex-col gap-1.5 md:gap-2 items-center text-gray-800 dark:text-white">
        <div className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase flex items-center gap-2">
          TD {year} <span className="w-1 h-1 bg-indigo-500 rounded-full icon-muted" style={{ opacity: 'var(--icon-opacity)' }} /> To-Do To-Did
        </div>
        <div className="text-[7.5px] md:text-[9px] font-medium tracking-widest text-gray-500 dark:text-gray-400 uppercase tabular-nums">
          {localizedDate} · {localizedTime}
        </div>
        
        {stats && (
           <div className={`mt-2 text-[7px] md:text-[8px] font-bold uppercase tracking-widest flex gap-4 ${['ultra-low', 'photophobia'].includes(state.visualPreset) ? 'text-gray-500' : 'text-indigo-500/80'}`}>
             <span>Wknd: {stats.weekendPct}%</span>
             <span>Holiday: {stats.holidayPct}%</span>
           </div>
        )}

        <div className="text-[7px] md:text-[8.5px] font-medium text-gray-400 dark:text-gray-500 tracking-wider mt-1">
          {state.country} · {state.region !== 'GENERIC' ? state.region.split('-')[1] : 'GENERIC'} · Designed & built by Fabio Papoila
        </div>
      </div>
    </footer>
  );
};