import React, { useState, useMemo } from 'react';
import { PieceIcon } from '../../../assets/pieces';
import { THREE_HEX_PLAYERS } from '../../../engine/multiplayerChessEngine';
import { MultiplayerCapturedPieces } from './MultiplayerCapturedPieces';

const cx = 400;
const cy = 400;
const R = 388;

const toRad = (deg) => (deg * Math.PI) / 180;

// Vértices del hexágono regular con base horizontal
const V = [
  { x: cx + R * Math.cos(toRad(60)),  y: cy + R * Math.sin(toRad(60)) },  // V0: inferior derecho
  { x: cx + R * Math.cos(toRad(0)),   y: cy + R * Math.sin(toRad(0)) },   // V1: derecho
  { x: cx + R * Math.cos(toRad(300)), y: cy + R * Math.sin(toRad(300)) }, // V2: superior derecho
  { x: cx + R * Math.cos(toRad(240)), y: cy + R * Math.sin(toRad(240)) }, // V3: superior izquierdo
  { x: cx + R * Math.cos(toRad(180)), y: cy + R * Math.sin(toRad(180)) }, // V4: izquierdo
  { x: cx + R * Math.cos(toRad(120)), y: cy + R * Math.sin(toRad(120)) }, // V5: inferior izquierdo
];

const mid = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });

const M_S  = mid(V[5], V[0]); // Base White (d/e)
const M_SE = mid(V[0], V[1]); // Seam White-Red
const M_NE = mid(V[1], V[2]); // Base Red (d/e)
const M_N  = mid(V[2], V[3]); // Seam Red-Black
const M_NW = mid(V[3], V[4]); // Base Black (d/e)
const M_SW = mid(V[4], V[5]); // Seam Black-White
const C = { x: cx, y: cy };

function interp(p00, p10, p11, p01, u, v) {
  const x = (1 - u) * (1 - v) * p00.x + u * (1 - v) * p10.x + u * v * p11.x + (1 - u) * v * p01.x;
  const y = (1 - u) * (1 - v) * p00.y + u * (1 - v) * p10.y + u * v * p11.y + (1 - u) * v * p01.y;
  return { x, y };
}

const SECTOR_QUADS = {
  A: {
    left:  [V[5], M_S, C, M_SW],
    right: [M_S, V[0], M_SE, C]
  },
  B: {
    left:  [V[4], M_NW, C, M_SW],
    right: [M_NW, V[3], M_N, C]
  },
  C: {
    left:  [V[2], M_NE, C, M_N],
    right: [M_NE, V[1], M_SE, C]
  }
};

const LIGHT_SQUARE = '#eedab2';
const DARK_SQUARE  = '#b87333';

export const ThreePlayerHexBoard = ({
  game,
  onMove,
  isBotTurn = false,
  allowedColors,
  playerColor,
  sidebarHeader = null,
  sidebarFooter = null
}) => {
  const [selectedCellId, setSelectedCellId] = useState(null);

  const activePlayer = game.activePlayer;

  const validColors = useMemo(() => {
    if (Array.isArray(allowedColors) && allowedColors.length > 0) {
      return allowedColors;
    }
    return [game.activePlayer];
  }, [allowedColors, game.activePlayer]);

  // Orientación del tablero: el bando del jugador local se ubica en la parte inferior
  const [manualRotation, setManualRotation] = useState(null);
  const defaultOrientationColor = playerColor || validColors[0] || 'white';
  const effectiveOrientationColor = manualRotation || defaultOrientationColor;

  const boardRotation = useMemo(() => {
    if (effectiveOrientationColor === 'black') return 240;
    if (effectiveOrientationColor === 'red') return 120;
    return 0; // white
  }, [effectiveOrientationColor]);

  const legalMoves = useMemo(() => {
    if (!selectedCellId) return [];
    return game.getLegalMovesForCell(selectedCellId);
  }, [selectedCellId, game]);

  const handleCellClick = (cellId) => {
    if (isBotTurn || game.winner) return;

    const isMyTurn = validColors.includes(activePlayer);

    // Si ya hay una ficha seleccionada, verificar si se hace clic en un movimiento legal
    if (selectedCellId) {
      if (selectedCellId === cellId) {
        setSelectedCellId(null);
        return;
      }
      const move = legalMoves.find(m => m.to === cellId);
      if (move) {
        onMove(selectedCellId, cellId);
        setSelectedCellId(null);
        return;
      }
    }

    // Si no es el turno de ningún color de este dispositivo, NO permitir seleccionar nada
    if (!isMyTurn) {
      setSelectedCellId(null);
      return;
    }

    const cell = game.cells[cellId];
    // ÚNICAMENTE permitir seleccionar piezas del jugador activo Y que pertenezcan a los colores de este dispositivo
    if (cell && cell.piece && cell.piece.owner === activePlayer && validColors.includes(cell.piece.owner)) {
      const moves = game.getLegalMovesForCell(cellId);
      if (moves.length > 0) {
        setSelectedCellId(cellId);
      }
    } else {
      setSelectedCellId(null);
    }
  };

  const cycleOrientation = () => {
    const sequence = ['white', 'black', 'red'];
    const currentIdx = sequence.indexOf(effectiveOrientationColor);
    const nextColor = sequence[(currentIdx + 1) % sequence.length];
    setManualRotation(nextColor);
  };

  const getCellGeometry = (sec, f, r) => {
    const isLeft = f < 4;
    const quad = isLeft ? SECTOR_QUADS[sec].left : SECTOR_QUADS[sec].right;
    const localF = isLeft ? f : f - 4;

    const u0 = localF / 4;
    const u1 = (localF + 1) / 4;
    const v0 = r / 4;
    const v1 = (r + 1) / 4;

    const p1 = interp(quad[0], quad[1], quad[2], quad[3], u0, v0);
    const p2 = interp(quad[0], quad[1], quad[2], quad[3], u1, v0);
    const p3 = interp(quad[0], quad[1], quad[2], quad[3], u1, v1);
    const p4 = interp(quad[0], quad[1], quad[2], quad[3], u0, v1);

    const center = interp(quad[0], quad[1], quad[2], quad[3], (u0 + u1) / 2, (v0 + v1) / 2);
    const pathData = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} L ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} Z`;

    return { pathData, center, outerEdgeMid: mid(p1, p2) };
  };

  return (
    <div className="multiplayer-board-container">
      
      {/* Columna Izquierda: El Tablero */}
      <div className="multiplayer-board-area">
        <div className="multiplayer-board-grid three-hex-grid">
          <svg
            viewBox="0 0 800 800"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            {/* Grupo rotado según la orientación del jugador ("mi bando siempre abajo") */}
            <g transform={`rotate(${boardRotation}, ${cx}, ${cy})`} style={{ transition: 'transform 0.4s ease' }}>
              {/* Borde exterior del hexágono */}
              <polygon
                points={V.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                fill="#3d2612"
                stroke="#1e293b"
                strokeWidth="6"
                strokeLinejoin="round"
              />

              {/* 96 Casillas Cuadriláteras */}
              {['A', 'B', 'C'].map(sec => 
                Array(4).fill(null).map((_, r) => 
                  Array(8).fill(null).map((_, f) => {
                    const cellId = `${sec}_${f}_${r}`;
                    const cell = game.cells[cellId];
                    const { pathData, center } = getCellGeometry(sec, f, r);
                    const isSelected = selectedCellId === cellId;
                    const isLegal = legalMoves.some(m => m.to === cellId);
                    const hasPiece = !!cell?.piece;

                    const isDark = (f + r) % 2 === 0;
                    let fill = isDark ? DARK_SQUARE : LIGHT_SQUARE;
                    if (isSelected) fill = '#60a5fa';
                    else if (isLegal) fill = hasPiece ? '#f87171' : '#4ade80';

                    return (
                      <g key={cellId} data-cell-id={cellId} onClick={() => handleCellClick(cellId)} style={{ cursor: 'pointer' }}>
                        <path
                          d={pathData}
                          fill={fill}
                          stroke="#3d2612"
                          strokeWidth="1.2"
                          style={{ transition: 'fill 0.15s ease' }}
                        />

                        {/* Indicador de destino legal */}
                        {isLegal && !hasPiece && (
                          <circle
                            cx={center.x}
                            cy={center.y}
                            r="6"
                            fill="#15803d"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        )}

                        {/* Render de Pieza Centrada con contrarotación para mantenerse vertical */}
                        {hasPiece && (() => {
                          const isPawn = cell.piece.type === 'p';
                          const pieceSize = isPawn ? 35 : 42;
                          const half = pieceSize / 2;
                          return (
                            <g
                              transform={`translate(${center.x}, ${center.y}) rotate(${-boardRotation}) translate(${-half}, ${-half})`}
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                            >
                              <PieceIcon
                                piece={cell.piece.type}
                                color={cell.piece.owner}
                                size={pieceSize}
                                width={pieceSize}
                                height={pieceSize}
                              />
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })
                )
              )}

              {/* Costuras centrales divisorias */}
              <line x1={M_S.x} y1={M_S.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="2.5" />
              <line x1={M_SE.x} y1={M_SE.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="3" />
              <line x1={M_NE.x} y1={M_NE.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="2.5" />
              <line x1={M_N.x} y1={M_N.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="3" />
              <line x1={M_NW.x} y1={M_NW.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="2.5" />
              <line x1={M_SW.x} y1={M_SW.y} x2={C.x} y2={C.y} stroke="#3d2612" strokeWidth="3" />

              {/* Letras de columnas para el bando que está en la base inferior */}
              {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, idx) => {
                const activeSec = effectiveOrientationColor === 'black' ? 'B' : effectiveOrientationColor === 'red' ? 'C' : 'A';
                const { outerEdgeMid } = getCellGeometry(activeSec, idx, 0);
                const dirX = outerEdgeMid.x - cx;
                const dirY = outerEdgeMid.y - cy;
                const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
                const labelX = (outerEdgeMid.x + (dirX / dist) * 16).toFixed(1);
                const labelY = (outerEdgeMid.y + (dirY / dist) * 16).toFixed(1);
                return (
                  <text
                    key={`${activeSec}_${letter}_${idx}`}
                    x={labelX}
                    y={labelY}
                    fill="#cbd5e1"
                    fontSize="14"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${-boardRotation}, ${labelX}, ${labelY})`}
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                  >
                    {letter}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Columna Derecha: Sidebar de Opciones, Marcador y Acciones */}
      <div className="multiplayer-sidebar-area">
        {/* HUD de Turno */}
        <div className="multiplayer-hud-card" style={{
          borderColor: activePlayer === 'white' ? '#f8fafc' : activePlayer === 'red' ? '#ef4444' : '#64748b',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: activePlayer === 'white' ? '#ffffff' : activePlayer === 'red' ? '#ef4444' : '#1e293b',
              border: '2px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activePlayer === 'white' ? '#0f172a' : '#ffffff',
              fontWeight: 800
            }}>
              {activePlayer.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>TURNO (AJEDREZ A 3)</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', textTransform: 'capitalize' }}>
                Ejército {activePlayer === 'white' ? 'Blanco' : activePlayer === 'black' ? 'Negro' : 'Rojo'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
              <span>🔄 Vista: {effectiveOrientationColor === 'white' ? 'Blanco' : effectiveOrientationColor === 'black' ? 'Negro' : 'Rojo'} (Abajo)</span>
            </button>
          </div>
        </div>

        {/* Banners Superiores (Turno / Bot) */}
        {sidebarHeader && (
          <div className="multiplayer-sidebar-header">
            {sidebarHeader}
          </div>
        )}

        {/* Marcador de Puntuación */}
        <div className="multiplayer-scores-grid three-scores-grid">
          {THREE_HEX_PLAYERS.map(player => {
            const isTurn = activePlayer === player;
            const label = player === 'white' ? 'Blanco' : player === 'black' ? 'Negro' : 'Rojo';
            const colorHex = player === 'white' ? '#f8fafc' : player === 'red' ? '#ef4444' : '#64748b';
            return (
              <div
                key={player}
                className="multiplayer-score-card"
                style={{
                  backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                  border: isTurn ? `2px solid ${colorHex}` : '1px solid #334155'
                }}
              >
                <div className="score-card-header">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorHex }} />
                  <span className="score-card-name">{label}</span>
                </div>
                <span className="score-card-pts" style={{ color: '#38bdf8' }}>{game.scores[player]} pts</span>
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
