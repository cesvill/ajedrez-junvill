import test from 'node:test';
import assert from 'node:assert/strict';
import { JunvillRoomEngine } from '../src/services/room/JunvillRoomEngine.js';
import { LocalMockTransport } from '../src/services/room/LocalMockTransport.js';

test('JunvillRoomEngine: Creación de sala, asignación de asientos y arranque de partida', async () => {
  const engineHost = new JunvillRoomEngine(new LocalMockTransport());
  const engineGuest = new JunvillRoomEngine(new LocalMockTransport());

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
  const engine = new JunvillRoomEngine(new LocalMockTransport());
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

test('JunvillRoomEngine: Sincronización determinista y resiliente de jugadas de bots entre anfitrión e invitado', async () => {
  const engineHost = new JunvillRoomEngine(new LocalMockTransport());
  const engineGuest = new JunvillRoomEngine(new LocalMockTransport());

  const userHost = { id: 'user_leti', name: 'Leti', role: 'parent' };
  const userGuest = { id: 'user_cesar', name: 'César', role: 'parent' };

  const initialPartyData = {
    roomId: 'BOTSYNC1',
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

  // 1. Host crea y Guest se sienta
  await engineHost.createRoomFromPartyData(initialPartyData, userHost);
  engineGuest.currentUser = userGuest;
  engineGuest.handleIncomingState(JSON.parse(JSON.stringify(engineHost.currentState)));
  await engineGuest.claimFirstAvailableSeat(userGuest);
  engineHost.handleIncomingState(JSON.parse(JSON.stringify(engineGuest.currentState)));

  // 2. Host inicia la partida
  const started = await engineHost.startGame();
  engineGuest.handleIncomingState(JSON.parse(JSON.stringify(started)));

  assert.equal(engineHost.currentState.status, 'playing');
  assert.equal(engineGuest.currentState.status, 'playing');

  // Track de jugadas recibidas por el invitado
  const guestReceivedMoves = [];
  engineGuest.onMove((m) => {
    guestReceivedMoves.push(m);
  });

  // 3. Move 1: Jugada Humana de Leti (Red, Asiento 0)
  await engineHost.sendMove({
    from: 3,
    to: 5,
    moveArgs: [3, 1, 3, 3],
    senderId: 'user_leti',
    variantId: 'four_player',
    nextTurnSeatIndex: 1
  });
  const move1 = engineHost.currentState.lastMove;
  engineGuest.handleIncomingMove(JSON.parse(JSON.stringify(move1)), 1, engineHost.currentState.version);
  assert.equal(guestReceivedMoves.length, 1, 'Invitado debe recibir la jugada de Leti');

  // 4. Move 2: Jugada Humana de César (Blue, Asiento 1)
  await engineGuest.sendMove({
    from: 1,
    to: 3,
    moveArgs: [1, 4, 3, 4],
    senderId: 'user_cesar',
    variantId: 'four_player',
    nextTurnSeatIndex: 2
  });
  const move2 = engineGuest.currentState.lastMove;
  engineHost.handleIncomingMove(JSON.parse(JSON.stringify(move2)), 2, engineGuest.currentState.version);

  // 5. Move 3: Jugada del Bot (Yellow, Asiento 2) ejecutada por el Anfitrión
  await engineHost.sendMove({
    from: 9,
    to: 7,
    moveArgs: [9, 12, 9, 10],
    senderId: 'user_leti', // El host ejecuta y difunde la jugada del bot
    variantId: 'four_player',
    isBot: true,
    nextTurnSeatIndex: 3
  });
  const botMove = engineHost.currentState.lastMove;

  // Simulamos concurrencia: Estado completo (STATE_OVERWRITE) llega junto o antes con la jugada
  engineGuest.handleIncomingState(JSON.parse(JSON.stringify(engineHost.currentState)));
  engineGuest.handleIncomingMove(JSON.parse(JSON.stringify(botMove)), 3, engineHost.currentState.version);

  // Verificación: El invitado debe haber recibido la jugada del bot sin ser descartada
  const botMoveFound = guestReceivedMoves.some(m => m.isBot && m.senderId === 'user_leti');
  assert.ok(botMoveFound, 'El invitado DEBE recibir y procesar la jugada del bot');
  assert.equal(engineGuest.currentState.currentTurnSeatIndex, 3, 'El turno debe haber avanzado al asiento 3 (Green)');

  // 6. Deduplicación: re-enviar la misma jugada no debe disparar duplicados
  const prevCount = guestReceivedMoves.length;
  engineGuest.handleIncomingMove(JSON.parse(JSON.stringify(botMove)), 3, engineHost.currentState.version);
  assert.equal(guestReceivedMoves.length, prevCount, 'No debe duplicar jugadas ya procesadas');
});
