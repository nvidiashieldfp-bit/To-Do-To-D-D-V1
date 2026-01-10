import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, SupportedLanguage } from '../types';
import { PRIORITY_COLORS, formatDisplayDate, formatDisplayTime, sanitize, t } from '../constants';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

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
    e.stopPropagation();
    const order = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
    const nextIndex = (order.indexOf(task.priority) + 1) % order.length;
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
    e.stopPropagation();
    setActiveInput('edit', task.id);
    setIsEditing(true);
  };

  const safeDate = sanitize(task.date);
  const safeTime = sanitize(task.time);
  const formattedDate = safeDate ? formatDisplayDate(safeDate, language) : null;
  const formattedTime = safeTime ? formatDisplayTime(safeTime, language) : null;

  const showMetadata = isHovered || !!formattedDate || !!formattedTime;

  return (
    <motion.div
      ref={rowRef}
      layout
      tabIndex={0}
      onKeyDown={handleShortcuts}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={!isEditing}
      onDragStart={(e: any) => e.dataTransfer.setData('taskId', task.id)}
      animate={{ opacity: task.completed ? 0.4 : 1 }}
      className="group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 cursor-grab outline-none focus:ring-2 focus:ring-indigo-500/10 bg-comfort-panel dark:bg-white/5 relative"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { completed: !task.completed }); }} 
        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center icon-muted transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400 dark:border-gray-600'}`}
        tabIndex={-1}
        style={{ opacity: 'var(--icon-opacity)' }}
      >
        {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
      </button>

      <button 
        onClick={cyclePriority} 
        className={`w-3 h-8 rounded-full shrink-0 transition-all duration-300 hover:brightness-110 active:scale-90 priority-bar flex items-center justify-center overflow-hidden shadow-sm ${PRIORITY_COLORS[task.priority]}`} 
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
              className={`relative px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight bg-gray-400/5 dark:bg-white/5 transition-all flex items-center justify-center min-w-[55px] border border-transparent hover:border-indigo-500/20 group/meta ${!formattedDate ? 'opacity-0 group-hover:opacity-100' : 'text-gray-600 dark:text-gray-400'}`}
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
              className={`relative px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight bg-gray-400/5 dark:bg-white/5 transition-all flex items-center justify-center min-w-[55px] border border-transparent hover:border-amber-500/20 group/meta ${!formattedTime ? 'opacity-0 group-hover:opacity-100' : 'text-gray-600 dark:text-gray-400'}`}
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
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
              className="p-1.5 rounded-lg text-sm grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:bg-red-500/5 transition-all icon-muted" 
              tabIndex={-1} 
              style={{ opacity: 'var(--icon-opacity)' }}
            >
              🗑️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};