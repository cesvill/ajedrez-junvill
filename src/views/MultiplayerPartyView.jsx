import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ChaturajiGame,
  FourPlayerGame,
  ThreePlayerHexGame,
  ThreePlayerCircularGame,
  getBestMultiplayerBotMove
} from '../engine/multiplayerChessEngine';
import { ChaturajiBoard } from '../components/Variants/MultiplayerBoards/ChaturajiBoard';
import { FourPlayerBoard } from '../components/Variants/MultiplayerBoards/FourPlayerBoard';
import { ThreePlayerHexBoard } from '../components/Variants/MultiplayerBoards/ThreePlayerHexBoard';
import { ThreePlayerCircularBoard } from '../components/Variants/MultiplayerBoards/ThreePlayerCircularBoard';
import { CreatePartyRoomModal } from '../components/MultiplayerParty/CreatePartyRoomModal';
import { JoinPartyRoomModal } from '../components/MultiplayerParty/JoinPartyRoomModal';
import { PartyRoomLobby } from '../components/MultiplayerParty/PartyRoomLobby';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { AvatarIcon } from '../assets/avatars';
import { useUser } from '../context/UserContext';
import { cloudSync, normalizeUserKey } from '../engine/cloudSync';
import { P2PEngine } from '../engine/p2pEngine';
import { roomEngine, JunvillRoomEngine } from '../services/room/JunvillRoomEngine';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { BOT_ROSTER, BotAvatarRenderer } from '../assets/botRoster';
import {
  Users,
  Bot,
  RotateCcw,
  ArrowLeft,
  BookOpen,
  Trophy,
  Dices,
  Sparkles,
  Shield,
  Compass,
  X,
  Play,
  Globe,
  KeyRound,
  Crown,
  LogOut,
  AlertCircle,
  Pause,
  Bell,
  Trash2
} from 'lucide-react';

const VARIANTS = [
  {
    id: 'chaturaji',
    name: 'Chaturaji Védico',
    subtitle: '4 Jugadores con Dados',
    playersCount: 4,
    icon: '🎲',
    badge: 'Histórico',
    badgeColor: '#f59e0b',
    desc: 'El abuelo del ajedrez en tablero 8×8. Un dado determina si mueves Barco, Caballo, Elefante o Rey/Peón.',
    rules: [
      'Tirada de dado obligatoria: 2=Barco (salta 2 en diagonal), 3=Caballo (en L), 4=Elefante (desliza ortogonal), 5=Rey o Peón.',
      'No existe el jaque ni el mate: ¡los Reyes se capturan directamente!',
      'Si un jugador no tiene jugadas válidas para la pieza que arrojó el dado, pierde el turno.',
      'Victoria por captura de los reyes rivales o al llevar a tu propio Rey al trono original de un contrincante (Sinhasana).'
    ]
  },
  {
    id: 'four_player',
    name: 'Ajedrez para 4 en Cruz',
    subtitle: 'Tablero 14×14 (160 casillas)',
    playersCount: 4,
    icon: '⚔️',
    badge: 'Competitivo',
    badgeColor: '#ef4444',
    desc: 'Cuadrícula en cruz de 14×14 con 4 ejércitos completos. Coronación al cruzar la 8.ª casilla relativa.',
    rules: [
      'Turnos en sentido horario: Rojo (Sur) -> Azul (Oeste) -> Amarillo (Norte) -> Verde (Este).',
      'La Dama se ubica a la izquierda del Rey desde la perspectiva de cada jugador.',
      'Los peones coronan al alcanzar la 8.ª casilla relativa desde su posición de salida.',
      'El jaque se evalúa únicamente al llegar el turno del rey amenazado.',
      'Al recibir mate o rendirse, las piezas del jugador se convierten en piezas neutrales congeladas.'
    ]
  },
  {
    id: 'three_hex',
    name: 'Ajedrez para 3 Hexagonal',
    subtitle: '96 casillas trilobulares',
    playersCount: 3,
    icon: '⭐',
    badge: 'Trilateral',
    badgeColor: '#38bdf8',
    desc: 'Tablero tricolor con 3 alas convergentes. Las diagonales se bifurcan en el núcleo central.',
    rules: [
      '3 Jugadores: Blanco, Negro y Rojo.',
      'Torres continúan en línea recta al pasar por el nexo central hacia la columna correspondiente del ala rival.',
      'Alfiles en el centro bifurcan sus diagonales amenazando simultáneamente las dos alas contrarias en casillas del mismo color.',
      'Regla de Quick Death: ¡El primer jugador que aseste jaque mate gana la partida de inmediato!'
    ]
  },
  {
    id: 'three_circular',
    name: '3-Man Chess (Circular)',
    subtitle: '144 casillas concéntricas',
    playersCount: 3,
    icon: '🌀',
    badge: '360 Grados',
    badgeColor: '#a855f7',
    desc: '6 anillos y 24 radios. Sin bordes laterales: ataques envolventes en 360° con cruce de polo a 180°.',
    rules: [
      'Movimiento anular continuo: las torres pueden rodear el tablero completo si el camino está despejado.',
      'Cruce central: Al cruzar el anillo interior (el pozo), las piezas emergen por el radio opuesto a 180°.',
      'Los peones avanzan hacia el centro (anillos 1 a 5). Al cruzar el pozo invierten su dirección hacia afuera y coronan en el anillo exterior rival.'
    ]
  }
];

export const MultiplayerPartyView = ({ onBackToMenu, initialRoomId = null }) => {
  const { currentUser, users, activeGroup, sendFamilyInvitation, activePartyRoom, saveActivePartyRoom, clearActivePartyRoom } = useUser();

  const getInitialVariant = () => {
    try {
      const v = new URLSearchParams(window.location.search).get('variant');
      if (v && ['chaturaji', 'four_player', 'three_hex', 'three_circular'].includes(v)) {
        return v;
      }
    } catch (e) {}
    return 'chaturaji';
  };

  const getDefaultBotPlayers = (variantId) => {
    if (variantId === 'three_hex' || variantId === 'three_circular') {
      return { white: false, black: true, red: true };
    }
    if (variantId === 'four_player') {
      return { red: false, blue: true, yellow: true, green: true };
    }
    return { red: false, green: true, yellow: true, black: true };
  };

  const [selectedVariant, setSelectedVariant] = useState(getInitialVariant);
  const [botPlayers, setBotPlayers] = useState(() => getDefaultBotPlayers(getInitialVariant()));
  const [game, setGame] = useState(() => {
    const v = getInitialVariant();
    if (v === 'four_player') return new FourPlayerGame('ffa');
    if (v === 'three_hex') return new ThreePlayerHexGame();
    if (v === 'three_circular') return new ThreePlayerCircularGame();
    return new ChaturajiGame();
  });
  const [gameTick, setGameTick] = useState(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botTimerRef = useRef(null);

  // Estados para Sala Multijugador Online
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [partyRoom, setPartyRoom] = useState(null);
  const [mySeatIndex, setMySeatIndex] = useState(0);
  const partyRoomRef = useRef(partyRoom);
  partyRoomRef.current = partyRoom;
  const gameRef = useRef(game);
  gameRef.current = game;

  const effectiveSeatIndex = useMemo(() => {
    if (!partyRoom || !currentUser) return mySeatIndex;
    const myId = String(currentUser.id || currentUser.uid || '').toLowerCase().trim();
    const myName = String(currentUser.name || '').toLowerCase().trim();
    const foundIdx = (partyRoom.seats || []).findIndex(s => {
      const uId = String(s.user?.id || s.player?.id || '').toLowerCase().trim();
      const uName = String(s.user?.name || s.player?.name || '').toLowerCase().trim();
      return (myId && uId && myId === uId) || (myName && uName && myName === uName);
    });
    return foundIdx !== -1 ? foundIdx : mySeatIndex;
  }, [partyRoom, currentUser, mySeatIndex]);

  const isPartyHost = partyRoom ? (effectiveSeatIndex === 0 || partyRoom.seats[effectiveSeatIndex]?.isHost) : false;

  // Bandos que se controlan desde este dispositivo (soporte híbrido Pass & Play + Online)
  const allowedColors = useMemo(() => {
    if (!partyRoom || partyRoom.status !== 'playing') {
      // En partida local: todos los bandos que no sean bots
      return Object.keys(botPlayers).filter(c => !botPlayers[c]);
    }

    // En sala online: mi asiento principal + asientos locales asignados a este mismo dispositivo
    const colors = [];
    const mySeat = partyRoom.seats?.[effectiveSeatIndex];
    if (mySeat?.color) colors.push(mySeat.color);

    (partyRoom.seats || []).forEach(s => {
      if (s.isLocalDevice || s.user?.isLocalDevice) {
        if (!colors.includes(s.color)) {
          colors.push(s.color);
        }
      }
    });

    return colors;
  }, [partyRoom, effectiveSeatIndex, botPlayers]);

  // Color primario para la orientación del tablero ("mi bando siempre abajo")
  const primaryPlayerColor = useMemo(() => {
    if (allowedColors.includes(game?.activePlayer)) {
      return game.activePlayer;
    }
    if (allowedColors.length > 0) {
      return allowedColors[0];
    }
    return 'white';
  }, [allowedColors, game?.activePlayer]);

  // Canal de difusión en tiempo real (<10ms local)
  const partyBcRef = useRef(null);

  // Inicializar juego al cambiar de variante
  const initGameForVariant = useCallback((variantId) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setIsBotThinking(false);

    let newGame;
    if (variantId === 'four_player') newGame = new FourPlayerGame('ffa');
    else if (variantId === 'three_hex') newGame = new ThreePlayerHexGame();
    else if (variantId === 'three_circular') newGame = new ThreePlayerCircularGame();
    else newGame = new ChaturajiGame();

    setGame(newGame);
    setGameTick(t => t + 1);
  }, []);

  const handleVariantChange = (vId) => {
    if (partyRoom) return; // En partida de sala no se cambia variante directamente
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setIsBotThinking(false);
    setSelectedVariant(vId);
    setBotPlayers(getDefaultBotPlayers(vId));
    initGameForVariant(vId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', vId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Referencia y Set de jugadas procesadas para evitar ejecuciones duplicadas
  const lastProcessedMoveRef = useRef(0);
  const processedMovesSetRef = useRef(new Set());

  // Función unificada para aplicar jugadas entrantes (de humanos o bots)
  const applyIncomingMove = useCallback((moveData) => {
    if (!moveData) return false;
    // Si la jugada fue enviada por el propio usuario (y no es bot ejecutado por el host en otra máquina), ignorar
    if (moveData.senderId && moveData.senderId === currentUser?.id && !moveData.isBot) {
      return false;
    }

    // Firma única para deduplicación: evita dobles ejecuciones si llega por WebSockets y Nube a la vez
    const moveKey = moveData.moveId || 
      `${moveData.seatIndex ?? ''}_${moveData.moveNumber ?? ''}_${moveData.timestamp ?? ''}_${JSON.stringify(moveData.moveArgs ?? [])}`;

    if (processedMovesSetRef.current.has(moveKey)) {
      return false;
    }
    processedMovesSetRef.current.add(moveKey);
    if (processedMovesSetRef.current.size > 120) {
      const firstKey = processedMovesSetRef.current.values().next().value;
      processedMovesSetRef.current.delete(firstKey);
    }

    const activeGame = gameRef.current || game;
    if (!activeGame) return false;

    // Extraer argumentos de movimiento
    let moveArgs = moveData.moveArgs;
    if (!moveArgs || moveArgs.length === 0) {
      if (typeof moveData.from === 'object' && typeof moveData.to === 'object') {
        moveArgs = [moveData.from.x, moveData.from.y, moveData.to.nx ?? moveData.to.x, moveData.to.ny ?? moveData.to.y];
      } else if (moveData.from !== undefined && moveData.to !== undefined) {
        moveArgs = [moveData.from, moveData.to];
      }
    }

    const [arg1, arg2, arg3, arg4] = moveArgs || [];
    let executed = false;
    try {
      if (arg1 === 'pass') {
        if (moveData.variantId === 'chaturaji') {
          activeGame.passTurn?.();
        } else {
          activeGame.nextTurn?.();
        }
        executed = true;
      } else if (moveData.variantId === 'three_hex') {
        executed = activeGame.makeMove?.(arg1, arg2);
      } else if (moveData.variantId === 'three_circular') {
        executed = activeGame.makeMove?.(arg1, arg2, arg3, arg4);
      } else {
        // four_player o chaturaji
        executed = activeGame.makeMove?.(arg1, arg2, arg3, arg4);
      }
    } catch (err) {
      console.warn('Error applying move to game engine:', err);
    }

    setIsBotThinking(false);
    audioManager.playMove();
    setGameTick(t => t + 1);

    if (activeGame.winner) {
      audioManager.playVictory();
      confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
    }

    return executed;
  }, [currentUser?.id, game]);

  // Broadcast de jugada en partida de sala (local y nube central)
  const broadcastPartyMove = (movePayload) => {
    try {
      const payloadWithTs = {
        ...movePayload,
        senderId: currentUser?.id,
        timestamp: Date.now()
      };
      const moveKey = payloadWithTs.moveId || 
        `${payloadWithTs.seatIndex ?? ''}_${payloadWithTs.moveNumber ?? ''}_${payloadWithTs.timestamp}_${JSON.stringify(payloadWithTs.moveArgs ?? [])}`;
      processedMovesSetRef.current.add(moveKey);
      lastProcessedMoveRef.current = payloadWithTs.timestamp;

      if (partyBcRef.current) {
        partyBcRef.current.postMessage({
          type: 'PARTY_MOVE',
          ...payloadWithTs
        });
      }

      // Sincronizar jugada en Supabase Realtime WebSockets (<50ms)
      roomEngine.sendMove({
        ...payloadWithTs,
        from: movePayload.moveArgs?.[0],
        to: movePayload.moveArgs?.[1],
        san: String(movePayload.moveArgs || ''),
        nextTurnSeatIndex: null
      }).catch(() => {});

      // Difusión explícita redundante por evento directo PARTY_MOVE
      if (roomEngine.transport?.channel) {
        roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'PARTY_MOVE',
          payload: payloadWithTs
        }).catch(() => {});
      }

      // Sincronizar jugada en la Nube Central (/api/sync) como respaldo secundario
      if (partyRoom) {
        const updatedRoom = {
          ...partyRoom,
          lastMove: payloadWithTs,
          updatedAt: Date.now()
        };
        cloudSync.pushPartyRoom(updatedRoom, activeGroup?.id).catch(() => {});
      }
    } catch (e) {}
  };

  // Turno del bot automático
  useEffect(() => {
    if (!game || game.winner) {
      setIsBotThinking(false);
      return;
    }

    const active = game.activePlayer;
    const isBot = !!botPlayers[active];

    if (!isBot) {
      setIsBotThinking(false);
      return;
    }

    // En sala online, solo el anfitrión calcula y ejecuta la jugada del bot para evitar desincronizaciones
    if (partyRoom && partyRoom.status === 'playing' && !isPartyHost) {
      setIsBotThinking(true);
      return;
    }

    // El jugador activo es Bot: programar jugada
    setIsBotThinking(true);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      if (game.winner || game.activePlayer !== active) {
        setIsBotThinking(false);
        return;
      }

      const move = getBestMultiplayerBotMove(game, selectedVariant);
      let executed = false;
      let moveArgs = [];

      if (move) {
        if (selectedVariant === 'chaturaji') {
          executed = game.makeMove(move.from.x, move.from.y, move.to.nx, move.to.ny);
          moveArgs = [move.from.x, move.from.y, move.to.nx, move.to.ny];
        } else if (selectedVariant === 'four_player') {
          executed = game.makeMove(move.from.x, move.from.y, move.to.nx, move.to.ny);
          moveArgs = [move.from.x, move.from.y, move.to.nx, move.to.ny];
        } else if (selectedVariant === 'three_hex') {
          executed = game.makeMove(move.from, move.to);
          moveArgs = [move.from, move.to];
        } else if (selectedVariant === 'three_circular') {
          executed = game.makeMove(move.from.ring, move.from.ray, move.to.ring, move.to.ray);
          moveArgs = [move.from.ring, move.from.ray, move.to.ring, move.to.ray];
        }
        audioManager.playMove();
      } else {
        if (selectedVariant === 'chaturaji') {
          game.passTurn();
          moveArgs = ['pass'];
        } else {
          game.nextTurn();
          moveArgs = ['pass'];
        }
        executed = true;
      }

      setIsBotThinking(false);
      setGameTick(t => t + 1);

      // Si estamos en sala online y somos el host, difundir jugada del bot
      if (partyRoom && partyRoom.status === 'playing' && isPartyHost && executed) {
        const botSeatIdx = partyRoom.seats?.findIndex(s => s.color === active);
        broadcastPartyMove({
          roomId: partyRoom.roomId,
          variantId: selectedVariant,
          moveArgs,
          isBot: true,
          turn: active,
          seatIndex: botSeatIdx !== -1 ? botSeatIdx : null
        });
      }

      if (game.winner) {
        audioManager.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }, 650);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameTick, selectedVariant, botPlayers, partyRoom, isPartyHost]);

  // Manejo de movimiento del jugador humano
  const handleHumanMove = (...args) => {
    // Si estamos en sala online, verificar que sea el turno de alguno de los colores asignados a este dispositivo
    if (partyRoom && partyRoom.status === 'playing') {
      if (!allowedColors.includes(game.activePlayer)) {
        audioManager.playWarning();
        return;
      }
    }

    if (botPlayers[game.activePlayer] || isBotThinking || game.winner) return;

    let success = false;
    if (selectedVariant === 'chaturaji') {
      const [fx, fy, tx, ty] = args;
      success = game.makeMove(fx, fy, tx, ty);
    } else if (selectedVariant === 'four_player') {
      const [fx, fy, tx, ty] = args;
      success = game.makeMove(fx, fy, tx, ty);
    } else if (selectedVariant === 'three_hex') {
      const [fromId, toId] = args;
      success = game.makeMove(fromId, toId);
    } else if (selectedVariant === 'three_circular') {
      const [fRing, fRay, tRing, tRay] = args;
      success = game.makeMove(fRing, fRay, tRing, tRay);
    }

    if (success) {
      audioManager.playMove();
      setGameTick(t => t + 1);

      // Difundir jugada a todos los miembros de la sala
      if (partyRoom && partyRoom.status === 'playing') {
        const activeSeatIdx = partyRoom.seats?.findIndex(s => s.color === game.activePlayer);
        broadcastPartyMove({
          roomId: partyRoom.roomId,
          variantId: selectedVariant,
          moveArgs: args,
          isBot: false,
          turn: game.activePlayer,
          seatIndex: activeSeatIdx !== -1 ? activeSeatIdx : effectiveSeatIndex
        });
      }

      if (game.winner) {
        audioManager.playVictory();
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }
    }
  };

  const handlePassTurn = () => {
    if (selectedVariant === 'chaturaji' && !botPlayers[game.activePlayer] && !game.winner) {
      if (partyRoom && partyRoom.status === 'playing') {
        if (!allowedColors.includes(game.activePlayer)) return;
      }
      game.passTurn();
      audioManager.playMove();
      setGameTick(t => t + 1);

      if (partyRoom && partyRoom.status === 'playing') {
        const activeSeatIdx = partyRoom.seats?.findIndex(s => s.color === game.activePlayer);
        broadcastPartyMove({
          roomId: partyRoom.roomId,
          variantId: selectedVariant,
          moveArgs: ['pass'],
          turn: game.activePlayer,
          seatIndex: activeSeatIdx !== -1 ? activeSeatIdx : effectiveSeatIndex
        });
      }
    }
  };

  const togglePlayerType = (playerKey) => {
    if (partyRoom) return; // En sala online los bots se fijan por asiento
    setBotPlayers(prev => ({
      ...prev,
      [playerKey]: !prev[playerKey]
    }));
    setGameTick(t => t + 1);
  };

  // =========================================================================
  // GESTIÓN DE SALA MULTIJUGADOR ONLINE (LOBBY, ANUNCIO Y SINCRONIZACIÓN)
  // =========================================================================

  // Manejar creación de sala (Host)
  const handleRoomCreated = async (newRoomData) => {
    setIsCreateRoomModalOpen(false);
    setSelectedVariant(newRoomData.variantId);
    initGameForVariant(newRoomData.variantId);
    setMySeatIndex(0);
    setPartyRoom(newRoomData);
    if (saveActivePartyRoom) saveActivePartyRoom(newRoomData);
    audioManager.playVictory();

    // Configurar bots según los asientos
    const newBotsConfig = {};
    newRoomData.seats.forEach(s => {
      newBotsConfig[s.color] = s.type === 'bot';
    });
    setBotPlayers(newBotsConfig);

    // Conectar y crear sala sobre WebSockets en Supabase Realtime
    try {
      await roomEngine.createRoomFromPartyData(newRoomData, currentUser);
    } catch (e) {
      console.warn('Error creating Supabase room:', e);
    }

    // Guardar en Nube Central (/api/sync) como respaldo pasivo
    try {
      await cloudSync.pushPartyRoom(newRoomData, activeGroup?.id);
    } catch (e) {}

    // Difundir sala por canal local
    if (partyBcRef.current) {
      partyBcRef.current.postMessage({
        type: 'PARTY_ROOM_ANNOUNCE',
        roomData: newRoomData
      });
    }

    try {
      localStorage.setItem(`junvill_party_${newRoomData.roomId}`, JSON.stringify(newRoomData));
    } catch (e) {}
  };

  // Manejar unirse a sala por código
  const handleJoinRoomByCode = async (rawRoomId) => {
    setIsJoinRoomModalOpen(false);
    const cleanRoomId = typeof rawRoomId === 'string' ? JunvillRoomEngine.cleanRoomId(rawRoomId) : '';
    if (!cleanRoomId || cleanRoomId === 'OBJECTOBJECT') return;

    // Estado visual inicial mientras se conecta
    setPartyRoom({
      roomId: cleanRoomId,
      variantName: 'Conectando con la sala...',
      totalPlayers: 4,
      expectedHumans: 2,
      botsCount: 2,
      status: 'lobby',
      isSearching: true,
      seats: []
    });

    // 1. Conectar mediante WebSockets de Supabase Realtime
    try {
      await roomEngine.joinRoom(cleanRoomId, currentUser);
    } catch (e) {
      console.warn('Error joining Supabase room:', e);
    }

    // 2. Consultar Nube Central (/api/sync) o almacenamiento local como respaldo
    let targetRoom = await cloudSync.fetchPartyRoom(cleanRoomId, activeGroup?.id);
    if (!targetRoom) {
      try {
        const raw = localStorage.getItem(`junvill_party_${cleanRoomId}`);
        if (raw) targetRoom = JSON.parse(raw);
      } catch (e) {}
    }

    if (targetRoom && Array.isArray(targetRoom.seats) && targetRoom.seats.length > 0) {
      roomEngine.handleIncomingState(targetRoom);
      await roomEngine.claimFirstAvailableSeat(currentUser);
      if (saveActivePartyRoom) saveActivePartyRoom(targetRoom);
    } else {
      if (saveActivePartyRoom) saveActivePartyRoom({ roomId: cleanRoomId, status: 'lobby', variantName: 'Ajedrez Multijugador' });
    }
  };

  // Iniciar partida desde el Lobby (Host)
  const handleStartPartyGame = async () => {
    if (!partyRoom) return;

    let startedState = null;
    try {
      startedState = await roomEngine.startGame();
    } catch (e) {
      console.warn('roomEngine.startGame error:', e);
    }

    const updated = {
      ...(startedState || roomEngine.currentState || partyRoom),
      status: 'playing',
      updatedAt: Date.now()
    };
    setPartyRoom(updated);
    if (saveActivePartyRoom) saveActivePartyRoom(updated);

    // Doble difusión garantizada sobre WebSockets de Supabase Realtime
    try {
      await roomEngine.transport.broadcastState(updated);
      if (roomEngine.transport.channel) {
        await roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'START_GAME',
          payload: updated
        });
        await roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'PARTY_ROOM_START',
          payload: { roomId: updated.roomId, roomData: updated }
        });
      }
    } catch (e) {}

    const botsConfig = {};
    (updated.seats || []).forEach(s => {
      botsConfig[s.color] = s.type === 'bot';
    });
    setBotPlayers(botsConfig);

    audioManager.playVictory();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });

    // Notificar a la Nube Central (/api/sync) como respaldo
    cloudSync.pushPartyRoom(updated, activeGroup?.id).catch(() => {});

    if (partyBcRef.current) {
      partyBcRef.current.postMessage({
        type: 'PARTY_ROOM_START',
        roomId: updated.roomId,
        roomData: updated
      });
    }
  };

  // Iniciar partida completando con robots de inmediato
  const handleStartWithBotsNow = async () => {
    if (!partyRoom) return;

    let startedState = null;
    try {
      startedState = await roomEngine.startGame();
    } catch (e) {
      console.warn('roomEngine.startGame error:', e);
    }

    const updatedRoom = {
      ...(startedState || roomEngine.currentState || partyRoom),
      status: 'playing',
      updatedAt: Date.now()
    };

    setPartyRoom(updatedRoom);
    if (saveActivePartyRoom) saveActivePartyRoom(updatedRoom);

    // Doble difusión garantizada sobre WebSockets de Supabase Realtime
    try {
      await roomEngine.transport.broadcastState(updatedRoom);
      if (roomEngine.transport.channel) {
        await roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'START_GAME',
          payload: updatedRoom
        });
        await roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'PARTY_ROOM_START',
          payload: { roomId: updatedRoom.roomId, roomData: updatedRoom }
        });
      }
    } catch (e) {}

    const botsConfig = {};
    (updatedRoom.seats || []).forEach(s => {
      botsConfig[s.color] = s.type === 'bot';
    });
    setBotPlayers(botsConfig);

    audioManager.playVictory();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });

    cloudSync.pushPartyRoom(updatedRoom, activeGroup?.id).catch(() => {});

    if (partyBcRef.current) {
      partyBcRef.current.postMessage({
        type: 'PARTY_ROOM_START',
        roomId: updatedRoom.roomId,
        roomData: updatedRoom
      });
    }
  };

  const [pingToast, setPingToast] = useState(null);
  const [selectedLocalBotId, setSelectedLocalBotId] = useState('qwerty');

  // Pausar y salir temporalmente al menú sin cancelar la sala
  const handlePauseAndExit = () => {
    if (partyRoom && saveActivePartyRoom) {
      saveActivePartyRoom(partyRoom);
    }
    audioManager.playClick();
    if (onBackToMenu) onBackToMenu();
  };

  // Salir definitivamente y destruir la sala (con confirmación de usuario)
  const handleAbandonPartyRoom = async () => {
    const isHost = partyRoom?.seats?.[effectiveSeatIndex]?.isHost;
    const msg = isHost 
      ? '¿Seguro que deseas cancelar esta sala definitivamente? Se eliminará de tus partidas activas y se notificará a los demás participantes.'
      : '¿Seguro que deseas abandonar esta sala definitivamente? Se liberará tu asiento y se eliminará de tus partidas activas.';
    const confirm = window.confirm(msg);
    if (!confirm) return;
    await handleLeavePartyRoom();
  };

  // Dar un toque a un compañero humano de la sala
  const handleSendPingToSeat = (seat) => {
    const targetUser = seat?.user;
    if (!targetUser || !partyRoom) return;
    try {
      if (sendFamilyInvitation) {
        sendFamilyInvitation(
          targetUser,
          0,
          true,
          partyRoom.roomId,
          partyRoom.variantId || selectedVariant,
          `¡Te doy un toque para reanudar nuestra partida multijugador en la sala ${partyRoom.roomId}!`
        );
      }
      audioManager.playVictory();
      setPingToast(`¡Toque enviado a ${targetUser.name}! Le aparecerá la notificación para reincorporarse.`);
      setTimeout(() => setPingToast(null), 4000);
    } catch (e) {}
  };

  // Salir de la sala (limpieza y destrucción)
  const handleLeavePartyRoom = async () => {
    try {
      await roomEngine.leaveRoom();
    } catch (e) {}

    if (partyRoom) {
      if (partyBcRef.current) {
        partyBcRef.current.postMessage({
          type: 'PARTY_ROOM_LEAVE',
          roomId: partyRoom.roomId,
          seatIndex: effectiveSeatIndex,
          userId: currentUser?.id
        });
      }

      // Si el anfitrión sale, cancelar sala; si sale un invitado, liberar su asiento
      const isHost = partyRoom.seats?.[effectiveSeatIndex]?.isHost;
      let updatedRoom;
      if (isHost) {
        updatedRoom = { ...partyRoom, status: 'cancelled', updatedAt: Date.now() };
      } else {
        const updatedSeats = [...(partyRoom.seats || [])];
        if (updatedSeats[effectiveSeatIndex]) {
          updatedSeats[effectiveSeatIndex] = { ...updatedSeats[effectiveSeatIndex], user: null, ready: false };
        }
        updatedRoom = { ...partyRoom, seats: updatedSeats, updatedAt: Date.now() };
      }
      cloudSync.pushPartyRoom(updatedRoom, activeGroup?.id).catch(() => {});
    }
    if (clearActivePartyRoom) clearActivePartyRoom(partyRoom?.roomId);
    setPartyRoom(null);
    audioManager.playClick();
    setMySeatIndex(0);
    setBotPlayers(getDefaultBotPlayers(selectedVariant));
    initGameForVariant(selectedVariant);
  };

  // Sincronización continua de la sala activa (Lobby y Partida) vía Nube Central
  useEffect(() => {
    if (!partyRoom || !partyRoom.roomId) return;
    let isCancelled = false;

    const syncRoomWithCloud = async () => {
      try {
        const cloudRoom = await cloudSync.fetchPartyRoom(partyRoom.roomId, activeGroup?.id);
        if (!cloudRoom || isCancelled) return;

        setPartyRoom(prev => {
          if (!prev) return null;

          // 1. Si estábamos en estado de búsqueda o con asientos vacíos, inicializar completamente
          if (prev.isSearching || (prev.seats || []).length === 0) {
            let seatIdx = cloudRoom.seats.findIndex(s => s.user && s.user.id === currentUser?.id);
            let updatedCloud = cloudRoom;

            if (seatIdx === -1) {
              const freeIdx = cloudRoom.seats.findIndex(s => s.type === 'human' && !s.user);
              if (freeIdx !== -1) {
                seatIdx = freeIdx;
                const newSeats = [...cloudRoom.seats];
                newSeats[freeIdx] = {
                  ...newSeats[freeIdx],
                  user: {
                    id: currentUser?.id || `guest_${Date.now()}`,
                    name: currentUser?.name || 'Jugador Invitado',
                    avatar: currentUser?.avatar || 'custom_dynamic',
                    avatarConfig: currentUser?.avatarConfig || null,
                    elo: currentUser?.elo || 600,
                    role: currentUser?.role || 'student'
                  },
                  ready: true
                };
                updatedCloud = {
                  ...cloudRoom,
                  seats: newSeats,
                  updatedAt: Date.now()
                };
                cloudSync.pushPartyRoom(updatedCloud, activeGroup?.id).catch(() => {});
              }
            }

            setMySeatIndex(seatIdx !== -1 ? seatIdx : 0);
            setSelectedVariant(updatedCloud.variantId);
            initGameForVariant(updatedCloud.variantId);

            const bConfig = {};
            (updatedCloud.seats || []).forEach(s => {
              bConfig[s.color] = s.type === 'bot';
            });
            setBotPlayers(bConfig);

            audioManager.playVictory();
            return updatedCloud;
          }

          // 2. Si estamos en el Lobby: actualizar asientos cuando se conecten otros jugadores
          if (prev.status === 'lobby') {
            const seatsChanged = JSON.stringify(prev.seats) !== JSON.stringify(cloudRoom.seats);
            const statusChanged = cloudRoom.status === 'playing';

            if (statusChanged) {
              setSelectedVariant(cloudRoom.variantId);
              initGameForVariant(cloudRoom.variantId);
              const bConfig = {};
              (cloudRoom.seats || []).forEach(s => {
                bConfig[s.color] = s.type === 'bot';
              });
              setBotPlayers(bConfig);
              audioManager.playVictory();
              confetti({ particleCount: 110, spread: 75, origin: { y: 0.5 } });
              return cloudRoom;
            }

            if (seatsChanged && (cloudRoom.updatedAt || 0) >= (prev.updatedAt || 0)) {
              return {
                ...prev,
                ...cloudRoom,
                seats: cloudRoom.seats,
                updatedAt: cloudRoom.updatedAt
              };
            }
          }

          // 3. Si estamos en juego: sincronizar movimientos en vivo
          if (prev.status === 'playing' && cloudRoom.lastMove) {
            applyIncomingMove(cloudRoom.lastMove);
          }

          return prev;
        });
      } catch (err) {}
    };

    // Heartbeat pasivo secundario (cada 3.5s en lobby para invitados, cada 15s en juego)
    const intervalTime = (partyRoom?.status === 'lobby' && !isPartyHost) ? 3500 : 15000;
    const intervalId = setInterval(syncRoomWithCloud, intervalTime);
    syncRoomWithCloud();

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [partyRoom?.roomId, partyRoom?.status, isPartyHost, activeGroup?.id, currentUser?.id, game, initGameForVariant, applyIncomingMove]);

  // Sincronización en tiempo real vía WebSockets de Supabase Realtime (<50ms, cero costo de cómputo en Vercel)
  useEffect(() => {
    if (currentUser) {
      roomEngine.currentUser = currentUser;
    }

    const unsubState = roomEngine.onStateChange((state) => {
      if (!state) return;

      // Si la sala está en juego y trae una última jugada no procesada, aplicarla
      if (state.status === 'playing' && state.lastMove) {
        applyIncomingMove(state.lastMove);
      }

      setPartyRoom((prev) => {
        // Asignar mi asiento
        const myIdx = roomEngine.getMySeatIndex();
        if (myIdx !== -1) {
          setMySeatIndex(myIdx);
        } else if (!roomEngine.isHost && state.status === 'lobby' && Array.isArray(state.seats) && state.seats.length > 0) {
          // Auto-reclamar primer asiento libre si somos invitados
          roomEngine.claimFirstAvailableSeat(currentUser).catch(() => {});
        }

        // Si la sala está en juego, sincronizar variante y bots
        if (state.status === 'playing') {
          const targetVariant = state.variantId || selectedVariant;
          if (targetVariant !== selectedVariant || prev?.status === 'lobby' || !game) {
            setSelectedVariant(targetVariant);
            initGameForVariant(targetVariant);
          }
          const bConfig = {};
          (state.seats || []).forEach(s => {
            bConfig[s.color] = s.type === 'bot';
          });
          setBotPlayers(bConfig);

          if (prev?.status === 'lobby') {
            audioManager.playVictory();
            confetti({ particleCount: 110, spread: 75, origin: { y: 0.5 } });
          }
        }

        if (saveActivePartyRoom && state && state.status !== 'cancelled' && state.status !== 'gameover') {
          saveActivePartyRoom(state);
        }

        return state;
      });
    });

    const unsubMove = roomEngine.onMove((moveData) => {
      applyIncomingMove(moveData);
    });

    // Petición periódica de estado fresco si somos invitados en lobby (<100ms)
    let lobbySyncTimer = null;
    if (partyRoom?.status === 'lobby' && !isPartyHost && roomEngine.transport?.channel) {
      lobbySyncTimer = setInterval(() => {
        roomEngine.transport.channel.send({
          type: 'broadcast',
          event: 'REQUEST_RESYNC',
          payload: { requesterId: currentUser?.id, roomId: partyRoom.roomId }
        }).catch(() => {});
      }, 2500);
    }

    return () => {
      unsubState();
      unsubMove();
      if (lobbySyncTimer) clearInterval(lobbySyncTimer);
    };
  }, [currentUser?.id, selectedVariant, game, initGameForVariant, partyRoom?.status, partyRoom?.roomId, isPartyHost]);

  // Enviar reto familiar a un familiar
  const handleInviteFamilyMember = (targetUser, roomId) => {
    if (sendFamilyInvitation) {
      sendFamilyInvitation(targetUser, 0, true, roomId, `party_${selectedVariant}`);
      audioManager.playHint();
    }
  };

  // Inicializar BroadcastChannel para sincronización en tiempo real
  useEffect(() => {
    let bc = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('junvill_party_channel');
        partyBcRef.current = bc;

        bc.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          const currentRoom = partyRoomRef.current;

          // 1. ANUNCIO DE SALA
          if (data.type === 'PARTY_ROOM_ANNOUNCE' && data.roomData) {
            if (currentRoom && currentRoom.roomId === data.roomData.roomId) {
              setPartyRoom(data.roomData);
            }
          }

          // 2. PETICIÓN PARA UNIRSE A SALA (El Host la recibe y asigna asiento)
          if (data.type === 'PARTY_ROOM_JOIN_REQUEST' && currentRoom && currentRoom.roomId === data.roomId) {
            const hostIsMe = currentRoom.seats[0]?.isHost;
            if (hostIsMe && data.user) {
              const freeIdx = currentRoom.seats.findIndex(s => s.type === 'human' && !s.user);
              if (freeIdx !== -1) {
                const updatedSeats = [...currentRoom.seats];
                updatedSeats[freeIdx] = {
                  ...updatedSeats[freeIdx],
                  user: data.user,
                  ready: true
                };
                const updatedRoom = {
                  ...currentRoom,
                  seats: updatedSeats,
                  updatedAt: Date.now()
                };
                setPartyRoom(updatedRoom);
                audioManager.playVictory();

                // Difundir actualización a todos
                bc.postMessage({
                  type: 'PARTY_ROOM_ANNOUNCE',
                  roomData: updatedRoom
                });

                try {
                  localStorage.setItem(`junvill_party_${updatedRoom.roomId}`, JSON.stringify(updatedRoom));
                } catch (e) {}
              }
            }
          }

          // 3. INICIO DE PARTIDA
          if (data.type === 'PARTY_ROOM_START' && currentRoom && currentRoom.roomId === data.roomId) {
            setPartyRoom(data.roomData);
            setSelectedVariant(data.roomData.variantId);
            initGameForVariant(data.roomData.variantId);

            const botsConfig = {};
            data.roomData.seats.forEach(s => {
              botsConfig[s.color] = s.type === 'bot';
            });
            setBotPlayers(botsConfig);
            audioManager.playVictory();
            confetti({ particleCount: 110, spread: 75, origin: { y: 0.5 } });
          }

          // 4. JUGADA RECIBIDA EN VIVO
          if (data.type === 'PARTY_MOVE' && currentRoom && currentRoom.roomId === data.roomId) {
            applyIncomingMove(data);
          }

          // 5. UN JUGADOR ABANDONÓ
          if (data.type === 'PARTY_ROOM_LEAVE' && currentRoom && currentRoom.roomId === data.roomId) {
            if (data.seatIndex !== undefined && currentRoom.seats[data.seatIndex]) {
              const updatedSeats = [...currentRoom.seats];
              updatedSeats[data.seatIndex] = {
                ...updatedSeats[data.seatIndex],
                user: null,
                ready: false
              };
              setPartyRoom({ ...currentRoom, seats: updatedSeats });
              audioManager.playWarning();
            }
          }
        };
      }
    } catch (e) {}

    return () => {
      try { bc?.close(); } catch (e) {}
    };
  }, [currentUser?.id, game, initGameForVariant]);

  // Deep Link desde la URL (ej: ?partyRoom=JUN7K2) o sala inicial por prop
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawParam = (typeof initialRoomId === 'string' && initialRoomId.trim()) 
        ? initialRoomId.trim() 
        : (urlParams.get('partyRoom') || urlParams.get('party_room'));
      if (rawParam && typeof rawParam === 'string') {
        const clean = JunvillRoomEngine.cleanRoomId(rawParam);
        if (clean && clean !== 'OBJECTOBJECT') {
          handleJoinRoomByCode(clean);
        }
      }
    } catch (e) {}
  }, [initialRoomId]);

  const currentVariantData = VARIANTS.find(v => v.id === selectedVariant) || VARIANTS[0];

  const handleSetSeatLocal = async (seatIdx) => {
    if (!partyRoom || !isPartyHost) return;
    const targetSeat = partyRoom.seats?.[seatIdx];
    if (!targetSeat) return;

    const companionUser = {
      id: `local_companion_${seatIdx}`,
      name: `Compañero ${seatIdx + 1} (Local)`,
      avatar: 'teen_gamer',
      avatarConfig: null,
      elo: 600,
      role: 'student',
      isLocalDevice: true
    };

    const updatedSeats = partyRoom.seats.map((s, idx) => {
      if (idx === seatIdx) {
        return {
          ...s,
          type: 'human',
          isBot: false,
          bot: null,
          isLocalDevice: true,
          user: companionUser,
          player: companionUser,
          ready: true,
          isReady: true,
          isConnected: true
        };
      }
      return s;
    });

    const updatedRoom = {
      ...partyRoom,
      seats: updatedSeats,
      version: (partyRoom.version || 0) + 1,
      updatedAt: Date.now()
    };

    setPartyRoom(updatedRoom);
    if (saveActivePartyRoom) saveActivePartyRoom(updatedRoom);

    try {
      await roomEngine.claimSeat(seatIdx, companionUser);
    } catch (e) {
      console.warn('Error claiming local seat in roomEngine:', e);
    }

    if (partyBcRef.current) {
      partyBcRef.current.postMessage({
        type: 'PARTY_ROOM_ANNOUNCE',
        roomData: updatedRoom
      });
    }
  };

  const handleSetSeatOnline = async (seatIdx) => {
    if (!partyRoom || !isPartyHost) return;
    const targetSeat = partyRoom.seats?.[seatIdx];
    if (!targetSeat) return;

    const updatedSeats = partyRoom.seats.map((s, idx) => {
      if (idx === seatIdx) {
        return {
          ...s,
          type: 'human',
          isBot: false,
          bot: null,
          isLocalDevice: false,
          user: null,
          player: null,
          ready: false,
          isReady: false,
          isConnected: false
        };
      }
      return s;
    });

    const updatedRoom = {
      ...partyRoom,
      seats: updatedSeats,
      version: (partyRoom.version || 0) + 1,
      updatedAt: Date.now()
    };

    setPartyRoom(updatedRoom);
    if (saveActivePartyRoom) saveActivePartyRoom(updatedRoom);

    try {
      await roomEngine.vacateSeat(seatIdx);
    } catch (e) {
      console.warn('Error vacating seat in roomEngine:', e);
    }

    if (partyBcRef.current) {
      partyBcRef.current.postMessage({
        type: 'PARTY_ROOM_ANNOUNCE',
        roomData: updatedRoom
      });
    }
  };

  // =========================================================================
  // RENDER: LOBBY DE SALA ACTIVA (SI ESTÁ EN MODO ESPERA)
  // =========================================================================
  if (partyRoom && partyRoom.status === 'lobby') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        color: '#f8fafc',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Barra superior de retorno */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1080px',
          marginBottom: '16px'
        }}>
          <button
            onClick={handleLeavePartyRoom}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <Pause size={18} /> Pausar y Volver a Jugar
          </button>
        </div>

        <PartyRoomLobby
          roomData={partyRoom}
          currentUser={currentUser}
          isHost={isPartyHost}
          mySeatIndex={effectiveSeatIndex}
          onStartGame={handleStartPartyGame}
          onStartWithBotsNow={handleStartWithBotsNow}
          onLeaveRoom={handleAbandonPartyRoom}
          onPauseAndExit={handlePauseAndExit}
          onInviteFamilyMember={handleInviteFamilyMember}
          onClaimSeat={(idx) => roomEngine.claimSeat(idx, currentUser)}
          onToggleSeatBot={(idx) => roomEngine.toggleSeatBot(idx)}
          onSetSeatLocal={handleSetSeatLocal}
          onSetSeatOnline={handleSetSeatOnline}
          familyMembers={users}
        />
      </div>
    );
  }

  // =========================================================================
  // RENDER: TABLERO DE JUEGO (LOCAL O SALA ONLINE)
  // =========================================================================
  return (
    <div className="multiplayer-party-container">
      {/* Toast Flotante de Toque / Notificación */}
      {pingToast && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          backgroundColor: 'rgba(16, 185, 129, 0.95)',
          border: '1.5px solid #34d399',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '12px',
          fontWeight: 800,
          fontSize: '13px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}>
          <span>🔔</span>
          <span>{pingToast}</span>
        </div>
      )}
      
      {/* Barra de Encabezado Superior */}
      <div className="multiplayer-header-bar">
        <button
          onClick={handlePauseAndExit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={18} /> Volver a Jugar
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Users size={24} style={{ color: '#38bdf8' }} />
            Ajedrez Multijugador Junvill
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Partidas dinámicas para 3 y 4 jugadores simultáneos
          </p>
        </div>

        <button
          onClick={() => setIsRulesOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '10px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={18} /> Reglas
        </button>
      </div>

      {/* BANNER DE SALA EN CURSO GUARDADA PARA RETOMAR */}
      {!partyRoom && activePartyRoom && (
        <div style={{
          width: '100%',
          maxWidth: '1080px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(147, 51, 234, 0.25) 100%)',
          border: '2px solid #a855f7',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⏳
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Partida Multijugador Activa:</span>
                <span style={{ color: '#facc15', fontFamily: 'monospace' }}>{activePartyRoom.roomId}</span>
                <span style={{ fontSize: '11px', background: activePartyRoom.status === 'playing' ? '#10b981' : '#38bdf8', color: '#0f172a', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                  {activePartyRoom.status === 'playing' ? 'En Juego' : 'En Lobby'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                Modalidad: <b>{activePartyRoom.variantName || 'Ajedrez Multijugador'}</b> • Puedes reincorporarte a tu asiento de inmediato.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleJoinRoomByCode(activePartyRoom.roomId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#9333ea',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)'
              }}
            >
              <Play size={16} />
              <span>Retomar Sala</span>
            </button>
            <button
              onClick={() => clearActivePartyRoom && clearActivePartyRoom(activePartyRoom.roomId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title="Descartar esta sala"
            >
              <X size={14} />
              <span>Descartar</span>
            </button>
          </div>
        </div>
      )}

      {/* BANNER MULTIJUGADOR ONLINE (Crear o Unirse a Sala) */}
      {!partyRoom ? (
        <div style={{
          width: '100%',
          maxWidth: '1080px',
          backgroundColor: '#0f172a',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              🌐
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#f8fafc' }}>
                ¿Quieres jugar con tus amigos o familiares en red?
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Crea una sala de espera en vivo para 3 o 4 personas y completa los asientos restantes con robots.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsJoinRoomModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <KeyRound size={16} style={{ color: '#facc15' }} />
              <span>Unirse con Código</span>
            </button>

            <button
              onClick={() => setIsCreateRoomModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Users size={16} />
              <span>Crear Sala Online</span>
            </button>
          </div>
        </div>
      ) : (
        /* BANNER DE SALA ONLINE EN JUEGO */
        <div style={{
          width: '100%',
          maxWidth: '1080px',
          backgroundColor: '#0f172a',
          border: '2px solid #38bdf8',
          borderRadius: '16px',
          padding: '12px 18px',
          marginBottom: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                SALA ONLINE: <span style={{ color: '#facc15', fontFamily: 'monospace' }}>{partyRoom.roomId}</span> • {partyRoom.variantName}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Asiento asignado: <b style={{ color: partyRoom.seats[effectiveSeatIndex]?.colorHex || '#38bdf8' }}>
                  {partyRoom.seats[effectiveSeatIndex]?.label}
                </b>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Indicador de turno online */}
            {partyRoom.seats.map((st, i) => {
              const isTurn = game.activePlayer === st.color;
              const isOtherHuman = st.type === 'human' && st.user && st.user.id !== currentUser?.id;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: isTurn ? `${st.colorHex}33` : '#1e293b',
                    border: isTurn ? `2px solid ${st.colorHex}` : '1px solid #334155',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isTurn ? '#f8fafc' : '#94a3b8'
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: st.colorHex }} />
                  <span>{st.type === 'human' ? st.user?.name || 'Humano' : st.bot?.name || 'Bot'}</span>
                  {isTurn && <span>🎯</span>}
                  {isOtherHuman && (
                    <button
                      onClick={() => handleSendPingToSeat(st)}
                      title={`Dar un toque a ${st.user.name} para que juegue o regrese a la sala`}
                      style={{
                        backgroundColor: '#d97706',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        marginLeft: '4px'
                      }}
                    >
                      <Bell size={10} />
                      <span>Toque</span>
                    </button>
                  )}
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '6px' }}>
              <button
                onClick={handlePauseAndExit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                title="Pausar y volver a Jugar sin perder la sala"
              >
                <Pause size={12} /> Pausar y Salir
              </button>

              <button
                onClick={handleAbandonPartyRoom}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
                title="Abandonar definitivamente esta sala"
              >
                <Trash2 size={12} /> Abandonar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Variantes (Solo en juego local) */}
      {!partyRoom && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          width: '100%',
          maxWidth: '1080px',
          marginBottom: '20px'
        }}>
          {VARIANTS.map(v => {
            const isSelected = selectedVariant === v.id;
            return (
              <div
                key={v.id}
                onClick={() => handleVariantChange(v.id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                  border: isSelected ? `2px solid ${v.badgeColor}` : '1px solid #1e293b',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 8px 24px ${v.badgeColor}26` : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{v.icon}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: v.badgeColor,
                    backgroundColor: `${v.badgeColor}18`,
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {v.badge}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                  {v.name}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  {v.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selector Rápido de Participantes (Humano vs Bot Junvill) en Juego Local */}
      {/* Selector Rápido de Participantes (Humano vs Bot Junvill) en Juego Local */}
      {!partyRoom && game && Array.isArray(game.players) && (
        <div className="multiplayer-bot-control-bar" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          maxWidth: '1080px',
          marginBottom: '20px',
          padding: '10px 16px',
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          border: '1px solid #1e293b'
        }}>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginRight: '6px' }}>
            Control de Jugadores:
          </span>
          {game.players.map(pKey => {
            const isBot = botPlayers[pKey];
            return (
              <button
                key={pKey}
                onClick={() => togglePlayerType(pKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isBot ? '#334155' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isBot ? <Bot size={14} /> : <Users size={14} />}
                {pKey.toUpperCase()}: {isBot ? 'Bot IA' : 'Humano'}
              </button>
            );
          })}

          {/* Selector de Modelo Homogéneo para los bots en local */}
          {Object.values(botPlayers).some(Boolean) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <Bot size={15} style={{ color: '#c084fc' }} />
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>Modelo de Bots:</span>
              <select
                value={selectedLocalBotId}
                onChange={(e) => setSelectedLocalBotId(e.target.value)}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#fde047',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {BOT_ROSTER.slice(0, 10).map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.elo} Elo)
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => initGameForVariant(selectedVariant)}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Reiniciar Partida
          </button>
        </div>
      )}

      {/* Banner de Ganador */}
      {game?.winner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backgroundColor: '#d97706',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '16px',
          fontWeight: 900,
          fontSize: '18px',
          boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)',
          marginBottom: '20px'
        }}>
          <Trophy size={28} />
          <span>¡Victoria de {game.winner.toUpperCase()}! Partida Concluida.</span>
          <button
            onClick={() => initGameForVariant(selectedVariant)}
            style={{
              marginLeft: '12px',
              backgroundColor: '#ffffff',
              color: '#92400e',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Nueva Partida
          </button>
        </div>
      )}

      {/* Banner de Bot Pensando */}
      {isBotThinking && !game?.winner && (
        <div className="multiplayer-status-banner multiplayer-bot-thinking" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          color: '#38bdf8',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)'
        }}>
          <Bot size={16} />
          <span>El Bot ({game?.activePlayer ? game.activePlayer.toUpperCase() : 'IA'}) está calculando su jugada...</span>
        </div>
      )}

      {/* Banner de Turno en este Dispositivo */}
      {allowedColors.includes(game?.activePlayer) && !game?.winner && (
        <div className="multiplayer-status-banner multiplayer-turn-banner" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1.5px solid #22c55e',
          color: '#4ade80',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 800,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.25)'
        }}>
          <span>🎮</span>
          <span>
            {partyRoom && partyRoom.seats ? (
              (() => {
                const activeSeat = partyRoom.seats.find(s => s.color === game.activePlayer);
                return `¡Turno en este dispositivo! Juega ${activeSeat?.user?.name || activeSeat?.label || game.activePlayer.toUpperCase()}`;
              })()
            ) : (
              `¡Tu turno! Mueves el ejército ${game.activePlayer.toUpperCase()}`
            )}
          </span>
        </div>
      )}

      {/* Tablero Activo */}
      <div className="multiplayer-board-wrapper">
        {game && selectedVariant === 'chaturaji' && (
          <ChaturajiBoard
            key={`chaturaji_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            onPass={handlePassTurn}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
            allowedColors={allowedColors}
            playerColor={primaryPlayerColor}
          />
        )}

        {game && selectedVariant === 'four_player' && (
          <FourPlayerBoard
            key={`four_player_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
            allowedColors={allowedColors}
            playerColor={primaryPlayerColor}
          />
        )}

        {game && selectedVariant === 'three_hex' && (
          <ThreePlayerHexBoard
            key={`three_hex_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
            allowedColors={allowedColors}
            playerColor={primaryPlayerColor}
          />
        )}

        {game && selectedVariant === 'three_circular' && (
          <ThreePlayerCircularBoard
            key={`three_circular_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
            allowedColors={allowedColors}
            playerColor={primaryPlayerColor}
          />
        )}
      </div>

      {/* Modal Informativo de Reglas */}
      {isRulesOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #334155',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{currentVariantData.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                    {currentVariantData.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {currentVariantData.subtitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRulesOpen(false)}
                style={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
              {currentVariantData.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentVariantData.rules.map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsRulesOpen(false)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ¡Entendido, a Jugar!
            </button>
          </div>
        </div>
      )}

      {/* Modal para Crear Sala Multijugador */}
      <CreatePartyRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onRoomCreated={handleRoomCreated}
        currentUser={currentUser}
      />

      {/* Modal para Unirse a Sala Multijugador con Código */}
      <JoinPartyRoomModal
        isOpen={isJoinRoomModalOpen}
        onClose={() => setIsJoinRoomModalOpen(false)}
        onJoin={handleJoinRoomByCode}
      />

    </div>
  );
};
