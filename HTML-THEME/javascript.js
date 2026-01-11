
$(function() {
    /* 
     * DICIONÁRIO DE TRADUÇÃO (I18n)
     * Replicado do constants.tsx para paridade completa.
     */
    const TRANSLATIONS = {
        en: { 
          tagline: 'Less planning. More doing.', add: 'Add task...', clear_mind: 'Your mind is clear.', undo: 'Undo', date: 'Date', time: 'Time', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'The minimalist task manager that stays out of your way.', landing_open: 'Open app',
          now: 'Now', today: 'Today', tomorrow: 'Tomorrow', future: 'Future', did: 'Did',
          mantra_empty: 'Space is opportunity. Set an intention.',
          mantra_busy: 'One thing at a time. The rest can wait.',
          mantra_night: 'The day is done. Rest is also work.',
          mantra_morning: 'Fresh mind. Start with the most meaningful.',
          
          // Landing Page Extended
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
          landing_footer: 'Focus. Efficiency. Clarity.'
        },
        pt: { 
          tagline: 'Menos planeamento. Mais ação.', add: 'Adicionar tarefa...', clear_mind: 'A sua mente está limpa.', undo: 'Desfazer', date: 'Data', time: 'Hora', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'O gestor de tarefas minimalista que não se atravessa no caminho.', landing_open: 'Abrir aplicação',
          now: 'Agora', today: 'Hoje', tomorrow: 'Amanhã', future: 'Futuro', did: 'Feito',
          mantra_empty: 'O espaço é oportunidade. Define uma intenção.',
          mantra_busy: 'Uma coisa de cada vez. O resto espera.',
          mantra_night: 'O dia terminou. O descanso também é trabalho.',
          mantra_morning: 'Mente fresca. Começa pelo mais significativo.',

          // Landing Page Extended
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
          landing_footer: 'Foco. Eficiência. Clareza.'
        },
        es: { 
          tagline: 'Menos planificación. Más acción.', add: 'Añadir tarea...', clear_mind: 'Tu mente está despejada.', undo: 'Deshacer', date: 'Fecha', time: 'Hora', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'El gestor de tareas minimalista que no te estorba.', landing_open: 'Abrir aplicación',
          now: 'Ahora', today: 'Hoy', tomorrow: 'Mañana', future: 'Futuro', did: 'Hecho',
          mantra_empty: 'El espacio es oportunidad. Define una intención.',
          mantra_busy: 'Una cosa a la vez. Lo demás puede esperar.',
          mantra_night: 'El día terminó. Descansar también es trabajar.',
          mantra_morning: 'Mente fresca. Empieza por lo más importante.',

          // Landing Page Extended
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
          landing_footer: 'Foco. Eficiencia. Claridad.'
        },
        fr: { 
          tagline: 'Moins de planification. Plus d\'action.', add: 'Ajouter...', clear_mind: 'Votre esprit est clair.', undo: 'Annuler', date: 'Date', time: 'Heure', 
          landing_title: 'To-Do To-Did', landing_subtitle: 'Le gestionnaire de tâches minimaliste.', landing_open: 'Ouvrir l\'application',
          now: 'Maintenant', today: 'Aujourd\'hui', tomorrow: 'Demain', future: 'Futur', did: 'Fait',
          mantra_empty: 'L\'espace est une opportunité. Fixez une intention.',
          mantra_busy: 'Une chose à la fois. Le reste peut attendre.',
          mantra_night: 'La journée est finie. Se reposer, c\'est travailler.',
          mantra_morning: 'Esprit frais. Commencez par l\'essentiel.',

          // Landing Page Extended
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
          landing_footer: 'Focus. Efficacité. Clarté.'
        }
    };

    const STORAGE_KEY = 'todo_to_did_v1';
    
    let state = {
        tasks: [],
        viewMode: 'list',
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'light',
        language: (navigator.language || 'en').split('-')[0],
        visualPreset: 'editor',
        calendarDate: new Date().toISOString().split('T')[0],
        calendarType: 'month',
        showLanding: true,
        draftPriority: 'MEDIUM'
    };
    if (!['en','pt','es','fr'].includes(state.language)) state.language = 'en';

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    
    function getNowString() {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function getTomorrowString() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function parseInput(text) {
        let title = text;
        let priority = 'MEDIUM';
        let date = getNowString();
        
        if (/\b(urgent|high|alta|urgente)\b/i.test(title)) { 
            priority = 'HIGH'; 
            title = title.replace(/\b(urgent|high|alta|urgente)\b/i, ''); 
        } else if (/\b(low|baixa|baja|faible)\b/i.test(title)) { 
            priority = 'LOW'; 
            title = title.replace(/\b(low|baixa|baja|faible)\b/i, ''); 
        }
        
        if (/\b(tomorrow|amanhã|mañana|demain)\b/i.test(title)) { 
            date = getTomorrowString(); 
            title = title.replace(/\b(tomorrow|amanhã|mañana|demain)\b/i, '');
        } else if (/\b(future|futuro)\b/i.test(title)) {
            date = null;
            title = title.replace(/\b(future|futuro)\b/i, '');
        }

        return { title: title.replace(/\s+/g, ' ').trim(), priority, date };
    }

    function updateThemeUI() {
        const isDark = state.theme === 'dark' || state.theme === 'night';
        $('body').toggleClass('dark', isDark);
        $('#toggle-theme').text(isDark ? '🌙' : '☀️');
    }

    function updateMantra() {
        const t = TRANSLATIONS[state.language];
        const hour = new Date().getHours();
        const todayStr = getNowString();
        const activeCount = state.tasks.filter(tk => !tk.completed && (tk.date === todayStr || (tk.date && tk.date < todayStr))).length;

        let mantraKey = 'mantra_busy';
        if (activeCount === 0) mantraKey = 'mantra_empty';
        else if (hour >= 18 || hour < 5) mantraKey = 'mantra_night';
        else if (hour >= 5 && hour < 11) mantraKey = 'mantra_morning';
        else if (activeCount > 4) mantraKey = 'mantra_busy';

        const text = t[mantraKey];
        const $el = $('#dynamic-mantra');
        
        if ($el.text() !== text) {
            $el.css('opacity', 0);
            setTimeout(() => { $el.text(text).css('opacity', 0.4); }, 500);
        }
    }

    function renderCalendar() {
        const grid = $('#calendar-grid').empty();
        const d = new Date(state.calendarDate + 'T00:00:00');
        const days = new Intl.DateTimeFormat(state.language, { weekday: 'short' });
        
        const refDate = new Date(2024, 8, 29);
        for(let i=0; i<7; i++) {
            const wd = new Date(refDate); wd.setDate(refDate.getDate() + i);
            grid.append(`<div class="cal-day-header">${days.format(wd).replace('.','')}</div>`);
        }
            
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        start.setDate(start.getDate() - start.getDay());

        for (let i = 0; i < 42; i++) {
            const dateStr = start.toISOString().split('T')[0];
            const isCurrentMonth = start.getMonth() === d.getMonth();
            const isToday = dateStr === getNowString();
            
            const $day = $(`
                <div class="cal-day ${isCurrentMonth ? '' : 'other'} ${isToday ? 'today' : ''}" data-date="${dateStr}">
                <span class="day-num">${start.getDate()}</span>
                </div>
            `);
            
            state.tasks.filter(tk => tk.date === dateStr && !tk.completed).forEach(tk => 
                $day.append(`<div class="cal-task-chip">${tk.title}</div>`)
            );
            
            grid.append($day);
            start.setDate(start.getDate() + 1);
        }
        $('#current-period-label').text(new Intl.DateTimeFormat(state.language, { month: 'long', year: 'numeric' }).format(d));
    }

    function render() {
        const t = TRANSLATIONS[state.language];
        updateThemeUI();
        
        // --- LANDING PAGE LOGIC ---
        if (state.showLanding) {
            $('#landing-screen').removeClass('hidden').show();
            $('body').addClass('landing-open'); // Bloqueia scroll do body
            
            // Text Replacements for Landing Page
            $('.landing-title').text(t.landing_title);
            $('.landing-tagline').text(t.tagline);
            $('.landing-subtitle').text(t.landing_subtitle);
            $('#btn-open-app').text(t.landing_open);
            
            $('[data-i18n]').each(function() {
                const key = $(this).data('i18n');
                if (t[key]) $(this).text(t[key]);
            });

            // List Replacements
            $('[data-i18n-list]').each(function() {
                const key = $(this).data('i18n-list');
                if (t[key]) {
                    const items = t[key].split(',');
                    $(this).empty();
                    items.forEach(item => {
                        // Privacy tags have specific styling with dots
                        if (key.includes('privacy')) {
                             $(this).append(`<span>${item}</span>`);
                        } else {
                             $(this).append(`<li>${item}</li>`);
                        }
                    });
                }
            });

        } else {
            $('#landing-screen').addClass('hidden').hide();
            $('body').removeClass('landing-open');
        }

        // --- APP UI ---
        $('#brand-logo').text('To-Do To-Did');
        $('#tagline').text(t.tagline);
        $('#task-input').attr('placeholder', t.add);
        $('#form-priority').attr('class', `priority-bar ${state.draftPriority}`);

        $('.section[data-type="NOW"] .section-header span:first').text(t.now);
        $('.section[data-type="TODAY"] .section-header span:first').text(t.today);
        $('.section[data-type="TOMORROW"] .section-header span:first').text(t.tomorrow);
        $('.section[data-type="FUTURE"] .section-header span:first').text(t.future);
        $('.section[data-type="DID"] .section-header span:first').text(t.did);

        $('.tasks').empty();
        $('.section-header .count').text('0');

        const now = new Date();
        $('#footer-date').text(new Intl.DateTimeFormat(state.language, { weekday: 'short', month: 'short', day: 'numeric' }).format(now));
        
        if (state.viewMode === 'list') {
            $('#list-view').addClass('active').show();
            $('#calendar-view').removeClass('active').hide();
            
            const today = getNowString();
            const tomorrow = getTomorrowString();

            state.tasks.sort((a,b) => b.createdAt - a.createdAt);

            state.tasks.forEach(tk => {
                let section = 'FUTURE';
                if (tk.completed) section = 'DID';
                else if (!tk.date) section = 'FUTURE';
                else if (tk.date < today) section = 'NOW';
                else if (tk.date === today) section = (tk.priority === 'HIGH') ? 'NOW' : 'TODAY';
                else if (tk.date === tomorrow) section = 'TOMORROW';
                
                const $row = $(`
                    <div class="task-row ${tk.completed ? 'completed' : ''}" data-id="${tk.id}">
                        <div class="checkbox"></div>
                        <div class="priority-bar ${tk.priority}"></div>
                        <div class="title">${tk.title}</div>
                        <button class="delete-btn">🗑️</button>
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

        updateMantra();
    }

    // --- ACTIONS ---
    $('#task-form').on('submit', (e) => {
        e.preventDefault();
        const val = $('#task-input').val().trim();
        if (!val) return;
        const parsed = parseInput(val);
        const finalPrio = (state.draftPriority !== 'MEDIUM') ? state.draftPriority : parsed.priority;
        state.tasks.push({
            id: crypto.randomUUID(), title: parsed.title, priority: finalPrio,
            date: parsed.date, completed: false, createdAt: Date.now()
        });
        state.draftPriority = 'MEDIUM';
        $('#task-input').val('');
        render(); save();
    });

    $(document).on('click', '.checkbox', function() {
        const id = $(this).parent().data('id');
        const task = state.tasks.find(t => t.id === id);
        if (task) { task.completed = !task.completed; render(); save(); }
    });

    $(document).on('click', '.task-row .priority-bar', function(e) {
        e.stopPropagation();
        const id = $(this).parent().data('id');
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            const next = { 'LOW': 'MEDIUM', 'MEDIUM': 'HIGH', 'HIGH': 'LOW' };
            task.priority = next[task.priority];
            render(); save();
        }
    });

    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation();
        const id = $(this).parent().data('id');
        state.tasks = state.tasks.filter(t => t.id !== id);
        render(); save();
    });

    $('#form-priority').on('click', () => {
        const next = { 'LOW': 'MEDIUM', 'MEDIUM': 'HIGH', 'HIGH': 'LOW' };
        state.draftPriority = next[state.draftPriority];
        render();
    });

    $('#btn-open-app').on('click', () => { state.showLanding = false; render(); save(); });
    $('#toggle-view').on('click', () => { state.viewMode = state.viewMode === 'list' ? 'calendar' : 'list'; render(); save(); });
    $('#toggle-theme').on('click', () => { state.theme = (state.theme === 'light') ? 'night' : 'light'; render(); save(); });
    
    $('#prev-nav').on('click', () => {
        const d = new Date(state.calendarDate + 'T00:00:00'); d.setMonth(d.getMonth() - 1);
        state.calendarDate = d.toISOString().split('T')[0]; render();
    });
    $('#next-nav').on('click', () => {
        const d = new Date(state.calendarDate + 'T00:00:00'); d.setMonth(d.getMonth() + 1);
        state.calendarDate = d.toISOString().split('T')[0]; render();
    });

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { state = { ...state, ...JSON.parse(saved) }; } catch(e){}
    render();
    
    setInterval(() => {
        const now = new Date();
        $('#footer-time').text(new Intl.DateTimeFormat(state.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now));
        updateMantra();
    }, 1000);
});
