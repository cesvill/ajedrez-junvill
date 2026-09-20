import test from 'node:test';
import assert from 'node:assert/strict';
import { P2PEngine, DEFAULT_ICE_SERVERS } from '../src/engine/p2pEngine.js';

test('Contrato P2P WebRTC: Normalización estricta de códigos de sala', () => {
  assert.equal(P2PEngine.cleanRoomId('JUN-7K2'), 'JUN7K2', 'Debe remover guiones');
  assert.equal(P2PEngine.cleanRoomId('  jun 99x  '), 'JUN99X', 'Debe normalizar a mayúsculas y remover espacios');
  assert.equal(P2PEngine.cleanRoomId('sala#123!'), 'SALA123', 'Debe remover caracteres especiales no alfanuméricos');
  assert.equal(P2PEngine.cleanRoomId(null), '', 'Debe manejar null de forma segura');
  assert.equal(P2PEngine.cleanRoomId(undefined), '', 'Debe manejar undefined');
});

test('Contrato P2P WebRTC: Servidores ICE configurados y resilientes', () => {
  assert.ok(Array.isArray(DEFAULT_ICE_SERVERS), 'Los servidores ICE deben ser una lista');
  assert.ok(DEFAULT_ICE_SERVERS.length >= 2, 'Debe contar con al menos 2 servidores ICE para tolerancia a fallos');

  const hasStun = DEFAULT_ICE_SERVERS.some(s => {
    const urls = Array.isArray(s.urls) ? s.urls : [s.urls];
    return urls.some(u => String(u).startsWith('stun:'));
  });
  assert.ok(hasStun, 'Debe incluir al menos un servidor STUN para resolución NAT');
});

test('Contrato P2P WebRTC: Ciclo de vida y listeners del motor', () => {
  const engine = new P2PEngine();
  assert.equal(engine.isHost, false);
  assert.equal(engine.isSpectator, false);
  assert.equal(engine.isDestroyed, false);
  assert.ok(Array.isArray(engine.listeners.open));
  assert.ok(Array.isArray(engine.listeners.data));
  assert.ok(Array.isArray(engine.listeners.disconnected));
});
