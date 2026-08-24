import Peer from 'peerjs';

/**
 * Motor de Conexión P2P WebRTC de Ajedrez Junvill
 * Permite partidas multijugador directas de navegador a navegador con encriptación E2EE (DTLS),
 * retos directos familiares a 1 clic, códigos simplificados sin guión y modo espectador en vivo.
 */

export class P2PEngine {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.spectatorConns = [];
    this.roomId = null;
    this.isHost = false;
    this.isSpectator = false;
    this.listeners = {
      open: [],
      connected: [],
      spectatorConnected: [],
      data: [],
      spectatorData: [],
      disconnected: [],
      error: []
    };
  }

  // Normaliza cualquier código de sala eliminando guiones y espacios (ej: 'JUN-7K2' -> 'JUN7K2')
  static cleanRoomId(rawId) {
    return (rawId || '')
      .replace(/[-\s]/g, '')
      .toUpperCase()
      .trim();
  }

  // Genera un ID de sala amigable sin guiones tipo JUNXXXX (ej: JUN8K2, JUN77A)
  static generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `JUN${code}`;
  }

  // Iniciar como Anfitrión (Host)
  initHost(customRoomId = null) {
    this.destroy();
    this.isHost = true;
    this.isSpectator = false;
    this.roomId = P2PEngine.cleanRoomId(customRoomId || P2PEngine.generateRoomId());
    const peerId = `ajedrez-junvill-${this.roomId.toLowerCase()}`;

    this.peer = new Peer(peerId, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    this.peer.on('open', (id) => {
      this.trigger('open', { roomId: this.roomId, peerId: id });
    });

    this.peer.on('connection', (connection) => {
      const isSpec = connection.metadata && connection.metadata.role === 'spectator';
      if (isSpec) {
        this.setupSpectatorHostConnection(connection);
      } else {
        this.conn = connection;
        this.setupConnection();
      }
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        console.log(`[P2P] ID ${this.roomId} ya registrado como Host. Cambiando automáticamente a unirse como Invitado...`);
        this.joinRoom(this.roomId);
        return;
      }
      if (err.type === 'socket-error' || err.type === 'socket-closed' || err.type === 'network') {
        console.log('[P2P] Reconectando socket con servidor de señalización...');
        try { this.peer.reconnect(); } catch (e) {}
        return;
      }
      console.warn('[P2P] Host error info:', err);
    });

    return this.roomId;
  }

  // Conectarse a una sala existente como Jugador Invitado (Guest)
  joinRoom(targetRoomId, playerProfile = null) {
    this.destroy();
    this.isHost = false;
    this.isSpectator = false;
    this.roomId = P2PEngine.cleanRoomId(targetRoomId);
    const peerId = `ajedrez-junvill-${this.roomId.toLowerCase()}`;

    this.peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    let connectionTimeout = setTimeout(() => {
      if (!this.conn || !this.conn.open) {
        this.trigger('error', {
          type: 'timeout',
          message: `Tiempo de espera agotado. Verifica que tu amigo tenga abierta la sala "${this.roomId}".`
        });
      }
    }, 12000);

    let retries = 0;
    const maxRetries = 4;
    let isConnected = false;

    const attemptConnect = () => {
      if (isConnected || this.isDestroyed || !this.peer) return;
      try {
        const connection = this.peer.connect(peerId, { 
          reliable: true,
          metadata: { role: 'player', profile: playerProfile }
        });
        this.conn = connection;
        this.setupConnection(() => {
          isConnected = true;
          clearTimeout(connectionTimeout);
        });
      } catch (err) {}
    };

    this.peer.on('open', () => {
      attemptConnect();
    });

    this.peer.on('error', (err) => {
      if (err.type === 'peer-unavailable' && retries < maxRetries && !isConnected) {
        retries++;
        console.log(`[P2P] Sala no encontrada aún en PeerJS, reintentando intento ${retries}/${maxRetries}...`);
        setTimeout(() => {
          if (!isConnected && !this.isDestroyed) {
            attemptConnect();
          }
        }, 1200);
        return;
      }

      clearTimeout(connectionTimeout);
      let friendlyMessage = 'No se pudo conectar a la sala.';
      if (err.type === 'peer-unavailable') {
        friendlyMessage = `La sala "${this.roomId}" no está activa. Asegúrate de que tu compañero haya aceptado el reto y tenga la pantalla abierta.`;
      }
      this.trigger('error', { originalError: err, message: friendlyMessage });
    });
  }

  // Conectarse como Espectador en Vivo (Spectator)
  joinAsSpectator(targetRoomId, spectatorProfile = null) {
    this.destroy();
    this.isHost = false;
    this.isSpectator = true;
    this.roomId = P2PEngine.cleanRoomId(targetRoomId);
    const peerId = `ajedrez-junvill-${this.roomId.toLowerCase()}`;

    this.peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    let connectionTimeout = setTimeout(() => {
      if (!this.conn || !this.conn.open) {
        this.trigger('error', {
          type: 'timeout',
          message: `Tiempo de espera agotado. La partida "${this.roomId}" no está disponible o el anfitrión se desconectó.`
        });
      }
    }, 10000);

    this.peer.on('open', () => {
      try {
        const connection = this.peer.connect(peerId, {
          reliable: true,
          metadata: { role: 'spectator', profile: spectatorProfile }
        });
        this.conn = connection;
        this.setupSpectatorClientConnection(() => clearTimeout(connectionTimeout));
      } catch (err) {
        clearTimeout(connectionTimeout);
        this.trigger('error', { originalError: err, message: 'Error al conectar como espectador.' });
      }
    });

    this.peer.on('error', (err) => {
      clearTimeout(connectionTimeout);
      let friendlyMessage = 'No se pudo conectar a la sala como espectador.';
      if (err.type === 'peer-unavailable') {
        friendlyMessage = `La sala "${this.roomId}" no está activa para espectar.`;
      }
      this.trigger('error', { originalError: err, message: friendlyMessage });
    });
  }

  setupConnection(onSuccessCallback = null) {
    if (!this.conn) return;

    this.conn.on('open', () => {
      if (onSuccessCallback) onSuccessCallback();
      this.trigger('connected', { isHost: this.isHost, roomId: this.roomId });
    });

    this.conn.on('data', (data) => {
      this.trigger('data', data);
      // Re-transmitir jugadas a espectadores si somos el Host
      if (this.isHost && this.spectatorConns.length > 0) {
        this.broadcastToSpectators(data);
      }
    });

    this.conn.on('close', () => {
      this.trigger('disconnected');
    });

    this.conn.on('error', (err) => {
      this.trigger('error', { originalError: err, message: 'Error durante la transmisión de la partida.' });
    });
  }

  setupSpectatorHostConnection(spectatorConnection) {
    this.spectatorConns.push(spectatorConnection);

    spectatorConnection.on('open', () => {
      this.trigger('spectatorConnected', {
        spectatorId: spectatorConnection.peer,
        count: this.spectatorConns.length,
        profile: spectatorConnection.metadata?.profile
      });
      // Solicitar al componente del juego que envíe el estado inicial
      this.trigger('request_spectator_sync', { connection: spectatorConnection });
    });

    spectatorConnection.on('data', (data) => {
      // Reacciones de espectadores
      this.trigger('spectatorData', data);
      // Re-enviar reacción al jugador rival
      if (this.conn && this.conn.open) {
        this.conn.send(data);
      }
    });

    spectatorConnection.on('close', () => {
      this.spectatorConns = this.spectatorConns.filter(c => c !== spectatorConnection);
    });
  }

  setupSpectatorClientConnection(onSuccessCallback = null) {
    if (!this.conn) return;

    this.conn.on('open', () => {
      if (onSuccessCallback) onSuccessCallback();
      this.trigger('connected', { isSpectator: true, roomId: this.roomId });
    });

    this.conn.on('data', (data) => {
      this.trigger('data', data);
    });

    this.conn.on('close', () => {
      this.trigger('disconnected');
    });

    this.conn.on('error', (err) => {
      this.trigger('error', { originalError: err, message: 'Error en la transmisión en vivo de la partida.' });
    });
  }

  broadcastToSpectators(data) {
    this.spectatorConns.forEach(sc => {
      if (sc && sc.open) {
        sc.send(data);
      }
    });
  }

  send(data) {
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
    if (this.isHost && this.spectatorConns.length > 0) {
      this.broadcastToSpectators(data);
    }
  }

  // Métodos de envío de eventos de partida
  sendMove(move, fen, clocks = null) {
    this.send({ type: 'MOVE', move, fen, clocks, timestamp: Date.now() });
  }

  sendSafeChat(message, isEmote = false) {
    this.send({ type: 'SAFE_CHAT', text: message, isEmote, timestamp: Date.now() });
  }

  sendSync(gameState) {
    this.send({ type: 'SYNC', gameState, timestamp: Date.now() });
  }

  sendSpectatorSync(targetConnection, fullGameState) {
    if (targetConnection && targetConnection.open) {
      targetConnection.send({ type: 'SPECTATOR_SYNC', fullGameState, timestamp: Date.now() });
    }
  }

  sendSpectatorReaction(emoji, fromName = 'Espectador') {
    this.send({ type: 'SPECTATOR_REACTION', emoji, fromName, timestamp: Date.now() });
  }

  sendResign() {
    this.send({ type: 'RESIGN', timestamp: Date.now() });
  }

  sendDrawOffer() {
    this.send({ type: 'OFFER_DRAW', timestamp: Date.now() });
  }

  sendAcceptDraw() {
    this.send({ type: 'ACCEPT_DRAW', timestamp: Date.now() });
  }

  sendRematch() {
    this.send({ type: 'REMATCH', timestamp: Date.now() });
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  trigger(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  destroy() {
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
    this.spectatorConns.forEach(sc => {
      if (sc) sc.close();
    });
    this.spectatorConns = [];
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}
