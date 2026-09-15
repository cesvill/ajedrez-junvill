import React, { useState, useMemo } from 'react';
import { PieceIcon } from '../../../assets/pieces';
import { THREE_CIRCULAR_PLAYERS } from '../../../engine/multiplayerChessEngine';

const PLAYER_INFO = {
  white: { name: 'Blanco', colorHex: '#f8fafc', bg: '#ffffff', text: '#0f172a', rays: '0-7' },
  black: { name: 'Negro', colorHex: '#334155', bg: '#1e293b', text: '#ffffff', rays: '8-15' },
  red: { name: 'Rojo', colorHex: '#ef4444', bg: '#ef4444', text: '#ffffff', rays: '16-23' }
};

const cx = 400;
const cy = 400;
const R_WELL = 100;
const R_MAX = 370;
const DELTA_R = (R_MAX - R_WELL) / 6;

const toRad = (deg) => (deg * Math.PI) / 180;

export const ThreePlayerCircularBoard = ({
  game,
  onMove,
  isBotTurn = false
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const activePlayer = game.activePlayer;
  const legalMoves = useMemo(() => {
    if (!selectedCell) return [];
    return game.getLegalMovesForPiece(selectedCell.ring, selectedCell.ray);
  }, [selectedCell, game]);

  const handleCellClick = (ring, ray) => {
    if (isBotTurn || game.winner) return;

    if (selectedCell) {
      if (selectedCell.ring === ring && selectedCell.ray === ray) {
        setSelectedCell(null);
        return;
      }
      const move = legalMoves.find(m => m.to.ring === ring && m.to.ray === ray);
      if (move) {
        onMove(selectedCell.ring, selectedCell.ray, ring, ray);
        setSelectedCell(null);
        return;
      }
    }

    const piece = game.board[ring]?.[ray];
    if (piece && piece.owner === activePlayer) {
      const moves = game.getLegalMovesForPiece(ring, ray);
      if (moves.length > 0) {
        setSelectedCell({ ring, ray });
      }
    } else {
      setSelectedCell(null);
    }
  };

  const getArcGeometry = (ring, ray) => {
    // ring 0 es exterior, ring 5 es interior junto al pozo
    const rIn = R_WELL + (5 - ring) * DELTA_R;
    const rOut = R_WELL + (6 - ring) * DELTA_R;

    // Ray 0 inicia en 30° para que White (rays 0..7) quede centrado en el Sur (90°)
    const t1 = 30 + ray * 15;
    const t2 = 30 + (ray + 1) * 15;

    const p1 = { x: cx + rIn * Math.cos(toRad(t1)), y: cy + rIn * Math.sin(toRad(t1)) };
    const p2 = { x: cx + rOut * Math.cos(toRad(t1)), y: cy + rOut * Math.sin(toRad(t1)) };
    const p3 = { x: cx + rOut * Math.cos(toRad(t2)), y: cy + rOut * Math.sin(toRad(t2)) };
    const p4 = { x: cx + rIn * Math.cos(toRad(t2)), y: cy + rIn * Math.sin(toRad(t2)) };

    const midR = (rIn + rOut) / 2;
    const midT = (t1 + t2) / 2;
    const center = { x: cx + midR * Math.cos(toRad(midT)), y: cy + midR * Math.sin(toRad(midT)) };

    const pathData = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} A ${rOut.toFixed(1)} ${rOut.toFixed(1)} 0 0 1 ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} L ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} A ${rIn.toFixed(1)} ${rIn.toFixed(1)} 0 0 0 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`;

    return { pathData, center };
  };

  const LIGHT = '#ffffff';
  const DARK  = '#94a3b8';

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
        border: `2px solid ${PLAYER_INFO[activePlayer]?.colorHex || '#3b82f6'}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: PLAYER_INFO[activePlayer]?.colorHex,
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
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>TURNO (AJEDREZ CIRCULAR)</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
              Ejército {PLAYER_INFO[activePlayer]?.name}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 700, backgroundColor: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '10px' }}>
          360° Sin Bordes Laterales
        </div>
      </div>

      {/* Tablero Circular SVG (144 Casillas) */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#0a0f1d',
        borderRadius: '24px',
        padding: '8px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        border: '3px solid #1e293b'
      }}>
        <svg
          viewBox="0 0 800 800"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* Borde exterior */}
          <circle cx={cx} cy={cy} r={R_MAX + 5} fill="#334155" stroke="#1e293b" strokeWidth="4" />

          {/* 144 Cuñas Anulares */}
          {Array(6).fill(null).map((_, ring) => 
            Array(24).fill(null).map((_, ray) => {
              const piece = game.board[ring][ray];
              const { pathData, center } = getArcGeometry(ring, ray);
              const isLight = (ring + ray) % 2 === 0;
              const isSelected = selectedCell?.ring === ring && selectedCell?.ray === ray;
              const isLegal = legalMoves.some(m => m.to.ring === ring && m.to.ray === ray);
              const hasPiece = !!piece;

              let fill = isLight ? LIGHT : DARK;
              if (isSelected) fill = '#60a5fa';
              else if (isLegal) fill = hasPiece ? '#f87171' : '#4ade80';

              return (
                <g key={`${ring}_${ray}`} onClick={() => handleCellClick(ring, ray)} style={{ cursor: 'pointer' }}>
                  <path
                    d={pathData}
                    fill={fill}
                    stroke="#475569"
                    strokeWidth="1"
                    style={{ transition: 'fill 0.15s ease' }}
                  />

                  {/* Indicador de destino legal */}
                  {isLegal && !hasPiece && (
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r="5"
                      fill="#15803d"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Render de Pieza Centrada con tamaño amplio y armónico */}
                  {hasPiece && (() => {
                    const isPawn = piece.type === 'p';
                    const baseSize = Math.round(38 - ring * 2.0);
                    const pieceSize = isPawn ? Math.max(24, Math.round(baseSize * 0.88)) : baseSize;
                    const half = pieceSize / 2;
                    return (
                      <g
                        transform={`translate(${(center.x - half).toFixed(1)}, ${(center.y - half).toFixed(1)})`}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                      >
                        <PieceIcon
                          piece={piece.type}
                          color={piece.owner}
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
          )}

          {/* 3 Líneas Divisorias de Jugadores (Verde brillante como en imagen oficial) */}
          {[30, 150, 270].map(deg => {
            const x1 = cx + R_WELL * Math.cos(toRad(deg));
            const y1 = cy + R_WELL * Math.sin(toRad(deg));
            const x2 = cx + (R_MAX + 5) * Math.cos(toRad(deg));
            const y2 = cy + (R_MAX + 5) * Math.sin(toRad(deg));
            return (
              <line
                key={deg}
                x1={x1.toFixed(1)}
                y1={y1.toFixed(1)}
                x2={x2.toFixed(1)}
                y2={y2.toFixed(1)}
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}

          {/* Pozo Central (The Well) */}
          <circle cx={cx} cy={cy} r={R_WELL} fill="#020617" stroke="#22c55e" strokeWidth="3" />
          <text
            x={cx}
            y={cy + 7}
            textAnchor="middle"
            fill="#22c55e"
            fontSize="18"
            fontWeight="900"
            letterSpacing="2"
          >
            POZO
          </text>
        </svg>
      </div>

      {/* Marcador de los 3 Jugadores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
        {THREE_CIRCULAR_PLAYERS.map(player => {
          const info = PLAYER_INFO[player];
          const isTurn = activePlayer === player;
          return (
            <div
              key={player}
              style={{
                backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isTurn ? `2px solid ${info.colorHex}` : '1px solid #334155',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: info.colorHex }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{info.name}</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: info.colorHex }}>
                {game.scores[player]} pts
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
