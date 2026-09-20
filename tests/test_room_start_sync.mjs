import test from 'node:test';
import assert from 'node:assert/strict';
import { JunvillRoomEngine } from '../src/services/room/JunvillRoomEngine.js';

test('JunvillRoomEngine: Creación de sala, asignación de asientos y arranque de partida', async () => {
  const engineHost = new JunvillRoomEngine();
  const engineGuest = new JunvillRoomEngine();

  const userHost = { id: 'user_leti', name: 'Leti', role: 'parent' };
  const userGuest = { id: 'user_cesar', name: 'César', role: 'parent' };

  const initialPartyData = {
    roomId: 'TEST77',
    variantId: 'four_player',
    variantName: 'Ajedrez para 4 en Cruz',
    totalPlayers: 4,
    expectedHumans: 2,
    botsCount: 2,
    hostUserId: 'user_leti',
    hostUser: userHost,
    status: 'lobby',
    seats: [
      { seatIndex: 0, color: 'red', type: 'human', isHost: true, user: userHost, ready: true },
      { seatIndex: 1, color: 'blue', type: 'human', isHost: false, user: null, ready: false },
      { seatIndex: 2, color: 'yellow', type: 'bot', isHost: false, bot: { name: 'Bot Yellow' }, ready: true },
      { seatIndex: 3, color: 'green', type: 'bot', isHost: false, bot: { name: 'Bot Green' }, ready: true }
    ]
  };

  // 1. Anfitrión crea sala
  await engineHost.createRoomFromPartyData(initialPartyData, userHost);
  assert.equal(engineHost.isHost, true);
  assert.equal(engineHost.currentState.status, 'lobby');
  assert.equal(engineHost.getMySeatIndex(), 0);

  // 2. Invitado recibe estado inicial y reclama asiento disponible
  engineGuest.currentUser = userGuest;
  engineGuest.handleIncomingState(JSON.parse(JSON.stringify(engineHost.currentState)));
  assert.equal(engineGuest.isHost, false);
  
  const seatIdx = await engineGuest.claimFirstAvailableSeat(userGuest);
  assert.equal(seatIdx, 1, 'El invitado debe tomar el asiento 1');
  assert.equal(engineGuest.getMySeatIndex(), 1);

  // 3. El anfitrión recibe el estado actualizado con el invitado sentado
  engineHost.handleIncomingState(JSON.parse(JSON.stringify(engineGuest.currentState)));
  assert.equal(engineHost.isHost, true, 'El anfitrión debe seguir siendo reconocido como anfitrión');
  assert.equal(engineHost.currentState.seats[1].user.name, 'César');

  // 4. Anfitrión inicia la partida
  const startedState = await engineHost.startGame();
  assert.equal(startedState.status, 'playing');
  assert.equal(engineHost.currentState.status, 'playing');

  // 5. Invitado recibe el estado de inicio de partida
  let guestSawGameStart = false;
  engineGuest.onStateChange((state) => {
    if (state.status === 'playing') {
      guestSawGameStart = true;
    }
  });

  engineGuest.handleIncomingState(JSON.parse(JSON.stringify(startedState)));
  assert.ok(guestSawGameStart, 'El invitado debe transicionar inmediatamente a playing');
  assert.equal(engineGuest.currentState.status, 'playing');
  assert.equal(engineGuest.currentState.seats[0].user.name, 'Leti');
  assert.equal(engineGuest.currentState.seats[1].user.name, 'César');
});

test('JunvillRoomEngine: Relleno automático de bots si el anfitrión inicia con asientos vacíos', async () => {
  const engine = new JunvillRoomEngine();
  const userHost = { id: 'user_leti', name: 'Leti' };

  const partyData = {
    roomId: 'TEST88',
    variantId: 'four_player',
    variantName: 'Ajedrez para 4 en Cruz',
    totalPlayers: 4,
    hostUserId: 'user_leti',
    hostUser: userHost,
    status: 'lobby',
    seats: [
      { seatIndex: 0, color: 'red', type: 'human', isHost: true, user: userHost, ready: true },
      { seatIndex: 1, color: 'blue', type: 'human', isHost: false, user: null, ready: false },
      { seatIndex: 2, color: 'yellow', type: 'human', isHost: false, user: null, ready: false },
      { seatIndex: 3, color: 'green', type: 'human', isHost: false, user: null, ready: false }
    ]
  };

  await engine.createRoomFromPartyData(partyData, userHost);
  await engine.startGame();

  assert.equal(engine.currentState.status, 'playing');
  assert.equal(engine.currentState.seats[0].type, 'human');
  assert.equal(engine.currentState.seats[1].type, 'bot', 'Asiento 1 vacío debe convertirse en bot');
  assert.equal(engine.currentState.seats[2].type, 'bot', 'Asiento 2 vacío debe convertirse en bot');
  assert.equal(engine.currentState.seats[3].type, 'bot', 'Asiento 3 vacío debe convertirse en bot');
});
