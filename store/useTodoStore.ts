import { useState, useEffect, useCallback } from 'react';
import { Task, SectionType, AppState, Priority, ThemeMode, ActiveInput, VisualPreset, SupportedLanguage, SortMode, CalendarViewType } from '../types';
import { getNowString, getTomorrowString, formatDate, ENERGY_KEYWORDS, sanitize, FOCUS_WORK_MINUTES } from '../constants';
import { detectLanguage, detectCountryAndRegion } from '../services/contextService';
import { parseTaskInputLocal } from '../services/nlpService';
import { parseTaskInput } from '../services/geminiService';

const STORAGE_KEY = 'todo_to_did_v1';

const detectSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'night';
  }
  return 'light';
};

const getInitialState = (): AppState => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  const today = getNowString();
  const detectedLang = detectLanguage();
  const context = detectCountryAndRegion();
  const systemTheme = detectSystemTheme();

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        collapsedSections: new Set(parsed.collapsedSections || []),
        language: parsed.language || detectedLang,
        theme: parsed.theme || systemTheme,
        draft: '',
        draftPriority: Priority.MEDIUM,
      };
    } catch (e) {}
  }
  return {
    tasks: [],
    collapsedSections: new Set(),
    viewMode: 'list',
    sortMode: 'MANUAL',
    calendarNavDate: today,
    calendarViewType: 'monthly',
    focusSession: { active: false, startTime: null, timeLeft: null, mode: 'work' },
    lastCompletedTaskId: null,
    language: detectedLang,
    theme: systemTheme,
    showLanding: true,
    visualPreset: 'editor',
    autoThemeSwitch: true,
    isEyeComfort: false,
    country: context.country,
    region: context.region,
    holidayAwareness: true,
    holidayAlerts: false,
    showStats: true,
    draft: '',
    draftPriority: Priority.MEDIUM,
  };
};

/**
 * Shared Singleton State to ensure "One Active Input" rule is global across all hook instances.
 */
let sharedState: AppState = getInitialState();
let sharedActiveInput: ActiveInput = 'none';
let sharedActiveInputId: string | null = null;
let calendarDraftCoords: { date: string | null; time: string | null } = { date: null, time: null };
const listeners = new Set<() => void>();

const notify = () => listeners.forEach(l => l());

export function useTodoStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  useEffect(() => {
    const { draft, draftPriority, ...persist } = sharedState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...persist, collapsedSections: Array.from(sharedState.collapsedSections) }));
    
    const isDark = sharedState.theme === 'dark' || sharedState.theme === 'night';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-preset', sharedState.visualPreset);
  }, [sharedState]);

  const addTask = useCallback((task: any) => {
    const id = crypto.randomUUID();
    sharedState = { 
      ...sharedState, 
      tasks: [{ 
        ...task, id, createdAt: Date.now(), completed: false, order: Date.now(),
        date: sanitize(task.date), time: sanitize(task.time)
      }, ...sharedState.tasks],
      draft: '', 
      draftPriority: Priority.MEDIUM 
    };
    sharedActiveInput = 'none';
    notify();
    return id;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    sharedState = { 
      ...sharedState, 
      tasks: sharedState.tasks.map(t => t.id === id ? { 
        ...t, ...updates, 
        date: updates.date !== undefined ? sanitize(updates.date) : t.date,
        time: updates.time !== undefined ? sanitize(updates.time) : t.time,
        completedAt: updates.completed ? Date.now() : t.completedAt 
      } : t),
      lastCompletedTaskId: updates.completed ? id : sharedState.lastCompletedTaskId
    };
    notify();
  }, []);

  const submitDraft = useCallback(async (overrides?: Partial<Task>) => {
    const raw = sharedState.draft.trim();
    if (!raw) {
      sharedActiveInput = 'none';
      notify();
      return;
    }

    const localParsed = parseTaskInputLocal(raw);
    const finalTaskData = {
      ...localParsed,
      ...overrides,
      priority: overrides?.priority || (localParsed.priority !== Priority.MEDIUM ? localParsed.priority : sharedState.draftPriority)
    };

    const id = addTask(finalTaskData);

    parseTaskInput(raw).then(geminiParsed => {
      updateTask(id, {
        priority: geminiParsed.priority !== Priority.MEDIUM ? geminiParsed.priority : finalTaskData.priority,
        date: geminiParsed.date || finalTaskData.date,
        time: geminiParsed.time || finalTaskData.time
      });
    }).catch(() => {});

    sharedActiveInput = 'none';
    notify();
  }, [addTask, updateTask]);

  const deleteTask = useCallback((id: string) => {
    sharedState = { ...sharedState, tasks: sharedState.tasks.filter(t => t.id !== id) };
    notify();
  }, []);

  const reorderTasks = useCallback((taskId: string, section: SectionType) => {
    const today = getNowString();
    const tomorrow = getTomorrowString();
    const task = sharedState.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    let date = task.date;
    let completed = task.completed;
    let priority = task.priority;

    if (section === SectionType.NOW) { 
      date = today; 
      priority = Priority.HIGH; 
      completed = false; 
    } else if (section === SectionType.TODAY) { 
      date = today; 
      completed = false; 
    } else if (section === SectionType.TOMORROW) { 
      date = tomorrow; 
      completed = false; 
    } else if (section === SectionType.FUTURE) {
      date = null; 
      completed = false;
    } else if (section === SectionType.DID) { 
      completed = true; 
    }

    sharedState = {
      ...sharedState,
      tasks: sharedState.tasks.map(t => t.id === taskId ? { 
        ...t, date, completed, priority, order: Date.now() 
      } : t)
    };
    notify();
  }, []);

  const getSortedTasks = useCallback(() => {
    const today = getNowString();
    const tomorrow = getTomorrowString();
    const cur = new Date();
    const h = cur.getHours();
    const m = cur.getMinutes();
    const sections: Record<SectionType, Task[]> = { NOW: [], TODAY: [], TOMORROW: [], FUTURE: [], DID: [] };

    sharedState.tasks.forEach(t => {
      if (t.completed) { sections.DID.push(t); return; }
      const d = sanitize(t.date) || today;
      if (d < today) {
        sections.NOW.push(t);
      } else if (d === today) {
        if (t.priority === Priority.HIGH) {
          sections.NOW.push(t);
        } else if (t.time) {
          const parts = t.time.split(':').map(Number);
          const th = parts[0];
          const tm = parts[1];
          if (th < h || (th === h && tm <= m)) sections.NOW.push(t); else sections.TODAY.push(t);
        } else {
          sections.TODAY.push(t);
        }
      } else if (d === tomorrow) {
        sections.TOMORROW.push(t);
      } else {
        sections.FUTURE.push(t);
      }
    });

    const prioVal = (p: Priority) => p === Priority.HIGH ? 3 : p === Priority.MEDIUM ? 2 : 1;
    
    (Object.keys(sections) as SectionType[]).forEach(key => {
      sections[key].sort((a: Task, b: Task) => {
        if (sharedState.sortMode === 'PRIORITY') {
          return prioVal(b.priority) - prioVal(a.priority) || a.order - b.order;
        }
        if (sharedState.sortMode === 'ENERGY') {
          const aEnergy = (prioVal(a.priority) * 10) + (ENERGY_KEYWORDS.some(k => a.title.toLowerCase().includes(k)) ? 5 : 0);
          const bEnergy = (prioVal(b.priority) * 10) + (ENERGY_KEYWORDS.some(k => b.title.toLowerCase().includes(k)) ? 5 : 0);
          return bEnergy - aEnergy || a.order - b.order;
        }
        return a.order - b.order;
      });
    });
    return sections;
  }, []);

  const setActiveInput = useCallback((i: ActiveInput, id: string | null = null, coords?: { date: string | null, time: string | null }) => {
    sharedActiveInput = i;
    sharedActiveInputId = id;
    if (i === 'calendar' && coords) {
      calendarDraftCoords = coords;
    } else if (i !== 'calendar' && i !== 'edit') {
      calendarDraftCoords = { date: null, time: null };
    }
    notify();
  }, []);

  return {
    state: sharedState, 
    activeInput: sharedActiveInput, 
    activeInputId: sharedActiveInputId, 
    calendarDraftCoords,
    hasUndo: !!sharedState.lastCompletedTaskId,
    setActiveInput,
    addTask, updateTask, deleteTask, getSortedTasks, reorderTasks, submitDraft,
    toggleSection: (s: SectionType) => { 
      const n = new Set(sharedState.collapsedSections); 
      if (n.has(s)) n.delete(s); else n.add(s); 
      sharedState = { ...sharedState, collapsedSections: n }; 
      notify();
    },
    toggleView: () => { 
      sharedState = { ...sharedState, viewMode: sharedState.viewMode === 'list' ? 'calendar' : 'list' };
      notify();
    },
    toggleTheme: () => { 
      sharedState = { ...sharedState, theme: sharedState.theme === 'light' ? 'night' : 'light', autoThemeSwitch: false };
      notify();
    },
    setSortMode: (mode: SortMode) => { 
      sharedState = { ...sharedState, sortMode: mode };
      notify();
    },
    setDraft: (d: string) => { 
      sharedState = { ...sharedState, draft: d };
      notify();
    },
    setDraftPriority: (p: Priority) => { 
      sharedState = { ...sharedState, draftPriority: p };
      notify();
    },
    setShowLanding: (s: boolean) => { 
      sharedState = { ...sharedState, showLanding: s };
      notify();
    },
    updateCalendarNav: (date: string, viewType?: CalendarViewType) => { 
      sharedState = { 
        ...sharedState, 
        calendarNavDate: date, 
        calendarViewType: viewType || sharedState.calendarViewType 
      };
      notify();
    },
    toggleFocus: (taskId?: string) => { 
      sharedState = { 
        ...sharedState, 
        focusSession: { 
          active: !sharedState.focusSession.active, 
          timeLeft: FOCUS_WORK_MINUTES * 60, 
          mode: 'work', 
          taskId, 
          startTime: Date.now() 
        } 
      };
      notify();
    },
    updateFocusTime: (t: number, m: any) => { 
      sharedState = { 
        ...sharedState, 
        focusSession: { ...sharedState.focusSession, timeLeft: t, mode: m } 
      };
      notify();
    },
    endFocus: () => { 
      sharedState = { 
        ...sharedState, 
        focusSession: { active: false, startTime: null, timeLeft: null, mode: 'work' } 
      };
      notify();
    },
    undoLastCompletion: () => {
      if (!sharedState.lastCompletedTaskId) return;
      updateTask(sharedState.lastCompletedTaskId, { completed: false });
      sharedState = { ...sharedState, lastCompletedTaskId: null };
      notify();
    }
  };
}
