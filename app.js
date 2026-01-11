// ===== MUSCLTRACK APP =====
// Application de suivi de musculation

// ===== DATA STORE =====
const STORAGE_KEYS = {
    EXERCISES: 'muscltrack_exercises',
    PROGRAMS: 'muscltrack_programs',
    WORKOUTS: 'muscltrack_workouts',
    SETTINGS: 'muscltrack_settings',
    RECORDS: 'muscltrack_records'
};

let state = {
    exercises: [],
    programs: [],
    workouts: [],
    settings: {
        theme: 'dark',
        weightUnit: 'kg',
        defaultRest: 90,
        autoStartRest: true,
        soundEnabled: true
    },
    records: {},
    nutrition: {
        goals: { calories: 2500, protein: 180, carbs: 300, fat: 80, water: 2500 },
        logs: {}, // Key: date string (YYYY-MM-DD), Value: array of meals
        waterLogs: {} // Key: date string, Value: total ml
    },
    currentWorkout: null,
    workoutTimer: null,
    restTimer: null
};

// ===== MUSCLE GROUP LABELS =====
const MUSCLE_LABELS = {
    chest: 'Pectoraux', back: 'Dos', shoulders: 'Épaules',
    biceps: 'Biceps', triceps: 'Triceps', legs: 'Jambes',
    glutes: 'Fessiers', core: 'Abdos', forearms: 'Avant-bras'
};

const EQUIPMENT_LABELS = {
    barbell: 'Barre', dumbbell: 'Haltères', machine: 'Machine',
    cable: 'Câble', bodyweight: 'Poids corps', kettlebell: 'Kettlebell'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Attacher les events le plus tôt possible : si un rendu plante, au moins les boutons restent utilisables.
    setTimeout(() => {
        try {
            setupEventListeners();
        } catch (e) {
            console.error('setupEventListeners failed:', e);
        }

        try { if (typeof renderExercises === 'function') renderExercises(); } catch (e) { console.error('renderExercises failed:', e); }
        try { if (typeof renderPrograms === 'function') renderPrograms(); } catch (e) { console.error('renderPrograms failed:', e); }
        try { populateProgressExerciseSelect(); } catch (e) { console.error('populateProgressExerciseSelect failed:', e); }
        console.log('✅ App initialized successfully');
    }, 200);

    try { initializeDefaultExercises(); } catch (e) { console.error('initializeDefaultExercises failed:', e); }
    try { initializeDefaultPrograms(); } catch (e) { console.error('initializeDefaultPrograms failed:', e); }
    try { updateDashboard(); } catch (e) { console.error('updateDashboard failed:', e); }
    try { updateDate(); } catch (e) { console.error('updateDate failed:', e); }
});


function loadData() {
    try {
        state.exercises = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISES)) || [];
        state.programs = normalizePrograms(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRAMS)) || []);
        state.workouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS)) || [];
        state.settings = { ...state.settings, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}') };
        state.records = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDS)) || {};

        // Nutrition load
        const savedNutrition = JSON.parse(localStorage.getItem('muscltrack_nutrition'));
        if (savedNutrition) {
            state.nutrition = { ...state.nutrition, ...savedNutrition };
        }

        applyTheme(state.settings.theme);
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

function normalizePrograms(programs) {
    if (!Array.isArray(programs)) return [];

    return programs
        .filter(p => p && typeof p === 'object')
        .map(p => {
            const days = Array.isArray(p.days) ? p.days : [];
            return {
                ...p,
                days: days
                    .filter(d => d && typeof d === 'object')
                    .map(d => ({
                        ...d,
                        exercises: Array.isArray(d.exercises) ? d.exercises : []
                    }))
            };
        });
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // Auto-save nutrition if not explicitly called (simplified)
        if (key === 'muscltrack_nutrition') localStorage.setItem('muscltrack_nutrition', JSON.stringify(data));
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('Erreur de sauvegarde', 'error');
    }
}

function initializeDefaultExercises() {
    const defaultExercises = [
        { id: 'ex1', name: 'Back Squat', muscle: 'legs', equipment: 'barbell', type: 'compound', restTime: 120, notes: 'Équilibre sur le milieu du pied. Genoux alignés. Dos neutre.' },
        { id: 'ex2', name: 'Front Squat', muscle: 'legs', equipment: 'barbell', type: 'compound', restTime: 120, notes: 'Torso plus vertical, emphasis quads.' },
        { id: 'ex3', name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', type: 'compound', restTime: 90, notes: 'Genoux légèrement fléchis. Dos plat. Charnier à la hanche.' },
        { id: 'ex4', name: 'Conventional Deadlift', muscle: 'back', equipment: 'barbell', type: 'compound', restTime: 180, notes: 'Bar au-dessus milieu du pied. Épaules au-dessus de la bar.' },
        { id: 'ex5', name: 'Hip Thrust', muscle: 'glutes', equipment: 'barbell', type: 'compound', restTime: 90, notes: 'Omoplates en appui. Serrer fessiers au sommet.' },
        { id: 'ex6', name: 'Bench Press', muscle: 'chest', equipment: 'barbell', type: 'compound', restTime: 120, notes: 'Omoplates ramenées en arrière. Bar au milieu poitrine.' },
        { id: 'ex7', name: 'Dumbbell Bench Press', muscle: 'chest', equipment: 'dumbbell', type: 'compound', restTime: 90, notes: 'Amplitude complète. Coudes 45-75°.' },
        { id: 'ex8', name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', type: 'compound', restTime: 120, notes: 'Core engagé. Barre passe près du visage.' },
        { id: 'ex9', name: 'Dumbbell Shoulder Press', muscle: 'shoulders', equipment: 'dumbbell', type: 'compound', restTime: 90, notes: 'Position assise ou debout.' },
        { id: 'ex10', name: 'Barbell Row', muscle: 'back', equipment: 'barbell', type: 'compound', restTime: 90, notes: 'Colonne neutre. Coudes vers les côtes.' },
        { id: 'ex11', name: 'Pull-Up', muscle: 'back', equipment: 'bodyweight', type: 'compound', restTime: 120, notes: 'Poitrine vers la barre. Amplitude complète.' },
        { id: 'ex12', name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', type: 'compound', restTime: 90, notes: 'Tirer vers la poitrine, pas le menton.' },
        { id: 'ex13', name: 'Dumbbell Row', muscle: 'back', equipment: 'dumbbell', type: 'compound', restTime: 60, notes: 'Un bras à la fois. Rotation minimale du torse.' },
        { id: 'ex14', name: 'Leg Press', muscle: 'legs', equipment: 'machine', type: 'compound', restTime: 90, notes: 'Pieds largeur épaules. Genoux ne rentrent pas.' },
        { id: 'ex15', name: 'Leg Curl', muscle: 'legs', equipment: 'machine', type: 'isolation', restTime: 60, notes: 'Ischio-jambiers isolés.' },
        { id: 'ex16', name: 'Leg Extension', muscle: 'legs', equipment: 'machine', type: 'isolation', restTime: 60, notes: 'Quadriceps isolés. Contrôle la descente.' },
        { id: 'ex17', name: 'Face Pull', muscle: 'shoulders', equipment: 'cable', type: 'isolation', restTime: 60, notes: 'Arrière épaules. Rotation externe.' },
        { id: 'ex18', name: 'Lateral Raise', muscle: 'shoulders', equipment: 'dumbbell', type: 'isolation', restTime: 60, notes: 'Deltoïdes latéraux. Léger coude fléchi.' },
        { id: 'ex19', name: 'Bicep Curl', muscle: 'biceps', equipment: 'dumbbell', type: 'isolation', restTime: 60, notes: 'Coudes fixes. Contraction complète.' },
        { id: 'ex20', name: 'Tricep Pushdown', muscle: 'triceps', equipment: 'cable', type: 'isolation', restTime: 60, notes: 'Coudes collés au corps.' },
        { id: 'ex21', name: 'Cable Crunch', muscle: 'core', equipment: 'cable', type: 'isolation', restTime: 60, notes: 'Flexion de la colonne. Contraction abdos.' },
        { id: 'ex22', name: 'Hanging Knee Raise', muscle: 'core', equipment: 'bodyweight', type: 'isolation', restTime: 60, notes: 'Sans balancement. Contrôle.' },
        { id: 'ex23', name: 'Plank', muscle: 'core', equipment: 'bodyweight', type: 'isolation', restTime: 60, notes: 'Corps aligné. Abdos engagés.' },
        { id: 'ex24', name: 'Push-Up', muscle: 'chest', equipment: 'bodyweight', type: 'compound', restTime: 60, notes: 'Corps aligné. Amplitude complète.' },
        // Rehab & Prehab specific
        { id: 'ex25', name: 'Eccentric Heel Drop', muscle: 'legs', equipment: 'bodyweight', type: 'isolation', restTime: 60, notes: 'Tendon Achille. Monter à 2 pieds, descendre sur 1 pied très lentement (3-5s).' },
        { id: 'ex26', name: 'Reverse Nordic Curl', muscle: 'legs', equipment: 'bodyweight', type: 'isolation', restTime: 90, notes: 'Droit Fémoral (Blessure frappe). Genoux au sol, descendre le torse en arrière en gardant les hanches verrouillées. Aller doucement.' },
        { id: 'ex27', name: 'Bulgarian Split Squat', muscle: 'legs', equipment: 'dumbbell', type: 'compound', restTime: 90, notes: 'Stabilité hanche & genou. Descendre contrôlé.' },

        // Ajouts (bibliothèque d’exercices)
        { id: 'ex28', name: 'Incline Bench Press', muscle: 'chest', equipment: 'barbell', type: 'compound', restTime: 120, notes: 'Banc incliné ~15-30°. Omoplates serrées. Contrôle la descente.' },
        { id: 'ex29', name: 'Assis Cable Row', muscle: 'back', equipment: 'cable', type: 'compound', restTime: 90, notes: 'Tirer les coudes vers les hanches. Épaules basses. Dos neutre.' },
        { id: 'ex30', name: 'Dips', muscle: 'chest', equipment: 'bodyweight', type: 'compound', restTime: 120, notes: 'Léger buste penché pour pecs. Épaules stables. Amplitude contrôlée.' },
        { id: 'ex31', name: 'Fentes de marche', muscle: 'legs', equipment: 'dumbbell', type: 'compound', restTime: 90, notes: 'Grand pas, genou arrière proche du sol. Tronc gainé. Alterné.' },
        { id: 'ex32', name: 'Élévation des mollets debout', muscle: 'legs', equipment: 'machine', type: 'isolation', restTime: 60, notes: 'Amplitude maximale. Pause en haut. Descente contrôlée.' },
        { id: 'ex33', name: 'Arnold Press', muscle: 'shoulders', equipment: 'dumbbell', type: 'compound', restTime: 90, notes: 'Rotation contrôlée. Éviter de cambrer. Monter sans élan.' },
        { id: 'ex34', name: 'Hammer Curl', muscle: 'biceps', equipment: 'dumbbell', type: 'isolation', restTime: 60, notes: 'Poignets neutres. Coudes fixes. Contrôle la descente.' },
        { id: 'ex35', name: 'Extension des triceps au-dessus de la tête', muscle: 'triceps', equipment: 'dumbbell', type: 'isolation', restTime: 60, notes: 'Coudes serrés. Étirement contrôlé. Monter sans balancer.' },
        { id: 'ex36', name: 'Russian Twist', muscle: 'core', equipment: 'bodyweight', type: 'isolation', restTime: 60, notes: 'Rotation du buste (pas juste les bras). Gainage. Lent et propre.' },
        { id: 'ex37', name: 'Glute Bridge', muscle: 'glutes', equipment: 'bodyweight', type: 'compound', restTime: 60, notes: 'Rétroversion du bassin. Pousser dans les talons. Contracter en haut.' }
    ];

    let hasChanges = false;
    const normalizeName = (name) => (name || '').toString().trim().toLowerCase();
    const existingIds = new Set(state.exercises.map(e => e?.id).filter(Boolean));
    const existingNames = new Set(state.exercises.map(e => normalizeName(e?.name)));

    defaultExercises.forEach(defEx => {
        const nameKey = normalizeName(defEx.name);
        if (existingIds.has(defEx.id) || existingNames.has(nameKey)) return;
        state.exercises.push(defEx);
        existingIds.add(defEx.id);
        existingNames.add(nameKey);
        hasChanges = true;
    });

    if (hasChanges) {
        saveData(STORAGE_KEYS.EXERCISES, state.exercises);
        console.log('Nouveaux exercices ajoutés par défaut');
    }
}

function initializeDefaultPrograms() {
    if (state.programs.length > 0) return;

    state.programs = [
        {
            id: 'prog1',
            name: 'Jour A - Squat + Haut',
            description: 'Jambes (Squat) + Haut du corps',
            days: [{
                name: 'Jour A',
                exercises: [
                    { exerciseId: 'ex1', sets: 3, reps: '6-8', restTime: 120 },
                    { exerciseId: 'ex3', sets: 3, reps: '8-10', restTime: 90 },
                    { exerciseId: 'ex6', sets: 3, reps: '8-10', restTime: 90 },
                    { exerciseId: 'ex10', sets: 3, reps: '8-10', restTime: 90 },
                    { exerciseId: 'ex15', sets: 2, reps: '10-12', restTime: 60 },
                    { exerciseId: 'ex21', sets: 2, reps: '10-15', restTime: 60 }
                ]
            }]
        },
        {
            id: 'prog2',
            name: 'Jour B - Deadlift + Haut',
            description: 'Chaîne postérieure (Deadlift/Hip Thrust) + Haut',
            days: [{
                name: 'Jour B',
                exercises: [
                    { exerciseId: 'ex4', sets: 3, reps: '5-6', restTime: 180 },
                    { exerciseId: 'ex5', sets: 3, reps: '8-10', restTime: 90 },
                    { exerciseId: 'ex8', sets: 3, reps: '6-8', restTime: 120 },
                    { exerciseId: 'ex11', sets: 3, reps: '6-10', restTime: 120 },
                    { exerciseId: 'ex17', sets: 3, reps: '12-15', restTime: 60 },
                    { exerciseId: 'ex23', sets: 2, reps: '30-60s', restTime: 60 }
                ]
            }]
        },
        {
            id: 'prog3',
            name: 'Jour C - Unilatéral',
            description: 'Focus unilatéral et accessoires',
            days: [{
                name: 'Jour C',
                exercises: [
                    { exerciseId: 'ex14', sets: 3, reps: '10-12', restTime: 90 },
                    { exerciseId: 'ex7', sets: 3, reps: '10-12', restTime: 90 },
                    { exerciseId: 'ex13', sets: 3, reps: '10-12', restTime: 60 },
                    { exerciseId: 'ex18', sets: 3, reps: '12-15', restTime: 60 },
                    { exerciseId: 'ex19', sets: 2, reps: '10-12', restTime: 60 },
                    { exerciseId: 'ex20', sets: 2, reps: '10-12', restTime: 60 }
                ]
            }]
        }
    ];
    saveData(STORAGE_KEYS.PROGRAMS, state.programs);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle')?.addEventListener('click', toggleSidebar);

    // Dashboard buttons
    document.getElementById('startQuickWorkout')?.addEventListener('click', () => navigateTo('workout'));
    document.getElementById('firstWorkoutBtn')?.addEventListener('click', () => navigateTo('workout'));

    // Exercise management
    document.getElementById('addExerciseBtn')?.addEventListener('click', openExerciseModal);
    document.getElementById('closeExerciseModal')?.addEventListener('click', closeExerciseModal);
    document.getElementById('cancelExercise')?.addEventListener('click', closeExerciseModal);
    document.getElementById('exerciseForm')?.addEventListener('submit', saveExercise);
    document.getElementById('exerciseSearch')?.addEventListener('input', filterExercises);
    document.getElementById('muscleGroupFilter')?.addEventListener('change', filterExercises);
    document.getElementById('equipmentFilter')?.addEventListener('change', filterExercises);

    // Program management
    document.getElementById('createProgramBtn')?.addEventListener('click', openProgramModal);
    document.getElementById('closeProgramModal')?.addEventListener('click', closeProgramModal);
    document.getElementById('cancelProgram')?.addEventListener('click', closeProgramModal);
    document.getElementById('saveProgram')?.addEventListener('click', saveProgram);
    document.getElementById('addProgramDay')?.addEventListener('click', addProgramDay);

    // Exercise picker
    document.getElementById('closeExercisePicker')?.addEventListener('click', closeExercisePicker);
    document.getElementById('pickerSearch')?.addEventListener('input', filterExercisePicker);

    // Workout controls
    document.getElementById('startFreeWorkout')?.addEventListener('click', startFreeWorkout);
    document.getElementById('addExerciseToWorkout')?.addEventListener('click', () => openExercisePicker('workout'));
    document.getElementById('cancelWorkout')?.addEventListener('click', cancelWorkout);
    document.getElementById('finishWorkout')?.addEventListener('click', finishWorkout);
    document.getElementById('skipRest')?.addEventListener('click', skipRest);

    // Rest timer controls
    document.querySelectorAll('.btn-time').forEach(btn => {
        btn.addEventListener('click', () => adjustRestTime(parseInt(btn.dataset.time)));
    });

    // Settings
    document.getElementById('settingsBtn')?.addEventListener('click', openSettings);
    document.getElementById('mobileSettingsBtn')?.addEventListener('click', openSettings);
    document.getElementById('closeSettings')?.addEventListener('click', closeSettings);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
    document.getElementById('weightUnit')?.addEventListener('change', (e) => {
        state.settings.weightUnit = e.target.value;
        saveData(STORAGE_KEYS.SETTINGS, state.settings);
    });
    document.getElementById('defaultRest')?.addEventListener('change', (e) => {
        state.settings.defaultRest = parseInt(e.target.value);
        saveData(STORAGE_KEYS.SETTINGS, state.settings);
    });
    document.getElementById('exportData')?.addEventListener('click', exportData);
    document.getElementById('importData')?.addEventListener('click', () => document.getElementById('importFile')?.click());
    document.getElementById('importFile')?.addEventListener('change', importData);
    document.getElementById('clearData')?.addEventListener('click', confirmClearData);

    // Confirm modal
    document.getElementById('confirmCancel')?.addEventListener('click', closeConfirmModal);

    // Progress chart controls
    document.getElementById('progressExercise')?.addEventListener('change', updateProgressChart);
    document.getElementById('progressPeriod')?.addEventListener('change', updateProgressChart);

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        }
    });
}

// ===== NAVIGATION =====
function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });

    if (page === 'history') renderHistory();
    if (page === 'stats') renderStats();
    if (page === 'programs') renderPrograms();
    if (page === 'nutrition') renderNutrition();
    if (page === 'workout') renderWorkoutPage();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const el = document.getElementById('currentDate');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('fr-FR', options);
}

// ===== DASHBOARD =====
function updateDashboard() {
    if (!document.getElementById('weeklyWorkouts')) return;
    if (!document.getElementById('totalVolume')) return;
    if (!document.getElementById('currentStreak')) return;
    if (!document.getElementById('avgDuration')) return;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekWorkouts = state.workouts.filter(w => new Date(w.date) >= weekStart);
    document.getElementById('weeklyWorkouts').textContent = weekWorkouts.length;

    const weekVolume = weekWorkouts.reduce((total, w) => {
        return total + w.exercises.reduce((exTotal, ex) => {
            return exTotal + ex.sets.reduce((setTotal, s) => {
                return setTotal + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
            }, 0);
        }, 0);
    }, 0);
    document.getElementById('totalVolume').textContent = formatWeight(weekVolume);

    document.getElementById('currentStreak').textContent = calculateStreak();

    const avgDuration = weekWorkouts.length > 0
        ? Math.round(weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / weekWorkouts.length / 60)
        : 0;
    document.getElementById('avgDuration').textContent = `${avgDuration} min`;

    renderRecentWorkouts();
    renderPersonalRecords();
    populateProgressExerciseSelect();
    updateProgressChart();
}

function calculateStreak() {
    if (state.workouts.length === 0) return 0;

    const sortedDates = [...new Set(state.workouts.map(w => new Date(w.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const date of sortedDates) {
        const diff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
        if (diff <= 1) {
            streak++;
            currentDate = date;
        } else break;
    }
    return streak;
}

function renderRecentWorkouts() {
    const container = document.getElementById('recentWorkoutsList');
    if (!container) return;
    const recent = state.workouts.slice(-5).reverse();

    if (recent.length === 0) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">🏋️</span><p>Aucune séance enregistrée</p><button class="btn-secondary" onclick="navigateTo('workout')">Ma première séance</button></div>`;
        return;
    }

    container.innerHTML = recent.map(w => {
        const date = new Date(w.date);
        const volume = w.exercises.reduce((exTotal, ex) =>
            exTotal + ex.sets.reduce((setTotal, s) =>
                setTotal + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0), 0);

        return `
            <div class="workout-item" onclick="viewWorkoutDetail('${w.id}')">
                <div class="workout-item-icon">🏋️</div>
                <div class="workout-item-content">
                    <div class="workout-item-title">${w.name || 'Séance libre'}</div>
                    <div class="workout-item-meta">${date.toLocaleDateString('fr-FR')} • ${w.exercises.length} exercices</div>
                </div>
                <div class="workout-item-stats">
                    <span>${formatWeight(volume)}</span>
                    <small>${Math.round((w.duration || 0) / 60)} min</small>
                </div>
            </div>
        `;
    }).join('');
}

function renderPersonalRecords() {
    const container = document.getElementById('personalRecordsList');
    if (!container) return;
    const records = Object.entries(state.records).slice(0, 5);

    if (records.length === 0) {
        container.innerHTML = `<div class="empty-state small"><span class="empty-icon">🎯</span><p>Vos records apparaîtront ici</p></div>`;
        return;
    }

    container.innerHTML = records.map(([exId, record]) => {
        const exercise = state.exercises.find(e => e.id === exId);
        return `
            <div class="record-item">
                <span class="record-name">${exercise?.name || 'Exercice'}</span>
                <span class="record-value">${record.weight} ${state.settings.weightUnit} × ${record.reps}</span>
            </div>
        `;
    }).join('');
}

// ===== PROGRESS CHART =====
let progressChart = null;

function populateProgressExerciseSelect() {
    const select = document.getElementById('progressExercise');
    if (!select) return;
    select.innerHTML = '<option value="">Choisir un exercice</option>' +
        state.exercises.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
}

function updateProgressChart() {
    const exerciseId = document.getElementById('progressExercise').value;
    const period = document.getElementById('progressPeriod').value;

    if (!exerciseId) {
        if (progressChart) progressChart.destroy();
        return;
    }

    const now = new Date();
    let startDate = new Date();

    switch (period) {
        case 'week': startDate.setDate(now.getDate() - 7); break;
        case 'month': startDate.setMonth(now.getMonth() - 1); break;
        case '3months': startDate.setMonth(now.getMonth() - 3); break;
        case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
    }

    const data = [];
    state.workouts.forEach(w => {
        if (new Date(w.date) < startDate) return;
        w.exercises.forEach(ex => {
            if (ex.exerciseId === exerciseId) {
                const maxWeight = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0));
                if (maxWeight > 0) {
                    data.push({ date: w.date, weight: maxWeight });
                }
            }
        });
    });

    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const ctx = document.getElementById('progressChart').getContext('2d');
    if (progressChart) progressChart.destroy();

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
            datasets: [{
                label: 'Poids max (kg)',
                data: data.map(d => d.weight),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#a0a0a0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a0a0' }
                }
            }
        }
    });
}
