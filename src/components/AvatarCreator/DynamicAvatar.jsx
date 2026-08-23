import React from 'react';

/**
 * Renderizador Vectorial Modular Multicapa de Avatares (Dynamic Avatar Engine)
 * Permite combinaciones infinitas de piel, cabello, expresiones, vestimenta superior,
 * vestimenta inferior, calzado, accesorios, objetos en mano y fondos.
 */

export const SKIN_TONES = [
  { id: '#fed7aa', label: 'Claro Cálido' },
  { id: '#fcd34d', label: 'Dorado' },
  { id: '#fbcfe8', label: 'Rosado' },
  { id: '#f59e0b', label: 'Bronceado' },
  { id: '#b45309', label: 'Moreno Cálido' },
  { id: '#78350f', label: 'Moreno Oscuro' },
  { id: '#38bdf8', label: 'Cibernético Azul' },
  { id: '#c084fc', label: 'Fantasía Púrpura' }
];

export const HAIR_COLORS = [
  { id: '#1e293b', label: 'Negro Azabache' },
  { id: '#451a03', label: 'Castaño Oscuro' },
  { id: '#78350f', label: 'Castaño Claro' },
  { id: '#fbbf24', label: 'Rubio Dorado' },
  { id: '#dc2626', label: 'Pelirrojo' },
  { id: '#cbd5e1', label: 'Plata / Canas' },
  { id: '#3b82f6', label: 'Azul Neón' },
  { id: '#ec4899', label: 'Rosa Gamer' }
];

export const SHIRT_COLORS = [
  { id: '#2563eb', label: 'Azul Real' },
  { id: '#dc2626', label: 'Rojo Campeón' },
  { id: '#16a34a', label: 'Verde Esmeralda' },
  { id: '#d97706', label: 'Oro Maestro' },
  { id: '#9333ea', label: 'Púrpura Real' },
  { id: '#0f172a', label: 'Negro Carbón' },
  { id: '#0284c7', label: 'Cian Deportivo' },
  { id: '#f97316', label: 'Naranja Fuego' },
  { id: '#ffffff', label: 'Blanco Puro' }
];

export const PANTS_COLORS = [
  { id: '#1e3a8a', label: 'Azul Denim / Marino' },
  { id: '#0f172a', label: 'Negro Azabache' },
  { id: '#475569', label: 'Gris Torneo' },
  { id: '#b45309', label: 'Caqui / Tierra' },
  { id: '#dc2626', label: 'Rojo Deportivo' },
  { id: '#15803d', label: 'Verde Militar' },
  { id: '#7e22ce', label: 'Púrpura Mágico' },
  { id: '#f8fafc', label: 'Blanco Atlético' }
];

export const SHOES_COLORS = [
  { id: '#ffffff', label: 'Blanco Clásico' },
  { id: '#0f172a', label: 'Negro Carbón' },
  { id: '#dc2626', label: 'Rojo Fuego' },
  { id: '#2563eb', label: 'Azul Eléctrico' },
  { id: '#d97706', label: 'Cuero Natural' },
  { id: '#f59e0b', label: 'Dorado Campeón' }
];

export const DEFAULT_AVATAR_CONFIG = {
  skin: '#fed7aa',
  hairStyle: 'messy',
  hairColor: '#451a03',
  eyeStyle: 'happy',
  shirtStyle: 'hoodie',
  shirtColor: '#2563eb',
  pantsStyle: 'jeans',
  pantsColor: '#1e3a8a',
  shoesStyle: 'sneakers',
  shoesColor: '#ffffff',
  accessory: 'headphones',
  heldItem: 'pawn_gold',
  background: 'blue_sky'
};

export const DynamicAvatar = ({ config = DEFAULT_AVATAR_CONFIG, size = 64, className = "" }) => {
  const cfg = { ...DEFAULT_AVATAR_CONFIG, ...(config || {}) };

  // Renderizador de Fondos
  const renderBackground = () => {
    switch (cfg.background) {
      case 'night_stars':
        return (
          <>
            <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            <circle cx="25" cy="20" r="1" fill="#ffffff" />
            <circle cx="75" cy="25" r="1.5" fill="#fde047" />
            <circle cx="80" cy="40" r="1" fill="#ffffff" />
            <circle cx="20" cy="45" r="1.2" fill="#ffffff" />
          </>
        );
      case 'cyber_grid':
        return (
          <>
            <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#4338ca" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#4338ca" strokeWidth="1" strokeDasharray="3,3" />
          </>
        );
      case 'parchment_wood':
        return (
          <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
        );
      case 'royal_castle':
        return (
          <circle cx="50" cy="50" r="48" fill="#fae8ff" stroke="#9333ea" strokeWidth="2.5" />
        );
      case 'blue_sky':
      default:
        return (
          <circle cx="50" cy="50" r="48" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
        );
    }
  };

  // Renderizador de Vestimenta Superior (Ropa)
  const renderShirt = () => {
    switch (cfg.shirtStyle) {
      case 'hoodie':
        return (
          <g>
            <path d="M 20,95 Q 50,70 80,95 Z" fill={cfg.shirtColor} />
            <polygon points="50,75 44,95 56,95" fill="#ffffff" opacity="0.3" />
            <path d="M 32,74 Q 50,86 68,74" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          </g>
        );
      case 'blazer':
        return (
          <g>
            <path d="M 20,95 Q 50,70 80,95 Z" fill={cfg.shirtColor} />
            <polygon points="50,73 40,95 60,95" fill="#ffffff" />
            <polygon points="50,75 47,88 53,88" fill="#dc2626" />
          </g>
        );
      case 'vest':
        return (
          <g>
            <path d="M 20,95 Q 50,70 80,95 Z" fill="#334155" />
            <path d="M 30,95 L 42,74 L 58,74 L 70,95 Z" fill={cfg.shirtColor} />
            <circle cx="50" cy="80" r="1.5" fill="#fde047" />
            <circle cx="50" cy="87" r="1.5" fill="#fde047" />
          </g>
        );
      case 'royal_robe':
        return (
          <g>
            <path d="M 18,95 Q 50,68 82,95 Z" fill={cfg.shirtColor} stroke="#d97706" strokeWidth="2.5" />
            <circle cx="50" cy="77" r="3.5" fill="#f59e0b" />
          </g>
        );
      case 'armor':
        return (
          <g>
            <path d="M 20,95 Q 50,70 80,95 Z" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
            <rect x="40" y="75" width="20" height="20" rx="3" fill="#cbd5e1" />
            <circle cx="50" cy="84" r="2.5" fill="#d97706" />
          </g>
        );
      case 'polo':
        return (
          <g>
            <path d="M 22,95 Q 50,72 78,95 Z" fill={cfg.shirtColor} />
            <polygon points="50,72 40,79 60,79" fill="#f8fafc" />
            <circle cx="50" cy="83" r="1.2" fill="#475569" />
          </g>
        );
      case 'bomber':
        return (
          <g>
            <path d="M 20,95 Q 50,69 80,95 Z" fill={cfg.shirtColor} stroke="#0f172a" strokeWidth="2" />
            <line x1="50" y1="73" x2="50" y2="95" stroke="#f59e0b" strokeWidth="2.5" />
          </g>
        );
      case 'cape':
        return (
          <g>
            <path d="M 15,95 Q 50,64 85,95 Z" fill="#dc2626" />
            <path d="M 24,95 Q 50,74 76,95 Z" fill={cfg.shirtColor} />
            <circle cx="50" cy="76" r="3" fill="#fbbf24" />
          </g>
        );
      case 'tshirt':
      default:
        return (
          <g>
            <path d="M 22,95 Q 50,73 78,95 Z" fill={cfg.shirtColor} />
            <path d="M 40,75 Q 50,82 60,75" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
          </g>
        );
    }
  };

  // Renderizador de Rostro y Ojos
  const renderFace = () => {
    return (
      <g>
        {/* Cuello y Cabeza */}
        <rect x="45" y="65" width="10" height="12" fill={cfg.skin} />
        <circle cx="50" cy="52" r="22" fill={cfg.skin} />

        {/* Expresión / Ojos */}
        {cfg.eyeStyle === 'glasses' && (
          <g>
            <circle cx="42" cy="50" r="6" fill="none" stroke="#1e293b" strokeWidth="2" />
            <circle cx="58" cy="50" r="6" fill="none" stroke="#1e293b" strokeWidth="2" />
            <line x1="48" y1="50" x2="52" y2="50" stroke="#1e293b" strokeWidth="2" />
            <circle cx="42" cy="50" r="2" fill="#1e293b" />
            <circle cx="58" cy="50" r="2" fill="#1e293b" />
            <path d="M 46,63 Q 50,67 54,63" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {cfg.eyeStyle === 'sunglasses' && (
          <g>
            <rect x="34" y="46" width="14" height="9" rx="2" fill="#0f172a" />
            <rect x="52" y="46" width="14" height="9" rx="2" fill="#0f172a" />
            <line x1="48" y1="50" x2="52" y2="50" stroke="#0f172a" strokeWidth="2" />
            <path d="M 46,64 Q 50,68 54,64" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {cfg.eyeStyle === 'wink' && (
          <g>
            <circle cx="42" cy="50" r="3" fill="#1e293b" />
            <path d="M 55,50 Q 58,46 62,50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 45,62 Q 50,68 55,62" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {cfg.eyeStyle === 'determined' && (
          <g>
            <line x1="38" y1="46" x2="45" y2="48" stroke="#1e293b" strokeWidth="2" />
            <line x1="62" y1="46" x2="55" y2="48" stroke="#1e293b" strokeWidth="2" />
            <circle cx="43" cy="51" r="2.5" fill="#1e293b" />
            <circle cx="57" cy="51" r="2.5" fill="#1e293b" />
            <line x1="46" y1="63" x2="54" y2="63" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {cfg.eyeStyle === 'cyber_visor' && (
          <g>
            <rect x="34" y="46" width="32" height="8" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <circle cx="42" cy="50" r="1.5" fill="#ffffff" />
            <circle cx="58" cy="50" r="1.5" fill="#ffffff" />
            <path d="M 46,63 Q 50,66 54,63" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {(cfg.eyeStyle === 'happy' || !cfg.eyeStyle || cfg.eyeStyle === 'focused') && (
          <g>
            <circle cx="43" cy="50" r="3" fill="#1e293b" />
            <circle cx="57" cy="50" r="3" fill="#1e293b" />
            <path d="M 45,62 Q 50,68 55,62" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };

  // Renderizador de Cabello
  const renderHair = () => {
    switch (cfg.hairStyle) {
      case 'short':
        return (
          <path d="M 26,44 Q 30,22 50,22 Q 70,22 74,44 Q 65,30 50,30 Q 35,30 26,44 Z" fill={cfg.hairColor} />
        );
      case 'ponytail':
        return (
          <g>
            <path d="M 25,42 Q 22,20 50,20 Q 78,20 75,42" fill={cfg.hairColor} />
            <path d="M 72,30 Q 88,45 80,68" fill="none" stroke={cfg.hairColor} strokeWidth="6" strokeLinecap="round" />
          </g>
        );
      case 'curly':
        return (
          <g fill={cfg.hairColor}>
            <circle cx="34" cy="34" r="10" />
            <circle cx="50" cy="28" r="11" />
            <circle cx="66" cy="34" r="10" />
            <circle cx="26" cy="44" r="8" />
            <circle cx="74" cy="44" r="8" />
          </g>
        );
      case 'afro':
        return (
          <circle cx="50" cy="44" r="28" fill={cfg.hairColor} />
        );
      case 'bun':
        return (
          <g fill={cfg.hairColor}>
            <circle cx="50" cy="22" r="11" />
            <path d="M 25,44 Q 24,28 50,26 Q 76,28 75,44" />
          </g>
        );
      case 'crest':
        return (
          <path d="M 44,40 L 50,14 L 56,40 Z" fill={cfg.hairColor} />
        );
      case 'bald_senior':
        return (
          <path d="M 24,48 Q 20,32 35,26 Q 65,26 76,32 Q 78,48 76,48" fill="none" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
        );
      case 'long':
        return (
          <g fill={cfg.hairColor}>
            <path d="M 25,44 Q 24,20 50,20 Q 76,20 75,44" />
            <path d="M 28,46 L 25,75 L 34,70 L 32,46 Z" />
            <path d="M 72,46 L 75,75 L 66,70 L 68,46 Z" />
          </g>
        );
      case 'messy':
      default:
        return (
          <path d="M 24,44 Q 30,16 55,20 Q 76,18 76,42 Q 62,28 24,44 Z" fill={cfg.hairColor} />
        );
    }
  };

  // Renderizador de Accesorios y Sombreros
  const renderAccessory = () => {
    switch (cfg.accessory) {
      case 'crown':
        return (
          <g>
            <path d="M 30,34 L 35,18 L 44,28 L 50,14 L 56,28 L 65,18 L 70,34 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="50" cy="12" r="2.5" fill="#ef4444" />
            <circle cx="35" cy="16" r="2" fill="#3b82f6" />
            <circle cx="65" cy="16" r="2" fill="#3b82f6" />
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path d="M 26,48 Q 24,18 50,18 Q 76,18 74,48" fill="none" stroke="#0f172a" strokeWidth="3.5" />
            <rect x="22" y="42" width="6" height="14" rx="3" fill="#3b82f6" />
            <rect x="72" y="42" width="6" height="14" rx="3" fill="#3b82f6" />
          </g>
        );
      case 'cap_back':
        return (
          <g>
            <path d="M 26,38 Q 50,22 74,38 Z" fill="#dc2626" />
            <rect x="24" y="36" width="52" height="6" rx="2" fill="#991b1b" />
          </g>
        );
      case 'headband':
        return (
          <path d="M 26,36 Q 50,30 74,36" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        );
      case 'monocle':
        return (
          <g>
            <circle cx="58" cy="50" r="7" fill="none" stroke="#d97706" strokeWidth="1.5" />
            <line x1="65" y1="50" x2="68" y2="70" stroke="#d97706" strokeWidth="1" />
          </g>
        );
      case 'medal':
        return (
          <g>
            <path d="M 45,74 L 50,86 L 55,74" fill="#3b82f6" />
            <circle cx="50" cy="87" r="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <circle cx="50" cy="87" r="2" fill="#fde047" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {renderBackground()}
      {renderShirt()}
      {renderFace()}
      {renderHair()}
      {renderAccessory()}
    </svg>
  );
};
