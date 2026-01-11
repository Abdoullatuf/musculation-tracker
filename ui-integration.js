// ===== UI INTEGRATION FOR ENHANCEMENTS =====
// Connecte toutes les nouvelles fonctionnalités à l'interface utilisateur

document.addEventListener('DOMContentLoaded', () => {
    initializeEnhancementsUI();
});

function initializeEnhancementsUI() {
    // 1. Initialiser les templates de séances
    renderWorkoutTemplates();

    // 2. Initialiser les event listeners
    setupEnhancementListeners();

    // 3. Afficher l'indicateur de backup au démarrage
    showBackupIndicator();

    // 4. Initialiser les sons
    if (state.settings.soundEnabled) {
        soundManager.init();
    }

    // 5. Populer le select du calculateur 1RM
    populateRMExerciseSelect();

    console.log('✓ UI Enhancements initialisés');
}

// ===== TEMPLATES DE SÉANCES =====
function renderWorkoutTemplates() {
    const container = document.getElementById('templateGrid');
    if (!container) return;

    container.innerHTML = workoutTemplates.map(template => `
        <div class="template-card" onclick="loadWorkoutTemplate('${template.id}')">
            <div class="template-card-header">
                <h3 class="template-card-title">${template.name}</h3>
                <span class="template-card-badge">${template.exercises.length} ex</span>
            </div>
            <p class="template-card-description">${template.description}</p>
            <div class="template-card-exercises">
                ${template.exercises.slice(0, 3).map(ex => {
                    const exercise = state.exercises.find(e => e.id === ex.exerciseId);
                    return exercise ? `<span class="template-exercise-chip">${exercise.name}</span>` : '';
                }).join('')}
                ${template.exercises.length > 3 ? `<span class="template-exercise-chip">+${template.exercises.length - 3}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// ===== EVENT LISTENERS =====
function setupEnhancementListeners() {
    // Calculateur 1RM
    const rmCalcBtn = document.getElementById('calculateRMBtn');
    if (rmCalcBtn) {
        rmCalcBtn.addEventListener('click', calculateAndDisplayRM);
    }

    // Ouvrir calculateur depuis la sidebar ou dashboard
    const openRMButtons = document.querySelectorAll('[data-action="open-rm-calculator"]');
    openRMButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('rmCalculatorModal').classList.remove('hidden');
        });
    });

    // Fermer calculateur
    const closeRMBtn = document.getElementById('closeRMCalculator');
    if (closeRMBtn) {
        closeRMBtn.addEventListener('click', () => {
            document.getElementById('rmCalculatorModal').classList.add('hidden');
        });
    }

    // Raccourcis clavier
    const keyboardShortcutsBtn = document.getElementById('keyboardShortcutsBtn');
    if (keyboardShortcutsBtn) {
        keyboardShortcutsBtn.addEventListener('click', () => {
            document.getElementById('keyboardShortcutsModal').classList.remove('hidden');
        });
    }

    const closeKeyboardShortcuts = document.getElementById('closeKeyboardShortcuts');
    if (closeKeyboardShortcuts) {
        closeKeyboardShortcuts.addEventListener('click', () => {
            document.getElementById('keyboardShortcutsModal').classList.add('hidden');
        });
    }

    // Export PDF Stats
    const exportStatsPDFBtn = document.getElementById('exportStatsPDF');
    if (exportStatsPDFBtn) {
        exportStatsPDFBtn.addEventListener('click', () => {
            exportToPDF('stats');
        });
    }

    // Détection déséquilibres
    const detectImbalancesBtn = document.getElementById('detectImbalancesBtn');
    if (detectImbalancesBtn) {
        detectImbalancesBtn.addEventListener('click', showImbalanceAnalysis);
    }

    // Améliorer le timer de repos avec sons
    enhanceRestTimer();

    // Activer le drag & drop sur les exercices de séance
    enableWorkoutDragDrop();
}

// ===== CALCULATEUR 1RM =====
function populateRMExerciseSelect() {
    const select = document.getElementById('rmExerciseSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Sélectionner un exercice...</option>' +
        state.exercises
            .filter(ex => ex.type === 'compound') // Seulement les composés pour le 1RM
            .map(e => `<option value="${e.id}">${e.name}</option>`)
            .join('');

    // Auto-suggérer basé sur l'historique
    select.addEventListener('change', (e) => {
        if (e.target.value) {
            autoFillLastPerformance(e.target.value);
        }
    });
}

function autoFillLastPerformance(exerciseId) {
    // Trouver la dernière performance pour cet exercice
    let lastWeight = 0;
    let lastReps = 0;

    for (let i = state.workouts.length - 1; i >= 0; i--) {
        const workout = state.workouts[i];
        const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);

        if (exercise && exercise.sets.length > 0) {
            // Prendre le set avec le poids le plus élevé
            exercise.sets.forEach(set => {
                const weight = parseFloat(set.weight) || 0;
                if (weight > lastWeight) {
                    lastWeight = weight;
                    lastReps = parseInt(set.reps) || 0;
                }
            });

            if (lastWeight > 0) break;
        }
    }

    // Pré-remplir les champs
    if (lastWeight > 0) {
        document.getElementById('rmWeight').value = lastWeight;
        document.getElementById('rmReps').value = lastReps;
    }
}

function calculateAndDisplayRM() {
    const weight = parseFloat(document.getElementById('rmWeight').value);
    const reps = parseInt(document.getElementById('rmReps').value);
    const exerciseId = document.getElementById('rmExerciseSelect').value;

    if (!weight || !reps || !exerciseId) {
        showToast('Veuillez remplir tous les champs', 'error');
        return;
    }

    const oneRM = calculate1RM(weight, reps);
    const percentages = calculateRMPercentages(oneRM);
    const progression = suggestProgression(exerciseId);

    // Afficher les résultats
    document.getElementById('rmResults').classList.remove('hidden');
    document.getElementById('rmResultValue').textContent = `${oneRM} kg`;

    // Afficher les pourcentages
    const percentagesContainer = document.getElementById('rmPercentages');
    percentagesContainer.innerHTML = Object.entries(percentages)
        .map(([percent, value]) => `
            <div class="rm-percentage-item">
                <span class="rm-percentage-label">${percent}</span>
                <span class="rm-percentage-value">${value} kg</span>
            </div>
        `).join('');

    // Afficher la suggestion de progression
    if (progression) {
        const progressionCard = document.getElementById('rmProgression');
        progressionCard.innerHTML = `
            <div class="progression-card-header">
                <span class="progression-icon">📈</span>
                <h3 class="progression-title">Suggestion de Progression</h3>
            </div>
            <p class="progression-current">
                Performance actuelle: ${progression.currentWeight} kg × ${progression.currentReps} reps
            </p>
            <div class="progression-next">
                ${progression.nextSession.message}
            </div>
        `;
    }

    soundManager.playSuccess();
}

// ===== ANALYSE DES DÉSÉQUILIBRES =====
function showImbalanceAnalysis() {
    const analysis = detectMuscleImbalances();
    const reportContainer = document.getElementById('imbalanceReport');
    const contentContainer = document.getElementById('imbalanceContent');

    if (!reportContainer || !contentContainer) return;

    reportContainer.classList.remove('hidden');

    // Résumé
    const summaryClass = analysis.imbalances.length === 0 ? 'success' : 'warning';
    const summaryIcon = analysis.imbalances.length === 0 ? '✓' : '⚠️';

    let html = `
        <div class="imbalance-summary ${summaryClass}">
            <span class="imbalance-icon">${summaryIcon}</span>
            <div>
                <h3>${analysis.summary}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">
                    Analyse basée sur les 30 derniers jours
                </p>
            </div>
        </div>
    `;

    // Volume par muscle
    if (Object.keys(analysis.muscleVolumes).length > 0) {
        html += `
            <div style="margin: 1.5rem 0;">
                <h3 style="margin-bottom: 1rem;">Volume par Groupe Musculaire</h3>
                <div class="muscle-volume-bars">
        `;

        const maxVolume = Math.max(...Object.values(analysis.muscleVolumes));
        Object.entries(analysis.muscleVolumes)
            .sort((a, b) => b[1] - a[1])
            .forEach(([muscle, volume]) => {
                const percentage = (volume / maxVolume) * 100;
                html += `
                    <div class="muscle-volume-bar">
                        <span class="muscle-volume-label">${MUSCLE_LABELS[muscle] || muscle}</span>
                        <div class="muscle-volume-track">
                            <div class="muscle-volume-fill" style="width: ${percentage}%">
                                <span class="muscle-volume-value">${Math.round(volume)} kg</span>
                            </div>
                        </div>
                    </div>
                `;
            });

        html += `
                </div>
            </div>
        `;
    }

    // Liste des déséquilibres
    if (analysis.imbalances.length > 0) {
        html += `
            <div style="margin-top: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">Déséquilibres Détectés</h3>
                <div class="imbalance-list">
        `;

        analysis.imbalances.forEach(imbalance => {
            html += `
                <div class="imbalance-item">
                    <div class="imbalance-item-header">
                        <span class="imbalance-item-message">${imbalance.message}</span>
                        ${imbalance.ratio ? `<span class="imbalance-item-ratio">Ratio ${imbalance.ratio}</span>` : ''}
                    </div>
                    <p class="imbalance-item-suggestion">💡 ${imbalance.suggestion}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    contentContainer.innerHTML = html;

    // Scroll vers le rapport
    reportContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== AMÉLIORATION DU TIMER DE REPOS =====
function enhanceRestTimer() {
    // Intercepter le démarrage du timer de repos
    const originalStartRest = window.startRestTimer;

    if (originalStartRest) {
        window.startRestTimer = function(duration) {
            originalStartRest(duration);

            // Ajouter un avertissement à 10 secondes
            const warningTime = duration - 10;
            if (warningTime > 0) {
                setTimeout(() => {
                    soundManager.playRestWarning();
                }, warningTime * 1000);
            }

            // Son de fin
            setTimeout(() => {
                soundManager.playRestComplete();

                // Vibration si supportée
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                }
            }, duration * 1000);
        };
    }
}

// ===== DRAG & DROP POUR EXERCICES =====
function enableWorkoutDragDrop() {
    const workoutExercisesContainer = document.getElementById('workoutExercises');

    if (workoutExercisesContainer) {
        const observer = new MutationObserver(() => {
            if (state.currentWorkout && state.currentWorkout.exercises) {
                dragDropManager.enableDragDrop(
                    workoutExercisesContainer,
                    '.workout-exercise-card',
                    (fromIndex, toIndex) => {
                        // Réorganiser les exercices
                        const exercises = state.currentWorkout.exercises;
                        const [moved] = exercises.splice(fromIndex, 1);
                        exercises.splice(toIndex, 0, moved);

                        // Re-render
                        renderActiveWorkout();
                        showToast('Ordre modifié ✓', 'success');
                    }
                );
            }
        });

        observer.observe(workoutExercisesContainer, { childList: true });
    }
}

// ===== INDICATEUR DE BACKUP =====
function showBackupIndicator() {
    const indicator = document.getElementById('backupIndicator');
    if (!indicator) return;

    // Afficher l'indicateur pendant 3 secondes
    indicator.classList.remove('hidden');

    setTimeout(() => {
        indicator.classList.add('hidden');
    }, 3000);
}

// Afficher l'indicateur à chaque backup auto
if (autoBackup) {
    const originalCreateBackup = autoBackup.createBackup.bind(autoBackup);
    autoBackup.createBackup = function() {
        originalCreateBackup();
        showBackupIndicator();
    };
}

// ===== EXPORT PDF DEPUIS L'HISTORIQUE =====
function addExportButtonsToHistory() {
    // Ajouter des boutons d'export sur chaque séance dans l'historique
    const historyObserver = new MutationObserver(() => {
        const workoutItems = document.querySelectorAll('.workout-item');
        workoutItems.forEach(item => {
            if (!item.querySelector('.btn-export-workout')) {
                const workoutId = item.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (workoutId) {
                    const exportBtn = document.createElement('button');
                    exportBtn.className = 'btn-icon btn-export-workout';
                    exportBtn.innerHTML = '📄';
                    exportBtn.title = 'Export PDF';
                    exportBtn.onclick = (e) => {
                        e.stopPropagation();
                        exportToPDF('workout', workoutId);
                    };
                    item.appendChild(exportBtn);
                }
            }
        });
    });

    const historyList = document.getElementById('historyList');
    if (historyList) {
        historyObserver.observe(historyList, { childList: true, subtree: true });
    }

    const recentList = document.getElementById('recentWorkoutsList');
    if (recentList) {
        historyObserver.observe(recentList, { childList: true, subtree: true });
    }
}

// Initialiser les boutons d'export
setTimeout(addExportButtonsToHistory, 1000);

// ===== AMÉLIORER LA PAGE DE WORKOUT =====
function renderWorkoutPage() {
    renderWorkoutTemplates();

    // Si pas de séance en cours, afficher les options
    if (!state.currentWorkout) {
        document.getElementById('workoutSelection').classList.remove('hidden');
        document.getElementById('activeWorkout').classList.add('hidden');
    } else {
        document.getElementById('workoutSelection').classList.add('hidden');
        document.getElementById('activeWorkout').classList.remove('hidden');
        renderActiveWorkout();
    }
}

// ===== AJOUT D'UN BOUTON 1RM DANS LA PAGE EXERCICES =====
function addRMCalculatorToExercises() {
    const exercisesPage = document.getElementById('exercises-page');
    if (!exercisesPage) return;

    const header = exercisesPage.querySelector('.page-header');
    if (!header || header.querySelector('.btn-rm-calculator')) return;

    const rmButton = document.createElement('button');
    rmButton.className = 'btn-secondary btn-rm-calculator';
    rmButton.innerHTML = '🎯 Calculateur 1RM';
    rmButton.style.marginRight = '0.5rem';
    rmButton.onclick = () => {
        document.getElementById('rmCalculatorModal').classList.remove('hidden');
    };

    const addExerciseBtn = header.querySelector('.btn-primary');
    if (addExerciseBtn) {
        addExerciseBtn.parentNode.insertBefore(rmButton, addExerciseBtn);
    }
}

// Initialiser le bouton 1RM après chargement
setTimeout(addRMCalculatorToExercises, 500);

// ===== EXPORT GLOBAL =====
window.uiIntegration = {
    renderWorkoutTemplates,
    calculateAndDisplayRM,
    showImbalanceAnalysis,
    showBackupIndicator,
    addExportButtonsToHistory,
    renderWorkoutPage
};

console.log('✓ UI Integration chargée');
