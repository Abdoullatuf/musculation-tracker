# 💪 MusclTrack - Application de Suivi de Musculation

Application web complète et moderne pour suivre vos séances de musculation, analyser votre progression et optimiser vos entraînements.

## 🚀 Nouvelles Fonctionnalités (Version Améliorée)

### 1. **Calculateur de 1RM Automatique**
- Calcul de la répétition maximale (1RM) basé sur vos performances
- Pourcentages d'entraînement automatiques (65% à 95%)
- Suggestions de progression personnalisées
- Historique automatique de vos meilleures performances

**Comment utiliser:**
- Accédez via le bouton "🎯 Calculateur 1RM" dans la page Exercices
- Ou utilisez le raccourci clavier `Ctrl+1`

### 2. **Notifications Sonores**
- Son distinct à la fin du temps de repos
- Avertissement sonore 10 secondes avant la fin
- Son de succès lors de l'enregistrement
- Mélodie de progression lors des nouveaux records
- Activation/désactivation dans les paramètres

### 3. **Export PDF**
- Exportez vos séances individuelles en PDF
- Générez un rapport complet de vos statistiques
- Mise en page professionnelle et imprimable
- Bouton d'export sur chaque séance de l'historique

**Comment exporter:**
- Cliquez sur "📄 Export PDF" dans la page Statistiques
- Ou utilisez `Ctrl+P` pour exporter la vue actuelle

### 4. **Mode Hors-Ligne (PWA)**
- Fonctionne sans connexion internet
- Données synchronisées localement
- Installation possible sur mobile et desktop
- Bannière d'avertissement en mode hors-ligne

### 5. **Animations et Transitions Améliorées**
- Transitions fluides entre les pages
- Animations sur les modals et cartes
- Feedback visuel sur les actions
- Indicateurs de chargement élégants

### 6. **Glisser-Déposer**
- Réorganisez vos exercices pendant une séance
- Drag & drop intuitif
- Feedback visuel pendant le déplacement

### 7. **Raccourcis Clavier**
| Raccourci | Action |
|-----------|--------|
| `Ctrl+D` | Aller au Dashboard |
| `Ctrl+N` | Nouvelle séance |
| `Ctrl+E` | Nouvel exercice |
| `Ctrl+H` | Voir l'historique |
| `Ctrl+W` | Page séance |
| `Ctrl+S` | Sauvegarde manuelle |
| `Ctrl+P` | Export PDF |
| `Esc` | Fermer les modals |
| `Space` | Passer le repos (pendant le timer) |

**Afficher la liste:** Cliquez sur le bouton ⌨️ dans le Dashboard

### 8. **Backup Automatique**
- Sauvegarde automatique toutes les 30 minutes
- Conservation des 5 derniers backups
- Restauration facile en cas de problème
- Indicateur visuel lors des sauvegardes

### 9. **Templates de Séances Pré-configurés**
Séances prêtes à l'emploi :
- **Upper Body - Force** : Développé couché, rowing, développé militaire
- **Lower Body - Volume** : Squat, soulevé de terre roumain, leg press
- **Push Day** : Pectoraux, épaules, triceps
- **Pull Day** : Dos, biceps
- **Leg Day** : Jambes et fessiers complet

**Utilisation:** Sélectionnez un template dans la page Séance pour démarrer instantanément

### 10. **Comparaison de Séances**
- Comparez deux séances entre elles
- Visualisez l'évolution du volume
- Analysez les changements de durée
- Identifiez vos progrès

### 11. **Détection de Déséquilibres Musculaires**
- Analyse automatique du volume par groupe musculaire
- Détection des ratios push/pull
- Identification des muscles négligés (< 5% du volume)
- Suggestions d'amélioration personnalisées

**Comment analyser:**
- Cliquez sur "⚖️ Analyser" dans la page Statistiques
- L'analyse porte sur les 30 derniers jours

### 12. **Graphiques de Progression Avancés**
- Graphique multi-courbes (Poids max, Volume, 1RM estimé)
- Évolution sur différentes périodes
- Visualisation des tendances
- Export des données

### 13. **Validation Formulaires en Temps Réel**
- Feedback immédiat sur les champs
- Messages d'erreur contextuels
- Indicateurs visuels de validité
- Animation de feedback

### 14. **Mode Responsive Optimisé**
- Interface adaptée aux petits écrans
- Navigation mobile intuitive
- Cartes compactes pour mobile
- Gestes tactiles optimisés

## 📱 Installation (PWA)

### Sur Desktop (Chrome, Edge)
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. Confirmez l'installation
4. L'application apparaît dans votre menu démarrer

### Sur Mobile (Android)
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (⋮) > "Installer l'application"
3. Confirmez l'installation
4. L'icône apparaît sur votre écran d'accueil

### Sur iOS (iPhone/iPad)
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager
3. Sélectionnez "Sur l'écran d'accueil"
4. Confirmez l'ajout

## 🎨 Personnalisation

### Thèmes
- **Mode Sombre** (par défaut) : Optimal pour les salles de sport
- **Mode Clair** : Pour une utilisation en plein jour

### Unités
- Kilogrammes (kg)
- Livres (lbs)

### Repos par Défaut
Configurez votre temps de repos préféré entre 30 et 300 secondes

## 💾 Gestion des Données

### Export/Import
- **Export** : Téléchargez toutes vos données en JSON
- **Import** : Restaurez vos données depuis un fichier
- **Format** : JSON standard, facilement exploitable

### Backup Automatique
- Intervalle : 30 minutes
- Conservation : 5 derniers backups
- Stockage : LocalStorage du navigateur

### Restauration
En cas de problème :
1. Ouvrez la console (F12)
2. Tapez : `autoBackup.restoreBackup(0)` pour le dernier backup
3. Rechargez la page

## 🔧 Technologies Utilisées

- **Frontend** : HTML5, CSS3 (CSS Variables), JavaScript (ES6+)
- **Graphiques** : Chart.js
- **PDF** : jsPDF
- **PWA** : Service Worker, Web App Manifest
- **Stockage** : LocalStorage API
- **Audio** : Web Audio API

## 📊 Structure des Fichiers

```
musculation-tracker/
├── index.html              # Page principale
├── app.js                  # Logique de base
├── features.js             # Fonctionnalités étendues
├── enhancements.js         # Nouvelles améliorations (1RM, sons, etc.)
├── ui-integration.js       # Intégration UI des améliorations
├── styles.css              # Styles de base
├── enhancements.css        # Styles des nouvelles fonctionnalités
├── sw.js                   # Service Worker (mode hors-ligne)
├── manifest.json           # Manifest PWA
└── README.md               # Ce fichier
```

## 🎯 Roadmap Future

Fonctionnalités potentielles :
- [ ] Intégration avec Apple Health / Google Fit
- [ ] Partage social des records
- [ ] Plans d'entraînement générés par IA
- [ ] Calcul automatique de la fatigue
- [ ] Mode coaching avec vidéos
- [ ] Synchronisation cloud (Firebase)
- [ ] Communauté et défis

## 🐛 Résolution de Problèmes

### L'application ne charge pas
- Videz le cache du navigateur (Ctrl+Shift+Delete)
- Assurez-vous que JavaScript est activé
- Vérifiez la console pour les erreurs (F12)

### Les données ont disparu
- Restaurez depuis un backup : `autoBackup.restoreBackup(0)`
- Vérifiez que le LocalStorage n'est pas plein
- Importez vos données depuis un export précédent

### Le mode hors-ligne ne fonctionne pas
- Vérifiez que le Service Worker est enregistré (F12 > Application > Service Workers)
- Rechargez la page avec Ctrl+Shift+R
- Assurez-vous d'utiliser HTTPS (requis pour PWA)

### Les sons ne se déclenchent pas
- Vérifiez que les sons sont activés dans les paramètres
- Certains navigateurs bloquent l'audio sans interaction utilisateur
- Cliquez d'abord dans la page, puis testez

## 📈 Conseils d'Utilisation

### Pour Progresser
1. **Suivez votre 1RM** : Calculez-le régulièrement pour ajuster vos charges
2. **Analysez les déséquilibres** : Corrigez-les pour éviter les blessures
3. **Utilisez les templates** : Gagnez du temps avec des séances pré-configurées
4. **Exportez en PDF** : Gardez une trace physique de vos progrès

### Pour la Cohérence
1. **Activez les notifications** : Ne manquez jamais votre repos
2. **Utilisez les raccourcis** : Enregistrez vos séances plus rapidement
3. **Installez la PWA** : Accédez hors-ligne à la salle
4. **Vérifiez les backups** : Assurez-vous que vos données sont sauvegardées

## 🤝 Contribution

Suggestions d'amélioration ? Bugs à signaler ?
- Créez une issue sur le dépôt
- Proposez une pull request
- Partagez vos retours d'expérience

## 📜 Licence

MIT License - Libre d'utilisation et de modification

## 🙏 Crédits

- **Fonts** : Inter (Google Fonts)
- **Charts** : Chart.js
- **PDF** : jsPDF
- **Icônes** : Emojis Unicode

---

**Version** : 2.0.0 (Améliorée)
**Dernière mise à jour** : Janvier 2026

💪 Bon entraînement avec MusclTrack !
