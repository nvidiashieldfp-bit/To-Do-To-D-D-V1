/* 
 * --- INSTRUMENTAÇÃO DE DEBUG & CORE LOGIC ---
 * ES5 Compatível
 */
window.onerror = function(msg, url, line) {
  if (msg.indexOf('ResizeObserver') !== -1) return;
  console.error(msg, url, line);
};

$(function() {
    // --- HELPERS ---
    function padZero(num) { return (num < 10 ? '0' : '') + num; }
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    var DATE_I18N = {
        en: {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        pt: {
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        },
        es: {
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
        },
        fr: {
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        }
    };

    var TRANSLATIONS = {
        en: { 
          tagline: 'Less planning. More doing.', add: 'Add task...', now: 'Now', today: 'Today', tomorrow: 'Tomorrow', future: 'Future', did: 'Did',
          mantra_empty: 'Space is opportunity.', mantra_busy: 'One thing at a time.', mantra_night: 'Rest is also work.', mantra_morning: 'Fresh mind.',
          landing_title: 'To-Do To-Did', landing_subtitle: 'Minimalist task manager.', landing_open: 'Open app',
          focus_label: 'FOCUS MODE', stop: 'STOP'
        },
        pt: { 
          tagline: 'Menos planeamento. Mais ação.', add: 'Adicionar tarefa...', now: 'Agora', today: 'Hoje', tomorrow: 'Amanhã', future: 'Futuro', did: 'Feito',
          mantra_empty: 'O espaço é oportunidade.', mantra_busy: 'Uma coisa de cada vez.', mantra_night: 'O descanso também é trabalho.', mantra_morning: 'Mente fresca.',
          landing_title: 'To-Do To-Did', landing_subtitle: 'O gestor minimalista.', landing_open: 'Abrir app',
          focus_label: 'MODO FOCO', stop: 'PARAR'
        },
        es: { 
          tagline: 'Menos planificación. Más acción.', add: 'Añadir tarea...', now: 'Ahora', today: 'Hoy', tomorrow: 'Mañana', future: 'Futuro', did: 'Hecho',
          mantra_empty: 'El espacio es oportunidad.', mantra_busy: 'Una cosa a la vez.', mantra_night: 'Descansar es trabajar.', mantra_morning: 'Mente fresca.',
          landing_title: 'To-Do To-Did', landing_subtitle: 'Gestor minimalista.', landing_open: 'Abrir app',
          focus_label: 'MODO ENFOQUE', stop: 'PARAR'
        },
        fr: { 
          tagline: 'Moins de planif. Plus d\'action.', add: 'Ajouter...', now: 'Maintenant', today: 'Aujourd\'hui', tomorrow: 'Demain', future: 'Futur', did: 'Fait',
          mantra_empty: 'L\'espace est une opportunité.', mantra_busy: 'Une chose à la fois.', mantra_night: 'Le repos c\'est le travail.', mantra_morning: 'Esprit frais.',
          landing_title: 'To-Do To-Did', landing_subtitle: 'Gestionnaire minimaliste.', landing_open: 'Ouvrir',
          focus_label: 'MODE FOCUS', stop: 'ARRÊTER'
        }
    };

    var STORAGE_KEY = 'todo_to_did_v1';
    var systemLang = (navigator.language || 'en').split('-')[0];
    if (['en','pt','es','fr'].indexOf(systemLang) === -1) systemLang = 'en';

    function getNowString() {
      var d = new Date();
      return d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());
    }

    var state = {
        tasks: [],
        viewMode: 'list',
        theme: 'light',
        language: systemLang,
        collapsedSections: [],
        calendarDate: getNowString(),
        calendarType: 'month', // 'month' | 'week'
        showLanding: true,
        draftPriority: 'MEDIUM',
        focusActive: false,
        focusTime: 1500 // 25 min * 60
    };

    // --- LOGIC ---

    function save() { 
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){} 
    }

    function formatDateFriendly(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        var d = new Date(parts[0], parts[1] - 1, parts[2]);
        var langData = DATE_I18N[state.language] || DATE_I18N['en'];
        return langData.weekdaysShort[d.getDay()] + ', ' + d.getDate() + ' ' + langData.monthsShort[d.getMonth()];
    }

    function parseInput(text) {
        var title = text;
        var priority = 'MEDIUM';
        var date = getNowString();
        var time = null;

        // Time Parsing (HH:mm)
        var timeMatch = title.match(/\b(\d{1,2}:\d{2})\b/);
        if (timeMatch) {
            time = timeMatch[1];
            title = title.replace(timeMatch[0], '');
        }
        
        if (/\b(urgent|high|alta|urgente)\b/i.test(title)) { 
            priority = 'HIGH'; title = title.replace(/\b(urgent|high|alta|urgente)\b/i, ''); 
        } else if (/\b(low|baixa|baja|faible)\b/i.test(title)) { 
            priority = 'LOW'; title = title.replace(/\b(low|baixa|baja|faible)\b/i, ''); 
        }
        
        if (/\b(tomorrow|amanhã|mañana|demain)\b/i.test(title)) { 
            var d = new Date(); d.setDate(d.getDate() + 1);
            date = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());
            title = title.replace(/\b(tomorrow|amanhã|mañana|demain)\b/i, '');
        } else if (/\b(future|futuro)\b/i.test(title)) {
            date = null; title = title.replace(/\b(future|futuro)\b/i, '');
        }

        return { title: title.replace(/\s+/g, ' ').trim(), priority: priority, date: date, time: time };
    }

    // --- RENDERERS ---

    function updateFocusUI() {
        var t = TRANSLATIONS[state.language];
        $('#focus-label').text(t.focus_label);
        $('#btn-stop-focus').text(t.stop);

        if (state.focusActive) {
            $('#focus-overlay').removeClass('hidden');
            var m = Math.floor(state.focusTime / 60);
            var s = state.focusTime % 60;
            $('#focus-timer').text(padZero(m) + ':' + padZero(s));
        } else {
            $('#focus-overlay').addClass('hidden');
        }
    }

    function renderCalendar() {
        var grid = $('#calendar-grid').empty();
        var parts = state.calendarDate.split('-');
        var cursor = new Date(parts[0], parts[1] - 1, parts[2]); 
        var langData = DATE_I18N[state.language];

        var daysToRender = 42;
        var startDate = new Date(cursor);

        if (state.calendarType === 'week') {
            daysToRender = 7;
            // Adjust to start of week (Sunday)
            startDate.setDate(startDate.getDate() - startDate.getDay());
        } else {
            // Month View: Start at 1st, then back to Sunday
            startDate.setDate(1);
            startDate.setDate(startDate.getDate() - startDate.getDay());
        }

        // Headers
        var headerRef = new Date(startDate);
        for(var i=0; i<7; i++) {
            grid.append('<div class="cal-day-header">' + langData.weekdaysShort[headerRef.getDay()] + '</div>');
            headerRef.setDate(headerRef.getDate() + 1);
        }

        for (var k = 0; k < daysToRender; k++) {
            var dateStr = startDate.getFullYear() + '-' + padZero(startDate.getMonth() + 1) + '-' + padZero(startDate.getDate());
            var isCurrentMonth = startDate.getMonth() === cursor.getMonth();
            var isToday = dateStr === getNowString();
            
            var classes = 'cal-day';
            if (state.calendarType === 'month' && !isCurrentMonth) classes += ' other';
            if (isToday) classes += ' today';

            var $day = $('<div class="' + classes + '" data-date="' + dateStr + '"><span class="day-num">' + startDate.getDate() + '</span></div>');
            
            // Render Tasks
            state.tasks.forEach(function(tk) {
                if (tk.date === dateStr && !tk.completed) {
                    $day.append('<div class="cal-task-chip">' + (tk.time ? tk.time + ' ' : '') + tk.title + '</div>');
                }
            });
            
            grid.append($day);
            startDate.setDate(startDate.getDate() + 1);
        }

        // Label update
        var label = langData.months[cursor.getMonth()] + ' ' + cursor.getFullYear();
        if (state.calendarType === 'week') label = 'Week of ' + parts[2]; // Simplified week label
        $('#current-period-label').text(label);
        
        // Button States
        $('#view-week').toggleClass('active', state.calendarType === 'week');
        $('#view-month').toggleClass('active', state.calendarType === 'month');
    }

    function render() {
        var t = TRANSLATIONS[state.language];
        $('html').attr('lang', state.language).toggleClass('dark', state.theme === 'dark' || state.theme === 'night');
        $('#toggle-theme').text((state.theme === 'dark' || state.theme === 'night') ? '🌙' : '☀️');

        if (state.showLanding) {
            $('#landing-screen').show(); $('body').addClass('landing-open');
            // ... (Simple text updates for landing omitted for brevity, handled by static HTML + i18n logic below)
        } else {
            $('#landing-screen').hide(); $('body').removeClass('landing-open');
        }
        
        // UI Text
        $('#task-input').attr('placeholder', t.add);
        $('#form-priority').attr('class', 'priority-bar ' + state.draftPriority);
        $('.section').each(function() {
            var type = $(this).data('type');
            if (t[type.toLowerCase()]) $(this).find('.section-header span:first').text(t[type.toLowerCase()]);
        });
        $('#footer-date').text(formatDateFriendly(getNowString()));

        if (state.viewMode === 'list') {
            $('#list-view').show(); $('#calendar-view').hide();
            $('.tasks').empty();
            
            // Sort tasks
            state.tasks.sort(function(a,b) { return b.createdAt - a.createdAt; });

            // Counters
            var counts = { NOW:0, TODAY:0, TOMORROW:0, FUTURE:0, DID:0 };

            state.tasks.forEach(function(tk) {
                var section = 'FUTURE';
                var today = getNowString();
                var d = new Date(); d.setDate(d.getDate() + 1);
                var tmrw = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());

                if (tk.completed) section = 'DID';
                else if (!tk.date) section = 'FUTURE';
                else if (tk.date < today) section = 'NOW';
                else if (tk.date === today) section = (tk.priority === 'HIGH') ? 'NOW' : 'TODAY';
                else if (tk.date === tmrw) section = 'TOMORROW';

                counts[section]++;
                
                // Only render if section not collapsed
                if (state.collapsedSections.indexOf(section) === -1) {
                    var html = '<div class="task-row ' + (tk.completed ? 'completed' : '') + '" data-id="' + tk.id + '">';
                    html += '<div class="checkbox"></div><div class="priority-bar ' + tk.priority + '"></div>';
                    html += '<div class="title">' + tk.title + (tk.time ? ' <span class="text-xs opacity-50">@ '+tk.time+'</span>' : '') + '</div>';
                    html += '<button class="delete-btn">🗑️</button></div>';
                    $('.section[data-type="' + section + '"] .tasks').append(html);
                }
            });

            // Update Headers & Collapsed State
            $('.section').each(function() {
                var type = $(this).data('type');
                $(this).find('.count').text(counts[type]);
                if (state.collapsedSections.indexOf(type) !== -1) {
                    $(this).find('.tasks').hide();
                    $(this).addClass('collapsed opacity-50');
                } else {
                    $(this).find('.tasks').show();
                    $(this).removeClass('collapsed opacity-50');
                }
            });

        } else {
            $('#list-view').hide(); $('#calendar-view').show();
            renderCalendar();
        }
        
        updateFocusUI();
    }

    // --- EVENTS ---

    // Section Toggle
    $(document).on('click', '.section-header', function() {
        var type = $(this).parent().data('type');
        var idx = state.collapsedSections.indexOf(type);
        if (idx === -1) state.collapsedSections.push(type);
        else state.collapsedSections.splice(idx, 1);
        render(); save();
    });

    // Calendar Interactions
    $(document).on('click', '.cal-day', function() {
        var date = $(this).data('date');
        $('#task-input').val(date + ' '); // Pre-fill date logic
        state.viewMode = 'list';
        $('#task-input').focus();
        render();
    });

    $('#view-week').on('click', function() { state.calendarType = 'week'; render(); save(); });
    $('#view-month').on('click', function() { state.calendarType = 'month'; render(); save(); });

    $('#prev-nav').on('click', function() {
        var parts = state.calendarDate.split('-');
        var d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (state.calendarType === 'week') d.setDate(d.getDate() - 7);
        else d.setMonth(d.getMonth() - 1);
        state.calendarDate = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());
        render();
    });

    $('#next-nav').on('click', function() {
        var parts = state.calendarDate.split('-');
        var d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (state.calendarType === 'week') d.setDate(d.getDate() + 7);
        else d.setMonth(d.getMonth() + 1);
        state.calendarDate = d.getFullYear() + '-' + padZero(d.getMonth() + 1) + '-' + padZero(d.getDate());
        render();
    });

    // Focus Timer
    $(document).on('keydown', function(e) {
        if (e.key.toLowerCase() === 'f' && !$(e.target).is('input')) {
            e.preventDefault();
            state.focusActive = !state.focusActive;
            if (state.focusActive) state.focusTime = 1500;
            render();
        }
        if (e.key === 'Escape' && state.focusActive) {
            state.focusActive = false; render();
        }
    });

    $('#btn-stop-focus').on('click', function() {
        state.focusActive = false; render();
    });

    setInterval(function() {
        if (state.focusActive && state.focusTime > 0) {
            state.focusTime--;
            updateFocusUI();
            if (state.focusTime === 0) {
                alert("FOCUS DONE"); 
                state.focusActive = false; render();
            }
        }
        var now = new Date();
        $('#footer-time').text(padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds()));
        
        // Mantra logic
        var t = TRANSLATIONS[state.language];
        var activeCount = 0; // simplified
        var txt = t.mantra_busy;
        $('#dynamic-mantra').text(txt).css('opacity', 0.4);

    }, 1000);

    // Standard Actions
    $('#task-form').on('submit', function(e) {
        e.preventDefault();
        var val = $('#task-input').val();
        if (!val || !val.trim()) return;
        var parsed = parseInput(val);
        state.tasks.push({
            id: generateUUID(),
            title: parsed.title,
            priority: (state.draftPriority !== 'MEDIUM' ? state.draftPriority : parsed.priority),
            date: parsed.date,
            time: parsed.time,
            completed: false,
            createdAt: new Date().getTime()
        });
        state.draftPriority = 'MEDIUM';
        $('#task-input').val('');
        render(); save();
    });

    $(document).on('click', '.checkbox', function() {
        var id = $(this).parent().data('id');
        var task = state.tasks.filter(function(t){return t.id===id})[0];
        if (task) { task.completed = !task.completed; render(); save(); }
    });

    $(document).on('click', '.delete-btn', function() {
        var id = $(this).parent().data('id');
        state.tasks = state.tasks.filter(function(t){return t.id!==id});
        render(); save();
    });
    
    $(document).on('click', '.priority-bar', function(e) {
        if ($(this).attr('id') === 'form-priority') {
            // Form toggle handled separately or here
        } else {
             // Row toggle logic...
             e.stopPropagation();
             var id = $(this).parent().data('id');
             var task = state.tasks.filter(function(t){return t.id===id})[0];
             if(task) {
                 var next = { 'LOW': 'MEDIUM', 'MEDIUM': 'HIGH', 'HIGH': 'LOW' };
                 task.priority = next[task.priority];
                 render(); save();
             }
        }
    });

    $('#form-priority').on('click', function() {
        var next = { 'LOW': 'MEDIUM', 'MEDIUM': 'HIGH', 'HIGH': 'LOW' };
        state.draftPriority = next[state.draftPriority];
        render();
    });

    $('#toggle-view').on('click', function() { state.viewMode = (state.viewMode === 'list' ? 'calendar' : 'list'); render(); save(); });
    $('#toggle-theme').on('click', function() { state.theme = (state.theme === 'light' ? 'night' : 'light'); render(); save(); });
    $('#btn-open-app').on('click', function() { state.showLanding = false; render(); save(); });

    // Init
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) state = $.extend({}, state, JSON.parse(saved));
        if(!Array.isArray(state.tasks)) state.tasks = [];
        if(!Array.isArray(state.collapsedSections)) state.collapsedSections = [];
    } catch(e) {}

    render();
});
