// ===== MUSCLTRACK - PART 2: Features =====
// ===== EXERCISES MANAGEMENT =====
function renderExercises() {
    const container = document.getElementById('exercisesGrid');
    const filtered = getFilteredExercises();
    if (filtered.length === 0) { container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1"><span class="empty-icon">📋</span><p>Aucun exercice trouvé</p></div>`; return; }
    container.innerHTML = filtered.map(ex => `
        <div class="exercise-card" onclick="editExercise('${ex.id}')">
            <div class="exercise-card-actions"><button class="btn-icon" onclick="event.stopPropagation(); editExercise('${ex.id}')" title="Modifier">✏️</button><button class="btn-icon" onclick="event.stopPropagation(); deleteExercise('${ex.id}')" title="Supprimer">🗑️</button></div>
            <div class="exercise-card-header"><h3 class="exercise-card-title">${ex.name}</h3><span class="exercise-badge">${ex.type === 'compound' ? 'Composé' : 'Isolation'}</span></div>
            <p class="exercise-card-muscle">${MUSCLE_LABELS[ex.muscle] || ex.muscle}</p><p class="exercise-card-equipment">${EQUIPMENT_LABELS[ex.equipment] || ex.equipment || 'Non spécifié'}</p>${renderExerciseVideoLink(ex)}
        </div>`).join('');
}
function renderExerciseVideoLink(ex) {
    const url = ex.videoUrl || `https://www.youtube.com/results?search_query=execution+${encodeURIComponent(ex.name)}`;
    const label = ex.videoUrl ? '🎥 Voir vidéo' : '🔍 Voir démo';
    return `<a href="${url}" target="_blank" onclick="event.stopPropagation()" class="btn-video" title="${ex.videoUrl ? 'Lien vidéo' : 'Rechercher sur YouTube'}">${label}</a>`;
}
function getFilteredExercises() {
    const search = document.getElementById('exerciseSearch').value.toLowerCase();
    const muscle = document.getElementById('muscleGroupFilter').value;
    const equipment = document.getElementById('equipmentFilter').value;
    return state.exercises.filter(ex => {
        const matchSearch = ex.name.toLowerCase().includes(search);
        const matchMuscle = !muscle || ex.muscle === muscle;
        const matchEquipment = !equipment || ex.equipment === equipment;
        return matchSearch && matchMuscle && matchEquipment;
    });
}
function filterExercises() { renderExercises(); }
function openExerciseModal(exercise = null) {
    document.getElementById('exerciseModalTitle').textContent = exercise ? 'Modifier exercice' : 'Nouvel exercice';
    document.getElementById('exerciseForm').reset();
    document.getElementById('exerciseId').value = exercise?.id || '';
    if (exercise) {
        document.getElementById('exerciseName').value = exercise.name;
        document.getElementById('exerciseVideo').value = exercise.videoUrl || '';
        document.getElementById('exerciseMuscle').value = exercise.muscle;
        document.getElementById('exerciseEquipment').value = exercise.equipment || '';
        document.getElementById('exerciseType').value = exercise.type || 'compound';
        document.getElementById('defaultRestTime').value = exercise.restTime || 90;
        document.getElementById('exerciseNotes').value = exercise.notes || '';
    }
    document.getElementById('exerciseModal').classList.remove('hidden');
    updateMuscleVisualizer(document.getElementById('exerciseMuscle').value);
    // Ensure listener is attached only once (or simple re-attach)
    const muscleSelect = document.getElementById('exerciseMuscle');
    muscleSelect.onchange = (e) => updateMuscleVisualizer(e.target.value);
}

function updateMuscleVisualizer(muscle) {
    const container = document.getElementById('visualizerSvgContainer');
    if (!container) return;

    // Choose View based on muscle (Back view for back/glutes/hamstrings/calves/triceps)
    const isBack = ['back', 'glutes', 'triceps', 'calves', 'hamstrings', 'lats', 'traps'].includes(muscle);
    // Note: 'legs' maps to Quads (Front) usually, unless specified.

    // Inject SVG - We use the same SVG source but will style it differently via CSS
    container.innerHTML = isBack ? BODY_SVG_BACK : BODY_SVG_FRONT;

    // Highlight target
    if (muscle) {
        // Mapping: 'chest' -> #muscle-chest, etc.
        // Data-muscle attribute is inclusive (e.g. data-muscle="legs" covers quads, adductors, calves)
        // We need to be specific if possible, but our SVG uses classes.

        const targets = container.querySelectorAll(`[data-muscle="${muscle}"]`);
        if (targets.length > 0) {
            targets.forEach(t => t.classList.add('active-muscle'));
        } else {
            // Fallback for specific IDs if data-muscle is too broad or mismatch
            // e.g. 'calves' might not match data-muscle="legs" strictly if we rely only on data attribute
            // Let's try to match by ID substring too
            container.querySelectorAll('path').forEach(p => {
                if (p.id.includes(muscle)) p.classList.add('active-muscle');
            });
        }
    }
}

function closeExerciseModal() { document.getElementById('exerciseModal').classList.add('hidden'); }
function saveExercise(e) {
    e.preventDefault();
    const id = document.getElementById('exerciseId').value || `ex${Date.now()}`;
    const exercise = { id, name: document.getElementById('exerciseName').value.trim(), videoUrl: document.getElementById('exerciseVideo').value.trim(), muscle: document.getElementById('exerciseMuscle').value, equipment: document.getElementById('exerciseEquipment').value, type: document.getElementById('exerciseType').value, restTime: parseInt(document.getElementById('defaultRestTime').value) || 90, notes: document.getElementById('exerciseNotes').value.trim() };
    const index = state.exercises.findIndex(e => e.id === id);
    if (index >= 0) { state.exercises[index] = exercise; showToast('Exercice modifié ✓', 'success'); }
    else { state.exercises.push(exercise); showToast('Exercice ajouté ✓', 'success'); }
    saveData(STORAGE_KEYS.EXERCISES, state.exercises);
    closeExerciseModal();
    renderExercises();
    populateProgressExerciseSelect();
}
function editExercise(id) { const exercise = state.exercises.find(e => e.id === id); if (exercise) openExerciseModal(exercise); }
function deleteExercise(id) { showConfirm('Supprimer cet exercice ?', 'Cette action est irréversible.', () => { state.exercises = state.exercises.filter(e => e.id !== id); saveData(STORAGE_KEYS.EXERCISES, state.exercises); renderExercises(); showToast('Exercice supprimé', 'success'); }); }

// ===== PROGRAMS MANAGEMENT =====
let programsListListenerAttached = false;
let programGridListenerAttached = false;

function ensureProgramsListeners() {
    const programsList = document.getElementById('programsList');
    if (programsList && !programsListListenerAttached) {
        programsList.addEventListener('click', (e) => {
            const actionEl = e.target.closest('[data-action][data-program-id]');
            if (actionEl) {
                const programId = actionEl.dataset.programId;
                const action = actionEl.dataset.action;
                e.preventDefault();
                e.stopPropagation();

                if (action === 'edit-program') editProgram(programId);
                else if (action === 'delete-program') deleteProgram(programId);
                else if (action === 'start-program') startProgramWorkout(programId);
                return;
            }

            const card = e.target.closest('.program-card[data-program-id]');
            if (card) {
                const programId = card.dataset.programId;
                e.preventDefault();
                editProgram(programId);
            }
        });
        programsListListenerAttached = true;
    }

    const programGrid = document.getElementById('programGrid');
    if (programGrid && !programGridListenerAttached) {
        programGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.program-card[data-program-id]');
            if (!card) return;
            e.preventDefault();
            startProgramWorkout(card.dataset.programId);
        });
        programGridListenerAttached = true;
    }
}

function renderPrograms() {
    const container = document.getElementById('programsList');
    if (!container) return;
    if (state.programs.length === 0) { container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1"><span class="empty-icon">📅</span><p>Aucun programme créé</p><button class="btn-primary" onclick="openProgramModal()">Créer mon premier programme</button></div>`; return; }
    container.innerHTML = state.programs.map(prog => {
        const days = Array.isArray(prog.days) ? prog.days : [];
        return `
        <div class="program-card" data-program-id="${prog.id}">
            <div class="program-card-header"><h3 class="program-card-title">${prog.name}</h3><p class="program-card-desc">${prog.description || ''}</p></div>
            <div class="program-card-body"><div class="program-days-preview">${days.map(day => `<span class="day-tag">${day.name}: ${(Array.isArray(day.exercises) ? day.exercises.length : 0)} exos</span>`).join('')}</div></div>
            <div class="program-card-footer">
                <button class="btn-secondary" data-action="edit-program" data-program-id="${prog.id}">✏️ Modifier</button>
                <button class="btn-secondary" data-action="delete-program" data-program-id="${prog.id}">🗑️</button>
                <button class="btn-primary" data-action="start-program" data-program-id="${prog.id}">▶️ Démarrer</button>
            </div>
        </div>`;
    }).join('');

    ensureProgramsListeners();
    renderProgramGrid();
}
function renderProgramGrid() {
    const grid = document.getElementById('programGrid');
    if (!grid) return;
    grid.innerHTML = state.programs.map(prog => {
        const count = prog.days?.[0]?.exercises?.length || 0;
        return `<div class="program-card" data-program-id="${prog.id}"><div class="program-card-header"><h3 class="program-card-title">${prog.name}</h3></div><div class="program-card-body"><p>${count} exercices</p></div></div>`;
    }).join('');
    ensureProgramsListeners();
}
let currentProgramData = { days: [] };
function openProgramModal(program = null) {
    document.getElementById('programModalTitle').textContent = program ? 'Modifier programme' : 'Nouveau programme';
    document.getElementById('programName').value = program?.name || '';
    document.getElementById('programDescription').value = program?.description || '';
    document.getElementById('programId').value = program?.id || '';
    if (program) {
        const clone = JSON.parse(JSON.stringify(program));
        currentProgramData = { ...clone, days: Array.isArray(clone.days) ? clone.days : [] };
    } else {
        currentProgramData = { days: [] };
    }
    renderProgramDays();
    document.getElementById('programModal').classList.remove('hidden');
}
function closeProgramModal() { document.getElementById('programModal').classList.add('hidden'); }
function renderProgramDays() {
    document.getElementById('daysContainer').innerHTML = currentProgramData.days.map((day, dayIndex) => `
        <div class="day-item" data-day="${dayIndex}">
            <div class="day-header"><input type="text" value="${day.name}" onchange="updateDayName(${dayIndex}, this.value)" placeholder="Nom du jour"><button class="btn-icon" onclick="removeDay(${dayIndex})">🗑️</button></div>
            <div class="day-exercises">${day.exercises.map((ex, exIndex) => { const exercise = state.exercises.find(e => e.id === ex.exerciseId); return `<div class="day-exercise"><span>${exercise?.name || '?'}</span><span>${ex.sets}×${ex.reps}</span><button class="btn-icon" onclick="removeDayExercise(${dayIndex}, ${exIndex})">✕</button></div>`; }).join('')}<button class="btn-add-set" onclick="openExercisePicker('program', ${dayIndex})">+ Ajouter exercice</button></div>
        </div>`).join('');
}
function addProgramDay() { currentProgramData.days.push({ name: `Jour ${currentProgramData.days.length + 1}`, exercises: [] }); renderProgramDays(); }
function removeDay(index) { currentProgramData.days.splice(index, 1); renderProgramDays(); }
function updateDayName(index, name) { currentProgramData.days[index].name = name; }
function removeDayExercise(dayIndex, exIndex) { currentProgramData.days[dayIndex].exercises.splice(exIndex, 1); renderProgramDays(); }
function saveProgram() {
    const id = document.getElementById('programId').value || `prog${Date.now()}`;
    const program = { id, name: document.getElementById('programName').value.trim(), description: document.getElementById('programDescription').value.trim(), days: currentProgramData.days };
    if (!program.name) { showToast('Veuillez entrer un nom', 'error'); return; }
    const index = state.programs.findIndex(p => p.id === id);
    if (index >= 0) state.programs[index] = program; else state.programs.push(program);
    saveData(STORAGE_KEYS.PROGRAMS, state.programs);
    closeProgramModal();
    renderPrograms();
    showToast('Programme enregistré ✓', 'success');
}
function editProgram(id) { const program = state.programs.find(p => p.id === id); if (program) openProgramModal(program); }
function deleteProgram(id) { showConfirm('Supprimer ce programme ?', 'Cette action est irréversible.', () => { state.programs = state.programs.filter(p => p.id !== id); saveData(STORAGE_KEYS.PROGRAMS, state.programs); renderPrograms(); showToast('Programme supprimé', 'success'); }); }

// ===== EXERCISE PICKER =====
let pickerContext = { type: null, dayIndex: null };
function openExercisePicker(type, dayIndex = null) { pickerContext = { type, dayIndex }; document.getElementById('pickerSearch').value = ''; renderExercisePicker(); document.getElementById('exercisePickerModal').classList.remove('hidden'); }
function closeExercisePicker() { document.getElementById('exercisePickerModal').classList.add('hidden'); }
function renderExercisePicker() {
    const search = document.getElementById('pickerSearch').value.toLowerCase();
    const filtered = state.exercises.filter(ex => ex.name.toLowerCase().includes(search));
    document.getElementById('exercisePickerList').innerHTML = filtered.map(ex => `<div class="picker-item" onclick="selectExercise('${ex.id}')"><div class="picker-item-info"><h4>${ex.name}</h4><span>${MUSCLE_LABELS[ex.muscle] || ex.muscle}</span></div><span>→</span></div>`).join('');
}
function filterExercisePicker() { renderExercisePicker(); }
function selectExercise(exerciseId) {
    if (pickerContext.type === 'program') { currentProgramData.days[pickerContext.dayIndex].exercises.push({ exerciseId, sets: 3, reps: '8-10', restTime: 90 }); renderProgramDays(); }
    else if (pickerContext.type === 'workout') { addExerciseToActiveWorkout(exerciseId); }
    closeExercisePicker();
}

// ===== WORKOUT SESSION & OTHERS (Minified for brevity but fully functional) =====
function renderWorkoutPage() {
    if (state.currentWorkout) { document.getElementById('workoutSelection').classList.add('hidden'); document.getElementById('activeWorkout').classList.remove('hidden'); document.getElementById('workoutStatus').textContent = 'En cours...'; renderActiveWorkout(); }
    else { document.getElementById('workoutSelection').classList.remove('hidden'); document.getElementById('activeWorkout').classList.add('hidden'); document.getElementById('workoutStatus').textContent = 'Prêt'; document.getElementById('workoutTimer').textContent = '00:00:00'; renderProgramGrid(); }
}
function startFreeWorkout() { state.currentWorkout = { id: `w${Date.now()}`, name: 'Séance libre', date: new Date().toISOString(), startTime: Date.now(), exercises: [] }; startWorkoutTimer(); renderWorkoutPage(); }
function activateWorkoutPage() {
    if (typeof navigateTo === 'function') {
        navigateTo('workout');
        return;
    }
    document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.page === 'workout'));
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'workout-page'));
}

function startProgramWorkout(programId) {
    const program = state.programs.find(p => p.id === programId);
    if (!program) {
        showToast('Programme introuvable', 'error');
        return;
    }

    const days = Array.isArray(program.days) ? program.days : [];
    const firstDay = days[0];
    if (!firstDay) {
        showToast('Ajoutez au moins un jour à ce programme avant de le démarrer', 'error');
        openProgramModal(program);
        return;
    }

    const dayExercises = Array.isArray(firstDay.exercises) ? firstDay.exercises : [];
    state.currentWorkout = {
        id: `w${Date.now()}`,
        name: program.name || 'Programme',
        programId,
        date: new Date().toISOString(),
        startTime: Date.now(),
        exercises: dayExercises
            .filter(ex => ex && ex.exerciseId)
            .map(ex => ({
                exerciseId: ex.exerciseId,
                targetSets: ex.sets ?? 3,
                targetReps: ex.reps ?? '8-10',
                restTime: ex.restTime ?? state.settings.defaultRest,
                sets: []
            }))
    };

    startWorkoutTimer();
    activateWorkoutPage();
    renderWorkoutPage();
}
function startWorkoutTimer() { if (state.workoutTimer) clearInterval(state.workoutTimer); state.workoutTimer = setInterval(() => { const elapsed = Math.floor((Date.now() - state.currentWorkout.startTime) / 1000); const h = String(Math.floor(elapsed / 3600)).padStart(2, '0'); const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0'); const s = String(elapsed % 60).padStart(2, '0'); document.getElementById('workoutTimer').textContent = `${h}:${m}:${s}`; }, 1000); }
function addExerciseToActiveWorkout(exerciseId) { const exercise = state.exercises.find(e => e.id === exerciseId); if (!exercise) return; state.currentWorkout.exercises.push({ exerciseId, targetSets: 3, targetReps: '8-10', restTime: exercise.restTime || 90, sets: [] }); renderActiveWorkout(); }
function renderActiveWorkout() {
    document.getElementById('workoutExercises').innerHTML = state.currentWorkout.exercises.map((ex, exIndex) => {
        const exercise = state.exercises.find(e => e.id === ex.exerciseId);
        const sets = ex.sets.length > 0 ? ex.sets : [{ weight: '', reps: '', completed: false }];
        return `<div class="workout-exercise-card"><div class="workout-exercise-header"><span class="workout-exercise-title"><span>${exIndex + 1}.</span> ${exercise?.name || 'Exercice'}</span><span>${ex.sets.filter(s => s.completed).length}/${ex.targetSets || 3}</span></div><div class="workout-exercise-body" id="exercise-body-${exIndex}"><table class="sets-table"><thead><tr><th>Série</th><th>Poids</th><th>Reps</th><th>✓</th></tr></thead><tbody>${sets.map((set, setIndex) => `<tr><td>${setIndex + 1}</td><td><input type="number" value="${set.weight}" onchange="updateSet(${exIndex}, ${setIndex}, 'weight', this.value)" step="0.5" min="0"></td><td><input type="number" value="${set.reps}" onchange="updateSet(${exIndex}, ${setIndex}, 'reps', this.value)" min="0"></td><td><button class="set-check ${set.completed ? 'completed' : ''}" onclick="toggleSetComplete(${exIndex}, ${setIndex})">✓</button></td></tr>`).join('')}</tbody></table><button class="btn-add-set" onclick="addSet(${exIndex})">+ Ajouter série</button></div></div>`;
    }).join('');
}
function updateSet(exIndex, setIndex, field, value) { const exercise = state.currentWorkout.exercises[exIndex]; while (exercise.sets.length <= setIndex) exercise.sets.push({ weight: '', reps: '', completed: false }); exercise.sets[setIndex][field] = value; }
function addSet(exIndex) { const exercise = state.currentWorkout.exercises[exIndex]; const lastSet = exercise.sets[exercise.sets.length - 1]; exercise.sets.push({ weight: lastSet?.weight || '', reps: lastSet?.reps || '', completed: false }); renderActiveWorkout(); }
function toggleSetComplete(exIndex, setIndex) { const exercise = state.currentWorkout.exercises[exIndex]; while (exercise.sets.length <= setIndex) exercise.sets.push({ weight: '', reps: '', completed: false }); exercise.sets[setIndex].completed = !exercise.sets[setIndex].completed; renderActiveWorkout(); if (exercise.sets[setIndex].completed && state.settings.autoStartRest) startRestTimer(exercise.restTime || state.settings.defaultRest); }
let restTimeRemaining = 0;
function startRestTimer(seconds) { restTimeRemaining = seconds; updateRestTimerDisplay(); document.getElementById('restTimerOverlay').classList.remove('hidden'); if (state.restTimer) clearInterval(state.restTimer); state.restTimer = setInterval(() => { restTimeRemaining--; updateRestTimerDisplay(); if (restTimeRemaining <= 0) { clearInterval(state.restTimer); if (state.settings.soundEnabled) playNotificationSound(); skipRest(); } }, 1000); }
function updateRestTimerDisplay() { const m = String(Math.floor(restTimeRemaining / 60)).padStart(2, '0'); const s = String(restTimeRemaining % 60).padStart(2, '0'); document.getElementById('restTimerDisplay').textContent = `${m}:${s}`; }
function adjustRestTime(seconds) { restTimeRemaining = Math.max(0, restTimeRemaining + seconds); updateRestTimerDisplay(); }
function skipRest() { if (state.restTimer) clearInterval(state.restTimer); document.getElementById('restTimerOverlay').classList.add('hidden'); }
function playNotificationSound() { try { const audioContext = new (window.AudioContext || window.webkitAudioContext)(); const oscillator = audioContext.createOscillator(); const gainNode = audioContext.createGain(); oscillator.connect(gainNode); gainNode.connect(audioContext.destination); oscillator.frequency.value = 800; oscillator.type = 'sine'; gainNode.gain.value = 0.3; oscillator.start(); setTimeout(() => oscillator.stop(), 200); } catch (e) { } }
function cancelWorkout() { showConfirm('Annuler la séance ?', 'Les données seront perdues.', () => { if (state.workoutTimer) clearInterval(state.workoutTimer); if (state.restTimer) clearInterval(state.restTimer); state.currentWorkout = null; renderWorkoutPage(); }); }
function finishWorkout() { if (!state.currentWorkout) return; const workout = { ...state.currentWorkout, duration: Math.floor((Date.now() - state.currentWorkout.startTime) / 1000), endTime: Date.now() }; workout.exercises.forEach(ex => { ex.sets.forEach(set => { if (set.completed && set.weight && set.reps) { const current = state.records[ex.exerciseId]; const weight = parseFloat(set.weight), reps = parseInt(set.reps); if (!current || weight > current.weight || (weight === current.weight && reps > current.reps)) { state.records[ex.exerciseId] = { weight, reps, date: workout.date }; } } }); }); state.workouts.push(workout); saveData(STORAGE_KEYS.WORKOUTS, state.workouts); saveData(STORAGE_KEYS.RECORDS, state.records); if (state.workoutTimer) clearInterval(state.workoutTimer); state.currentWorkout = null; showToast('Séance enregistrée ! 💪', 'success'); updateDashboard(); renderWorkoutPage(); }
function renderHistory() { const now = new Date(); const monthSelect = document.getElementById('historyMonth'); monthSelect.innerHTML = ''; for (let i = 0; i < 12; i++) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); const option = document.createElement('option'); option.value = `${d.getFullYear()}-${d.getMonth()}`; option.textContent = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); monthSelect.appendChild(option); } monthSelect.onchange = () => renderCalendarAndList(); renderCalendarAndList(); }
function renderCalendarAndList() { const [year, month] = document.getElementById('historyMonth').value.split('-').map(Number); const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0); const today = new Date(); const workoutDates = new Set(state.workouts.filter(w => { const d = new Date(w.date); return d.getMonth() === month && d.getFullYear() === year; }).map(w => new Date(w.date).getDate())); const calendarView = document.getElementById('calendarView'); const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']; let calendarHTML = `<div class="calendar-grid">`; dayNames.forEach(d => calendarHTML += `<div class="calendar-day-header">${d}</div>`); for (let i = 0; i < firstDay.getDay(); i++) calendarHTML += `<div class="calendar-day"></div>`; for (let day = 1; day <= lastDay.getDate(); day++) { const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year; const hasWorkout = workoutDates.has(day); calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}">${day}</div>`; } calendarHTML += `</div>`; calendarView.innerHTML = calendarHTML; const monthWorkouts = state.workouts.filter(w => { const d = new Date(w.date); return d.getMonth() === month && d.getFullYear() === year; }).reverse(); const historyList = document.getElementById('historyList'); if (monthWorkouts.length === 0) { historyList.innerHTML = `<div class="empty-state"><span class="empty-icon">📅</span><p>Aucune séance ce mois-ci</p></div>`; return; } historyList.innerHTML = monthWorkouts.map(w => { const date = new Date(w.date); const volume = w.exercises.reduce((exTotal, ex) => exTotal + ex.sets.reduce((setTotal, s) => setTotal + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0), 0); return `<div class="workout-item"><div class="workout-item-icon">🏋️</div><div class="workout-item-content"><div class="workout-item-title">${w.name || 'Séance'}</div><div class="workout-item-meta">${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })} • ${w.exercises.length} exercices</div></div><div class="workout-item-stats"><span>${formatWeight(volume)}</span><small>${Math.round((w.duration || 0) / 60)} min</small></div></div>`; }).join(''); }
let muscleChart = null;
function renderMuscleChart(muscleVolume) { const ctx = document.getElementById('muscleGroupChart')?.getContext('2d'); if (ctx) { if (muscleChart) muscleChart.destroy(); muscleChart = new Chart(ctx, { type: 'doughnut', data: { labels: Object.keys(muscleVolume).map(k => MUSCLE_LABELS[k] || k), datasets: [{ data: Object.values(muscleVolume), backgroundColor: ['#6366f1', '#8b5cf6', '#a855f7', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ef4444', '#ec4899'] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a0a0a0' } } } } }); } }
function renderRecords() { const allRecords = document.getElementById('allRecordsList'); const recordEntries = Object.entries(state.records); if (recordEntries.length === 0) { allRecords.innerHTML = `<div class="empty-state"><span class="empty-icon">🏆</span><p>Aucun record</p></div>`; return; } allRecords.innerHTML = recordEntries.map(([exId, record]) => { const exercise = state.exercises.find(e => e.id === exId); return `<div class="record-card"><div class="record-card-exercise">${exercise?.name || 'Exercice'}</div><div class="record-card-value">${record.weight} ${state.settings.weightUnit} × ${record.reps}</div><div class="record-card-date">${new Date(record.date).toLocaleDateString('fr-FR')}</div></div>`; }).join(''); }
function openSettings() { document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === state.settings.theme)); document.getElementById('weightUnit').value = state.settings.weightUnit; document.getElementById('defaultRest').value = state.settings.defaultRest; document.getElementById('settingsModal').classList.remove('hidden'); }
function closeSettings() { document.getElementById('settingsModal').classList.add('hidden'); }
function setTheme(theme) { state.settings.theme = theme; applyTheme(theme); saveData(STORAGE_KEYS.SETTINGS, state.settings); document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme)); }
function applyTheme(theme) { document.documentElement.setAttribute('data-theme', theme); }
function exportData() { const data = { exercises: state.exercises, programs: state.programs, workouts: state.workouts, records: state.records, settings: state.settings, exportDate: new Date().toISOString() }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `muscltrack-backup-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); showToast('Données exportées ✓', 'success'); }
function importData(e) { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const data = JSON.parse(event.target.result); if (data.exercises) { state.exercises = data.exercises; saveData(STORAGE_KEYS.EXERCISES, state.exercises); } if (data.programs) { state.programs = data.programs; saveData(STORAGE_KEYS.PROGRAMS, state.programs); } if (data.workouts) { state.workouts = data.workouts; saveData(STORAGE_KEYS.WORKOUTS, state.workouts); } if (data.records) { state.records = data.records; saveData(STORAGE_KEYS.RECORDS, state.records); } if (data.settings) { state.settings = { ...state.settings, ...data.settings }; saveData(STORAGE_KEYS.SETTINGS, state.settings); } updateDashboard(); renderExercises(); renderPrograms(); showToast('Données importées ✓', 'success'); } catch (err) { showToast('Erreur d\'importation', 'error'); } }; reader.readAsText(file); e.target.value = ''; }
function confirmClearData() { showConfirm('Effacer toutes les données ?', 'Cette action est irréversible !', () => { localStorage.clear(); location.reload(); }); }
function formatWeight(value) { return value >= 1000 ? `${(value / 1000).toFixed(1)}t` : `${Math.round(value)} ${state.settings.weightUnit}`; }
function showToast(message, type = 'success') { const container = document.getElementById('toastContainer'); const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}</span><span>${message}</span>`; container.appendChild(toast); setTimeout(() => { toast.style.animation = 'toastIn 0.3s ease reverse'; setTimeout(() => toast.remove(), 300); }, 3000); }
function showConfirm(title, message, onConfirm) { document.getElementById('confirmTitle').textContent = title; document.getElementById('confirmMessage').textContent = message; document.getElementById('confirmModal').classList.remove('hidden'); document.getElementById('confirmOk').onclick = () => { closeConfirmModal(); onConfirm(); }; }
function closeConfirmModal() { document.getElementById('confirmModal').classList.add('hidden'); }
function viewWorkoutDetail(id) { console.log('View workout:', id); }

// ===== NUTRITION & OTHERS =====
function addWater(amount) { const today = new Date().toISOString().split('T')[0]; if (!state.nutrition.waterLogs) state.nutrition.waterLogs = {}; const current = state.nutrition.waterLogs[today] || 0; const newVal = Math.max(0, current + amount); state.nutrition.waterLogs[today] = newVal; saveNutritionData(); renderNutrition(); showToast(`${amount > 0 ? '+' : ''}${amount}ml 💧`); }
function renderNutrition() { const today = new Date().toISOString().split('T')[0]; const logs = state.nutrition.logs[today] || []; const water = (state.nutrition.waterLogs && state.nutrition.waterLogs[today]) || 0; const goals = state.nutrition.goals; const total = logs.reduce((acc, log) => ({ cal: acc.cal + (log.cal || 0), prot: acc.prot + (log.prot || 0), carb: acc.carb + (log.carb || 0), fat: acc.fat + (log.fat || 0) }), { cal: 0, prot: 0, carb: 0, fat: 0 }); updateMacroDisplay('cal', total.cal, goals.calories, ''); updateMacroDisplay('prot', total.prot, goals.protein, 'g'); updateMacroDisplay('carb', total.carb, goals.carbs, 'g'); updateMacroDisplay('fat', total.fat, goals.fat, 'g'); updateMacroDisplay('water', water, goals.water || 2500, 'ml'); document.getElementById('mealLogList').innerHTML = logs.map((log, index) => `<div class="meal-item"><div class="meal-info"><h4>${log.name}</h4><div class="meal-macros">${log.cal} kcal • P: ${log.prot}g • G: ${log.carb}g • L: ${log.fat}g</div></div><button class="btn-icon" onclick="deleteMeal(${index})">🗑️</button></div>`).join('') || '<div class="empty-state small"><p>Aucun repas aujourd\'hui</p></div>'; }
function updateMacroDisplay(type, current, max, unit) { const pct = Math.min(100, Math.round((current / max) * 100)); document.getElementById(`${type}-display`).textContent = `${current} / ${max}${unit}`; document.getElementById(`${type}-progress`).style.width = `${pct}%`; }
function openNutritionModal() { document.getElementById('mealId').value = ''; document.getElementById('nutritionForm').reset(); document.getElementById('nutritionModal').classList.remove('hidden'); }
function closeNutritionModal() { document.getElementById('nutritionModal').classList.add('hidden'); }
function saveMeal(e) { e.preventDefault(); const today = new Date().toISOString().split('T')[0]; const meal = { name: document.getElementById('mealName').value, cal: parseInt(document.getElementById('mealCal').value) || 0, prot: parseInt(document.getElementById('mealProt').value) || 0, carb: parseInt(document.getElementById('mealCarb').value) || 0, fat: parseInt(document.getElementById('mealFat').value) || 0 }; if (!state.nutrition.logs[today]) state.nutrition.logs[today] = []; state.nutrition.logs[today].push(meal); saveNutritionData(); closeNutritionModal(); renderNutrition(); showToast('Repas ajouté 🍎'); }
function deleteMeal(index) { const today = new Date().toISOString().split('T')[0]; if (state.nutrition.logs[today]) { state.nutrition.logs[today].splice(index, 1); saveNutritionData(); renderNutrition(); } }
function saveNutritionData() { saveData('muscltrack_nutrition', state.nutrition); }
// ... (Food DB and Estimation logic retained but not repeated extensively for brevity if unchanged, assuming included in full write) ...
const FOOD_DB = { 'lait': { keywords: ['lait'], cal: 120, p: 8, c: 12, f: 5 }, 'pain': { keywords: ['pain', 'baguette', 'tartine', 'toast'], cal: 100, p: 3, c: 20, f: 1 }, 'sucre': { keywords: ['sucre'], cal: 20, p: 0, c: 5, f: 0 }, 'beurre': { keywords: ['beurre'], cal: 75, p: 0, c: 0, f: 8 }, 'confiture': { keywords: ['confiture', 'miel'], cal: 50, p: 0, c: 13, f: 0 }, 'cereales': { keywords: ['cereale', 'cereales', 'muesli', 'avoine'], cal: 150, p: 4, c: 30, f: 2 }, 'oeuf': { keywords: ['oeuf', 'oeufs'], cal: 70, p: 6, c: 0, f: 5 }, 'fromage': { keywords: ['fromage'], cal: 110, p: 7, c: 0, f: 9 }, 'yaourt': { keywords: ['yaourt', 'skyr', 'fromage blanc'], cal: 60, p: 5, c: 5, f: 0 }, 'poulet': { keywords: ['poulet', 'dinde', 'blanc'], cal: 165, p: 31, c: 0, f: 3.6 }, 'boeuf': { keywords: ['boeuf', 'steak', 'viande'], cal: 250, p: 26, c: 0, f: 15 }, 'poisson': { keywords: ['poisson', 'saumon', 'thon', 'colin'], cal: 180, p: 20, c: 0, f: 10 }, 'riz': { keywords: ['riz'], cal: 130, p: 3, c: 28, f: 0.3 }, 'pates': { keywords: ['pates', 'spaghetti', 'macaroni'], cal: 130, p: 5, c: 26, f: 1 }, 'pomme_terre': { keywords: ['pomme de terre', 'patate', 'purée'], cal: 90, p: 2, c: 20, f: 0.1 }, 'legumes': { keywords: ['legume', 'legumes', 'haricot', 'brocoli', 'salade', 'tomate', 'carotte'], cal: 40, p: 2, c: 5, f: 0 }, 'banane': { keywords: ['banane'], cal: 105, p: 1, c: 27, f: 0.3 }, 'pomme': { keywords: ['pomme', 'poire', 'orange', 'fruit'], cal: 55, p: 0, c: 14, f: 0.2 }, 'chocolat': { keywords: ['chocolat'], cal: 55, p: 1, c: 6, f: 3 }, 'whey': { keywords: ['whey', 'shaker', 'proteine'], cal: 120, p: 24, c: 3, f: 1 }, 'huile': { keywords: ['huile', 'olive'], cal: 90, p: 0, c: 0, f: 10 } };
function estimateNutrition() { const text = document.getElementById('mealName').value.toLowerCase(); const normalizedText = text.replace(/,/g, ' ').replace(/\+/g, ' '); const words = normalizedText.split(' '); let total = { cal: 0, prot: 0, carb: 0, fat: 0 }; let foundAny = false; let pendingMultiplier = 1; for (let i = 0; i < words.length; i++) { const word = words[i].trim(); if (!word) continue; const num = parseFloat(word); if (!isNaN(num)) { pendingMultiplier = num; continue; } if (word === 'un' || word === 'une') { pendingMultiplier = 1; continue; } if (word === 'deux') { pendingMultiplier = 2; continue; } if (word === 'trois') { pendingMultiplier = 3; continue; } if (word === 'quatre') { pendingMultiplier = 4; continue; } if (word === 'demi') { pendingMultiplier = 0.5; continue; } if (['de', 'du', 'des', 'le', 'la', 'et', 'avec', 'morceau', 'morceaux', 'bol', 'tranche', 'verre'].includes(word)) continue; let matchedFood = null; for (const [key, food] of Object.entries(FOOD_DB)) { if (food.keywords.some(k => word.includes(k) || k.includes(word))) { matchedFood = food; break; } } if (matchedFood) { total.cal += matchedFood.cal * pendingMultiplier; total.prot += matchedFood.p * pendingMultiplier; total.carb += matchedFood.c * pendingMultiplier; total.fat += matchedFood.f * pendingMultiplier; pendingMultiplier = 1; foundAny = true; } } if (foundAny) { document.getElementById('mealCal').value = Math.round(total.cal); document.getElementById('mealProt').value = Math.round(total.prot); document.getElementById('mealCarb').value = Math.round(total.carb); document.getElementById('mealFat').value = Math.round(total.fat); showToast('Estimation calculée ! 🪄'); } else { showToast('Aucun aliment reconnu 😕', 'error'); } }
function openGoalsModal() { const p = state.nutrition.profile || {}; document.getElementById('userWeight').value = p.weight || ''; document.getElementById('userHeight').value = p.height || ''; document.getElementById('userAge').value = p.age || ''; document.getElementById('userGender').value = p.gender || 'M'; document.getElementById('userActivity').value = p.activity || '1.55'; document.getElementById('userGoal').value = p.goal || '0'; document.getElementById('userProtRatio').value = p.protRatio || '2.0'; document.getElementById('goalsModal').classList.remove('hidden'); }
function closeGoalsModal() { document.getElementById('goalsModal').classList.add('hidden'); }
function saveGoals(e) { e.preventDefault(); const weight = parseFloat(document.getElementById('userWeight').value); const height = parseFloat(document.getElementById('userHeight').value); const age = parseInt(document.getElementById('userAge').value); const gender = document.getElementById('userGender').value; const activity = parseFloat(document.getElementById('userActivity').value); const goalAdj = parseInt(document.getElementById('userGoal').value); const protRatio = parseFloat(document.getElementById('userProtRatio').value); let bmr = (10 * weight) + (6.25 * height) - (5 * age); bmr += (gender === 'M') ? 5 : -161; const tdee = Math.round(bmr * activity); const targetCal = tdee + goalAdj; const targetProt = Math.round(weight * protRatio); const targetFat = Math.round((targetCal * 0.25) / 9); const targetCarb = Math.round((targetCal - (targetProt * 4) - (targetFat * 9)) / 4); const targetWater = Math.round(weight * 35); state.nutrition.profile = { weight, height, age, gender, activity, goal: goalAdj, protRatio }; state.nutrition.goals = { calories: targetCal, protein: targetProt, carbs: targetCarb, fat: targetFat, water: targetWater }; saveNutritionData(); closeGoalsModal(); renderNutrition(); showToast(`Objectifs mis à jour : ${targetCal} kcal & ${targetWater}ml eau 🎯`); }
function openSummaryModal() { const today = new Date().toISOString().split('T')[0]; const logs = state.nutrition.logs[today] || []; const water = (state.nutrition.waterLogs && state.nutrition.waterLogs[today]) || 0; const goals = state.nutrition.goals; const total = logs.reduce((acc, log) => ({ cal: acc.cal + (log.cal || 0), prot: acc.prot + (log.prot || 0), carb: acc.carb + (log.carb || 0), fat: acc.fat + (log.fat || 0) }), { cal: 0, prot: 0, carb: 0, fat: 0 }); const getStatus = (current, target, label) => { const pct = (current / target) * 100; let icon = '✅'; let msg = 'Parfait'; let color = 'green'; if (pct < 85) { icon = '⚠️'; msg = 'Trop bas'; color = '#d97706'; } else if (pct > 115) { icon = '❌'; msg = 'Trop haut'; color = '#dc2626'; } return `<div style="display:flex; justify-content:space-between; padding:0.5rem; border-bottom:1px solid #eee;"><span>${label}: <strong>${current}/${target}</strong></span><span style="color:${color}; font-weight:bold;">${icon} ${msg}</span></div>`; }; let summaryHtml = ''; const calPct = (total.cal / goals.calories) * 100; let verdict = "Journée équilibrée ! Bien joué. 💪"; if (calPct < 80) verdict = "Tu n'as pas assez mangé aujourd'hui. Pense à un dernier repas ! 🍽️"; else if (calPct > 120) verdict = "Gros appétit ! Essaye de compenser demain. 🏃"; else if (total.prot < goals.protein * 0.9) verdict = "Attention aux protéines ! Tes muscles en ont besoin. 🥩"; summaryHtml += `<div style="background:var(--bg-primary); padding:1rem; border-radius:8px; margin-bottom:1rem;"><h3 style="margin-top:0;">🤖 Verdict du Coach</h3><p>${verdict}</p></div>`; summaryHtml += getStatus(total.fat, goals.fat, 'Lipides'); document.getElementById('summaryContent').innerHTML = summaryHtml; document.getElementById('summaryModal').classList.remove('hidden'); }
function closeSummaryModal() { document.getElementById('summaryModal').classList.add('hidden'); }

// ===== BODY HEATMAP (Realistic Anatomical - 3D Render Style) =====
const defs = `<defs>
    <linearGradient id="muscle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#994d4d;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#cc6666;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#883333;stop-opacity:1" />
    </linearGradient>
    <filter id="muscle-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="muscle-bevel" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
        <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
        <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.75" specularExponent="20" lighting-color="#ffdddd" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>
        <feMerge>
            <feMergeNode in="litPaint"/>
        </feMerge>
    </filter>
</defs>`;

const BODY_SVG_FRONT_HEATMAP = `<svg viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <!-- GHOST OUTLINE -->
    <path d="M100,15 C85,15 78,30 80,45 C75,50 55,60 50,85 C45,110 38,130 40,160 C42,180 50,190 65,240 C62,280 65,320 75,340 C80,350 78,410 82,420 L118,420 C122,410 120,350 125,340 C135,320 138,280 135,240 C150,190 158,180 160,160 C162,130 155,110 150,85 C145,60 125,50 120,45 C122,30 115,15 100,15 Z" fill="#1f2937" stroke="#374151" stroke-width="1" opacity="0.4" />

    <!-- TRAPS -->
    <path id="muscle-traps-L" d="M88,50 Q75,60 62,65 L85,68 Q90,60 88,50 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-traps-R" d="M112,50 Q125,60 138,65 L115,68 Q110,60 112,50 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- SHOULDERS -->
    <path id="muscle-shoulders-L" d="M62,65 Q45,70 42,90 Q40,105 55,100 Q65,95 62,65 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-shoulders-R" d="M138,65 Q155,70 158,90 Q160,105 145,100 Q135,95 138,65 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- CHEST -->
    <path id="muscle-chest" d="M62,65 L138,65 Q145,95 130,105 Q100,115 70,105 Q55,95 62,65 Z" class="muscle-group" data-muscle="chest" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- BICEPS -->
    <path id="muscle-biceps-L" d="M42,90 Q35,110 38,130 Q45,140 55,125 Q60,110 55,100 Z" class="muscle-group" data-muscle="biceps" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-biceps-R" d="M158,90 Q165,110 162,130 Q155,140 145,125 Q140,110 145,100 Z" class="muscle-group" data-muscle="biceps" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- FOREARMS -->
    <path id="muscle-forearms-L" d="M38,130 Q32,150 35,170 L48,168 Q55,150 55,125 Z" class="muscle-group" data-muscle="forearms" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-forearms-R" d="M162,130 Q168,150 165,170 L152,168 Q145,150 145,125 Z" class="muscle-group" data-muscle="forearms" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- ABS & OBLIQUES -->
    <path id="muscle-core" d="M70,105 Q100,115 130,105 Q128,150 120,160 Q100,165 80,160 Q72,150 70,105 Z" class="muscle-group" data-muscle="core" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-obliques-L" d="M70,105 Q60,100 55,100 L55,125 Q60,150 80,160 Z" class="muscle-group" data-muscle="core" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-obliques-R" d="M130,105 Q140,100 145,100 L145,125 Q140,150 120,160 Z" class="muscle-group" data-muscle="core" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- LEGS -->
    <path id="muscle-legs-L" d="M80,160 Q60,190 65,240 Q70,260 90,255 L95,210 Q90,180 80,160 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-legs-R" d="M120,160 Q140,190 135,240 Q130,260 110,255 L105,210 Q110,180 120,160 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-adductors-L" d="M95,210 L90,255 L100,210 Q98,180 95,210 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-adductors-R" d="M105,210 L110,255 L100,210 Q102,180 105,210 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <!-- CALVES -->
    <path id="muscle-calves-L" d="M65,240 Q60,280 68,320 L82,325 Q88,280 90,255 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-calves-R" d="M135,240 Q140,280 132,320 L118,325 Q112,280 110,255 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
</svg>`;

const BODY_SVG_BACK_HEATMAP = `<svg viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    ${defs}
    <!-- GHOST OUTLINE -->
    <path d="M100,15 C85,15 78,30 80,45 C75,50 55,60 50,85 C45,110 38,130 40,160 C42,180 50,190 65,240 C62,280 65,320 75,340 C80,350 78,410 82,420 L118,420 C122,410 120,350 125,340 C135,320 138,280 135,240 C150,190 158,180 160,160 C162,130 155,110 150,85 C145,60 125,50 120,45 C122,30 115,15 100,15 Z" fill="#1f2937" stroke="#374151" stroke-width="1" opacity="0.4" />

    <path id="muscle-back-upper" d="M88,50 L60,70 L100,85 L140,70 L112,50 Z" class="muscle-group" data-muscle="back" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-shoulders-back-L" d="M60,70 Q45,75 42,90 Q40,105 55,100 L65,90 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-shoulders-back-R" d="M140,70 Q155,75 158,90 Q160,105 145,100 L135,90 Z" class="muscle-group" data-muscle="shoulders" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-back-lats" d="M65,90 Q55,120 75,160 L125,160 Q145,120 135,90 L100,110 Z" class="muscle-group" data-muscle="back" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-back-lower" d="M75,160 L125,160 Q120,180 100,185 Q80,180 75,160 Z" class="muscle-group" data-muscle="back" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <path id="muscle-triceps-L" d="M42,90 Q35,110 38,130 L55,125 L65,90 Z" class="muscle-group" data-muscle="triceps" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-triceps-R" d="M158,90 Q165,110 162,130 L145,125 L135,90 Z" class="muscle-group" data-muscle="triceps" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <path id="muscle-glutes" d="M75,180 Q65,220 100,230 Q135,220 125,180 Q100,185 75,180 Z" class="muscle-group" data-muscle="glutes" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <path id="muscle-hamstrings-L" d="M70,225 Q62,260 65,290 L92,295 L95,230 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-hamstrings-R" d="M130,225 Q138,260 135,290 L108,295 L105,230 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />

    <path id="muscle-calves-back-L" d="M65,290 Q60,320 68,360 L82,365 Q90,320 92,295 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
    <path id="muscle-calves-back-R" d="M135,290 Q140,320 132,360 L118,365 Q110,320 108,295 Z" class="muscle-group" data-muscle="legs" fill="url(#muscle-gradient)" filter="url(#muscle-bevel)" />
</svg>`;

function renderBodyHeatmap(stats) {
    // 1. Inject SVG directly
    document.getElementById('bodyMapFront').innerHTML = BODY_SVG_FRONT_HEATMAP;
    document.getElementById('bodyMapBack').innerHTML = BODY_SVG_BACK_HEATMAP;

    // 2. Adjust Opacity/Brightness based on volume
    const maxVol = Math.max(1, ...Object.values(stats));

    document.querySelectorAll('.muscle-group').forEach(el => {
        const muscle = el.dataset.muscle;
        const vol = stats[muscle] || 0;

        // Base style is already defined in SVG as "muscle-gradient" (dark red/flesh)
        // We will overlay a highlight or change the brightness

        if (vol > 0) {
            const intensity = Math.min(vol / maxVol, 1);
            // Highlight active muscles: brighter, more orange/gold glow
            // We can modify the filter or fluidly change 'fill-opacity'
            // Let's change the Stroke to indicate activation, or overlay a color
            // Ideal: Change the gradient to a "Hot" gradient

            // Dynamic approach:
            el.style.filter = `url(#muscle-bevel) brightness(${1 + intensity}) drop-shadow(0 0 ${intensity * 10}px rgba(255, 100, 0, ${intensity}))`;
            el.style.stroke = `rgba(255, 200, 100, ${intensity})`;
            el.style.strokeWidth = intensity * 2;
        } else {
            // Resting state: Darker
            el.style.filter = 'url(#muscle-bevel) brightness(0.8)';
            el.style.stroke = 'none';
        }

        // Tooltip
        let title = el.querySelector('title');
        if (!title) {
            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            el.appendChild(title);
        }
        title.textContent = `${MUSCLE_LABELS[muscle] || muscle}: ${vol} kg`;
    });
}
function renderStats() {
    const totalWorkouts = state.workouts.length;
    const totalTime = state.workouts.reduce((acc, w) => acc + ((w.endTime - w.startTime) || 0), 0);
    const totalVolume = state.workouts.reduce((acc, w) => acc + w.exercises.reduce((eAcc, e) => eAcc + (e.sets * e.reps * e.weight), 0), 0);
    document.getElementById('totalWorkouts').textContent = totalWorkouts;
    document.getElementById('totalTime').textContent = Math.round(totalTime / 1000 / 60) + ' min';
    document.getElementById('totalLifted').textContent = Math.round(totalVolume) + ' kg';
    const muscleStats = {};
    Object.keys(MUSCLE_LABELS).forEach(m => muscleStats[m] = 0);
    state.workouts.forEach(w => { w.exercises.forEach(e => { const exercise = state.exercises.find(ex => ex.id === e.exerciseId); if (exercise && exercise.muscle) { muscleStats[exercise.muscle] += (e.sets * e.reps * e.weight); } }); });
    renderMuscleChart(muscleStats);
    renderBodyHeatmap(muscleStats);
    renderRecords();
}
function setupNutritionListeners() {
    document.getElementById('addMealBtn')?.addEventListener('click', openNutritionModal); document.getElementById('closeNutritionModal')?.addEventListener('click', closeNutritionModal); document.getElementById('cancelNutrition')?.addEventListener('click', closeNutritionModal); document.getElementById('nutritionForm')?.addEventListener('submit', saveMeal); document.getElementById('estimateMealBtn')?.addEventListener('click', estimateNutrition);
    document.getElementById('goalsBtn')?.addEventListener('click', openGoalsModal); document.getElementById('closeGoalsModal')?.addEventListener('click', closeGoalsModal); document.getElementById('goalsForm')?.addEventListener('submit', saveGoals);
    document.getElementById('summaryBtn')?.addEventListener('click', openSummaryModal); document.getElementById('closeSummaryModal')?.addEventListener('click', closeSummaryModal); document.getElementById('closeSummaryModalBtn')?.addEventListener('click', closeSummaryModal);
}
if (typeof document !== 'undefined') { setTimeout(setupNutritionListeners, 1000); }

// Exposer explicitement les fonctions utilisées par les attributs `onclick`
// (certains navigateurs ne les résolvent pas si elles ne sont pas sur `window`).
if (typeof window !== 'undefined') {
    window.renderExercises = renderExercises;
    window.renderPrograms = renderPrograms;
    window.openProgramModal = openProgramModal;
    window.editProgram = editProgram;
    window.deleteProgram = deleteProgram;
    window.startProgramWorkout = startProgramWorkout;
}
