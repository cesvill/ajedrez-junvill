import React, { useState, useMemo } from 'react';
import { PieceIcon, PLAYER_PIECE_COLORS } from '../../../assets/pieces';
import { FourPlayerGame, FOUR_PLAYERS } from '../../../engine/multiplayerChessEngine';
import { Crown, Shield, Zap } from 'lucide-react';

const PLAYER_META = {
  red: { name: 'Rojo (Sur)', colorHex: '#ef4444' },
  blue: { name: 'Azul (Oeste)', colorHex: '#3b82f6' },
  yellow: { name: 'Amarillo (Norte)', colorHex: '#f59e0b' },
  green: { name: 'Verde (Este)', colorHex: '#10b981' }
};

export const FourPlayerBoard = ({
  game,
  onMove,
  isBotTurn = false
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const activePlayer = game.activePlayer;
  const activeMeta = PLAYER_META[activePlayer];

  const legalMoves = useMemo(() => {
    if (!selectedCell) return [];
    return game.getLegalMovesForPiece(selectedCell.x, selectedCell.y);
  }, [selectedCell, game]);

  const handleCellClick = (x, y) => {
    if (isBotTurn || game.winner || FourPlayerGame.isOutOfBounds(x, y)) return;

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

    const piece = game.board[y]?.[x];
    if (piece && piece.owner === activePlayer) {
      const moves = game.getLegalMovesForPiece(x, y);
      if (moves.length > 0) {
        setSelectedCell({ x, y });
      }
    } else {
      setSelectedCell(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      
      {/* HUD del Jugador Activo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 18px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: `2px solid ${activeMeta?.colorHex || '#3b82f6'}`,
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

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: activeMeta?.colorHex, backgroundColor: 'rgba(15,23,42,0.6)', padding: '6px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
            {game.scores[activePlayer]} Puntos
          </span>
        </div>
      </div>

      {/* Tablero 14x14 en Cruz */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(14, 1fr)',
        gridTemplateRows: 'repeat(14, 1fr)',
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#0a0f1d',
        borderRadius: '16px',
        padding: '8px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        border: '3px solid #1e293b'
      }}>
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

            let cellBg = isLight ? '#f1f5f9' : '#64748b';
            if (isSelected) cellBg = '#60a5fa';
            if (isLegal) cellBg = piece ? '#f87171' : (isLight ? '#86efac' : '#4ade80');

            return (
              <div
                key={`${x}_${y}`}
                onClick={() => handleCellClick(x, y)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cellBg,
                  cursor: (piece?.owner === activePlayer || isLegal) ? 'pointer' : 'default',
                  userSelect: 'none',
                  border: '0.5px solid rgba(0,0,0,0.08)'
                }}
              >
                {/* Indicador de jugada legal */}
                {isLegal && !piece && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#15803d',
                    boxShadow: '0 0 6px #15803d'
                  }} />
                )}

                {/* Pieza */}
                {piece && (
                  <div style={{
                    width: '88%',
                    height: '88%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: piece.owner === 'frozen' ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
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

      {/* Marcador de los 4 Jugadores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        width: '100%'
      }}>
        {FOUR_PLAYERS.map(player => {
          const meta = PLAYER_META[player];
          const isEliminated = game.eliminated.has(player);
          const isTurn = activePlayer === player;

          return (
            <div
              key={player}
              style={{
                backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isTurn ? `2px solid ${meta.colorHex}` : '1px solid #334155',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                opacity: isEliminated ? 0.45 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: meta.colorHex
                }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                  {meta.name.split(' ')[0]}
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: meta.colorHex }}>
                {isEliminated ? 'ELIMINADO' : `${game.scores[player]} pts`}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
