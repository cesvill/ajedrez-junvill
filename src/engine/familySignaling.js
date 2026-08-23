import Peer from 'peerjs';

/**
 * Servicio de Señalización de Retos Familiares en Tiempo Real
 * Utiliza PeerJS global para notificar instantáneamente entre dispositivos (móvil, PC, tablet)
 * sin requerir servidores intermedios de backend.
 */

class FamilySignalingService {
  constructor() {
    this.peer = null;
    this.currentUserId = null;
    this.invitationListeners = [];
  }

  // Inicializa el receptor para el usuario actualmente conectado
  init(userId, onReceiveInvitation, onInvitationStatusChange, onProgressUpdate) {
    if (this.currentUserId === userId && this.peer && !this.peer.destroyed) {
      return;
    }

    this.destroy();
    if (!userId) return;

    this.currentUserId = userId;
    const cleanId = `ajedrez-junvill-user-${userId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    try {
      this.peer = new Peer(cleanId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          if (data?.type === 'FAMILY_INVITATION' && onReceiveInvitation) {
            onReceiveInvitation(data.invitation);
          } else if (data?.type === 'FAMILY_INVITATION_STATUS' && onInvitationStatusChange) {
            onInvitationStatusChange(data.invitationId, data.status);
          } else if (data?.type === 'FAMILY_PROGRESS_UPDATE' && onProgressUpdate) {
            onProgressUpdate(data.groupData);
          }
        });
      });

      this.peer.on('error', (err) => {
        // Si el peer ID ya está activo (ej: otra pestaña abierta), ignorar silenciosamente
        console.log('[FamilySignaling] Info:', err?.type || err?.message);
      });
    } catch (e) {
      console.warn('[FamilySignaling] Init error:', e);
    }
  }

  // Enviar un reto a otro integrante de la familia en tiempo real
  sendInvitation(targetUserId, invitation) {
    if (!targetUserId || !invitation) return;

    try {
      const cleanTargetId = `ajedrez-junvill-user-${targetUserId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
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
    } catch (err) {
      console.warn('[FamilySignaling] Send error:', err);
    }
  }

  // Notificar actualización de estado (aceptado / rechazado)
  sendStatus(targetUserId, invitationId, status) {
    if (!targetUserId || !invitationId) return;

    try {
      const cleanTargetId = `ajedrez-junvill-user-${targetUserId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
      const tempPeer = new Peer({
        config: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        }
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
  }

  // Transmitir actualización de progreso en tiempo real a todos los miembros de la familia
  broadcastProgressUpdate(groupData, targetUserIds = []) {
    if (!groupData || !targetUserIds || targetUserIds.length === 0) return;

    targetUserIds.forEach(targetUserId => {
      if (!targetUserId || targetUserId === this.currentUserId) return;
      try {
        const cleanTargetId = `ajedrez-junvill-user-${targetUserId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
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
