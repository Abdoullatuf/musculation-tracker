# 🐛 Guide de Débogage - MusclTrack

## Problèmes Connus et Solutions

### ❌ Problème 1: Les exercices ne s'affichent pas

**Symptômes:**
- L'onglet Exercices est vide
- Aucune carte d'exercice visible

**Causes possibles:**
1. Les scripts ne se chargent pas dans le bon ordre
2. `state.exercises` est vide ou undefined
3. Erreur JavaScript bloquante

**Solutions:**

#### Solution 1: Vérifier la Console
1. Ouvrez la console (F12)
2. Cherchez des erreurs en rouge
3. Si vous voyez "BODY_SVG is not defined" → Le fichier body-svg.js n'est pas chargé

#### Solution 2: Forcer le rechargement
1. Videz le cache (Ctrl+Shift+Delete)
2. Rechargez avec Ctrl+Shift+R
3. Vérifiez que tous les fichiers .js se chargent (onglet Network dans F12)

#### Solution 3: Réinitialiser les données
```javascript
// Dans la console (F12)
localStorage.clear();
location.reload();
```
**⚠️ ATTENTION: Cela efface toutes vos données !**

#### Solution 4: Debug manuel
```javascript
// Dans la console (F12)
debugMusclTrack(); // Affiche l'état de l'app
state.exercises.length; // Nombre d'exercices
renderExercises(); // Force le rendu
```

---

### ❌ Problème 2: Le bouton Paramètres ne fonctionne pas

**Symptômes:**
- Clic sur ⚙️ ne fait rien
- Modal paramètres ne s'ouvre pas

**Causes possibles:**
1. Event listener non attaché
2. Fonction `openSettings()` non définie
3. Modal avec mauvais ID

**Solutions:**

#### Solution 1: Vérifier que la fonction existe
```javascript
// Dans la console (F12)
typeof openSettings; // Doit retourner "function"
```

#### Solution 2: Attacher manuellement l'event
```javascript
// Dans la console (F12)
document.getElementById('settingsBtn').onclick = () => {
    document.getElementById('settingsModal').classList.remove('hidden');
};
```

#### Solution 3: Vérifier l'ordre des scripts
Dans index.html, l'ordre doit être:
1. body-svg.js
2. app.js
3. bugfix.js
4. features.js (contient openSettings)
5. enhancements.js
6. ui-integration.js

---

### ❌ Problème 3: Erreur "BODY_SVG is not defined"

**Cause:** body-svg.js n'est pas chargé ou se charge après features.js

**Solution:**
Vérifiez l'ordre dans index.html (ligne ~750):
```html
<script src="body-svg.js"></script>  ← DOIT être avant
<script src="features.js"></script>
```

---

### ❌ Problème 4: Visualiseur de muscles ne s'affiche pas

**Symptômes:**
- Zone noire/vide dans le modal exercice
- Pas de squelette visible

**Solutions:**

#### Solution 1: Vérifier que body-svg.js est chargé
```javascript
// Console
typeof BODY_SVG_FRONT; // Doit retourner "string"
typeof BODY_SVG_BACK;  // Doit retourner "string"
```

#### Solution 2: Force l'affichage
```javascript
// Console - Ouvrir le modal exercice d'abord, puis:
updateMuscleVisualizer('chest');
```

---

### ❌ Problème 5: Export PDF ne fonctionne pas

**Cause:** jsPDF non chargé

**Solution:**
```javascript
// Console
typeof jspdf; // Doit retourner "object"
```

Si undefined, vérifiez votre connexion internet (jsPDF est chargé depuis CDN)

---

### ❌ Problème 6: Mode hors-ligne ne fonctionne pas

**Symptômes:**
- L'app ne charge pas sans internet
- Pas d'icône d'installation PWA

**Causes:**
1. Vous n'êtes pas en HTTPS (PWA nécessite HTTPS)
2. Service Worker pas enregistré
3. Navigateur ne supporte pas PWA

**Solutions:**

#### Vérifier le Service Worker
1. F12 > Application > Service Workers
2. Devrait montrer sw.js "activated"

#### Forcer l'enregistrement
```javascript
// Console
navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('OK'))
    .catch(err => console.error(err));
```

---

## 🔧 Commandes de Debug Utiles

### État de l'Application
```javascript
// Afficher tout l'état
console.log(state);

// Nombre d'exercices
state.exercises.length;

// Nombre de séances
state.workouts.length;

// Paramètres
state.settings;
```

### Forcer le Rendu
```javascript
// Exercices
renderExercises();

// Dashboard
updateDashboard();

// Programmes
renderPrograms();
```

### Vérifier les Fonctions
```javascript
// Lister toutes les fonctions disponibles
Object.keys(window).filter(k => typeof window[k] === 'function' && k.startsWith('render'));
```

### Restaurer un Backup
```javascript
// Voir les backups disponibles
autoBackup.getBackups();

// Restaurer le dernier
autoBackup.restoreBackup(0);
```

### Nettoyer et Redémarrer
```javascript
// ATTENTION: Efface TOUT
localStorage.clear();
location.reload();
```

---

## 📋 Checklist de Vérification

Avant de signaler un bug, vérifiez:

- [ ] Console ouverte (F12) - Y a-t-il des erreurs ?
- [ ] Tous les fichiers .js sont chargés (F12 > Network)
- [ ] body-svg.js se charge AVANT features.js
- [ ] bugfix.js est présent et se charge
- [ ] Cache vidé et page rechargée (Ctrl+Shift+R)
- [ ] Navigateur à jour (Chrome 90+)
- [ ] JavaScript activé
- [ ] LocalStorage disponible (pas en navigation privée)

---

## 🆘 Dernier Recours

Si rien ne fonctionne:

1. **Sauvegardez vos données:**
   ```javascript
   // Console
   const backup = JSON.stringify({
       exercises: state.exercises,
       workouts: state.workouts,
       programs: state.programs,
       settings: state.settings
   });
   console.log(backup); // Copiez-collez ça quelque part
   ```

2. **Réinitialisez:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Réimportez vos données:**
   - Paramètres > Importer
   - Collez le backup JSON sauvegardé

---

## 🔍 Rapporter un Bug

Si le problème persiste:

1. Notez la version: **v2.0.0**
2. Notez votre navigateur et version
3. Copiez les erreurs de la console (F12)
4. Décrivez les étapes pour reproduire
5. Joignez un screenshot si possible

---

## 🛠️ Outils de Développement

### Activer le Mode Verbose
```javascript
// Console
localStorage.setItem('debug', 'true');
location.reload();
```

### Désactiver le Mode Verbose
```javascript
localStorage.removeItem('debug');
location.reload();
```

### Afficher les Infos de Debug
```javascript
debugMusclTrack();
```

---

## 📚 Ressources

- [README.md](README.md) - Documentation générale
- [GUIDE_UTILISATION.md](GUIDE_UTILISATION.md) - Guide d'utilisation
- [FICHIERS.md](FICHIERS.md) - Structure du code

---

**Dernière mise à jour:** Janvier 2026
**Version:** 2.0.0
