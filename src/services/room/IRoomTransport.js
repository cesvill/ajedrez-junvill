/**
 * IRoomTransport.js
 * Contrato de transporte abstracto para JunvillRoomEngine.
 * Permite alternar entre Supabase Realtime, Local Mock (offline/bots) o WebRTC.
 */

export class IRoomTransport {
  constructor() {
    this.stateCallbacks = new Set();
    this.moveCallbacks = new Set();
    this.resyncCallbacks = new Set();
    this.peerJoinCallbacks = new Set();
    this.peerLeaveCallbacks = new Set();
    this.presenceSyncCallbacks = new Set();
  }

  /**
   * Conecta al canal de la sala
   * @param {string} roomId
   * @param {{ id: string, name: string, avatar?: any }} user
   */
  async connect(roomId, user) {
    throw new Error('connect() must be implemented by transport adapter');
  }

  /**
   * Desconecta del canal de la sala
   */
  async disconnect() {
    throw new Error('disconnect() must be implemented by transport adapter');
  }

  /**
   * Difunde un estado completo de la sala (STATE_OVERWRITE)
   * @param {object} state
   */
  async broadcastState(state) {
    throw new Error('broadcastState() must be implemented by transport adapter');
  }

  /**
   * Difunde una jugada individual rápida (MOVE_MADE)
   * @param {object} move
   * @param {number} nextTurn
   * @param {number} version
   */
  async broadcastMove(move, nextTurn, version) {
    throw new Error('broadcastMove() must be implemented by transport adapter');
  }

  /**
   * Registra y sincroniza la presencia en tiempo real
   * @param {object} meta
   */
  async trackPresence(meta) {
    throw new Error('trackPresence() must be implemented by transport adapter');
  }

  onStateUpdate(callback) {
    this.stateCallbacks.add(callback);
    return () => this.stateCallbacks.delete(callback);
  }

  onMoveReceived(callback) {
    this.moveCallbacks.add(callback);
    return () => this.moveCallbacks.delete(callback);
  }

  onRequestResync(callback) {
    this.resyncCallbacks.add(callback);
    return () => this.resyncCallbacks.delete(callback);
  }

  onPeerJoin(callback) {
    this.peerJoinCallbacks.add(callback);
    return () => this.peerJoinCallbacks.delete(callback);
  }

  onPeerLeave(callback) {
    this.peerLeaveCallbacks.add(callback);
    return () => this.peerLeaveCallbacks.delete(callback);
  }

  onPresenceSync(callback) {
    this.presenceSyncCallbacks.add(callback);
    return () => this.presenceSyncCallbacks.delete(callback);
  }
}
