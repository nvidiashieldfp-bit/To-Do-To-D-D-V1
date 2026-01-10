$(function() {
    const TRANSLATIONS = {
        en: { 
          tagline: 'Less planning. More doing.', add: 'Add task...', clear_mind: 'Your mind is clear.', undo: 'Undo', date: 'Date', time: 'Time', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'The minimalist task manager that stays out of your way.', landing_open: 'Open app',
          nlp_priority_high: 'urgent, important, high priority', nlp_priority_low: 'low priority, trivial', nlp_time_example: 'tomorrow at 3pm',
          now: 'Now', today: 'Today', tomorrow: 'Tomorrow', future: 'Future', did: 'Did'
        },
        pt: { 
          tagline: 'Menos planeamento. Mais ação.', add: 'Adicionar tarefa...', clear_mind: 'A sua mente está limpa.', undo: 'Desfazer', date: 'Data', time: 'Hora', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'O gestor de tarefas minimalista que não se atravessa no caminho.', landing_open: 'Abrir aplicação',
          nlp_priority_high: 'urgente, importante, alta prioridade', nlp_priority_low: 'prioridade baixa, trivial', nlp_time_example: 'amanhã às 9h',
          now: 'Agora', today: 'Hoje', tomorrow: 'Amanhã', future: 'Futuro', did: 'Feito'
        },
        es: { 
          tagline: 'Menos planificación. Más acción.', add: 'Añadir tarea...', clear_mind: 'Tu mente está despejada.', undo: 'Deshacer', date: 'Fecha', time: 'Hora', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'El gestor de tareas minimalista que no te estorba.', landing_open: 'Abrir aplicación',
          nlp_priority_high: 'urgente, importante, alta prioridad', nlp_priority_low: 'baja prioridad, trivial', nlp_time_example: 'mañana a las 9h',
          now: 'Ahora', today: 'Hoy', tomorrow: 'Mañana', future: 'Futuro', did: 'Hecho'
        },
        fr: { 
          tagline: 'Moins de planification. Plus d\'action.', add: 'Ajouter...', clear_mind: 'Votre esprit est clair.', undo: 'Annuler', date: 'Date', time: 'Heure', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'Le gestionnaire de tâches minimaliste.', landing_open: 'Ouvrir l\'application',
          nlp_priority_high: 'urgent, important, haute priorité', nlp_priority_low: 'basse priorité, trivial', nlp_time_example: 'demain à 15h',
          now: 'Maintenant', today: 'Aujourd\'hui', tomorrow: 'Demain', future: 'Futur', did: 'Fait'
        }
    };

    const STORAGE_KEY = 'todo_to_did_v1';
    
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'light';
    const getBrowserLang = () => {
        const l = navigator.language.split('-')[0];
        return ['en', 'pt', 'es', 'fr'].includes(l) ? l : 'en';
    };

    const getNowString = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const getTomorrowString = () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    let state = {
        tasks: [],
        viewMode: 'list',
        theme: getSystemTheme(),
        language: getBrowserLang(),
        visualPreset: 'editor',
        calendarDate: new Date().toISOString().split('T')[0],
        calendarType: 'month',
        showLanding: true
    };

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

    function updateThemeUI() {
        const isDark = state.theme === 'dark' || state.theme === 'night';
        $('body').toggleClass('dark', isDark);
        $('#toggle-theme').text(isDark ? '🌙' : '☀️');
    }

    function getWeekdays(lang) {
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
    }

    function renderCalendar() {
        const grid = $('#calendar-grid').empty();
        const d = new Date(state.calendarDate + 'T00:00:00');
        const days = getWeekdays(state.language);

        if (state.calendarType === 'month') {
            grid.css('grid-template-columns', 'repeat(7, 1fr)');
            days.forEach(day => grid.append(`<div class="cal-day-header">${day}</div>`));
            
            const first = new Date(d.getFullYear(), d.getMonth(), 1);
            const start = new Date(first);
            start.setDate(first.getDate() - first.getDay());

            for (let i = 0; i < 42; i++) {
                const dateStr = start.toISOString().split('T')[0];
                const isCurrentMonth = start.getMonth() === d.getMonth();
                const isToday = dateStr === getNowString();
                const $day = $(`
                  <div class="cal-day ${isCurrentMonth ? '' : 'other'} ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span class="day-num">${start.getDate()}</span>
                  </div>
                `);
                const dayTasks = state.tasks.filter(tk => tk.date === dateStr && !tk.completed);
                dayTasks.forEach(tk => $day.append(`<div class="cal-task-chip">${tk.title}</div>`));
                grid.append($day);
                start.setDate(start.getDate() + 1);
            }
        }
        $('#current-period-label').text(new Intl.DateTimeFormat(state.language, { month: 'long', year: 'numeric' }).format(d));
    }

    function render() {
        const t = TRANSLATIONS[state.language];
        
        // Landing logic
        if (state.showLanding) {
            $('#landing-screen').removeClass('hidden').show();
            $('#landing-screen .landing-title').text(t.landing_title);
            $('#landing-screen .landing-tagline').text(t.tagline);
            $('#landing-screen .landing-subtitle').text(t.landing_subtitle);
            $('#landing-screen .landing-btn').text(t.landing_open);
        } else {
            $('#landing-screen').hide();
        }

        $('#tagline').text(t.tagline);
        $('#task-input').attr('placeholder', t.add);
        
        // Update Headers
        $('.section[data-type="NOW"] .section-header span:first').text(t.now);
        $('.section[data-type="TODAY"] .section-header span:first').text(t.today);
        $('.section[data-type="TOMORROW"] .section-header span:first').text(t.tomorrow);
        $('.section[data-type="FUTURE"] .section-header span:first').text(t.future);
        $('.section[data-type="DID"] .section-header span:first').text(t.did);

        $('.tasks').empty();
        $('.section-header .count').text('0');

        updateThemeUI();
        
        const now = new Date();
        $('#footer-date').text(new Intl.DateTimeFormat(state.language, { weekday: 'short', month: 'short', day: 'numeric' }).format(now));
        $('#footer-time').text(new Intl.DateTimeFormat(state.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now));

        if (state.viewMode === 'list') {
            $('#list-view').addClass('active').show();
            $('#calendar-view').removeClass('active').hide();
            
            const today = getNowString();
            const tomorrow = getTomorrowString();
            const curH = now.getHours();
            const curM = now.getMinutes();

            state.tasks.forEach(tk => {
                let section = 'FUTURE';
                if (tk.completed) {
                    section = 'DID';
                } else if (!tk.date) {
                    section = 'FUTURE';
                } else if (tk.date < today) {
                    section = 'NOW';
                } else if (tk.date === today) {
                    if (tk.priority === 'HIGH') {
                         section = 'NOW';
                    } else if (tk.time) {
                         const [h, m] = tk.time.split(':').map(Number);
                         if (h < curH || (h === curH && m <= curM)) section = 'NOW';
                         else section = 'TODAY';
                    } else {
                         section = 'TODAY';
                    }
                } else if (tk.date === tomorrow) {
                    section = 'TOMORROW';
                }

                const $row = $(`
                    <div class="task-row ${tk.completed ? 'completed' : ''}" data-id="${tk.id}">
                        <div class="checkbox"></div>
                        <div class="priority-bar ${tk.priority}"></div>
                        <div class="title">${tk.title}</div>
                    </div>
                `);
                
                const $sec = $(`.section[data-type="${section}"]`);
                $sec.find('.tasks').append($row);
                
                const countEl = $sec.find('.count');
                countEl.text(parseInt(countEl.text()) + 1);
            });
        } else {
            $('#list-view').hide();
            $('#calendar-view').show();
            renderCalendar();
        }
    }

    $('#btn-open-app').on('click', () => {
        state.showLanding = false;
        render();
        save();
    });

    $('#toggle-view').on('click', () => {
        state.viewMode = state.viewMode === 'list' ? 'calendar' : 'list';
        render();
        save();
    });

    $('#toggle-theme').on('click', () => {
        state.theme = (state.theme === 'light') ? 'night' : 'light';
        updateThemeUI();
        save();
    });

    $('#prev-nav').on('click', () => {
        const d = new Date(state.calendarDate + 'T00:00:00');
        d.setMonth(d.getMonth() - 1);
        state.calendarDate = d.toISOString().split('T')[0];
        render();
        save();
    });

    $('#next-nav').on('click', () => {
        const d = new Date(state.calendarDate + 'T00:00:00');
        d.setMonth(d.getMonth() + 1);
        state.calendarDate = d.toISOString().split('T')[0];
        render();
        save();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        state.theme = e.matches ? 'night' : 'light';
        updateThemeUI();
        save();
    });
    
    setInterval(() => {
        const now = new Date();
        $('#footer-time').text(new Intl.DateTimeFormat(state.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now));
    }, 1000);

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
          } catch(e) {}
        }
        render();
    }
    init();
});