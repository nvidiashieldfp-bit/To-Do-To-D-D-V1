
/**
 * ============================================================================
 * FILE: components/CommandPalette.tsx
 * PURPOSE: Global command palette for power user shortcuts.
 * RESPONSIBILITY: Provides a quick way to navigate and toggle states.
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../constants';
import { useTodoStore } from '../store/useTodoStore';
import { SupportedLanguage } from '../types';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void; language: SupportedLanguage }> = ({ isOpen, onClose, language }) => {
  const { toggleView, toggleTheme, toggleFocus, setSortMode, setActiveInput } = useTodoStore();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(() => [
    { id: 'add', label: t('add_placeholder', language), icon: '➕', action: () => setActiveInput('main') },
    { id: 'focus', label: 'Toggle Focus', icon: '⏱️', action: () => toggleFocus() },
    { id: 'view', label: 'Toggle View', icon: '🔄', action: () => toggleView() },
    { id: 'theme', label: 'Toggle Theme', icon: '🌓', action: () => toggleTheme() },
    { id: 'sm', label: t('cp_sort_manual', language), icon: '🤏', action: () => setSortMode('MANUAL') },
    { id: 'sp', label: t('cp_sort_priority', language), icon: '📶', action: () => setSortMode('PRIORITY') },
    { id: 'se', label: t('cp_sort_energy', language), icon: '🔋', action: () => setSortMode('ENERGY') },
  ], [language, toggleView, toggleTheme, toggleFocus, setSortMode, setActiveInput]);

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { if (isOpen) { setQuery(''); setIndex(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex(prev => (prev + 1) % filtered.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex(prev => (prev - 1 + filtered.length) % filtered.length); }
    else if (e.key === 'Enter') { filtered[index]?.action(); onClose(); }
    else if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4">
            <div className="bg-comfort-panel dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-comfort-border dark:border-white/5">
              <div className="p-4 border-b border-comfort-border dark:border-white/5 flex items-center gap-3">
                <span className="text-xl">🔍</span>
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder={t('cp_placeholder', language)} className="w-full bg-transparent border-none outline-none text-xl placeholder:text-gray-500" />
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filtered.map((c, i) => (
                  <button key={c.id} onClick={() => { c.action(); onClose(); }} onMouseEnter={() => setIndex(i)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left ${i === index ? 'bg-indigo-500 text-white' : 'hover:bg-comfort-surface dark:hover:bg-white/5'}`}>
                    <span className="text-xl">{c.icon}</span>
                    <span className="flex-1 font-semibold">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
