import { SectionType, Priority, SupportedLanguage } from './types';

export const SECTION_ORDER: SectionType[] = [
  SectionType.NOW,
  SectionType.TODAY,
  SectionType.TOMORROW,
  SectionType.FUTURE,
  SectionType.DID
];

export const PRIORITY_COLORS = {
  [Priority.LOW]: 'bg-emerald-500',
  [Priority.MEDIUM]: 'bg-amber-500',
  [Priority.HIGH]: 'bg-rose-500',
};

export const ENERGY_KEYWORDS = [
  'urgent', 'urgente', 'important', 'importante', 'asap', 'deadline', 'prazo',
  'call', 'chamada', 'reunião', 'meeting', 'pay', 'pagar', 'submit', 'enviar', 'entregar'
];

export const FOCUS_WORK_MINUTES = 25;
export const FOCUS_BREAK_MINUTES = 5;

/**
 * Robust sanitizer to handle JS nulls and stringified "null" from LLM/Storage errors.
 */
export const sanitize = (val: any): string | null => {
  if (val === null || val === undefined || val === 'null' || val === 'undefined' || val === '') return null;
  return String(val).trim();
};

export const getNowString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getTomorrowString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatDisplayDate = (dateStr: string, lang: SupportedLanguage): string => {
  const s = sanitize(dateStr);
  if (!s) return '';
  try {
    const [y, m, d] = s.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return s;
    return new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' }).format(date);
  } catch (e) { return ''; }
};

export const formatDisplayTime = (timeStr: string, lang: SupportedLanguage): string => {
  const s = sanitize(timeStr);
  if (!s) return '';
  try {
    const parts = s.split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return '';
    const d = new Date();
    d.setHours(parts[0], parts[1], 0, 0);
    return new Intl.DateTimeFormat(lang, { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(d);
  } catch (e) { return ''; }
};

export const getWeekdays = (lang: SupportedLanguage): string[] => {
  const formatter = new Intl.DateTimeFormat(lang, { weekday: 'short' });
  const days = [];
  // Sep 29 2024 is a Sunday
  const refDate = new Date(2024, 8, 29);
  for (let i = 0; i < 7; i++) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() + i);
    days.push(formatter.format(d).replace('.', ''));
  }
  return days;
};

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    tagline: 'Less planning. More doing.',
    now: 'Now', today: 'Today', tomorrow: 'Tomorrow', future: 'Future', did: 'Did',
    add_placeholder: "Add task...", clear_mind: 'Your mind is clear.', undo: 'Undo',
    focus_mode: 'Deep Focus', break_mode: 'Break', end_session: 'End Session',
    date: 'Date', time: 'Time', week: 'Week', month: 'Month',
    notif_focus: 'Focus Timer', notif_work_done: 'Work session complete!',
    notif_break_done: 'Break finished!', priority_label: 'Priority',
    landing_open: 'Open app', landing_title: 'To-Do To-Did',
    landing_subtitle: 'The minimalist task manager that stays out of your way.',
    cp_placeholder: 'Type a command...', cp_sort_manual: 'Sort: Manual',
    cp_sort_priority: 'Sort: Priority', cp_sort_energy: 'Sort: Energy',
    landing_what_title: 'WHAT IS THIS?',
    landing_what_p1: 'A task manager built for people who hate managing tasks.',
    landing_what_list: 'No folders,No tags,No subtasks,No clutter',
    landing_what_p2: 'Just type. We handle the rest.',
    landing_how_title: 'HOW IT WORKS',
    landing_how_1_t: 'Natural Input', landing_how_1_d: 'Type "Buy milk tomorrow 10am" and we parse it instantly.',
    landing_how_2_t: 'Smart Sections', landing_how_2_d: 'Tasks move between sections automatically based on time.',
    landing_how_3_t: 'Deep Focus', landing_how_3_d: 'Integrated Pomodoro timer with a clean UI.',
    landing_how_4_t: 'Local First', landing_how_4_d: 'All data stays on your device. Privacy by design.',
    landing_why_title: 'WHY TO-DO TO-DID?',
    landing_why_1: 'Zero distractions. Focus on what matters.',
    landing_why_2: 'Fast as thought. Keyboard-centric UX.',
    landing_why_3: 'Offline capable. Works anywhere.',
    landing_why_4: 'Completely free. No accounts needed.',
    landing_privacy_title: 'PRIVACY',
    landing_privacy_p1: 'We don\'t track you. We don\'t even have a server.',
    landing_privacy_list: 'No ads,No cookies,No analytics,Local storage only',
    landing_footer: 'Focus. Efficiency. Clarity.',
    mantra_empty: 'Space is opportunity. Set an intention.',
    mantra_busy: 'One thing at a time. The rest can wait.',
    mantra_night: 'The day is done. Rest is also work.',
    mantra_morning: 'Fresh mind. Start with the most meaningful.',
    mantra_focus: 'Deep focus active. Protect your attention.'
  },
  pt: {
    tagline: 'Menos planeamento. Mais ação.',
    now: 'Agora', today: 'Hoje', tomorrow: 'Amanhã', future: 'Futuro', did: 'Feito',
    add_placeholder: "Adicionar tarefa...", clear_mind: 'A sua mente está limpa.', undo: 'Desfazer',
    focus_mode: 'Foco Profundo', break_mode: 'Pausa', end_session: 'Terminar Sessão',
    date: 'Data', time: 'Hora', week: 'Semana', month: 'Mês',
    notif_focus: 'Temporizador de Foco', notif_work_done: 'Sessão concluída!',
    notif_break_done: 'Pausa terminada!', priority_label: 'Prioridade',
    landing_open: 'Abrir aplicação', landing_title: 'To-Do To-Did',
    landing_subtitle: 'O gestor de tarefas minimalista que não se atravessa no caminho.',
    cp_placeholder: 'Escreva um comando...', cp_sort_manual: 'Ordenar: Manual',
    cp_sort_priority: 'Ordenar: Prioridade', cp_sort_energy: 'Ordenar: Energia',
    landing_what_title: 'O QUE É ISTO?',
    landing_what_p1: 'Um gestor de tarefas feito para quem detesta gerir tarefas.',
    landing_what_list: 'Sem pastas,Sem etiquetas,Sem subtarefas,Sem ruído',
    landing_what_p2: 'Basta escrever. Nós tratamos do resto.',
    landing_how_title: 'COMO FUNCIONA',
    landing_how_1_t: 'Entrada Natural', landing_how_1_d: 'Escreva "Comprar leite amanhã 10h" e nós processamos.',
    landing_how_2_t: 'Secções Inteligentes', landing_how_2_d: 'As tarefas movem-se sozinhas com base no tempo.',
    landing_how_3_t: 'Foco Profundo', landing_how_3_d: 'Temporizador Pomodoro integrado.',
    landing_how_4_t: 'Dados Locais', landing_how_4_d: 'Tudo fica no seu dispositivo. Privacidade total.',
    landing_why_title: 'PORQUÊ TO-DO TO-DID?',
    landing_why_1: 'Zero distrações. Foco no essencial.',
    landing_why_2: 'Rápido como o pensamento.',
    landing_why_3: 'Funciona offline em qualquer lugar.',
    landing_why_4: 'Grátis. Sem registos necessários.',
    landing_privacy_title: 'PRIVACIDADE',
    landing_privacy_p1: 'Não o seguimos. Nem sequer temos um servidor.',
    landing_privacy_list: 'Sem anúncios,Sem cookies,Sem analíticas,Apenas local',
    landing_footer: 'Foco. Eficiência. Clareza.',
    mantra_empty: 'O espaço é oportunidade. Define uma intenção.',
    mantra_busy: 'Uma coisa de cada vez. O resto espera.',
    mantra_night: 'O dia terminou. O descanso também é trabalho.',
    mantra_morning: 'Mente fresca. Começa pelo mais significativo.',
    mantra_focus: 'Foco profundo ativo. Protege a tua atenção.'
  },
  es: {
    tagline: 'Menos planificación. Más acción.',
    now: 'Ahora', today: 'Hoy', tomorrow: 'Mañana', future: 'Futuro', did: 'Hecho',
    add_placeholder: "Añadir tarea...", clear_mind: 'Tu mente está despejada.', undo: 'Deshacer',
    focus_mode: 'Enfoque Profundo', break_mode: 'Descanso', end_session: 'Finalizar Sesión',
    date: 'Fecha', time: 'Hora', week: 'Semana', month: 'Mês',
    notif_focus: 'Temporizador', notif_work_done: '¡Sesión terminada!',
    notif_break_done: '¡Descanso terminado!', priority_label: 'Prioridad',
    landing_open: 'Abrir aplicación', landing_title: 'To-Do To-Did',
    landing_subtitle: 'El gestor de tareas minimalista que no te estorba.',
    cp_placeholder: 'Escribe un comando...', cp_sort_manual: 'Ordenar: Manual',
    cp_sort_priority: 'Ordenar: Prioridad', cp_sort_energy: 'Ordenar: Energía',
    landing_what_title: '¿QUÉ ES ESTO?',
    landing_what_p1: 'Un gestor de tareas para personas que odian gestionar tareas.',
    landing_what_list: 'Sin carpetas,Sin etiquetas,Sin ruido',
    landing_what_p2: 'Solo escribe. Nosotros hacemos el resto.',
    landing_how_title: 'CÓMO FUNCIONA',
    landing_how_1_t: 'Entrada Natural', landing_how_1_d: 'Escribe "Comprar leche mañana" y se procesa al instante.',
    landing_how_2_t: 'Secciones Inteligentes', landing_how_2_d: 'Las tareas se mueven automáticamente.',
    landing_how_3_t: 'Enfoque Total', landing_how_3_d: 'Pomodoro integrado para mayor productividad.',
    landing_how_4_t: 'Local Primero', landing_how_4_d: 'Tus datos nunca salen de tu dispositivo.',
    landing_why_title: '¿POR QUÉ TO-DO TO-DID?',
    landing_why_1: 'Sin distracciones. Foco en lo importante.',
    landing_why_2: 'Tan rápido como piensas.',
    landing_why_3: 'Funciona offline.',
    landing_why_4: 'Gratis. Sin cuentas.',
    landing_privacy_title: 'PRIVACIDAD',
    landing_privacy_p1: 'No rastreamos nada. Sin servidores.',
    landing_privacy_list: 'Sin anuncios,Sin cookies,Solo almacenamiento local',
    landing_footer: 'Foco. Eficiencia. Claridad.',
    mantra_empty: 'El espacio es oportunidad. Define una intención.',
    mantra_busy: 'Una cosa a la vez. Lo demás puede esperar.',
    mantra_night: 'El día terminó. Descansar también es trabajar.',
    mantra_morning: 'Mente fresca. Empieza por lo más importante.',
    mantra_focus: 'Enfoque profundo activo. Cuida tu atención.'
  },
  fr: {
    tagline: 'Moins de planification. Plus d\'action.',
    now: 'Maintenant', today: 'Aujourd\'hui', tomorrow: 'Demain', future: 'Futur', did: 'Fait',
    add_placeholder: "Ajouter...", clear_mind: 'Votre esprit est clair.', undo: 'Annuler',
    focus_mode: 'Focus Profond', break_mode: 'Pause', end_session: 'Terminer',
    date: 'Date', time: 'Heure', week: 'Semaine', month: 'Mois',
    notif_focus: 'Minuteur', notif_work_done: 'Session terminée !',
    notif_break_done: 'Pause terminée !', priority_label: 'Priorité',
    landing_open: 'Ouvrir', landing_title: 'To-Do To-Did',
    landing_subtitle: 'Le gestionnaire de tâches minimaliste.',
    cp_placeholder: 'Tapez une commande...', cp_sort_manual: 'Trier: Manuel',
    cp_sort_priority: 'Trier: Priorité', cp_sort_energy: 'Trier: Énergie',
    landing_what_title: 'C\'EST QUOI ?',
    landing_what_p1: 'Un gestionnaire de tâches pour ceux qui détestent ça.',
    landing_what_list: 'Pas de dossiers,Pas de tags,Pas de désordre',
    landing_what_p2: 'Écrivez simplement. On s\'occupe du reste.',
    landing_how_title: 'COMMENT ÇA MARCHE',
    landing_how_1_t: 'Entrée Naturelle', landing_how_1_d: 'Écrivez "Acheter du lait demain" et c\'est fait.',
    landing_how_2_t: 'Sections Intelligentes', landing_how_2_d: 'Les tâches se déplacent automatiquement.',
    landing_how_3_t: 'Focus Profond', landing_how_3_d: 'Minuteur Pomodoro intégré.',
    landing_how_4_t: 'Local d\'abord', landing_how_4_d: 'Vos données restent sur votre appareil.',
    landing_why_title: 'POURQUOI TO-DO TO-DID ?',
    landing_why_1: 'Zéro distraction.',
    landing_why_2: 'Rapide comme l\'éclair.',
    landing_why_3: 'Fonctionne hors ligne.',
    landing_why_4: 'Gratuit. Pas de compte.',
    landing_privacy_title: 'CONFIDENTIALITÉ',
    landing_privacy_p1: 'On ne vous suit pas. Pas de serveur.',
    landing_privacy_list: 'Pas de pub,Pas de cookies,Stockage local uniquement',
    landing_footer: 'Focus. Efficacité. Clarté.',
    mantra_empty: 'L\'espace est une opportunité. Fixez une intention.',
    mantra_busy: 'Une chose à la fois. Le reste peut attendre.',
    mantra_night: 'La journée est finie. Se reposer, c\'est travailler.',
    mantra_morning: 'Esprit frais. Commencez par l\'essentiel.',
    mantra_focus: 'Focus profond actif. Protégez votre attention.'
  }
};

export const t = (key: string, lang: SupportedLanguage): string => {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
};