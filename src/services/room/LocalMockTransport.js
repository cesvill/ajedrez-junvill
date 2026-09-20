/**
 * LocalMockTransport.js
 * Adaptador de transporte puramente local en memoria.
 * Permite partidas locales (pass & play, offline o contra bots)
 * reutilizando exactamente la misma lógica de JunvillRoomEngine.
 */

import { IRoomTransport } from './IRoomTransport.js';

export class LocalMockTransport extends IRoomTransport {
  constructor() {
    super();
    this.currentRoomId = null;
    this.currentUser = null;
  }

  async connect(roomId, user) {
    this.currentRoomId = roomId;
    this.currentUser = user;
    return Promise.resolve();
  }

  async disconnect() {
    this.currentRoomId = null;
    this.currentUser = null;
    return Promise.resolve();
  }

  async broadcastState(state) {
    // En modo local no hay pares remotos que notificar por red
    return Promise.resolve();
  }

  async broadcastMove(move, nextTurn, version) {
    // En modo local la mutación ya se aplicó en el motor local
    return Promise.resolve();
  }

  async trackPresence(meta) {
    return Promise.resolve();
  }
}
