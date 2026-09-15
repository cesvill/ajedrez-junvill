import React, { useState, useMemo } from 'react';
import { PieceIcon } from '../../../assets/pieces';
import { THREE_HEX_PLAYERS } from '../../../engine/multiplayerChessEngine';

const SECTOR_CONFIG = {
  A: { name: 'Blanco (Sur)', owner: 'white', baseAngle: 90, colorHex: '#f8fafc' },
  B: { name: 'Negro (Noroeste)', owner: 'black', baseAngle: 210, colorHex: '#1e293b' },
  C: { name: 'Rojo (Noreste)', owner: 'red', baseAngle: 330, colorHex: '#ef4444' }
};

const TILE_THEMES = [
  '#f1f5f9', // 0: Clara
  '#94a3b8', // 1: Oscura
  '#38bdf8'  // 2: Tricolor diferenciador (Celeste táctico)
];

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

  // Parámetros de geometría SVG
  const cx = 400;
  const cy = 400;
  const R_INNER = 35;
  const R_OUTER = 370;
  const DELTA_R = (R_OUTER - R_INNER) / 4;

  const toRad = (deg) => (deg * Math.PI) / 180;

  // Calcula el path poligonal de cada casilla
  const getCellGeometry = (sec, f, r) => {
    const base = SECTOR_CONFIG[sec].baseAngle;
    const startAngle = base - 60;
    const angleStep = 120 / 8;

    const t1 = startAngle + f * angleStep;
    const t2 = startAngle + (f + 1) * angleStep;

    const rIn = R_INNER + (3 - r) * DELTA_R;
    const rOut = R_INNER + (4 - r) * DELTA_R;

    const p1 = { x: cx + rIn * Math.cos(toRad(t1)), y: cy + rIn * Math.sin(toRad(t1)) };
    const p2 = { x: cx + rOut * Math.cos(toRad(t1)), y: cy + rOut * Math.sin(toRad(t1)) };
    const p3 = { x: cx + rOut * Math.cos(toRad(t2)), y: cy + rOut * Math.sin(toRad(t2)) };
    const p4 = { x: cx + rIn * Math.cos(toRad(t2)), y: cy + rIn * Math.sin(toRad(t2)) };

    const midR = (rIn + rOut) / 2;
    const midT = (t1 + t2) / 2;
    const center = { x: cx + midR * Math.cos(toRad(midT)), y: cy + midR * Math.sin(toRad(midT)) };

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
            backgroundColor: activePlayer === 'white' ? '#f8fafc' : activePlayer === 'red' ? '#ef4444' : '#1e293b',
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
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>TURNO (3 JUGADORES)</div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', textTransform: 'capitalize' }}>
              Ejército {activePlayer === 'white' ? 'Blanco' : activePlayer === 'black' ? 'Negro' : 'Rojo'}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 700, backgroundColor: 'rgba(15,23,42,0.6)', padding: '6px 12px', borderRadius: '10px' }}>
          Regla: Primer Mate Gana
        </div>
      </div>

      {/* Tablero SVG Trilobular (96 casillas) */}
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
          {/* Fondo central */}
          <circle cx={cx} cy={cy} r={R_OUTER + 8} fill="#0f172a" stroke="#334155" strokeWidth="3" />
          
          {/* Núcleo del nexo */}
          <circle cx={cx} cy={cy} r={R_INNER} fill="#1e293b" stroke="#475569" strokeWidth="2" />

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

                let fill = TILE_THEMES[cell.colorClass];
                if (isSelected) fill = '#60a5fa';
                else if (isLegal) fill = hasPiece ? '#f87171' : '#4ade80';

                return (
                  <g key={cellId} onClick={() => handleCellClick(cellId)} style={{ cursor: 'pointer' }}>
                    <path
                      d={pathData}
                      fill={fill}
                      stroke="#1e293b"
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
                      />
                    )}

                    {/* Render de Pieza Centrada */}
                    {hasPiece && (
                      <g transform={`translate(${center.x - 18}, ${center.y - 18}) scale(0.8)`}>
                        <PieceIcon
                          piece={cell.piece.type}
                          color={cell.piece.owner}
                          className="w-10 h-10"
                        />
                      </g>
                    )}
                  </g>
                );
              })
            )
          )}
        </svg>
      </div>

      {/* Marcador de Puntuación */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' }}>
        {THREE_HEX_PLAYERS.map(player => {
          const isTurn = activePlayer === player;
          const label = player === 'white' ? 'Blanco' : player === 'black' ? 'Negro' : 'Rojo';
          return (
            <div
              key={player}
              style={{
                backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isTurn ? '2px solid #38bdf8' : '1px solid #334155',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{label}</span>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#38bdf8' }}>{game.scores[player]} pts</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
