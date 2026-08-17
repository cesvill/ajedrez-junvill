import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { SafeChat } from '../components/SafeChat/SafeChat';
import { AvatarIcon } from '../assets/avatars';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { P2PEngine } from '../engine/p2pEngine';
import { useUser } from '../context/UserContext';
import { audioManager } from '../engine/audio';
import { QRCodeDisplay } from '../components/QRCodeModal/QRCodeDisplay';
import { HandicapConfigModal } from '../components/HandicapModal/HandicapConfigModal';
import { getHandicapFen, getHandicapSummary, DEFAULT_HANDICAP_CONFIG } from '../engine/handicapEngine';
import confetti from 'canvas-confetti';
import { X, Globe, Copy, Check, QrCode, Play, Users, Clock, ShieldCheck, Swords, RotateCcw, Flag, Award, AlertCircle, Maximize, Minimize, Scale, RefreshCw } from 'lucide-react';

export const P2PPlayModal = ({ isOpen, onClose, initialRoomId = null }) => {
  const { currentUser, recordGameResult } = useUser();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const [mode, setMode] = useState('lobby'); // 'lobby' | 'playing' | 'gameover'
  const [activeTab, setActiveTab] = useState(initialRoomId ? 'join' : 'create'); // 'create' | 'join'
  const [generatedRoomId, setGeneratedRoomId] = useState(() => P2PEngine.generateRoomId());
  const [roomId, setRoomId] = useState(initialRoomId || '');
  const [inputRoomId, setInputRoomId] = useState(initialRoomId || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHostActive, setIsHostActive] = useState(false);

  // Opciones de partida
  const [timeControl, setTimeControl] = useState(300); // 300 seg (5 min)
  const [assignedColor, setAssignedColor] = useState('white'); // 'white' | 'black'
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);

  // Configuración de Hándicap y Ventajas Pedagógicas P2P
  const [handicapConfig, setHandicapConfig] = useState(DEFAULT_HANDICAP_CONFIG);
  const [isHandicapModalOpen, setIsHandicapModalOpen] = useState(false);
  const [incomingHandicapOffer, setIncomingHandicapOffer] = useState(null);

  // Estado del juego
  const [game, setGame] = useState(() => new Chess());
  const [lastMove, setLastMove] = useState(null);
  const [opponentProfile, setOpponentProfile] = useState({ name: 'Rival P2P', avatar: 'knight', elo: 600 });
  const [chatMessages, setChatMessages] = useState([]);
  const [drawOffered, setDrawOffered] = useState(false);
  const [gameResultReason, setGameResultReason] = useState('');

  const p2pRef = useRef(null);

  // Iniciar P2P Engine
  useEffect(() => {
    if (!isOpen) {
      if (p2pRef.current) {
        p2pRef.current.destroy();
        p2pRef.current = null;
      }
      setIsHostActive(false);
      setIsConnecting(false);
      setErrorMessage('');
      return;
    }

    const p2p = new P2PEngine();
    p2pRef.current = p2p;

    p2p.on('open', ({ roomId }) => {
      setRoomId(roomId);
      setIsHostActive(true);
      setIsConnecting(false);
      setStatusMessage(`¡Sala ${roomId} creada! Esperando a que tu amigo se una...`);
    });

    p2p.on('connected', ({ isHost }) => {
      audioManager.playVictory();
      setErrorMessage('');
      setStatusMessage('¡Rival conectado! Iniciando partida...');
      setMode('playing');

      // Enviar mi perfil al rival
      p2p.send({
        type: 'PROFILE_SYNC',
        profile: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          avatarConfig: currentUser.avatarConfig,
          elo: currentUser.elo,
          color: isHost ? (assignedColor === 'white' ? 'black' : 'white') : assignedColor,
          timeControl
        }
      });
    });

    p2p.on('data', (data) => {
      handleIncomingData(data);
    });

    p2p.on('disconnected', () => {
      setStatusMessage('El rival se ha desconectado.');
      setErrorMessage('El rival ha abandonado la partida.');
    });

    p2p.on('error', (err) => {
      console.error('P2P Error:', err);
      setIsConnecting(false);
      setIsHostActive(false);
      const friendly = err.message || 'Error de conexión. Verifica el código de sala e inténtalo de nuevo.';
      setErrorMessage(friendly);
      setStatusMessage('');
      audioManager.playWarning();
    });

    if (initialRoomId) {
      handleJoinSubmit(initialRoomId);
    }

    return () => {
      p2p.destroy();
    };
  }, [isOpen, initialRoomId]);

  // Manejo de datos entrantes desde el par WebRTC
  const handleIncomingData = (data) => {
    if (data.type === 'PROFILE_SYNC') {
      setOpponentProfile(data.profile);
      if (!p2pRef.current?.isHost) {
        setAssignedColor(data.profile.color);
        if (data.profile.timeControl) {
          setTimeControl(data.profile.timeControl);
          setWhiteTime(data.profile.timeControl);
          setBlackTime(data.profile.timeControl);
        }
      }
    } else if (data.type === 'MOVE') {
      let updatedGame;
      try {
        if (data.fen) {
          updatedGame = new Chess(data.fen);
        } else {
          updatedGame = new Chess(game.fen());
          updatedGame.move(data.move);
        }

        if (updatedGame.isCheckmate() || updatedGame.isCheck()) audioManager.playCheck();
        else if (data.move?.captured) audioManager.playCapture();
        else audioManager.playMove();

        setLastMove(data.move);
        setGame(updatedGame);
        checkGameOver(updatedGame);
      } catch (err) {
        console.error("Error aplicando jugada remota P2P:", err);
      }
    } else if (data.type === 'SAFE_CHAT') {
      audioManager.playHint();
      setChatMessages(prev => [...prev, {
        senderName: opponentProfile.name,
        text: data.text,
        isEmote: data.isEmote,
        isMe: false
      }]);
    } else if (data.type === 'RESIGN') {
      audioManager.playVictory();
      setGameResultReason('¡El rival se ha rendido! Victoria para ti 🏆');
      setMode('gameover');
      recordGameResult('win', 20, 90);
      confetti({ particleCount: 100, spread: 80 });
    } else if (data.type === 'OFFER_DRAW') {
      setDrawOffered(true);
      audioManager.playHint();
    } else if (data.type === 'ACCEPT_DRAW') {
      audioManager.playMove();
      setGameResultReason('Tablas acordadas por ambos jugadores 🤝');
      setMode('gameover');
      recordGameResult('draw', 5, 75);
    } else if (data.type === 'REMATCH') {
      restartP2PGame();
    } else if (data.type === 'HANDICAP_OFFER') {
      setIncomingHandicapOffer(data);
      audioManager.playHint();
    } else if (data.type === 'HANDICAP_ACCEPT') {
      setHandicapConfig(data.config);
      const newFen = getHandicapFen(data.config);
      const newG = new Chess(newFen);
      setGame(newG);
      setLastMove(null);
      setIncomingHandicapOffer(null);
      audioManager.playVictory();
      setStatusMessage(`¡Propuesta de ventaja aceptada! Jugando: ${getHandicapSummary(data.config)}`);
    } else if (data.type === 'HANDICAP_REJECT') {
      setHandicapConfig(DEFAULT_HANDICAP_CONFIG);
      const newFen = getHandicapFen(DEFAULT_HANDICAP_CONFIG);
      const newG = new Chess(newFen);
      setGame(newG);
      setLastMove(null);
      setIncomingHandicapOffer(null);
      audioManager.playMove();
      setStatusMessage('Tu rival prefirió jugar una partida estándar sin ventajas.');
    }
  };

  // Reloj de Partida
  useEffect(() => {
    if (mode !== 'playing' || timeControl === 0) return;

    const timer = setInterval(() => {
      const turn = game.turn();
      if (turn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeOut('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, game, timeControl]);

  const handleTimeOut = (color) => {
    const iLost = (color === 'w' && assignedColor === 'white') || (color === 'b' && assignedColor === 'black');
    if (iLost) {
      audioManager.playWarning();
      setGameResultReason('Tiempo agotado. Derrota.');
      recordGameResult('loss', -8, 60);
    } else {
      audioManager.playVictory();
      setGameResultReason('¡El rival agotó su tiempo! Victoria 🏆');
      recordGameResult('win', 20, 90);
      confetti({ particleCount: 80, spread: 70 });
    }
    setMode('gameover');
  };

  const checkGameOver = (g) => {
    if (g.isGameOver()) {
      if (g.isCheckmate()) {
        const winnerIsWhite = g.turn() === 'b';
        const iWon = (winnerIsWhite && assignedColor === 'white') || (!winnerIsWhite && assignedColor === 'black');
        if (iWon) {
          audioManager.playVictory();
          setGameResultReason('¡Jaque Mate! Has ganado la partida 🏆');
          recordGameResult('win', 20, 90);
          confetti({ particleCount: 100, spread: 80 });
        } else {
          audioManager.playWarning();
          setGameResultReason('Jaque Mate del rival. Derrota.');
          recordGameResult('loss', -8, 60);
        }
      } else if (g.isDraw()) {
        setGameResultReason('Partida en Tablas 🤝');
        recordGameResult('draw', 5, 75);
      }
      setMode('gameover');
    }
  };

  // Generar nuevo código aleatorio
  const handleRegenerateCode = () => {
    const newCode = P2PEngine.generateRoomId();
    setGeneratedRoomId(newCode);
    setErrorMessage('');
    if (isHostActive) {
      p2pRef.current?.destroy();
      setIsHostActive(false);
      setRoomId('');
    }
  };

  // Acciones de Anfitrión e Invitado
  const handleCreateHost = () => {
    setErrorMessage('');
    setIsConnecting(true);
    setWhiteTime(timeControl);
    setBlackTime(timeControl);
    p2pRef.current?.initHost(generatedRoomId);
  };

  const handleJoinSubmit = (codeToJoin = null) => {
    const rawCode = (codeToJoin || inputRoomId || '').toUpperCase().trim();
    if (!rawCode) {
      setErrorMessage('Por favor escribe el código de sala que te compartió tu amigo (ej. JUN-4829)');
      return;
    }
    setErrorMessage('');
    setIsConnecting(true);
    setStatusMessage(`Buscando sala ${rawCode}...`);
    p2pRef.current?.joinRoom(rawCode);
  };

  const handlePlayerMove = (moveResult, newFen) => {
    const isWhiteTurn = game.turn() === 'w';
    const myTurn = (isWhiteTurn && assignedColor === 'white') || (!isWhiteTurn && assignedColor === 'black');
    if (!myTurn || mode !== 'playing') return;

    let updatedGame;
    try {
      if (newFen) {
        updatedGame = new Chess(newFen);
      } else {
        updatedGame = new Chess(game.fen());
        updatedGame.move(moveResult);
      }

      setLastMove(moveResult);
      setGame(updatedGame);
      p2pRef.current?.sendMove(moveResult, updatedGame.fen());
      checkGameOver(updatedGame);
    } catch (err) {
      console.error("Error ejecutando jugada local:", err);
    }
  };

  const handleSendSafeChat = ({ text, isEmote, emoji }) => {
    p2pRef.current?.sendSafeChat(text, isEmote);
    setChatMessages(prev => [...prev, {
      senderName: currentUser.name,
      text,
      isEmote,
      isMe: true
    }]);
  };

  const handleCopyLink = () => {
    const currentCode = roomId || generatedRoomId;
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${currentCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const restartP2PGame = () => {
    setGame(new Chess());
    setLastMove(null);
    setWhiteTime(timeControl);
    setBlackTime(timeControl);
    setDrawOffered(false);
    setMode('playing');
  };

  if (!isOpen) return null;

  const isMyTurn = (game.turn() === 'w' && assignedColor === 'white') || (game.turn() === 'b' && assignedColor === 'black');
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '960px', width: '96vw', padding: '22px', maxHeight: '94vh' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={22} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Multijugador Online P2P
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleFullscreen}
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
              title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa (Ocultar Barra URL)"}
            >
              {isFullscreen ? <Minimize size={15} color="#10b981" /> : <Maximize size={15} color="#3b82f6" />}
              <span className="hide-mobile-compact">{isFullscreen ? "Normal" : "Pantalla Completa"}</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* ALERTA DE ERROR VISIBLE */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1.5px solid #ef4444',
            borderRadius: 'var(--radius-md, 8px)',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            color: '#fca5a5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={22} color="#ef4444" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fecaca' }}>
                {errorMessage}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: '800', fontSize: '0.8rem', padding: '4px 8px' }}
            >
              Cerrar ✕
            </button>
          </div>
        )}

        {/* MENSAJE DE ESTADO INFORMATIVO */}
        {statusMessage && !errorMessage && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1.5px solid #3b82f6',
            borderRadius: 'var(--radius-md, 8px)',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#93c5fd',
            fontSize: '0.86rem',
            fontWeight: '700'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', animation: 'pulse 1.5s infinite' }}></span>
            <span>{statusMessage}</span>
          </div>
        )}

        {/* VISTA 1: LOBBY DE SALA */}
        {mode === 'lobby' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* PANEL IZQUIERDO: CREAR SALA (HOST) */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid var(--color-primary, #3b82f6)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '900', fontSize: '1.15rem', marginBottom: '4px' }}>
                  <Users size={22} color="#60a5fa" />
                  <span>Crear Sala de Juego (Anfitrión)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 14px' }}>
                  Configura tu partida y comparte el código o enlace directo con tu amigo.
                </p>

                {/* Código de Sala Pre-Generado */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px dashed #3b82f6',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '12px 14px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Código de Sala Generado:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '6px 0' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#60a5fa', letterSpacing: '3px', fontFamily: 'monospace' }}>
                      {roomId || generatedRoomId}
                    </span>
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                      title="Generar otro código aleatorio"
                      disabled={isHostActive}
                    >
                      <RotateCcw size={13} />
                      <span>Nuevo</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={handleCopyLink}
                    style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '0.82rem', marginTop: '4px' }}
                  >
                    {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedLink ? '¡Enlace Directo Copiado!' : 'Copiar Enlace para tu Amigo'}</span>
                  </button>
                </div>

                {/* Ajustes de Partida */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                      Tiempo de Reloj:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { secs: 180, label: '3 min' },
                        { secs: 300, label: '5 min' },
                        { secs: 600, label: '10 min' },
                        { secs: 0, label: 'Sin Reloj' }
                      ].map(t => {
                        const isSelected = timeControl === t.secs;
                        return (
                          <button
                            key={t.secs}
                            type="button"
                            onClick={() => setTimeControl(t.secs)}
                            disabled={isHostActive}
                            style={{
                              flex: 1,
                              background: isSelected ? 'var(--color-primary, #2563eb)' : 'rgba(15, 23, 42, 0.7)',
                              color: '#ffffff',
                              border: isSelected ? '2px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: 'var(--radius-sm, 6px)',
                              padding: '8px 4px',
                              fontSize: '0.8rem',
                              fontWeight: '800',
                              cursor: isHostActive ? 'not-allowed' : 'pointer',
                              boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.4)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                      Juegas con:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'white', label: 'Blancas', icon: '⚪' },
                        { id: 'black', label: 'Negras', icon: '⚫' }
                      ].map(c => {
                        const isSelected = assignedColor === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setAssignedColor(c.id)}
                            disabled={isHostActive}
                            style={{
                              flex: 1,
                              background: isSelected 
                                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)' 
                                : 'rgba(15, 23, 42, 0.7)',
                              color: isSelected ? '#fbbf24' : '#ffffff',
                              border: `2px solid ${isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.18)'}`,
                              borderRadius: 'var(--radius-md, 8px)',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              cursor: isHostActive ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: isSelected ? '0 0 14px rgba(245, 158, 11, 0.35)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                            <span style={{ color: isSelected ? '#fbbf24' : '#ffffff', fontWeight: '800' }}>{c.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Botón Iniciar Sala o Estado Activo */}
                {!isHostActive ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCreateHost}
                    disabled={isConnecting}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '900', gap: '8px' }}
                  >
                    <Play size={20} />
                    <span>{isConnecting ? 'Iniciando Sala...' : '🚀 Iniciar Sala y Esperar Rival'}</span>
                  </button>
                ) : (
                  <div style={{
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '2px solid #3b82f6',
                    borderRadius: 'var(--radius-md, 8px)',
                    padding: '14px',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#60a5fa', fontWeight: '800', fontSize: '0.92rem', marginBottom: '6px' }}>
                      <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                      <span>Sala Activa • Esperando a tu Amigo</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 10px' }}>
                      Tu amigo puede escanear el QR o ingresar el código <b>{roomId || generatedRoomId}</b>:
                    </p>

                    {/* QR Code de Invitación a la Sala */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                      <QRCodeDisplay
                        value={`${window.location.origin}/?room=${roomId || generatedRoomId}&view=p2p`}
                        size={150}
                        title="Escanear para Jugar"
                        subtitle="Apunta la cámara para unirte a esta partida directamente"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        p2pRef.current?.destroy();
                        setIsHostActive(false);
                        setStatusMessage('');
                      }}
                      style={{ padding: '6px 14px', fontSize: '0.78rem', margin: '10px auto 0' }}
                    >
                      Cancelar Sala
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL DERECHO: UNIRSE A SALA (GUEST) */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: '900', fontSize: '1.15rem', marginBottom: '4px' }}>
                  <Swords size={22} color="#fbbf24" />
                  <span>Unirse a una Sala Existente (Invitado)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 14px' }}>
                  Escribe el código de sala que te compartió tu amigo para unirte a su partida.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                    Código de Sala de tu Amigo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. JUN-4829"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputRoomId.trim()) {
                        handleJoinSubmit();
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '2px solid rgba(245, 158, 11, 0.4)',
                      fontSize: '1.35rem',
                      fontWeight: '900',
                      letterSpacing: '3px',
                      textAlign: 'center',
                      color: '#fbbf24',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => handleJoinSubmit()}
                  disabled={isConnecting || !inputRoomId.trim()}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '900', gap: '8px' }}
                >
                  <Play size={20} />
                  <span>{isConnecting ? 'Buscando Sala...' : '⚔️ Conectar y Jugar 🚀'}</span>
                </button>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', margin: '10px 0 0' }}>
                  ℹ️ Recuerda que tu amigo debe haber hecho clic en <b>"Iniciar Sala"</b> antes de que te unas.
                </p>
              </div>

              {/* Sello de Seguridad */}
              <div style={{ background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm, 6px)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#86efac', fontWeight: '700' }}>
                <ShieldCheck size={18} color="#86efac" />
                <span>Conexión P2P encriptada E2EE (DTLS) y Chat 100% Protegido.</span>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: PARTIDA P2P EN CURSO O FINALIZADA */}
        {(mode === 'playing' || mode === 'gameover') && (
          <div className="game-responsive-container">
            {/* COLUMNA IZQUIERDA: TABLERO + RELOJES */}
            <div className="game-board-column">
              {/* Oponente (Arriba) */}
              <div className="game-opponent-card">
                <div className="game-card-left">
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {opponentProfile.avatarConfig ? <DynamicAvatar config={opponentProfile.avatarConfig} size={34} /> : <AvatarIcon avatarId={opponentProfile.avatar} size={34} />}
                  </div>
                  <div className="game-card-info">
                    <div className="game-card-title">
                      {opponentProfile.name} {assignedColor === 'white' ? '(Negras)' : '(Blancas)'}
                    </div>
                    <div className="game-card-subtitle">
                      Rival Online • {opponentProfile.elo || 600} Elo
                    </div>
                  </div>
                </div>

                <div className="game-card-right">
                  {timeControl > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: assignedColor === 'white' ? (game.turn() === 'b' ? '#ef4444' : 'var(--bg-parchment)') : (game.turn() === 'w' ? '#ef4444' : 'var(--bg-parchment)'), color: assignedColor === 'white' ? (game.turn() === 'b' ? 'white' : 'var(--text-parchment-main)') : (game.turn() === 'w' ? 'white' : 'var(--text-parchment-main)'), padding: '4px 8px', borderRadius: 'var(--radius-sm, 6px)', fontWeight: '900', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      <Clock size={14} />
                      <span>{formatTime(assignedColor === 'white' ? blackTime : whiteTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner de Estado de Turno */}
              <div style={{
                background: isMyTurn ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isMyTurn ? 'var(--color-success)' : 'var(--color-gold-dark)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm, 6px)',
                textAlign: 'center',
                fontWeight: '800',
                fontSize: '0.80rem',
                border: `1px solid ${isMyTurn ? 'var(--color-success)' : 'var(--color-gold)'}`
              }}>
                {mode === 'gameover' ? gameResultReason : (isMyTurn ? '🟢 Es tu turno para mover' : '⏳ Esperando la jugada del rival...')}
              </div>

              {/* Tablero */}
              <ChessBoard
                fen={game.fen()}
                orientation={assignedColor}
                interactive={isMyTurn && mode === 'playing'}
                onMove={handlePlayerMove}
                lastMove={lastMove}
              />

              {/* Jugador (Abajo) */}
              <div className="game-player-card">
                <div className="game-card-left">
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    {currentUser.avatarConfig ? <DynamicAvatar config={currentUser.avatarConfig} size={34} /> : <AvatarIcon avatarId={currentUser.avatar} size={34} />}
                  </div>
                  <div className="game-card-info">
                    <div className="game-card-title">
                      {currentUser.name} (Tú • {assignedColor === 'white' ? 'Blancas' : 'Negras'})
                    </div>
                    <div className="game-card-subtitle">
                      {currentUser.title} • {currentUser.elo} Elo
                    </div>
                  </div>
                </div>

                <div className="game-card-right">
                  {timeControl > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: isMyTurn ? '#22c55e' : 'var(--bg-parchment)', color: isMyTurn ? 'white' : 'var(--text-parchment-main)', padding: '4px 8px', borderRadius: 'var(--radius-sm, 6px)', fontWeight: '900', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      <Clock size={14} />
                      <span>{formatTime(assignedColor === 'white' ? whiteTime : blackTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner de Propuesta de Ventaja / Hándicap Recibida */}
              {incomingHandicapOffer && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#fbbf24' }}>
                      🤝 Propuesta de Ventaja de {incomingHandicapOffer.senderName || opponentProfile.name} (Ronda {incomingHandicapOffer.round || 1}/3)
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#e2e8f0' }}>
                      {getHandicapSummary(incomingHandicapOffer.config)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        p2pRef.current?.send({ type: 'HANDICAP_ACCEPT', config: incomingHandicapOffer.config });
                        setHandicapConfig(incomingHandicapOffer.config);
                        const newFen = getHandicapFen(incomingHandicapOffer.config);
                        setGame(new Chess(newFen));
                        setLastMove(null);
                        setIncomingHandicapOffer(null);
                        audioManager.playVictory();
                      }}
                      className="btn-gold"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
                    >
                      <Check size={14} />
                      <span>✅ Aceptar Ventaja</span>
                    </button>

                    {(incomingHandicapOffer.round || 1) < 3 && (
                      <button
                        onClick={() => {
                          setIsHandicapModalOpen(true);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem', justifyContent: 'center' }}
                      >
                        <RefreshCw size={14} />
                        <span>🔄 Contra-oferta</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        p2pRef.current?.send({ type: 'HANDICAP_REJECT' });
                        setIncomingHandicapOffer(null);
                        audioManager.playMove();
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#ef4444' }}
                    >
                      <span>❌ Jugar Normal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de Rendición, Tablas y Ventajas */}
              {mode === 'playing' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setIsHandicapModalOpen(true)}
                    style={{ flex: '1 1 100%', justifyContent: 'center', padding: '6px 10px', fontSize: '0.78rem', borderColor: '#f59e0b', color: '#f59e0b' }}
                  >
                    <Scale size={14} />
                    <span>🤝 Proponer Ventajas / Hándicap</span>
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => {
                      if (confirm('¿Ofrecer tablas al rival?')) {
                        p2pRef.current?.sendDrawOffer();
                        alert('Propuesta de tablas enviada al rival.');
                      }
                    }}
                    style={{ flex: 1, justifyContent: 'center', padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    🤝 Ofrecer Tablas
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas rendirte?')) {
                        p2pRef.current?.sendResign();
                        setGameResultReason('Te has rendido.');
                        setMode('gameover');
                        recordGameResult('loss', -8, 60);
                      }
                    }}
                    style={{ flex: 1, justifyContent: 'center', color: '#ef4444', padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <Flag size={14} />
                    <span>Rendirse</span>
                  </button>
                </div>
              )}

              {/* Oferta de tablas recibida */}
              {drawOffered && (
                <div style={{ background: 'var(--color-gold-light)', border: '1.5px solid var(--color-gold)', borderRadius: 'var(--radius-md)', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--color-gold-dark)' }}>
                    🤝 El rival te ofrece tablas. ¿Aceptas?
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-gold"
                      onClick={() => {
                        p2pRef.current?.sendAcceptDraw();
                        setGameResultReason('Partida acordada en tablas 🤝');
                        setMode('gameover');
                        recordGameResult('draw', 5, 75);
                      }}
                      style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setDrawOffered(false)}
                      style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: CHAT INFANTIL SEGURO 100% */}
            <div className="game-sidebar-column">
              <SafeChat
                onSendMessage={handleSendSafeChat}
                messages={chatMessages}
              />

              {mode === 'gameover' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <button
                    className="btn-gold"
                    onClick={() => {
                      p2pRef.current?.sendRematch();
                      restartP2PGame();
                    }}
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
                  >
                    <RotateCcw size={16} />
                    <span>Solicitar Revancha 🔄</span>
                  </button>

                  <button className="btn-secondary" onClick={onClose} style={{ justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}>
                    Salir de la Sala P2P
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Negociación de Ventajas y Hándicap P2P */}
        <HandicapConfigModal
          isOpen={isHandicapModalOpen}
          onClose={() => setIsHandicapModalOpen(false)}
          initialConfig={handicapConfig}
          onApplyConfig={(newCfg) => setHandicapConfig(newCfg)}
          gameMode="p2p"
          isOnlineP2P={true}
          opponentName={opponentProfile.name}
          playerName={currentUser.name}
          onSendP2POffer={(offeredConfig, round) => {
            p2pRef.current?.send({
              type: 'HANDICAP_OFFER',
              config: offeredConfig,
              round: (incomingHandicapOffer?.round || 0) + 1,
              senderName: currentUser.name
            });
            alert(`Propuesta de ventajas enviada a ${opponentProfile.name}.`);
          }}
        />
      </div>
    </div>
  );
};
