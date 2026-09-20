/**
 * useRoomSession.js
 * Hook de React para consumir y controlar salas multijugador de JunvillRoomEngine.
 */

import { useState, useEffect, useCallback } from 'react';
import { roomEngine } from '../services/room/JunvillRoomEngine';

export function useRoomSession(currentUser) {
  const [roomState, setRoomState] = useState(() => roomEngine.getState());

  useEffect(() => {
    // Sincronizar usuario actual en el motor
    if (currentUser) {
      roomEngine.currentUser = currentUser;
    }

    const unsubscribe = roomEngine.onStateChange((state) => {
      setRoomState(state ? { ...state, seats: [...state.seats] } : null);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const mySeatIndex = roomState && currentUser
    ? roomState.seats.findIndex(s => s.player?.id === currentUser.id)
    : -1;

  const isHost = roomState && currentUser
    ? roomState.hostUserId === currentUser.id || roomState.seats[mySeatIndex]?.isHost
    : false;

  const createRoom = useCallback(async (params) => {
    return await roomEngine.createRoom({
      ...params,
      user: currentUser
    });
  }, [currentUser]);

  const joinRoom = useCallback(async (roomId) => {
    return await roomEngine.joinRoom(roomId, currentUser);
  }, [currentUser]);

  const claimSeat = useCallback(async (seatIndex, user = null, botConfig = null) => {
    return await roomEngine.claimSeat(seatIndex, user || currentUser, botConfig);
  }, [currentUser]);

  const vacateSeat = useCallback(async (seatIndex) => {
    return await roomEngine.vacateSeat(seatIndex);
  }, []);

  const toggleSeatBot = useCallback(async (seatIndex, difficulty = 'medium') => {
    return await roomEngine.toggleSeatBot(seatIndex, difficulty);
  }, []);

  const startGame = useCallback(async (initialBoardState = null) => {
    return await roomEngine.startGame(initialBoardState);
  }, []);

  const sendMove = useCallback(async (moveParams) => {
    return await roomEngine.sendMove(moveParams);
  }, []);

  const leaveRoom = useCallback(async () => {
    return await roomEngine.leaveRoom();
  }, []);

  const endGame = useCallback(async (winnerSeatIndices, terminationReason) => {
    return await roomEngine.endGame(winnerSeatIndices, terminationReason);
  }, []);

  return {
    roomState,
    mySeatIndex,
    isHost,
    createRoom,
    joinRoom,
    claimSeat,
    vacateSeat,
    toggleSeatBot,
    startGame,
    sendMove,
    leaveRoom,
    endGame
  };
}
