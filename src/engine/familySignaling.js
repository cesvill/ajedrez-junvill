import Peer from 'peerjs';

/**
 * Servicio de Señalización y Conexión Familiar en Tiempo Real
 * Soporta retos multijugador, minijuegos familiares, presencia en línea (Online status)
 * y mensajería directa encriptada WebRTC sin backend central.
 */

class FamilySignalingService {
  constructor() {
    this.peer = null;
    this.currentUserId = null;
    this.callbacks = {};
  }

  getTargetCleanIds(targetId) {
    if (!targetId) return [];
    const normalized = String(targetId)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    const ids = new Set();
    // 1. ID canónico por nombre o rol normalizado
    if (normalized.includes('cesar')) ids.add('ajedrez-junvill-user-user_cesar');
    if (normalized.includes('leti')) ids.add('ajedrez-junvill-user-user_leti');
    if (normalized.includes('martin')) ids.add('ajedrez-junvill-user-user_martin');
    if (normalized.includes('estudiante') || normalized.includes('student')) ids.add('ajedrez-junvill-user-user_estudiante');

    // 2. ID directo limpiando caracteres
    const rawClean = String(targetId).replace(/[^a-zA-Z0-9_-]/g, '');
    if (rawClean) {
      ids.add(`ajedrez-junvill-user-${rawClean}`);
      if (!rawClean.startsWith('user_')) {
        ids.add(`ajedrez-junvill-user-user_${rawClean}`);
      }
    }
    const normClean = normalized.replace(/[^a-z0-9_-]/g, '');
    if (normClean) {
      ids.add(`ajedrez-junvill-user-${normClean}`);
      ids.add(`ajedrez-junvill-user-user_${normClean}`);
    }

    return Array.from(ids);
  }

  getCanonicalUserId(userId) {
    if (!userId) return 'user_estudiante';
    const normalized = String(userId)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    if (normalized.includes('cesar')) return 'user_cesar';
    if (normalized.includes('leti')) return 'user_leti';
    if (normalized.includes('martin')) return 'user_martin';
    if (normalized.includes('estudiante') || normalized.includes('student')) return 'user_estudiante';

    const clean = normalized.replace(/[^a-z0-9_-]/g, '');
    return clean.startsWith('user_') ? clean : `user_${clean}`;
  }

  // Inicializa el receptor para el usuario actualmente conectado
  init(userId, callbacks = {}) {
    if (!userId) return;
    const canonicalId = this.getCanonicalUserId(userId);

    if (this.currentUserId === canonicalId && this.peer && !this.peer.destroyed) {
      this.callbacks = { ...this.callbacks, ...callbacks };
      return;
    }

    this.destroy();
    this.currentUserId = canonicalId;
    this.callbacks = callbacks;
    const peerId = `ajedrez-junvill-user-${canonicalId}`;

    try {
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
        console.log('[FamilySignaling] Receptor activo y escuchando como peer:', id);
      });

      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          if (!data) return;
          const {
            onReceiveInvitation,
            onInvitationStatusChange,
            onProgressUpdate,
            onHeartbeat,
            onMessage
          } = this.callbacks;

          if (data.type === 'FAMILY_INVITATION' && onReceiveInvitation) {
            onReceiveInvitation(data.invitation);
          } else if (data.type === 'FAMILY_INVITATION_STATUS' && onInvitationStatusChange) {
            onInvitationStatusChange(data.invitationId, data.status);
          } else if (data.type === 'FAMILY_PROGRESS_UPDATE' && onProgressUpdate) {
            onProgressUpdate(data.groupData);
          } else if (data.type === 'FAMILY_HEARTBEAT' && onHeartbeat) {
            onHeartbeat(data.userId, data.payload);
          } else if (data.type === 'FAMILY_MESSAGE' && onMessage) {
            onMessage(data.message);
          }
        });
      });

      this.peer.on('error', (err) => {
        // Ignorar colisiones y mantener el peer activo
      });
    } catch (e) {
      console.warn('[FamilySignaling] Init error:', e);
    }
  }

  // Transmitir payload a los IDs de destino utilizando el peer activo o tempPeer
  _sendPayloadToTargets(targetUserId, payload) {
    if (!targetUserId || !payload) return;
    const targetCleanIds = this.getTargetCleanIds(targetUserId);

    targetCleanIds.forEach(cleanTargetId => {
      // 1. Intentar enviar con this.peer si está listo
      if (this.peer && !this.peer.destroyed && this.peer.open) {
        try {
          const conn = this.peer.connect(cleanTargetId, { reliable: true });
          conn.on('open', () => {
            conn.send(payload);
          });
          conn.on('error', () => {});
        } catch (e) {}
      }

      // 2. Transmisión paralela redundante con tempPeer para máxima confiabilidad
      try {
        const tempPeer = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        tempPeer.on('open', () => {
          const conn = tempPeer.connect(cleanTargetId, { reliable: true });
          conn.on('open', () => {
            conn.send(payload);
            setTimeout(() => {
              try { tempPeer.destroy(); } catch (e) {}
            }, 2500);
          });
          conn.on('error', () => {
            try { tempPeer.destroy(); } catch (e) {}
          });
        });

        tempPeer.on('error', () => {
          try { tempPeer.destroy(); } catch (e) {}
        });
      } catch (err) {}
    });
  }

  // Enviar un reto a otro familiar en tiempo real
  sendInvitation(targetUserId, invitation) {
    this._sendPayloadToTargets(targetUserId, {
      type: 'FAMILY_INVITATION',
      invitation,
      timestamp: Date.now()
    });
  }

  // Notificar actualización de estado del reto (aceptado / rechazado)
  sendStatus(targetUserId, invitationId, status) {
    this._sendPayloadToTargets(targetUserId, {
      type: 'FAMILY_INVITATION_STATUS',
      invitationId,
      status,
      timestamp: Date.now()
    });
  }

  // Enviar mensaje de chat directo a un familiar
  sendMessage(targetUserId, messagePayload) {
    this._sendPayloadToTargets(targetUserId, {
      type: 'FAMILY_MESSAGE',
      message: messagePayload,
      timestamp: Date.now()
    });
  }

  // Emitir señal de presencia activa (Heartbeat) a los demás familiares
  broadcastHeartbeat(userId, payload, targetUserIds = []) {
    if (!userId || !targetUserIds || targetUserIds.length === 0) return;

    targetUserIds.forEach(targetUserId => {
      if (!targetUserId || targetUserId === userId) return;
      this._sendPayloadToTargets(targetUserId, {
        type: 'FAMILY_HEARTBEAT',
        userId,
        payload,
        timestamp: Date.now()
      });
    });
  }

  // Transmitir actualización de progreso en tiempo real a todos los miembros
  broadcastProgressUpdate(groupData, targetUserIds = []) {
    if (!groupData || !targetUserIds || targetUserIds.length === 0) return;

    targetUserIds.forEach(targetUserId => {
      if (!targetUserId || targetUserId === this.currentUserId) return;
      this._sendPayloadToTargets(targetUserId, {
        type: 'FAMILY_PROGRESS_UPDATE',
        groupData,
        timestamp: Date.now()
      });
    });
  }

  destroy() {
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    this.currentUserId = null;
  }
}

export const familySignaling = new FamilySignalingService();
