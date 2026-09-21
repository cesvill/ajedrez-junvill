import React, { useState, useMemo } from 'react';
import { PieceIcon, PLAYER_PIECE_COLORS } from '../../../assets/pieces';
import { FourPlayerGame, FOUR_PLAYERS } from '../../../engine/multiplayerChessEngine';
import { Crown, Shield, Zap } from 'lucide-react';
import { MultiplayerCapturedPieces } from './MultiplayerCapturedPieces';

const PLAYER_META = {
  red: { name: 'Rojo (Sur)', colorHex: '#ef4444' },
  blue: { name: 'Azul (Oeste)', colorHex: '#3b82f6' },
  yellow: { name: 'Amarillo (Norte)', colorHex: '#f59e0b' },
  green: { name: 'Verde (Este)', colorHex: '#10b981' }
};

export const FourPlayerBoard = ({
  game,
  onMove,
  isBotTurn = false,
  allowedColors,
  playerColor,
  sidebarHeader = null,
  sidebarFooter = null
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const activePlayer = game.activePlayer;
  const activeMeta = PLAYER_META[activePlayer];

  const validColors = useMemo(() => {
    if (Array.isArray(allowedColors) && allowedColors.length > 0) {
      return allowedColors;
    }
    return [game.activePlayer];
  }, [allowedColors, game.activePlayer]);

  // Orientación del tablero: el bando del jugador local se ubica en la parte inferior
  const [manualRotation, setManualRotation] = useState(null);
  const defaultOrientationColor = playerColor || validColors[0] || 'red';
  const effectiveOrientationColor = manualRotation || defaultOrientationColor;

  const boardRotation = useMemo(() => {
    if (effectiveOrientationColor === 'red') return 180;
    if (effectiveOrientationColor === 'blue') return 270;
    if (effectiveOrientationColor === 'green') return 90;
    return 0; // yellow
  }, [effectiveOrientationColor]);

  const cycleOrientation = () => {
    const sequence = ['red', 'blue', 'yellow', 'green'];
    const currentIdx = sequence.indexOf(effectiveOrientationColor);
    const nextColor = sequence[(currentIdx + 1) % sequence.length];
    setManualRotation(nextColor);
  };

  const legalMoves = useMemo(() => {
    if (!selectedCell) return [];
    return game.getLegalMovesForPiece(selectedCell.x, selectedCell.y);
  }, [selectedCell, game]);

  const handleCellClick = (x, y) => {
    if (isBotTurn || game.winner || FourPlayerGame.isOutOfBounds(x, y)) return;

    const isMyTurn = validColors.includes(activePlayer);

    if (selectedCell) {
      if (selectedCell.x === x && selectedCell.y === y) {
        setSelectedCell(null);
        return;
      }

      const move = legalMoves.find(m => m.to.nx === x && m.to.ny === y);
      if (move) {
        onMove(selectedCell.x, selectedCell.y, x, y);
        setSelectedCell(null);
        return;
      }
    }

    // Si no es el turno de ningún color de este dispositivo, NO permitir seleccionar nada
    if (!isMyTurn) {
      setSelectedCell(null);
      return;
    }

    const piece = game.board[y]?.[x];
    // ÚNICAMENTE permitir seleccionar piezas del jugador activo Y que pertenezcan a los colores de este dispositivo
    if (piece && piece.owner === activePlayer && validColors.includes(piece.owner)) {
      const moves = game.getLegalMovesForPiece(x, y);
      if (moves.length > 0) {
        setSelectedCell({ x, y });
      }
    } else {
      setSelectedCell(null);
    }
  };

  return (
    <div className="multiplayer-board-container">
      
      {/* Columna Izquierda: Tablero */}
      <div className="multiplayer-board-area">
        <div 
          className="multiplayer-board-grid four-player-grid"
          style={{
            transform: `rotate(${boardRotation}deg)`,
            transition: 'transform 0.4s ease'
          }}
        >
          {Array(14).fill(null).map((_, y) => 
            Array(14).fill(null).map((_, x) => {
              const isOut = FourPlayerGame.isOutOfBounds(x, y);
              const piece = game.board[y][x];
              const isLight = (x + y) % 2 === 0;
              const isSelected = selectedCell?.x === x && selectedCell?.y === y;
              const isLegal = legalMoves.some(m => m.to.nx === x && m.to.ny === y);

              if (isOut) {
                return (
                  <div
                    key={`${x}_${y}`}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                );
              }

              let cellBg = isLight ? '#f1f5f9' : '#94a3b8';
              if (isSelected) cellBg = '#60a5fa';
              if (isLegal) cellBg = piece ? '#f87171' : (isLight ? '#86efac' : '#4ade80');

              return (
                <div
                  key={`${x}_${y}`}
                  onClick={() => handleCellClick(x, y)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: cellBg,
                    border: '0.5px solid rgba(15, 23, 42, 0.25)',
                    cursor: (piece?.owner === activePlayer || isLegal) ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {isLegal && !piece && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a',
                      boxShadow: '0 0 6px #16a34a'
                    }} />
                  )}

                  {piece && (
                    <div style={{
                      width: '85%',
                      height: '85%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
                      transform: `rotate(${-boardRotation}deg)`,
                      transition: 'transform 0.4s ease'
                    }}>
                      <PieceIcon
                        piece={piece.type}
                        color={piece.owner}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Sidebar de Opciones, Marcador y Acciones */}
      <div className="multiplayer-sidebar-area">
        {/* HUD del Jugador Activo */}
        <div className="multiplayer-hud-card" style={{
          borderColor: activeMeta?.colorHex || '#3b82f6',
          boxShadow: `0 8px 24px ${activeMeta?.colorHex || '#3b82f6'}26`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: activeMeta?.colorHex || '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              {activeMeta?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                Turno ({game.mode === 'teams' ? 'Equipos 2v2' : 'FFA Todos contra Todos'})
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                {activeMeta?.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={cycleOrientation}
              title="Girar orientación del tablero"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>🔄 Vista: {PLAYER_META[effectiveOrientationColor]?.name || effectiveOrientationColor} (Abajo)</span>
            </button>
            <span style={{ fontSize: '14px', fontWeight: 800, color: activeMeta?.colorHex, backgroundColor: 'rgba(15,23,42,0.6)', padding: '6px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
              {game.scores[activePlayer]} Puntos
            </span>
          </div>
        </div>

        {/* Banners Superiores (Turno / Bot) */}
        {sidebarHeader && (
          <div className="multiplayer-sidebar-header">
            {sidebarHeader}
          </div>
        )}

        {/* Marcador de los 4 Jugadores */}
        <div className="multiplayer-scores-grid">
          {FOUR_PLAYERS.map(player => {
            const meta = PLAYER_META[player];
            const isEliminated = game.eliminated.has(player);
            const isTurn = activePlayer === player;

            return (
              <div
                key={player}
                className="multiplayer-score-card"
                style={{
                  backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                  border: isTurn ? `2px solid ${meta.colorHex}` : '1px solid #334155',
                  opacity: isEliminated ? 0.45 : 1
                }}
              >
                <div className="score-card-header">
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: meta.colorHex,
                    flexShrink: 0
                  }} />
                  <span className="score-card-name">
                    {meta.name.split(' ')[0]}
                  </span>
                </div>
                <span className="score-card-pts" style={{ color: meta.colorHex }}>
                  {isEliminated ? 'ELIM' : `${game.scores[player]} pts`}
                </span>
                <MultiplayerCapturedPieces items={game.getCapturedSummary?.(player) || []} />
              </div>
            );
          })}
        </div>

        {/* Controles Inferiores (Reacciones, Chat, Bots) */}
        {sidebarFooter && (
          <div className="multiplayer-sidebar-footer">
            {sidebarFooter}
          </div>
        )}
      </div>

    </div>
  );
};
