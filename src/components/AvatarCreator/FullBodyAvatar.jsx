import React from 'react';
import { 
  renderAvatarFace, 
  renderAvatarHair, 
  renderAvatarAccessory, 
  DEFAULT_AVATAR_CONFIG 
} from './DynamicAvatar';

/**
 * Renderizador de Avatares de Cuerpo Completo e Ilustraciones Enriquecidas (Full-Body Avatar Engine)
 * Renderiza personajes de cuerpo entero con poses dinámicas, pedestales de ajedrez,
 * vestimenta superior, pantalones/faldas, zapatos, accesorios y piezas de ajedrez en mano.
 */

export const FullBodyAvatar = ({
  characterId = 'teen_gamer',
  config = null,
  height = 240,
  width = 180,
  className = "",
  showPedestal = true,
  interactive = true,
  emotion = 'confident'
}) => {
  // Renderizado para robots específicos de cuerpo entero
  if (characterId === 'spark' || characterId === 'sparky' || characterId === 'robot_spark') {
    return (
      <div className={`fullbody-avatar-wrap ${interactive ? 'interactive-hover' : ''} ${className}`} style={{ width, height }}>
        <svg viewBox="0 0 200 300" className="fullbody-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="sparkAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>

          <circle cx="100" cy="150" r="90" fill="url(#sparkAura)" />

          {showPedestal && (
            <g className="avatar-pedestal">
              <ellipse cx="100" cy="275" rx="70" ry="18" fill="#1e293b" opacity="0.3" />
              <ellipse cx="100" cy="268" rx="65" ry="14" fill="#334155" />
              <ellipse cx="100" cy="264" rx="60" ry="12" fill="#475569" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 60,264 L 75,258 L 125,258 L 140,264 Z" fill="#64748b" opacity="0.6" />
            </g>
          )}

          <g className="avatar-legs">
            <rect x="75" y="210" width="16" height="40" rx="8" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="109" y="210" width="16" height="40" rx="8" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <ellipse cx="83" cy="252" rx="14" ry="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
            <ellipse cx="117" cy="252" rx="14" ry="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          </g>

          <g className="avatar-torso">
            <rect x="65" y="130" width="70" height="85" rx="16" fill="url(#metalBody)" stroke="#78350f" strokeWidth="3" />
            <rect x="75" y="145" width="50" height="42" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
            <path d="M 92,154 Q 98,150 106,154 Q 108,162 102,168 L 110,180 L 90,180 L 93,168 Z" fill="#60a5fa" />
            <circle cx="98" cy="158" r="1.5" fill="#ffffff" />
            <circle cx="82" cy="198" r="4" fill="#ef4444" />
            <circle cx="100" cy="198" r="4" fill="#22c55e" />
            <circle cx="118" cy="198" r="4" fill="#3b82f6" />
          </g>

          <g className="avatar-arms">
            <path d="M 65,145 Q 40,165 48,190" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="48" cy="190" r="10" fill="#eab308" stroke="#78350f" strokeWidth="2" />
            <polygon points="46,182 52,188 44,192 50,198 40,198" fill="#38bdf8" />

            <path d="M 135,145 Q 160,130 156,105" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="156" cy="105" r="10" fill="#eab308" stroke="#78350f" strokeWidth="2" />
          </g>

          <g className="avatar-head">
            <line x1="100" y1="58" x2="100" y2="40" stroke="#64748b" strokeWidth="5" />
            <polygon points="100,20 92,34 102,34 94,48 108,32 98,32" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="62" y="58" width="76" height="66" rx="20" fill="url(#metalBody)" stroke="#78350f" strokeWidth="3" />
            <rect x="70" y="70" width="60" height="34" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="86" cy="86" r="7" fill="#38bdf8" />
            <circle cx="114" cy="86" r="7" fill="#38bdf8" />
            <circle cx="88" cy="84" r="2.5" fill="#ffffff" />
            <circle cx="116" cy="84" r="2.5" fill="#ffffff" />
            <path d="M 90,95 Q 100,101 110,95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="54" y="74" width="10" height="26" rx="4" fill="#475569" />
            <rect x="136" y="74" width="10" height="26" rx="4" fill="#475569" />
          </g>
        </svg>
      </div>
    );
  }

  // Renderizado para Avatar Personalizado de Cuerpo Completo (Modular Multicapa)
  const cfg = { ...DEFAULT_AVATAR_CONFIG, ...(config || {}) };
  const skin = cfg.skin || '#fed7aa';
  const shirtColor = cfg.shirtColor || '#2563eb';
  const shirtStyle = cfg.shirtStyle || 'hoodie';
  const pantsColor = cfg.pantsColor || '#1e3a8a';
  const pantsStyle = cfg.pantsStyle || 'jeans';
  const shoesColor = cfg.shoesColor || '#ffffff';
  const shoesStyle = cfg.shoesStyle || 'sneakers';
  const heldItem = cfg.heldItem || 'pawn_gold';

  // Renderizar Pantalones / Vestimenta Inferior
  const renderPants = () => {
    switch (pantsStyle) {
      case 'skirt':
        return (
          <g key="pants">
            <polygon points="70,195 130,195 142,230 58,230" fill={pantsColor} stroke="#0f172a" strokeWidth="1.5" />
            <line x1="85" y1="195" x2="80" y2="230" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="195" x2="100" y2="230" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
            <line x1="115" y1="195" x2="120" y2="230" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
            <rect x="76" y="230" width="16" height="26" fill={skin} />
            <rect x="108" y="230" width="16" height="26" fill={skin} />
          </g>
        );
      case 'shorts':
        return (
          <g key="pants">
            <rect x="72" y="195" width="25" height="30" rx="4" fill={pantsColor} />
            <rect x="103" y="195" width="25" height="30" rx="4" fill={pantsColor} />
            <rect x="76" y="225" width="18" height="30" fill={skin} />
            <rect x="106" y="225" width="18" height="30" fill={skin} />
          </g>
        );
      case 'armor_legs':
        return (
          <g key="pants">
            <rect x="73" y="195" width="24" height="60" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            <rect x="103" y="195" width="24" height="60" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            <circle cx="85" cy="220" r="5" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
            <circle cx="115" cy="220" r="5" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
          </g>
        );
      case 'cargo':
        return (
          <g key="pants">
            <rect x="73" y="195" width="24" height="60" rx="5" fill={pantsColor} />
            <rect x="103" y="195" width="24" height="60" rx="5" fill={pantsColor} />
            <rect x="69" y="215" width="8" height="16" rx="2" fill={pantsColor} stroke="#0f172a" strokeWidth="1" />
            <rect x="123" y="215" width="8" height="16" rx="2" fill={pantsColor} stroke="#0f172a" strokeWidth="1" />
          </g>
        );
      case 'sweatpants':
        return (
          <g key="pants">
            <rect x="73" y="195" width="24" height="60" rx="6" fill={pantsColor} />
            <rect x="103" y="195" width="24" height="60" rx="6" fill={pantsColor} />
            <line x1="74" y1="195" x2="74" y2="255" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="126" y1="195" x2="126" y2="255" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        );
      case 'formal':
      case 'jeans':
      default:
        return (
          <g key="pants">
            <rect x="73" y="195" width="24" height="60" rx="5" fill={pantsColor} />
            <rect x="103" y="195" width="24" height="60" rx="5" fill={pantsColor} />
            <line x1="85" y1="198" x2="85" y2="255" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
            <line x1="115" y1="198" x2="115" y2="255" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
          </g>
        );
    }
  };

  // Renderizar Calzado / Zapatos
  const renderShoes = () => {
    switch (shoesStyle) {
      case 'boots':
        return (
          <g key="shoes">
            <rect x="73" y="244" width="24" height="18" rx="4" fill={shoesColor} stroke="#0f172a" strokeWidth="1.5" />
            <rect x="103" y="244" width="24" height="18" rx="4" fill={shoesColor} stroke="#0f172a" strokeWidth="1.5" />
            <ellipse cx="85" cy="259" rx="14" ry="5" fill="#0f172a" />
            <ellipse cx="115" cy="259" rx="14" ry="5" fill="#0f172a" />
          </g>
        );
      case 'oxford':
        return (
          <g key="shoes">
            <ellipse cx="85" cy="256" rx="15" ry="6" fill={shoesColor} stroke="#0f172a" strokeWidth="1.5" />
            <ellipse cx="115" cy="256" rx="15" ry="6" fill={shoesColor} stroke="#0f172a" strokeWidth="1.5" />
            <rect x="78" y="253" width="6" height="3" fill="#fbbf24" />
            <rect x="108" y="253" width="6" height="3" fill="#fbbf24" />
          </g>
        );
      case 'knight_boots':
        return (
          <g key="shoes">
            <path d="M 72,242 L 96,242 L 98,258 L 70,258 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <path d="M 104,242 L 128,242 L 130,258 L 102,258 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <ellipse cx="84" cy="258" rx="15" ry="5" fill="#334155" />
            <ellipse cx="116" cy="258" rx="15" ry="5" fill="#334155" />
          </g>
        );
      case 'sneakers':
      default:
        return (
          <g key="shoes">
            <ellipse cx="85" cy="254" rx="14" ry="6" fill={shoesColor} stroke="#cbd5e1" strokeWidth="1.5" />
            <ellipse cx="115" cy="254" rx="14" ry="6" fill={shoesColor} stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M 75,252 Q 85,248 95,252" fill="none" stroke={shirtColor} strokeWidth="3" />
            <path d="M 105,252 Q 115,248 125,252" fill="none" stroke={shirtColor} strokeWidth="3" />
          </g>
        );
    }
  };

  // Renderizar Torso / Vestimenta Superior
  const renderTorso = () => {
    switch (shirtStyle) {
      case 'blazer':
        return (
          <g key="torso">
            <rect x="62" y="122" width="76" height="80" rx="16" fill={shirtColor} stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="100,122 90,165 110,165" fill="#f8fafc" />
            <polygon points="100,132 97,150 103,150" fill="#dc2626" />
          </g>
        );
      case 'vest':
        return (
          <g key="torso">
            <rect x="62" y="122" width="76" height="80" rx="16" fill="#334155" />
            <polygon points="100,122 80,202 120,202" fill={shirtColor} />
            <circle cx="100" cy="150" r="2.5" fill="#fbbf24" />
            <circle cx="100" cy="165" r="2.5" fill="#fbbf24" />
            <circle cx="100" cy="180" r="2.5" fill="#fbbf24" />
          </g>
        );
      case 'royal_robe':
        return (
          <g key="torso">
            <rect x="58" y="120" width="84" height="84" rx="16" fill={shirtColor} stroke="#d97706" strokeWidth="2.5" />
            <circle cx="100" cy="140" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <path d="M 75,120 L 100,160 L 125,120" fill="none" stroke="#fbbf24" strokeWidth="3" />
          </g>
        );
      case 'armor':
        return (
          <g key="torso">
            <rect x="60" y="122" width="80" height="80" rx="14" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
            <rect x="76" y="140" width="48" height="42" rx="6" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
            <polygon points="100,148 94,162 106,162" fill="#d97706" />
          </g>
        );
      case 'cape':
        return (
          <g key="torso">
            <path d="M 50,126 L 30,240 L 170,240 L 150,126 Z" fill="#dc2626" opacity="0.9" />
            <rect x="62" y="122" width="76" height="80" rx="16" fill={shirtColor} />
            <circle cx="70" cy="130" r="5" fill="#fbbf24" />
            <circle cx="130" cy="130" r="5" fill="#fbbf24" />
          </g>
        );
      case 'hoodie':
      case 'tshirt':
      default:
        return (
          <g key="torso">
            <rect x="62" y="122" width="76" height="80" rx="16" fill={shirtColor} stroke="#0f172a" strokeWidth="1.5" />
            <path d="M 78,122 Q 100,138 122,122" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
            <circle cx="100" cy="155" r="13" fill="#ffffff" opacity="0.9" />
            <polygon points="100,146 95,158 105,158" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <line x1="97" y1="162" x2="103" y2="162" stroke="#d97706" strokeWidth="2" />
          </g>
        );
    }
  };

  // Renderizar Objeto en la Mano
  const renderHeldItem = () => {
    switch (heldItem) {
      case 'knight_piece':
        return (
          <g key="item">
            <path d="M 139,152 Q 145,147 151,152 Q 153,160 147,165 L 153,175 L 137,175 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <circle cx="143" cy="155" r="1.5" fill="#ffffff" />
          </g>
        );
      case 'queen_piece':
        return (
          <g key="item">
            <polygon points="142,150 134,166 150,166" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" />
            <circle cx="137" cy="150" r="2" fill="#fde047" />
            <circle cx="142" cy="148" r="2" fill="#fde047" />
            <circle cx="147" cy="150" r="2" fill="#fde047" />
          </g>
        );
      case 'trophy_cup':
        return (
          <g key="item">
            <polygon points="142,152 135,164 149,164" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
            <rect x="139" y="164" width="6" height="8" fill="#d97706" />
            <rect x="135" y="172" width="14" height="4" rx="1" fill="#78350f" />
            <path d="M 134,156 Q 130,160 134,164" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <path d="M 150,156 Q 154,160 150,164" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        );
      case 'pawn_gold':
      default:
        return (
          <g key="item">
            <polygon points="142,154 136,166 148,166" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="142" cy="152" r="3" fill="#fef08a" />
          </g>
        );
    }
  };

  return (
    <div className={`fullbody-avatar-wrap ${interactive ? 'interactive-hover' : ''} ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 200 300" className="fullbody-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={shirtColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={shirtColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="150" r="95" fill="url(#playerGlow)" />

        {/* Pedestal de Ajedrez */}
        {showPedestal && (
          <g className="avatar-pedestal">
            <ellipse cx="100" cy="272" rx="68" ry="16" fill="#0f172a" opacity="0.3" />
            <ellipse cx="100" cy="265" rx="62" ry="13" fill="#1e293b" stroke={shirtColor} strokeWidth="2" />
            <path d="M 65,265 L 78,258 L 122,258 L 135,265 Z" fill="#334155" />
          </g>
        )}

        {/* 1. Piernas y Pantalones */}
        <g className="avatar-legs">
          {renderPants()}
          {renderShoes()}
        </g>

        {/* 2. Cuello y Torso */}
        <g className="avatar-torso">
          {/* Cuello anatómico integrado que conecta la barbilla (y=98) al interior de la camiseta (y=135) */}
          <rect x="90" y="98" width="20" height="36" rx="5" fill={skin} />
          {renderTorso()}
        </g>

        {/* 3. Cabeza, Rostro, Cabello y Accesorios (Proporción y Escala Perfectas) */}
        <g className="avatar-head" transform="translate(100, 88) scale(1.70) translate(-50, -52)">
          {renderAvatarFace(cfg)}
          {renderAvatarHair(cfg)}
          {renderAvatarAccessory(cfg)}
        </g>

        {/* 4. Brazos y Objeto en Mano */}
        <g className="avatar-arms">
          <path d="M 64,132 Q 38,155 52,180" fill="none" stroke={shirtColor} strokeWidth="14" strokeLinecap="round" />
          <circle cx="52" cy="180" r="8" fill={skin} />

          <path d="M 136,132 Q 158,150 145,172" fill="none" stroke={shirtColor} strokeWidth="14" strokeLinecap="round" />
          <circle cx="145" cy="172" r="8" fill={skin} />
          {renderHeldItem()}
        </g>
      </svg>
    </div>
  );
};
