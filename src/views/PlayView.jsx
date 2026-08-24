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
import { getStartingFenForVariant, getVariantById, checkVariantWinCondition } from '../engine/variantsEngine';
import { createChessGame, isKinglessFen } from '../engine/kinglessEngine';
import { VariantRulesModal } from '../components/Variants/VariantRulesModal';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { audioManager } from '../engine/audio';
import { voiceEngine } from '../engine/voiceEngine';
import { useUser } from '../context/UserContext';
import { getCapturedPieces } from '../engine/capturedPieces';
import { CapturedPiecesBar } from '../components/ChessBoard/CapturedPiecesBar';
import { OnlineBadge } from '../components/FamilyPresence/OnlineBadge';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { FamilyChallengeDialog } from '../components/FamilyChallenges/FamilyChallengeDialog';
import { normalizeUserKey } from '../engine/cloudSync';
import { DEFAULT_JUNVILL_USERS } from '../context/UserContext';
import confetti from 'canvas-confetti';
import { Swords, Lightbulb, HelpCircle, RotateCcw, Play, RefreshCw, Settings, ShieldAlert, Sparkles, Trophy, CheckCircle, UserCheck, FileSearch, Globe, Volume2, VolumeX, Shuffle, Users, Bot, Maximize, Minimize, Pause, BookOpen, Puzzle, User, Home, ArrowLeft, Scale, X, Bug, Save, Trash2, Download, Shield } from 'lucide-react';

export const PlayView = ({ 
  activeBot = null, 
  initialBotMatch = null, 
  onOpenP2P, 
  onOpenRobots, 
  onExitToMenu, 
  onExitMatch,
  onOpenBugReport 
}) => {
  const { currentUser, users, isUserOnline, updateCurrentUser, recordGameResult, recordBotWin, pendingInvitationsForMe, acceptFamilyInvitation, declineFamilyInvitation, sendFamilyInvitation, activeP2PGame, clearActiveP2PGame, refreshInvitationsNow, isRefreshingInvitations } = useUser();
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [challengeOpponent, setChallengeOpponent] = useState(null);
  const [customRoomCodeInput, setCustomRoomCodeInput] = useState('');
  const [isVariantRulesOpen, setIsVariantRulesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAssistanceDisabled, setIsAssistanceDisabled] = useState(false);
  const { isInstalled, triggerInstall } = usePWAInstall();

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

  const targetBotProp = activeBot || initialBotMatch;
  const [savedGame, setSavedGame] = useState(() => loadSavedGame());
  const initialSaved = savedGame;

  // Si se pasó un bot específico, entramos directo a jugar contra ese bot
  // Si no, mostramos el Hub no flotante donde aparece la partida en curso (si existe) o el selector
  const [isPlayingMatch, setIsPlayingMatch] = useState(() => Boolean(targetBotProp));

  const isResumingSaved = Boolean(initialSaved && (!targetBotProp || targetBotProp.id === initialSaved.botId));

  const initialBot = (isResumingSaved && initialSaved?.botId)
    ? (BOT_ROSTER.find(b => b.id === initialSaved.botId) || BOT_ROSTER[0])
    : (targetBotProp || BOT_ROSTER[0]);

  const [currentBot, setCurrentBot] = useState(initialBot);
  const botToPlay = targetBotProp || currentBot || BOT_ROSTER[0];
  const activeCoachId = currentUser?.coachSettings?.coachAvatar || 'coach_aurelio';
  const activeCoach = getCoachById(activeCoachId) || COACHES_LIST[0] || { id: 'coach_aurelio', name: 'Maestro Aurelio', title: 'Tutor Principal' };

  const [game, setGame] = useState(() => {
    if (isResumingSaved && initialSaved?.fen) {
      try {
        return createChessGame(initialSaved.fen);
      } catch (e) {}
    }
    return createChessGame();
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
  const currentWhiteSecondsRef = useRef((isResumingSaved && initialSaved?.whiteTime) ?? null);
  const currentBlackSecondsRef = useRef((isResumingSaved && initialSaved?.blackTime) ?? null);
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
      // Filtrar estrictamente solo las piezas que TIENEN jugadas legales posibles en la posición actual
      const legalMoves = game.moves({ verbose: true });
      const availablePieces = Array.from(new Set(legalMoves.map(m => m.piece)));

      // Solo elegir entre piezas con movimientos reales para evitar jugadas imposibles
      const candidateFaces = availablePieces.length > 0 ? availablePieces : ['p', 'n'];
      const picked = candidateFaces[Math.floor(Math.random() * candidateFaces.length)];
      
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

  // Sincronizar nuevo bot seleccionado desde RobotsView o HomeView
  useEffect(() => {
    const selectedBot = activeBot || initialBotMatch;
    if (selectedBot) {
      setCurrentBot(selectedBot);
      setBotLevel(selectedBot.difficultyLevel || 1);
      setGame(createChessGame());
      setFenHistory(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
      setMoveHistory([]);
      setLastMove(null);
      setIsGameOver(false);
      setIsGameOverModalOpen(false);
      setIsModeModalOpen(false);
      setIsVictoryCardOpen(false);
      setIsBotThinking(false);
      setCoachMessage({
        title: `Partida contra ${selectedBot.name}`,
        text: `"${selectedBot.greeting || '¡A jugar ajedrez!'}"`,
        severity: 'neutral'
      });
    }
  }, [activeBot?.id, initialBotMatch?.id]);

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
    if (isKinglessFen(chessGame.fen())) {
      return { isDraw: false };
    }
    if (chessGame.isStalemate && chessGame.isStalemate()) {
      return {
        isDraw: true,
        title: '🤝 Tablas por Rey Ahogado',
        text: 'El rey no está en jaque, pero el jugador en turno no tiene ninguna jugada legal disponible. ¡Empate por ahogado!'
      };
    }
    if (chessGame.isInsufficientMaterial && chessGame.isInsufficientMaterial()) {
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
    const updatedGame = createChessGame(newFen);
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

    // COMPROBAR VICTORIA ESPECIAL POR VARIANTE (Rey de la Colina o Minijuegos Pedagógicos)
    const variantWin = checkVariantWinCondition(updatedGame, moveResult, gameVariant);
    if (variantWin) {
      const isPlayerWin = moveResult.color === (playerColor === 'white' ? 'w' : 'b');
      const winnerName = isPlayerWin 
        ? (currentUser?.name || 'Estudiante') 
        : (gameMode === 'pass_and_play' ? (moveResult.color === 'w' ? 'Jugador 1 (Blancas)' : 'Jugador 2 (Negras)') : (botToPlay?.name || 'Robot'));
      try { audioManager?.playVictory?.(); } catch (e) {}
      confetti({ particleCount: 120, spread: 80 });
      setIsGameOver(true);
      setGameOverSummary({
        title: variantWin.title,
        subtitle: variantWin.subtitle,
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
      const legalMoves = g.moves({ verbose: true });
      const availablePieces = Array.from(new Set(legalMoves.map(m => m.piece)));
      const candidateFaces = availablePieces.length > 0 ? availablePieces : ['p', 'n'];
      botAllowedPiece = candidateFaces[Math.floor(Math.random() * candidateFaces.length)];
    }

    const botMove = getBestBotMove(fen, botLevel, botAllowedPiece, gameVariant, botToPlay?.id);
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
        const nextGame = createChessGame(g.fen());
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
          setFenHistory(prev => [...prev, nextFen]);
          setAnimatingMove(null);

          const nextFen = nextGame.fen();

          // COMPROBAR VICTORIA ESPECIAL POR VARIANTE DEL BOT (Rey de la Colina o Minijuegos)
          const variantWin = checkVariantWinCondition(nextGame, result, gameVariant);
          if (variantWin) {
            setIsGameOver(true);
            setGameOverSummary({
              title: variantWin.title,
              subtitle: variantWin.subtitle,
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
    
    const startingFen = getStartingFenForVariant(gameVariant, handicapConfig);
    const replayGame = new Chess(startingFen);
    const newFenHistory = [startingFen];
    for (const m of newMoveHistory) {
      try {
        replayGame.move(m);
        newFenHistory.push(replayGame.fen());
      } catch (e) {}
    }

    const undoneGame = new Chess(replayGame.fen());

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
        : 'Se deshizo tu última jugada y la respuesta del rival. ¡Es tu turno de nuevo!',
      severity: 'neutral'
    });
  };

  const handleResumeSavedGame = () => {
    const saved = loadSavedGame();
    if (saved) {
      setSavedGame(saved);
      if (saved.botId) {
        const found = BOT_ROSTER.find(b => b.id === saved.botId) || BOT_ROSTER[0];
        setCurrentBot(found);
        setBotLevel(found.difficultyLevel || 1);
      }
      if (saved.fen) {
        setGame(createChessGame(saved.fen));
      }
      if (saved.fenHistory) setFenHistory(saved.fenHistory);
      if (saved.moveHistory) setMoveHistory(saved.moveHistory);
      if (saved.lastMove) setLastMove(saved.lastMove);
      if (saved.gameMode) setGameMode(saved.gameMode);
      if (saved.gameVariant) setGameVariant(saved.gameVariant);
      if (saved.playerColor) setPlayerColor(saved.playerColor);
      if (saved.timeControl) setTimeControl(saved.timeControl);
      if (saved.handicapConfig) setHandicapConfig(saved.handicapConfig);
      if (saved.usedHintsCount) setUsedHintsCount(saved.usedHintsCount);
      if (saved.usedTakebacksCount) setUsedTakebacksCount(saved.usedTakebacksCount);
      if (typeof saved.whiteTime === 'number') currentWhiteSecondsRef.current = saved.whiteTime;
      if (typeof saved.blackTime === 'number') currentBlackSecondsRef.current = saved.blackTime;
      setIsGameOver(false);
      setIsGameOverModalOpen(false);
      setIsPlayingMatch(true);
    }
  };

  const handleSendChallenge = ({ opponent, timeControl: tc, withAssistance: wa, gameVariant: gv, customMessage: cm }) => {
    const inv = sendFamilyInvitation(opponent, tc, wa, null, gv, cm);
    setChallengeOpponent(null);
    if (inv && onOpenP2P) {
      onOpenP2P(inv.roomId, inv.isMutualMatch ? 'join' : 'host');
    }
  };

  const handleDiscardSavedGame = () => {
    if (window.confirm('¿Seguro que deseas descartar la partida en curso? Se perderá el avance actual.')) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      setSavedGame(null);
      setGame(createChessGame());
      setFenHistory(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1']);
      setMoveHistory([]);
      setLastMove(null);
      setIsGameOver(false);
    }
  };

  const handlePauseAndExit = () => {
    setIsPauseMenuOpen(false);
    if (!isGameOver && (moveHistory.length > 0 || game.fen() !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')) {
      try {
        const payload = {
          fen: game.fen(),
          fenHistory,
          moveHistory,
          lastMove,
          gameMode,
          gameVariant,
          timeControl,
          playerColor,
          botId: botToPlay?.id,
          botName: gameMode === 'pass_and_play' ? '2 Jugadores' : (botToPlay?.name || 'Robot'),
          whiteTime: currentWhiteSecondsRef.current,
          blackTime: currentBlackSecondsRef.current,
          handicapConfig,
          usedHintsCount,
          usedTakebacksCount,
          updatedAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setSavedGame(payload);
      } catch (e) {}
    }
    setIsPlayingMatch(false);
  };

  const handleOpenModalidad = () => {
    handlePauseAndExit();
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

  const handleStartMatch = ({ opponentMode = 'bot', bot = null, variantId = 'standard' }) => {
    setGameVariant(variantId);
    setGameMode(opponentMode);
    if (bot) {
      setCurrentBot(bot);
      setBotLevel(bot.difficultyLevel || 1);
    }
    setIsModeModalOpen(false);

    if (opponentMode === 'bot') {
      setShowColorModal(true);
    } else {
      handleSelectPassAndPlay(variantId);
      setIsPlayingMatch(true);
    }
  };

  const handleSelectPassAndPlay = (variantKey = gameVariant) => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setGameMode('pass_and_play');
    setGameVariant(variantKey);
    setIsModeModalOpen(false);
    setShowColorModal(false);
    
    const startingFen = getStartingFenForVariant(variantKey, handicapConfig);
    const newG = createChessGame(startingFen);
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
    setCurrentDiceRoll(null);

    const variantData = getVariantById(variantKey);
    const summary = getHandicapSummary(handicapConfig);
    setCoachMessage({
      title: `${variantData.icon} 2 Jugadores: ${variantData.name}`,
      text: handicapConfig.enabled 
        ? `Partida iniciada (${summary}). Mueven las Blancas (Jugador 1).`
        : `Partida de ${variantData.name} iniciada. Mueven las Blancas (Jugador 1). Ambos juegan en esta misma pantalla alternando turnos.`,
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
    setIsPlayingMatch(true);

    const startingFen = getStartingFenForVariant(gameVariant, handicapConfig);
    const newG = createChessGame(startingFen);
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
    setCurrentDiceRoll(null);

    const variantData = getVariantById(gameVariant);
    const summary = getHandicapSummary(handicapConfig);
    setCoachMessage({
      title: `${variantData.icon} ${variantData.name} vs ${botToPlay?.name || 'Robot'}`,
      text: finalColor === 'black' 
        ? `Modalidad ${variantData.name}. Juegas con Negras. ${botToPlay?.name || 'Robot'} moverá primero.${handicapConfig.enabled ? ` (${summary})` : ''}` 
        : `${variantData.description} ${botToPlay?.greeting || '¡A jugar!'}${handicapConfig.enabled ? ` • Ventajas: ${summary}` : ''}`,
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
    if (!moveHistory || moveHistory.length === 0) {
      alert('Juega al menos un movimiento para poder analizar la partida con el motor.');
      return;
    }

    // Asegurar que fenHistory tenga la longitud exacta (1 por cada jugada + la inicial)
    let validFenHistory = fenHistory;
    if (!validFenHistory || validFenHistory.length !== moveHistory.length + 1) {
      const startingFen = getStartingFenForVariant(gameVariant, handicapConfig);
      const replayGame = new Chess(startingFen);
      validFenHistory = [startingFen];
      for (const m of moveHistory) {
        try {
          replayGame.move(m);
          validFenHistory.push(replayGame.fen());
        } catch (e) {}
      }
      setFenHistory(validFenHistory);
    }

    const analysis = analyzeFullGame(validFenHistory, moveHistory);
    if (analysis) {
      setReviewData(analysis);
      setIsReviewOpen(true);
    } else {
      alert('No se pudo generar el análisis. Realiza al menos 1 jugada completa.');
    }
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
      if (isKinglessFen(fen)) return [];
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

  const capturedPieces = useMemo(() => getCapturedPieces(game.fen()), [game]);

  
  // =========================================================================
  // PANTALLA PRINCIPAL: ¿CON QUIÉN QUIERES JUGAR HOY? (HUB DEDICADO NO FLOTANTE)
  // =========================================================================
  const familyMembersToPlay = (() => {
    const fromUsers = (users || []).filter(u => u && u.id !== currentUser?.id && normalizeUserKey(u.id || u.name) !== normalizeUserKey(currentUser?.id));
    if (fromUsers.length > 0) return fromUsers;
    return DEFAULT_JUNVILL_USERS.filter(u => normalizeUserKey(u.id || u.name) !== normalizeUserKey(currentUser?.name || 'martin'));
  })();

  if (!isPlayingMatch) {
    return (
      <div className="play-hub-screen animate-fade-in" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px', padding: '10px 8px 50px' }}>
        {/* CABECERA PRINCIPAL */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
          border: '2px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '20px',
          padding: '22px 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(234, 179, 8, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 4px 16px rgba(234, 179, 8, 0.4)',
              flexShrink: 0
            }}>
              ⚔️
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif, Cinzel, serif)', fontSize: '1.65rem', fontWeight: '900', color: '#fde047', margin: '0 0 4px' }}>
                ¿Con quién quieres jugar hoy?
              </h1>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
                Elige a un familiar en línea, desafía a un robot maestro o retoma tus partidas guardadas.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={refreshInvitationsNow}
              disabled={isRefreshingInvitations}
              style={{
                padding: '10px 16px',
                fontSize: '0.86rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1.5px solid rgba(234, 179, 8, 0.5)',
                color: '#fde047'
              }}
              title="Buscar y comprobar retos e invitaciones de amigos y familiares de inmediato"
            >
              <RefreshCw size={16} className={isRefreshingInvitations ? 'spin' : ''} style={{ animation: isRefreshingInvitations ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRefreshingInvitations ? 'Buscando Retos...' : 'Buscar Retos de Amigos 🔍'}</span>
            </button>

            <button
              type="button"
              className="btn-gold"
              onClick={() => onOpenP2P && onOpenP2P()}
              style={{ padding: '10px 18px', fontSize: '0.86rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={16} />
              <span>Crear / Unirse a Sala P2P</span>
            </button>
          </div>
        </div>

        {/* 1. SECCIÓN: 📬 RETOS RECIBIDOS DE HUMANOS */}
        {pendingInvitationsForMe && pendingInvitationsForMe.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '2px solid #eab308',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 0 25px rgba(234, 179, 8, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.4rem' }}>📬</span>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#facc15' }}>
                Retos y Desafíos Recibidos de Humanos ({pendingInvitationsForMe.length})
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingInvitationsForMe.map(inv => (
                <div
                  key={inv.id}
                  style={{
                    background: '#0f172a',
                    border: '1.5px solid rgba(234, 179, 8, 0.4)',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eab308', flexShrink: 0 }}>
                      {inv.fromUser?.avatarConfig ? (
                        <DynamicAvatar config={inv.fromUser.avatarConfig} size={46} />
                      ) : (
                        <AvatarIcon avatarId={inv.fromUser?.avatar || 'teen_gamer'} size={46} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>¡{inv.fromUser?.name || 'Un familiar'} te está retando!</span>
                        <OnlineBadge isOnline={true} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                        Modalidad: <strong style={{ color: '#38bdf8' }}>{inv.variantName || 'Ajedrez Tradicional'}</strong> • ⏱️ {Math.round((inv.timeControl || 300) / 60)}m • Sala: <code>{inv.roomId}</code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => {
                        const accepted = acceptFamilyInvitation(inv.id);
                        if (accepted && onOpenP2P) onOpenP2P(accepted.roomId, 'join');
                      }}
                      style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: '900', gap: '6px' }}
                    >
                      <Swords size={16} />
                      <span>Aceptar y Jugar Ahora ⚔️</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => declineFamilyInvitation(inv.id)}
                      style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#ef4444' }}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SECCIÓN: ⏳ MIS PARTIDAS PENDIENTES Y EN CURSO */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(234, 179, 8, 0.3)',
          borderRadius: '18px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>⏳</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#facc15' }}>
                  Mis Partidas Pendientes y en Curso
                </h2>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                  Todas las partidas activas que ya iniciaste para retomarlas donde las dejaste.
                </p>
              </div>
            </div>
            {(savedGame || activeP2PGame) && (
              <span style={{ fontSize: '0.78rem', background: '#eab308', color: '#0f172a', fontWeight: '900', padding: '2px 8px', borderRadius: '9999px' }}>
                {(savedGame ? 1 : 0) + (activeP2PGame ? 1 : 0)} Partida(s) Activa(s)
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {/* A) Partida P2P Familiar en Curso */}
            {activeP2PGame && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1.5px solid #38bdf8',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>👥</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#38bdf8' }}>
                        Partida P2P en Red (Familiar)
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        Sala: <code>{activeP2PGame.roomId}</code> • Turno: <strong style={{ color: '#facc15' }}>{activeP2PGame.turn === 'w' ? 'Blancas' : 'Negras'}</strong>
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.70rem', background: '#0284c7', color: 'white', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' }}>
                    Multijugador
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => onOpenP2P && onOpenP2P(activeP2PGame.roomId)}
                    style={{ flex: 1, padding: '9px', fontSize: '0.84rem', fontWeight: '900', justifyContent: 'center', gap: '6px' }}
                  >
                    <Play size={15} />
                    <span>Retomar Partida</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => clearActiveP2PGame && clearActiveP2PGame()}
                    style={{ padding: '9px 12px', fontSize: '0.80rem', color: '#ef4444' }}
                    title="Abandonar y descartar partida P2P"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* B) Partida contra Robot o Local en Curso */}
            {savedGame && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1.5px solid #eab308',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 15px rgba(234, 179, 8, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#fde047' }}>
                        Partida vs {savedGame.botName || 'Robot'}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        {savedGame.moveHistory?.length || 0} jugadas hechas • Juegas con <strong style={{ color: '#facc15' }}>{savedGame.playerColor === 'white' ? 'Blancas' : 'Negras'}</strong>
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.70rem', background: '#d97706', color: 'white', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' }}>
                    En Pausa
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={handleResumeSavedGame}
                    style={{ flex: 1, padding: '9px', fontSize: '0.84rem', fontWeight: '900', justifyContent: 'center', gap: '6px' }}
                  >
                    <Play size={15} />
                    <span>Retomar Partida</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleDiscardSavedGame}
                    style={{ padding: '9px 12px', fontSize: '0.80rem', color: '#ef4444' }}
                    title="Descartar y eliminar partida"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* C) Sin partidas pendientes */}
            {!savedGame && !activeP2PGame && (
              <div style={{
                gridColumn: '1 / -1',
                padding: '24px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.88rem',
                border: '1px dashed rgba(148, 163, 184, 0.2)',
                borderRadius: '12px'
              }}>
                ☕ No tienes partidas pendientes en pausa. ¡Elige con quién jugar abajo!
              </div>
            )}
          </div>
        </div>

        {/* 3. SECCIÓN: 👥 JUGAR CON LA FAMILIA (RETO DIRECTO MULTIJUGADOR) */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '18px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>👥</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#38bdf8' }}>
                  Miembros de la Familia en Tiempo Real
                </h2>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                  Reta a cualquier familiar conectado a ajedrez clásico o minijuegos.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {familyMembersToPlay.map(member => {
              const online = isUserOnline(member);
              return (
                <div
                  key={member.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: `1.5px solid ${online ? 'rgba(16, 185, 129, 0.6)' : 'rgba(51, 65, 85, 0.6)'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: online ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  <div style={{ position: 'relative', width: '58px', height: '58px', borderRadius: '50%', overflow: 'hidden', border: `2.5px solid ${online ? '#10b981' : '#64748b'}` }}>
                    {member.avatarConfig ? (
                      <DynamicAvatar config={member.avatarConfig} size={58} />
                    ) : (
                      <AvatarIcon avatarId={member.avatar || 'teen_gamer'} size={58} />
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#f8fafc' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '2px 0 6px' }}>
                      {member.title || 'Miembro Familiar'} • <strong style={{ color: '#facc15' }}>{member.elo || 600} Elo</strong>
                    </div>
                    <OnlineBadge isOnline={online} size="sm" />
                  </div>

                  <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => setChallengeOpponent(member)}
                      style={{ flex: 1, padding: '8px 10px', fontSize: '0.80rem', fontWeight: '900', justifyContent: 'center', gap: '4px' }}
                    >
                      <Swords size={14} />
                      <span>Retar ⚔️</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onOpenFamilyChat && onOpenFamilyChat(member)}
                      style={{ padding: '8px 12px', fontSize: '0.80rem', gap: '4px' }}
                      title={`Enviar mensaje a ${member.name}`}
                    >
                      💬
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. SECCIÓN: 🤖 ROBOTS MAESTROS DE LA ACADEMIA */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '18px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.3rem' }}>🤖</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#c084fc' }}>
                Robots Maestros de la Academia (Jugar contra la IA)
              </h2>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Desafía a los 6 bots con personalidades, aperturas y Elo progresivo.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {BOT_ROSTER.map(bot => (
              <div
                key={bot.id}
                onClick={() => {
                  setCurrentBot(bot);
                  setBotLevel(bot.difficultyLevel || 1);
                  setGameMode('bot');
                  setShowColorModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  border: '1.5px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#c084fc';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(192, 132, 252, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <BotAvatarRenderer bot={bot} size={48} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '900', color: '#f8fafc' }}>
                    {bot.name}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#facc15', fontWeight: '800' }}>
                    {bot.elo} Elo
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.70rem', color: '#94a3b8', lineHeight: 1.2 }}>
                  {bot.personality}
                </p>
                <button
                  type="button"
                  className="btn-gold"
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', fontWeight: '900', marginTop: 'auto' }}
                >
                  Jugar vs {bot.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SECCIÓN: 🎮 MINIJUEGOS Y VARIANTES LÚDICAS */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(251, 146, 60, 0.3)',
          borderRadius: '18px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.3rem' }}>🎮</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#fb923c' }}>
                Minijuegos y Modalidades Especiales
              </h2>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                Ajedrez con Dados, Sin Reyes, Hándicap o 2 Jugadores en el mismo dispositivo.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            <div
              onClick={() => handleSelectPassAndPlay('standard')}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1.5px solid #10b981',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>👥</div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.96rem', color: '#34d399', fontWeight: '900' }}>2 Jugadores (Pass & Play)</h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Juega cara a cara en la misma pantalla rotando el turno.</p>
            </div>

            <div
              onClick={() => {
                setGameVariant('dice_chess');
                setShowColorModal(true);
              }}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1.5px solid #ec4899',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>🎲</div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.96rem', color: '#f472b6', fontWeight: '900' }}>Dados Mágicos</h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>El dado decide qué tipo de pieza estás obligado a mover.</p>
            </div>

            <div
              onClick={() => {
                setGameVariant('king_of_the_hill');
                setShowColorModal(true);
              }}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1.5px solid #f59e0b',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>⛰️👑</div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.96rem', color: '#facc15', fontWeight: '900' }}>Rey de la Colina</h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Lleva tu Rey a cualquiera de las 4 casillas centrales para ganar.</p>
            </div>

            <div
              onClick={() => {
                setGameVariant('pawn_wars_pure');
                setShowColorModal(true);
              }}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1.5px solid #38bdf8',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>⚔️♟️</div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.96rem', color: '#38bdf8', fontWeight: '900' }}>Guerra de Peones Pura</h4>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>Sin reyes. 8 peones vs 8 peones: el primero que corone gana.</p>
            </div>
          </div>
        </div>

        {/* 6. SECCIÓN: 🌐 UNIRSE CON CÓDIGO DIRECTO */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1.5px solid rgba(148, 163, 184, 0.25)',
          borderRadius: '18px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: '900', color: '#f8fafc' }}>
              ¿Tienes un código de sala de 6 dígitos?
            </h3>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>
              Ingresa el código que te compartió tu familiar para conectarte a su partida.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={customRoomCodeInput}
              onChange={(e) => setCustomRoomCodeInput(e.target.value.toUpperCase())}
              placeholder="EJ: AB12"
              maxLength={8}
              style={{
                background: '#0f172a',
                border: '1.5px solid rgba(234, 179, 8, 0.5)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fde047',
                fontWeight: '900',
                fontSize: '0.95rem',
                letterSpacing: '2px',
                textAlign: 'center',
                width: '120px'
              }}
            />
            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                if (customRoomCodeInput.trim().length >= 3 && onOpenP2P) {
                  onOpenP2P(customRoomCodeInput.trim(), 'join');
                }
              }}
              disabled={customRoomCodeInput.trim().length < 3}
              style={{ padding: '8px 16px', fontSize: '0.84rem', fontWeight: '900' }}
            >
              Unirme a la Sala 🔗
            </button>
          </div>
        </div>

        {/* Modales disponibles en el Hub */}
        {challengeOpponent && (
          <FamilyChallengeDialog
            isOpen={Boolean(challengeOpponent)}
            onClose={() => setChallengeOpponent(null)}
            opponent={challengeOpponent}
            isOpponentOnline={isUserOnline(challengeOpponent)}
            onSendChallenge={handleSendChallenge}
          />
        )}

        {showColorModal && (
          <GameModeModal
            isOpen={showColorModal}
            onClose={() => setShowColorModal(false)}
            onSelectMode={handleStartGameWithColor}
            opponentName={gameMode === 'pass_and_play' ? 'Jugador 2' : (botToPlay?.name || 'Robot')}
            selectedVariant={gameVariant}
          />
        )}
      </div>
    );
  }


  return (
    <div className="game-container" style={{ position: 'relative' }}>
      {/* Banner flotante de reto pendiente entrante mientras se juega */}
      {pendingInvitationsForMe.length > 0 && !isPlayingMatch && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1.5px solid #eab308',
          borderRadius: '12px',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          boxShadow: '0 4px 20px rgba(234, 179, 8, 0.3)',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚔️</span>
            <div>
              <div style={{ fontWeight: '900', color: '#facc15', fontSize: '0.90rem' }}>
                ¡{pendingInvitationsForMe[0].fromUser?.name || 'Un familiar'} te ha retado a una partida!
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                ⏱️ {Math.round((pendingInvitationsForMe[0].timeControl || 300) / 60)}m • Sala: {pendingInvitationsForMe[0].roomId}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                const inv = acceptFamilyInvitation(pendingInvitationsForMe[0].id);
                if (inv && onOpenP2P) onOpenP2P(inv.roomId, 'join');
              }}
              style={{ padding: '7px 14px', fontSize: '0.82rem', fontWeight: '900', gap: '5px' }}
            >
              <Swords size={14} />
              <span>Aceptar Reto Familiar ⚔️</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => declineFamilyInvitation(pendingInvitationsForMe[0].id)}
              style={{ padding: '7px 10px', fontSize: '0.78rem' }}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* COLUMNA IZQUIERDA: OPONENTE + TABLERO + JUGADOR */}
      <div className="game-board-column">
        {/* Tarjeta del Oponente con Altura Fija Rigurosa */}
        <div className="game-opponent-card" style={{ position: 'relative' }}>
          {/* Burbuja Flotante de Reacción del Oponente */}
          <ReactionFloatingBubble reaction={opponentReaction} position="top" />

          <div className="game-card-left" style={{ gap: '8px' }}>
            {/* Botón de Pausa y Salir al Menú */}
            <button
              onClick={handlePauseAndExit}
              className="btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                height: '32px',
                gap: '5px',
                background: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold-dark)',
                fontWeight: '900'
              }}
              title="Pausar la partida, detener los relojes y volver al Centro de Partidas"
            >
              <Pause size={14} color="#f59e0b" />
              <span>Pausar y Salir</span>
            </button>
            <button
              onClick={() => setIsPauseMenuOpen(true)}
              className="btn-secondary"
              style={{ padding: '6px 8px', fontSize: '0.78rem', height: '32px', gap: '4px' }}
              title="Opciones avanzadas y menú de pausa"
            >
              <Settings size={14} />
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
              <div className="game-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span>{gameMode === 'pass_and_play' ? 'Jugador 2 (Negras)' : `${botToPlay?.name || 'Robot'} (${playerColor === 'white' ? 'Negras' : 'Blancas'})`}</span>
                
                {/* Piezas capturadas por el oponente en orden */}
                <CapturedPiecesBar
                  capturedList={playerColor === 'white' ? capturedPieces.capturedByBlack : capturedPieces.capturedByWhite}
                  advantage={playerColor === 'white' ? capturedPieces.blackAdvantage : capturedPieces.whiteAdvantage}
                  color={playerColor === 'white' ? 'w' : 'b'}
                />

                {gameVariant !== 'standard' && (
                  <button
                    onClick={() => setIsVariantRulesOpen(true)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.70rem',
                      fontWeight: '800',
                      borderRadius: 'var(--radius-full)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      background: 'rgba(56, 189, 248, 0.12)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                    title="Ver particularidades y reglas de esta modalidad"
                  >
                    <HelpCircle size={11} />
                    <span>Reglas</span>
                  </button>
                )}
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
            onTimeUpdate={(w, b) => {
              currentWhiteSecondsRef.current = w;
              currentBlackSecondsRef.current = b;
            }}
            initialWhiteSeconds={savedGame?.whiteTime}
            initialBlackSeconds={savedGame?.blackTime}
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
          showLegalMoves={!isAssistanceDisabled && handicapConfig.visualMoveGuide}
          dangerSquares={isAssistanceDisabled ? [] : dangerSquares}
          hintQuadrant={isAssistanceDisabled ? null : activeHint?.quadrant}
          hintSquare={isAssistanceDisabled ? null : activeHint?.square}
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
              <div className="game-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span>{currentUser?.name || 'Estudiante'} ({playerColor === 'white' ? 'Blancas' : 'Negras'})</span>
                
                {/* Piezas capturadas por el jugador local en orden */}
                <CapturedPiecesBar
                  capturedList={playerColor === 'white' ? capturedPieces.capturedByWhite : capturedPieces.capturedByBlack}
                  advantage={playerColor === 'white' ? capturedPieces.whiteAdvantage : capturedPieces.blackAdvantage}
                  color={playerColor === 'white' ? 'b' : 'w'}
                />
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

            {gameVariant !== 'standard' && (
              <button
                type="button"
                onClick={() => setIsVariantRulesOpen(true)}
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: 'var(--radius-full)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Ver reglas mínimas y particularidades de esta modalidad"
              >
                <HelpCircle size={14} color="#38bdf8" />
                <span>📜 Ver Reglas de {getVariantById(gameVariant).name}</span>
              </button>
            )}
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
          {/* BOTÓN RÁPIDO: MODO CLÁSICO / DESACTIVAR TODAS LAS AYUDAS */}
          <button
            type="button"
            className={isAssistanceDisabled ? "btn-primary btn-full-row" : "btn-secondary btn-full-row"}
            onClick={() => {
              setIsAssistanceDisabled(prev => !prev);
              setHints(null);
              setCurrentHintLevel(0);
            }}
            style={{
              justifyContent: 'center',
              padding: '10px 14px',
              fontSize: '0.85rem',
              fontWeight: '900',
              border: isAssistanceDisabled ? '2px solid #10b981' : '1.5px solid var(--color-gold)',
              background: isAssistanceDisabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.08)',
              color: isAssistanceDisabled ? '#10b981' : 'var(--text-parchment-main)',
              gap: '8px'
            }}
            title="Activar o desactivar todas las pistas, flechas y sugerencias del tutor de una sola vez"
          >
            {isAssistanceDisabled ? <Shield size={16} color="#10b981" /> : <Lightbulb size={16} color="#eab308" />}
            <span>{isAssistanceDisabled ? '🛡️ Ayudas Desactivadas (Modo Clásico Puro)' : '💡 Ayudas y Pistas: ACTIVAS (Clic para Desactivar Todas)'}</span>
          </button>

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
        onStartMatch={handleStartMatch}
        onSelectP2P={onOpenP2P}
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
              Modalidad: <strong style={{ color: 'var(--color-gold)' }}>{getVariantById(gameVariant).name}</strong> • vs <strong>{botToPlay?.name || 'Robot'}</strong> ({botToPlay?.elo || 600} Elo)
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
                  handlePauseAndExit();
                }}
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
              >
                <Pause size={16} color="#f59e0b" />
                <span>⏸️ Pausar y Salir al Centro de Partidas</span>
              </button>

              {!isInstalled && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setIsPauseMenuOpen(false);
                    triggerInstall();
                  }}
                  style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.86rem', color: '#facc15', borderColor: '#ca8a04', background: 'rgba(234, 179, 8, 0.12)' }}
                >
                  <Download size={16} color="#facc15" />
                  <span>📲 Instalar Aplicación (Modo Offline)</span>
                </button>
              )}

              {/* Opción 1: Salir Temporalmente (Guardar para Continuar Después) */}
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsPauseMenuOpen(false);
                  // Guardar explícitamente la partida en curso
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
                  if (onExitToMenu) onExitToMenu('inicio');
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  background: 'rgba(56, 189, 248, 0.08)'
                }}
                title="Guarda la posición actual para continuarla en cualquier momento"
              >
                <Save size={16} color="#38bdf8" />
                <span>Salir Temporalmente (Guardar Partida)</span>
              </button>

              {/* Opción 2: Salir y Eliminar Partida en Curso */}
              <button
                className="btn-secondary"
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas salir y eliminar la partida en curso? Se perderá el avance actual.')) {
                    setIsPauseMenuOpen(false);
                    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
                    if (onExitToMenu) onExitToMenu('inicio');
                  }
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.08)'
                }}
                title="Elimina la partida actual y vuelve al menú principal sin guardar"
              >
                <Trash2 size={16} color="#ef4444" />
                <span>Salir y Eliminar Partida</span>
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

      {/* Modal de Reglas Mínimas de la Variante */}
      <VariantRulesModal
        isOpen={isVariantRulesOpen}
        onClose={() => setIsVariantRulesOpen(false)}
        variantId={gameVariant}
      />
    </div>
  );
};
