# 📖 Guide d'Utilisation - MusclTrack

Guide complet pour profiter au maximum de toutes les fonctionnalités de MusclTrack.

---

## 🚀 Démarrage Rapide

### Premier Lancement

1. **Ouvrez `index.html`** dans votre navigateur moderne (Chrome recommandé)
2. L'application se charge avec des exercices par défaut
3. Trois programmes d'exemple sont déjà créés
4. Vous êtes prêt à commencer !

### Première Séance

1. Cliquez sur **"Démarrer une séance"** dans le Dashboard
2. Choisissez un **template** (ex: "Upper Body - Force") ou "Séance libre"
3. Remplissez les poids et répétitions au fur et à mesure
4. Le chronomètre de séance démarre automatiquement
5. Cliquez sur **"✅ Terminer"** une fois fini

---

## 💡 Fonctionnalités Avancées

### 🎯 Calculateur 1RM

**Quand l'utiliser ?**
- Pour connaître votre force maximale théorique
- Pour programmer vos cycles d'entraînement
- Pour suivre votre progression en force brute

**Comment l'utiliser ?**
1. Allez dans **Exercices** > Cliquez sur **"🎯 Calculateur 1RM"**
2. Sélectionnez un exercice (idéalement composé : squat, bench, deadlift)
3. Les derniers poids/reps sont **auto-remplis** depuis votre historique
4. Cliquez sur **"Calculer"**
5. Obtenez votre 1RM + tous les pourcentages (65% à 95%)

**Exemple:**
- Vous avez fait **100kg × 5 reps** au Bench Press
- Votre 1RM estimé = **116.7 kg**
- 80% (pour 6-8 reps) = **93.4 kg**
- 70% (pour 10-12 reps) = **81.7 kg**

**Suggestion de Progression:**
L'application vous dit : "Essayez 102.5 kg pour 5 reps la prochaine fois" (+2.5%)

---

### 🔊 Notifications Sonores

**Sons disponibles:**
- **Triple beep** : Fin du temps de repos
- **Double beep** : 10 secondes restantes
- **Mélodie** : Nouveau record personnel
- **Beep simple** : Confirmation d'action

**Activer/Désactiver:**
1. **Paramètres** ⚙️ > Sons
2. Toggle ON/OFF
3. Sur mobile, autorisez les permissions audio

**Astuce:** Sur mobile, la vibration se déclenche aussi en fin de repos (si supporté)

---

### 📄 Export PDF

**Ce que vous pouvez exporter:**
1. **Une séance individuelle** : tous les exercices, séries, poids, reps
2. **Vos statistiques globales** : nombre de séances, temps total, volume, records

**Comment exporter une séance:**
1. Allez dans **Historique**
2. Cliquez sur l'icône **📄** à côté d'une séance
3. Le PDF se télécharge automatiquement
4. Nom du fichier : `muscltrack_seance_2026-01-10.pdf`

**Comment exporter les stats:**
1. Allez dans **Statistiques**
2. Cliquez sur **"📄 Export PDF"** en haut à droite
3. Le PDF contient tous vos records et totaux
4. Nom du fichier : `muscltrack_stats_2026-01-10.pdf`

**Raccourci:** `Ctrl+P` dans la page Stats pour export rapide

---

### 📱 Mode Hors-Ligne (PWA)

**Pourquoi l'utiliser ?**
- Accès à la salle de sport sans WiFi/4G
- Consommation de batterie réduite
- Chargement ultra-rapide

**Installation Desktop:**
1. Ouvrez l'app dans Chrome
2. Cliquez sur l'icône **⊕ Installer** dans la barre d'adresse
3. Confirmez
4. L'app apparaît dans votre menu Démarrer comme une vraie application

**Installation Mobile (Android):**
1. Ouvrez l'app dans Chrome
2. Menu ⋮ > **"Installer l'application"**
3. Confirmez
4. Icône sur l'écran d'accueil

**Installation iOS:**
1. Ouvrez dans Safari
2. Bouton Partager
3. **"Sur l'écran d'accueil"**
4. Ajoutez

**Vérifier le mode offline:**
- Activez le mode avion
- Ouvrez l'app
- La bannière **"📡 Mode hors-ligne activé"** apparaît
- Toutes vos données restent accessibles

---

### ⌨️ Raccourcis Clavier

**Navigation rapide:**
| Touche | Action |
|--------|--------|
| `Ctrl+D` | Dashboard |
| `Ctrl+W` | Séance |
| `Ctrl+H` | Historique |

**Création rapide:**
| Touche | Action |
|--------|--------|
| `Ctrl+N` | Nouvelle séance |
| `Ctrl+E` | Nouvel exercice |

**Actions:**
| Touche | Action |
|--------|--------|
| `Ctrl+S` | Sauvegarde manuelle |
| `Ctrl+P` | Export PDF |
| `Esc` | Fermer modals |
| `Space` | Passer le repos (pendant le timer) |

**Afficher tous les raccourcis:** Cliquez sur **⌨️** dans le Dashboard

**Astuce:** Les raccourcis fonctionnent aussi avec `Cmd` sur Mac

---

### 💾 Backup Automatique

**Comment ça marche ?**
- Sauvegarde automatique **toutes les 30 minutes**
- Conservation des **5 derniers backups**
- Stockage dans le LocalStorage du navigateur
- Indicateur visuel **💾** en bas à droite à chaque backup

**Forcer un backup manuel:**
- Appuyez sur `Ctrl+S`
- Ou allez dans Paramètres > Données > Exporter

**Restaurer un backup:**
1. Ouvrez la console du navigateur (`F12`)
2. Tapez : `autoBackup.restoreBackup(0)` pour le dernier backup
3. Ou `autoBackup.restoreBackup(1)` pour l'avant-dernier, etc.
4. Rechargez la page (`F5`)

**Voir tous les backups:**
```javascript
// Dans la console (F12)
autoBackup.getBackups()
```

---

### 📋 Templates de Séances

**5 templates pré-configurés:**

#### 1. **Upper Body - Force**
- Focus: Force haut du corps
- Exercices: Bench Press, Barbell Row, Overhead Press, Pull-Ups, Bicep Curl, Tricep Pushdown
- Idéal pour: Développer la force globale haut du corps

#### 2. **Lower Body - Volume**
- Focus: Volume jambes
- Exercices: Back Squat, Romanian Deadlift, Leg Press, Leg Curl, Leg Extension
- Idéal pour: Hypertrophie des jambes

#### 3. **Push Day**
- Focus: Pectoraux, épaules, triceps
- Exercices: Bench Press, DB Bench, Overhead Press, Lateral Raise, Tricep Pushdown
- Idéal pour: Split Push/Pull/Legs

#### 4. **Pull Day**
- Focus: Dos, biceps
- Exercices: Deadlift, Pull-Ups, Barbell Row, Lat Pulldown, Bicep Curl
- Idéal pour: Split Push/Pull/Legs

#### 5. **Leg Day**
- Focus: Jambes complètes
- Exercices: Back Squat, Hip Thrust, Romanian Deadlift, Leg Press, Leg Curl
- Idéal pour: Journée dédiée jambes

**Comment utiliser:**
1. Allez dans **Séance**
2. Section **"📋 Templates de Séances"**
3. Cliquez sur un template
4. La séance démarre avec tous les exercices pré-remplis
5. Il ne vous reste qu'à entrer vos poids !

**Personnaliser un template:**
- Chargez le template
- Ajoutez/supprimez des exercices avec **➕ Ajouter exercice**
- Les modifications ne sont pas sauvegardées dans le template (c'est voulu)

---

### 🔄 Glisser-Déposer

**Où l'utiliser ?**
- Pendant une séance active
- Pour réorganiser l'ordre des exercices

**Comment faire:**
1. Pendant une séance, **cliquez et maintenez** sur un exercice
2. **Faites glisser** vers le haut ou le bas
3. **Relâchez** à la position voulue
4. L'ordre est sauvegardé automatiquement

**Sur mobile:**
- Appuyez longuement sur l'exercice
- Faites glisser votre doigt
- Relâchez

**Astuce:** Utilisez-le pour faire les exercices composés en premier, puis les isolations

---

### ⚖️ Analyse des Déséquilibres

**Pourquoi c'est important ?**
- Éviter les blessures
- Équilibrer push/pull
- Corriger les faiblesses
- Améliorer la posture

**Comment analyser:**
1. Allez dans **Statistiques**
2. Cliquez sur **"⚖️ Analyser"**
3. L'analyse se base sur vos **30 derniers jours**

**Ce qui est analysé:**
1. **Ratios Push/Pull:**
   - Pectoraux vs Dos
   - Épaules vs Dos
   - Triceps vs Biceps
   - Quadriceps vs Fessiers

2. **Muscles négligés:**
   - Groupes musculaires < 5% du volume total

**Résultat:**
- ✅ **"Aucun déséquilibre détecté"** : Vous êtes bien équilibré
- ⚠️ **Déséquilibres détectés** : Liste avec suggestions

**Exemple de rapport:**
```
⚠️ Pectoraux vs Dos : Volume déséquilibré (ratio 2.1:1)
💡 Suggestion : Augmentez le travail de Dos

⚠️ Biceps : Seulement 3.2% du volume total
💡 Suggestion : Ajoutez plus d'exercices pour Biceps
```

**Action recommandée:**
- Ajoutez 1-2 séries des muscles sous-travaillés
- Rééquilibrez sur les 2-3 prochaines semaines
- Re-analysez pour vérifier l'amélioration

---

### 📊 Graphiques de Progression

**Graphique simple (Dashboard):**
- Sélectionnez un exercice
- Choisissez la période (semaine, mois, 3 mois)
- Visualisez l'évolution du poids max

**Graphique avancé:**
- Affiche simultanément :
  - **Poids max** (ligne bleue)
  - **Volume total** (ligne verte)
  - **1RM estimé** (ligne orange pointillée)
- Deux axes Y pour différentes échelles

**Comment interpréter:**
- **Tendance montante** : Progression
- **Plateau** : Possible besoin de changer de programme
- **Baisse** : Fatigue, blessure, ou besoin de deload

---

## 🎓 Cas d'Usage Pratiques

### Cas 1: Débutant en Musculation

**Objectif:** Apprendre les exercices de base et suivre sa progression

**Plan d'action:**
1. **Semaine 1-2:** Utilisez le template "Upper Body - Force" et "Lower Body - Volume" en alternance
2. **Remplissez les poids:** Commencez léger (50-60% de ce que vous pensez pouvoir faire)
3. **Notez tout:** Même si c'est la barre à vide
4. **Regardez les vidéos:** Cliquez sur "🎥 Voir vidéo" sur chaque exercice

**Après 4 semaines:**
- Utilisez le calculateur 1RM pour estimer votre force
- Analysez vos déséquilibres
- Ajustez votre programme

---

### Cas 2: Pratiquant Intermédiaire

**Objectif:** Optimiser sa progression et corriger les déséquilibres

**Plan d'action:**
1. **Importez vos données** si vous avez un ancien carnet
2. **Calculez votre 1RM** sur les 3 grands mouvements (Squat, Bench, Deadlift)
3. **Programmez en pourcentages:**
   - Semaine 1: 70% × 10 reps
   - Semaine 2: 75% × 8 reps
   - Semaine 3: 80% × 6 reps
   - Semaine 4: Deload 60% × 8 reps
4. **Analysez les déséquilibres** chaque mois

**Suivi:**
- Exportez un PDF stats tous les mois
- Comparez les séances d'un mois sur l'autre

---

### Cas 3: Athlète Avancé

**Objectif:** Maximiser la performance et périodiser l'entraînement

**Plan d'action:**
1. **Créez des programmes personnalisés** pour chaque phase
2. **Utilisez les templates** comme base, personnalisez
3. **Calculez le 1RM** chaque 4-6 semaines pour ajuster les charges
4. **Analysez le volume** par groupe musculaire hebdomadaire
5. **Exportez les PDF** pour votre coach

**Périodisation exemple:**
- Phase 1 (4 semaines): Volume (65-75% × 10-12 reps)
- Phase 2 (3 semaines): Force (80-85% × 6-8 reps)
- Phase 3 (2 semaines): Puissance (85-90% × 3-5 reps)
- Phase 4 (1 semaine): Deload

---

## ⚙️ Paramètres Recommandés

### Pour la Salle de Sport
- **Thème:** Sombre (économise batterie)
- **Sons:** Activés (pour ne pas rater les repos)
- **Unités:** Selon votre matériel (kg en Europe, lbs aux USA)
- **Repos par défaut:** 90s (ajustez selon votre niveau)
- **Installation PWA:** OUI (mode hors-ligne essentiel)

### Pour Entraînement à Domicile
- **Thème:** Au choix
- **Sons:** Facultatifs
- **Unités:** kg (plus simple pour les haltères)
- **Repos par défaut:** 60s (entraînements plus courts)

---

## 🔧 Maintenance

### Nettoyage Régulier

**Tous les 6 mois:**
1. Exportez vos données (JSON)
2. Supprimez les vieilles séances si nécessaire
3. Videz le cache navigateur
4. Réimportez vos données

**Sauvegarde externe:**
- Exportez le JSON régulièrement
- Sauvegardez sur Google Drive / Dropbox
- Ou envoyez-vous par email

---

## 🐛 Problèmes Fréquents

### "Les données ont disparu"
**Solution:**
```javascript
// Console (F12)
autoBackup.restoreBackup(0)
// Puis rechargez (F5)
```

### "Le mode hors-ligne ne marche pas"
**Causes possibles:**
- Vous utilisez HTTP au lieu de HTTPS (PWA require HTTPS)
- Le Service Worker n'est pas enregistré
- Cache plein

**Solution:**
1. Vérifiez F12 > Application > Service Workers
2. Si absent, rechargez avec Ctrl+Shift+R
3. Si vous êtes en local (file://), utilisez un serveur local

### "Les sons ne se déclenchent pas"
**Solution:**
- Cliquez d'abord dans la page (les navigateurs bloquent l'audio sans interaction)
- Vérifiez Paramètres > Sons = Activés
- Montez le volume de votre appareil

### "L'export PDF est vide"
**Solution:**
- Assurez-vous d'avoir des données à exporter
- Vérifiez que jsPDF est chargé (F12 > Console)
- Essayez de recharger la page

---

## 💪 Conseils Pro

1. **Soyez Régulier:** Enregistrez TOUTES vos séances, même les mauvaises
2. **Utilisez les Templates:** Gagnez du temps avec des séances pré-configurées
3. **Calculez le 1RM:** Tous les 4-6 semaines pour ajuster votre programme
4. **Analysez les Déséquilibres:** Une fois par mois minimum
5. **Exportez en PDF:** Gardez une trace physique de vos progrès
6. **Installez la PWA:** Accès ultra-rapide, même hors-ligne
7. **Utilisez les Raccourcis:** Gagnez du temps avec Ctrl+N, Ctrl+S, etc.
8. **Backup Manuel:** Avant une grosse session, faites Ctrl+S

---

## 📈 Suivi de Progression Optimal

### Quotidien
- [ ] Enregistrer chaque séance
- [ ] Noter les sensations (dans notes exercice)

### Hebdomadaire
- [ ] Regarder le dashboard
- [ ] Vérifier le volume total
- [ ] Ajuster les poids si nécessaire

### Mensuel
- [ ] Calculer le 1RM sur exercices principaux
- [ ] Analyser les déséquilibres
- [ ] Exporter PDF stats
- [ ] Ajuster le programme si besoin

### Trimestriel
- [ ] Exporter toutes les données (JSON)
- [ ] Comparer avec trimestre précédent
- [ ] Réévaluer les objectifs

---

## 🎯 Pour Aller Plus Loin

### Idées de Programmes

**Programme Push/Pull/Legs (6j/semaine):**
- Lundi: Push Day
- Mardi: Pull Day
- Mercredi: Leg Day
- Jeudi: Push Day (variante)
- Vendredi: Pull Day (variante)
- Samedi: Leg Day (variante)
- Dimanche: Repos

**Programme Upper/Lower (4j/semaine):**
- Lundi: Upper Body - Force
- Mardi: Repos
- Mercredi: Lower Body - Volume
- Jeudi: Repos
- Vendredi: Upper Body (variante)
- Samedi: Lower Body (variante)
- Dimanche: Repos

### Intégration avec d'autres Outils

**Export vers Excel:**
1. Exportez le JSON
2. Utilisez un convertisseur JSON → CSV en ligne
3. Ouvrez dans Excel pour analyse avancée

**Partage avec Coach:**
- Exportez les séances en PDF
- Envoyez par email
- Ou partagez l'analyse de déséquilibres

---

**Bon entraînement ! 💪**

Pour plus d'infos, consultez le [README.md](README.md) et le [CHANGELOG.md](CHANGELOG.md).
