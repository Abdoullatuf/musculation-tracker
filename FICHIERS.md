# 📂 Structure des Fichiers - MusclTrack v2.0

Liste complète de tous les fichiers du projet avec leur description et taille.

---

## 🎯 Fichiers Principaux (Application)

### HTML
| Fichier | Description | Lignes | État |
|---------|-------------|--------|------|
| **index.html** | Page principale de l'application | ~775 | ✅ Mis à jour |

### JavaScript (Logique)
| Fichier | Description | Lignes | État |
|---------|-------------|--------|------|
| **app.js** | Logique de base, gestion des données | ~495 | ✅ Original |
| **features.js** | Fonctionnalités étendues (exercices, programmes) | ~379 | ✅ Original |
| **enhancements.js** | Nouvelles améliorations v2.0 | ~815 | 🆕 Nouveau |
| **ui-integration.js** | Intégration UI des améliorations | ~400 | 🆕 Nouveau |
| **body-svg.js** | Squelettes anatomiques SVG | ~250 | 🆕 Nouveau |

### CSS (Apparence)
| Fichier | Description | Lignes | État |
|---------|-------------|--------|------|
| **styles.css** | Styles de base | ~1788 | ✅ Original |
| **enhancements.css** | Styles des nouvelles fonctionnalités | ~966 | 🆕 Nouveau |

---

## ⚙️ Fichiers de Configuration

| Fichier | Description | Format | État |
|---------|-------------|--------|------|
| **manifest.json** | Configuration PWA | JSON | 🆕 Nouveau |
| **sw.js** | Service Worker (mode hors-ligne) | JavaScript | 🆕 Nouveau |

---

## 📚 Documentation

| Fichier | Description | Lignes | Pour qui |
|---------|-------------|--------|----------|
| **README.md** | Guide complet de l'application | ~400 | Tous |
| **GUIDE_UTILISATION.md** | Guide pratique étape par étape | ~800 | Utilisateurs |
| **CHANGELOG.md** | Historique des modifications | ~450 | Développeurs |
| **ANATOMIE.md** | Guide des visualisations anatomiques | ~350 | Utilisateurs/Dev |
| **SUMMARY.md** | Résumé rapide des améliorations | ~250 | Tous |
| **FICHIERS.md** | Ce fichier (liste des fichiers) | ~150 | Développeurs |

---

## 📊 Statistiques Globales

### Par Type de Fichier
```
HTML:         775 lignes (1 fichier)
JavaScript:  2340 lignes (5 fichiers)
CSS:         2754 lignes (2 fichiers)
JSON:          30 lignes (1 fichier)
Markdown:    2400 lignes (6 fichiers)
─────────────────────────────
TOTAL:       8299 lignes (15 fichiers)
```

### Par Catégorie
```
Application:  5869 lignes (8 fichiers)  - 71%
Documentation: 2400 lignes (6 fichiers)  - 29%
Configuration:  30 lignes (1 fichier)   - <1%
```

### Nouveaux vs Existants
```
Nouveaux (v2.0):  3200 lignes (9 fichiers)  - 39%
Modifiés:          775 lignes (1 fichier)   - 9%
Originaux:        4324 lignes (5 fichiers)  - 52%
```

---

## 🔍 Détails par Fichier

### index.html (775 lignes)
**Rôle:** Structure HTML de l'application
**Modifications v2.0:**
- Ajout de `enhancements.css` et `body-svg.js`
- Ajout du manifest PWA
- Section templates de séances
- Boutons export PDF et analyse
- Modals 1RM et raccourcis clavier
- Bannière offline et indicateur backup

**Sections principales:**
- Lignes 1-17: Head (meta, CSS)
- Lignes 19-42: Sidebar navigation
- Lignes 44-116: Dashboard
- Lignes 118-153: Page Workout
- Lignes 155-187: Page Exercices
- Lignes 189-197: Page Programmes
- Lignes 199-270: Page Nutrition
- Lignes 272-281: Page Historique
- Lignes 283-360: Page Statistiques
- Lignes 362-775: Modals et scripts

---

### app.js (495 lignes)
**Rôle:** Logique principale de l'application
**Fonctionnalités:**
- Gestion du state (localStorage)
- Exercices par défaut (27 exercices)
- Programmes par défaut (3 programmes)
- Event listeners de base
- Navigation
- Dashboard et statistiques
- Graphiques de progression

**Sections:**
- Lignes 1-46: Constantes et state
- Lignes 47-134: Initialisation
- Lignes 192-284: Event listeners
- Lignes 286-309: Navigation
- Lignes 311-495: Dashboard et charts

---

### features.js (379 lignes)
**Rôle:** Fonctionnalités étendues
**Contenu:**
- Gestion des exercices (CRUD)
- Gestion des programmes
- Filtrage et recherche
- Visualiseur de muscles (ancien, remplacé)
- Rendu des cartes d'exercices

---

### enhancements.js (815 lignes) 🆕
**Rôle:** Toutes les nouvelles fonctionnalités v2.0
**Sections:**
- Lignes 1-80: Calcul 1RM
- Lignes 82-135: Système de sons
- Lignes 137-245: Export PDF
- Lignes 247-300: Drag & Drop
- Lignes 302-385: Raccourcis clavier
- Lignes 387-465: Backup automatique
- Lignes 467-545: Templates de séances
- Lignes 547-585: Comparaison de séances
- Lignes 587-665: Détection déséquilibres
- Lignes 667-745: Validation formulaires
- Lignes 747-815: Graphiques avancés

---

### ui-integration.js (400 lignes) 🆕
**Rôle:** Connecter les améliorations à l'UI
**Fonctionnalités:**
- Render des templates
- Event listeners des nouvelles fonctionnalités
- Calculateur 1RM UI
- Analyse déséquilibres UI
- Export PDF UI
- Amélioration du timer de repos
- Drag & drop activation

---

### body-svg.js (250 lignes) 🆕
**Rôle:** Visualisations anatomiques
**Contenu:**
- SVG vue de face (BODY_SVG_FRONT)
- SVG vue de dos (BODY_SVG_BACK)
- Squelettes détaillés
- Groupes musculaires interactifs
- Styles inline SVG

**Groupes musculaires:**
- Vue face: chest, shoulders, biceps, forearms, core, legs, calves
- Vue dos: traps, lats, lower-back, rear-delts, triceps, glutes, hamstrings

---

### styles.css (1788 lignes)
**Rôle:** Styles de base de l'application
**Sections:**
- Variables CSS (couleurs, espacements)
- Reset & base
- Sidebar
- Pages
- Cards
- Buttons
- Modals
- Forms
- Charts
- Responsive

---

### enhancements.css (966 lignes) 🆕
**Rôle:** Styles des nouvelles fonctionnalités
**Sections:**
- Lignes 1-50: Animations améliorées
- Lignes 52-80: Drag & Drop
- Lignes 82-120: Validation formulaires
- Lignes 122-200: Calculateur 1RM
- Lignes 202-280: Templates de séances
- Lignes 282-350: Comparaison de séances
- Lignes 352-450: Détection déséquilibres
- Lignes 452-550: Export PDF et backup
- Lignes 552-650: Raccourcis clavier
- Lignes 652-750: Offline et PWA
- Lignes 752-800: Skeleton loading
- Lignes 800-966: Visualisations anatomiques

---

### manifest.json (30 lignes) 🆕
**Rôle:** Configuration PWA
**Contenu:**
```json
{
  "name": "MusclTrack",
  "short_name": "MusclTrack",
  "icons": [...],
  "start_url": "./index.html",
  "display": "standalone"
}
```

---

### sw.js (80 lignes) 🆕
**Rôle:** Service Worker pour mode hors-ligne
**Fonctionnalités:**
- Cache des assets
- Stratégie Network-First
- Fallback offline
- Gestion des mises à jour

---

## 🗂️ Organisation Recommandée

```
musculation-tracker/
│
├── 📄 index.html                  # Point d'entrée
│
├── 🎨 Styles/
│   ├── styles.css                 # Styles de base
│   └── enhancements.css           # Styles v2.0
│
├── ⚙️ Scripts/
│   ├── app.js                     # Core logique
│   ├── features.js                # Fonctionnalités étendues
│   ├── enhancements.js            # Améliorations v2.0
│   ├── ui-integration.js          # Intégration UI
│   └── body-svg.js                # Visualisations anatomiques
│
├── 🔧 Configuration/
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service Worker
│
└── 📚 Documentation/
    ├── README.md                  # Guide principal
    ├── GUIDE_UTILISATION.md       # Guide utilisateur
    ├── CHANGELOG.md               # Historique
    ├── ANATOMIE.md                # Visualisations
    ├── SUMMARY.md                 # Résumé
    └── FICHIERS.md                # Ce fichier
```

---

## 🔗 Dépendances Externes

### CDN (Chargés depuis internet)
```html
<!-- Fonts -->
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800

<!-- Charts -->
https://cdn.jsdelivr.net/npm/chart.js

<!-- PDF Export -->
https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
```

**Taille totale CDN:** ~150 KB
**Note:** Fonctionnent hors-ligne une fois en cache grâce au Service Worker

---

## 📦 Taille Totale du Projet

### Non compressé
```
HTML:       ~40 KB
JavaScript: ~120 KB
CSS:        ~80 KB
JSON:       ~1 KB
Markdown:   ~150 KB (docs)
─────────────────
TOTAL:      ~391 KB
```

### Compressé (gzip)
```
HTML:       ~8 KB
JavaScript: ~30 KB
CSS:        ~15 KB
JSON:       <1 KB
─────────────────
TOTAL:      ~53 KB (sans docs)
```

**Performance:** Chargement < 1 seconde sur 3G

---

## 🚀 Ordre de Chargement

### Scripts (dans index.html)
```html
1. Chart.js (CDN)
2. jsPDF (CDN)
3. body-svg.js          ← Squelettes SVG
4. app.js               ← Core
5. features.js          ← Fonctionnalités
6. enhancements.js      ← Améliorations
7. ui-integration.js    ← Intégration
8. Service Worker       ← Enregistrement async
```

### CSS
```html
1. Google Fonts (CDN)
2. styles.css
3. enhancements.css
```

---

## 🔍 Fichiers par Priorité

### Critique (bloque le rendu)
1. index.html
2. styles.css
3. enhancements.css
4. app.js

### Important (fonctionnalités de base)
5. features.js
6. Chart.js

### Améliorations (progressive enhancement)
7. enhancements.js
8. ui-integration.js
9. body-svg.js
10. jsPDF
11. sw.js

### Optionnel
12. Documentation (*.md)

---

## 🎯 Fichiers à Modifier selon le Besoin

### Ajouter un exercice
→ Modifier `app.js` (fonction `initializeDefaultExercises`)

### Ajouter un template
→ Modifier `enhancements.js` (constante `workoutTemplates`)

### Changer les couleurs
→ Modifier `styles.css` (variables CSS) et `enhancements.css`

### Modifier les squelettes
→ Modifier `body-svg.js` (SVG paths)

### Ajouter une fonctionnalité
→ Créer dans `enhancements.js`, intégrer dans `ui-integration.js`

---

## 📝 Conventions de Nommage

### Fichiers
- **Minuscules avec tirets:** `body-svg.js`, `ui-integration.js`
- **Docs en MAJUSCULES:** `README.md`, `CHANGELOG.md`

### Classes CSS
- **Kebab-case:** `.muscle-group`, `.backup-indicator`
- **BEM optionnel:** `.template-card__header`

### Variables JavaScript
- **camelCase:** `calculateRM`, `showImbalanceAnalysis`
- **UPPERCASE pour constantes:** `BODY_SVG_FRONT`, `MUSCLE_LABELS`

---

## 🧪 Fichiers de Test (à créer)

### Recommandés pour v2.1
```
tests/
├── app.test.js              # Tests unitaires app.js
├── enhancements.test.js     # Tests nouvelles fonctionnalités
├── ui.test.js               # Tests d'intégration UI
└── e2e.test.js              # Tests end-to-end
```

---

## 📦 Fichiers Build (futurs)

### Pour production optimisée
```
dist/
├── index.html               # HTML minifié
├── app.min.js               # JS concaténé + minifié
├── styles.min.css           # CSS concaténé + minifié
└── assets/
    ├── fonts/               # Fonts locales
    └── icons/               # Icônes PWA
```

---

## 🔒 Fichiers à NE PAS Modifier

1. **Chart.js** (CDN externe)
2. **jsPDF** (CDN externe)
3. **Service Worker** (sauf si vous savez ce que vous faites)

---

## 📌 Checklist Nouveau Fichier

Avant d'ajouter un fichier :
- [ ] Nom descriptif et cohérent
- [ ] Commentaires en en-tête
- [ ] Conventions de code respectées
- [ ] Référencé dans index.html si nécessaire
- [ ] Documenté dans FICHIERS.md
- [ ] Ajouté au Service Worker cache si asset

---

**Version:** 2.0.0
**Dernière mise à jour:** Janvier 2026
**Total fichiers:** 15
**Total lignes:** ~8299
