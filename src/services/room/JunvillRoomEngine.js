/**
 * JunvillRoomEngine.js
 * Motor centralizado y unificado de salas multijugador para Ajedrez Junvill.
 * Administra el ciclo de vida de salas para N jugadores (N = 2, 3, 4),
 * asientos, turnos, sincronización determinista de jugadas y resiliencia móvil.
 */

import { SupabaseRealtimeAdapter } from './SupabaseRealtimeAdapter.js';
import { LocalMockTransport } from './LocalMockTransport.js';

const VARIANT_NAMES = {
  four_player: 'Ajedrez para 4 en Cruz',
  chaturaji: 'Chaturaji Védico',
  three_hex: 'Ajedrez para 3 Hexagonal',
  three_circular: '3-Man Chess (Circular)',
  chess_2p_standard: 'Ajedrez Estándar 2P',
  standard: 'Ajedrez Estándar 2P'
};

export class JunvillRoomEngine {
  static instance = null;

  constructor(transport = null) {
    this.transport = transport || new SupabaseRealtimeAdapter();
    this.currentState = null;
    this.currentUser = null;
    this.stateListeners = new Set();
    this.moveListeners = new Set();
    this.isHost = false;
    this.visibilityListenerAttached = false;

    this.bindTransportEvents();
    this.setupPageVisibility();
  }

  /**
   * Singleton del motor
   */
  static getInstance(transport = null) {
    if (!JunvillRoomEngine.instance) {
      JunvillRoomEngine.instance = new JunvillRoomEngine(transport);
    } else if (transport && JunvillRoomEngine.instance.transport !== transport) {
      JunvillRoomEngine.instance.setTransport(transport);
    }
    return JunvillRoomEngine.instance;
  }

  setTransport(newTransport) {
    if (this.transport && this.transport.disconnect) {
      this.transport.disconnect().catch(() => {});
    }
    this.transport = newTransport;
    this.bindTransportEvents();
  }

  /**
   * Enlaza callbacks del adaptador de transporte
   */
  bindTransportEvents() {
    if (!this.transport) return;

    this.transport.onStateUpdate((newState) => {
      this.handleIncomingState(newState);
    });

    this.transport.onMoveReceived((move, nextTurn, version) => {
      this.handleIncomingMove(move, nextTurn, version);
    });

    this.transport.onPeerJoin((userId, meta) => {
      // Si entra un nuevo participante, el anfitrión le envía el estado completo actual
      const isMeHost = this.isHost || (this.currentState?.seats?.[0]?.user?.id === this.currentUser?.id);
      if (isMeHost && this.currentState) {
        this.transport.broadcastState(this.currentState);
      }
    });

    this.transport.onPeerLeave((userId) => {
      this.handleParticipantLeave(userId);
    });

    if (this.transport.onRequestResync) {
      this.transport.onRequestResync((payload) => {
        const isMeHost = this.isHost || (this.currentState?.seats?.[0]?.user?.id === this.currentUser?.id);
        if (isMeHost && this.currentState) {
          this.transport.broadcastState(this.currentState);
        }
      });
    }
  }

  /**
   * Resiliencia ante suspensión de navegadores móviles (Page Visibility API)
   */
  setupPageVisibility() {
    if (typeof document === 'undefined' || this.visibilityListenerAttached) return;
    this.visibilityListenerAttached = true;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Al volver el usuario al navegador/app, comprobamos conexión y solicitamos resincronización
        if (this.currentState && this.currentState.roomId) {
          if (!this.transport.isConnected) {
            this.transport.connect(this.currentState.roomId, this.currentUser).then(() => {
              if (this.isHost) {
                this.transport.broadcastState(this.currentState);
              }
            }).catch(() => {});
          } else if (!this.isHost) {
            // Si somos invitados, pedimos al anfitrión el estado más reciente
            this.transport.broadcastMove({ type: 'PING' }, 0, 0).catch(() => {});
          }
        }
      }
    });
  }

  /**
   * Genera un código de sala legible de 6 caracteres (ej: JUN-7K2)
   */
  generateReadableCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let p1 = '';
    let p2 = '';
    for (let i = 0; i < 3; i++) {
      p1 += chars.charAt(Math.floor(Math.random() * chars.length));
      p2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `JUN-${p1}${p2}`;
  }

  /**
   * Limpia un código de sala
   */
  static cleanRoomId(id) {
    if (!id) return '';
    return String(id).toUpperCase().replace(/[^A-Z0-9-]/g, '').trim();
  }

  /**
   * Asigna el rol/color a cada asiento según la modalidad
   */
  resolveSeatInfo(index, variant) {
    const configs = {
      four_player: [
        { color: 'red', label: 'Rojo (Sur)', hex: '#ef4444' },
        { color: 'blue', label: 'Azul (Oeste)', hex: '#3b82f6' },
        { color: 'yellow', label: 'Amarillo (Norte)', hex: '#f59e0b' },
        { color: 'green', label: 'Verde (Este)', hex: '#10b981' }
      ],
      chaturaji: [
        { color: 'red', label: 'Rojo', hex: '#ef4444' },
        { color: 'green', label: 'Verde', hex: '#10b981' },
        { color: 'yellow', label: 'Amarillo', hex: '#f59e0b' },
        { color: 'black', label: 'Negro', hex: '#64748b' }
      ],
      three_hex: [
        { color: 'white', label: 'Blanco', hex: '#f8fafc' },
        { color: 'black', label: 'Negro', hex: '#64748b' },
        { color: 'red', label: 'Rojo', hex: '#ef4444' }
      ],
      three_circular: [
        { color: 'white', label: 'Blanco', hex: '#f8fafc' },
        { color: 'black', label: 'Negro', hex: '#64748b' },
        { color: 'green', label: 'Verde', hex: '#10b981' }
      ],
      chess_2p_standard: [
        { color: 'white', label: 'Blancas', hex: '#f8fafc' },
        { color: 'black', label: 'Negras', hex: '#64748b' }
      ],
      standard: [
        { color: 'white', label: 'Blancas', hex: '#f8fafc' },
        { color: 'black', label: 'Negras', hex: '#64748b' }
      ]
    };
    const list = configs[variant] || configs.four_player;
    return list[index % list.length];
  }

  /**
   * Crea una nueva sala a partir de un objeto completo de PartyRoom o configuración básica
   */
  async createRoomFromPartyData(roomData, user) {
    this.currentUser = user;
    this.isHost = true;

    const roomId = JunvillRoomEngine.cleanRoomId(roomData.roomId || this.generateReadableCode());

    // Normalizar asientos
    const normalizedSeats = (roomData.seats || []).map((s, idx) => {
      const info = this.resolveSeatInfo(idx, roomData.variantId);
      const isHostSeat = s.isHost ?? (idx === 0);
      const isBot = s.type === 'bot';
      const playerObj = isHostSeat ? user : (isBot ? null : s.user);

      return {
        seatIndex: idx,
        index: idx,
        color: s.color || info.color,
        role: s.color || info.color,
        label: s.label || info.label,
        colorHex: s.colorHex || info.hex,
        type: isBot ? 'bot' : 'human',
        isBot,
        botDifficulty: s.botDifficulty || 'medium',
        isHost: isHostSeat,
        player: playerObj,
        user: playerObj,
        bot: isBot ? (s.bot || { name: `Robot ${info.color.toUpperCase()}`, elo: 500 }) : null,
        ready: s.ready ?? true,
        isReady: s.ready ?? true,
        timeRemainingMs: (roomData.initialTimeMin || 10) * 60 * 1000,
        isConnected: true,
        lastHeartbeat: Date.now()
      };
    });

    this.currentState = {
      roomId,
      variantId: roomData.variantId || 'four_player',
      variant: roomData.variantId || 'four_player',
      variantName: roomData.variantName || VARIANT_NAMES[roomData.variantId] || 'Ajedrez Multijugador',
      totalPlayers: roomData.totalPlayers || normalizedSeats.length,
      maxSeats: roomData.totalPlayers || normalizedSeats.length,
      expectedHumans: roomData.expectedHumans || 2,
      botsCount: roomData.botsCount || 0,
      hostUserId: user?.id,
      hostUser: {
        id: user?.id,
        name: user?.name || 'Anfitrión',
        avatar: user?.avatar,
        avatarConfig: user?.avatarConfig
      },
      status: 'lobby',
      version: 1,
      seats: normalizedSeats,
      currentTurnSeatIndex: 0,
      turnOrder: Array.from({ length: normalizedSeats.length }, (_, i) => i),
      timeControl: {
        initialTimeMs: 10 * 60 * 1000,
        incrementMs: 5000
      },
      lastMoveTimestamp: Date.now(),
      moveHistory: [],
      lastMove: null,
      boardState: null,
      dice: null,
      winnerSeatIndices: null,
      terminationReason: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await this.transport.connect(roomId, user);
    await this.transport.trackPresence({ userId: user?.id, seatIndex: 0, isHost: true });
    await this.transport.broadcastState(this.currentState);

    this.emitStateChange();
    return roomId;
  }

  /**
   * Conecta a una sala existente mediante código
   */
  async joinRoom(roomId, user) {
    const cleanRoomId = JunvillRoomEngine.cleanRoomId(roomId);
    this.currentUser = user;
    this.isHost = false;

    await this.transport.connect(cleanRoomId, user);
    await this.transport.trackPresence({ userId: user?.id, seatIndex: null, isHost: false });

    // Solicitar resincronización inmediata al host
    if (this.transport.channel) {
      await this.transport.channel.send({
        type: 'broadcast',
        event: 'REQUEST_RESYNC',
        payload: { requesterId: user?.id, roomId: cleanRoomId }
      }).catch(() => {});
    }

    return cleanRoomId;
  }

  /**
   * Asigna automáticamente al usuario en el primer asiento libre disponible
   */
  async claimFirstAvailableSeat(user) {
    if (!this.currentState || !Array.isArray(this.currentState.seats)) return -1;
    const playerToAssign = user || this.currentUser;
    if (!playerToAssign) return -1;

    // Si ya está sentado, devolver su asiento
    const myId = String(playerToAssign.id || playerToAssign.uid || '').toLowerCase().trim();
    const myName = String(playerToAssign.name || '').toLowerCase().trim();
    const existingIdx = this.currentState.seats.findIndex(s => {
      const uId = String(s.user?.id || s.player?.id || '').toLowerCase().trim();
      const uName = String(s.user?.name || s.player?.name || '').toLowerCase().trim();
      return (myId && uId && myId === uId) || (myName && uName && myName === uName);
    });
    if (existingIdx !== -1) {
      return existingIdx;
    }

    // Buscar primer asiento humano sin ocupar
    const freeIdx = this.currentState.seats.findIndex(s => s.type === 'human' && !s.user);
    if (freeIdx !== -1) {
      await this.claimSeat(freeIdx, playerToAssign);
      return freeIdx;
    }

    return -1;
  }

  /**
   * Reclama un asiento específico
   */
  async claimSeat(seatIndex, user = null, botConfig = null) {
    if (!this.currentState) return false;
    const targetSeat = this.currentState.seats[seatIndex];
    if (!targetSeat) return false;

    const playerToAssign = user || this.currentUser;

    if (botConfig) {
      targetSeat.isOccupied = true;
      targetSeat.type = 'bot';
      targetSeat.isBot = true;
      targetSeat.botDifficulty = botConfig.difficulty || 'medium';
      targetSeat.bot = {
        id: `bot_seat_${seatIndex}`,
        name: botConfig.name || `Robot ${targetSeat.color.toUpperCase()}`,
        elo: botConfig.elo || 500,
        title: 'Robot Junvill',
        color: targetSeat.colorHex
      };
      targetSeat.player = null;
      targetSeat.user = null;
      targetSeat.ready = true;
      targetSeat.isReady = true;
      targetSeat.isConnected = true;
    } else {
      targetSeat.isOccupied = true;
      targetSeat.type = 'human';
      targetSeat.isBot = false;
      targetSeat.bot = null;
      targetSeat.botDifficulty = null;
      targetSeat.player = playerToAssign;
      targetSeat.user = playerToAssign;
      targetSeat.ready = true;
      targetSeat.isReady = true;
      targetSeat.isConnected = true;
      await this.transport.trackPresence({ userId: playerToAssign?.id, seatIndex, isHost: targetSeat.isHost });
    }

    this.currentState.version++;
    this.currentState.updatedAt = Date.now();
    await this.transport.broadcastState(this.currentState);
    this.emitStateChange();
    return true;
  }

  /**
   * Libera un asiento
   */
  async vacateSeat(seatIndex) {
    if (!this.currentState) return;
    const targetSeat = this.currentState.seats[seatIndex];
    if (!targetSeat) return;

    targetSeat.isOccupied = false;
    targetSeat.type = 'human';
    targetSeat.isBot = false;
    targetSeat.bot = null;
    targetSeat.botDifficulty = null;
    targetSeat.player = null;
    targetSeat.user = null;
    targetSeat.ready = false;
    targetSeat.isReady = false;

    this.currentState.version++;
    this.currentState.updatedAt = Date.now();
    await this.transport.broadcastState(this.currentState);
    this.emitStateChange();
  }

  /**
   * Cambia un asiento humano por bot o viceversa
   */
  async toggleSeatBot(seatIndex, difficulty = 'medium') {
    if (!this.currentState || !this.isHost) return;
    const targetSeat = this.currentState.seats[seatIndex];
    if (!targetSeat) return;

    if (targetSeat.isBot) {
      // Convertir a asiento humano vacío
      targetSeat.isOccupied = false;
      targetSeat.type = 'human';
      targetSeat.isBot = false;
      targetSeat.bot = null;
      targetSeat.player = null;
      targetSeat.user = null;
      targetSeat.ready = false;
      targetSeat.isReady = false;
    } else {
      // Convertir a bot
      targetSeat.isOccupied = true;
      targetSeat.type = 'bot';
      targetSeat.isBot = true;
      targetSeat.botDifficulty = difficulty;
      targetSeat.bot = {
        id: `bot_seat_${seatIndex}`,
        name: `Robot ${targetSeat.color.toUpperCase()}`,
        elo: 500,
        title: 'Robot Junvill',
        color: targetSeat.colorHex
      };
      targetSeat.player = null;
      targetSeat.user = null;
      targetSeat.ready = true;
      targetSeat.isReady = true;
      targetSeat.isConnected = true;
    }

    this.currentState.version++;
    this.currentState.updatedAt = Date.now();
    await this.transport.broadcastState(this.currentState);
    this.emitStateChange();
  }

  /**
   * Inicia la partida (Host)
   */
  async startGame(initialBoardState = null) {
    if (!this.currentState) return;
    this.isHost = true; // El usuario que inicia asume/confirma rol de anfitrión

    // Rellenar asientos humanos no ocupados con bots
    this.currentState.seats.forEach((seat, i) => {
      if (seat.type === 'human' && !seat.user) {
        seat.isOccupied = true;
        seat.type = 'bot';
        seat.isBot = true;
        seat.botDifficulty = 'medium';
        seat.bot = {
          id: `bot_seat_${i}`,
          name: `Robot ${seat.color.toUpperCase()}`,
          elo: 600,
          title: 'Robot Junvill',
          color: seat.colorHex
        };
        seat.player = null;
        seat.user = null;
        seat.ready = true;
        seat.isReady = true;
        seat.isConnected = true;
      }
    });

    this.currentState.status = 'playing';
    this.currentState.currentTurnSeatIndex = 0;
    this.currentState.lastMoveTimestamp = Date.now();
    this.currentState.boardState = initialBoardState;
    this.currentState.version++;
    this.currentState.updatedAt = Date.now();

    await this.transport.broadcastState(this.currentState);

    // Emitir eventos explícitos START_GAME y PARTY_ROOM_START para que ningún cliente se quede en el lobby
    if (this.transport.channel) {
      await this.transport.channel.send({
        type: 'broadcast',
        event: 'START_GAME',
        payload: this.currentState
      }).catch(() => {});

      await this.transport.channel.send({
        type: 'broadcast',
        event: 'PARTY_ROOM_START',
        payload: { roomId: this.currentState.roomId, roomData: this.currentState }
      }).catch(() => {});
    }

    this.emitStateChange();
    return this.currentState;
  }

  /**
   * Envía una jugada realizada
   */
  async sendMove({
    from,
    to,
    san,
    piece,
    promotion,
    captured,
    nextTurnSeatIndex,
    boardState = null,
    dice = null,
    moveArgs = null,
    senderId = null,
    variantId = null,
    isBot = null,
    turn = null
  }) {
    if (!this.currentState || this.currentState.status !== 'playing') return;

    const currentSeatIndex = this.currentState.currentTurnSeatIndex;
    const currentSeat = this.currentState.seats[currentSeatIndex];
    const now = Date.now();
    const elapsed = now - (this.currentState.lastMoveTimestamp || now);
    const increment = this.currentState.timeControl?.incrementMs || 0;
    const remaining = Math.max(0, (currentSeat?.timeRemainingMs || 0) - elapsed + increment);

    const isBotMove = isBot !== null ? !!isBot : !!(currentSeat?.isBot || currentSeat?.type === 'bot');

    const movePayload = {
      moveNumber: (this.currentState.moveHistory.length || 0) + 1,
      seatIndex: currentSeatIndex,
      from,
      to,
      san,
      piece,
      promotion,
      captured,
      clockRemainingMs: remaining,
      timestamp: now,
      dice,
      moveArgs: moveArgs || [from, to],
      senderId: senderId || this.currentUser?.id,
      variantId: variantId || this.currentState.variantId,
      isBot: isBotMove,
      turn: turn || currentSeat?.color
    };

    const nextTurn = typeof nextTurnSeatIndex === 'number' 
      ? nextTurnSeatIndex 
      : (currentSeatIndex + 1) % this.currentState.maxSeats;
    const nextVersion = this.currentState.version + 1;

    // Mutación optimista local
    this.currentState.moveHistory.push(movePayload);
    this.currentState.lastMove = movePayload;
    this.currentState.currentTurnSeatIndex = nextTurn;
    this.currentState.lastMoveTimestamp = now;
    if (this.currentState.seats[currentSeatIndex]) {
      this.currentState.seats[currentSeatIndex].timeRemainingMs = remaining;
    }
    if (boardState) this.currentState.boardState = boardState;
    if (dice !== undefined) this.currentState.dice = dice;
    this.currentState.version = nextVersion;
    this.currentState.updatedAt = now;

    // Difundir jugada rápida por WebSockets
    await this.transport.broadcastMove(movePayload, nextTurn, nextVersion);

    // Si somos host, cada 3 jugadas emitimos respaldo del estado completo
    if (this.isHost && this.currentState.moveHistory.length % 3 === 0) {
      await this.transport.broadcastState(this.currentState);
    }

    this.emitStateChange();
  }

  /**
   * Finaliza la partida
   */
  async endGame(winnerSeatIndices, terminationReason) {
    if (!this.currentState) return;
    this.currentState.status = 'gameover';
    this.currentState.winnerSeatIndices = winnerSeatIndices;
    this.currentState.terminationReason = terminationReason;
    this.currentState.version++;
    this.currentState.updatedAt = Date.now();

    await this.transport.broadcastState(this.currentState);
    this.emitStateChange();
  }

  /**
   * Sale de la sala
   */
  async leaveRoom() {
    if (this.currentState && this.currentUser) {
      const mySeat = this.currentState.seats.find(
        s => s.player?.id === this.currentUser?.id || s.user?.id === this.currentUser?.id
      );
      if (mySeat) {
        if (this.isHost) {
          this.currentState.status = 'cancelled';
        } else {
          mySeat.isOccupied = false;
          mySeat.user = null;
          mySeat.player = null;
          mySeat.ready = false;
          mySeat.isReady = false;
        }
        this.currentState.version++;
        await this.transport.broadcastState(this.currentState).catch(() => {});
      }
    }

    await this.transport.disconnect();
    this.currentState = null;
    this.isHost = false;
    this.emitStateChange();
  }

  // --- Handlers internos de transporte ---

  handleIncomingState(newState) {
    if (!newState || !newState.roomId) return;

    const isCurrentPlaying = this.currentState?.status === 'playing';
    const isNewPlaying = newState.status === 'playing';

    // Aceptar si es estado inicial, si inicia la partida (status playing) o si la versión es igual/mayor
    if (!this.currentState || isNewPlaying || newState.version >= this.currentState.version) {
      const prevMoveCount = this.currentState?.moveHistory?.length || 0;
      this.currentState = newState;

      const myId = this.currentUser?.id;
      const isHostSeat = newState.seats?.[0]?.user?.id === myId || newState.seats?.[0]?.player?.id === myId;
      const isHostUser = newState.hostUserId === myId || newState.hostUser?.id === myId;

      if (this.isHost) {
        this.isHost = !myId || isHostSeat || isHostUser;
      } else if (myId) {
        this.isHost = isHostSeat || isHostUser;
      }

      // Si el estado entrante contiene una jugada no procesada, notificar listeners
      if (newState.lastMove && (newState.moveHistory?.length || 0) > prevMoveCount) {
        for (const listener of this.moveListeners) {
          try { listener(newState.lastMove); } catch (e) { console.error(e); }
        }
      }

      this.emitStateChange();
    }
  }

  handleIncomingMove(move, nextTurn, version) {
    if (!this.currentState || !move) return;

    if (!Array.isArray(this.currentState.moveHistory)) {
      this.currentState.moveHistory = [];
    }

    // Deduplicación resiliente por firma de jugada
    const isAlreadyRecorded = this.currentState.moveHistory.some(m =>
      (m.timestamp && move.timestamp && m.timestamp === move.timestamp && m.senderId === move.senderId) ||
      (m.moveNumber && move.moveNumber && m.moveNumber === move.moveNumber && m.seatIndex === move.seatIndex)
    );

    if (!isAlreadyRecorded) {
      this.currentState.moveHistory.push(move);
      this.currentState.lastMove = move;
      if (typeof nextTurn === 'number') {
        this.currentState.currentTurnSeatIndex = nextTurn;
      }
      this.currentState.lastMoveTimestamp = move.timestamp || Date.now();
      if (typeof move.seatIndex === 'number' && this.currentState.seats?.[move.seatIndex]) {
        this.currentState.seats[move.seatIndex].timeRemainingMs = move.clockRemainingMs;
      }
      if (move.dice !== undefined) {
        this.currentState.dice = move.dice;
      }
      if (typeof version === 'number') {
        this.currentState.version = Math.max(this.currentState.version || 0, version);
      } else {
        this.currentState.version = (this.currentState.version || 0) + 1;
      }

      for (const listener of this.moveListeners) {
        try { listener(move); } catch (e) { console.error(e); }
      }

      this.emitStateChange();
    }
  }

  handleParticipantLeave(userId) {
    if (!this.currentState) return;

    // En partida activa, pausar el reloj e iniciar ventana de gracia
    if (this.currentState.status === 'playing') {
      const seat = this.currentState.seats.find(
        s => s.player?.id === userId || s.user?.id === userId
      );
      if (seat) {
        seat.isConnected = false;
        this.currentState.status = 'paused';
        this.currentState.graceExpiresAt = Date.now() + 60000;
        this.currentState.version++;
        if (this.isHost) {
          this.transport.broadcastState(this.currentState);
        }
        this.emitStateChange();
      }
    }
  }

  // --- Subscripciones de componentes React ---

  onStateChange(listener) {
    this.stateListeners.add(listener);
    if (this.currentState) {
      listener({ ...this.currentState, seats: [...this.currentState.seats] });
    }
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  onMove(listener) {
    this.moveListeners.add(listener);
    return () => {
      this.moveListeners.delete(listener);
    };
  }

  emitStateChange() {
    const copy = this.currentState ? { ...this.currentState, seats: [...this.currentState.seats] } : null;
    for (const listener of this.stateListeners) {
      try { listener(copy); } catch (e) { console.error(e); }
    }
  }

  getState() {
    return this.currentState;
  }

  getMySeatIndex() {
    if (!this.currentState || !this.currentUser) return -1;
    const myId = String(this.currentUser.id || this.currentUser.uid || '').toLowerCase().trim();
    const myName = String(this.currentUser.name || '').toLowerCase().trim();
    return (this.currentState.seats || []).findIndex(s => {
      const uId = String(s.user?.id || s.player?.id || '').toLowerCase().trim();
      const uName = String(s.user?.name || s.player?.name || '').toLowerCase().trim();
      return (myId && uId && myId === uId) || (myName && uName && myName === uName);
    });
  }
}

// Instancia global por defecto
export const roomEngine = JunvillRoomEngine.getInstance();
