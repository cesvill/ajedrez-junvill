import test from 'node:test';
import assert from 'node:assert/strict';
import { JunvillRoomEngine } from '../src/services/room/JunvillRoomEngine.js';
import { LocalMockTransport } from '../src/services/room/LocalMockTransport.js';

test('JunvillRoomEngine: Difusión y escucha de Reacciones en Vivo (Paso 2)', async () => {
  const transport = new LocalMockTransport();
  const engine = new JunvillRoomEngine(transport);

  let receivedReaction = null;
  const unsub = engine.onReaction((reaction) => {
    receivedReaction = reaction;
  });

  const testReaction = {
    reaction: { id: 'fire', emoji: '🔥', label: '¡Al ataque!' },
    senderId: 'user_cesar',
    senderName: 'César',
    color: 'red',
    timestamp: Date.now()
  };

  await engine.sendReaction(testReaction);
  assert.deepEqual(receivedReaction, testReaction, 'La reacción difundida debe ser recibida por los suscriptores');

  unsub();
  receivedReaction = null;
  await engine.sendReaction(testReaction);
  assert.equal(receivedReaction, null, 'No debe recibir reacciones tras desuscribirse');
});

test('JunvillRoomEngine: Difusión y escucha de Chat Deportivo Seguro (Paso 3)', async () => {
  const transport = new LocalMockTransport();
  const engine = new JunvillRoomEngine(transport);

  let receivedChat = null;
  const unsub = engine.onChatMessage((msg) => {
    receivedChat = msg;
  });

  const testChat = {
    senderId: 'user_leti',
    senderName: 'Leti',
    text: '¡Excelente jugada táctica! 🧠',
    isEmote: false,
    color: 'blue',
    timestamp: Date.now()
  };

  await engine.sendChatMessage(testChat);
  assert.deepEqual(receivedChat, testChat, 'El mensaje deportivo debe ser recibido por los suscriptores');

  unsub();
  receivedChat = null;
  await engine.sendChatMessage(testChat);
  assert.equal(receivedChat, null, 'No debe recibir mensajes tras desuscribirse');
});

test('Protección Infantil: Validación estricta isFamilyOnlyGame para habilitar Chat Familiar', () => {
  // Simulación de la regla familiar
  const checkIsFamilyOnlyGame = (activeGroup, users, partyRoom) => {
    if (!activeGroup || !users || users.length === 0) return false;
    if (!partyRoom) return true;

    const humanSeats = (partyRoom.seats || []).filter(s => s.type === 'human' && !s.isBot);
    if (humanSeats.length === 0) return true;

    const familyIds = new Set(users.map(u => String(u.id || u.uid || '').toLowerCase().trim()).filter(Boolean));
    const familyNames = new Set(users.map(u => String(u.name || '').toLowerCase().trim()).filter(Boolean));

    return humanSeats.every(seat => {
      if (seat.isLocalDevice || seat.user?.isLocalDevice) return true;
      const seatUserId = String(seat.user?.id || seat.player?.id || '').toLowerCase().trim();
      const seatUserName = String(seat.user?.name || seat.player?.name || '').toLowerCase().trim();
      if (!seatUserId && !seatUserName) return false;
      return familyIds.has(seatUserId) || familyNames.has(seatUserName);
    });
  };

  const familyGroup = { id: 'group_junvill', name: 'Familia Junvill' };
  const familyUsers = [
    { id: 'user_cesar', name: 'César' },
    { id: 'user_leti', name: 'Leti' },
    { id: 'user_mateo', name: 'Mateo' }
  ];

  // Caso 1: Partida local en el mismo dispositivo familiar -> Permitido
  assert.equal(checkIsFamilyOnlyGame(familyGroup, familyUsers, null), true, 'Partida local familiar debe permitir chat');

  // Caso 2: Partida online exclusivamente entre César y Leti (ambos registrados en la familia) -> Permitido
  const roomFamilyOnly = {
    roomId: 'FAM01',
    seats: [
      { seatIndex: 0, type: 'human', user: { id: 'user_cesar', name: 'César' } },
      { seatIndex: 1, type: 'human', user: { id: 'user_leti', name: 'Leti' } },
      { seatIndex: 2, type: 'bot', isBot: true, bot: { name: 'Bot 1' } },
      { seatIndex: 3, type: 'bot', isBot: true, bot: { name: 'Bot 2' } }
    ]
  };
  assert.equal(checkIsFamilyOnlyGame(familyGroup, familyUsers, roomFamilyOnly), true, 'Partida 100% entre familiares registrados debe permitir chat');

  // Caso 3: Partida con un invitado externo desconocido (ej: 'guest_999') -> BLOQUEADO POR PROTECCIÓN INFANTIL
  const roomWithExternalGuest = {
    roomId: 'EXT99',
    seats: [
      { seatIndex: 0, type: 'human', user: { id: 'user_cesar', name: 'César' } },
      { seatIndex: 1, type: 'human', user: { id: 'guest_999', name: 'JugadorExternoAnonimo' } },
      { seatIndex: 2, type: 'bot', isBot: true, bot: { name: 'Bot 1' } },
      { seatIndex: 3, type: 'bot', isBot: true, bot: { name: 'Bot 2' } }
    ]
  };
  assert.equal(checkIsFamilyOnlyGame(familyGroup, familyUsers, roomWithExternalGuest), false, 'Partida con usuario ajeno a la familia DEBE bloquear el chat');

  // Caso 4: No hay grupo familiar o no hay usuarios registrados -> BLOQUEADO POR DEFECTO
  assert.equal(checkIsFamilyOnlyGame(null, [], roomFamilyOnly), false, 'Sin familia activa debe bloquearse el chat');
});
