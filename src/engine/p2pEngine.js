import Peer from 'peerjs';

/**
 * Motor de Conexión P2P WebRTC de Ajedrez Junvill
 * Permite partidas multijugador directas de navegador a navegador con encriptación E2EE (DTLS).
 */

export class P2PEngine {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.roomId = null;
    this.isHost = false;
    this.listeners = {
      open: [],
      connected: [],
      data: [],
      disconnected: [],
      error: []
    };
  }

  // Genera un ID de sala amigable tipo JUN-XXXX
  static generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `JUN-${code}`;
  }

  // Iniciar como Anfitrión (Host)
  initHost(customRoomId = null) {
    this.destroy();
    this.isHost = true;
    this.roomId = (customRoomId || P2PEngine.generateRoomId()).toUpperCase().trim();
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
      this.conn = connection;
      this.setupConnection();
    });

    this.peer.on('error', (err) => {
      let friendlyMessage = 'Error en el servidor de conexión P2P.';
      if (err.type === 'unavailable-id') {
        friendlyMessage = `El código de sala ${this.roomId} ya está ocupado. Intenta con otro código.`;
      }
      this.trigger('error', { originalError: err, message: friendlyMessage });
    });

    return this.roomId;
  }

  // Conectarse a una sala existente como Invitado (Guest)
  joinRoom(targetRoomId) {
    this.destroy();
    this.isHost = false;
    this.roomId = targetRoomId.toUpperCase().trim();
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
          message: `Tiempo de espera agotado. Verifica que tu amigo haya hecho clic en 'Crear Sala' y tenga la pantalla abierta.`
        });
      }
    }, 10000);

    this.peer.on('open', () => {
      try {
        const connection = this.peer.connect(peerId, { reliable: true });
        this.conn = connection;
        this.setupConnection(() => clearTimeout(connectionTimeout));
      } catch (err) {
        clearTimeout(connectionTimeout);
        this.trigger('error', { originalError: err, message: 'No se pudo iniciar la conexión con el rival.' });
      }
    });

    this.peer.on('error', (err) => {
      clearTimeout(connectionTimeout);
      let friendlyMessage = 'No se pudo conectar a la sala.';
      if (err.type === 'peer-unavailable') {
        friendlyMessage = `La sala "${this.roomId}" no está activa. Asegúrate de que tu amigo haya presionado "Crear Sala" primero.`;
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
    });

    this.conn.on('close', () => {
      this.trigger('disconnected');
    });

    this.conn.on('error', (err) => {
      this.trigger('error', { originalError: err, message: 'Error durante la transmisión de la partida.' });
    });
  }

  send(data) {
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
  }

  // Métodos de envío específicos
  sendMove(move, fen) {
    this.send({ type: 'MOVE', move, fen, timestamp: Date.now() });
  }

  sendSafeChat(message, isEmote = false) {
    this.send({ type: 'SAFE_CHAT', text: message, isEmote, timestamp: Date.now() });
  }

  sendSync(gameState) {
    this.send({ type: 'SYNC', gameState, timestamp: Date.now() });
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
    }
    if (this.peer) {
      this.peer.destroy();
    }
  }
}
