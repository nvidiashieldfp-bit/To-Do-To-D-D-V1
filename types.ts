
/**
 * ============================================================================
 * FILE: types.ts
 * PURPOSE: Centralized type definitions and domain models.
 * RESPONSIBILITY: Defines the core interfaces, enums, and state structures
 * used across the application to ensure type safety and consistency.
 * ============================================================================
 */

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Recurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKDAYS = 'WEEKDAYS',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum SectionType {
  NOW = 'NOW',
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  FUTURE = 'FUTURE',
  DID = 'DID',
}

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr';
export type SupportedCountry = 'PT' | 'ES' | 'FR' | 'US' | 'GB';
export type SupportedRegion = 'PT-CONTINENTAL' | 'PT-AZORES' | 'PT-MADEIRA' | 'GENERIC';

export type ThemeMode = 'dark' | 'light' | 'night';
export type CalendarViewType = 'weekly' | 'monthly';

export type VisualPreset = 'paper' | 'editor' | 'soft' | 'noturno' | 'ultra-low' | 'photophobia';

export type ActiveView = 'list' | 'calendar';
export type ActiveInput = 'none' | 'main' | 'calendar' | 'edit';

/**
 * Sorting Strategies
 */
export type SortMode = 'MANUAL' | 'PRIORITY' | 'ENERGY';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  recurrence: Recurrence;
  date: string | null;
  time: string | null;
  order: number;
  createdAt: number;
  completedAt?: number;
  inCalendar?: boolean;
}

export interface FocusSession {
  active: boolean;
  startTime: number | null;
  timeLeft: number | null;
  mode: 'work' | 'break';
  taskId?: string;
}

export interface AppState {
  tasks: Task[];
  collapsedSections: Set<SectionType>;
  viewMode: ActiveView;
  sortMode: SortMode;
  calendarNavDate: string;
  calendarViewType: CalendarViewType;
  focusSession: FocusSession;
  lastCompletedTaskId: string | null;
  language: SupportedLanguage;
  theme: ThemeMode;
  visualPreset: VisualPreset;
  autoThemeSwitch: boolean;
  isEyeComfort: boolean;
  showLanding: boolean;
  country: SupportedCountry;
  region: SupportedRegion;
  holidayAwareness: boolean;
  holidayAlerts: boolean;
  showStats: boolean;
  draft: string;
  draftPriority: Priority;
}
