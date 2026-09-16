import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CUBY_PIECES, CUBY_PIECE_KEYS, SQUARE_NAMES, DEFAULT_START_BOARD,
  getLegalMovesForSquare, getAllLegalMoves, applyMove, areBoardsEqual,
  rotateBoard90, rotateBoard180, rotateBoard270, flipBoardHorizontal,
  solveCubyBFS, generateProceduralCard, CURATED_CUBY_CARDS, boardToKey
} from '../../engine/chessCubyEngine';
import { PieceIcon } from '../../assets/pieces';
import { useUser } from '../../context/UserContext';
import { audioManager } from '../../engine/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, RotateCcw, Lightbulb, Sparkles, X, Swords, HelpCircle, 
  ArrowRight, CheckCircle2, Play, Flame, Zap, Award, 
  Volume2, VolumeX, Shuffle, Eye, Hourglass, Shield, Clock, ChevronRight
} from 'lucide-react';

export const ChessCuby3x3Modal = ({ isOpen = true, onClose }) => {
  const { currentUser, updateCurrentUser } = useUser();

  // Modos de Juego: 'adventure' (Reto Encadenado) | 'time_attack' (Reloj de Arena) | 'competitive' (Duelo con Pujas)
  const [gameMode, setGameMode] = useState('adventure');

  // Nivel de Reglas: 1 (Básico) | 2 (Con Rotación 90°) | 3 (Con Modo Espejo / Volteo)
  const [ruleLevel, setRuleLevel] = useState(1);

  // Tablero actual en juego (9 casillas)
  const [currentBoard, setCurrentBoard] = useState(() => [...DEFAULT_START_BOARD]);
  
  // Historial de estados para deshacer
  const [history, setHistory] = useState([]);

  // Tarjeta Objetivo Actual
  const [cardIndex, setCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(() => CURATED_CUBY_CARDS[0]);

  // Transformación manual aplicada a la tarjeta por el jugador (Niveles 2 y 3)
  // rotation: 0 | 90 | 180 | 270, isFlipped: boolean
  const [cardRotation, setCardRotation] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Selección de pieza en el tablero
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalDestinations, setLegalDestinations] = useState([]);

  // Pistas
  const [activeHint, setActiveHint] = useState(null);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  // Estadísticas del Reto Actual
  const [movesCount, setMovesCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [totalSolvedInSession, setTotalSolvedInSession] = useState(0);
  const [earnedStars, setEarnedStars] = useState(3);

  // Sonido
  const [isMuted, setIsMuted] = useState(false);

  // Modal de Reglas / Manual
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  /* --------------------------------------------------------------------------
     MODO 2: RELOJ DE ARENA (CONTRARRELOJ)
     -------------------------------------------------------------------------- */
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeAttackScore, setTimeAttackScore] = useState(0);
  const timerRef = useRef(null);

  /* --------------------------------------------------------------------------
     MODO 3: DUELO COMPETITIVO (CON FASE DE PUJAS)
     -------------------------------------------------------------------------- */
  // 'bid_phase' (Cálculo mental y puja) | 'execution_phase' (Ejecución en tablero) | 'round_over' | 'match_over'
  const [duelPhase, setDuelPhase] = useState('bid_phase');
  const [duelTimeLeft, setDuelTimeLeft] = useState(30);
  const [playerBid, setPlayerBid] = useState(5);
  const [botBid, setBotBid] = useState(null);
  const [activeDuelist, setActiveDuelist] = useState('player'); // 'player' | 'bot'
  const [maxDuelMovesAllowed, setMaxDuelMovesAllowed] = useState(5);
  const [playerDuelScore, setPlayerDuelScore] = useState(0);
  const [opponentDuelScore, setOpponentDuelScore] = useState(0);
  const [duelWinnerMessage, setDuelWinnerMessage] = useState('');
  const duelTimerRef = useRef(null);

  // Calcula la tarjeta transformada según la rotación y volteo elegidos por el usuario
  const getTransformedTargetBoard = useCallback(() => {
    let b = [...currentCard.target];
    if (cardFlipped) {
      b = flipBoardHorizontal(b);
    }
    if (cardRotation === 90) b = rotateBoard90(b);
    else if (cardRotation === 180) b = rotateBoard180(b);
    else if (cardRotation === 270) b = rotateBoard270(b);
    return b;
  }, [currentCard, cardRotation, cardFlipped]);

  // Penalización por rotación y volteo
  const getTransformPenalty = useCallback(() => {
    let p = 0;
    if (cardRotation === 90 || cardRotation === 270) p += 1;
    if (cardRotation === 180) p += 2;
    if (cardFlipped) p += 1;
    return p;
  }, [cardRotation, cardFlipped]);

  // Calcula el par óptimo en tiempo real para la posición actual
  const currentOptimalSolution = solveCubyBFS(
    currentBoard, 
    currentCard.target, 
    { allowRotation: ruleLevel >= 2, allowFlip: ruleLevel >= 3 }
  );

  /* --------------------------------------------------------------------------
     VERIFICACIÓN DE VICTORIA AL MOVER
     -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isSolved) return;

    const transformedTarget = getTransformedTargetBoard();
    const matchesTarget = areBoardsEqual(currentBoard, transformedTarget);

    if (matchesTarget) {
      setIsSolved(true);
      if (!isMuted) audioManager.playVictory();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

      const totalMovesWithPenalty = movesCount + getTransformPenalty();
      const optimal = currentCard.optimalMoves || currentOptimalSolution.minMoves || 1;
      
      let stars = 3;
      if (totalMovesWithPenalty > optimal + 2) stars = 1;
      else if (totalMovesWithPenalty > optimal) stars = 2;
      setEarnedStars(stars);

      setTotalSolvedInSession(prev => prev + 1);
      setStreakCount(prev => prev + 1);

      // Otorgar recompensas en usuario
      if (updateCurrentUser) {
        updateCurrentUser(prev => ({
          ...prev,
          coins: (prev.coins || 0) + (stars * 10),
          gems: (prev.gems || 0) + (stars === 3 ? 2 : 1),
          stats: {
            ...(prev.stats || {}),
            cubyPuzzlesSolved: ((prev.stats && prev.stats.cubyPuzzlesSolved) || 0) + 1
          }
        }));
      }

      // Modo Contrarreloj: Sumar puntos y agregar +10s bonus
      if (gameMode === 'time_attack') {
        setTimeAttackScore(prev => prev + 1);
        setTimeRemaining(prev => Math.min(prev + 12, 120));
      }

      // Modo Duelo: Manejar resolución de la ronda
      if (gameMode === 'competitive') {
        if (activeDuelist === 'player') {
          if (movesCount <= maxDuelMovesAllowed) {
            setPlayerDuelScore(prev => {
              const n = prev + 1;
              if (n >= 3) {
                setDuelWinnerMessage('¡Victoria del Jugador en el Duelo Mental! 🏆');
                setDuelPhase('match_over');
              } else {
                setDuelWinnerMessage('¡Punto para ti! Cumpliste tu oferta de movimientos 🎯');
                setDuelPhase('round_over');
              }
              return n;
            });
          }
        }
      }
    }
  }, [currentBoard, getTransformedTargetBoard, movesCount, getTransformPenalty, currentCard, currentOptimalSolution, isSolved, isMuted, gameMode, activeDuelist, maxDuelMovesAllowed, updateCurrentUser]);

  /* --------------------------------------------------------------------------
     TEMPORIZADOR MODO RELOJ DE ARENA
     -------------------------------------------------------------------------- */
  useEffect(() => {
    if (gameMode !== 'time_attack' || !isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerRunning(false);
          if (!isMuted) audioManager.playWarning();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameMode, isTimerRunning, isMuted]);

  /* --------------------------------------------------------------------------
     TEMPORIZADOR MODO DUELO (FASE DE PUJA 30s)
     -------------------------------------------------------------------------- */
  useEffect(() => {
    if (gameMode !== 'competitive' || duelPhase !== 'bid_phase') {
      if (duelTimerRef.current) clearInterval(duelTimerRef.current);
      return;
    }

    duelTimerRef.current = setInterval(() => {
      setDuelTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(duelTimerRef.current);
          handleFinalizeBids();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (duelTimerRef.current) clearInterval(duelTimerRef.current);
    };
  }, [gameMode, duelPhase]);

  // Selección y Movimiento de Fichas
  const handleSquareClick = (index) => {
    if (isSolved) return;

    const piece = currentBoard[index];

    // Si ya seleccionó una pieza y hace click en un destino legal
    if (selectedSquare !== null && legalDestinations.includes(index)) {
      const nextBoard = applyMove(currentBoard, selectedSquare, index);
      setHistory(prev => [...prev, currentBoard]);
      setCurrentBoard(nextBoard);
      setMovesCount(prev => prev + 1);
      setSelectedSquare(null);
      setLegalDestinations([]);
      setActiveHint(null);

      if (!isMuted) audioManager.playMove();

      // En modo Duelo: comprobar si se excedió de su puja
      if (gameMode === 'competitive' && duelPhase === 'execution_phase') {
        const nextMoves = movesCount + 1;
        if (nextMoves > maxDuelMovesAllowed && !areBoardsEqual(nextBoard, getTransformedTargetBoard())) {
          // Falló el reto
          if (!isMuted) audioManager.playWarning();
          setOpponentDuelScore(prev => {
            const n = prev + 1;
            if (n >= 3) {
              setDuelWinnerMessage('¡El Oponente gana el Duelo! Has superado tu límite de jugadas.');
              setDuelPhase('match_over');
            } else {
              setDuelWinnerMessage('¡Superaste tus jugadas ofertadas! Punto para tu Oponente ❌');
              setDuelPhase('round_over');
            }
            return n;
          });
        }
      }
      return;
    }

    // Si hace click en una pieza suya, seleccionar y mostrar destinos
    if (piece) {
      setSelectedSquare(index);
      const dests = getLegalMovesForSquare(currentBoard, index);
      setLegalDestinations(dests);
      return;
    }

    // Click en casilla vacía no válida: deseleccionar
    setSelectedSquare(null);
    setLegalDestinations([]);
  };

  // Deshacer Jugada
  const handleUndo = () => {
    if (history.length === 0 || isSolved) return;
    const prevBoard = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentBoard(prevBoard);
    setMovesCount(prev => Math.max(0, prev - 1));
    setSelectedSquare(null);
    setLegalDestinations([]);
    setActiveHint(null);
    if (!isMuted) audioManager.playMove();
  };

  // Reiniciar Tarjeta
  const handleResetCard = () => {
    if (history.length > 0) {
      setCurrentBoard(history[0]);
    } else {
      setCurrentBoard([...DEFAULT_START_BOARD]);
    }
    setHistory([]);
    setMovesCount(0);
    setIsSolved(false);
    setSelectedSquare(null);
    setLegalDestinations([]);
    setActiveHint(null);
    setCardRotation(0);
    setCardFlipped(false);
  };

  // Siguiente Tarjeta (Reto Encadenado: Las fichas se quedan en su posición final)
  const handleNextCard = () => {
    const nextIdx = cardIndex + 1;
    let nextCard;
    if (nextIdx < CURATED_CUBY_CARDS.length) {
      nextCard = CURATED_CUBY_CARDS[nextIdx];
    } else {
      // Generar tarjeta procedural balanceada
      nextCard = generateProceduralCard(currentBoard, 'medium');
    }

    setCardIndex(nextIdx);
    setCurrentCard(nextCard);
    setHistory([]);
    setMovesCount(0);
    setIsSolved(false);
    setSelectedSquare(null);
    setLegalDestinations([]);
    setActiveHint(null);
    setCardRotation(0);
    setCardFlipped(false);
  };

  // Rotar Tarjeta 90° (Nivel 2 y 3)
  const handleRotateCard = () => {
    if (ruleLevel < 2 || isSolved) return;
    setCardRotation(prev => (prev + 90) % 360);
    if (!isMuted) audioManager.playMove();
  };

  // Voltear Tarjeta / Modo Espejo (Nivel 3)
  const handleFlipCard = () => {
    if (ruleLevel < 3 || isSolved) return;
    setCardFlipped(prev => !prev);
    if (!isMuted) audioManager.playMove();
  };

  // Solicitar Pista Óptima al Solver BFS
  const handleRequestHint = () => {
    const sol = solveCubyBFS(currentBoard, getTransformedTargetBoard());
    if (sol.solved && sol.hint) {
      setActiveHint(sol.hint);
      setHintsUsedCount(prev => prev + 1);
      setSelectedSquare(sol.hint.from);
      setLegalDestinations([sol.hint.to]);
      if (!isMuted) audioManager.playHint();
    }
  };

  // Duelo: Finalizar Pujas
  const handleFinalizeBids = () => {
    // La IA calcula su puja según su nivel
    const sol = solveCubyBFS(currentBoard, currentCard.target);
    const optimal = sol.solved ? sol.minMoves : 5;
    const aiCalculatedBid = Math.max(optimal, Math.min(playerBid, optimal + Math.floor(Math.random() * 2)));
    setBotBid(aiCalculatedBid);

    if (playerBid <= aiCalculatedBid) {
      setActiveDuelist('player');
      setMaxDuelMovesAllowed(playerBid);
    } else {
      setActiveDuelist('bot');
      setMaxDuelMovesAllowed(aiCalculatedBid);
    }
    setDuelPhase('execution_phase');
  };

  // Iniciar Nueva Ronda de Duelo
  const handleStartNextDuelRound = () => {
    handleNextCard();
    setDuelPhase('bid_phase');
    setDuelTimeLeft(30);
    setPlayerBid(5);
    setBotBid(null);
    setDuelWinnerMessage('');
  };

  const transformedTargetBoard = getTransformedTargetBoard();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 130, padding: 'max(6px, var(--sat, 6px)) max(6px, var(--sar, 6px)) max(6px, var(--sab, 6px)) max(6px, var(--sal, 6px))' }} onClick={onClose}>
      <div 
        className="modal-card" 
        style={{
          maxWidth: 'min(96vw, 860px)',
          width: '100%',
          maxHeight: 'min(94dvh, 94vh)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '2px solid #eab308',
          borderRadius: '18px',
          padding: 'clamp(10px, 2.5vw, 18px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          overflowY: 'auto',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================================
            1. CABECERA Y SELECTOR DE REGLAS
           ========================================================================= */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(234, 179, 8, 0.4)',
              flexShrink: 0
            }}>
              🧩
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#facc15' }}>
                  Ajedrez 3x3: Desafío de 5 Piezas
                </h2>
                <span style={{ fontSize: '0.68rem', background: '#3b82f6', color: 'white', fontWeight: '900', padding: '1px 7px', borderRadius: '9999px' }}>
                  Puzle Cuby
                </span>
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                Reordena las 5 piezas usando sus movimientos oficiales hacia casillas libres. ¡Sin capturas!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsRulesOpen(true)}
              style={{ padding: '5px 10px', fontSize: '0.74rem', gap: '4px', borderColor: 'rgba(234, 179, 8, 0.4)', color: '#fde047' }}
            >
              <HelpCircle size={14} />
              <span>Reglas</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsMuted(!isMuted)}
              style={{ padding: '5px 8px', fontSize: '0.74rem' }}
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '5px 8px', fontSize: '0.74rem' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* SELECTOR DE MODO DE JUEGO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
          <button
            type="button"
            onClick={() => {
              setGameMode('adventure');
              setIsSolved(false);
            }}
            style={{
              background: gameMode === 'adventure' ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(202, 138, 4, 0.35) 100%)' : 'rgba(30, 41, 59, 0.6)',
              border: `1.5px solid ${gameMode === 'adventure' ? '#facc15' : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: '10px',
              padding: '6px 8px',
              color: gameMode === 'adventure' ? '#fef08a' : '#94a3b8',
              fontWeight: '900',
              fontSize: '0.76rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Trophy size={14} color="#facc15" />
              <span>Reto Encadenado</span>
            </div>
            <span style={{ fontSize: '0.64rem', opacity: 0.8, fontWeight: '700' }}>👤 Puzle Solitario</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGameMode('time_attack');
              setTimeRemaining(60);
              setIsTimerRunning(true);
              setIsSolved(false);
            }}
            style={{
              background: gameMode === 'time_attack' ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(190, 24, 93, 0.35) 100%)' : 'rgba(30, 41, 59, 0.6)',
              border: `1.5px solid ${gameMode === 'time_attack' ? '#f472b6' : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: '10px',
              padding: '6px 8px',
              color: gameMode === 'time_attack' ? '#fbcfe8' : '#94a3b8',
              fontWeight: '900',
              fontSize: '0.76rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Hourglass size={14} color="#f472b6" />
              <span>Reloj de Arena (60s)</span>
            </div>
            <span style={{ fontSize: '0.64rem', opacity: 0.8, fontWeight: '700' }}>⏳ Solitario Contrarreloj</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGameMode('competitive');
              setDuelPhase('bid_phase');
              setDuelTimeLeft(30);
              setIsSolved(false);
            }}
            style={{
              background: gameMode === 'competitive' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.35) 100%)' : 'rgba(30, 41, 59, 0.6)',
              border: `1.5px solid ${gameMode === 'competitive' ? '#60a5fa' : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: '10px',
              padding: '6px 8px',
              color: gameMode === 'competitive' ? '#bfdbfe' : '#94a3b8',
              fontWeight: '900',
              fontSize: '0.76rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Swords size={14} color="#60a5fa" />
              <span>Duelo con Pujas</span>
            </div>
            <span style={{ fontSize: '0.64rem', opacity: 0.8, fontWeight: '700' }}>🤖 vs Robot IA</span>
          </button>
        </div>

        {/* SELECTOR DE NIVEL DE DIFICULTAD / REGLAS AVANZADAS */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '800', color: '#cbd5e1', flexWrap: 'wrap' }}>
            <span>⚙️ Nivel de Reglas:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { lvl: 1, label: 'Nivel 1: Básico' },
                { lvl: 2, label: 'Nivel 2: Rotación 90° (+1)' },
                { lvl: 3, label: 'Nivel 3: Modo Espejo (+1)' }
              ].map(item => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => setRuleLevel(item.lvl)}
                  style={{
                    background: ruleLevel === item.lvl ? '#eab308' : 'rgba(30, 41, 59, 0.8)',
                    color: ruleLevel === item.lvl ? '#0f172a' : '#94a3b8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: '900',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {gameMode === 'adventure' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: '#facc15' }}>
              <span>🔥 Racha: <b>{streakCount}</b></span>
              <span>•</span>
              <span>⭐ Resueltos: <b>{totalSolvedInSession}</b></span>
            </div>
          )}

          {gameMode === 'time_attack' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: '900', color: timeRemaining <= 10 ? '#ef4444' : '#facc15' }}>
              <Clock size={16} />
              <span>Tiempo: {timeRemaining}s • Puntos: {timeAttackScore}</span>
            </div>
          )}
        </div>

        {/* =========================================================================
            2. BANNER DE FASE EN MODO COMPETITIVO (PUJAS / EJECUCIÓN)
           ========================================================================= */}
        {gameMode === 'competitive' && (
          <div style={{
            background: duelPhase === 'bid_phase' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)',
            border: `1.5px solid ${duelPhase === 'bid_phase' ? '#3b82f6' : '#10b981'}`,
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{duelPhase === 'bid_phase' ? '🧠' : '⚔️'}</span>
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '900', color: duelPhase === 'bid_phase' ? '#60a5fa' : '#34d399' }}>
                  {duelPhase === 'bid_phase' ? `Fase de Cálculo Mental (Pujas): ¡Quedan ${duelTimeLeft}s!` : `Fase de Ejecución: ${activeDuelist === 'player' ? '¡Tu Turno de Mover!' : 'Turno del Robot'}`}
                </h4>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>
                {duelPhase === 'bid_phase' 
                  ? 'Calcula mentalmente la secuencia sin tocar las piezas. Declara cuántos movimientos necesitas.'
                  : `Debes resolver el puzle en ${maxDuelMovesAllowed} movimientos o menos para ganar el punto.`}
              </p>
            </div>

            {duelPhase === 'bid_phase' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                  <span>Tu Oferta:</span>
                  <select
                    value={playerBid}
                    onChange={(e) => setPlayerBid(Number(e.target.value))}
                    style={{ background: '#0f172a', color: '#facc15', border: '1px solid #eab308', borderRadius: '6px', padding: '4px 8px', fontWeight: '900' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n} movimientos</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={handleFinalizeBids}
                  style={{ padding: '6px 14px', fontSize: '0.80rem', fontWeight: '900' }}
                >
                  Confirmar Puja 🎯
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.84rem', fontWeight: '900' }}>
                <span>Jugador: <strong style={{ color: '#38bdf8' }}>{playerDuelScore}</strong></span>
                <span>vs</span>
                <span>Robot: <strong style={{ color: '#f43f5e' }}>{opponentDuelScore}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            3. ÁREA PRINCIPAL: TABLERO 3x3 Y TARJETA OBJETIVO
           ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          {/* A) COLUMNA IZQUIERDA: TARJETA OBJETIVO (TARGET CARD) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            width: '100%'
          }}>
            <div style={{
              width: '100%',
              maxWidth: 'min(260px, 28vh, 85vw)',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid #eab308',
              borderRadius: '14px',
              padding: '10px 12px',
              boxShadow: '0 8px 24px rgba(234, 179, 8, 0.2)',
              position: 'relative',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.70rem', background: '#eab308', color: '#0f172a', fontWeight: '900', padding: '2px 7px', borderRadius: '4px' }}>
                  TARJETA #{cardIndex + 1}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#facc15', fontWeight: '800' }}>
                  Par: {currentCard.optimalMoves || currentOptimalSolution.minMoves || 4} jugadas
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px', fontSize: '0.90rem', fontWeight: '900', color: '#f8fafc' }}>
                {currentCard.title}
              </h3>

              {/* Mini Cuadrícula 3x3 de la Tarjeta */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '4px',
                background: '#334155',
                padding: '6px',
                borderRadius: '10px',
                border: '1.5px solid #64748b',
                aspectRatio: '1',
                width: '100%',
                maxWidth: 'min(140px, 16vh, 45vw)',
                margin: '0 auto',
                transform: `rotate(${cardRotation}deg) scaleX(${cardFlipped ? -1 : 1})`,
                transition: 'transform 0.3s ease'
              }}>
                {transformedTargetBoard.map((pKey, idx) => {
                  const isLight = (Math.floor(idx / 3) + (idx % 3)) % 2 === 0;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: isLight ? '#f1f5f9' : '#94a3b8',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        aspectRatio: '1'
                      }}
                    >
                      {pKey ? (
                        <div style={{ width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PieceIcon piece={CUBY_PIECES[pKey]?.code || pKey.toLowerCase()} color="w" />
                        </div>
                      ) : (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Controles de Rotación y Modo Espejo (Niveles 2 y 3) */}
              {(ruleLevel >= 2) && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleRotateCard}
                    style={{ padding: '4px 8px', fontSize: '0.70rem', gap: '3px' }}
                    title="Girar tarjeta 90° (+1 jugada)"
                  >
                    <RotateCcw size={12} />
                    <span>Girar 90° (+1)</span>
                  </button>
                  {ruleLevel >= 3 && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleFlipCard}
                      style={{ padding: '4px 8px', fontSize: '0.70rem', gap: '3px' }}
                      title="Efecto espejo reverso (+1 jugada)"
                    >
                      <Shuffle size={12} />
                      <span>Espejo (+1)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* B) COLUMNA DERECHA: TABLERO 3x3 INTERACTIVO */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            width: '100%'
          }}>
            {/* Tablero 3x3 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
              padding: '8px',
              borderRadius: '16px',
              border: '3px solid #f59e0b',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              width: '100%',
              maxWidth: 'min(280px, 30vh, 86vw)',
              aspectRatio: '1',
              boxSizing: 'border-box'
            }}>
              {currentBoard.map((pKey, idx) => {
                const r = Math.floor(idx / 3);
                const c = idx % 3;
                const isLight = (r + c) % 2 === 0;
                const isSelected = selectedSquare === idx;
                const isLegalDest = legalDestinations.includes(idx);
                const isHintFrom = activeHint && activeHint.from === idx;
                const isHintTo = activeHint && activeHint.to === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSquareClick(idx)}
                    style={{
                      background: isSelected 
                        ? '#fde047' 
                        : isHintTo 
                        ? '#4ade80' 
                        : isHintFrom 
                        ? '#fde047' 
                        : isLight 
                        ? '#fef3c7' 
                        : '#d97706',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: pKey || isLegalDest ? 'pointer' : 'default',
                      boxShadow: isSelected ? 'inset 0 0 14px rgba(234, 179, 8, 0.8)' : 'none',
                      transition: 'all 0.15s ease',
                      aspectRatio: '1'
                    }}
                  >
                    {/* Etiqueta de Casilla (a1..c3) */}
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: '5px',
                      fontSize: '0.64rem',
                      fontWeight: '800',
                      color: isLight ? '#92400e' : '#fef3c7',
                      opacity: 0.65,
                      userSelect: 'none'
                    }}>
                      {SQUARE_NAMES[idx]}
                    </span>

                    {/* Pieza de Ajedrez */}
                    {pKey && (
                      <div style={{
                        width: '82%',
                        height: '82%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}>
                        <PieceIcon piece={CUBY_PIECES[pKey]?.code || pKey.toLowerCase()} color="w" />
                      </div>
                    )}

                    {/* Punto sutil para casilla vacía disponible */}
                    {!pKey && !isLegalDest && (
                      <div style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isLight ? 'rgba(146, 64, 14, 0.22)' : 'rgba(254, 243, 199, 0.28)'
                      }} />
                    )}

                    {/* Punto indicador de destino legal */}
                    {!pKey && isLegalDest && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                        animation: 'pulse 1.2s infinite'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contador de Movimientos y Par */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 'min(280px, 30vh, 86vw)',
              padding: '6px 10px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              borderRadius: '8px',
              fontSize: '0.76rem',
              boxSizing: 'border-box'
            }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Movimientos: </span>
                <strong style={{ color: movesCount > (currentCard.optimalMoves || 4) ? '#ef4444' : '#facc15', fontSize: '0.88rem' }}>
                  {movesCount}
                </strong>
                {getTransformPenalty() > 0 && (
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}> (+{getTransformPenalty()} giros)</span>
                )}
              </div>

              <div>
                <span style={{ color: '#94a3b8' }}>Par Óptimo: </span>
                <strong style={{ color: '#38bdf8' }}>{currentCard.optimalMoves || currentOptimalSolution.minMoves || 4}</strong>
              </div>
            </div>

            {/* Barra de Herramientas (Pista, Deshacer, Reiniciar) */}
            <div style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: 'min(280px, 30vh, 86vw)', flexWrap: 'wrap', boxSizing: 'border-box' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleUndo}
                disabled={history.length === 0 || isSolved}
                style={{ flex: '1 1 70px', padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center', gap: '4px' }}
                title="Deshacer última jugada"
              >
                <RotateCcw size={13} />
                <span>Deshacer</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleResetCard}
                style={{ flex: '1 1 70px', padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center', gap: '4px' }}
                title="Reiniciar tablero"
              >
                <span>🔄 Reiniciar</span>
              </button>

              <button
                type="button"
                className="btn-gold"
                onClick={handleRequestHint}
                disabled={isSolved}
                style={{ flex: '1 1 70px', padding: '6px 4px', fontSize: '0.72rem', justifyContent: 'center', gap: '4px', fontWeight: '900' }}
                title="Ver siguiente jugada óptima"
              >
                <Lightbulb size={13} />
                <span>Pista</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. BANNER DE PISTA ACTIVA
           ========================================================================= */}
        {activeHint && !isSolved && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
            border: '1.5px solid #eab308',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.84rem',
            color: '#fef08a'
          }}>
            <Lightbulb size={18} color="#facc15" />
            <span>💡 <b>Pista de Cálculo:</b> {activeHint.description}.</span>
          </div>
        )}

        {/* =========================================================================
            5. MODAL / BANNER DE VICTORIA Y RESOLUCIÓN
           ========================================================================= */}
        {isSolved && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.4) 100%)',
            border: '2px solid #10b981',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2rem' }}>🎉</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#34d399' }}>
                  ¡Tarjeta #{cardIndex + 1} Resuelta con Éxito!
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#e2e8f0' }}>
                  {movesCount <= (currentCard.optimalMoves || 4) 
                    ? '🏆 ¡Perfecto! Lo lograste en el Par mínimo absoluto.' 
                    : `Completado en ${movesCount} movimientos. ¡Bien pensado!`}
                </p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} style={{ fontSize: '1rem', color: i < earnedStars ? '#facc15' : '#475569' }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleResetCard}
                style={{ padding: '9px 14px', fontSize: '0.82rem' }}
              >
                Reintentar
              </button>
              <button
                type="button"
                className="btn-gold"
                onClick={handleNextCard}
                style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: '900', gap: '6px' }}
              >
                <span>Siguiente Tarjeta Encadenada 🚀</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            6. MODAL DE REGLAS Y TUTORIAL PEDAGÓGICO
           ========================================================================= */}
        {isRulesOpen && (
          <div className="modal-overlay" style={{ zIndex: 140, padding: '12px' }} onClick={() => setIsRulesOpen(false)}>
            <div 
              className="modal-card" 
              style={{
                maxWidth: '650px',
                width: '100%',
                background: '#0f172a',
                border: '2px solid #eab308',
                borderRadius: '16px',
                padding: '20px',
                color: '#f8fafc'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#facc15', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📜</span> Reglas del Ajedrez 3x3 (Puzle Cuby)
                </h3>
                <button type="button" className="btn-secondary" onClick={() => setIsRulesOpen(false)} style={{ padding: '4px 8px' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', lineHeight: '1.5', color: '#cbd5e1' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid #eab308' }}>
                  <strong style={{ color: '#facc15' }}>1. Componentes:</strong> Tablero 3x3 (9 casillas) con exactamente 5 piezas (Rey ♔, Dama ♕, Torre ♖, Alfil ♗, Caballo ♘) y 4 casillas vacías.
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
                  <strong style={{ color: '#38bdf8' }}>2. Movimientos Oficiales (Sin Capturas):</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                    <li><b>Rey:</b> 1 casilla en cualquier dirección a casilla vacía.</li>
                    <li><b>Caballo:</b> Salto en «L» sobre piezas intermedias a casilla vacía.</li>
                    <li><b>Torre:</b> Línea recta horizontal/vertical a casilla vacía sin bloqueo.</li>
                    <li><b>Alfil:</b> Línea diagonal a casilla vacía sin bloqueo.</li>
                    <li><b>Dama:</b> Línea recta en todas direcciones sin bloqueo.</li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid #ec4899' }}>
                  <strong style={{ color: '#ec4899' }}>3. Reto Encadenado:</strong> Al resolver la tarjeta objetivo, las fichas permanecen en su posición final y se saca la siguiente tarjeta del mazo para el siguiente desafío.
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', borderLeft: '4px solid #a855f7' }}>
                  <strong style={{ color: '#c084fc' }}>4. Niveles Avanzados de Rotación y Espejo:</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                    <li><b>Nivel 2 (Rotación):</b> Cada giro de 90° de la tarjeta suma +1 movimiento a la cuenta total (180° = +2 movimientos).</li>
                    <li><b>Nivel 3 (Modo Espejo):</b> Voltear la tarjeta suma +1 movimiento a la resolución.</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                className="btn-gold"
                onClick={() => setIsRulesOpen(false)}
                style={{ width: '100%', marginTop: '16px', padding: '10px', fontWeight: '900', justifyContent: 'center' }}
              >
                ¡Entendido! Vamos a Jugar 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
