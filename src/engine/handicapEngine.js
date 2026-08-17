/**
 * Motor de Ventajas y Hándicaps (Odds Chess & Assistances)
 * Permite partidas niveladas pedagógicamente entre adultos/niños o jugadores de distinto nivel.
 */

export const PIECE_ODDS_OPTIONS = [
  {
    id: 'none',
    label: 'Sin Hándicap de Piezas',
    description: 'Todas las piezas en el tablero tradicional.',
    points: 0,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  },
  {
    id: 'pawn_f_black',
    label: '♟️ Negras sin Peón f7 (+1 pt)',
    description: 'Abre la diagonal del rey rival desde la primera jugada.',
    points: 1,
    fen: 'rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    removedFor: 'black'
  },
  {
    id: 'pawn_f_white',
    label: '♟️ Blancas sin Peón f2 (+1 pt)',
    description: 'Blancas juegan sin el peón protector de f2.',
    points: 1,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1',
    removedFor: 'white'
  },
  {
    id: 'knight_b_black',
    label: '🐴 Negras sin Caballo b8 (+3 pts)',
    description: 'Negras juegan sin el caballo del flanco de dama.',
    points: 3,
    fen: 'r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    removedFor: 'black'
  },
  {
    id: 'knight_b_white',
    label: '🐴 Blancas sin Caballo b1 (+3 pts)',
    description: 'Blancas juegan sin el caballo del flanco de dama.',
    points: 3,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1',
    removedFor: 'white'
  },
  {
    id: 'rook_a_black',
    label: '🏰 Negras sin Torre a8 (+5 pts)',
    description: 'Negras juegan sin la torre de la esquina a8.',
    points: 5,
    fen: '1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1',
    removedFor: 'black'
  },
  {
    id: 'rook_a_white',
    label: '🏰 Blancas sin Torre a1 (+5 pts)',
    description: 'Blancas juegan sin la torre de la esquina a1.',
    points: 5,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1',
    removedFor: 'white'
  },
  {
    id: 'queen_black',
    label: '👑 Negras sin Dama d8 (+9 pts)',
    description: 'Máxima ventaja: Negras juegan sin su reina.',
    points: 9,
    fen: 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    removedFor: 'black'
  },
  {
    id: 'queen_white',
    label: '👑 Blancas sin Dama d1 (+9 pts)',
    description: 'Máxima ventaja: Blancas juegan sin su reina.',
    points: 9,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1',
    removedFor: 'white'
  }
];

// Perfiles de Ayuda Predefinidos
export const ASSISTANCE_PRESETS = [
  {
    id: 'beginner',
    name: '🐣 Principiante (Tutor Completo)',
    description: 'Pistas y retrocesos ilimitados con guías visuales y alertas de colgadas.',
    config: {
      hintsMode: 'unlimited',
      hintsCount: 99,
      takebacksMode: 'unlimited',
      takebacksCount: 99,
      visualMoveGuide: true,
      blunderWarning: true
    }
  },
  {
    id: 'intermediate',
    name: '🎯 Intermedio (Entrenamiento)',
    description: '3 pistas y 2 retrocesos por partida con guías visuales y alertas de peligro.',
    config: {
      hintsMode: 'limited',
      hintsCount: 3,
      takebacksMode: 'limited',
      takebacksCount: 2,
      visualMoveGuide: true,
      blunderWarning: true
    }
  },
  {
    id: 'advanced',
    name: '⚡ Avanzado (Reto Ligero)',
    description: '1 pista y 1 retroceso de emergencia, con guía de casillas pero sin alertas de peligro.',
    config: {
      hintsMode: 'limited',
      hintsCount: 1,
      takebacksMode: 'limited',
      takebacksCount: 1,
      visualMoveGuide: true,
      blunderWarning: false
    }
  },
  {
    id: 'competitive',
    name: '🏆 Torneo (Sin Ayudas)',
    description: 'Modo competitivo estricto: sin pistas, sin retroceder jugadas ni ayudas visuales.',
    config: {
      hintsMode: 'off',
      hintsCount: 0,
      takebacksMode: 'off',
      takebacksCount: 0,
      visualMoveGuide: false,
      blunderWarning: false
    }
  },
  {
    id: 'custom',
    name: '⚙️ Personalizado',
    description: 'Ajusta exactamente la cantidad numérica de pistas y retrocesos a tu medida.',
    config: null
  }
];

export const DEFAULT_HANDICAP_CONFIG = {
  enabled: true,
  presetId: 'beginner',
  pieceOdds: 'none',
  hintsMode: 'unlimited', // 'unlimited' | 'limited' | 'off'
  hintsCount: 3,
  takebacksMode: 'unlimited', // 'unlimited' | 'limited' | 'off'
  takebacksCount: 2,
  visualMoveGuide: true,
  blunderWarning: true,
  beneficiary: 'player', // 'player' | 'white' | 'black'
};

export const getHandicapFen = (config) => {
  if (!config || !config.enabled || config.pieceOdds === 'none') {
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
  const option = PIECE_ODDS_OPTIONS.find(opt => opt.id === config.pieceOdds);
  return option ? option.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
};

export const getHandicapSummary = (config) => {
  if (!config || !config.enabled) {
    return 'Partida estándar sin ventajas.';
  }

  const parts = [];
  const option = PIECE_ODDS_OPTIONS.find(opt => opt.id === config.pieceOdds);
  if (option && option.id !== 'none') {
    parts.push(option.label);
  }

  const assistances = [];
  if (config.hintsMode === 'unlimited') {
    assistances.push('Pistas Ilimitadas 💡');
  } else if (config.hintsMode === 'limited' && config.hintsCount > 0) {
    assistances.push(`${config.hintsCount} ${config.hintsCount === 1 ? 'Pista' : 'Pistas'} 💡`);
  }

  if (config.takebacksMode === 'unlimited') {
    assistances.push('Deshacer Ilimitado ↩️');
  } else if (config.takebacksMode === 'limited' && config.takebacksCount > 0) {
    assistances.push(`${config.takebacksCount} ${config.takebacksCount === 1 ? 'Deshacer' : 'Deshacer'} ↩️`);
  }

  if (config.visualMoveGuide) assistances.push('Guía de Casillas 🟢');
  if (config.blunderWarning) assistances.push('Alerta de Peligro 🛡️');

  if (assistances.length > 0) {
    parts.push(`Asistencias: ${assistances.join(', ')}`);
  } else if (parts.length === 0) {
    return 'Modo Competitivo (Sin Ayudas ni Hándicap) 🏆';
  }

  return parts.join(' • ');
};
