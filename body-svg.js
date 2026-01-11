// ===== SVG BODY MAPS - ANATOMICAL SKELETONS =====
// Squelettes anatomiques détaillés pour visualisation des muscles

// Vue de face - Squelette avec groupes musculaires
const BODY_SVG_FRONT = `
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
  <defs>
    <style>
      .skeleton-structure { fill: none; stroke: #00f3ff; stroke-width: 1; opacity: 0.3; }
      .muscle-group { fill: rgba(255, 255, 255, 0.05); stroke: #00f3ff; stroke-width: 1; opacity: 0.5; transition: all 0.3s; }
      .muscle-group:hover { fill: rgba(0, 243, 255, 0.2); opacity: 1; }
      .muscle-group.active-muscle { fill: rgba(255, 85, 0, 0.7); stroke: #ff5500; stroke-width: 2; opacity: 1; filter: drop-shadow(0 0 8px #ff5500); }
      .joint { fill: #00f3ff; opacity: 0.4; }
      .label { fill: #94a3b8; font-size: 8px; font-family: monospace; }
    </style>
  </defs>

  <!-- Squelette de base -->
  <g class="skeleton-structure">
    <!-- Crâne -->
    <circle cx="100" cy="25" r="18"/>

    <!-- Colonne vertébrale -->
    <line x1="100" y1="43" x2="100" y2="150"/>

    <!-- Épaules -->
    <line x1="70" y1="60" x2="130" y2="60"/>

    <!-- Bras gauche -->
    <line x1="70" y1="60" x2="65" y2="90"/> <!-- Humérus -->
    <line x1="65" y1="90" x2="60" y2="120"/> <!-- Avant-bras -->
    <circle cx="70" cy="60" r="3" class="joint"/> <!-- Épaule -->
    <circle cx="65" cy="90" r="3" class="joint"/> <!-- Coude -->

    <!-- Bras droit -->
    <line x1="130" y1="60" x2="135" y2="90"/>
    <line x1="135" y1="90" x2="140" y2="120"/>
    <circle cx="130" cy="60" r="3" class="joint"/>
    <circle cx="135" cy="90" r="3" class="joint"/>

    <!-- Bassin -->
    <ellipse cx="100" cy="150" rx="25" ry="12"/>

    <!-- Jambe gauche -->
    <line x1="88" y1="155" x2="85" y2="220"/> <!-- Fémur -->
    <line x1="85" y1="220" x2="82" y2="285"/> <!-- Tibia -->
    <circle cx="88" cy="155" r="3" class="joint"/> <!-- Hanche -->
    <circle cx="85" cy="220" r="3" class="joint"/> <!-- Genou -->

    <!-- Jambe droite -->
    <line x1="112" y1="155" x2="115" y2="220"/>
    <line x1="115" y1="220" x2="118" y2="285"/>
    <circle cx="112" cy="155" r="3" class="joint"/>
    <circle cx="115" cy="220" r="3" class="joint"/>
  </g>

  <!-- Groupes musculaires - Vue de face -->

  <!-- Pectoraux -->
  <path class="muscle-group" data-muscle="chest" id="chest-front"
    d="M 85,60 Q 75,75 75,90 L 75,95 Q 75,100 85,105 L 100,110 L 115,105 Q 125,100 125,95 L 125,90 Q 125,75 115,60 L 100,55 Z"
    />

  <!-- Deltoïdes (Épaules) -->
  <ellipse class="muscle-group" data-muscle="shoulders" id="shoulders-left"
    cx="70" cy="65" rx="12" ry="18"/>
  <ellipse class="muscle-group" data-muscle="shoulders" id="shoulders-right"
    cx="130" cy="65" rx="12" ry="18"/>

  <!-- Biceps -->
  <path class="muscle-group" data-muscle="biceps" id="biceps-left"
    d="M 65,70 Q 60,75 60,85 Q 60,90 65,92 Q 68,90 68,85 Q 68,75 65,70 Z"/>
  <path class="muscle-group" data-muscle="biceps" id="biceps-right"
    d="M 135,70 Q 140,75 140,85 Q 140,90 135,92 Q 132,90 132,85 Q 132,75 135,70 Z"/>

  <!-- Avant-bras -->
  <path class="muscle-group" data-muscle="forearms" id="forearms-left"
    d="M 62,92 Q 58,100 58,110 Q 58,118 60,120 Q 62,118 62,110 Q 62,100 62,92 Z"/>
  <path class="muscle-group" data-muscle="forearms" id="forearms-right"
    d="M 138,92 Q 142,100 142,110 Q 142,118 140,120 Q 138,118 138,110 Q 138,100 138,92 Z"/>

  <!-- Abdominaux -->
  <path class="muscle-group" data-muscle="core" id="abs-front"
    d="M 90,110 L 110,110 L 110,145 L 90,145 Z"/>
  <line x1="100" y1="110" x2="100" y2="145" stroke="#00f3ff" stroke-width="0.5" opacity="0.3"/>
  <line x1="90" y1="120" x2="110" y2="120" stroke="#00f3ff" stroke-width="0.5" opacity="0.3"/>
  <line x1="90" y1="130" x2="110" y2="130" stroke="#00f3ff" stroke-width="0.5" opacity="0.3"/>

  <!-- Quadriceps (Jambes avant) -->
  <path class="muscle-group" data-muscle="legs" id="quads-left"
    d="M 82,155 Q 78,170 78,190 Q 78,210 82,220 Q 85,218 85,200 Q 85,180 85,160 Z"/>
  <path class="muscle-group" data-muscle="legs" id="quads-right"
    d="M 118,155 Q 122,170 122,190 Q 122,210 118,220 Q 115,218 115,200 Q 115,180 115,160 Z"/>

  <!-- Mollets -->
  <path class="muscle-group" data-muscle="legs" id="calves-left"
    d="M 80,225 Q 76,240 76,255 Q 76,265 78,270 Q 82,268 82,255 Q 82,240 82,225 Z"/>
  <path class="muscle-group" data-muscle="legs" id="calves-right"
    d="M 120,225 Q 124,240 124,255 Q 124,265 122,270 Q 118,268 118,255 Q 118,240 118,225 Z"/>

  <!-- Labels optionnels -->
  <text x="100" y="85" class="label" text-anchor="middle">CHEST</text>
  <text x="70" y="75" class="label" text-anchor="middle">DELTS</text>
  <text x="100" y="125" class="label" text-anchor="middle">ABS</text>
  <text x="85" y="180" class="label" text-anchor="middle">QUADS</text>
</svg>
`;

// Vue de dos - Squelette avec groupes musculaires
const BODY_SVG_BACK = `
<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
  <defs>
    <style>
      .skeleton-structure { fill: none; stroke: #00f3ff; stroke-width: 1; opacity: 0.3; }
      .muscle-group { fill: rgba(255, 255, 255, 0.05); stroke: #00f3ff; stroke-width: 1; opacity: 0.5; transition: all 0.3s; }
      .muscle-group:hover { fill: rgba(0, 243, 255, 0.2); opacity: 1; }
      .muscle-group.active-muscle { fill: rgba(255, 85, 0, 0.7); stroke: #ff5500; stroke-width: 2; opacity: 1; filter: drop-shadow(0 0 8px #ff5500); }
      .joint { fill: #00f3ff; opacity: 0.4; }
      .label { fill: #94a3b8; font-size: 8px; font-family: monospace; }
    </style>
  </defs>

  <!-- Squelette de base -->
  <g class="skeleton-structure">
    <!-- Crâne -->
    <circle cx="100" cy="25" r="18"/>

    <!-- Colonne vertébrale -->
    <line x1="100" y1="43" x2="100" y2="150"/>

    <!-- Épaules -->
    <line x1="70" y1="60" x2="130" y2="60"/>

    <!-- Bras gauche -->
    <line x1="70" y1="60" x2="65" y2="90"/>
    <line x1="65" y1="90" x2="60" y2="120"/>
    <circle cx="70" cy="60" r="3" class="joint"/>
    <circle cx="65" cy="90" r="3" class="joint"/>

    <!-- Bras droit -->
    <line x1="130" y1="60" x2="135" y2="90"/>
    <line x1="135" y1="90" x2="140" y2="120"/>
    <circle cx="130" cy="60" r="3" class="joint"/>
    <circle cx="135" cy="90" r="3" class="joint"/>

    <!-- Bassin -->
    <ellipse cx="100" cy="150" rx="25" ry="12"/>

    <!-- Jambe gauche -->
    <line x1="88" y1="155" x2="85" y2="220"/>
    <line x1="85" y1="220" x2="82" y2="285"/>
    <circle cx="88" cy="155" r="3" class="joint"/>
    <circle cx="85" cy="220" r="3" class="joint"/>

    <!-- Jambe droite -->
    <line x1="112" y1="155" x2="115" y2="220"/>
    <line x1="115" y1="220" x2="118" y2="285"/>
    <circle cx="112" cy="155" r="3" class="joint"/>
    <circle cx="115" cy="220" r="3" class="joint"/>
  </g>

  <!-- Groupes musculaires - Vue de dos -->

  <!-- Trapèzes -->
  <path class="muscle-group" data-muscle="back" id="traps-back"
    d="M 85,55 L 100,50 L 115,55 L 120,70 L 100,75 L 80,70 Z"/>

  <!-- Grand dorsal (Lats) -->
  <path class="muscle-group" data-muscle="back" id="lats-back"
    d="M 75,75 Q 70,90 70,110 L 75,130 Q 80,135 90,138 L 100,140 L 110,138 Q 120,135 125,130 L 130,110 Q 130,90 125,75 L 100,80 Z"/>

  <!-- Lombaires (Bas du dos) -->
  <path class="muscle-group" data-muscle="back" id="lower-back"
    d="M 85,140 L 115,140 L 115,155 L 85,155 Z"/>

  <!-- Deltoïdes postérieurs -->
  <ellipse class="muscle-group" data-muscle="shoulders" id="rear-delts-left"
    cx="70" cy="65" rx="10" ry="15"/>
  <ellipse class="muscle-group" data-muscle="shoulders" id="rear-delts-right"
    cx="130" cy="65" rx="10" ry="15"/>

  <!-- Triceps -->
  <path class="muscle-group" data-muscle="triceps" id="triceps-left"
    d="M 68,70 Q 64,80 62,90 Q 64,92 68,90 Q 70,80 68,70 Z"/>
  <path class="muscle-group" data-muscle="triceps" id="triceps-right"
    d="M 132,70 Q 136,80 138,90 Q 136,92 132,90 Q 130,80 132,70 Z"/>

  <!-- Fessiers -->
  <path class="muscle-group" data-muscle="glutes" id="glutes-back"
    d="M 85,150 Q 80,160 80,170 L 85,175 Q 90,178 100,180 Q 110,178 115,175 L 120,170 Q 120,160 115,150 Z"/>

  <!-- Ischio-jambiers -->
  <path class="muscle-group" data-muscle="legs" id="hamstrings-left"
    d="M 82,180 Q 78,195 78,210 Q 78,218 82,220 Q 85,215 85,200 Q 85,190 82,180 Z"/>
  <path class="muscle-group" data-muscle="legs" id="hamstrings-right"
    d="M 118,180 Q 122,195 122,210 Q 122,218 118,220 Q 115,215 115,200 Q 115,190 118,180 Z"/>

  <!-- Mollets -->
  <path class="muscle-group" data-muscle="legs" id="calves-back-left"
    d="M 80,225 Q 76,240 76,255 Q 76,265 78,270 Q 82,268 82,255 Q 82,240 82,225 Z"/>
  <path class="muscle-group" data-muscle="legs" id="calves-back-right"
    d="M 120,225 Q 124,240 124,255 Q 124,265 122,270 Q 118,268 118,255 Q 118,240 118,225 Z"/>

  <!-- Labels -->
  <text x="100" y="65" class="label" text-anchor="middle">TRAPS</text>
  <text x="100" y="105" class="label" text-anchor="middle">LATS</text>
  <text x="100" y="165" class="label" text-anchor="middle">GLUTES</text>
  <text x="85" y="200" class="label" text-anchor="middle">HAMS</text>
</svg>
`;

// Export pour utilisation dans l'application
if (typeof window !== 'undefined') {
    window.BODY_SVG_FRONT = BODY_SVG_FRONT;
    window.BODY_SVG_BACK = BODY_SVG_BACK;
}

// Pour Node.js / modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BODY_SVG_FRONT,
        BODY_SVG_BACK
    };
}
