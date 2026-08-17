import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { AvatarIcon } from '../assets/avatars';
import { BotAvatarRenderer, BOT_ROSTER } from '../assets/botRoster';
import { COACHES_LIST, getCoachById } from '../assets/coachesData';
import { getBestBotMove } from '../engine/aiBot';
import { generateScaffoldedHints, evaluatePositionCoach, explainWhyMove } from '../engine/coachEngine';
import { analyzeFullGame } from '../engine/gameReviewEngine';
import { GameReviewModal } from './GameReviewModal';
import { GameOverModal } from '../components/GameOverModal/GameOverModal';
import { GameModeModal } from '../components/GameModeModal/GameModeModal';
import { ReactionsBar, ReactionFloatingBubble } from '../components/Reactions/ReactionsBar';
import { HandicapConfigModal } from '../components/HandicapModal/HandicapConfigModal';
import { DiceRoller } from '../components/Variants/DiceRoller';
import { ChessClock } from '../components/ChessClock/ChessClock';
import { VictoryCardModal } from '../components/VictoryCard/VictoryCardModal';
import { getHandicapFen, getHandicapSummary, DEFAULT_HANDICAP_CONFIG } from '../engine/handicapEngine';
import { audioManager } from '../engine/audio';
import { voiceEngine } from '../engine/voiceEngine';
import { useUser } from '../context/UserContext';
import confetti from 'canvas-confetti';
import { Swords, Lightbulb, HelpCircle, RotateCcw, Play, RefreshCw, Settings, ShieldAlert, Sparkles, Trophy, CheckCircle, UserCheck, FileSearch, Globe, Volume2, VolumeX, Shuffle, Users, Bot, Maximize, Minimize, Pause, BookOpen, Puzzle, User, Home, ArrowLeft, Scale, X, Bug } from 'lucide-react';

export const PlayView = ({ activeBot = null, onOpenP2P, onOpenRobots, onExitToMenu, onOpenBugReport }) => {
  const { currentUser, updateCurrentUser, recordGameResult, recordBotWin } = useUser();
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const STORAGE_KEY = `junvill_ongoing_game_v1_${currentUser?.id || 'default'}`;

  const loadSavedGame = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.fen) return null;
      const testGame = new Chess(parsed.fen);
      if (testGame.isGameOver()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  };

  const savedGameRef = useRef(loadSavedGame());
  const initialSaved = savedGameRef.current;

  // Si hay una partida guardada válida y no se eligió expresamente un bot distinto, restaurarla
  const isResumingSaved = Boolean(initialSaved && (!activeBot || activeBot.id === initialSaved.botId));

  const initialBot = (isResumingSaved && initialSaved.botId)
    ? (BOT_ROSTER.find(b => b.id === initialSaved.botId) || BOT_ROSTER[0])
    : (activeBot || BOT_ROSTER[0]);

  const [currentBot, setCurrentBot] = useState(initialBot);
  const botToPlay = isResumingSaved ? initialBot : (activeBot || currentBot || BOT_ROSTER[0]);
  const activeCoachId = currentUser?.coachSettings?.coachAvatar || 'coach_aurelio';
  const activeCoach = getCoachById(activeCoachId) || COACHES_LIST[0] || { id: 'coach_aurelio', name: 'Maestro Aurelio', title: 'Tutor Principal' };

  const [game, setGame] = useState(() => {
    if (isResumingSaved && initialSaved?.fen) {
      try {
        return new Chess(initialSaved.fen);
      } catch (e) {}
    }
    return new Chess();
  });

  const [fenHistory, setFenHistory] = useState(() => {
    if (isResumingSaved && initialSaved?.fenHistory) return initialSaved.fenHistory;
    return ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'];
  });

  const [moveHistory, setMoveHistory] = useState(() => {
    if (isResumingSaved && initialSaved?.moveHistory) return initialSaved.moveHistory;
    return [];
  });

  const [lastMove, setLastMove] = useState(() => {
    if (isResumingSaved && initialSaved?.lastMove) return initialSaved.lastMove;
    return null;
  });

  // Configuración de Hándicap y Ventajas Pedagógicas
  const [handicapConfig, setHandicapConfig] = useState(() => {
    if (isResumingSaved && initialSaved?.handicapConfig) return initialSaved.handicapConfig;
    return DEFAULT_HANDICAP_CONFIG;
  });
  const [isHandicapModalOpen, setIsHandicapModalOpen] = useState(false);
  const [usedHintsCount, setUsedHintsCount] = useState(() => (isResumingSaved && initialSaved?.usedHintsCount) || 0);
  const [usedTakebacksCount, setUsedTakebacksCount] = useState(() => (isResumingSaved && initialSaved?.usedTakebacksCount) || 0);

  // Modalidad de Juego: 'bot' (Contra IA) | 'pass_and_play' (2 Jugadores local)
  const [gameMode, setGameMode] = useState(() => (isResumingSaved && initialSaved?.gameMode) || 'bot');
  // Variantes Lúdicas (Fase 4): 'standard' | 'dice_chess' | 'king_of_the_hill'
  const [gameVariant, setGameVariant] = useState(() => (isResumingSaved && initialSaved?.gameVariant) || 'standard');
  const [currentDiceRoll, setCurrentDiceRoll] = useState(null);
  const [isRollingDice, setIsRollingDice] = useState(false);

  // Reloj de Ajedrez & Tarjeta de Victoria (Fase 5)
  const [timeControl, setTimeControl] = useState(() => (isResumingSaved && initialSaved?.timeControl) || 'unlimited');
  const [isVictoryCardOpen, setIsVictoryCardOpen] = useState(false);

  const handleTimeout = (timedOutColor) => {
    const isPlayerWin = (timedOutColor === 'b' && playerColor === 'white') || (timedOutColor === 'w' && playerColor === 'black');
    const winnerName = isPlayerWin ? currentUser.name : (gameMode === 'pass_and_play' ? 'Jugador 2' : botToPlay.name);
    try { audioManager?.playVictory?.(); } catch (e) {}
    setIsGameOver(true);
    setGameOverSummary({
      title: isPlayerWin ? '¡Victoria por Tiempo! ⏱️' : '¡Derrota por Tiempo! ⏱️',
      subtitle: `Se ha agotado el tiempo de ${timedOutColor === 'w' ? 'las Blancas' : 'las Negras'}.`,
      result: isPlayerWin ? 'win' : 'loss',
      rewards: isPlayerWin ? '+12 Elo • +12 ⭐' : '+2 Elo'
    });
    recordGameResult(isPlayerWin ? 'win' : 'loss', 12, 85);
    setIsGameOverModalOpen(true);
  };

  const handleRollDice = () => {
    setIsRollingDice(true);
    try { audioManager?.playMove?.(); } catch (e) {}
    setTimeout(() => {
      const faces = ['p', 'n', 'b', 'r', 'q', 'k'];
      const picked = faces[Math.floor(Math.random() * faces.length)];
      setCurrentDiceRoll(picked);
      setIsRollingDice(false);
      try { audioManager?.playHint?.(); } catch (e) {}
    }, 400);
  };

  const hasLegalMovesForDiceRoll = useMemo(() => {
    if (gameVariant !== 'dice_chess' || !currentDiceRoll) return true;
    if (currentDiceRoll === 'k') return true;
    const moves = game.moves({ verbose: true });
    return moves.some(m => m.piece === currentDiceRoll);
  }, [game, gameVariant, currentDiceRoll]);

  const handlePassDiceTurn = () => {
    try { audioManager?.playWarning?.(); } catch (e) {}
    setCurrentDiceRoll(null);
    if (gameMode === 'bot') {
      setIsBotThinking(true);
      setTimeout(() => executeBotMove(game, game.fen()), 300);
    }
  };

  // Se abre el modal solo si NO hay una partida en curso guardada y no se seleccionó un bot específico
  const [isModeModalOpen, setIsModeModalOpen] = useState(() => (!isResumingSaved && !activeBot));

  // Selección de color del jugador
  const [playerColor, setPlayerColor] = useState(() => (isResumingSaved && initialSaved?.playerColor) || 'white'); // 'white' | 'black'
  const [showColorModal, setShowColorModal] = useState(false);

  const [botLevel, setBotLevel] = useState(botToPlay?.difficultyLevel || 1);
  const [assistanceLevel, setAssistanceLevel] = useState(currentUser?.coachSettings?.assistanceLevel || 'full');
  const [showSettings, setShowSettings] = useState(false);

  // Estado de Revisión de Partida
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const [coachMessage, setCoachMessage] = useState(() => {
    if (isResumingSaved && initialSaved?.moveHistory?.length > 0) {
      return {
        title: `Partida Reanudada vs ${initialBot?.name || 'Robot'} ♟️`,
        text: `¡Bienvenido de vuelta! Hemos reanudado tu partida exactamente en tu última jugada (Turno ${Math.floor(initialSaved.moveHistory.length / 2) + 1}).`,
        severity: 'info'
      };
    }
    return {
      title: `Partida contra ${botToPlay?.name || 'Robot'}`,
      text: `"${botToPlay?.greeting || '¡A jugar ajedrez!'}"`,
      severity: 'neutral'
    };
  });
  const [hints, setHints] = useState(null);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [animatingMove, setAnimatingMove] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [gameOverSummary, setGameOverSummary] = useState(null);

  // Estados del Sistema de Reacciones y Emociones en Vivo (Fase 1)
  const [playerReaction, setPlayerReaction] = useState(null);
  const [opponentReaction, setOpponentReaction] = useState(null);
  const lastBotReactionTimeRef = useRef(0);

  const triggerPlayerReaction = (reaction) => {
    try { audioManager?.playMove?.(); } catch (e) {}
    setPlayerReaction(reaction);
    setTimeout(() => setPlayerReaction(null), 2400);

    // En modo bot, respuesta reactiva simpática (40% probabilidad)
    if (gameMode === 'bot' && !isGameOver) {
      setTimeout(() => {
        const botResponses = [
          { emoji: '😎', label: '¡Buen intento!' },
          { emoji: '🔥', label: '¡Sube la emoción!' },
          { emoji: '🤔', label: 'Mmm interesante...' },
          { emoji: '👏', label: '¡Gran juego!' }
        ];
        const res = botResponses[Math.floor(Math.random() * botResponses.length)];
        triggerOpponentReaction(res);
      }, 900);
    }
  };

  const triggerOpponentReaction = (reaction) => {
    const now = Date.now();
    if (now - lastBotReactionTimeRef.current < 3000) return;
    lastBotReactionTimeRef.current = now;
    setOpponentReaction(reaction);
    setTimeout(() => setOpponentReaction(null), 2400);
  };

  // Auto-guardado de la partida en progreso en localStorage
  useEffect(() => {
    if (isGameOver) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      return;
    }
    if (moveHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          fen: game.fen(),
          fenHistory,
          moveHistory,
          lastMove,
          gameMode,
          playerColor,
          botId: botToPlay.id,
          handicapConfig,
          usedHintsCount,
          usedTakebacksCount,
          updatedAt: Date.now()
        }));
      } catch (e) {}
    }
  }, [game, fenHistory, moveHistory, lastMove, isGameOver, gameMode, playerColor, botToPlay?.id, handicapConfig, usedHintsCount, usedTakebacksCount]);

  // Guardado inmediato de seguridad ante recarga de ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isGameOver && moveHistory.length > 0) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            fen: game.fen(),
            fenHistory,
            moveHistory,
            lastMove,
            gameMode,
            playerColor,
            botId: botToPlay?.id,
            handicapConfig,
            usedHintsCount,
            usedTakebacksCount,
            updatedAt: Date.now()
          }));
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [game, fenHistory, moveHistory, lastMove, isGameOver, gameMode, playerColor, botToPlay?.id, handicapConfig, usedHintsCount, usedTakebacksCount]);

  // Inicializar o reiniciar partida con bot si viene prop explícito de un bot DISTINTO
  useEffect(() => {
    if (activeBot) {
      const saved = loadSavedGame();
      if (!saved || saved.botId !== activeBot.id || saved.moveHistory?.length === 0) {
        setGameMode('bot');
        setCurrentBot(activeBot);
        setIsModeModalOpen(false);
        setBotLevel(activeBot.difficultyLevel || 1);
        setShowColorModal(true);
      } else {
        // Reanudar partida guardada contra este bot sin abrir el modal de elegir color
        setGameMode('bot');
        setCurrentBot(activeBot);
        setIsModeModalOpen(false);
        setShowColorModal(false);
      }
    }
  }, [activeBot]);

  const isPlayerTurn = gameMode === 'pass_and_play'
    ? true
    : (playerColor === 'white' && game.turn() === 'w') || (playerColor === 'black' && game.turn() === 'b');

  // Función para determinar el tipo exacto de tablas según el reglamento FIDE
  const checkDrawType = (chessGame, currentFenHistory = []) => {
    if (chessGame.isStalemate()) {
      return {
        isDraw: true,
        title: '🤝 Tablas por Rey Ahogado',
        text: 'El rey no está en jaque, pero el jugador en turno no tiene ninguna jugada legal disponible. ¡Empate por ahogado!'
      };
    }
    if (chessGame.isInsufficientMaterial()) {
      return {
        isDraw: true,
        title: '🤝 Tablas por Material Insuficiente',
        text: 'Ninguno de los dos jugadores tiene piezas suficientes para forzar el jaque mate (ej. Rey contra Rey).'
      };
    }
    
    // Regla de los 50 movimientos (FIDE)
    try {
      const fen = chessGame.fen();
      const halfmoveClock = parseInt(fen.split(' ')[4] || '0', 10);
      if (halfmoveClock >= 100) {
        return {
          isDraw: true,
          title: '🤝 Tablas: Regla de los 50 Movimientos',
          text: 'Han transcurrido 50 jugadas consecutivas sin capturas ni avance de peones. La partida se declara en tablas.'
        };
      }
    } catch (e) {}

    // Triple Repetición en el historial de posiciones
    if (currentFenHistory && currentFenHistory.length >= 5) {
      const counts = {};
      for (const f of currentFenHistory) {
        const parts = f.split(' ');
        const posKey = `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
        counts[posKey] = (counts[posKey] || 0) + 1;
        if (counts[posKey] >= 3) {
          return {
            isDraw: true,
            title: '🤝 Tablas por Triple Repetición',
            text: 'La misma posición en el tablero se ha repetido 3 veces. La partida finaliza en empate.'
          };
        }
      }
    }

    if (chessGame.isDraw()) {
      return {
        isDraw: true,
        title: '🤝 Partida en Tablas',
        text: 'La partida ha finalizado en empate según el reglamento oficial de ajedrez.'
      };
    }

    return { isDraw: false };
  };

  // Manejo del movimiento del jugador (SIN DESINCRONIZACIONES NI BLOQUEOS)
  const handlePlayerMove = (moveResult, newFen) => {
    if (isGameOver || isBotThinking || animatingMove) return;
    if (gameMode === 'bot' && !isPlayerTurn) return;

    const prevFen = game.fen();
    const updatedGame = new Chess(newFen);
    const updatedFenHistory = [...fenHistory, newFen];
    
    // Actualizar estados inmediatamente
    setGame(updatedGame);
    setLastMove(moveResult);
    setMoveHistory(prev => [...prev, moveResult]);
    setFenHistory(updatedFenHistory);
    setHints(null);
    setCurrentHintLevel(0);

    // Si es Dados Mágicos, reiniciar la tirada del turno tras mover
    if (gameVariant === 'dice_chess') {
      setCurrentDiceRoll(null);
    }

    // REGLA REY DE LA COLINA: Conquista inmediata si el Rey pisa d4, d5, e4 o e5
    if (gameVariant === 'king_of_the_hill' && moveResult.piece === 'k' && ['d4', 'd5', 'e4', 'e5'].includes(moveResult.to)) {
      const isPlayerWin = moveResult.color === (playerColor === 'white' ? 'w' : 'b');
      const winnerName = isPlayerWin ? currentUser.name : (gameMode === 'pass_and_play' ? 'Jugador 2' : botToPlay.name);
      try { audioManager?.playVictory?.(); } catch (e) {}
      confetti({ particleCount: 120, spread: 80 });
      setIsGameOver(true);
      setGameOverSummary({
        title: `¡Conquista de la Colina en ${moveResult.to.toUpperCase()}! ⛰️👑`,
        subtitle: `¡El Rey de ${winnerName} ha alcanzado y conquistado la cima de la colina central! Victoria instantánea.`,
        result: isPlayerWin ? 'win' : 'loss',
        rewards: '+15 Elo • +15 ⭐'
      });
      recordGameResult(isPlayerWin ? 'win' : 'loss', 15, 90);
      setIsGameOverModalOpen(true);
      return;
    }

    const drawCheck = checkDrawType(updatedGame, updatedFenHistory);
    if (updatedGame.isCheckmate() || drawCheck.isDraw) {
      handleGameOver(updatedGame, drawCheck.isDraw ? drawCheck : null);
      return;
    }

    // Reacción del oponente ante jugadas del jugador
    if (gameMode === 'bot') {
      if (moveResult.captured === 'q') {
        triggerOpponentReaction({ emoji: '😱', label: '¡Mi Dama!' });
      } else if (moveResult.captured === 'r') {
        triggerOpponentReaction({ emoji: '😅', label: '¡Adiós a mi torre!' });
      } else if (updatedGame.isCheck() && Math.random() < 0.6) {
        triggerOpponentReaction({ emoji: '🛡️', label: '¡Buen jaque!' });
      }
    }

    if (gameMode === 'pass_and_play') {
      const isWhiteTurnNow = updatedGame.turn() === 'w';
      setCoachMessage({
        title: isWhiteTurnNow ? 'Turno de Blancas (Jugador 1)' : 'Turno de Negras (Jugador 2)',
        text: `Jugada realizada: ${moveResult.san}. ¡Es el turno del ${isWhiteTurnNow ? 'Jugador 1' : 'Jugador 2'}!`,
        severity: 'neutral'
      });
      return;
    }

    if (assistanceLevel !== 'off') {
      const coachFeedback = evaluatePositionCoach(prevFen, newFen, moveResult, activeCoach.id);
      if (assistanceLevel === 'full' || coachFeedback.severity === 'danger') {
        setCoachMessage(coachFeedback);
        if (coachFeedback.severity === 'danger') {
          audioManager.playWarning();
        }
      }
    }

    // Turno del bot: cálculo ágil sin demoras artificiales
    setIsBotThinking(true);
    setTimeout(() => {
      executeBotMove(updatedGame, newFen);
    }, 250);
  };

  const executeBotMove = (currentGame = game, currentFen = null) => {
    const g = currentGame || game;
    const fen = currentFen || g.fen();

    if (g.isGameOver()) {
      setIsBotThinking(false);
      return;
    }

    let botAllowedPiece = null;
    if (gameVariant === 'dice_chess') {
      const faces = ['p', 'n', 'b', 'r', 'q', 'k'];
      botAllowedPiece = faces[Math.floor(Math.random() * faces.length)];
    }

    const botMove = getBestBotMove(fen, botLevel, botAllowedPiece, gameVariant);
    if (!botMove && gameVariant === 'dice_chess') {
      setIsBotThinking(false);
      setCoachMessage({
        title: `🎲 ${botToPlay.name} sacó ${botAllowedPiece?.toUpperCase()} pero no puede moverla`,
        text: `${botToPlay.name} no tiene jugadas legales con esa pieza. ¡El turno pasa a ti! Lanza el dado.`,
        severity: 'info'
      });
      return;
    }

    if (botMove) {
      const movingPiece = g.get(botMove.from);

      // El robot ya terminó de calcular: apagar 'pensando' e iniciar el vuelo físico
      setIsBotThinking(false);
      setAnimatingMove({
        from: botMove.from,
        to: botMove.to,
        piece: movingPiece,
        color: g.turn(),
        captured: botMove.captured || null
      });

      // Al aterrizar la pieza (360ms), aplicar el nuevo estado en un único render síncrono limpio
      setTimeout(() => {
        const nextGame = new Chess(g.fen());
        const result = nextGame.move(botMove);
        if (result) {
          if (nextGame.isCheckmate() || nextGame.isCheck()) {
            audioManager.playCheck();
          } else if (result.captured) {
            audioManager.playCapture();
          } else {
            audioManager.playMove();
          }

          setGame(nextGame);
          setLastMove(result);
          setMoveHistory(prev => [...prev, result]);
          setAnimatingMove(null);

          const nextFen = nextGame.fen();

          // REGLA REY DE LA COLINA: Victoria del Bot si su Rey llega al centro
          if (gameVariant === 'king_of_the_hill' && result.piece === 'k' && ['d4', 'd5', 'e4', 'e5'].includes(result.to)) {
            setIsGameOver(true);
            setGameOverSummary({
              title: `¡${botToPlay.name} conquistó la Colina en ${result.to.toUpperCase()}! ⛰️👑`,
              subtitle: `El Rey de ${botToPlay.name} ha alcanzado la cima de la colina central y gana la partida.`,
              result: 'loss',
              rewards: '+2 Elo'
            });
            setIsGameOverModalOpen(true);
            return;
          }

          // Reacciones emocionales del Robot
          if (nextGame.isCheckmate()) {
            triggerOpponentReaction({ emoji: '👑', label: '¡Jaque Mate!' });
          } else if (result.captured === 'q' || result.captured === 'r') {
            triggerOpponentReaction({ emoji: '⚡', label: '¡Buena captura!' });
          } else if (nextGame.isCheck() && Math.random() < 0.6) {
            triggerOpponentReaction({ emoji: '😎', label: '¡Jaque!' });
          } else if (result.promotion) {
            triggerOpponentReaction({ emoji: '👑', label: '¡Dama coronada!' });
          }

          // Comprobar si la jugada del robot amenaza directamente una pieza del jugador (Alerta de Peligro)
          let hasThreatAlert = false;
          if (handicapConfig.blunderWarning && assistanceLevel !== 'off' && !nextGame.isGameOver()) {
            try {
              const oppColor = playerColor === 'white' ? 'b' : 'w';
              const myColor = playerColor === 'white' ? 'w' : 'b';
              const fenParts = nextFen.split(' ');
              fenParts[1] = oppColor;
              const simGame = new Chess(fenParts.join(' '));
              const botThreats = simGame.moves({ verbose: true }).filter(m => {
                if (!m.captured) return false;
                const vic = nextGame.get(m.to);
                return vic && vic.color === myColor && ['q', 'r', 'b', 'n', 'k'].includes(vic.type);
              });

              if (botThreats.length > 0) {
                hasThreatAlert = true;
                const worstThreat = botThreats[0];
                const victimPiece = nextGame.get(worstThreat.to);
                const pieceNames = { p: 'Peón', n: 'Caballo', b: 'Alfil', r: 'Torre', q: 'Dama', k: 'Rey' };
                const pieceName = pieceNames[victimPiece?.type] || 'tu pieza';
                audioManager.playWarning();
                setCoachMessage({
                  title: '🛡️ ¡Alerta de Peligro!',
                  text: `¡Cuidado! ${botToPlay.name} jugó ${result.san} y amenaza directamente a tu ${pieceName} en ${worstThreat.to.toUpperCase()}. ¡Protégela o retírala!`,
                  severity: 'danger'
                });
                voiceEngine.speak(`¡Cuidado! ${botToPlay.name} amenaza a tu ${pieceName} en ${worstThreat.to.toUpperCase()}.`, activeCoach.id);
              }
            } catch (e) {}
          }

          if (!hasThreatAlert && assistanceLevel === 'full') {
            const whyBotMoved = explainWhyMove(nextFen, result);
            setCoachMessage({
              title: `${botToPlay.name} jugó ${result.san}`,
              text: whyBotMoved,
              severity: 'neutral'
            });
          }

          const updatedFenHistory = [...fenHistory, nextFen];
          const drawCheck = checkDrawType(nextGame, updatedFenHistory);
          if (nextGame.isCheckmate() || drawCheck.isDraw) {
            handleGameOver(nextGame, drawCheck.isDraw ? drawCheck : null);
          }
        }
      }, 360);
    } else {
      setIsBotThinking(false);
    }
  };

  const handleGameOver = (finalGame = game, drawDetails = null) => {
    setIsGameOver(true);
    setIsBotThinking(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}

    let resultType = 'draw';
    let title = 'Partida en Tablas 🤝';
    let subtitle = 'La partida ha finalizado en empate.';
    let finalReason = 'Tablas';
    let rewardsText = '+4 Elo • +5 ⭐';

    if (finalGame.isCheckmate()) {
      const winnerIsWhite = finalGame.turn() === 'b';
      finalReason = 'Jaque Mate';
      audioManager.playVictory();
      confetti({ particleCount: 120, spread: 80 });

      if (gameMode === 'pass_and_play') {
        resultType = 'win';
        title = `¡Jaque Mate! Victoria de ${winnerIsWhite ? 'Blancas' : 'Negras'} 🏆`;
        subtitle = '¡Gran partida de ambos jugadores!';
        rewardsText = '+10 Elo • +10 ⭐';
        recordGameResult('win', 10, 80);
      } else {
        const playerWon = (winnerIsWhite && playerColor === 'white') || (!winnerIsWhite && playerColor === 'black');
        if (playerWon) {
          resultType = 'win';
          title = `¡Victoria contra ${botToPlay.name}! 🏆`;
          subtitle = `¡Felicidades! Has superado tácticamente a ${botToPlay.name}.`;
          rewardsText = '+15 Elo • +15 ⭐ • +3 💎';
          recordGameResult('win', 15, 90);
          recordBotWin(botToPlay.id, 15);
        } else {
          resultType = 'loss';
          title = 'Derrota por Jaque Mate ⚔️';
          subtitle = `${botToPlay.name} coordinó un ataque decisivo en el tablero.`;
          rewardsText = '-8 Elo';
          audioManager.playWarning();
          recordGameResult('loss', -8, 65);
        }
      }
    } else {
      const drawInfo = drawDetails || checkDrawType(finalGame, fenHistory);
      resultType = 'draw';
      title = drawInfo.title || 'Partida en Tablas 🤝';
      subtitle = drawInfo.text || 'La partida terminó en empate.';
      finalReason = drawInfo.title ? drawInfo.title.replace('🤝', '').trim() : 'Tablas';
      rewardsText = '+4 Elo • +5 ⭐';
      recordGameResult('draw', 4, 75);
    }

    setGameOverSummary({
      resultType,
      title,
      subtitle,
      finalReason,
      rewardsText,
      moveCount: moveHistory.length,
      turnsCount: Math.floor(moveHistory.length / 2) + 1
    });

    setCoachMessage({
      title,
      text: subtitle,
      severity: resultType === 'win' ? 'success' : resultType === 'loss' ? 'danger' : 'warning'
    });

    // Abrir modal con ligero retraso para apreciar la jugada final
    setTimeout(() => {
      setIsGameOverModalOpen(true);
    }, 450);
  };

  const maxHints = handicapConfig.hintsMode === 'unlimited' ? Infinity : handicapConfig.hintsMode === 'limited' ? (handicapConfig.hintsCount || 3) : 0;
  const remainingHints = Math.max(0, maxHints - usedHintsCount);
  const canRequestHint = isPlayerTurn && !isGameOver && !isBotThinking && (handicapConfig.hintsMode === 'unlimited' || remainingHints > 0);

  const maxTakebacks = handicapConfig.takebacksMode === 'unlimited' ? Infinity : handicapConfig.takebacksMode === 'limited' ? (handicapConfig.takebacksCount || 2) : 0;
  const remainingTakebacks = Math.max(0, maxTakebacks - usedTakebacksCount);
  const canUndo = (
    !isBotThinking &&
    (gameMode === 'pass_and_play' 
      ? moveHistory.length >= 1 
      : (playerColor === 'white' ? moveHistory.length >= 1 : moveHistory.length >= 2)) &&
    (handicapConfig.takebacksMode === 'unlimited' || remainingTakebacks > 0)
  );

  const handleRequestHint = () => {
    if (!canRequestHint) return;

    let activeHints = hints;
    if (!activeHints) {
      activeHints = generateScaffoldedHints(game.fen(), activeCoach.id);
      setHints(activeHints);
    }

    if (activeHints && currentHintLevel < 4) {
      audioManager.playHint();
      const nextLevel = currentHintLevel + 1;
      setCurrentHintLevel(nextLevel);
      if (handicapConfig.hintsMode === 'limited' && nextLevel === 1) {
        setUsedHintsCount(prev => prev + 1);
      }
      const hint = activeHints[nextLevel - 1];
      const hintsRemainingText = handicapConfig.hintsMode === 'limited' ? ` • Quedan ${Math.max(0, remainingHints - 1)} pistas` : '';
      setCoachMessage({
        title: `Pista de ${activeCoach.name} (${nextLevel}/4)${hintsRemainingText}`,
        text: hint.text,
        severity: 'info'
      });
      voiceEngine.speak(hint.text, activeCoach.id);
    }
  };

  const handleWhyMoveInquiry = () => {
    if (lastMove) {
      const explanation = explainWhyMove(game.fen(), lastMove);
      setCoachMessage({
        title: `¿Por qué ${lastMove.san}?`,
        text: explanation,
        severity: 'info'
      });
      voiceEngine.speak(explanation, activeCoach.id);
    }
  };

  const handleUndoMove = () => {
    if (!canUndo) return;

    // Si la partida estaba finalizada (jaque mate o tablas), reanudar
    if (isGameOver) {
      setIsGameOver(false);
    }

    let stepsToUndo = 1;
    if (gameMode === 'pass_and_play') {
      stepsToUndo = 1;
    } else {
      // Modo bot: Deshacer la jugada del contrincante Y la mía
      const playerColorLetter = playerColor === 'white' ? 'w' : 'b';
      if (game.turn() === playerColorLetter) {
        // Es mi turno (el bot ya respondió a mi jugada): Deshacer 2 jugadas (rival + jugador)
        stepsToUndo = moveHistory.length >= 2 ? 2 : moveHistory.length;
      } else {
        // Es turno del bot: Deshacer 1 jugada (la del jugador)
        stepsToUndo = 1;
      }
    }

    const targetMoveCount = Math.max(0, moveHistory.length - stepsToUndo);
    const newMoveHistory = moveHistory.slice(0, targetMoveCount);
    
    // Obtener el FEN objetivo directamente de fenHistory o reconstruir desde la posición inicial
    let targetFen = null;
    let newFenHistory = [];
    if (fenHistory.length > stepsToUndo) {
      newFenHistory = fenHistory.slice(0, fenHistory.length - stepsToUndo);
      targetFen = newFenHistory[newFenHistory.length - 1];
    } else {
      const startingFen = getHandicapFen(handicapConfig);
      const replayGame = new Chess(startingFen);
      newFenHistory = [startingFen];
      for (const m of newMoveHistory) {
        replayGame.move(m);
        newFenHistory.push(replayGame.fen());
      }
      targetFen = replayGame.fen();
    }

    const undoneGame = new Chess(targetFen);

    setGame(undoneGame);
    setMoveHistory(newMoveHistory);
    setFenHistory(newFenHistory);
    setLastMove(newMoveHistory[newMoveHistory.length - 1] || null);
    setHints(null);
    setCurrentHintLevel(0);
    setIsBotThinking(false);
    setAnimatingMove(null);

    audioManager.playMove();

    if (handicapConfig.takebacksMode === 'limited') {
      setUsedTakebacksCount(prev => prev + 1);
    }

    setCoachMessage({
      title: 'Jugada deshecha ↩️',
      text: handicapConfig.takebacksMode === 'limited'
        ? `Se deshizo tu jugada y la del rival. Te quedan ${Math.max(0, remainingTakebacks - 1)} retrocesos.`
        : 'Se deshizo tu jugada y la respuesta del rival. Es tu turno de nuevo.',
      severity: 'neutral'
    });
  };

  const handleOpenModalidad = () => {
    if (moveHistory.length > 0 && !isGameOver) {
      if (window.confirm('Hay una partida en curso. Cambiar de modalidad cancelará esta partida e iniciará una nueva. ¿Deseas continuar?')) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        setIsModeModalOpen(true);
      }
    } else {
      setIsModeModalOpen(true);
    }
  };

  const handleSaveHandicap = (newConfig) => {
    setHandicapConfig(newConfig);
    setIsHandicapModalOpen(false);
    if (moveHistory.length > 0 && !isGameOver) {
      if (window.confirm('Para aplicar las nuevas ventajas de piezas o ayudas es necesario reiniciar el tablero. ¿Deseas reiniciar la partida con estos ajustes?')) {
        handleRestartGame(newConfig);
      }
    }
  };

  const handleSelectBotMode = (bot) => {
    setGameMode('bot');
    setIsModeModalOpen(false);
    setShowColorModal(true);
  };

  const handleSelectPassAndPlay = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setGameMode('pass_and_play');
    setIsModeModalOpen(false);
    setShowColorModal(false);
    
    const startingFen = getHandicapFen(handicapConfig);
    const newG = new Chess(startingFen);
    setGame(newG);
    setFenHistory([startingFen]);
    setMoveHistory([]);
    setLastMove(null);
    setIsGameOver(false);
    setCurrentHintLevel(0);
    setUsedHintsCount(0);
    setUsedTakebacksCount(0);
    setReviewData(null);
    setIsBotThinking(false);
    setAnimatingMove(null);
    setPlayerColor('white');

    const summary = getHandicapSummary(handicapConfig);
    setCoachMessage({
      title: 'Modo 2 Jugadores (Pasa y Juega)',
      text: handicapConfig.enabled 
        ? `Partida iniciada (${summary}). Mueven las Blancas (Jugador 1).`
        : 'Partida iniciada. Mueven las Blancas (Jugador 1). Ambos juegan en esta misma pantalla alternando turnos.',
      severity: 'neutral'
    });
  };

  const handleSelectColorAndStart = (chosenColor) => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    let finalColor = chosenColor;
    if (chosenColor === 'random') {
      finalColor = Math.random() > 0.5 ? 'white' : 'black';
    }

    setGameMode('bot');
    setPlayerColor(finalColor);
    setShowColorModal(false);

    const startingFen = getHandicapFen(handicapConfig);
    const newG = new Chess(startingFen);
    setGame(newG);
    setFenHistory([startingFen]);
    setMoveHistory([]);
    setLastMove(null);
    setIsGameOver(false);
    setCurrentHintLevel(0);
    setUsedHintsCount(0);
    setUsedTakebacksCount(0);
    setReviewData(null);
    setIsBotThinking(false);
    setAnimatingMove(null);

    const summary = getHandicapSummary(handicapConfig);
    setCoachMessage({
      title: `Nueva Partida vs ${botToPlay.name}`,
      text: finalColor === 'black' 
        ? `Juegas con Negras. ${botToPlay.name} moverá primero.${handicapConfig.enabled ? ` (${summary})` : ''}` 
        : `"${botToPlay.greeting}"${handicapConfig.enabled ? ` • Ventajas: ${summary}` : ''}`,
      severity: 'neutral'
    });

    // Si el jugador eligió Negras, el bot hace la primera jugada de Blancas
    if (finalColor === 'black') {
      setIsBotThinking(true);
      setTimeout(() => {
        executeBotMove(newG, startingFen);
      }, 400);
    }
  };

  const handleRestartGame = () => {
    if (gameMode === 'pass_and_play') {
      handleSelectPassAndPlay();
    } else {
      setShowColorModal(true);
    }
  };

  const handleOpenReview = () => {
    if (moveHistory.length === 0) {
      alert('Juega al menos un movimiento para poder analizar la partida.');
      return;
    }
    const analysis = analyzeFullGame(fenHistory, moveHistory);
    setReviewData(analysis);
    setIsReviewOpen(true);
  };

  const handleSelectCoach = (coachId) => {
    updateCurrentUser({
      coachSettings: { ...currentUser.coachSettings, coachAvatar: coachId }
    });
  };

  // Detección en tiempo real de casillas y piezas amenazadas por el rival (Alerta de Peligro)
  const dangerSquares = React.useMemo(() => {
    if (!handicapConfig.blunderWarning || isGameOver || isBotThinking) return [];
    try {
      const fen = game.fen();
      const oppColor = gameMode === 'pass_and_play' 
        ? (game.turn() === 'w' ? 'b' : 'w')
        : (playerColor === 'white' ? 'b' : 'w');
      
      const myColor = gameMode === 'pass_and_play'
        ? game.turn()
        : (playerColor === 'white' ? 'w' : 'b');

      const fenParts = fen.split(' ');
      fenParts[1] = oppColor;
      const simGame = new Chess(fenParts.join(' '));
      const oppMoves = simGame.moves({ verbose: true });

      const threatened = new Set();
      for (const m of oppMoves) {
        if (m.captured) {
          const victim = game.get(m.to);
          if (victim && victim.color === myColor) {
            threatened.add(m.to);
          }
        }
      }
      return Array.from(threatened);
    } catch (e) {
      return [];
    }
  }, [game, handicapConfig.blunderWarning, isGameOver, isBotThinking, gameMode, playerColor]);

  const activeHint = currentHintLevel > 0 && hints ? hints[currentHintLevel - 1] : null;

  return (
    <div className="game-responsive-container">
      {/* COLUMNA IZQUIERDA: OPONENTE + TABLERO + JUGADOR */}
      <div className="game-board-column">
        {/* Tarjeta del Oponente con Altura Fija Rigurosa */}
        <div className="game-opponent-card" style={{ position: 'relative' }}>
          {/* Burbuja Flotante de Reacción del Oponente */}
          <ReactionFloatingBubble reaction={opponentReaction} position="top" />

          <div className="game-card-left" style={{ gap: '8px' }}>
            {/* Botón de Pausa / Salir al Menú */}
            <button
              onClick={() => setIsPauseMenuOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem', height: '32px', gap: '4px' }}
              title="Pausar Partida y Opciones de Menú"
            >
              <Pause size={14} color="#f59e0b" />
              <span className="hide-mobile-compact">Menú</span>
            </button>

            {gameMode === 'pass_and_play' ? (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1rem',
                border: '2px solid #34d399',
                flexShrink: 0
              }}>
                👥
              </div>
            ) : (
              <BotAvatarRenderer bot={botToPlay} size={32} />
            )}

            <div className="game-card-info">
              <div className="game-card-title">
                {gameMode === 'pass_and_play' ? 'Jugador 2 (Negras)' : `${botToPlay?.name || 'Robot'} (${playerColor === 'white' ? 'Negras' : 'Blancas'})`}
              </div>
              <div className="game-card-subtitle">
                {gameMode === 'pass_and_play'
                  ? (game.turn() === 'b' ? '▶ Mueve Negras' : 'Esperando a Blancas')
                  : `${botToPlay?.title || 'Oponente Virtual'} • ${botToPlay?.elo || 600} Elo`}
              </div>
            </div>
          </div>

          <div className="game-card-right">
            {isBotThinking && (
              <div className="thinking-pill">
                <span className="thinking-dot"></span>
                <span>Pensando...</span>
              </div>
            )}
            <button
              onClick={toggleFullscreen}
              className="btn-secondary"
              style={{
                padding: '5px 8px',
                fontSize: '0.76rem',
                height: '32px',
                gap: '4px',
                border: isFullscreen ? '1.5px solid #10b981' : '1.5px solid #3b82f6',
                background: isFullscreen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)'
              }}
              title={isFullscreen ? "Salir de Pantalla Completa (Modo Normal)" : "Pantalla Completa (Ocultar Barra URL del Navegador)"}
            >
              {isFullscreen ? <Minimize size={14} color="#10b981" /> : <Maximize size={14} color="#3b82f6" />}
              <span className="hide-mobile-compact" style={{ fontWeight: '800', color: isFullscreen ? '#10b981' : '#3b82f6' }}>
                {isFullscreen ? 'Normal' : 'Completa'}
              </span>
            </button>
          </div>
        </div>

        {/* Reloj de Ajedrez (Fase 5) */}
        {timeControl !== 'unlimited' && (
          <ChessClock
            timeControl={timeControl}
            activeTurn={game.turn()}
            isGameRunning={!isGameOver && !isPauseMenuOpen}
            onTimeout={handleTimeout}
            playerColor={playerColor}
            whiteName={playerColor === 'white' ? (currentUser?.name || 'Jugador') : (gameMode === 'pass_and_play' ? 'Jugador 1' : (botToPlay?.name || 'Robot'))}
            blackName={playerColor === 'black' ? (currentUser?.name || 'Jugador') : (gameMode === 'pass_and_play' ? 'Jugador 2' : (botToPlay?.name || 'Robot'))}
          />
        )}

        {/* Si la variante es Dados Mágicos, renderizar selector y tirador de dados */}
        {gameVariant === 'dice_chess' && !isGameOver && (
          <div style={{ marginBottom: '10px' }}>
            <DiceRoller
              currentRoll={currentDiceRoll}
              onRoll={handleRollDice}
              isRolling={isRollingDice}
              turn={game.turn()}
              hasLegalMovesForRoll={hasLegalMovesForDiceRoll}
              onPassTurn={handlePassDiceTurn}
            />
          </div>
        )}

        {/* Tablero de Ajedrez con Orientación Dinámica y Animación de Vuelo */}
        <ChessBoard
          fen={game.fen()}
          orientation={playerColor}
          interactive={isPlayerTurn && !isGameOver && !isBotThinking && !animatingMove && (gameVariant !== 'dice_chess' || (currentDiceRoll !== null && hasLegalMovesForDiceRoll))}
          onMove={handlePlayerMove}
          lastMove={lastMove}
          animatingMove={animatingMove}
          showLegalMoves={handicapConfig.visualMoveGuide}
          dangerSquares={dangerSquares}
          hintQuadrant={activeHint?.quadrant}
          hintSquare={activeHint?.square}
          hillSquares={gameVariant === 'king_of_the_hill' ? ['d4', 'd5', 'e4', 'e5'] : []}
          allowedPieceType={gameVariant === 'dice_chess' ? currentDiceRoll : null}
        />

        {/* Tarjeta del Jugador con Altura Fija Rigurosa */}
        <div className="game-player-card" style={{ position: 'relative' }}>
          {/* Burbuja Flotante de Reacción del Jugador */}
          <ReactionFloatingBubble reaction={playerReaction} position="bottom" />

          <div className="game-card-left">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <AvatarIcon avatarId={currentUser?.avatar || 'custom_dynamic'} avatarConfig={currentUser?.avatarConfig} size={36} />
            </div>
            <div className="game-card-info">
              <div className="game-card-title">
                {currentUser?.name || 'Estudiante'} ({playerColor === 'white' ? 'Blancas' : 'Negras'})
              </div>
              <div className="game-card-subtitle">
                {currentUser?.title || 'Aprendiz'} • {currentUser?.elo || 650} Elo
              </div>
            </div>
          </div>

          <div className="game-card-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Selector de Reacciones / Emojis */}
            <ReactionsBar onSendReaction={triggerPlayerReaction} disabled={isGameOver} />

            <div style={{ fontSize: '0.8rem', fontWeight: '800', display: 'flex', gap: '6px' }}>
              <span style={{ color: '#f59e0b' }}>⭐ {currentUser?.stars || 0}</span>
              <span style={{ color: '#ef4444' }}>💎 {currentUser?.gems || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: TUTOR PERSONALIZADO + ACCIONES PRINCIPALES + HISTORIAL AL FONDO */}
      <div className="game-sidebar-column">
        {/* Bocadillo del Entrenador Dinámico */}
        <div className="coach-bubble">
          <div className="coach-avatar-bubble">
            <AvatarIcon avatarId={activeCoach.id} size={46} />
          </div>
          <div className="coach-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="coach-name">{activeCoach.name} • {activeCoach.title}</div>
              <button
                onClick={() => voiceEngine.speak(`${coachMessage.title}. ${coachMessage.text}`, activeCoach.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '2px' }}
                title="Escuchar consejo en voz alta"
              >
                <Volume2 size={17} />
              </button>
            </div>
            <div style={{ fontWeight: '800', fontSize: '0.98rem', marginBottom: '4px', color: coachMessage.severity === 'danger' ? 'var(--color-danger)' : 'var(--text-parchment-main)' }}>
              {coachMessage.title}
            </div>
            <div className="coach-speech-text">
              {coachMessage.text}
            </div>
          </div>
        </div>

        {/* Panel de Pistas Progresivas */}
        {activeHint && (
          <div style={{
            background: 'var(--color-gold-light)',
            border: '1.5px solid var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold-dark)', fontWeight: '800', fontSize: '0.85rem' }}>
              <Lightbulb size={16} />
              <span>Consejo de {activeCoach.name} ({currentHintLevel}/4):</span>
            </div>
            <div style={{ marginTop: '4px', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>
              {activeHint.text}
            </div>
          </div>
        )}

        {/* Banner de Fin de Partida en el Sidebar cuando isGameOver es true */}
        {isGameOver && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.14) 0%, rgba(59, 130, 246, 0.14) 100%)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            textAlign: 'center',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.98rem', fontWeight: '900', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
              🏁 Partida Finalizada
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', margin: '0 0 10px', lineHeight: '1.3' }}>
              {gameOverSummary?.title || 'La partida ha concluido.'}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={handleOpenReview}
                style={{ flex: '1 1 100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
              >
                <FileSearch size={16} />
                <span>🔍 Revisar y Analizar Partida</span>
              </button>
              <button
                className="btn-gold"
                onClick={() => setIsGameOverModalOpen(true)}
                style={{ flex: '1 1 calc(50% - 4px)', justifyContent: 'center', padding: '8px', fontSize: '0.78rem' }}
              >
                <Trophy size={14} />
                <span>Ver Resumen</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  if (onExitToMenu) onExitToMenu('inicio');
                }}
                style={{ flex: '1 1 calc(50% - 4px)', justifyContent: 'center', padding: '8px', fontSize: '0.78rem', color: '#ef4444', borderColor: '#fca5a5' }}
              >
                <Home size={14} color="#ef4444" />
                <span>Salir al Inicio</span>
              </button>
            </div>
          </div>
        )}

        {/* Grid Ergonómico de Botones de Acción Táctiles (Tutor y Ayudas Pedagógicas) */}
        <div className="game-actions-grid">
          {/* Botón Principal de Revisión de Partida */}
          <button
            className="btn-primary btn-full-row"
            onClick={handleOpenReview}
            disabled={moveHistory.length === 0}
            style={{ justifyContent: 'center', padding: '12px' }}
          >
            <FileSearch size={18} />
            <span>Revisar Partida (Game Review) 🔍</span>
          </button>

          {/* 1. Solicitar Pista Pedagógica */}
          <button
            className="btn-gold"
            onClick={handleRequestHint}
            disabled={!canRequestHint || currentHintLevel >= 4}
            style={{ opacity: (!canRequestHint || currentHintLevel >= 4) ? 0.6 : 1, justifyContent: 'center' }}
            title={handicapConfig.hintsMode === 'off' ? 'Pistas desactivadas en esta partida' : handicapConfig.hintsMode === 'limited' ? `Pistas restantes: ${remainingHints}` : 'Pistas ilimitadas'}
          >
            <Lightbulb size={17} />
            <span>
              {handicapConfig.hintsMode === 'off'
                ? 'Sin Pistas'
                : handicapConfig.hintsMode === 'limited'
                  ? `Pista (${remainingHints})`
                  : `Pista ${currentHintLevel > 0 ? `(${currentHintLevel}/4)` : ''}`}
            </span>
          </button>

          {/* 2. Preguntar ¿Por qué se jugó ese movimiento? */}
          <button
            className="btn-secondary"
            onClick={handleWhyMoveInquiry}
            disabled={!lastMove}
            style={{ justifyContent: 'center' }}
            title="Explicación del Maestro sobre la jugada anterior"
          >
            <HelpCircle size={17} />
            <span>¿Por qué?</span>
          </button>

          {/* 3. Deshacer Jugada */}
          <button
            className="btn-secondary"
            onClick={handleUndoMove}
            disabled={!canUndo}
            title={handicapConfig.takebacksMode === 'off' ? 'Deshacer desactivado en esta partida' : handicapConfig.takebacksMode === 'limited' ? `Retrocesos restantes: ${remainingTakebacks}` : 'Deshacer jugada'}
            style={{ opacity: !canUndo ? 0.6 : 1, justifyContent: 'center' }}
          >
            <RotateCcw size={17} />
            <span>
              {handicapConfig.takebacksMode === 'off'
                ? 'Sin Deshacer'
                : handicapConfig.takebacksMode === 'limited'
                  ? `Deshacer (${remainingTakebacks})`
                  : 'Deshacer'}
            </span>
          </button>
        </div>

        {/* Historial de Jugadas en Notación Algebraica (Al fondo de la vista) */}
        <div style={{
          background: 'var(--bg-parchment-card)',
          border: '1.5px solid var(--bg-parchment-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          maxHeight: '120px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Historial de Partida
          </div>
          {moveHistory.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', fontStyle: 'italic' }}>
              Las jugadas aparecerán aquí a medida que se jueguen.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.80rem' }}>
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ color: 'var(--text-parchment-muted)', width: '18px' }}>{i + 1}.</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-parchment-main)' }}>{moveHistory[i * 2]?.san}</span>
                  {moveHistory[i * 2 + 1] && (
                    <span style={{ color: 'var(--color-gold-dark)' }}>{moveHistory[i * 2 + 1]?.san}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SELECCIÓN DE MODALIDAD DE JUEGO */}
      <GameModeModal
        isOpen={isModeModalOpen}
        onClose={() => {
          setIsModeModalOpen(false);
        }}
        onSelectBotMode={handleSelectBotMode}
        onSelectPassAndPlay={handleSelectPassAndPlay}
        onSelectP2P={onOpenP2P}
        onSelectVariant={(variantKey) => {
          setGameVariant(variantKey);
          setGameMode('bot');
          setIsModeModalOpen(false);
          setShowColorModal(true);
        }}
        onOpenRobotsView={onOpenRobots}
        activeBot={botToPlay}
      />

      {/* MODAL DE ELECCIÓN DE COLOR (BLANCAS / NEGRAS / ALEATORIO) */}
      {showColorModal && (
        <div className="modal-overlay" onClick={() => { setShowColorModal(false); setIsModeModalOpen(true); }}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { setShowColorModal(false); setIsModeModalOpen(true); }}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}
              title="Volver a selección de modalidades"
            >
              <X size={20} />
            </button>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚔️</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: '0 0 6px' }}>
              ¿Con qué bando deseas jugar?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted)', marginBottom: '20px' }}>
              Enfrentándote a <strong>{botToPlay?.name || 'Robot'}</strong> ({botToPlay?.elo || 600} Elo)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <button
                className="btn-gold"
                onClick={() => handleSelectColorAndStart('white')}
                style={{ padding: '12px 16px', justifyContent: 'center', fontSize: '0.95rem' }}
              >
                <span>⚪ Jugar con Blancas (Mueves Primero)</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => handleSelectColorAndStart('black')}
                style={{ padding: '12px 16px', justifyContent: 'center', fontSize: '0.95rem', background: '#1e293b', color: '#ffffff', border: '1px solid #475569' }}
              >
                <span>⚫ Jugar con Negras (Mueve {botToPlay?.name || 'Robot'})</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => handleSelectColorAndStart('random')}
                style={{ padding: '10px 16px', justifyContent: 'center', fontSize: '0.88rem' }}
              >
                <Shuffle size={16} />
                <span>🎲 Bando Aleatorio (50% / 50%)</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setIsHandicapModalOpen(true)}
                style={{
                  padding: '10px 16px',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  border: handicapConfig.enabled ? '1.5px solid var(--color-gold)' : '1px dashed var(--bg-parchment-border)',
                  background: handicapConfig.enabled ? 'var(--color-gold-light)' : 'transparent',
                  color: handicapConfig.enabled ? 'var(--color-gold-dark)' : 'var(--color-primary)'
                }}
              >
                <Scale size={16} />
                <span>{handicapConfig.enabled ? `⚡ Ventajas Activas: ${getHandicapSummary(handicapConfig)}` : '⚙️ Configurar Ventajas / Hándicap (Opcional)'}</span>
              </button>

              {/* Selector de Reloj de Ajedrez (Fase 5) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', border: '1px solid var(--bg-parchment-border)', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                  <span>⏱️ Reloj de Ajedrez:</span>
                </div>
                <select
                  value={timeControl}
                  onChange={(e) => setTimeControl(e.target.value)}
                  style={{
                    background: 'var(--bg-parchment-card)',
                    border: '1px solid var(--color-gold)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: 'var(--text-parchment-main)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="unlimited">Sin Tiempo (Infinito)</option>
                  <option value="10m">Rápida (10 min)</option>
                  <option value="5m3s">Blitz (5 min + 3s)</option>
                  <option value="3m2s">Blitz Rápido (3 min + 2s)</option>
                  <option value="1m">Bala (1 min)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAUSA Y NAVEGACIÓN DE JUEGO */}
      {isPauseMenuOpen && (
        <div className="modal-overlay" onClick={() => setIsPauseMenuOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '460px', textAlign: 'center', padding: '22px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                ⏸️
              </div>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-parchment-main)', margin: '0 0 4px' }}>
              Partida en Pausa
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '0 0 18px' }}>
              El tablero está pausado. ¿Qué deseas hacer?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-gold"
                onClick={() => setIsPauseMenuOpen(false)}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
              >
                <Play size={18} />
                <span>▶ Reanudar Partida</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  setIsPauseMenuOpen(false);
                  handleRestartGame();
                }}
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem' }}
              >
                <RotateCcw size={16} />
                <span>🔄 Reiniciar Partida Actual</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  setIsPauseMenuOpen(false);
                  handleOpenModalidad();
                }}
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem' }}
              >
                <Swords size={16} />
                <span>🎮 Cambiar Modalidad (Robots / 2 Jugadores / P2P)</span>
              </button>

              {/* Botón Principal de Salir a Home */}
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsPauseMenuOpen(false);
                  if (onExitToMenu) onExitToMenu('inicio');
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.90rem',
                  fontWeight: '800',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.08)'
                }}
              >
                <Home size={17} color="#ef4444" />
                <span>🚪 Salir de la Partida (Ir a Inicio)</span>
              </button>

              <div style={{ height: '1px', background: 'var(--bg-parchment-border)', margin: '6px 0' }} />

              <div style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textAlign: 'left', marginBottom: '2px' }}>
                IR A OTRA SECCIÓN DEL MENÚ PRINCIPAL:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onExitToMenu) onExitToMenu('inicio');
                  }}
                  style={{ padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px' }}
                >
                  <Home size={15} color="#f59e0b" />
                  <span>Inicio</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onExitToMenu) onExitToMenu('aprender');
                  }}
                  style={{ padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px' }}
                >
                  <BookOpen size={15} color="#10b981" />
                  <span>Aprender</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onExitToMenu) onExitToMenu('robots');
                  }}
                  style={{ padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px' }}
                >
                  <Bot size={15} color="#3b82f6" />
                  <span>Robots</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onExitToMenu) onExitToMenu('problemas');
                  }}
                  style={{ padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px' }}
                >
                  <Puzzle size={15} color="#f59e0b" />
                  <span>Problemas</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onExitToMenu) onExitToMenu('yo');
                  }}
                  style={{ padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px' }}
                >
                  <User size={15} color="#a855f7" />
                  <span>Mi Perfil & Tienda</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    if (onOpenBugReport) {
                      onOpenBugReport({
                        view: 'jugar',
                        game: {
                          botName: botToPlay?.name || 'Robot',
                          botElo: botToPlay?.elo || 600,
                          moveCount: Math.floor((moveHistory?.length || 0) / 2) + 1,
                          pgn: game?.pgn?.() || ''
                        },
                        fen: game?.fen?.() || '',
                        turn: game?.turn?.() || 'w',
                        orientation: playerColor
                      });
                    }
                  }}
                  style={{ gridColumn: '1 / -1', padding: '8px', fontSize: '0.80rem', justifyContent: 'center', gap: '6px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                >
                  <Bug size={15} color="#ef4444" />
                  <span>Reportar Error en esta Partida</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Game Review */}
      <GameReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        reviewData={reviewData}
        fenHistory={fenHistory}
        moveHistory={moveHistory}
        botOpponent={botToPlay}
      />

      {/* Modal de Fin de Partida (Resumen Post-Juego, Análisis y Salida) */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={() => setIsGameOverModalOpen(false)}
        summaryData={gameOverSummary}
        currentUser={currentUser}
        botOpponent={botToPlay}
        gameMode={gameMode}
        playerColor={playerColor}
        activeCoach={activeCoach}
        onOpenReview={() => {
          setIsGameOverModalOpen(false);
          handleOpenReview();
        }}
        onOpenVictoryCard={() => {
          setIsVictoryCardOpen(true);
        }}
        onRestartGame={() => {
          setIsGameOverModalOpen(false);
          handleRestartGame();
        }}
        onOpenRobots={() => {
          setIsGameOverModalOpen(false);
          if (onOpenRobots) onOpenRobots();
        }}
        onExitToMenu={(tab = 'inicio') => {
          setIsGameOverModalOpen(false);
          if (onExitToMenu) onExitToMenu(tab);
        }}
      />

      {/* Modal de Tarjeta de Victoria / Cromo Compartible en WhatsApp (Fase 5) */}
      <VictoryCardModal
        isOpen={isVictoryCardOpen}
        onClose={() => setIsVictoryCardOpen(false)}
        currentUser={currentUser}
        opponent={botToPlay}
        summary={gameOverSummary}
        moveCount={Math.floor((moveHistory?.length || 0) / 2) + 1}
        accuracy={Math.min(96, Math.max(72, Math.round(100 - (usedHintsCount * 4))))}
      />

      {/* Modal de Configuración y Negociación de Ventajas / Hándicap */}
      <HandicapConfigModal
        isOpen={isHandicapModalOpen}
        onClose={() => setIsHandicapModalOpen(false)}
        initialConfig={handicapConfig}
        onApplyConfig={handleSaveHandicap}
        gameMode={gameMode}
        opponentName={gameMode === 'pass_and_play' ? 'Jugador 2' : (botToPlay?.name || 'Robot')}
        playerName={currentUser?.name || 'Estudiante'}
      />
    </div>
  );
};
