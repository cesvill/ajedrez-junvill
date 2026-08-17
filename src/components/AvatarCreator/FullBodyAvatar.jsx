import React from 'react';

/**
 * Renderizador de Avatares de Cuerpo Completo e Ilustraciones Enriquecidas (Full-Body Avatar Engine)
 * Renderiza personajes de cuerpo entero con poses dinámicas, pedestales de ajedrez y efectos visuales.
 */

export const FullBodyAvatar = ({
  characterId = 'teen_gamer',
  config = null,
  height = 240,
  width = 180,
  className = "",
  showPedestal = true,
  interactive = true,
  emotion = 'confident' // 'confident' | 'happy' | 'thinking' | 'victory'
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
            <linearGradient id="electricBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Aura de energía */}
          <circle cx="100" cy="150" r="90" fill="url(#sparkAura)" />

          {/* Pedestal de Ajedrez */}
          {showPedestal && (
            <g className="avatar-pedestal">
              <ellipse cx="100" cy="275" rx="70" ry="18" fill="#1e293b" opacity="0.3" />
              <ellipse cx="100" cy="268" rx="65" ry="14" fill="#334155" />
              <ellipse cx="100" cy="264" rx="60" ry="12" fill="#475569" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 60,264 L 75,258 L 125,258 L 140,264 Z" fill="#64748b" opacity="0.6" />
            </g>
          )}

          {/* Piernas / Ruedas mecánicas de Sparky */}
          <g className="avatar-legs">
            <rect x="75" y="210" width="16" height="40" rx="8" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="109" y="210" width="16" height="40" rx="8" fill="#64748b" stroke="#334155" strokeWidth="2" />
            {/* Pies / Orugas magnéticas */}
            <ellipse cx="83" cy="252" rx="14" ry="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
            <ellipse cx="117" cy="252" rx="14" ry="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          </g>

          {/* Torso Mecánico con Núcleo de Ajedrez */}
          <g className="avatar-torso">
            <rect x="65" y="130" width="70" height="85" rx="16" fill="url(#metalBody)" stroke="#78350f" strokeWidth="3" />
            {/* Pantalla en el pecho con caballo de ajedrez brillante */}
            <rect x="75" y="145" width="50" height="42" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
            <path d="M 92,154 Q 98,150 106,154 Q 108,162 102,168 L 110,180 L 90,180 L 93,168 Z" fill="#60a5fa" />
            <circle cx="98" cy="158" r="1.5" fill="#ffffff" />
            {/* Botones y medidores */}
            <circle cx="82" cy="198" r="4" fill="#ef4444" />
            <circle cx="100" cy="198" r="4" fill="#22c55e" />
            <circle cx="118" cy="198" r="4" fill="#3b82f6" />
          </g>

          {/* Brazos dinámicos */}
          <g className="avatar-arms">
            {/* Brazo izquierdo sosteniendo rayo */}
            <path d="M 65,145 Q 40,165 48,190" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="48" cy="190" r="10" fill="#eab308" stroke="#78350f" strokeWidth="2" />
            <polygon points="46,182 52,188 44,192 50,198 40,198" fill="#38bdf8" />

            {/* Brazo derecho saludando */}
            <path d="M 135,145 Q 160,130 156,105" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="156" cy="105" r="10" fill="#eab308" stroke="#78350f" strokeWidth="2" />
          </g>

          {/* Cabeza de Robot con Antena de Relámpago */}
          <g className="avatar-head">
            {/* Antena */}
            <line x1="100" y1="58" x2="100" y2="40" stroke="#64748b" strokeWidth="5" />
            <polygon points="100,20 92,34 102,34 94,48 108,32 98,32" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            {/* Cabeza cúbica redondeada */}
            <rect x="62" y="58" width="76" height="66" rx="20" fill="url(#metalBody)" stroke="#78350f" strokeWidth="3" />
            {/* Visor digital */}
            <rect x="70" y="70" width="60" height="34" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* Ojos expresivos de luz */}
            <circle cx="86" cy="86" r="7" fill="#38bdf8" />
            <circle cx="114" cy="86" r="7" fill="#38bdf8" />
            <circle cx="88" cy="84" r="2.5" fill="#ffffff" />
            <circle cx="116" cy="84" r="2.5" fill="#ffffff" />
            {/* Sonrisa digital */}
            <path d="M 90,95 Q 100,101 110,95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Auriculares laterales */}
            <rect x="54" y="74" width="10" height="26" rx="4" fill="#475569" />
            <rect x="136" y="74" width="10" height="26" rx="4" fill="#475569" />
          </g>
        </svg>
      </div>
    );
  }

  // Renderizado para Qwerty (Robot Retro)
  if (characterId === 'qwerty' || characterId === 'robot_retro') {
    return (
      <div className={`fullbody-avatar-wrap ${interactive ? 'interactive-hover' : ''} ${className}`} style={{ width, height }}>
        <svg viewBox="0 0 200 300" className="fullbody-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="qwertyBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {showPedestal && (
            <ellipse cx="100" cy="268" rx="60" ry="14" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
          )}
          {/* Cuerpo Retro */}
          <rect x="68" y="140" width="64" height="75" rx="14" fill="url(#qwertyBody)" stroke="#0369a1" strokeWidth="3" />
          {/* Teclado en el pecho */}
          <rect x="76" y="155" width="48" height="30" rx="4" fill="#0f172a" />
          <line x1="82" y1="165" x2="118" y2="165" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          <line x1="82" y1="175" x2="118" y2="175" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
          {/* Orugas */}
          <rect x="60" y="215" width="80" height="32" rx="12" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="76" cy="231" r="8" fill="#64748b" />
          <circle cx="100" cy="231" r="8" fill="#64748b" />
          <circle cx="124" cy="231" r="8" fill="#64748b" />
          {/* Cabeza Monitor CRT */}
          <rect x="58" y="55" width="84" height="72" rx="16" fill="url(#qwertyBody)" stroke="#0369a1" strokeWidth="3" />
          <rect x="68" y="66" width="64" height="48" rx="8" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
          <text x="75" y="98" fill="#22d3ee" fontFamily="monospace" fontSize="22" fontWeight="bold">&gt; _ &lt;</text>
          {/* Antena espiral */}
          <path d="M 100,55 Q 90,35 105,25 Q 115,15 100,8" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="8" r="6" fill="#ef4444" />
        </svg>
      </div>
    );
  }

  // Renderizado para Entrenador Don Aurelio (Cuerpo Completo de Gran Maestro Sabio)
  if (characterId === 'coach_aurelio') {
    return (
      <div className={`fullbody-avatar-wrap ${interactive ? 'interactive-hover' : ''} ${className}`} style={{ width, height }}>
        <svg viewBox="0 0 200 300" className="fullbody-svg" preserveAspectRatio="xMidYMid meet">
          {showPedestal && (
            <ellipse cx="100" cy="270" rx="65" ry="14" fill="#451a03" stroke="#d97706" strokeWidth="2" />
          )}
          {/* Túnica / Traje elegante */}
          <path d="M 60,130 L 45,260 L 155,260 L 140,130 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          <path d="M 85,130 L 95,260 L 105,260 L 115,130 Z" fill="#78350f" opacity="0.4" />
          <polygon points="100,130 92,160 108,160" fill="#dc2626" />
          {/* Brazos y bastón de maestro */}
          <path d="M 60,140 Q 40,180 50,210" fill="none" stroke="#92400e" strokeWidth="14" strokeLinecap="round" />
          <circle cx="50" cy="210" r="8" fill="#fed7aa" />
          {/* Bastón de roble con pieza de rey arriba */}
          <line x1="48" y1="120" x2="48" y2="265" stroke="#451a03" strokeWidth="5" strokeLinecap="round" />
          <circle cx="48" cy="116" r="10" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          <path d="M 44,110 L 52,110 M 48,106 L 48,114" stroke="#78350f" strokeWidth="2" />
          {/* Cabeza y rostro de Don Aurelio */}
          <circle cx="100" cy="80" r="32" fill="#fed7aa" stroke="#d97706" strokeWidth="1.5" />
          {/* Cabello canoso lateral */}
          <path d="M 68,78 Q 65,52 85,42 Q 100,40 115,42 Q 135,52 132,78" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
          {/* Barba canosa frondosa */}
          <path d="M 78,85 Q 100,125 122,85 Q 100,110 78,85 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Gafas doradas */}
          <circle cx="88" cy="74" r="9" fill="none" stroke="#b45309" strokeWidth="2.5" />
          <circle cx="112" cy="74" r="9" fill="none" stroke="#b45309" strokeWidth="2.5" />
          <line x1="97" y1="74" x2="103" y2="74" stroke="#b45309" strokeWidth="2.5" />
          <circle cx="88" cy="74" r="3" fill="#451a03" />
          <circle cx="112" cy="74" r="3" fill="#451a03" />
        </svg>
      </div>
    );
  }

  // Renderizado para Estudiante / Avatar Personalizado de Cuerpo Completo
  const skin = config?.skin || '#fed7aa';
  const shirtColor = config?.shirtColor || '#2563eb';
  const hairColor = config?.hairColor || '#451a03';

  return (
    <div className={`fullbody-avatar-wrap ${interactive ? 'interactive-hover' : ''} ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 200 300" className="fullbody-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={shirtColor} stopOpacity="0.3" />
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

        {/* Piernas / Pantalón y Zapatillas */}
        <g className="avatar-legs">
          <rect x="74" y="195" width="22" height="60" rx="6" fill="#1e293b" />
          <rect x="104" y="195" width="22" height="60" rx="6" fill="#1e293b" />
          {/* Zapatillas deportivas con suela blanca */}
          <ellipse cx="85" cy="254" rx="14" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="115" cy="254" rx="14" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 75,252 Q 85,248 95,252" fill="none" stroke={shirtColor} strokeWidth="3" />
          <path d="M 105,252 Q 115,248 125,252" fill="none" stroke={shirtColor} strokeWidth="3" />
        </g>

        {/* Torso con Sudadera Deportiva Junvill */}
        <g className="avatar-torso">
          <rect x="62" y="125" width="76" height="78" rx="16" fill={shirtColor} stroke="#0f172a" strokeWidth="2" />
          {/* Capucha / Cuello */}
          <path d="M 80,125 Q 100,140 120,125" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.6" />
          {/* Insignia / Escudo de Ajedrez en el pecho */}
          <circle cx="100" cy="155" r="14" fill="#ffffff" opacity="0.9" />
          <polygon points="100,146 95,158 105,158" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <line x1="97" y1="162" x2="103" y2="162" stroke="#d97706" strokeWidth="2" />
        </g>

        {/* Brazos dinámicos sosteniendo una pieza */}
        <g className="avatar-arms">
          {/* Brazo izquierdo en jarra */}
          <path d="M 64,135 Q 40,160 55,185" fill="none" stroke={shirtColor} strokeWidth="14" strokeLinecap="round" />
          <circle cx="55" cy="185" r="8" fill={skin} />

          {/* Brazo derecho sosteniendo pieza de Dama dorada */}
          <path d="M 136,135 Q 155,155 142,175" fill="none" stroke={shirtColor} strokeWidth="14" strokeLinecap="round" />
          <circle cx="142" cy="175" r="8" fill={skin} />
          {/* Dama dorada en la mano */}
          <polygon points="142,156 136,168 148,168" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="142" cy="154" r="2.5" fill="#fef08a" />
        </g>

        {/* Cabeza y Rostro */}
        <g className="avatar-head">
          <circle cx="100" cy="75" r="30" fill={skin} />
          {/* Cabello estilizado */}
          <path d="M 68,70 Q 72,32 100,32 Q 128,32 132,70 Q 115,50 100,52 Q 85,50 68,70 Z" fill={hairColor} />
          {/* Ojos grandes expresivos */}
          <ellipse cx="88" cy="72" rx="4.5" ry="6" fill="#1e293b" />
          <ellipse cx="112" cy="72" rx="4.5" ry="6" fill="#1e293b" />
          <circle cx="89.5" cy="70" r="1.8" fill="#ffffff" />
          <circle cx="113.5" cy="70" r="1.8" fill="#ffffff" />
          {/* Cejas dinámicas */}
          <path d="M 82,63 Q 88,60 94,63" fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 106,63 Q 112,60 118,63" fill="none" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Sonrisa alegre */}
          <path d="M 90,88 Q 100,98 110,88" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Rubor en las mejillas */}
          <circle cx="82" cy="82" r="4" fill="#f43f5e" opacity="0.3" />
          <circle cx="118" cy="82" r="4" fill="#f43f5e" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};
