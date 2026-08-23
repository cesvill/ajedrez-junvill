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
    this.heartbeatTimer = null;
  }

  getTargetCleanIds(targetId) {
    if (!targetId) return [];
    const clean = `ajedrez-junvill-user-${String(targetId).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const lower = String(targetId).toLowerCase();
    let norm = null;
    if (lower.includes('leti')) norm = 'ajedrez-junvill-user-user_leti';
    else if (lower.includes('cesar')) norm = 'ajedrez-junvill-user-user_cesar';
    else if (lower.includes('martin')) norm = 'ajedrez-junvill-user-user_martin';
    else if (lower.includes('estudiante') || lower.includes('student')) norm = 'ajedrez-junvill-user-user_estudiante';

    if (norm && norm !== clean) {
      return [clean, norm];
    }
    return [clean];
  }

  // Inicializa el receptor para el usuario actualmente conectado
  init(userId, callbacks = {}) {
    if (this.currentUserId === userId && this.peer && !this.peer.destroyed) {
      return;
    }

    this.destroy();
    if (!userId) return;

    this.currentUserId = userId;
    const cleanId = `ajedrez-junvill-user-${userId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    const {
      onReceiveInvitation,
      onInvitationStatusChange,
      onProgressUpdate,
      onHeartbeat,
      onMessage
    } = callbacks;

    try {
      this.peer = new Peer(cleanId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log('[FamilySignaling] Conectado como peer:', id);
      });

      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          if (!data) return;
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
        // Ignorar colisiones de peer normales
      });
    } catch (e) {
      console.warn('[FamilySignaling] Init error:', e);
    }
  }

  // Enviar un reto a otro familiar en tiempo real
  sendInvitation(targetUserId, invitation) {
    if (!targetUserId || !invitation) return;
    const targetCleanIds = this.getTargetCleanIds(targetUserId);

    targetCleanIds.forEach(cleanTargetId => {
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
          const conn = tempPeer.connect(cleanTargetId);
          conn.on('open', () => {
            conn.send({ type: 'FAMILY_INVITATION', invitation, timestamp: Date.now() });
            setTimeout(() => {
              try { tempPeer.destroy(); } catch (e) {}
            }, 2000);
          });
        });

        tempPeer.on('error', () => {
          try { tempPeer.destroy(); } catch (e) {}
        });
      } catch (err) {}
    });
  }

  // Notificar actualización de estado del reto (aceptado / rechazado)
  sendStatus(targetUserId, invitationId, status) {
    if (!targetUserId || !invitationId) return;
    const targetCleanIds = this.getTargetCleanIds(targetUserId);

    targetCleanIds.forEach(cleanTargetId => {
      try {
        const tempPeer = new Peer({
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        });

        tempPeer.on('open', () => {
          const conn = tempPeer.connect(cleanTargetId);
          conn.on('open', () => {
            conn.send({ type: 'FAMILY_INVITATION_STATUS', invitationId, status, timestamp: Date.now() });
            setTimeout(() => {
              try { tempPeer.destroy(); } catch (e) {}
            }, 2000);
          });
        });

        tempPeer.on('error', () => {
          try { tempPeer.destroy(); } catch (e) {}
        });
      } catch (err) {}
    });
  }

  // Enviar mensaje de chat directo a un familiar
  sendMessage(targetUserId, messagePayload) {
    if (!targetUserId || !messagePayload) return;
    const targetCleanIds = this.getTargetCleanIds(targetUserId);

    targetCleanIds.forEach(cleanTargetId => {
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
          const conn = tempPeer.connect(cleanTargetId);
          conn.on('open', () => {
            conn.send({ type: 'FAMILY_MESSAGE', message: messagePayload, timestamp: Date.now() });
            setTimeout(() => {
              try { tempPeer.destroy(); } catch (e) {}
            }, 2000);
          });
        });

        tempPeer.on('error', () => {
          try { tempPeer.destroy(); } catch (e) {}
        });
      } catch (err) {}
    });
  }

  // Emitir señal de presencia activa (Heartbeat) a los demás familiares
  broadcastHeartbeat(userId, payload, targetUserIds = []) {
    if (!userId || !targetUserIds || targetUserIds.length === 0) return;

    targetUserIds.forEach(targetUserId => {
      if (!targetUserId || targetUserId === userId) return;
      const targetCleanIds = this.getTargetCleanIds(targetUserId);

      targetCleanIds.forEach(cleanTargetId => {
        try {
          const tempPeer = new Peer({
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
          });

          tempPeer.on('open', () => {
            const conn = tempPeer.connect(cleanTargetId);
            conn.on('open', () => {
              conn.send({ type: 'FAMILY_HEARTBEAT', userId, payload, timestamp: Date.now() });
              setTimeout(() => {
                try { tempPeer.destroy(); } catch (e) {}
              }, 1800);
            });
          });

          tempPeer.on('error', () => {
            try { tempPeer.destroy(); } catch (e) {}
          });
        } catch (err) {}
      });
    });
  }

  // Transmitir actualización de progreso en tiempo real a todos los miembros
  broadcastProgressUpdate(groupData, targetUserIds = []) {
    if (!groupData || !targetUserIds || targetUserIds.length === 0) return;

    targetUserIds.forEach(targetUserId => {
      if (!targetUserId || targetUserId === this.currentUserId) return;
      const targetCleanIds = this.getTargetCleanIds(targetUserId);

      targetCleanIds.forEach(cleanTargetId => {
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
            const conn = tempPeer.connect(cleanTargetId);
            conn.on('open', () => {
              conn.send({ type: 'FAMILY_PROGRESS_UPDATE', groupData, timestamp: Date.now() });
              setTimeout(() => {
                try { tempPeer.destroy(); } catch (e) {}
              }, 2000);
            });
          });

          tempPeer.on('error', () => {
            try { tempPeer.destroy(); } catch (e) {}
          });
        } catch (err) {}
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
