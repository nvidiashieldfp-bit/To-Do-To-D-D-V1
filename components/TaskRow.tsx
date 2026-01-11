import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, SupportedLanguage, SectionType } from '../types';
import { PRIORITY_COLORS, formatDisplayDate, formatDisplayTime, sanitize, t, getNowString, getTomorrowString } from '../constants';
import { useTodoStore } from '../store/useTodoStore';
import { parseTaskInputLocal } from '../services/nlpService';

interface TaskRowProps {
  task: Task;
  language: SupportedLanguage;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onFocus?: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, language, onUpdate, onDelete }) => {
  const { setActiveInput, activeInput, activeInputId, state } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isHovered, setIsHovered] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<any>(null);

  const isMuted = ['ultra-low', 'photophobia'].includes(state.visualPreset);

  useEffect(() => {
    if ((activeInput !== 'edit' || activeInputId !== task.id) && isEditing) {
      setIsEditing(false); 
      setEditValue(task.title);
    }
    if (activeInput === 'edit' && activeInputId === task.id && !isEditing) {
      setIsEditing(true);
    }
  }, [activeInput, activeInputId, task.id, isEditing, task.title]);

  useEffect(() => { 
    if (isEditing && inputRef.current) { 
      inputRef.current.focus(); 
      inputRef.current.select(); 
    } 
  }, [isEditing]);

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      const parsed = parseTaskInputLocal(trimmed);
      onUpdate(task.id, { 
        title: parsed.title,
        priority: parsed.priority !== Priority.MEDIUM ? parsed.priority : task.priority,
        date: parsed.date || task.date,
        time: parsed.time || task.time
      });
    } else {
      setEditValue(task.title); 
    }
    setIsEditing(false);
    if (activeInput === 'edit' && activeInputId === task.id) setActiveInput('none');
  };

  const handleBlur = () => { if (isEditing) commitEdit(); };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { 
      commitEdit();
    } else if (e.key === 'Escape') { 
      setEditValue(task.title); 
      setIsEditing(false); 
      setActiveInput('none'); 
    }
  };

  const cyclePriority = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const order = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
    const currentIdx = order.indexOf(task.priority);
    const nextIndex = (currentIdx + 1) % order.length;
    
    onUpdate(task.id, { priority: order[nextIndex] });
  };

  const handleShortcuts = (e: React.KeyboardEvent) => {
    if (isEditing || state.focusSession.active) return;
    
    const key = e.key.toLowerCase();
    switch (key) {
      case '1': onUpdate(task.id, { priority: Priority.LOW }); break;
      case '2': onUpdate(task.id, { priority: Priority.MEDIUM }); break;
      case '3': onUpdate(task.id, { priority: Priority.HIGH }); break;
      case 'd': 
        e.preventDefault();
        dateInputRef.current?.focus(); 
        break;
      case 't': 
        e.preventDefault();
        timeInputRef.current?.focus(); 
        break;
    }
  };

  const startInlineEdit = (e: React.MouseEvent) => {
    if (showMobileMenu) return; 
    e.stopPropagation();
    setActiveInput('edit', task.id);
    setIsEditing(true);
  };

  // --- MOBILE LONG PRESS LOGIC ---
  const handleTouchStart = () => {
    if (isEditing) return;
    longPressTimer.current = setTimeout(() => {
      setShowMobileMenu(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600); // 600ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMoveTask = (section: SectionType) => {
    let date = task.date;
    const today = getNowString();
    const tomorrow = getTomorrowString();

    if (section === SectionType.NOW || section === SectionType.TODAY) date = today;
    else if (section === SectionType.TOMORROW) date = tomorrow;
    else if (section === SectionType.FUTURE) date = null;

    onUpdate(task.id, { 
      date, 
      priority: section === SectionType.NOW ? Priority.HIGH : task.priority,
      completed: false
    });
    setShowMobileMenu(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.completed) {
      onDelete(task.id);
    } else {
      // Move to 'Completed' (Did) section instantly
      onUpdate(task.id, { completed: true });
    }
  };

  const safeDate = sanitize(task.date);
  const safeTime = sanitize(task.time);
  const formattedDate = safeDate ? formatDisplayDate(safeDate, language) : null;
  const formattedTime = safeTime ? formatDisplayTime(safeTime, language) : null;

  const showMetadata = isHovered || !!formattedDate || !!formattedTime;

  return (
    <>
      <motion.div
        ref={rowRef}
        layout
        tabIndex={0}
        onKeyDown={handleShortcuts}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        draggable={!isEditing && !showMobileMenu}
        onDragStart={(e: any) => e.dataTransfer.setData('taskId', task.id)}
        animate={{ opacity: task.completed ? 0.4 : 1 }}
        className="group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 cursor-grab outline-none focus:ring-2 focus:ring-indigo-500/10 bg-comfort-panel dark:bg-white/5 relative"
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { completed: !task.completed }); }} 
          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center icon-muted transition-colors cursor-pointer ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400 dark:border-gray-600'}`}
          tabIndex={-1}
          style={{ opacity: 'var(--icon-opacity)' }}
        >
          {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
        </button>

        <button 
          onClick={cyclePriority} 
          onMouseDown={(e) => e.stopPropagation()}
          className={`w-4 h-8 rounded-full shrink-0 transition-all duration-300 hover:scale-105 active:scale-90 priority-bar flex items-center justify-center overflow-hidden shadow-sm cursor-pointer ${PRIORITY_COLORS[task.priority]}`} 
          tabIndex={-1}
          title={`${t('priority_label', language)}: ${task.priority}`}
          style={{ opacity: isMuted ? 'var(--icon-opacity)' : 1 }}
        />

        <div className="flex-1 min-w-0" onClick={startInlineEdit}>
          {isEditing ? (
            <input 
              ref={inputRef} 
              type="text" 
              value={editValue} 
              onChange={e => setEditValue(e.target.value)} 
              onBlur={handleBlur} 
              onKeyDown={handleKeyDown} 
              className="w-full bg-transparent border-none outline-none p-0 text-[17px] font-medium text-indigo-500 placeholder:text-gray-400" 
            />
          ) : (
            <div className={`text-[17px] font-medium truncate relative transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showMetadata && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                title="Schedule Date"
                className={`relative px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight bg-gray-400/5 dark:bg-white/5 transition-all flex items-center justify-center min-w-[55px] border border-transparent hover:border-indigo-500/20 group/meta cursor-pointer ${!formattedDate ? 'opacity-0 group-hover:opacity-100' : 'text-gray-600 dark:text-gray-400'}`}
                style={{ opacity: isMuted ? 'var(--icon-opacity)' : undefined }}
              >
                <input 
                  ref={dateInputRef}
                  type="date" 
                  value={safeDate || ''} 
                  onChange={e => { e.stopPropagation(); onUpdate(task.id, { date: e.target.value || null }); }} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                  tabIndex={-1} 
                />
                <span className="truncate">{formattedDate || t('date', language)}</span>
              </div>
              
              <div 
                onClick={(e) => e.stopPropagation()}
                title="Set Time"
                className={`relative px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight bg-gray-400/5 dark:bg-white/5 transition-all flex items-center justify-center min-w-[55px] border border-transparent hover:border-amber-500/20 group/meta cursor-pointer ${!formattedTime ? 'opacity-0 group-hover:opacity-100' : 'text-gray-600 dark:text-gray-400'}`}
                style={{ opacity: isMuted ? 'var(--icon-opacity)' : undefined }}
              >
                <input 
                  ref={timeInputRef}
                  type="time" 
                  value={safeTime || ''} 
                  onChange={e => { e.stopPropagation(); onUpdate(task.id, { time: e.target.value || null }); }} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                  tabIndex={-1} 
                />
                <span className="truncate">{formattedTime || t('time', language)}</span>
              </div>

              <button 
                onClick={handleDeleteClick} 
                className="p-1.5 rounded-lg text-sm grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:bg-red-500/5 transition-all icon-muted cursor-pointer" 
                tabIndex={-1} 
                title={task.completed ? "Delete Permanently" : "Move to Completed"}
                style={{ opacity: 'var(--icon-opacity)' }}
              >
                🗑️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Portal-based Mobile Menu to avoid overflow clipping */}
      {showMobileMenu && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 m-0 sm:m-4 flex flex-col gap-2 mb-safe-area"
            >
              <div className="px-3 py-2 text-xs font-bold uppercase text-gray-400 tracking-widest text-center border-b border-gray-100 dark:border-white/5 mb-1">
                Move Task
              </div>
              <button onClick={() => handleMoveTask(SectionType.NOW)} className="p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">⚡ Now</button>
              <button onClick={() => handleMoveTask(SectionType.TODAY)} className="p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">📅 Today</button>
              <button onClick={() => handleMoveTask(SectionType.TOMORROW)} className="p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">🌅 Tomorrow</button>
              <button onClick={() => handleMoveTask(SectionType.FUTURE)} className="p-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">🔮 Future</button>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};