$(function() {
    const TRANSLATIONS = {
        en: { 
          tagline: 'Less planning. More doing.', add: 'Add task...', clear_mind: 'Your mind is clear.', undo: 'Undo', date: 'Date', time: 'Time', days: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
          landing_title: 'To-Do To-Did', landing_subtitle: 'The minimalist task manager that stays out of your way.', landing_open: 'Open app'
        },
        pt: { 
          tagline: 'Menos planeamento. Mais ação.', add: 'Adicionar tarefa...', clear_mind: 'A sua mente está limpa.', undo: 'Desfazer', date: 'Data', time: 'Hora', days: 'Dom,Seg,Ter,Qua,Qui,Sex,Sáb',
          landing_title: 'To-Do To-Did', landing_subtitle: 'O gestor de tarefas minimalista que não se atravessa no caminho.', landing_open: 'Abrir aplicação'
        },
        es: { 
          tagline: 'Menos planificación. Más acción.', add: 'Añadir tarea...', clear_mind: 'Tu mente está despejada.', undo: 'Desfacer', date: 'Fecha', time: 'Hora', days: 'Dom,Lun,Mar,Mié,Jue,Vie,Sáb',
          landing_title: 'To-Do To-Did', landing_subtitle: 'El gestor de tareas minimalista que no te estorba.', landing_open: 'Abrir aplicación'
        },
        fr: { 
          tagline: 'Moins de planification. Plus d\'action.', add: 'Ajouter une tâche...', clear_mind: 'Votre esprit est clair.', undo: 'Annuler', date: 'Date', time: 'Heure', days: 'Dim,Lun,Mar,Mer,Jeu,Ven,Sam',
          landing_title: 'To-Do To-Did', landing_subtitle: 'Le gestionnaire de tâches minimaliste.', landing_open: 'Ouvrir l\'application'
        }
    };

    const STORAGE_KEY = 'todo_to_did_v1';
    
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'light';
    const getBrowserLang = () => {
        const l = navigator.language.split('-')[0];
        return ['en', 'pt', 'es', 'fr'].includes(l) ? l : 'en';
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

    function renderCalendar() {
        const grid = $('#calendar-grid').empty();
        const d = new Date(state.calendarDate + 'T00:00:00');
        const t = TRANSLATIONS[state.language];
        const days = t.days.split(',');

        if (state.calendarType === 'month') {
            grid.css('grid-template-columns', 'repeat(7, 1fr)');
            days.forEach(day => grid.append(`<div class="cal-day-header">${day}</div>`));
            
            const first = new Date(d.getFullYear(), d.getMonth(), 1);
            const start = new Date(first);
            start.setDate(first.getDate() - first.getDay());

            for (let i = 0; i < 42; i++) {
                const dateStr = start.toISOString().split('T')[0];
                const isCurrentMonth = start.getMonth() === d.getMonth();
                const isToday = dateStr === new Date().toISOString().split('T')[0];
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
        $('.tasks').empty();
        updateThemeUI();

        if (state.viewMode === 'list') {
            $('#list-view').addClass('active').show();
            $('#calendar-view').removeClass('active').hide();
            
            // Basic filtering for demo purposes in static theme
            const today = new Date().toISOString().split('T')[0];
            state.tasks.forEach(tk => {
                const $row = $(`
                    <div class="task-row ${tk.completed ? 'completed' : ''}" data-id="${tk.id}">
                        <div class="checkbox"></div>
                        <div class="priority-bar ${tk.priority}"></div>
                        <div class="title">${tk.title}</div>
                    </div>
                `);
                // Append to Today for simplicity in standalone
                $(`.section[data-type="TODAY"] .tasks`).append($row);
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

    // Handle system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        state.theme = e.matches ? 'night' : 'light';
        updateThemeUI();
        save();
    });

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          state = { ...state, ...parsed };
        }
        render();
    }
    init();
});
