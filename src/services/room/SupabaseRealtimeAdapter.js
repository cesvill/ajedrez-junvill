/**
 * SupabaseRealtimeAdapter.js
 * Adaptador de transporte sobre WebSockets seguros de Supabase Realtime.
 * Utiliza exclusivamente canales efímeros Broadcast y Presence en memoria,
 * con 0 escrituras en base de datos y 0 consumo en Vercel.
 */

import { createClient } from '@supabase/supabase-js';
import { IRoomTransport } from './IRoomTransport.js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://hgqcabficqrwbuciqgvh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_p7ivnCrLETzUv0nZg7Tjkg_KB6bHFJM';

export class SupabaseRealtimeAdapter extends IRoomTransport {
  constructor(url = SUPABASE_URL, anonKey = SUPABASE_ANON_KEY) {
    super();
    this.client = createClient(url, anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 30
        }
      }
    });
    this.channel = null;
    this.currentRoomId = null;
    this.currentUser = null;
    this.isConnected = false;
  }

  /**
   * Conecta a un canal de sala en tiempo real
   */
  async connect(roomId, user) {
    if (this.channel) {
      await this.disconnect();
    }

    this.currentRoomId = roomId;
    this.currentUser = user;

    return new Promise((resolve, reject) => {
      const channelName = `junvill_room_${roomId}`;
      
      this.channel = this.client.channel(channelName, {
        config: {
          broadcast: { ack: false, self: false },
          presence: { key: user?.id || `anon_${Date.now()}` }
        }
      });

      // 1. Escucha de eventos de Broadcast
      this.channel
        .on('broadcast', { event: 'STATE_OVERWRITE' }, ({ payload }) => {
          if (payload) {
            for (const cb of this.stateCallbacks) {
              try { cb(payload); } catch (e) { console.error(e); }
            }
          }
        })
        .on('broadcast', { event: 'MOVE_MADE' }, ({ payload }) => {
          if (payload) {
            for (const cb of this.moveCallbacks) {
              try { cb(payload.move, payload.nextTurn, payload.version); } catch (e) { console.error(e); }
            }
          }
        })
        .on('broadcast', { event: 'REQUEST_RESYNC' }, ({ payload }) => {
          if (payload) {
            for (const cb of this.resyncCallbacks) {
              try { cb(payload); } catch (e) { console.error(e); }
            }
          }
        });

      // 2. Escucha de Presencia en tiempo real
      this.channel
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          const first = newPresences ? newPresences[0] : null;
          for (const cb of this.peerJoinCallbacks) {
            try { cb(key, first); } catch (e) { console.error(e); }
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          // Comprobar si realmente abandonó o si fue una actualización de metadata
          const presenceState = this.channel ? this.channel.presenceState() : {};
          if (!presenceState[key] || presenceState[key].length === 0) {
            const first = leftPresences ? leftPresences[0] : null;
            for (const cb of this.peerLeaveCallbacks) {
              try { cb(key, first); } catch (e) { console.error(e); }
            }
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = this.channel ? this.channel.presenceState() : {};
          for (const cb of this.presenceSyncCallbacks) {
            try { cb(state); } catch (e) { console.error(e); }
          }
        });

      // 3. Suscribir canal
      this.channel.subscribe(async (status, err) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          // Solicitar estado al anfitrión al suscribirse
          await this.channel.send({
            type: 'broadcast',
            event: 'REQUEST_RESYNC',
            payload: { requesterId: user?.id, timestamp: Date.now() }
          }).catch(() => {});

          resolve();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          this.isConnected = false;
          console.warn(`[SupabaseRealtimeAdapter] Channel status: ${status}`, err);
          setTimeout(() => {
            if (this.currentRoomId === roomId && !this.isConnected) {
              this.connect(roomId, user).catch(() => {});
            }
          }, 2000);
        } else if (status === 'CLOSED') {
          this.isConnected = false;
        }
      });
    });
  }

  /**
   * Desconecta del canal actual
   */
  async disconnect() {
    if (this.channel) {
      try {
        await this.channel.unsubscribe();
        this.client.removeChannel(this.channel);
      } catch (e) {
        console.warn('[SupabaseRealtimeAdapter] Error on disconnect:', e);
      }
      this.channel = null;
    }
    this.isConnected = false;
    this.currentRoomId = null;
  }

  /**
   * Difunde el estado completo de la sala
   */
  async broadcastState(state) {
    if (!this.channel || !this.isConnected) return;
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'STATE_OVERWRITE',
        payload: state
      });
    } catch (e) {
      console.warn('[SupabaseRealtimeAdapter] Error broadcasting state:', e);
    }
  }

  /**
   * Difunde un movimiento
   */
  async broadcastMove(move, nextTurn, version) {
    if (!this.channel || !this.isConnected) return;
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'MOVE_MADE',
        payload: { move, nextTurn, version }
      });
    } catch (e) {
      console.warn('[SupabaseRealtimeAdapter] Error broadcasting move:', e);
    }
  }

  /**
   * Registra metadata de presencia (ej: asiento ocupado)
   */
  async trackPresence(meta) {
    if (!this.channel || !this.isConnected) return;
    try {
      await this.channel.track(meta);
    } catch (e) {
      console.warn('[SupabaseRealtimeAdapter] Error tracking presence:', e);
    }
  }
}
