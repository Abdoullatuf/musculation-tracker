// ===== MUSCLTRACK ENHANCEMENTS =====
// Fichier d'améliorations avancées pour MusclTrack

// ===== 1. CALCUL AUTOMATIQUE DU 1RM (Répétition Maximale) =====
// Formule d'Epley: 1RM = weight × (1 + reps/30)
function calculate1RM(weight, reps) {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// Calcul des pourcentages du 1RM pour la programmation
function calculateRMPercentages(oneRM) {
    return {
        '95%': Math.round(oneRM * 0.95 * 10) / 10,  // 1-2 reps
        '90%': Math.round(oneRM * 0.90 * 10) / 10,  // 2-4 reps
        '85%': Math.round(oneRM * 0.85 * 10) / 10,  // 4-6 reps
        '80%': Math.round(oneRM * 0.80 * 10) / 10,  // 6-8 reps
        '75%': Math.round(oneRM * 0.75 * 10) / 10,  // 8-10 reps
        '70%': Math.round(oneRM * 0.70 * 10) / 10,  // 10-12 reps
        '65%': Math.round(oneRM * 0.65 * 10) / 10   // 12-15 reps
    };
}

// Suggestion de progression basée sur le 1RM
function suggestProgression(exerciseId) {
    const workouts = state.workouts.filter(w =>
        w.exercises.some(ex => ex.exerciseId === exerciseId)
    );

    if (workouts.length === 0) return null;

    let maxWeight = 0;
    let maxReps = 0;

    workouts.forEach(w => {
        w.exercises.forEach(ex => {
            if (ex.exerciseId === exerciseId) {
                ex.sets.forEach(s => {
                    const weight = parseFloat(s.weight) || 0;
                    const reps = parseInt(s.reps) || 0;
                    const estimated1RM = calculate1RM(weight, reps);
                    const current1RM = calculate1RM(maxWeight, maxReps);

                    if (estimated1RM > current1RM) {
                        maxWeight = weight;
                        maxReps = reps;
                    }
                });
            }
        });
    });

    const oneRM = calculate1RM(maxWeight, maxReps);
    const percentages = calculateRMPercentages(oneRM);

    return {
        oneRM,
        currentWeight: maxWeight,
        currentReps: maxReps,
        percentages,
        nextSession: {
            weight: Math.round((maxWeight * 1.025) * 10) / 10, // +2.5%
            reps: maxReps,
            message: `Essayez ${Math.round((maxWeight * 1.025) * 10) / 10} kg pour ${maxReps} reps la prochaine fois`
        }
    };
}

// ===== 2. NOTIFICATIONS SONORES =====
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playBeep(frequency = 440, duration = 200, volume = 0.3) {
        if (!this.enabled) return;

        this.init();
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    playRestComplete() {
        // Triple beep pour fin de repos
        this.playBeep(523, 150, 0.3); // C
        setTimeout(() => this.playBeep(659, 150, 0.3), 150); // E
        setTimeout(() => this.playBeep(784, 300, 0.3), 300); // G
    }

    playRestWarning() {
        // Double beep pour avertissement (10s restantes)
        this.playBeep(440, 100, 0.2);
        setTimeout(() => this.playBeep(440, 100, 0.2), 150);
    }

    playSuccess() {
        // Mélodie de succès
        this.playBeep(523, 100, 0.2); // C
        setTimeout(() => this.playBeep(659, 100, 0.2), 100); // E
        setTimeout(() => this.playBeep(784, 200, 0.2), 200); // G
    }

    toggle(enabled) {
        this.enabled = enabled;
    }
}

const soundManager = new SoundManager();

// ===== 3. EXPORT PDF =====
async function exportToPDF(type = 'workout', id = null) {
    // Utilisation de html2pdf.js (bibliothèque externe)
    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
        showToast('Bibliothèque PDF non chargée', 'error');
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('💪 MusclTrack', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(new Date().toLocaleDateString('fr-FR'), pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    if (type === 'workout' && id) {
        // Export d'une séance spécifique
        const workout = state.workouts.find(w => w.id === id);
        if (!workout) return;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(workout.name || 'Séance libre', 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: ${new Date(workout.date).toLocaleDateString('fr-FR')}`, 20, yPos);
        yPos += 5;
        doc.text(`Durée: ${Math.round((workout.duration || 0) / 60)} minutes`, 20, yPos);
        yPos += 10;

        // Exercices
        workout.exercises.forEach((ex, idx) => {
            const exercise = state.exercises.find(e => e.id === ex.exerciseId);
            if (!exercise) return;

            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`${idx + 1}. ${exercise.name}`, 20, yPos);
            yPos += 7;

            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            ex.sets.forEach((set, setIdx) => {
                doc.text(`   Série ${setIdx + 1}: ${set.weight} kg × ${set.reps} reps`, 25, yPos);
                yPos += 5;
            });

            yPos += 3;
        });

    } else if (type === 'stats') {
        // Export des statistiques globales
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Statistiques Globales', 20, yPos);
        yPos += 10;

        // Statistiques générales
        const totalWorkouts = state.workouts.length;
        const totalTime = state.workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalVolume = state.workouts.reduce((total, w) => {
            return total + w.exercises.reduce((exTotal, ex) => {
                return exTotal + ex.sets.reduce((setTotal, s) => {
                    return setTotal + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
                }, 0);
            }, 0);
        }, 0);

        doc.setFontSize(11);
        doc.text(`Nombre total de séances: ${totalWorkouts}`, 20, yPos);
        yPos += 7;
        doc.text(`Temps total d'entraînement: ${Math.round(totalTime / 3600)} heures`, 20, yPos);
        yPos += 7;
        doc.text(`Volume total soulevé: ${Math.round(totalVolume)} kg`, 20, yPos);
        yPos += 10;

        // Records personnels
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Records Personnels', 20, yPos);
        yPos += 8;

        Object.entries(state.records).forEach(([exId, record]) => {
            const exercise = state.exercises.find(e => e.id === exId);
            if (!exercise) return;

            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(10);
            doc.text(`${exercise.name}: ${record.weight} kg × ${record.reps} reps`, 25, yPos);
            yPos += 6;
        });
    }

    // Pied de page
    const fileName = type === 'workout'
        ? `muscltrack_seance_${new Date().toISOString().split('T')[0]}.pdf`
        : `muscltrack_stats_${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(fileName);
    showToast('PDF exporté avec succès ✓', 'success');
}

// ===== 4. GLISSER-DÉPOSER POUR RÉORGANISER =====
class DragDropManager {
    constructor() {
        this.draggedElement = null;
        this.draggedIndex = null;
    }

    enableDragDrop(container, itemSelector, onReorder) {
        const items = container.querySelectorAll(itemSelector);

        items.forEach((item, index) => {
            item.draggable = true;
            item.dataset.index = index;

            item.addEventListener('dragstart', (e) => {
                this.draggedElement = item;
                this.draggedIndex = index;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                this.draggedElement = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                const afterElement = this.getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(this.draggedElement);
                } else {
                    container.insertBefore(this.draggedElement, afterElement);
                }
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const dropIndex = parseInt(item.dataset.index);
                if (onReorder && this.draggedIndex !== dropIndex) {
                    onReorder(this.draggedIndex, dropIndex);
                }
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

const dragDropManager = new DragDropManager();

// ===== 5. RACCOURCIS CLAVIER =====
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'ctrl+s': () => this.quickSave(),
            'ctrl+n': () => this.newWorkout(),
            'ctrl+e': () => this.newExercise(),
            'escape': () => this.closeModals(),
            'ctrl+p': () => this.exportCurrentView(),
            'ctrl+h': () => navigateTo('history'),
            'ctrl+d': () => navigateTo('dashboard'),
            'ctrl+w': () => navigateTo('workout'),
            'space': () => this.toggleRestTimer()
        };

        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Ne pas intercepter si l'utilisateur tape dans un input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.key !== 'Escape') return;
            }

            const key = this.getKeyCombo(e);
            const handler = this.shortcuts[key];

            if (handler) {
                e.preventDefault();
                handler();
            }
        });
    }

    getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    quickSave() {
        // Backup manuel des données
        backupData();
        showToast('💾 Données sauvegardées', 'success');
    }

    newWorkout() {
        navigateTo('workout');
        if (!state.currentWorkout) {
            document.getElementById('startFreeWorkout')?.click();
        }
    }

    newExercise() {
        navigateTo('exercises');
        setTimeout(() => document.getElementById('addExerciseBtn')?.click(), 100);
    }

    closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    }

    exportCurrentView() {
        const activePage = document.querySelector('.page.active');
        if (activePage?.id === 'stats-page') {
            exportToPDF('stats');
        }
    }

    toggleRestTimer() {
        const restOverlay = document.getElementById('restTimerOverlay');
        if (!restOverlay.classList.contains('hidden')) {
            document.getElementById('skipRest')?.click();
        }
    }
}

const keyboardShortcuts = new KeyboardShortcuts();

// ===== 6. BACKUP AUTOMATIQUE =====
class AutoBackup {
    constructor(intervalMinutes = 30) {
        this.intervalMinutes = intervalMinutes;
        this.maxBackups = 5;
        this.storageKey = 'muscltrack_backups';
        this.init();
    }

    init() {
        // Backup automatique toutes les X minutes
        setInterval(() => this.createBackup(), this.intervalMinutes * 60 * 1000);

        // Backup au démarrage
        this.createBackup();
    }

    createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                data: {
                    exercises: state.exercises,
                    programs: state.programs,
                    workouts: state.workouts,
                    settings: state.settings,
                    records: state.records,
                    nutrition: state.nutrition
                }
            };

            const backups = this.getBackups();
            backups.unshift(backup);

            // Garder seulement les X derniers backups
            if (backups.length > this.maxBackups) {
                backups.splice(this.maxBackups);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(backups));
            console.log('✓ Backup automatique créé:', new Date().toLocaleString('fr-FR'));
        } catch (e) {
            console.error('Erreur lors du backup automatique:', e);
        }
    }

    getBackups() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch {
            return [];
        }
    }

    restoreBackup(index = 0) {
        const backups = this.getBackups();
        if (backups[index]) {
            const backup = backups[index].data;

            state.exercises = backup.exercises || [];
            state.programs = backup.programs || [];
            state.workouts = backup.workouts || [];
            state.settings = backup.settings || state.settings;
            state.records = backup.records || {};
            state.nutrition = backup.nutrition || state.nutrition;

            // Sauvegarder dans le localStorage principal
            saveData(STORAGE_KEYS.EXERCISES, state.exercises);
            saveData(STORAGE_KEYS.PROGRAMS, state.programs);
            saveData(STORAGE_KEYS.WORKOUTS, state.workouts);
            saveData(STORAGE_KEYS.SETTINGS, state.settings);
            saveData(STORAGE_KEYS.RECORDS, state.records);
            saveData('muscltrack_nutrition', state.nutrition);

            showToast('Données restaurées avec succès ✓', 'success');
            location.reload();
        }
    }
}

const autoBackup = new AutoBackup(30); // Backup toutes les 30 minutes

function backupData() {
    autoBackup.createBackup();
}

// ===== 7. TEMPLATES DE SÉANCES =====
const workoutTemplates = [
    {
        id: 'template_upper',
        name: 'Upper Body - Force',
        description: 'Séance complète haut du corps orientée force',
        exercises: [
            { exerciseId: 'ex6', sets: 4, reps: '5', restTime: 180 },  // Bench Press
            { exerciseId: 'ex10', sets: 4, reps: '6', restTime: 120 }, // Barbell Row
            { exerciseId: 'ex8', sets: 3, reps: '8', restTime: 90 },   // Overhead Press
            { exerciseId: 'ex11', sets: 3, reps: '6-8', restTime: 120 }, // Pull-ups
            { exerciseId: 'ex19', sets: 3, reps: '10', restTime: 60 },  // Bicep Curl
            { exerciseId: 'ex20', sets: 3, reps: '10', restTime: 60 }   // Tricep Pushdown
        ]
    },
    {
        id: 'template_lower',
        name: 'Lower Body - Volume',
        description: 'Séance complète bas du corps orientée volume',
        exercises: [
            { exerciseId: 'ex1', sets: 4, reps: '8', restTime: 120 },  // Back Squat
            { exerciseId: 'ex3', sets: 3, reps: '10', restTime: 90 },  // Romanian Deadlift
            { exerciseId: 'ex14', sets: 3, reps: '12', restTime: 90 }, // Leg Press
            { exerciseId: 'ex15', sets: 3, reps: '12', restTime: 60 }, // Leg Curl
            { exerciseId: 'ex16', sets: 3, reps: '12', restTime: 60 }  // Leg Extension
        ]
    },
    {
        id: 'template_push',
        name: 'Push Day',
        description: 'Pectoraux, épaules, triceps',
        exercises: [
            { exerciseId: 'ex6', sets: 4, reps: '6-8', restTime: 120 }, // Bench Press
            { exerciseId: 'ex7', sets: 3, reps: '10', restTime: 90 },   // DB Bench
            { exerciseId: 'ex8', sets: 4, reps: '8', restTime: 90 },    // Overhead Press
            { exerciseId: 'ex18', sets: 3, reps: '12', restTime: 60 },  // Lateral Raise
            { exerciseId: 'ex20', sets: 3, reps: '12', restTime: 60 }   // Tricep Pushdown
        ]
    },
    {
        id: 'template_pull',
        name: 'Pull Day',
        description: 'Dos, biceps',
        exercises: [
            { exerciseId: 'ex4', sets: 4, reps: '5', restTime: 180 },  // Deadlift
            { exerciseId: 'ex11', sets: 4, reps: '6-8', restTime: 120 }, // Pull-ups
            { exerciseId: 'ex10', sets: 3, reps: '8', restTime: 90 },  // Barbell Row
            { exerciseId: 'ex12', sets: 3, reps: '10', restTime: 90 }, // Lat Pulldown
            { exerciseId: 'ex19', sets: 3, reps: '12', restTime: 60 }  // Bicep Curl
        ]
    },
    {
        id: 'template_legs',
        name: 'Leg Day',
        description: 'Jambes et fessiers complet',
        exercises: [
            { exerciseId: 'ex1', sets: 4, reps: '8', restTime: 120 },  // Back Squat
            { exerciseId: 'ex5', sets: 4, reps: '10', restTime: 90 },  // Hip Thrust
            { exerciseId: 'ex3', sets: 3, reps: '10', restTime: 90 },  // Romanian Deadlift
            { exerciseId: 'ex14', sets: 3, reps: '12', restTime: 90 }, // Leg Press
            { exerciseId: 'ex15', sets: 3, reps: '12', restTime: 60 }  // Leg Curl
        ]
    }
];

function loadWorkoutTemplate(templateId) {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Démarrer une nouvelle séance avec le template
    startWorkoutFromTemplate(template);
    showToast(`Template "${template.name}" chargé ✓`, 'success');
}

function startWorkoutFromTemplate(template) {
    state.currentWorkout = {
        id: `workout${Date.now()}`,
        name: template.name,
        date: new Date().toISOString(),
        startTime: Date.now(),
        exercises: template.exercises.map(ex => ({
            ...ex,
            sets: Array(ex.sets).fill(null).map(() => ({ weight: '', reps: '', completed: false }))
        }))
    };

    document.getElementById('workoutSelection').classList.add('hidden');
    document.getElementById('activeWorkout').classList.remove('hidden');
    renderActiveWorkout();
    startWorkoutTimer();
}

// ===== 8. COMPARAISON DE SÉANCES =====
function compareWorkouts(workoutId1, workoutId2) {
    const w1 = state.workouts.find(w => w.id === workoutId1);
    const w2 = state.workouts.find(w => w.id === workoutId2);

    if (!w1 || !w2) return null;

    const comparison = {
        workout1: {
            name: w1.name,
            date: w1.date,
            duration: w1.duration,
            volume: calculateWorkoutVolume(w1),
            exercises: w1.exercises.length
        },
        workout2: {
            name: w2.name,
            date: w2.date,
            duration: w2.duration,
            volume: calculateWorkoutVolume(w2),
            exercises: w2.exercises.length
        },
        improvements: {}
    };

    // Calculer les améliorations
    comparison.improvements.volume = ((comparison.workout2.volume - comparison.workout1.volume) / comparison.workout1.volume * 100).toFixed(1);
    comparison.improvements.duration = ((comparison.workout2.duration - comparison.workout1.duration) / comparison.workout1.duration * 100).toFixed(1);

    return comparison;
}

function calculateWorkoutVolume(workout) {
    return workout.exercises.reduce((exTotal, ex) => {
        return exTotal + ex.sets.reduce((setTotal, s) => {
            return setTotal + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
        }, 0);
    }, 0);
}

// ===== 9. DÉTECTION DE DÉSÉQUILIBRES MUSCULAIRES =====
function detectMuscleImbalances() {
    // Calculer le volume par groupe musculaire sur les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentWorkouts = state.workouts.filter(w => new Date(w.date) >= thirtyDaysAgo);
    const muscleVolumes = {};

    recentWorkouts.forEach(workout => {
        workout.exercises.forEach(ex => {
            const exercise = state.exercises.find(e => e.id === ex.exerciseId);
            if (!exercise) return;

            const muscle = exercise.muscle;
            const volume = ex.sets.reduce((sum, set) => {
                return sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0);
            }, 0);

            muscleVolumes[muscle] = (muscleVolumes[muscle] || 0) + volume;
        });
    });

    // Détecter les déséquilibres
    const imbalances = [];
    const totalVolume = Object.values(muscleVolumes).reduce((sum, v) => sum + v, 0);

    // Paires antagonistes à vérifier
    const antagonistPairs = [
        { push: 'chest', pull: 'back', name: 'Poitrine vs Dos' },
        { push: 'shoulders', pull: 'back', name: 'Épaules vs Dos' },
        { push: 'triceps', pull: 'biceps', name: 'Triceps vs Biceps' },
        { push: 'legs', pull: 'glutes', name: 'Quadriceps vs Fessiers' }
    ];

    antagonistPairs.forEach(pair => {
        const pushVolume = muscleVolumes[pair.push] || 0;
        const pullVolume = muscleVolumes[pair.pull] || 0;

        if (pushVolume === 0 && pullVolume === 0) return;

        const ratio = pushVolume / (pullVolume || 1);

        if (ratio > 1.5) {
            imbalances.push({
                type: 'overworked',
                muscle: pair.push,
                counterpart: pair.pull,
                ratio: ratio.toFixed(2),
                message: `⚠️ ${pair.name}: Volume déséquilibré (ratio ${ratio.toFixed(2)}:1)`,
                suggestion: `Augmentez le travail de ${MUSCLE_LABELS[pair.pull]}`
            });
        } else if (ratio < 0.67) {
            imbalances.push({
                type: 'underworked',
                muscle: pair.push,
                counterpart: pair.pull,
                ratio: ratio.toFixed(2),
                message: `⚠️ ${pair.name}: Volume déséquilibré (ratio 1:${(1/ratio).toFixed(2)})`,
                suggestion: `Augmentez le travail de ${MUSCLE_LABELS[pair.push]}`
            });
        }
    });

    // Détecter les muscles négligés (< 5% du volume total)
    Object.entries(muscleVolumes).forEach(([muscle, volume]) => {
        const percentage = (volume / totalVolume) * 100;
        if (percentage < 5 && volume > 0) {
            imbalances.push({
                type: 'neglected',
                muscle,
                percentage: percentage.toFixed(1),
                message: `⚠️ ${MUSCLE_LABELS[muscle]}: Seulement ${percentage.toFixed(1)}% du volume total`,
                suggestion: `Ajoutez plus d'exercices pour ${MUSCLE_LABELS[muscle]}`
            });
        }
    });

    return {
        muscleVolumes,
        imbalances,
        summary: imbalances.length === 0
            ? '✓ Aucun déséquilibre majeur détecté'
            : `${imbalances.length} déséquilibre(s) détecté(s)`
    };
}

// ===== 10. VALIDATION FORMULAIRES EN TEMPS RÉEL =====
class FormValidator {
    constructor() {
        this.rules = {};
    }

    addRule(fieldId, validators) {
        this.rules[fieldId] = validators;
        const field = document.getElementById(fieldId);

        if (field) {
            field.addEventListener('input', () => this.validateField(fieldId));
            field.addEventListener('blur', () => this.validateField(fieldId));
        }
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const validators = this.rules[fieldId];

        if (!field || !validators) return true;

        let isValid = true;
        let errorMessage = '';

        for (const validator of validators) {
            const result = validator(field.value);
            if (!result.valid) {
                isValid = false;
                errorMessage = result.message;
                break;
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Supprimer les messages d'erreur existants
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();

        field.classList.remove('field-valid', 'field-invalid');

        if (field.value.trim() === '') return;

        if (isValid) {
            field.classList.add('field-valid');
        } else {
            field.classList.add('field-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentElement.appendChild(errorDiv);
        }
    }

    validateAll() {
        let allValid = true;
        for (const fieldId in this.rules) {
            if (!this.validateField(fieldId)) {
                allValid = false;
            }
        }
        return allValid;
    }
}

const formValidator = new FormValidator();

// Validators courants
const validators = {
    required: (value) => ({
        valid: value.trim() !== '',
        message: 'Ce champ est requis'
    }),
    number: (value) => ({
        valid: !isNaN(parseFloat(value)) && isFinite(value),
        message: 'Doit être un nombre valide'
    }),
    positive: (value) => ({
        valid: parseFloat(value) > 0,
        message: 'Doit être positif'
    }),
    email: (value) => ({
        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Email invalide'
    }),
    url: (value) => ({
        valid: value === '' || /^https?:\/\/.+/.test(value),
        message: 'URL invalide (doit commencer par http:// ou https://)'
    })
};

// ===== 11. GRAPHIQUES AVANCÉS =====
let comparisonChart = null;

function renderAdvancedProgressChart(exerciseId) {
    const canvas = document.getElementById('advancedProgressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Récupérer les données
    const workoutData = [];
    const volumeData = [];
    const oneRMData = [];

    state.workouts.forEach(w => {
        w.exercises.forEach(ex => {
            if (ex.exerciseId === exerciseId) {
                const date = new Date(w.date);
                const maxWeight = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0));
                const maxReps = Math.max(...ex.sets.map(s => parseInt(s.reps) || 0));
                const volume = ex.sets.reduce((sum, s) => sum + (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0), 0);
                const estimated1RM = calculate1RM(maxWeight, maxReps);

                workoutData.push({
                    date,
                    maxWeight,
                    volume,
                    oneRM: estimated1RM
                });
            }
        });
    });

    workoutData.sort((a, b) => a.date - b.date);

    if (comparisonChart) comparisonChart.destroy();

    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: workoutData.map(d => d.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
            datasets: [
                {
                    label: 'Poids Max (kg)',
                    data: workoutData.map(d => d.maxWeight),
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3
                },
                {
                    label: 'Volume Total (kg)',
                    data: workoutData.map(d => d.volume),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3
                },
                {
                    label: '1RM Estimé (kg)',
                    data: workoutData.map(d => d.oneRM),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Poids (kg)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Volume (kg)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

// ===== INITIALIZATION DES AMÉLIORATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Enhancements chargés');

    // Initialiser le gestionnaire de sons
    soundManager.init();

    // Ajouter les règles de validation
    formValidator.addRule('exerciseName', [validators.required]);
    formValidator.addRule('exerciseVideo', [validators.url]);
    formValidator.addRule('mealName', [validators.required]);
    formValidator.addRule('mealCal', [validators.number, validators.positive]);
});

// ===== EXPORTS GLOBAUX =====
window.musclTrackEnhancements = {
    calculate1RM,
    calculateRMPercentages,
    suggestProgression,
    soundManager,
    exportToPDF,
    dragDropManager,
    keyboardShortcuts,
    autoBackup,
    backupData,
    workoutTemplates,
    loadWorkoutTemplate,
    compareWorkouts,
    detectMuscleImbalances,
    formValidator,
    validators,
    renderAdvancedProgressChart
};
