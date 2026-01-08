
import { Priority, Recurrence } from "../types";
import { getNowString, getTomorrowString, sanitize } from "../constants";
import { metrics } from "./metricsService";

interface ParsedTask {
  title: string;
  priority: Priority;
  date: string | null;
  time: string | null;
  recurrence: Recurrence;
}

const PATTERNS = {
  today: /\b(hoje|today|hoy|aujourd'hui)\b/i,
  tomorrow: /\b(amanh[ãa]|tomorrow|mañana|demain)\b/i,
  monday: /\b(segunda|monday|lunes|lundi)\b/i,
  tuesday: /\b(terça|tuesday|martes|mardi)\b/i,
  wednesday: /\b(quarta|wednesday|miércoles|mercredi)\b/i,
  thursday: /\b(quinta|thursday|jueves|jeudi)\b/i,
  friday: /\b(sexta|friday|viernes|vendredi)\b/i,
  saturday: /\b(sábado|sabado|saturday|samedi)\b/i,
  sunday: /\b(domingo|sunday|dimanche)\b/i,
  time: /\b(\d{1,2})(:(\d{2})|h(\d{2})?|pm|am)\b/i,
  high: /\b(urgent[e]?|important[e]?|high|alta|urgente|prioritaire)\b/i,
  low: /\b(low|baixa|baja|faible|trivial)\b/i,
  daily: /\b(diariamente|every day|daily|todos los días|chaque jour)\b/i,
  weekly: /\b(semanalmente|weekly|chaque semaine)\b/i
};

const getNextWeekday = (dayIndex: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + ((dayIndex + 7 - d.getDay()) % 7 || 7));
  return d.toISOString().split('T')[0];
};

export function parseTaskInputLocal(input: string): ParsedTask {
  let title = input;
  let priority = Priority.MEDIUM;
  let date: string | null = null;
  let time: string | null = null;
  let recurrence = Recurrence.NONE;
  let metadataFound = false;

  if (PATTERNS.high.test(title)) { priority = Priority.HIGH; title = title.replace(PATTERNS.high, ''); metadataFound = true; }
  else if (PATTERNS.low.test(title)) { priority = Priority.LOW; title = title.replace(PATTERNS.low, ''); metadataFound = true; }

  if (PATTERNS.today.test(title)) { date = getNowString(); title = title.replace(PATTERNS.today, ''); metadataFound = true; }
  else if (PATTERNS.tomorrow.test(title)) { date = getTomorrowString(); title = title.replace(PATTERNS.tomorrow, ''); metadataFound = true; }
  else {
    const days = [PATTERNS.sunday, PATTERNS.monday, PATTERNS.tuesday, PATTERNS.wednesday, PATTERNS.thursday, PATTERNS.friday, PATTERNS.saturday];
    days.forEach((pattern, i) => {
      if (pattern.test(title)) { date = getNextWeekday(i); title = title.replace(pattern, ''); metadataFound = true; }
    });
  }

  const timeMatch = title.match(PATTERNS.time);
  if (timeMatch) {
    let h = parseInt(timeMatch[1]);
    const m = timeMatch[3] || timeMatch[4] || '00';
    const mod = timeMatch[0].toLowerCase();
    if (mod.includes('pm') && h < 12) h += 12;
    if (mod.includes('am') && h === 12) h = 0;
    time = `${String(h).padStart(2, '0')}:${m}`;
    title = title.replace(PATTERNS.time, '');
    metadataFound = true;
  }

  if (PATTERNS.daily.test(title)) { recurrence = Recurrence.DAILY; title = title.replace(PATTERNS.daily, ''); metadataFound = true; }
  else if (PATTERNS.weekly.test(title)) { recurrence = Recurrence.WEEKLY; title = title.replace(PATTERNS.weekly, ''); metadataFound = true; }

  title = title.replace(/\s+/g, ' ').trim();
  if (metadataFound) metrics.record('nlp_success'); else metrics.record('nlp_fail');
  return { title: sanitize(title) || input, priority, date, time, recurrence };
}
