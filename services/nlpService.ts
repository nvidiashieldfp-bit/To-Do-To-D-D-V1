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
  // Time pattern optionally capturing preceding preposition
  time: /\b((at|@|às|as|a las|à)\s+)?(\d{1,2})(:(\d{2})|h(\d{2})?|pm|am)\b/i,
  // Priority patterns including multi-word phrases
  high: /\b(high priority|alta prioridade|prioridad alta|haute priorit[ée]|urgent[e]?|important[e]?|high|alta|urgente|prioritaire)\b/i,
  low: /\b(low priority|baixa prioridade|prioridade baixa|prioridad baja|basse priorit[ée]|low|baixa|baja|faible|trivial)\b/i,
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

  // Priority detection (longest matches first handled by regex)
  if (PATTERNS.high.test(title)) { 
    priority = Priority.HIGH; 
    title = title.replace(PATTERNS.high, ''); 
    metadataFound = true; 
  }
  else if (PATTERNS.low.test(title)) { 
    priority = Priority.LOW; 
    title = title.replace(PATTERNS.low, ''); 
    metadataFound = true; 
  }

  // Date detection
  if (PATTERNS.today.test(title)) { 
    date = getNowString(); 
    title = title.replace(PATTERNS.today, ''); 
    metadataFound = true; 
  }
  else if (PATTERNS.tomorrow.test(title)) { 
    date = getTomorrowString(); 
    title = title.replace(PATTERNS.tomorrow, ''); 
    metadataFound = true; 
  }
  else {
    const days = [PATTERNS.sunday, PATTERNS.monday, PATTERNS.tuesday, PATTERNS.wednesday, PATTERNS.thursday, PATTERNS.friday, PATTERNS.saturday];
    days.forEach((pattern, i) => {
      if (pattern.test(title)) { 
        date = getNextWeekday(i); 
        title = title.replace(pattern, ''); 
        metadataFound = true; 
      }
    });
  }

  // Time detection
  const timeMatch = title.match(PATTERNS.time);
  if (timeMatch) {
    // group 3 is hour, group 5 is min (:xx), group 6 is min (hxx)
    let h = parseInt(timeMatch[3]);
    const m = timeMatch[5] || timeMatch[6] || '00';
    const mod = timeMatch[0].toLowerCase();
    
    if (mod.includes('pm') && h < 12) h += 12;
    if (mod.includes('am') && h === 12) h = 0;
    
    time = `${String(h).padStart(2, '0')}:${m}`;
    title = title.replace(PATTERNS.time, '');
    metadataFound = true;
  }

  // Recurrence detection
  if (PATTERNS.daily.test(title)) { 
    recurrence = Recurrence.DAILY; 
    title = title.replace(PATTERNS.daily, ''); 
    metadataFound = true; 
  }
  else if (PATTERNS.weekly.test(title)) { 
    recurrence = Recurrence.WEEKLY; 
    title = title.replace(PATTERNS.weekly, ''); 
    metadataFound = true; 
  }

  title = title.replace(/\s+/g, ' ').trim();
  
  if (metadataFound) metrics.record('nlp_success'); else metrics.record('nlp_fail');
  
  return { title: sanitize(title) || input, priority, date, time, recurrence };
}