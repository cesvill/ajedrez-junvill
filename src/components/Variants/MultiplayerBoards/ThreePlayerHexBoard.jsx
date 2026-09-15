import React, { useState, useMemo } from 'react';
import { PieceIcon } from '../../../assets/pieces';
import { THREE_HEX_PLAYERS } from '../../../engine/multiplayerChessEngine';

const cx = 400;
const cy = 400;
const R = 360;

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
  isBotTurn = false
}) => {
  const [selectedCellId, setSelectedCellId] = useState(null);

  const activePlayer = game.activePlayer;
  const legalMoves = useMemo(() => {
    if (!selectedCellId) return [];
    return game.getLegalMovesForCell(selectedCellId);
  }, [selectedCellId, game]);

  const handleCellClick = (cellId) => {
    if (isBotTurn || game.winner) return;

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

    const cell = game.cells[cellId];
    if (cell && cell.piece && cell.piece.owner === activePlayer) {
      const moves = game.getLegalMovesForCell(cellId);
      if (moves.length > 0) {
        setSelectedCellId(cellId);
      }
    } else {
      setSelectedCellId(null);
    }
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

    return { pathData, center };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      
      {/* HUD de Turno */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 18px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: `2px solid ${activePlayer === 'white' ? '#f8fafc' : activePlayer === 'red' ? '#ef4444' : '#64748b'}`,
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

        <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 700, backgroundColor: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '10px' }}>
          Tablero Hexagonal Clásico
        </div>
      </div>

      {/* Tablero SVG Hexagonal Regular (96 casillas) */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#0a0f1d',
        borderRadius: '24px',
        padding: '10px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        border: '3px solid #1e293b'
      }}>
        <svg
          viewBox="0 0 800 800"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
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
                  <g key={cellId} onClick={() => handleCellClick(cellId)} style={{ cursor: 'pointer' }}>
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

                    {/* Render de Pieza Centrada y con tamaño amplio y armónico */}
                    {hasPiece && (() => {
                      const isPawn = cell.piece.type === 'p';
                      const pieceSize = isPawn ? 33 : 38;
                      const half = pieceSize / 2;
                      return (
                        <g
                          transform={`translate(${(center.x - half).toFixed(1)}, ${(center.y - half).toFixed(1)})`}
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

          {/* Letras de columnas para bando Blanco en la base exterior fuera del tablero */}
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, idx) => {
            const { center } = getCellGeometry('A', idx, 0);
            return (
              <text
                key={letter}
                x={center.x}
                y={738}
                fill="#cbd5e1"
                fontSize="15"
                fontWeight="800"
                textAnchor="middle"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                {letter}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Marcador de Puntuación */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
        {THREE_HEX_PLAYERS.map(player => {
          const isTurn = activePlayer === player;
          const label = player === 'white' ? 'Blanco' : player === 'black' ? 'Negro' : 'Rojo';
          const colorHex = player === 'white' ? '#f8fafc' : player === 'red' ? '#ef4444' : '#64748b';
          return (
            <div
              key={player}
              style={{
                backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isTurn ? `2px solid ${colorHex}` : '1px solid #334155',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorHex }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{label}</span>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#38bdf8' }}>{game.scores[player]} pts</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
