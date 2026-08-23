import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { SafeChat } from '../components/SafeChat/SafeChat';
import { AvatarIcon } from '../assets/avatars';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { P2PEngine } from '../engine/p2pEngine';
import { useUser } from '../context/UserContext';
import { audioManager } from '../engine/audio';
import { QRCodeDisplay } from '../components/QRCodeModal/QRCodeDisplay';
import { HandicapConfigModal } from '../components/HandicapModal/HandicapConfigModal';
import { getHandicapFen, getHandicapSummary, DEFAULT_HANDICAP_CONFIG } from '../engine/handicapEngine';
import { getCapturedPieces } from '../engine/capturedPieces';
import { CapturedPiecesBar } from '../components/ChessBoard/CapturedPiecesBar';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import confetti from 'canvas-confetti';
import { 
  X, Globe, Copy, Check, QrCode, Play, Users, Clock, ShieldCheck, 
  Swords, RotateCcw, Flag, Award, AlertCircle, Maximize, Minimize, 
  Scale, RefreshCw, Eye, Sparkles, Heart, Flame, ThumbsUp, Crown, 
  MessageSquare, UserPlus 
} from 'lucide-react';

const CHEER_EMOJIS = [
  { emoji: '👏', label: '¡Gran jugada!' },
  { emoji: '🔥', label: '¡En llamas!' },
  { emoji: '😮', label: '¡Qué jugada!' },
  { emoji: '🧠', label: '¡Puro cálculo!' },
  { emoji: '👑', label: '¡Rey!' },
  { emoji: '🛡️', label: '¡Buena defensa!' }
];

export const P2PPlayModal = ({ isOpen, onClose, initialRoomId = null }) => {
  const { 
    currentUser, 
    activeGroup, 
    users, 
    recordGameResult, 
    sendFamilyInvitation,
    saveActiveP2PGame,
    clearActiveP2PGame,
    activeP2PGame
  } = useUser();
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

  // Modos de vista: 'lobby' | 'playing' | 'spectating' | 'gameover'
  const [mode, setMode] = useState('lobby');
  // Pestañas del lobby: 'family' | 'code' | 'spectator'
  const [lobbyTab, setLobbyTab] = useState(initialRoomId ? 'code' : 'family');
  
  // Código de sala (sin guiones)
  const [generatedRoomId, setGeneratedRoomId] = useState(() => P2PEngine.generateRoomId());
  const [roomId, setRoomId] = useState(initialRoomId ? P2PEngine.cleanRoomId(initialRoomId) : '');
  const [inputRoomId, setInputRoomId] = useState(initialRoomId ? P2PEngine.cleanRoomId(initialRoomId) : '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHostActive, setIsHostActive] = useState(false);

  // Opciones de partida
  const [timeControl, setTimeControl] = useState(300); // 300 seg (5 min)
  const [assignedColor, setAssignedColor] = useState('random'); // 'random' (50/50 al azar por defecto) | 'white' | 'black'
  const [withAssistance, setWithAssistance] = useState(false); // Modo Clásico Puro sin ayudas por defecto
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isP2PPaused, setIsP2PPaused] = useState(false);

  // Configuración de Hándicap
  const [handicapConfig, setHandicapConfig] = useState(DEFAULT_HANDICAP_CONFIG);
  const [isHandicapModalOpen, setIsHandicapModalOpen] = useState(false);
  const [incomingHandicapOffer, setIncomingHandicapOffer] = useState(null);

  // Estado del juego
  const [game, setGame] = useState(() => new Chess());
  const [lastMove, setLastMove] = useState(null);
  const [opponentProfile, setOpponentProfile] = useState({ name: 'Rival P2P', avatar: 'knight', elo: 600 });
  const [whitePlayerProfile, setWhitePlayerProfile] = useState(null);
  const [blackPlayerProfile, setBlackPlayerProfile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [drawOffered, setDrawOffered] = useState(false);
  const [gameResultReason, setGameResultReason] = useState('');

  // Reacciones en vivo y Espectadores
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [activeCheerReactions, setActiveCheerReactions] = useState([]);

  // Retos directos familiares
  const [selectedFamilyOpponent, setSelectedFamilyOpponent] = useState(null);

  const p2pRef = useRef(null);

  // Escuchar emparejamiento mutuo entre dos familiares que se retaron al tiempo
  useEffect(() => {
    const handleMutualMatch = (e) => {
      if (e.detail?.roomId) {
        setStatusMessage(`¡Reto mutuo establecido con ${e.detail.opponent?.name || 'familiar'}! Conectando partida...`);
        setRoomId(e.detail.roomId);
        setInputRoomId(e.detail.roomId);
        handleJoinSubmit(e.detail.roomId);
      }
    };
    window.addEventListener('junvill_mutual_match', handleMutualMatch);
    return () => window.removeEventListener('junvill_mutual_match', handleMutualMatch);
  }, []);

  // Iniciar P2P Engine
  useEffect(() => {
    if (!isOpen) {
      if (p2pRef.current) {
        p2pRef.current.destroy();
        p2pRef.current = null;
      }
      setIsHostActive(false);
      setIsConnecting(false);
      setErrorMessage('');
      setMode('lobby');
      return;
    }

    const p2p = new P2PEngine();
    p2pRef.current = p2p;

    p2p.on('open', ({ roomId }) => {
      setRoomId(roomId);
      setIsHostActive(true);
      setIsConnecting(false);
      setStatusMessage(`¡Sala ${roomId} creada! Esperando a que tu amigo o familiar se una...`);
    });

    p2p.on('connected', ({ isHost, isSpectator }) => {
      audioManager.playVictory();
      setErrorMessage('');
      
      if (isSpectator) {
        setStatusMessage('¡Conectado como Espectador en Vivo! Observando partida...');
        setMode('spectating');
      } else {
        setStatusMessage('¡Rival conectado! Iniciando partida...');
        setMode('playing');

        // Asignación de colores justa: Si está en 'random', sortear 50/50
        let myFinalColor = assignedColor;
        if (isHost) {
          if (assignedColor === 'random' || !assignedColor) {
            myFinalColor = Math.random() < 0.5 ? 'white' : 'black';
            setAssignedColor(myFinalColor);
          }
          const guestFinalColor = myFinalColor === 'white' ? 'black' : 'white';

          // Sincronizar perfiles y color asignado al rival
          p2p.send({
            type: 'PROFILE_SYNC',
            profile: {
              name: currentUser?.name || 'Jugador Junvill',
              avatar: currentUser?.avatar || 'teen_gamer',
              avatarConfig: currentUser?.avatarConfig,
              elo: currentUser?.elo || 600,
              color: guestFinalColor,
              timeControl,
              withAssistance
            }
          });
        }
      }
    });

    p2p.on('spectatorConnected', ({ count, profile }) => {
      setSpectatorCount(count);
      audioManager.playHint();
      const specName = profile?.name || 'Un espectador';
      setStatusMessage(`👥 ${specName} se ha unido a mirar la partida.`);
    });

    p2p.on('request_spectator_sync', ({ connection }) => {
      // Host envía el estado completo al nuevo espectador
      p2p.sendSpectatorSync(connection, {
        fen: game.fen(),
        lastMove,
        whiteTime,
        blackTime,
        timeControl,
        withAssistance,
        whitePlayer: assignedColor === 'white' ? currentUser : opponentProfile,
        blackPlayer: assignedColor === 'black' ? currentUser : opponentProfile,
        moveHistory: game.history({ verbose: true })
      });
    });

    p2p.on('data', (data) => {
      handleIncomingData(data);
    });

    p2p.on('spectatorData', (data) => {
      if (data.type === 'SPECTATOR_REACTION') {
        triggerCheerAnimation(data.emoji, data.fromName);
      }
    });

    p2p.on('disconnected', () => {
      if (mode === 'spectating') {
        setStatusMessage('La transmisión de la partida ha finalizado.');
        setErrorMessage('La partida que estabas viendo terminó o se desconectó.');
      } else {
        setStatusMessage('El rival se ha desconectado.');
        setErrorMessage('El rival ha abandonado la partida.');
      }
    });

    p2p.on('error', (err) => {
      console.error('P2P Error:', err);
      setIsConnecting(false);
      setIsHostActive(false);
      const friendly = err.message || 'Error de conexión. Verifica el código de sala e inténtalo de nuevo.';
      setErrorMessage(friendly);
      setStatusMessage('');
      audioManager.playWarning();
    });

    if (initialRoomId) {
      handleJoinSubmit(initialRoomId);
    }

    return () => {
      p2p.destroy();
    };
  }, [isOpen, initialRoomId]);

  // Manejo de datos entrantes desde el par WebRTC
  const handleIncomingData = (data) => {
    if (data.type === 'PROFILE_SYNC') {
      setOpponentProfile(data.profile);
      if (data.profile.withAssistance !== undefined) {
        setWithAssistance(data.profile.withAssistance);
      }
      if (!p2pRef.current?.isHost) {
        setAssignedColor(data.profile.color);
        if (data.profile.timeControl) {
          setTimeControl(data.profile.timeControl);
          setWhiteTime(data.profile.timeControl);
          setBlackTime(data.profile.timeControl);
        }
      }
    } else if (data.type === 'ASSISTANCE_TOGGLE') {
      setWithAssistance(data.withAssistance);
      setStatusMessage(data.withAssistance ? '💡 El rival activó las ayudas tácticas.' : '🛡️ El rival activó el Modo Clásico (sin ayudas).');
    } else if (data.type === 'SPECTATOR_SYNC') {
      // Estado inicial recibido por espectador
      const { fullGameState } = data;
      if (fullGameState) {
        setGame(new Chess(fullGameState.fen));
        setLastMove(fullGameState.lastMove);
        setWhiteTime(fullGameState.whiteTime);
        setBlackTime(fullGameState.blackTime);
        setTimeControl(fullGameState.timeControl);
        if (fullGameState.withAssistance !== undefined) setWithAssistance(fullGameState.withAssistance);
        setWhitePlayerProfile(fullGameState.whitePlayer);
        setBlackPlayerProfile(fullGameState.blackPlayer);
      }
    } else if (data.type === 'MOVE') {
      let updatedGame;
      try {
        if (data.fen) {
          updatedGame = new Chess(data.fen);
        } else {
          updatedGame = new Chess(game.fen());
          updatedGame.move(data.move);
        }

        if (updatedGame.isCheckmate() || updatedGame.isCheck()) audioManager.playCheck();
        else if (data.move?.captured) audioManager.playCapture();
        else audioManager.playMove();

        setLastMove(data.move);
        setGame(updatedGame);
        if (data.clocks) {
          setWhiteTime(data.clocks.white);
          setBlackTime(data.clocks.black);
        }
        if (saveActiveP2PGame) {
          saveActiveP2PGame({
            type: 'p2p',
            roomId,
            opponent: opponentProfile,
            fen: updatedGame.fen(),
            assignedColor,
            timeControl,
            whiteTime: data.clocks?.white ?? whiteTime,
            blackTime: data.clocks?.black ?? blackTime,
            lastMove: data.move,
            turn: updatedGame.turn(),
            updatedAt: Date.now()
          });
        }
        checkGameOver(updatedGame);
      } catch (err) {
        console.error("Error aplicando jugada remota P2P:", err);
      }
    } else if (data.type === 'SPECTATOR_REACTION') {
      triggerCheerAnimation(data.emoji, data.fromName);
    } else if (data.type === 'SAFE_CHAT') {
      audioManager.playHint();
      let safeText = data.text;
      let isEmote = !!data.isEmote;
      if (typeof safeText === 'object' && safeText !== null) {
        safeText = safeText.text || safeText.emoji || '';
        if (safeText.isEmote !== undefined) isEmote = safeText.isEmote;
      }
      setChatMessages(prev => [...prev, {
        senderName: opponentProfile?.name || 'Rival',
        text: String(safeText || ''),
        isEmote,
        isMe: false
      }]);
    } else if (data.type === 'RESIGN') {
      audioManager.playVictory();
      setGameResultReason('¡El rival se ha rendido! Victoria para ti 🏆');
      setMode('gameover');
      if (clearActiveP2PGame) clearActiveP2PGame();
      recordGameResult('win', 20, 90);
      confetti({ particleCount: 100, spread: 80 });
    } else if (data.type === 'OFFER_DRAW') {
      setDrawOffered(true);
      audioManager.playHint();
    } else if (data.type === 'ACCEPT_DRAW') {
      audioManager.playMove();
      setGameResultReason('Tablas acordadas por ambos jugadores 🤝');
      setMode('gameover');
      if (clearActiveP2PGame) clearActiveP2PGame();
      recordGameResult('draw', 5, 75);
    } else if (data.type === 'REMATCH') {
      restartP2PGame();
    } else if (data.type === 'PAUSE_MATCH') {
      setIsP2PPaused(true);
      setStatusMessage(`⏸️ Partida pausada por ${data.pausedBy || 'tu rival'}. Los relojes se han detenido.`);
      audioManager?.playHint?.();
    } else if (data.type === 'RESUME_MATCH') {
      setIsP2PPaused(false);
      setStatusMessage('▶ Partida reanudada.');
      audioManager?.playMove?.();
    } else if (data.type === 'HANDICAP_OFFER') {
      setIncomingHandicapOffer(data);
      audioManager.playHint();
    } else if (data.type === 'HANDICAP_ACCEPT') {
      setHandicapConfig(data.config);
      const newFen = getHandicapFen(data.config);
      const newG = new Chess(newFen);
      setGame(newG);
      setLastMove(null);
      setIncomingHandicapOffer(null);
      audioManager.playVictory();
      setStatusMessage(`¡Propuesta de ventaja aceptada! Jugando: ${getHandicapSummary(data.config)}`);
    } else if (data.type === 'HANDICAP_REJECT') {
      setHandicapConfig(DEFAULT_HANDICAP_CONFIG);
      const newFen = getHandicapFen(DEFAULT_HANDICAP_CONFIG);
      const newG = new Chess(newFen);
      setGame(newG);
      setLastMove(null);
      setIncomingHandicapOffer(null);
      audioManager.playMove();
      setStatusMessage('Tu rival prefirió jugar una partida estándar sin ventajas.');
    }
  };

  const handlePauseAndExitP2P = () => {
    setIsP2PPaused(true);
    try {
      p2pRef.current?.send({
        type: 'PAUSE_MATCH',
        pausedBy: currentUser?.name || 'Familiar'
      });
      if (saveActiveP2PGame) {
        saveActiveP2PGame({
          type: 'p2p',
          roomId,
          opponent: opponentProfile,
          fen: game.fen(),
          assignedColor,
          timeControl,
          whiteTime,
          blackTime,
          lastMove,
          turn: game.turn(),
          updatedAt: Date.now()
        });
      }
    } catch (e) {}
    onClose();
  };

  const handleTogglePauseP2P = () => {
    const nextState = !isP2PPaused;
    setIsP2PPaused(nextState);
    if (nextState) {
      p2pRef.current?.send({
        type: 'PAUSE_MATCH',
        pausedBy: currentUser?.name || 'Familiar'
      });
      setStatusMessage('⏸️ Has pausado la partida. Los relojes están detenidos.');
    } else {
      p2pRef.current?.send({
        type: 'RESUME_MATCH',
        resumedBy: currentUser?.name || 'Familiar'
      });
      setStatusMessage('▶ Has reanudado la partida.');
    }
  };

  // Animación de Reacciones de Espectadores
  const triggerCheerAnimation = (emoji, fromName) => {
    audioManager.playMove();
    const id = Date.now() + Math.random();
    setActiveCheerReactions(prev => [...prev, { id, emoji, fromName }]);
    setTimeout(() => {
      setActiveCheerReactions(prev => prev.filter(r => r.id !== id));
    }, 2800);
  };

  // Reloj de Partida
  useEffect(() => {
    if ((mode !== 'playing' && mode !== 'spectating') || timeControl === 0 || isP2PPaused) return;

    const timer = setInterval(() => {
      const turn = game.turn();
      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (mode === 'playing') handleTimeOut('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (mode === 'playing') handleTimeOut('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, game, timeControl, isP2PPaused]);

  const handleTimeOut = (color) => {
    audioManager.playWarning();
    const isMe = (color === 'w' && assignedColor === 'white') || (color === 'b' && assignedColor === 'black');
    if (isMe) {
      setGameResultReason('Se te agotó el tiempo de reloj. Derrota.');
      recordGameResult('loss', 0, 50);
    } else {
      setGameResultReason('¡Al rival se le agotó el tiempo! Victoria 🏆');
      recordGameResult('win', 20, 85);
      confetti({ particleCount: 90, spread: 70 });
    }
    setMode('gameover');
    if (clearActiveP2PGame) clearActiveP2PGame();
  };

  const checkGameOver = (currentGame) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'black' : 'white';
      const isMeWinner = winner === assignedColor;
      audioManager.playVictory();
      setGameResultReason(isMeWinner ? '¡Jaque Mate! Has ganado la partida 🏆' : 'Jaque Mate. El rival ha ganado.');
      setMode('gameover');
      if (clearActiveP2PGame) clearActiveP2PGame();
      if (isMeWinner) {
        recordGameResult('win', 20, 95);
        confetti({ particleCount: 120, spread: 90 });
      } else {
        recordGameResult('loss', 2, 60);
      }
    } else if (currentGame.isDraw()) {
      audioManager.playMove();
      let reason = 'Empate';
      if (currentGame.isStalemate()) reason = 'Tablas por Rey Ahogado';
      else if (currentGame.isThreefoldRepetition()) reason = 'Tablas por Triple Repetición';
      else if (currentGame.isInsufficientMaterial()) reason = 'Tablas por Material Insuficiente';
      setGameResultReason(reason);
      setMode('gameover');
      if (clearActiveP2PGame) clearActiveP2PGame();
      recordGameResult('draw', 5, 75);
    }
  };

  // Realizar Jugada (Local)
  const handlePieceMove = (moveResult, newFen) => {
    if (mode !== 'playing') return false;

    const isWhiteTurn = game.turn() === 'w';
    const isMyTurn = (assignedColor === 'white' && isWhiteTurn) || (assignedColor === 'black' && !isWhiteTurn);
    if (!isMyTurn) return false;

    try {
      const updatedGame = new Chess(newFen || game.fen());
      if (updatedGame.isCheckmate() || updatedGame.isCheck()) audioManager.playCheck();
      else if (moveResult?.captured) audioManager.playCapture();
      else audioManager.playMove();

      setLastMove(moveResult);
      setGame(updatedGame);

      if (saveActiveP2PGame) {
        saveActiveP2PGame({
          type: 'p2p',
          roomId,
          opponent: opponentProfile,
          fen: updatedGame.fen(),
          assignedColor,
          timeControl,
          whiteTime,
          blackTime,
          lastMove: moveResult,
          turn: updatedGame.turn(),
          updatedAt: Date.now()
        });
      }

      // Transmitir jugada por WebRTC a rival y espectadores
      p2pRef.current?.sendMove(moveResult, updatedGame.fen(), { white: whiteTime, black: blackTime });

      checkGameOver(updatedGame);
      return true;
    } catch (e) {
      console.error("Error al ejecutar jugada local:", e);
      return false;
    }
  };

  // Enviar mensaje de chat seguro
  const handleSendSafeChat = (rawMessage, isEmote = false) => {
    if (!p2pRef.current) return;
    let text = rawMessage;
    let emote = isEmote;
    if (typeof rawMessage === 'object' && rawMessage !== null) {
      text = rawMessage.text || rawMessage.emoji || '';
      if (rawMessage.isEmote !== undefined) emote = rawMessage.isEmote;
    }
    const safeText = String(text || '');
    if (!safeText) return;

    p2pRef.current.sendSafeChat(safeText, emote);
    setChatMessages(prev => [...prev, {
      senderName: currentUser?.name || 'Tú',
      text: safeText,
      isEmote: emote,
      isMe: true
    }]);
  };

  // Enviar reacción de espectador
  const handleSendSpectatorCheer = (emoji) => {
    if (!p2pRef.current) return;
    p2pRef.current.sendSpectatorReaction(emoji, currentUser?.name || 'Espectador');
    triggerCheerAnimation(emoji, currentUser?.name || 'Tú');
  };

  // Rendirse
  const handleResign = () => {
    if (window.confirm('¿Estás seguro de que deseas rendirte?')) {
      p2pRef.current?.sendResign();
      setGameResultReason('Te has rendido. Partida finalizada.');
      setMode('gameover');
      recordGameResult('loss', 0, 40);
    }
  };

  // Ofrecer Tablas
  const handleOfferDraw = () => {
    p2pRef.current?.sendDrawOffer();
    setStatusMessage('Has ofrecido tablas a tu rival. Esperando respuesta...');
  };

  const handleAcceptDraw = () => {
    p2pRef.current?.sendAcceptDraw();
    setGameResultReason('Tablas acordadas por ambos jugadores 🤝');
    setMode('gameover');
    setDrawOffered(false);
    recordGameResult('draw', 5, 75);
  };

  const handleRejectDraw = () => {
    setDrawOffered(false);
    setStatusMessage('Has rechazado la oferta de tablas.');
  };

  // Reiniciar / Revancha
  const restartP2PGame = () => {
    const newFen = getHandicapFen(handicapConfig);
    const newGame = new Chess(newFen);
    setGame(newGame);
    setLastMove(null);
    setWhiteTime(timeControl);
    setBlackTime(timeControl);
    setMode('playing');
    setGameResultReason('');
    setStatusMessage('¡Revancha iniciada! ¡Buena suerte!');
  };

  const handleRequestRematch = () => {
    p2pRef.current?.sendRematch();
    restartP2PGame();
  };

  // Crear Sala Host (Sin Guión)
  const handleCreateHost = (targetRoom = null) => {
    setIsConnecting(true);
    setErrorMessage('');
    const idToUse = targetRoom || generatedRoomId;
    const cleanId = P2PEngine.cleanRoomId(idToUse);
    p2pRef.current?.initHost(cleanId);
  };

  // Unirse a Sala (Sin Guión)
  const handleJoinSubmit = (targetRoomToJoin = null) => {
    const rawCode = targetRoomToJoin || inputRoomId;
    const cleanCode = P2PEngine.cleanRoomId(rawCode);
    if (!cleanCode) {
      setErrorMessage('Por favor escribe un código de sala válido.');
      return;
    }
    setIsConnecting(true);
    setErrorMessage('');
    p2pRef.current?.joinRoom(cleanCode, {
      name: currentUser?.name || 'Estudiante',
      avatar: currentUser?.avatar || 'teen_gamer',
      avatarConfig: currentUser?.avatarConfig,
      elo: currentUser?.elo || 600
    });
  };

  // Unirse como Espectador
  const handleJoinSpectatorSubmit = (targetRoomToJoin = null) => {
    const rawCode = targetRoomToJoin || inputRoomId;
    const cleanCode = P2PEngine.cleanRoomId(rawCode);
    if (!cleanCode) {
      setErrorMessage('Por favor escribe el código de la partida a espectar.');
      return;
    }
    setIsConnecting(true);
    setErrorMessage('');
    p2pRef.current?.joinAsSpectator(cleanCode, {
      name: currentUser?.name || 'Espectador',
      avatar: currentUser?.avatar || 'teen_gamer'
    });
  };

  // Reto Familiar Directo (1 Clic con detección de Reto Mutuo)
  const handleStartFamilyChallenge = (targetUser) => {
    setSelectedFamilyOpponent(targetUser);
    const result = sendFamilyInvitation ? sendFamilyInvitation(targetUser, timeControl, withAssistance) : null;
    if (result && result.isMutualMatch) {
      setStatusMessage(`¡${targetUser.name} y tú se retaron mutuamente! Conectando partida de inmediato...`);
      setRoomId(result.roomId);
      setInputRoomId(result.roomId);
      handleJoinSubmit(result.roomId);
    } else {
      const newRoom = result?.roomId || generatedRoomId;
      setGeneratedRoomId(newRoom);
      setRoomId(newRoom);
      handleCreateHost(newRoom);
    }
  };

  // Copiar Enlace Directo
  const handleCopyLink = () => {
    const activeCode = roomId || generatedRoomId;
    const cleanCode = P2PEngine.cleanRoomId(activeCode);
    const shareUrl = `${window.location.origin}/?room=${cleanCode}&view=p2p`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleRegenerateCode = () => {
    const newCode = P2PEngine.generateRoomId();
    setGeneratedRoomId(newCode);
    setRoomId(newCode);
  };

  if (!isOpen) return null;

  // Lista de miembros familiares disponibles (excluyendo al usuario actual de forma canónica)
  const myKey = String(currentUser?.name || currentUser?.id || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const familyMembers = (users || []).filter(u => {
    const uKey = String(u.name || u.id || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return u.id !== currentUser?.id && uKey !== myKey;
  });

  return (
    <div className="modal-overlay" style={{ zIndex: 110, padding: isFullscreen ? 0 : '12px' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: isFullscreen ? '100vw' : '1080px',
          width: '100%',
          height: isFullscreen ? '100vh' : 'auto',
          maxHeight: isFullscreen ? '100vh' : '94vh',
          padding: isFullscreen ? '12px' : '20px',
          background: 'linear-gradient(180deg, #0b0f19 0%, #111827 100%)',
          border: isFullscreen ? 'none' : '2px solid var(--color-primary, #3b82f6)',
          borderRadius: isFullscreen ? 0 : 'var(--radius-lg, 16px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA DEL MODAL */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(59, 130, 246, 0.4)'
            }}>
              <Globe size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0, fontWeight: '900', color: '#f8fafc' }}>
                Juego en Línea & Salas P2P
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Conexión directa encriptada • Retos familiares a 1 clic • Códigos simplificados
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={toggleFullscreen}
              style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '5px' }}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              <span className="hide-mobile-compact">{isFullscreen ? 'Ventana' : 'Completa'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* ALERTA DE ERROR */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1.5px solid #ef4444',
            borderRadius: 'var(--radius-md, 8px)',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            color: '#fca5a5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fecaca' }}>
                {errorMessage}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: '800', fontSize: '0.78rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* MENSAJE DE ESTADO INFORMATIVO */}
        {statusMessage && !errorMessage && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1.5px solid #3b82f6',
            borderRadius: 'var(--radius-md, 8px)',
            padding: '9px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#93c5fd',
            fontSize: '0.84rem',
            fontWeight: '700'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1.5s infinite' }} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 1: LOBBY DE SELECCIÓN DE MODO                       */}
        {/* ========================================================= */}
        {mode === 'lobby' && (
          <div>
            {/* SELECTOR DE PESTAÑAS DEL LOBBY */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`desktop-nav-tab ${lobbyTab === 'family' ? 'active' : ''}`}
                onClick={() => setLobbyTab('family')}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  gap: '6px',
                  background: lobbyTab === 'family' ? 'var(--color-gold, #ca8a04)' : 'rgba(255, 255, 255, 0.05)',
                  color: lobbyTab === 'family' ? '#000000' : '#f8fafc',
                  border: `1.5px solid ${lobbyTab === 'family' ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span>👑</span>
                <span>Reto Familiar (1 Clic)</span>
              </button>

              <button
                type="button"
                className={`desktop-nav-tab ${lobbyTab === 'code' ? 'active' : ''}`}
                onClick={() => setLobbyTab('code')}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  gap: '6px',
                  background: lobbyTab === 'code' ? 'var(--color-primary, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: `1.5px solid ${lobbyTab === 'code' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span>🔑</span>
                <span>Código de Sala (Sin Guión)</span>
              </button>

              <button
                type="button"
                className={`desktop-nav-tab ${lobbyTab === 'spectator' ? 'active' : ''}`}
                onClick={() => setLobbyTab('spectator')}
                style={{
                  padding: '7px 14px',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  gap: '6px',
                  background: lobbyTab === 'spectator' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: lobbyTab === 'spectator' ? '#34d399' : '#f8fafc',
                  border: `1.5px solid ${lobbyTab === 'spectator' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <Eye size={15} />
                <span>Modo Espectador</span>
              </button>
            </div>

            {/* PESTAÑA A: RETO FAMILIAR DIRECTO A 1 CLIC */}
            {lobbyTab === 'family' && (
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1.5px solid var(--color-gold, #ca8a04)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{activeGroup?.emblem || '👑'}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#f8fafc' }}>
                        Sala de Retos: {activeGroup?.name || 'Familia Junvill'}
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#cbd5e1' }}>
                        Reta a cualquier miembro de tu grupo familiar a una partida con 1 solo clic.
                      </p>
                    </div>
                  </div>

                  {/* Selector rápido de tiempo para retos */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#facc15' }}>Tiempo:</span>
                    {[
                      { secs: 180, label: '3 min' },
                      { secs: 300, label: '5 min' },
                      { secs: 600, label: '10 min' }
                    ].map(t => (
                      <button
                        key={t.secs}
                        type="button"
                        onClick={() => setTimeControl(t.secs)}
                        style={{
                          background: timeControl === t.secs ? 'var(--color-gold, #ca8a04)' : 'rgba(255, 255, 255, 0.08)',
                          color: timeControl === t.secs ? '#000000' : '#f8fafc',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {familyMembers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', background: '#0a0f1d', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Users size={36} color="#64748b" style={{ margin: '0 auto 8px' }} />
                    <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#f8fafc' }}>No hay otros jugadores en tu grupo aún</h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 12px' }}>
                      Crea un perfil de jugador para tu hermano, papá, mamá o amigo desde el selector de perfil.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {familyMembers.map(member => (
                      <div
                        key={member.id}
                        style={{
                          background: '#0a0f1d',
                          border: '1.5px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                            {member.avatarConfig ? (
                              <DynamicAvatar config={member.avatarConfig} size={46} />
                            ) : (
                              <AvatarIcon avatarId={member.avatar || 'teen_gamer'} size={46} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#f8fafc' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {member.title || 'Aprendiz'} • {member.elo || 600} Elo
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn-gold"
                          onClick={() => handleStartFamilyChallenge(member)}
                          disabled={isConnecting}
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.80rem',
                            fontWeight: '900',
                            gap: '5px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Swords size={14} />
                          <span>Retar ({timeControl / 60}m)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Si se inició una sala de reto familiar */}
                {isHostActive && (
                  <div style={{
                    marginTop: '16px',
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '2px solid #3b82f6',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#60a5fa', fontWeight: '800', fontSize: '0.96rem', marginBottom: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                      <span>Reto Activo para {selectedFamilyOpponent ? selectedFamilyOpponent.name : 'tu rival'}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 10px' }}>
                      Código de Sala Simplificado: <b style={{ color: '#60a5fa', fontSize: '1.2rem', fontFamily: 'monospace' }}>{roomId || generatedRoomId}</b>
                    </p>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button type="button" className="btn-gold" onClick={handleCopyLink} style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                        {copiedLink ? <Check size={15} /> : <Copy size={15} />}
                        <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          p2pRef.current?.destroy();
                          setIsHostActive(false);
                          setStatusMessage('');
                        }}
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        Cancelar Reto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA B: CÓDIGO DE SALA TRADICIONAL (SIN GUIONES) */}
            {lobbyTab === 'code' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {/* 1. Crear Sala */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '900', fontSize: '1.05rem' }}>
                    <Users size={20} />
                    <span>Crear Sala con Código</span>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: '#94a3b8', margin: 0 }}>
                    Genera un código limpio sin guiones para compartir con quien quieras.
                  </p>

                  <div style={{
                    background: '#0a0f1d',
                    border: '1.5px dashed #3b82f6',
                    borderRadius: '8px',
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Código de Sala:
                    </div>
                    <div style={{ fontSize: '1.7rem', fontWeight: '900', color: '#60a5fa', letterSpacing: '2px', fontFamily: 'monospace', margin: '4px 0' }}>
                      {roomId || generatedRoomId}
                    </div>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={handleCopyLink}
                      style={{ width: '100%', justifyContent: 'center', padding: '7px 10px', fontSize: '0.80rem' }}
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
                    </button>
                  </div>

                  {/* Configuración de Bando y Reloj */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: '800', color: '#e2e8f0', display: 'block', marginBottom: '4px' }}>
                        Juegas con:
                      </label>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <button
                          type="button"
                          onClick={() => setAssignedColor('random')}
                          disabled={isHostActive}
                          style={{
                            flex: 1,
                            background: assignedColor === 'random' ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                            color: assignedColor === 'random' ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 2px',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}
                          title="Sortear color al azar (50% Blancas / 50% Negras)"
                        >
                          🎲 Azar
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssignedColor('white')}
                          disabled={isHostActive}
                          style={{
                            flex: 1,
                            background: assignedColor === 'white' ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                            color: assignedColor === 'white' ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 2px',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}
                        >
                          ⚪
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssignedColor('black')}
                          disabled={isHostActive}
                          style={{
                            flex: 1,
                            background: assignedColor === 'black' ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                            color: assignedColor === 'black' ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 2px',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}
                        >
                          ⚫
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: '800', color: '#e2e8f0', display: 'block', marginBottom: '4px' }}>
                        Tiempo:
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          { secs: 180, label: '3m' },
                          { secs: 300, label: '5m' },
                          { secs: 600, label: '10m' }
                        ].map(t => (
                          <button
                            key={t.secs}
                            type="button"
                            onClick={() => setTimeControl(t.secs)}
                            disabled={isHostActive}
                            style={{
                              flex: 1,
                              background: timeControl === t.secs ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 2px',
                              fontSize: '0.78rem',
                              fontWeight: '800'
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isHostActive ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleCreateHost()}
                      disabled={isConnecting}
                      style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.92rem', fontWeight: '900' }}
                    >
                      <Play size={17} />
                      <span>{isConnecting ? 'Iniciando Sala...' : '🚀 Iniciar Sala y Esperar Rival'}</span>
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <QRCodeDisplay
                        value={`${window.location.origin}/?room=${roomId || generatedRoomId}&view=p2p`}
                        size={120}
                        title="Escanear para Jugar"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Unirse a Sala */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: '900', fontSize: '1.05rem', marginBottom: '4px' }}>
                      <Globe size={20} color="#10b981" />
                      <span>Unirse a una Sala Existente</span>
                    </div>
                    <p style={{ fontSize: '0.80rem', color: '#94a3b8', margin: '0 0 12px' }}>
                      Ingresa el código que te compartieron (ej: <b>JUN7K2</b>).
                    </p>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                        Código de la Sala:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. JUN882, A7K2..."
                        value={inputRoomId}
                        onChange={(e) => setInputRoomId(P2PEngine.cleanRoomId(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--color-primary, #3b82f6)',
                          background: '#0a0f1d',
                          color: '#f8fafc',
                          fontSize: '1.1rem',
                          fontWeight: '900',
                          letterSpacing: '2px',
                          textAlign: 'center',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => handleJoinSubmit()}
                    disabled={isConnecting || !inputRoomId.trim()}
                    style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem', fontWeight: '900' }}
                  >
                    <Play size={17} />
                    <span>{isConnecting ? 'Conectando...' : '⚔️ Unirme a la Partida'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* PESTAÑA C: MODO ESPECTADOR EN VIVO */}
            {lobbyTab === 'spectator' && (
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '560px',
                margin: '0 auto'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>👁️</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 4px', fontWeight: '900' }}>
                    Modo Espectador en Vivo
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                    Observa la partida en tiempo real sin intervenir y envía reacciones para apoyar a los jugadores.
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.80rem', fontWeight: '800', color: '#34d399', display: 'block', marginBottom: '6px' }}>
                    Código de la Partida a Espectar:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. JUN882"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(P2PEngine.cleanRoomId(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #10b981',
                      background: '#0a0f1d',
                      color: '#f8fafc',
                      fontSize: '1.15rem',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => handleJoinSpectatorSubmit()}
                  disabled={isConnecting || !inputRoomId.trim()}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.94rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  <Eye size={18} />
                  <span>{isConnecting ? 'Conectando como Espectador...' : '👁️ Entrar a Mirar la Partida'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 2: PARTIDA EN JUEGO O MODO ESPECTADOR              */}
        {/* ========================================================= */}
        {(mode === 'playing' || mode === 'spectating' || mode === 'gameover') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {/* LADO IZQUIERDO: TABLERO DE AJEDREZ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
              {/* Notificación de Modo Espectador */}
              {mode === 'spectating' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  color: '#34d399',
                  fontWeight: '800'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                    <span>🔴 EN VIVO • Modo Espectador</span>
                  </div>
                  <span>Sala: {roomId}</span>
                </div>
              )}

              {/* Barra superior de rival o jugador negras */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                    <AvatarIcon avatarId={mode === 'spectating' ? (blackPlayerProfile?.avatar || 'knight') : (opponentProfile?.avatar || 'knight')} size={32} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#f8fafc' }}>
                      {mode === 'spectating' ? (blackPlayerProfile?.name || 'Jugador Negras') : (opponentProfile?.name || 'Rival')}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>
                      {mode === 'spectating' ? `${blackPlayerProfile?.elo || 600} Elo` : `${opponentProfile?.elo || 600} Elo`}
                    </div>
                  </div>

                  {/* Fichas capturadas por el oponente en orden */}
                  <CapturedPiecesBar
                    capturedList={assignedColor === 'white' ? getCapturedPieces(game.fen()).capturedByBlack : getCapturedPieces(game.fen()).capturedByWhite}
                    advantage={assignedColor === 'white' ? getCapturedPieces(game.fen()).blackAdvantage : getCapturedPieces(game.fen()).whiteAdvantage}
                    color={assignedColor === 'white' ? 'w' : 'b'}
                  />
                </div>

                {/* Reloj Negras */}
                {timeControl > 0 && (
                  <div style={{
                    background: game.turn() === (assignedColor === 'white' ? 'b' : 'w') ? '#3b82f6' : '#0a0f1d',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: '900',
                    fontSize: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    {Math.floor((assignedColor === 'white' ? blackTime : whiteTime) / 60)}:{((assignedColor === 'white' ? blackTime : whiteTime) % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Tablero de Ajedrez */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                <ChessBoard
                  fen={game.fen()}
                  onMove={handlePieceMove}
                  orientation={mode === 'spectating' ? 'white' : assignedColor}
                  lastMove={lastMove}
                  interactive={mode === 'playing' && ((assignedColor === 'white' && game.turn() === 'w') || (assignedColor === 'black' && game.turn() === 'b'))}
                />

                {/* Burbujas flotantes de reacciones de espectadores */}
                {activeCheerReactions.map(r => (
                  <div
                    key={r.id}
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '45%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '3rem',
                      animation: 'bounce 0.6s ease-out infinite alternate',
                      zIndex: 30,
                      pointerEvents: 'none',
                      textShadow: '0 0 20px rgba(0,0,0,0.8)'
                    }}
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Barra inferior de jugador local o jugador blancas */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                    <AvatarIcon avatarId={mode === 'spectating' ? (whitePlayerProfile?.avatar || 'teen_gamer') : (currentUser?.avatar || 'teen_gamer')} size={32} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#f8fafc' }}>
                      {mode === 'spectating' ? (whitePlayerProfile?.name || 'Jugador Blancas') : (currentUser?.name || 'Tú')}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>
                      {mode === 'spectating' ? `${whitePlayerProfile?.elo || 600} Elo` : `${currentUser?.elo || 600} Elo`}
                    </div>
                  </div>

                  {/* Fichas capturadas por el jugador local en orden */}
                  <CapturedPiecesBar
                    capturedList={assignedColor === 'white' ? getCapturedPieces(game.fen()).capturedByWhite : getCapturedPieces(game.fen()).capturedByBlack}
                    advantage={assignedColor === 'white' ? getCapturedPieces(game.fen()).whiteAdvantage : getCapturedPieces(game.fen()).blackAdvantage}
                    color={assignedColor === 'white' ? 'b' : 'w'}
                  />
                </div>

                {/* Reloj Blancas */}
                {timeControl > 0 && (
                  <div style={{
                    background: game.turn() === (assignedColor === 'white' ? 'w' : 'b') ? '#3b82f6' : '#0a0f1d',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: '900',
                    fontSize: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    {Math.floor((assignedColor === 'white' ? whiteTime : blackTime) / 60)}:{((assignedColor === 'white' ? whiteTime : blackTime) % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>

            {/* LADO DERECHO: PANEL DE ACCIONES, REACCIONES Y CHAT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Contador de Espectadores y Sala */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.78rem'
              }}>
                <span>Sala: <b style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{roomId}</b></span>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} />
                  <span>{spectatorCount} {spectatorCount === 1 ? 'espectador' : 'espectadores'}</span>
                </span>
              </div>

              {/* BARRA DE REACCIONES DE ESPECTADOR (Si está espectando) */}
              {mode === 'spectating' && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #10b981',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#34d399', marginBottom: '6px' }}>
                    ¡Envía reacciones para animar la partida!
                  </div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    {CHEER_EMOJIS.map(item => (
                      <button
                        key={item.emoji}
                        type="button"
                        onClick={() => handleSendSpectatorCheer(item.emoji)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          fontSize: '1.4rem',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          transition: 'transform 0.1s'
                        }}
                        title={item.label}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Control de Partida (Si es jugador) */}
              {mode === 'playing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Botón Rápido de Ayudas para Negociar/Desactivar */}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const next = !withAssistance;
                      setWithAssistance(next);
                      p2pRef.current?.send({ type: 'ASSISTANCE_TOGGLE', withAssistance: next });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.80rem',
                      fontWeight: '800',
                      border: !withAssistance ? '1.5px solid #10b981' : '1.5px solid var(--color-gold)',
                      background: !withAssistance ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.08)',
                      color: !withAssistance ? '#10b981' : 'var(--text-parchment-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      justifyContent: 'center'
                    }}
                    title="Deshabilitar o habilitar todas las ayudas para ambos jugadores"
                  >
                    {!withAssistance ? <ShieldCheck size={15} color="#10b981" /> : <Sparkles size={15} color="#eab308" />}
                    <span>{!withAssistance ? '🛡️ Sin Ayudas (Modo Clásico Puro)' : '💡 Ayudas Habilitadas (Clic para Desactivar)'}</span>
                  </button>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleOfferDraw}
                      style={{ flex: 1, padding: '8px', fontSize: '0.78rem', justifyContent: 'center' }}
                    >
                      <span>🤝 Ofrecer Tablas</span>
                    </button>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleResign}
                      style={{ flex: 1, padding: '8px', fontSize: '0.78rem', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                      <Flag size={14} color="#ef4444" />
                      <span>Rendirse</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Oferta de Tablas Entrante */}
              {drawOffered && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#facc15', marginBottom: '8px' }}>
                    ¡Tu rival te ha ofrecido tablas! 🤝
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button type="button" className="btn-gold" onClick={handleAcceptDraw} style={{ padding: '6px 12px', fontSize: '0.80rem' }}>
                      Aceptar Tablas
                    </button>
                    <button type="button" className="btn-secondary" onClick={handleRejectDraw} style={{ padding: '6px 12px', fontSize: '0.80rem' }}>
                      Rechazar
                    </button>
                  </div>
                </div>
              )}

              {/* Safe Chat */}
              <div style={{ flex: 1, minHeight: '160px', maxHeight: '240px', display: 'flex', flexDirection: 'column' }}>
                <SafeChat
                  messages={chatMessages}
                  onSendMessage={handleSendSafeChat}
                  opponentName={opponentProfile?.name || 'Rival'}
                />
              </div>

              {/* Botones de Pausa y Salida */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleTogglePauseP2P}
                  style={{
                    flex: 1,
                    padding: '9px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    justifyContent: 'center',
                    background: isP2PPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                    borderColor: isP2PPaused ? '#10b981' : '#f59e0b',
                    color: isP2PPaused ? '#34d399' : '#facc15'
                  }}
                  title={isP2PPaused ? "Reanudar la partida y los relojes" : "Pausar la partida y detener los relojes"}
                >
                  <span>{isP2PPaused ? '▶ Reanudar' : '⏸️ Pausar'}</span>
                </button>

                <button
                  type="button"
                  className="btn-gold"
                  onClick={handlePauseAndExitP2P}
                  style={{
                    flex: 1.2,
                    padding: '9px',
                    fontSize: '0.82rem',
                    fontWeight: '900',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                  title="Pausa los relojes y guarda la partida para continuarla en cualquier momento"
                >
                  <span>⏸️ Pausar y Salir</span>
                </button>
              </div>

              {/* Botón Salir al Lobby */}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  p2pRef.current?.destroy();
                  setMode('lobby');
                  setStatusMessage('');
                }}
                style={{ padding: '9px', fontSize: '0.82rem', justifyContent: 'center' }}
              >
                <span>⬅️ Salir al Menú de Salas</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VISTA 3: RESULTADO FINAL (GAMEOVER)                       */}
        {/* ========================================================= */}
        {mode === 'gameover' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.94)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}>
            <div style={{
              background: '#0f172a',
              border: '2px solid var(--color-gold)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)'
            }}>
              <Award size={48} color="var(--color-gold)" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#f8fafc', margin: '0 0 6px', fontWeight: '900' }}>
                Partida Finalizada
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#fde047', fontWeight: '700', margin: '0 0 16px' }}>
                {gameResultReason}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={handleRequestRematch}
                  style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.88rem', fontWeight: '900' }}
                >
                  <RotateCcw size={16} />
                  <span>Revancha ⚔️</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    p2pRef.current?.destroy();
                    setMode('lobby');
                  }}
                  style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.88rem' }}
                >
                  <span>Volver al Lobby</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Hándicap P2P */}
      <HandicapConfigModal
        isOpen={isHandicapModalOpen}
        onClose={() => setIsHandicapModalOpen(false)}
        onSave={(cfg) => {
          setHandicapConfig(cfg);
          setIsHandicapModalOpen(false);
        }}
        initialConfig={handicapConfig}
      />
    </div>
  );
};
