import React from 'react';

/**
 * Catálogo de Bots y Oponentes Virtuales
 * Divididos en Robots Futuristas, Mascotas del Zoo y Personalidades Humanas
 */

export const BOT_CATEGORIES = [
  { id: 'robots', label: 'Robots Futuristas' },
  { id: 'zoo', label: 'Robots del Zoológico' },
  { id: 'personalidades', label: 'Personalidades y Maestros' }
];

export const BOT_ROSTER = [
  // --- ROBOTS ---
  {
    id: 'qwerty',
    name: 'Qwerty',
    category: 'robots',
    elo: 400,
    title: 'Robot Explorador',
    avatarType: 'robot_retro',
    color: '#38bdf8',
    greeting: '¡Beep boop! Estoy aprendiendo ajedrez. ¿Quieres jugar una partida amistosa?',
    style: 'Comete deslices tácticos y le encanta mover los peones laterales.',
    difficultyLevel: 1
  },
  {
    id: 'cosmo',
    name: 'Cosmo-7',
    category: 'robots',
    elo: 700,
    title: 'Androide Lunar',
    avatarType: 'robot_cosmo',
    color: '#818cf8',
    greeting: 'Sistemas orbitales en línea. Analizando apertura en 3, 2, 1...',
    style: 'Desarrolla piezas rápido pero a veces pasa por alto jaques dobles.',
    difficultyLevel: 2
  },
  {
    id: 'spark',
    name: 'Sparky',
    category: 'robots',
    elo: 1050,
    title: 'Robot Electrostático',
    avatarType: 'robot_spark',
    color: '#fbbf24',
    greeting: '¡Cuidado con las chispas! Mis caballos saltan a la velocidad del rayo.',
    style: 'Juego agresivo y dinámico con piezas menores.',
    difficultyLevel: 3
  },
  {
    id: 'titan',
    name: 'Titán Mecánico',
    category: 'robots',
    elo: 1450,
    title: 'Defensor Acorazado',
    avatarType: 'robot_titan',
    color: '#f87171',
    greeting: 'Estructura de peones reforzada. Penetrar mi defensa no será fácil.',
    style: 'Sólido, domina columnas abiertas y no regala material.',
    difficultyLevel: 4
  },
  {
    id: 'quantum',
    name: 'Quantum Core',
    category: 'robots',
    elo: 2000,
    title: 'Superordenador FIDE',
    avatarType: 'robot_quantum',
    color: '#a855f7',
    greeting: 'Calculando 4 millones de nodos por segundo. Que comience la partida.',
    style: 'Juego de Gran Maestro con precisión posicional implacable.',
    difficultyLevel: 5
  },

  // --- ZOOLÓGICO ---
  {
    id: 'monkey',
    name: 'Mono Travieso',
    category: 'zoo',
    elo: 500,
    title: 'Saltador de la Selva',
    avatarType: 'zoo_monkey',
    color: '#a16207',
    greeting: '¡Uu-aa-aa! Me encanta saltar con los caballos por todo el tablero.',
    style: 'Le fascina mover caballos y tentar con trampas simples.',
    difficultyLevel: 1
  },
  {
    id: 'shark',
    name: 'Tiburón Táctico',
    category: 'zoo',
    elo: 850,
    title: 'Cazador de Océano',
    avatarType: 'zoo_shark',
    color: '#0284c7',
    greeting: '¡Detecto una pieza desprotegida a kilómetros de distancia!',
    style: 'Caza cualquier pieza que quede en el aire sin defensa.',
    difficultyLevel: 2
  },
  {
    id: 'elephant',
    name: 'Elefante Gigante',
    category: 'zoo',
    elo: 1200,
    title: 'Fuerza Central',
    avatarType: 'zoo_elephant',
    color: '#64748b',
    greeting: 'Paso firme y centro blindado. ¡Mis torres marchan hacia adelante!',
    style: 'Juego sólido con peones centrales y torres pesadas.',
    difficultyLevel: 3
  },
  {
    id: 'owl',
    name: 'Búho Sabio',
    category: 'zoo',
    elo: 1600,
    title: 'Visionario Nocturno',
    avatarType: 'zoo_owl',
    color: '#dc2626',
    greeting: 'La paciencia y la profilaxis revelan el camino a la victoria.',
    style: 'Calculador profundo, detecta debilidades estructurales a largo plazo.',
    difficultyLevel: 4
  },
  {
    id: 'tiger',
    name: 'Tigre de Bengala',
    category: 'zoo',
    elo: 1950,
    title: 'Furia de Ataque',
    avatarType: 'zoo_tiger',
    color: '#ea580c',
    greeting: '¡Rrrr! Voy directo por tu Rey sin importar los sacrificios.',
    style: 'Ataques feroces sobre el enroque con sacrificios de pieza.',
    difficultyLevel: 5
  },

  // --- PERSONALIDADES HUMANAS ---
  {
    id: 'mateo_kid',
    name: 'Mateo',
    category: 'personalidades',
    elo: 450,
    title: 'Pequeño Campeón',
    avatarType: 'human_boy',
    color: '#3b82f6',
    greeting: '¡Hola! Ayer aprendí a enrocar. ¿Jugamos una partida rápida?',
    style: 'Entusiasta, saca la dama rápido y busca jaques.',
    difficultyLevel: 1
  },
  {
    id: 'sofia_teen',
    name: 'Sofía',
    category: 'personalidades',
    elo: 950,
    title: 'Streamer Táctica',
    avatarType: 'human_girl',
    color: '#ec4899',
    greeting: '¡Qué onda! Me encantan las partidas con aperturas abiertas y táctica.',
    style: 'Juega la Apertura Italiana y el Gambito de Dama.',
    difficultyLevel: 2
  },
  {
    id: 'carlos_club',
    name: 'Carlos',
    category: 'personalidades',
    elo: 1350,
    title: 'Estratega de Club',
    avatarType: 'human_man',
    color: '#10b981',
    greeting: 'Buenas. Llevo 3 años jugando torneos locales. ¡A ver qué tal juegas!',
    style: 'Juega el Sistema Londres y maneja finales de peones.',
    difficultyLevel: 3
  },
  {
    id: 'elena_coach',
    name: 'Maestra Elena',
    category: 'personalidades',
    elo: 1750,
    title: 'Maestra FIDE',
    avatarType: 'human_woman',
    color: '#8b5cf6',
    greeting: 'El ajedrez es arte, ciencia y deporte. Demuéstrame tu cálculo.',
    style: 'Juego posicional riguroso según la escuela Yusupov.',
    difficultyLevel: 4
  },
  {
    id: 'kaspar_gm',
    name: 'Gran Maestro Kaspar',
    category: 'personalidades',
    elo: 2150,
    title: 'Gran Maestro Internacional',
    avatarType: 'human_gm',
    color: '#e11d48',
    greeting: 'En el tablero de ajedrez no hay lugar para la duda. Adelante.',
    style: 'Juego universal de clase mundial.',
    difficultyLevel: 5
  }
];

export const BotAvatarRenderer = ({ bot, size = 64, className = "" }) => {
  const type = bot.avatarType;

  // --- ROBOTS ---
  if (type === 'robot_retro') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#0f172a" />
        <circle cx="50" cy="16" r="7" fill="#ef4444" />
        <line x1="50" y1="16" x2="50" y2="28" stroke="#94a3b8" strokeWidth="4" />
        <rect x="25" y="28" width="50" height="42" rx="10" fill="#64748b" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="40" cy="44" r="7" fill="#38bdf8" />
        <circle cx="60" cy="44" r="7" fill="#38bdf8" />
        <rect x="35" y="56" width="30" height="8" rx="2" fill="#0284c7" />
        <rect x="32" y="72" width="12" height="14" rx="3" fill="#475569" />
        <rect x="56" y="72" width="12" height="14" rx="3" fill="#475569" />
      </svg>
    );
  }

  if (type === 'robot_cosmo') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#1e1b4b" />
        <circle cx="50" cy="48" r="32" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
        {/* Visor Lunar Curvo */}
        <ellipse cx="50" cy="48" rx="22" ry="14" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
        <path d="M 34,46 Q 50,40 66,46" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
        <circle cx="42" cy="48" r="3" fill="#38bdf8" />
        <circle cx="58" cy="48" r="3" fill="#38bdf8" />
        {/* Antenas Laterales */}
        <line x1="18" y1="48" x2="12" y2="40" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="12" cy="40" r="3.5" fill="#c084fc" />
        <line x1="82" y1="48" x2="88" y2="40" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="88" cy="40" r="3.5" fill="#c084fc" />
      </svg>
    );
  }

  if (type === 'robot_spark') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#451a03" />
        {/* Cabeza Hexagonal */}
        <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="#78350f" stroke="#fbbf24" strokeWidth="2.5" />
        {/* Rayo Eléctrico Frontal */}
        <polygon points="52,26 42,46 50,46 46,68 60,48 52,48" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
        {/* Ojos Eléctricos */}
        <circle cx="34" cy="44" r="5" fill="#fef08a" />
        <circle cx="66" cy="44" r="5" fill="#fef08a" />
      </svg>
    );
  }

  if (type === 'robot_titan') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#450a0a" />
        {/* Casco Acorazado */}
        <rect x="22" y="24" width="56" height="52" rx="10" fill="#7f1d1d" stroke="#f87171" strokeWidth="3" />
        {/* Visor Láser Amenazante */}
        <rect x="28" y="42" width="44" height="12" rx="4" fill="#000000" />
        <line x1="30" y1="48" x2="70" y2="48" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        {/* Placas de Blindaje */}
        <line x1="22" y1="36" x2="78" y2="36" stroke="#991b1b" strokeWidth="2" />
        <line x1="22" y1="62" x2="78" y2="62" stroke="#991b1b" strokeWidth="2" />
        <rect x="42" y="66" width="16" height="6" rx="2" fill="#f87171" />
      </svg>
    );
  }

  if (type === 'robot_quantum') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#09090b" />
        {/* Núcleo Cuántico y Órbitas */}
        <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#a855f7" strokeWidth="2" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#38bdf8" strokeWidth="2" transform="rotate(30 50 50)" />
        <circle cx="50" cy="50" r="18" fill="#581c87" stroke="#c084fc" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="8" fill="#38bdf8" />
        <circle cx="24" cy="38" r="3.5" fill="#c084fc" />
        <circle cx="76" cy="62" r="3.5" fill="#38bdf8" />
      </svg>
    );
  }

  // --- ZOOLÓGICO ---
  if (type === 'zoo_monkey') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#064e3b" />
        <circle cx="26" cy="40" r="14" fill="#a16207" />
        <circle cx="74" cy="40" r="14" fill="#a16207" />
        <circle cx="26" cy="40" r="8" fill="#fde68a" />
        <circle cx="74" cy="40" r="8" fill="#fde68a" />
        <ellipse cx="50" cy="54" rx="30" ry="26" fill="#78350f" />
        <ellipse cx="50" cy="60" rx="20" ry="16" fill="#fde68a" />
        <circle cx="42" cy="46" r="4.5" fill="#1f2937" />
        <circle cx="58" cy="46" r="4.5" fill="#1f2937" />
        <ellipse cx="50" cy="60" rx="4" ry="3" fill="#78350f" />
        <path d="M 45,66 Q 50,70 55,66" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'zoo_shark') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#0c4a6e" />
        <path d="M 20,80 C 25,35 60,25 80,45 C 75,70 50,85 20,80 Z" fill="#0284c7" />
        <polygon points="50,22 62,38 45,38" fill="#0369a1" />
        <circle cx="65" cy="42" r="4.5" fill="#ffffff" />
        <circle cx="66" cy="42" r="2.5" fill="#000000" />
        <polygon points="55,62 60,56 65,62 70,56" fill="#ffffff" />
      </svg>
    );
  }

  if (type === 'zoo_elephant') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#1e293b" />
        {/* Orejas Grandes */}
        <ellipse cx="22" cy="46" rx="16" ry="20" fill="#64748b" />
        <ellipse cx="22" cy="46" rx="10" ry="14" fill="#f472b6" opacity="0.35" />
        <ellipse cx="78" cy="46" rx="16" ry="20" fill="#64748b" />
        <ellipse cx="78" cy="46" rx="10" ry="14" fill="#f472b6" opacity="0.35" />
        {/* Cabeza */}
        <ellipse cx="50" cy="48" rx="26" ry="24" fill="#94a3b8" />
        {/* Ojos */}
        <circle cx="39" cy="42" r="4.5" fill="#0f172a" />
        <circle cx="61" cy="42" r="4.5" fill="#0f172a" />
        <circle cx="40.5" cy="40.5" r="1.5" fill="#ffffff" />
        <circle cx="62.5" cy="40.5" r="1.5" fill="#ffffff" />
        {/* Colmillos de Marfil */}
        <path d="M 36,56 C 28,66 22,64 20,60 C 22,58 32,52 36,56 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <path d="M 64,56 C 72,66 78,64 80,60 C 78,58 68,52 64,56 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        {/* Trompa Curvada */}
        <path d="M 44,50 C 44,66 38,76 46,82 C 54,86 56,74 56,50 Z" fill="#64748b" />
        {/* Arrugas de la trompa */}
        <line x1="45" y1="60" x2="55" y2="60" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="44" y1="68" x2="53" y2="68" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'zoo_owl') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#14532d" />
        <polygon points="30,22 25,10 42,18" fill="#991b1b" />
        <polygon points="70,22 75,10 58,18" fill="#991b1b" />
        <ellipse cx="50" cy="52" rx="28" ry="26" fill="#dc2626" />
        <circle cx="38" cy="46" r="10" fill="#ffffff" />
        <circle cx="62" cy="46" r="10" fill="#ffffff" />
        <circle cx="38" cy="46" r="4.5" fill="#450a0a" />
        <circle cx="62" cy="46" r="4.5" fill="#450a0a" />
        <polygon points="46,54 54,54 50,62" fill="#f59e0b" />
      </svg>
    );
  }

  if (type === 'zoo_tiger') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#271105" />
        {/* Orejas */}
        <circle cx="28" cy="30" r="12" fill="#ea580c" />
        <circle cx="28" cy="30" r="7" fill="#18181b" />
        <circle cx="28" cy="30" r="4" fill="#fed7aa" />
        <circle cx="72" cy="30" r="12" fill="#ea580c" />
        <circle cx="72" cy="30" r="7" fill="#18181b" />
        <circle cx="72" cy="30" r="4" fill="#fed7aa" />
        {/* Cabeza Naranja Feroz */}
        <ellipse cx="50" cy="54" rx="30" ry="26" fill="#f97316" />
        {/* Pelaje blanco mejillas */}
        <path d="M 22,60 Q 30,70 40,74 Q 28,78 22,60 Z" fill="#fff7ed" />
        <path d="M 78,60 Q 70,70 60,74 Q 72,78 78,60 Z" fill="#fff7ed" />
        {/* Rayas de Tigre en la Frente */}
        <polygon points="50,30 46,38 54,38" fill="#18181b" />
        <polygon points="40,34 38,40 44,40" fill="#18181b" />
        <polygon points="60,34 62,40 56,40" fill="#18181b" />
        <polygon points="26,50 34,52 32,56" fill="#18181b" />
        <polygon points="74,50 66,52 68,56" fill="#18181b" />
        {/* Ojos Felinos Dorados */}
        <ellipse cx="38" cy="48" rx="6" ry="5" fill="#facc15" />
        <ellipse cx="62" cy="48" rx="6" ry="5" fill="#facc15" />
        <ellipse cx="38" cy="48" rx="2" ry="4.5" fill="#18181b" />
        <ellipse cx="62" cy="48" rx="2" ry="4.5" fill="#18181b" />
        {/* Hocico */}
        <ellipse cx="50" cy="64" rx="12" ry="9" fill="#fff7ed" />
        <polygon points="46,60 54,60 50,65" fill="#991b1b" />
        <path d="M 50,65 L 50,70 M 46,69 Q 50,73 54,69" stroke="#18181b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Bigotes */}
        <line x1="36" y1="66" x2="22" y2="64" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="69" x2="24" y2="72" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="64" y1="66" x2="78" y2="64" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="64" y1="69" x2="76" y2="72" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // --- PERSONALIDADES HUMANAS ---
  if (type === 'human_boy') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#1e293b" />
        {/* Rostro */}
        <circle cx="50" cy="52" r="22" fill="#fed7aa" />
        {/* Gorra deportiva hacia atrás */}
        <path d="M 28,44 C 28,26 72,26 72,44 Z" fill="#3b82f6" />
        <ellipse cx="50" cy="44" rx="23" ry="5" fill="#1d4ed8" />
        {/* Ojos y Sonrisa */}
        <circle cx="42" cy="52" r="3.5" fill="#1e293b" />
        <circle cx="58" cy="52" r="3.5" fill="#1e293b" />
        <path d="M 44,62 Q 50,68 56,62" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Camiseta */}
        <path d="M 26,92 Q 50,74 74,92 Z" fill="#3b82f6" />
      </svg>
    );
  }

  if (type === 'human_girl') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#2e1065" />
        {/* Cabello largo morado */}
        <circle cx="30" cy="52" r="14" fill="#701a75" />
        <circle cx="70" cy="52" r="14" fill="#701a75" />
        <circle cx="50" cy="50" r="22" fill="#fed7aa" />
        <path d="M 28,42 Q 50,22 72,42 Q 50,30 28,42 Z" fill="#701a75" />
        {/* Auriculares Gamer Rosas */}
        <path d="M 24,46 C 24,20 76,20 76,46" stroke="#ec4899" strokeWidth="4" fill="none" />
        <rect x="20" y="44" width="8" height="14" rx="3" fill="#f43f5e" />
        <rect x="72" y="44" width="8" height="14" rx="3" fill="#f43f5e" />
        {/* Ojos y Sonrisa */}
        <circle cx="42" cy="50" r="3.5" fill="#1e293b" />
        <circle cx="58" cy="50" r="3.5" fill="#1e293b" />
        <path d="M 45,58 Q 50,63 55,58" stroke="#db2777" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Ropa */}
        <path d="M 26,92 Q 50,74 74,92 Z" fill="#ec4899" />
      </svg>
    );
  }

  if (type === 'human_man') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#064e3b" />
        <circle cx="50" cy="48" r="22" fill="#fed7aa" />
        {/* Cabello castaño corto */}
        <path d="M 28,40 Q 50,18 72,40 Q 50,26 28,40 Z" fill="#451a03" />
        {/* Lentes modernos */}
        <rect x="34" y="44" width="13" height="10" rx="2" fill="none" stroke="#10b981" strokeWidth="2" />
        <rect x="53" y="44" width="13" height="10" rx="2" fill="none" stroke="#10b981" strokeWidth="2" />
        <line x1="47" y1="49" x2="53" y2="49" stroke="#10b981" strokeWidth="2" />
        <circle cx="40.5" cy="49" r="2" fill="#1e293b" />
        <circle cx="59.5" cy="49" r="2" fill="#1e293b" />
        {/* Barba recortada */}
        <path d="M 38,58 Q 50,70 62,58" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Camisa */}
        <path d="M 26,92 Q 50,72 74,92 Z" fill="#10b981" />
      </svg>
    );
  }

  if (type === 'human_woman') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#1e1b4b" />
        {/* Cabello recogido elegante */}
        <circle cx="50" cy="24" r="12" fill="#172554" />
        <circle cx="50" cy="50" r="22" fill="#fed7aa" />
        <path d="M 28,42 Q 50,20 72,42 Q 50,30 28,42 Z" fill="#172554" />
        {/* Ojos expresivos */}
        <circle cx="42" cy="48" r="3.5" fill="#1e293b" />
        <circle cx="58" cy="48" r="3.5" fill="#1e293b" />
        <path d="M 45,58 Q 50,62 55,58" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Pendientes dorados */}
        <circle cx="28" cy="52" r="2.5" fill="#fbbf24" />
        <circle cx="72" cy="52" r="2.5" fill="#fbbf24" />
        {/* Traje */}
        <path d="M 26,92 Q 50,72 74,92 Z" fill="#8b5cf6" />
      </svg>
    );
  }

  if (type === 'human_gm') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#1c1917" />
        {/* Cabeza de Gran Maestro */}
        <circle cx="50" cy="46" r="22" fill="#ffedd5" />
        {/* Cabello y Barba Gris plateada */}
        <path d="M 28,38 Q 50,16 72,38 Q 50,24 28,38 Z" fill="#94a3b8" />
        <path d="M 36,54 Q 50,72 64,54" stroke="#94a3b8" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Ojos concentrados */}
        <line x1="36" y1="42" x2="46" y2="44" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="64" y1="42" x2="54" y2="44" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="41" cy="46" r="3" fill="#0f172a" />
        <circle cx="59" cy="46" r="3" fill="#0f172a" />
        {/* Traje formal con corbata */}
        <path d="M 26,92 Q 50,70 74,92 Z" fill="#e11d48" />
        <polygon points="50,74 46,92 54,92" fill="#0f172a" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <rect width="100" height="100" rx="20" fill="#334155" />
      <circle cx="50" cy="50" r="24" fill={bot.color} />
    </svg>
  );
};

export const getBotById = (id) => {
  if (!id) return null;
  return BOT_ROSTER.find(b => b.id.toLowerCase() === id.toLowerCase());
};

