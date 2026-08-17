import { Chess } from 'chess.js';
import { createChessGame, isKinglessFen } from './kinglessEngine';
import { getBestBotMove } from './aiBot';
import { getCoachById } from '../assets/coachesData';

/**
 * Motor del Entrenador Inteligente Junvill
 * Proporciona pistas escalonadas (4 niveles), avisos en vivo de peligro/errores y explicaciones tácticas personalizadas según el tutor activo.
 */

const PIECE_NAMES_ES = {
  p: 'el Peón',
  n: 'el Caballo',
  b: 'el Alfil',
  r: 'la Torre',
  q: 'la Dama',
  k: 'el Rey'
};

/**
 * Genera un conjunto de 4 pistas progresivas para la posición actual
 */
export const generateScaffoldedHints = (fen, coachId = 'coach_aurelio') => {
  const chess = createChessGame(fen);
  // Evaluación rápida nivel 2 para respuesta instantánea a 0ms sin congelar la UI
  const bestMove = getBestBotMove(fen, 2);
  const coach = getCoachById(coachId);

  if (!bestMove) {
    return [
      { level: 1, text: 'No hay jugadas legales disponibles (Jaque mate o tablas).' },
      { level: 2, text: 'La partida ha concluido.' },
      { level: 3, text: 'Fin de la partida.' },
      { level: 4, text: 'Revisa las opciones en el menú.' }
    ];
  }

  const pieceType = chess.get(bestMove.from)?.type || 'p';
  const pieceName = PIECE_NAMES_ES[pieceType];
  const targetSquare = bestMove.to;
  const isCapture = !!bestMove.captured;

  // Determinar cuadrante
  const file = targetSquare[0];
  const rank = parseInt(targetSquare[1]);
  let quadrant = 'center';
  let quadText = 'el centro del tablero';

  if (['a', 'b', 'c'].includes(file)) {
    quadrant = 'queenside';
    quadText = 'el flanco de dama (lado izquierdo)';
  } else if (['f', 'g', 'h'].includes(file)) {
    quadrant = 'kingside';
    quadText = 'el flanco de rey (lado derecho)';
  }

  // Pista 1: Orientación visual
  let hint1 = `Dirige tu atención hacia ${quadText}. Allí se encuentra la clave de la posición según el plan de ${coach.name}.`;

  // Pista 2: Concepto pedagógico
  let hint2 = '';
  if (bestMove.san.includes('#')) {
    hint2 = '¡Hay una jugada que da Jaque Mate directo en este mismo turno!';
  } else if (bestMove.san.includes('+')) {
    hint2 = 'Busca una jugada de jaque que fuerce al rey enemigo a una casilla vulnerable.';
  } else if (isCapture) {
    const capName = PIECE_NAMES_ES[bestMove.captured] || 'una pieza';
    hint2 = `Tienes la oportunidad de capturar ${capName} enemigo de forma ventajosa.`;
  } else if (['e4', 'd4', 'e5', 'd5', 'c4', 'f4'].includes(targetSquare)) {
    hint2 = 'La prioridad posicional es controlar el centro del tablero y abrir líneas activas.';
  } else if (bestMove.san === 'O-O' || bestMove.san === 'O-O-O') {
    hint2 = 'Es el momento ideal para poner a tu Rey a salvo en el enroque y conectar las torres.';
  } else {
    hint2 = coach.hintPhrase || 'Busca mejorar la posición de una de tus piezas menos activas.';
  }

  // Pista 3: Identificación de la pieza exacta
  let hint3 = `La jugada más fuerte se realiza con ${pieceName} ubicado en la casilla ${bestMove.from}.`;

  // Pista 4: Explicación completa de la jugada
  let hint4 = `¡Mueve ${pieceName} a ${targetSquare} (${bestMove.san})! `;
  if (bestMove.san.includes('#')) {
    hint4 += 'Esta jugada gana la partida inmediatamente con jaque mate.';
  } else if (isCapture) {
    hint4 += `Capturas ${PIECE_NAMES_ES[bestMove.captured]} ganando material decisivo.`;
  } else if (bestMove.san === 'O-O') {
    hint4 += 'Realizas el enroque: tu rey queda protegido y tu torre entra en acción.';
  } else {
    hint4 += `Desde ${targetSquare}, ${pieceName} domina casillas clave y consolida tu ventaja.`;
  }

  return [
    { level: 1, text: hint1, quadrant },
    { level: 2, text: hint2, quadrant },
    { level: 3, text: hint3, square: bestMove.from },
    { level: 4, text: hint4, square: bestMove.to, move: bestMove }
  ];
};

/**
 * Evalúa en tiempo real si el jugador o el bot cometieron un error o dejaron piezas colgadas
 */
export const evaluatePositionCoach = (previousFen, currentFen, lastMove, coachId = 'coach_aurelio') => {
  const prevGame = createChessGame(previousFen);
  const currGame = createChessGame(currentFen);
  const coach = getCoachById(coachId);

  if (currGame.isCheckmate && currGame.isCheckmate()) {
    return {
      type: 'victory',
      title: '¡JAQUE MATE!',
      text: coach.praisePhrase || '¡Extraordinario! Has tejido una red de mate imparable.',
      severity: 'success'
    };
  }

  if (currGame.isCheck && currGame.isCheck()) {
    return {
      type: 'check',
      title: '¡Jaque!',
      text: 'El rey rival está bajo ataque directo y debe defenderse de inmediato.',
      severity: 'info'
    };
  }

  if (currGame.isDraw && currGame.isDraw()) {
    return {
      type: 'draw',
      title: 'Tablas',
      text: 'La partida ha finalizado en empate (rey ahogado o repetición).',
      severity: 'warning'
    };
  }

  // Verificar si la última jugada fue un error que colgó una pieza
  const moves = currGame.moves({ verbose: true });
  const hangingThreats = [];

  for (const m of moves) {
    if (m.captured && ['q', 'r', 'b', 'n'].includes(m.captured)) {
      hangingThreats.push(m);
    }
  }

  if (hangingThreats.length > 0 && currGame.turn() !== prevGame.turn()) {
    const worst = hangingThreats[0];
    return {
      type: 'danger',
      title: '¡Ten Cuidado!',
      text: `${coach.warningPhrase} (Tu ${PIECE_NAMES_ES[worst.captured]} en ${worst.to} puede ser capturada).`,
      severity: 'danger'
    };
  }

  if (lastMove && (lastMove.san === 'O-O' || lastMove.san === 'O-O-O')) {
    return {
      type: 'good',
      title: '¡Gran decisión!',
      text: 'El enroque es un pilar fundamental para proteger al rey y conectar las torres.',
      severity: 'success'
    };
  }

  return {
    type: 'neutral',
    title: 'Buen desarrollo',
    text: 'Sigue desarrollando tus piezas hacia el centro y vigilando las casillas débiles del rival.',
    severity: 'neutral'
  };
};

/**
 * Explicación detallada para la pregunta "¿Por qué esta jugada?"
 */
export const explainWhyMove = (fen, move) => {
  if (!move) return 'Selecciona una jugada previa para analizar su impacto.';
  
  const chess = createChessGame(fen);
  const piece = chess.get(move.to) || chess.get(move.from);
  const pieceName = piece ? PIECE_NAMES_ES[piece.type] : 'La pieza';

  if (move.san.includes('#')) {
    return `La jugada ${move.san} es definitiva: da Jaque Mate porque el rey atacado no tiene ninguna casilla de escape legal ni piezas para interponer o capturar.`;
  }
  if (move.san.includes('+')) {
    return `La jugada ${move.san} pone en jaque al rey rival, obligándolo a gastar su turno en defenderse y permitiéndote mantener la iniciativa.`;
  }
  if (move.captured) {
    return `La jugada ${move.san} captura ${PIECE_NAMES_ES[move.captured]} rival, alterando el balance de material a tu favor.`;
  }
  if (['e4', 'd4', 'e5', 'd5'].includes(move.to)) {
    return `La jugada ${move.san} lucha por el control de las 4 casillas centrales del tablero, facilitando el despliegue armónico de tus demás piezas.`;
  }
  if (move.san === 'O-O' || move.san === 'O-O-O') {
    return `El enroque (${move.san}) traslada al rey lejos del peligro en las columnas centrales y activa la torre hacia el centro.`;
  }

  return `La jugada ${move.san} con ${pieceName} mejora su movilidad, controla casillas importantes en la fila ${move.to[1]} y prepara futuras combinaciones tácticas.`;
};
