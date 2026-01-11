# 🦴 Visualisations Anatomiques - MusclTrack

## Description

MusclTrack utilise maintenant des **squelettes anatomiques détaillés** avec des groupes musculaires clairement définis pour mieux illustrer les muscles travaillés lors de chaque exercice.

---

## 🎨 Caractéristiques

### Squelette de Base
- **Structure osseuse** en cyan (#00f3ff) avec opacité réduite
- **Articulations** marquées par des cercles (épaules, coudes, hanches, genoux)
- **Colonne vertébrale** centrale pour référence anatomique
- **Proportions réalistes** du corps humain

### Groupes Musculaires

#### Vue de Face (FRONT VIEW)
1. **Pectoraux (CHEST)** - Zone centrale du torse
2. **Deltoïdes (SHOULDERS)** - Épaules gauche et droite
3. **Biceps** - Face avant des bras
4. **Avant-bras (FOREARMS)** - Des coudes aux poignets
5. **Abdominaux (ABS)** - Zone centrale avec lignes de séparation
6. **Quadriceps (QUADS)** - Face avant des cuisses
7. **Mollets (CALVES)** - Face avant des jambes

#### Vue de Dos (REAR VIEW)
1. **Trapèzes (TRAPS)** - Haut du dos
2. **Grand dorsal (LATS)** - Milieu du dos
3. **Lombaires (LOWER BACK)** - Bas du dos
4. **Deltoïdes postérieurs (REAR DELTS)** - Arrière des épaules
5. **Triceps** - Face arrière des bras
6. **Fessiers (GLUTES)** - Zone fessière
7. **Ischio-jambiers (HAMSTRINGS)** - Face arrière des cuisses
8. **Mollets (CALVES)** - Face arrière des jambes

---

## 🎯 États Visuels

### État Normal
- **Remplissage**: Transparent avec légère opacité
- **Contour**: Cyan (#00f3ff)
- **Opacité**: 50%

### État Survol (Hover)
- **Remplissage**: Cyan semi-transparent
- **Effet**: Glow cyan
- **Cursor**: Pointer (main)

### État Actif (Muscle Travaillé)
- **Remplissage**: Orange (#ff5500) avec opacité 70-80%
- **Contour**: Orange épais
- **Effet**: Drop-shadow orange brillant
- **Animation**: Pulse subtil (1.5s)

---

## 🌈 Codes Couleur

### Mode Sombre (Dark)
- **Squelette**: #00d9ff (cyan clair)
- **Muscle actif**: rgba(255, 85, 0, 0.8) (orange)
- **Background**: #0a0f1e (bleu très foncé)

### Mode Clair (Light)
- **Squelette**: #0066cc (bleu)
- **Muscle actif**: rgba(255, 85, 0, 0.7) (orange)
- **Background**: #f0f4f8 (gris clair)

---

## 💡 Utilisation dans l'App

### 1. Création/Modification d'Exercice
Lors de la création ou modification d'un exercice :
1. Sélectionnez le **muscle principal** dans le dropdown
2. Le visualiseur **change automatiquement** de vue (face/dos)
3. Le **groupe musculaire** correspondant s'illumine en orange
4. Les **labels anatomiques** indiquent les zones

**Exemple:**
- Sélectionnez "Dos" → Vue de dos s'affiche, LATS s'illumine
- Sélectionnez "Pectoraux" → Vue de face s'affiche, CHEST s'illumine

### 2. Page Statistiques - Répartition Corporelle
Dans la carte "🧘 Répartition Corporelle" :
- **Deux vues côte à côte** : FRONT_VIEW et REAR_VIEW
- Les **muscles travaillés** s'illuminent selon le volume d'entraînement
- **Intensité de la couleur** proportionnelle au volume
  - Transparent = Pas travaillé
  - Orange clair = Légèrement travaillé
  - Orange vif = Fortement travaillé

**Légende:**
- 🔷 **Structure** (contour cyan) : Squelette de base
- 🟠 **Activation** (orange semi-transparent) : Muscle travaillé
- 🔴 **Surcharge** (orange plein + glow) : Muscle très sollicité

---

## 🔧 Mappage Muscles ↔ Exercices

### Pectoraux (chest)
- Bench Press
- Dumbbell Bench Press
- Push-Up
- Dips

### Dos (back)
- Deadlift
- Barbell Row
- Pull-Up
- Lat Pulldown

### Épaules (shoulders)
- Overhead Press
- Lateral Raise
- Face Pull
- Dumbbell Shoulder Press

### Biceps (biceps)
- Bicep Curl
- Hammer Curl
- Chin-Up

### Triceps (triceps)
- Tricep Pushdown
- Close-Grip Bench
- Overhead Extension

### Jambes (legs)
- Back Squat
- Front Squat
- Leg Press
- Leg Extension (quadriceps)
- Leg Curl (ischio-jambiers)
- Calf Raise (mollets)

### Fessiers (glutes)
- Hip Thrust
- Bulgarian Split Squat
- Sumo Deadlift

### Abdos (core)
- Cable Crunch
- Plank
- Hanging Knee Raise

---

## 🎨 Personnalisation Avancée

### Modifier les Couleurs

Éditez `body-svg.js` :

```javascript
// Pour changer la couleur des muscles actifs
.muscle-group.active-muscle {
    fill: rgba(255, 85, 0, 0.7); // Orange par défaut
    stroke: #ff5500;
}

// Essayez:
// Vert: rgba(16, 185, 129, 0.7) + stroke: #10b981
// Bleu: rgba(99, 102, 241, 0.7) + stroke: #6366f1
// Violet: rgba(139, 92, 246, 0.7) + stroke: #8b5cf6
```

### Ajouter des Muscles

Pour ajouter un nouveau groupe musculaire dans `body-svg.js` :

```javascript
<!-- Nouveau muscle -->
<path class="muscle-group"
      data-muscle="nom_du_muscle"
      id="muscle-id"
      d="M ... votre path SVG ..."/>
```

Puis ajoutez-le dans `MUSCLE_LABELS` dans `app.js` :

```javascript
const MUSCLE_LABELS = {
    // ... existants
    nom_du_muscle: 'Nom Affiché'
};
```

---

## 📱 Responsive

### Desktop
- Taille: 150px × 300px
- Labels: 8px
- Détails complets

### Mobile
- Taille: 120px × 240px
- Labels: 6px
- Détails simplifiés mais visibles

---

## ♿ Accessibilité

### Interactions
- **Hover** : Survol pour voir les zones
- **Active** : Clic pour sélectionner (si interactif)
- **Labels** : Textes lisibles en monospace
- **Contraste** : Ratio élevé pour visibilité

### Couleurs
- **Daltonisme** : Orange/Cyan choisis pour être distinguables
- **Contraste** : Testé pour WCAG AA

---

## 🎓 Anatomie Simplifiée

### Groupes Musculaires Principaux

**PUSH (Poussée)**
- Pectoraux
- Deltoïdes (épaules)
- Triceps

**PULL (Tirage)**
- Dos (trapèzes, dorsaux)
- Deltoïdes postérieurs
- Biceps

**JAMBES (Legs)**
- Quadriceps (avant)
- Ischio-jambiers (arrière)
- Fessiers
- Mollets

**CORE (Centre)**
- Abdominaux
- Lombaires

---

## 🔬 Précision Anatomique

### Simplifications Volontaires

Les visualisations sont **simplifiées** pour la clarté :
- Groupes musculaires **fusionnés** (ex: tous les deltoïdes ensemble)
- Formes **stylisées** pour reconnaissance rapide
- Détails **réduits** pour éviter la surcharge visuelle

### Ce qui est montré
✅ Principaux groupes musculaires
✅ Localisation anatomique correcte
✅ Proportions réalistes
✅ Relations spatiales exactes

### Ce qui est simplifié
⚠️ Fibres musculaires individuelles
⚠️ Muscles stabilisateurs profonds
⚠️ Fascias et tendons
⚠️ Détails osseux précis

**Note:** C'est une visualisation **pédagogique** pour le fitness, pas un manuel d'anatomie médicale.

---

## 🚀 Améliorations Futures

### Prévues
- [ ] Animation du mouvement sur les exercices
- [ ] Intensité par couleur (volume de travail)
- [ ] Vue 3D interactive (rotation)
- [ ] Muscles synergistes/stabilisateurs
- [ ] Heatmap de fatigue

### Possibles
- [ ] Personnalisation des couleurs par utilisateur
- [ ] Export des visualisations en PNG
- [ ] Annotations personnalisées
- [ ] Overlay de blessures/douleurs

---

## 📚 Ressources

### Anatomie Musculaire
- [Gray's Anatomy](https://www.bartleby.com/107/) - Référence classique
- [ExRx](https://exrx.net/Lists/Directory) - Base de données exercices
- [Visible Body](https://www.visiblebody.com/) - Atlas 3D

### SVG & Visualisation
- [MDN SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/)

---

## 🤝 Contribution

Pour améliorer les visualisations anatomiques :

1. **Précision anatomique** : Proposez des corrections
2. **Nouveaux muscles** : Ajoutez des groupes manquants
3. **Styles** : Améliorez les rendus visuels
4. **Animations** : Ajoutez des effets

---

**Visualisations créées avec ❤️ pour MusclTrack v2.0**
