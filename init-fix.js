// ===== INIT FIX V3 - Correction définitive =====
// Ce script s'exécute EN DERNIER et corrige TOUS les problèmes d'événements

console.log('🔧 Init-fix V3: Démarrage...');

// Utiliser window.onload pour être sûr que TOUT est chargé
window.addEventListener('load', () => {
    console.log('📦 window.load - Application des corrections...');

    // Délai pour laisser les autres scripts finir leur initialisation
    setTimeout(() => {
        fixAllEventListeners();
    }, 500);
});

function fixAllEventListeners() {
    console.log('🔗 Attachement des event listeners...');

    // ===== 1. NAVIGATION SIDEBAR =====
    const navItems = document.querySelectorAll('.nav-item');
    console.log(`   Trouvé ${navItems.length} éléments de navigation`);

    navItems.forEach(item => {
        // Supprimer les anciens listeners en clonant l'élément
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);

        newItem.addEventListener('click', function () {
            const page = this.dataset.page;
            console.log(`🖱️ Navigation vers: ${page}`);

            // Mettre à jour la classe active
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Afficher la bonne page
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });
            const targetPage = document.getElementById(`${page}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                console.log(`   ✅ Page ${page}-page activée`);
            } else {
                console.error(`   ❌ Page ${page}-page introuvable`);
            }

            // Appeler les fonctions de rendu si disponibles
            if (page === 'history' && typeof renderHistory === 'function') renderHistory();
            if (page === 'stats' && typeof renderStats === 'function') renderStats();
            if (page === 'programs' && typeof renderPrograms === 'function') renderPrograms();
            if (page === 'nutrition' && typeof renderNutrition === 'function') renderNutrition();
            if (page === 'workout' && typeof renderWorkoutPage === 'function') renderWorkoutPage();
            if (page === 'exercises' && typeof renderExercises === 'function') renderExercises();
        });
    });
    console.log('   ✅ Navigation sidebar attachée');

    // ===== 2. BOUTON DÉMARRER UNE SÉANCE =====
    const startWorkoutBtn = document.getElementById('startQuickWorkout');
    if (startWorkoutBtn) {
        startWorkoutBtn.onclick = () => {
            console.log('🖱️ Clic: Démarrer une séance');
            // Naviguer vers la page séance
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelector('.nav-item[data-page="workout"]')?.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('workout-page')?.classList.add('active');
            if (typeof renderWorkoutPage === 'function') renderWorkoutPage();
        };
        console.log('   ✅ Bouton "Démarrer une séance" attaché');
    }

    // ===== 3. BOUTON NOUVEL EXERCICE =====
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    if (addExerciseBtn) {
        addExerciseBtn.onclick = () => {
            console.log('🖱️ Clic: Nouvel exercice');
            // Reset form
            document.getElementById('exerciseForm')?.reset();
            document.getElementById('exerciseId').value = '';
            document.getElementById('exerciseModalTitle').textContent = 'Nouvel exercice';
            // Ouvrir modal
            document.getElementById('exerciseModal')?.classList.remove('hidden');
        };
        console.log('   ✅ Bouton "Nouvel exercice" attaché');
    }

    // ===== 4. FERMETURE MODAL EXERCICE =====
    const closeExerciseBtn = document.getElementById('closeExerciseModal');
    if (closeExerciseBtn) {
        closeExerciseBtn.onclick = () => {
            console.log('🖱️ Fermeture modal exercice');
            document.getElementById('exerciseModal')?.classList.add('hidden');
        };
    }
    const cancelExerciseBtn = document.getElementById('cancelExercise');
    if (cancelExerciseBtn) {
        cancelExerciseBtn.onclick = () => {
            document.getElementById('exerciseModal')?.classList.add('hidden');
        };
    }

    // ===== 5. BOUTON NOUVEAU PROGRAMME =====
    const createProgramBtn = document.getElementById('createProgramBtn');
    if (createProgramBtn) {
        createProgramBtn.onclick = () => {
            console.log('🖱️ Clic: Nouveau programme');
            document.getElementById('programName').value = '';
            document.getElementById('programDescription').value = '';
            document.getElementById('programId').value = '';
            document.getElementById('programModalTitle').textContent = 'Nouveau programme';
            document.getElementById('programModal')?.classList.remove('hidden');
        };
        console.log('   ✅ Bouton "Nouveau programme" attaché');
    }

    // ===== 6. FERMETURE MODAL PROGRAMME =====
    const closeProgramBtn = document.getElementById('closeProgramModal');
    if (closeProgramBtn) {
        closeProgramBtn.onclick = () => {
            document.getElementById('programModal')?.classList.add('hidden');
        };
    }
    const cancelProgramBtn = document.getElementById('cancelProgram');
    if (cancelProgramBtn) {
        cancelProgramBtn.onclick = () => {
            document.getElementById('programModal')?.classList.add('hidden');
        };
    }

    // ===== 7. PARAMÈTRES =====
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            console.log('🖱️ Clic: Paramètres');
            document.getElementById('settingsModal')?.classList.remove('hidden');
        };
        console.log('   ✅ Bouton "Paramètres" attaché');
    }

    const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
    if (mobileSettingsBtn) {
        mobileSettingsBtn.onclick = () => {
            document.getElementById('settingsModal')?.classList.remove('hidden');
        };
    }

    const closeSettingsBtn = document.getElementById('closeSettings');
    if (closeSettingsBtn) {
        closeSettingsBtn.onclick = () => {
            console.log('🖱️ Fermeture paramètres');
            document.getElementById('settingsModal')?.classList.add('hidden');
        };
        console.log('   ✅ Bouton fermer paramètres attaché');
    }

    // ===== 8. RACCOURCIS CLAVIER =====
    const keyboardBtn = document.getElementById('keyboardShortcutsBtn');
    if (keyboardBtn) {
        keyboardBtn.onclick = () => {
            console.log('🖱️ Clic: Raccourcis clavier');
            document.getElementById('keyboardShortcutsModal')?.classList.remove('hidden');
        };
    }

    const closeKeyboardBtn = document.getElementById('closeKeyboardShortcuts');
    if (closeKeyboardBtn) {
        closeKeyboardBtn.onclick = () => {
            document.getElementById('keyboardShortcutsModal')?.classList.add('hidden');
        };
    }

    // ===== 9. FERMETURE MODALS SUR OVERLAY =====
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        };
    });

    // ===== 10. TOUCHE ECHAP =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        }
    });

    // ===== 11. SÉANCE LIBRE =====
    const startFreeBtn = document.getElementById('startFreeWorkout');
    if (startFreeBtn) {
        startFreeBtn.onclick = () => {
            console.log('🖱️ Clic: Séance libre');
            if (typeof startFreeWorkout === 'function') {
                startFreeWorkout();
            }
        };
    }

    // ===== 12. FALLBACK RENDER FUNCTIONS =====
    // Ces fonctions sont des copies de secours au cas où features.js ne charge pas correctement

    if (typeof window.renderPrograms !== 'function') {
        console.warn('⚠️ renderPrograms manquante - création du fallback');
        window.renderPrograms = function () {
            const container = document.getElementById('programsList');
            if (!container) return;
            if (!state?.programs?.length) {
                container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1">
                    <span class="empty-icon">📅</span>
                    <p>Aucun programme créé</p>
                    <button class="btn-primary" onclick="openProgramModal()">Créer mon premier programme</button>
                </div>`;
                return;
            }
            container.innerHTML = state.programs.map(prog => `
                <div class="program-card">
                    <div class="program-card-header">
                        <h3 class="program-card-title">${prog.name}</h3>
                        <p class="program-card-desc">${prog.description || ''}</p>
                    </div>
                    <div class="program-card-body">
                        <div class="program-days-preview">
                            ${prog.days.map(day => `<span class="day-tag">${day.name}: ${day.exercises.length} exos</span>`).join('')}
                        </div>
                    </div>
                    <div class="program-card-footer">
                        <button class="btn-secondary" onclick="editProgram('${prog.id}')">✏️ Modifier</button>
                        <button class="btn-secondary" onclick="deleteProgram('${prog.id}')">🗑️</button>
                        <button class="btn-primary" onclick="startProgramWorkout('${prog.id}')">▶️ Démarrer</button>
                    </div>
                </div>`).join('');
            // Also render the grid on workout page
            const grid = document.getElementById('programGrid');
            if (grid) {
                grid.innerHTML = state.programs.map(prog => `
                    <div class="program-card" onclick="startProgramWorkout('${prog.id}')">
                        <h3 class="program-card-title">${prog.name}</h3>
                        <p>${prog.days[0]?.exercises?.length || 0} exercices</p>
                    </div>`).join('');
            }
        };
    }

    if (typeof window.renderExercises !== 'function') {
        console.warn('⚠️ renderExercises manquante - création du fallback');
        window.renderExercises = function () {
            const container = document.getElementById('exercisesGrid');
            if (!container) return;
            if (!state?.exercises?.length) {
                container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1">
                    <span class="empty-icon">📋</span>
                    <p>Aucun exercice. Cliquez + pour en créer.</p>
                </div>`;
                return;
            }
            container.innerHTML = state.exercises.map(ex => `
                <div class="exercise-card" onclick="editExercise('${ex.id}')">
                    <div class="exercise-card-header">
                        <h3 class="exercise-card-title">${ex.name}</h3>
                        <span class="exercise-badge">${ex.type === 'compound' ? 'Composé' : 'Isolation'}</span>
                    </div>
                    <p class="exercise-card-muscle">${ex.muscle || 'Non défini'}</p>
                    <p class="exercise-card-equipment">${ex.equipment || 'Non spécifié'}</p>
                </div>`).join('');
        };
    }

    // ===== 13. FORCER LE RENDU INITIAL =====
    try {
        if (typeof renderExercises === 'function') renderExercises();
        if (typeof renderPrograms === 'function') renderPrograms();
        console.log('   ✅ Rendu initial effectué');
    } catch (err) {
        console.error('   ❌ Erreur rendu:', err);
    }

    // ===== RAPPORT FINAL =====
    console.log('═══════════════════════════════════════════');
    console.log('✅ INIT-FIX V3 TERMINÉ');
    console.log(`   Navigation items: ${navItems.length}`);
    console.log(`   Programmes: ${state?.programs?.length || 0}`);
    console.log(`   Exercices: ${state?.exercises?.length || 0}`);
    console.log('═══════════════════════════════════════════');
}

// Diagnostic global
window.diagnostic = function () {
    console.log('═══ DIAGNOSTIC ═══');
    console.log('Navigation items:', document.querySelectorAll('.nav-item').length);
    console.log('Pages:', document.querySelectorAll('.page').length);
    console.log('Active page:', document.querySelector('.page.active')?.id);
    console.log('navigateTo:', typeof navigateTo);
    console.log('renderExercises:', typeof renderExercises);
    console.log('state:', typeof state !== 'undefined' ? `${state.exercises?.length} exercices` : 'undefined');
};

console.log('✅ Init-fix V3 chargé');
