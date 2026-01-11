// ===== BUGFIX - Corrections pour v2.0 =====

// Fix 1: Assurer que BODY_SVG est défini avant utilisation
if (typeof BODY_SVG_FRONT === 'undefined' || typeof BODY_SVG_BACK === 'undefined') {
    console.error('⚠️ BODY_SVG non chargé. Assurez-vous que body-svg.js est chargé avant les autres scripts.');
}

// Fix 2: Patch pour updateMuscleVisualizer si les SVG ne sont pas chargés
const originalUpdateMuscleVisualizer = window.updateMuscleVisualizer;
window.updateMuscleVisualizer = function(muscle) {
    // Vérifier si les SVG sont disponibles
    if (typeof BODY_SVG_FRONT === 'undefined' || typeof BODY_SVG_BACK === 'undefined') {
        console.warn('SVG non disponibles, visualiseur désactivé temporairement');
        return;
    }

    // Appeler la fonction originale
    if (originalUpdateMuscleVisualizer) {
        originalUpdateMuscleVisualizer(muscle);
    }
};

// Fix 3: Assurer que renderExercises est disponible
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que tout est chargé
    setTimeout(() => {
        if (typeof renderExercises === 'function') {
            try {
                renderExercises();
                console.log('✓ Exercices rendus avec succès');
            } catch (error) {
                console.error('Erreur lors du rendu des exercices:', error);
            }
        }
    }, 100);
});

// Fix 4: Debug helper pour vérifier l'état
window.debugMusclTrack = function() {
    console.log('=== MusclTrack Debug Info ===');
    console.log('BODY_SVG_FRONT défini:', typeof BODY_SVG_FRONT !== 'undefined');
    console.log('BODY_SVG_BACK défini:', typeof BODY_SVG_BACK !== 'undefined');
    console.log('state.exercises:', state.exercises?.length || 0, 'exercices');
    console.log('renderExercises défini:', typeof renderExercises === 'function');
    console.log('openSettings défini:', typeof openSettings === 'function');
    console.log('============================');
};

console.log('✓ Bugfix chargé');
