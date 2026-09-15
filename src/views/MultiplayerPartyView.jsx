import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChaturajiGame,
  FourPlayerGame,
  ThreePlayerHexGame,
  ThreePlayerCircularGame,
  getBestMultiplayerBotMove
} from '../engine/multiplayerChessEngine';
import { ChaturajiBoard } from '../components/Variants/MultiplayerBoards/ChaturajiBoard';
import { FourPlayerBoard } from '../components/Variants/MultiplayerBoards/FourPlayerBoard';
import { ThreePlayerHexBoard } from '../components/Variants/MultiplayerBoards/ThreePlayerHexBoard';
import { ThreePlayerCircularBoard } from '../components/Variants/MultiplayerBoards/ThreePlayerCircularBoard';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import {
  Users,
  Bot,
  RotateCcw,
  ArrowLeft,
  BookOpen,
  Trophy,
  Dices,
  Sparkles,
  Shield,
  Compass,
  X,
  Play
} from 'lucide-react';

const VARIANTS = [
  {
    id: 'chaturaji',
    name: 'Chaturaji Védico',
    subtitle: '4 Jugadores con Dados',
    playersCount: 4,
    icon: '🎲',
    badge: 'Histórico',
    badgeColor: '#f59e0b',
    desc: 'El abuelo del ajedrez en tablero 8×8. Un dado determina si mueves Barco, Caballo, Elefante o Rey/Peón.',
    rules: [
      'Tirada de dado obligatoria: 2=Barco (salta 2 en diagonal), 3=Caballo (en L), 4=Elefante (desliza ortogonal), 5=Rey o Peón.',
      'No existe el jaque ni el mate: ¡los Reyes se capturan directamente!',
      'Si un jugador no tiene jugadas válidas para la pieza que arrojó el dado, pierde el turno.',
      'Victoria por captura de los reyes rivales o al llevar a tu propio Rey al trono original de un contrincante (Sinhasana).'
    ]
  },
  {
    id: 'four_player',
    name: 'Ajedrez para 4 en Cruz',
    subtitle: 'Tablero 14×14 (160 casillas)',
    playersCount: 4,
    icon: '⚔️',
    badge: 'Competitivo',
    badgeColor: '#ef4444',
    desc: 'Cuadrícula en cruz de 14×14 con 4 ejércitos completos. Coronación al cruzar la 8.ª casilla relativa.',
    rules: [
      'Turnos en sentido horario: Rojo (Sur) -> Azul (Oeste) -> Amarillo (Norte) -> Verde (Este).',
      'La Dama se ubica a la izquierda del Rey desde la perspectiva de cada jugador.',
      'Los peones coronan al alcanzar la 8.ª casilla relativa desde su posición de salida.',
      'El jaque se evalúa únicamente al llegar el turno del rey amenazado.',
      'Al recibir mate o rendirse, las piezas del jugador se convierten en piezas neutrales congeladas.'
    ]
  },
  {
    id: 'three_hex',
    name: 'Ajedrez para 3 Hexagonal',
    subtitle: '96 casillas trilobulares',
    playersCount: 3,
    icon: '⭐',
    badge: 'Trilateral',
    badgeColor: '#38bdf8',
    desc: 'Tablero tricolor con 3 alas convergentes. Las diagonales se bifurcan en el núcleo central.',
    rules: [
      '3 Jugadores: Blanco, Negro y Rojo.',
      'Torres continúan en línea recta al pasar por el nexo central hacia la columna correspondiente del ala rival.',
      'Alfiles en el centro bifurcan sus diagonales amenazando simultáneamente las dos alas contrarias en casillas del mismo color.',
      'Regla de Quick Death: ¡El primer jugador que aseste jaque mate gana la partida de inmediato!'
    ]
  },
  {
    id: 'three_circular',
    name: '3-Man Chess (Circular)',
    subtitle: '144 casillas concéntricas',
    playersCount: 3,
    icon: '🌀',
    badge: '360 Grados',
    badgeColor: '#a855f7',
    desc: '6 anillos y 24 radios. Sin bordes laterales: ataques envolventes en 360° con cruce de polo a 180°.',
    rules: [
      'Movimiento anular continuo: las torres pueden rodear el tablero completo si el camino está despejado.',
      'Cruce central: Al cruzar el anillo interior (el pozo), las piezas emergen por el radio opuesto a 180°.',
      'Los peones avanzan hacia el centro (anillos 1 a 5). Al cruzar el pozo invierten su dirección hacia afuera y coronan en el anillo exterior rival.'
    ]
  }
];

export const MultiplayerPartyView = ({ onBackToMenu }) => {
  const getInitialVariant = () => {
    try {
      const v = new URLSearchParams(window.location.search).get('variant');
      if (v && ['chaturaji', 'four_player', 'three_hex', 'three_circular'].includes(v)) {
        return v;
      }
    } catch (e) {}
    return 'chaturaji';
  };

  const getDefaultBotPlayers = (variantId) => {
    if (variantId === 'three_hex' || variantId === 'three_circular') {
      // Blanco es humano, Negro y Rojo son Bots IA
      return { white: false, black: true, red: true };
    }
    if (variantId === 'four_player') {
      // Rojo es humano, Azul, Amarillo y Verde son Bots IA
      return { red: false, blue: true, yellow: true, green: true };
    }
    // Chaturaji: Rojo es humano, Verde, Amarillo y Negro son Bots IA
    return { red: false, green: true, yellow: true, black: true };
  };

  const [selectedVariant, setSelectedVariant] = useState(getInitialVariant);
  const [botPlayers, setBotPlayers] = useState(() => getDefaultBotPlayers(getInitialVariant()));
  const [game, setGame] = useState(() => {
    const v = getInitialVariant();
    if (v === 'four_player') return new FourPlayerGame('ffa');
    if (v === 'three_hex') return new ThreePlayerHexGame();
    if (v === 'three_circular') return new ThreePlayerCircularGame();
    return new ChaturajiGame();
  });
  const [gameTick, setGameTick] = useState(0);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botTimerRef = useRef(null);

  // Inicializar juego al cambiar de variante
  const initGameForVariant = useCallback((variantId) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setIsBotThinking(false);

    let newGame;
    if (variantId === 'chaturaji') newGame = new ChaturajiGame();
    else if (variantId === 'four_player') newGame = new FourPlayerGame('ffa');
    else if (variantId === 'three_hex') newGame = new ThreePlayerHexGame();
    else if (variantId === 'three_circular') newGame = new ThreePlayerCircularGame();

    setGame(newGame);
    setGameTick(t => t + 1);
  }, []);

  const handleVariantChange = (vId) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setIsBotThinking(false);
    setSelectedVariant(vId);
    setBotPlayers(getDefaultBotPlayers(vId));
    initGameForVariant(vId);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', vId);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Turno del bot automático
  useEffect(() => {
    if (!game || game.winner) {
      setIsBotThinking(false);
      return;
    }

    const active = game.activePlayer;
    const isBot = !!botPlayers[active];

    if (!isBot) {
      setIsBotThinking(false);
      return;
    }

    // El jugador activo es Bot: indicar en UI y programar jugada
    setIsBotThinking(true);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      // Validar que la partida no haya cambiado y siga siendo el turno del bot
      if (game.winner || game.activePlayer !== active) {
        setIsBotThinking(false);
        return;
      }

      const move = getBestMultiplayerBotMove(game, selectedVariant);
      if (move) {
        if (selectedVariant === 'chaturaji') {
          game.makeMove(move.from.x, move.from.y, move.to.nx, move.to.ny);
        } else if (selectedVariant === 'four_player') {
          game.makeMove(move.from.x, move.from.y, move.to.nx, move.to.ny);
        } else if (selectedVariant === 'three_hex') {
          game.makeMove(move.from, move.to);
        } else if (selectedVariant === 'three_circular') {
          game.makeMove(move.from.ring, move.from.ray, move.to.ring, move.to.ray);
        }
        audioManager.playMove();
      } else {
        // Si no hay jugada legal con la tirada actual de dados o bloqueo
        if (selectedVariant === 'chaturaji') {
          game.passTurn();
        } else {
          game.nextTurn();
        }
      }

      setIsBotThinking(false);
      setGameTick(t => t + 1);

      if (game.winner) {
        audioManager.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }, 650);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameTick, selectedVariant, botPlayers]);

  // Manejo de movimiento del jugador humano
  const handleHumanMove = (...args) => {
    if (botPlayers[game.activePlayer] || isBotThinking || game.winner) return;

    let success = false;
    if (selectedVariant === 'chaturaji') {
      const [fx, fy, tx, ty] = args;
      success = game.makeMove(fx, fy, tx, ty);
    } else if (selectedVariant === 'four_player') {
      const [fx, fy, tx, ty] = args;
      success = game.makeMove(fx, fy, tx, ty);
    } else if (selectedVariant === 'three_hex') {
      const [fromId, toId] = args;
      success = game.makeMove(fromId, toId);
    } else if (selectedVariant === 'three_circular') {
      const [fRing, fRay, tRing, tRay] = args;
      success = game.makeMove(fRing, fRay, tRing, tRay);
    }

    if (success) {
      audioManager.playMove();
      setGameTick(t => t + 1);

      if (game.winner) {
        audioManager.playVictory();
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }
    }
  };

  const handlePassTurn = () => {
    if (selectedVariant === 'chaturaji' && !botPlayers[game.activePlayer] && !game.winner) {
      game.passTurn();
      audioManager.playMove();
      setGameTick(t => t + 1);
    }
  };

  const togglePlayerType = (playerKey) => {
    setBotPlayers(prev => ({
      ...prev,
      [playerKey]: !prev[playerKey]
    }));
    setGameTick(t => t + 1);
  };

  const currentVariantData = VARIANTS.find(v => v.id === selectedVariant) || VARIANTS[0];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* Barra de Encabezado Superior */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1080px',
        marginBottom: '20px'
      }}>
        <button
          onClick={onBackToMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={18} /> Volver al Menú
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Users size={24} style={{ color: '#38bdf8' }} />
            Ajedrez Multijugador Junvill
          </h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Partidas dinámicas para 3 y 4 jugadores simultáneos
          </p>
        </div>

        <button
          onClick={() => setIsRulesOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '10px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={18} /> Reglas
        </button>
      </div>

      {/* Selector de Variantes (4 Pestañas / Tarjetas) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: '1080px',
        marginBottom: '24px'
      }}>
        {VARIANTS.map(v => {
          const isSelected = selectedVariant === v.id;
          return (
            <div
              key={v.id}
              onClick={() => handleVariantChange(v.id)}
              style={{
                backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isSelected ? `2px solid ${v.badgeColor}` : '1px solid #1e293b',
                borderRadius: '16px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 8px 24px ${v.badgeColor}26` : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{v.icon}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: v.badgeColor,
                  backgroundColor: `${v.badgeColor}18`,
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {v.badge}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                {v.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                {v.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selector Rápido de Participantes (Humano vs Bot Junvill) */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        maxWidth: '1080px',
        marginBottom: '20px',
        padding: '10px 16px',
        backgroundColor: '#0f172a',
        borderRadius: '14px',
        border: '1px solid #1e293b'
      }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginRight: '6px' }}>
          Control de Jugadores:
        </span>
        {game.players.map(pKey => {
          const isBot = botPlayers[pKey];
          return (
            <button
              key={pKey}
              onClick={() => togglePlayerType(pKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isBot ? '#334155' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isBot ? <Bot size={14} /> : <Users size={14} />}
              {pKey.toUpperCase()}: {isBot ? 'Bot IA' : 'Humano'}
            </button>
          );
        })}
        <button
          onClick={() => initGameForVariant(selectedVariant)}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} /> Reiniciar Partida
        </button>
      </div>

      {/* Banner de Ganador */}
      {game.winner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backgroundColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          background: '#d97706',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '16px',
          fontWeight: 900,
          fontSize: '18px',
          boxShadow: '0 10px 30px rgba(217, 119, 6, 0.4)',
          marginBottom: '20px'
        }}>
          <Trophy size={28} />
          <span>¡Victoria de {game.winner.toUpperCase()}! Partida Concluida.</span>
          <button
            onClick={() => initGameForVariant(selectedVariant)}
            style={{
              marginLeft: '12px',
              backgroundColor: '#ffffff',
              color: '#92400e',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Nueva Partida
          </button>
        </div>
      )}

      {/* Banner de Bot Pensando */}
      {isBotThinking && !game.winner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          color: '#38bdf8',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)'
        }}>
          <Bot size={16} />
          <span>El Bot ({game.activePlayer.toUpperCase()}) está calculando su jugada...</span>
        </div>
      )}

      {/* Tablero Activo */}
      <div style={{ width: '100%', maxWidth: '720px', display: 'flex', justifyContent: 'center' }}>
        {selectedVariant === 'chaturaji' && (
          <ChaturajiBoard
            key={`chaturaji_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            onPass={handlePassTurn}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
          />
        )}

        {selectedVariant === 'four_player' && (
          <FourPlayerBoard
            key={`four_player_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
          />
        )}

        {selectedVariant === 'three_hex' && (
          <ThreePlayerHexBoard
            key={`three_hex_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
          />
        )}

        {selectedVariant === 'three_circular' && (
          <ThreePlayerCircularBoard
            key={`three_circular_${gameTick}`}
            game={game}
            onMove={handleHumanMove}
            isBotTurn={botPlayers[game.activePlayer] || isBotThinking}
          />
        )}
      </div>

      {/* Modal Informativo de Reglas */}
      {isRulesOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #334155',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{currentVariantData.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                    {currentVariantData.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {currentVariantData.subtitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRulesOpen(false)}
                style={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  color: '#94a3b8',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
              {currentVariantData.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentVariantData.rules.map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsRulesOpen(false)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ¡Entendido, a Jugar!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
