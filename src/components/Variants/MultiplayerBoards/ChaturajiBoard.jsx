import React, { useState, useMemo } from 'react';
import { PieceIcon, PLAYER_PIECE_COLORS } from '../../../assets/pieces';
import { CHATURAJI_CONFIG, CHATURAJI_PLAYERS } from '../../../engine/multiplayerChessEngine';
import { Dices, Crown, SkipForward, Sparkles } from 'lucide-react';

export const ChaturajiBoard = ({
  game,
  onMove,
  onPass,
  isBotTurn = false
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const activePlayer = game.activePlayer;
  const currentDice = game.currentDice;
  const activeCfg = CHATURAJI_CONFIG[activePlayer];

  // Movimientos legales de la pieza seleccionada
  const legalMoves = useMemo(() => {
    if (!selectedCell) return [];
    return game.getLegalMovesForPiece(selectedCell.x, selectedCell.y);
  }, [selectedCell, game]);

  // Casillas trono
  const isThrone = (x, y) => {
    return (x === 0 && y === 0) || (x === 0 && y === 7) || (x === 7 && y === 7) || (x === 7 && y === 0);
  };

  const handleCellClick = (x, y) => {
    if (isBotTurn || game.winner) return;

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

  // Pieza habilitada por el dado
  const getDicePieceName = (dice) => {
    switch (dice) {
      case 2: return { name: 'Barco (Ratha)', icon: 's', desc: 'Salta 2 casillas en diagonal' };
      case 3: return { name: 'Caballo (Ashva)', icon: 'n', desc: 'Salto en L tradicional' };
      case 4: return { name: 'Elefante (Gaja)', icon: 'e', desc: 'Deslizamiento como Torre' };
      case 5: return { name: 'Rey o Peón', icon: 'k', desc: '1 casilla en cualquier dirección o avance de peón' };
      default: return { name: 'Lanzando...', icon: 'p', desc: '' };
    }
  };

  const diceInfo = getDicePieceName(currentDice);
  const activeMovesCount = game.getAllLegalMovesForActivePlayer().length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      
      {/* Panel del Dado y Turno Activo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 18px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: `2px solid ${activeCfg?.colorHex || '#3b82f6'}`,
        boxShadow: `0 8px 24px ${activeCfg?.colorHex || '#3b82f6'}26`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: activeCfg?.colorHex || '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            {activeCfg?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Turno Jugador
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
              Bando {activeCfg?.name}
            </div>
          </div>
        </div>

        {/* Dado Védico (Pasha) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '8px 14px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#f59e0b',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '20px',
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)'
          }}>
            {currentDice || '?'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Dices size={16} /> {diceInfo.name}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {diceInfo.desc}
            </span>
          </div>
        </div>

        {/* Botón de Pasar Turno si no hay movimientos */}
        {activeMovesCount === 0 && !game.winner && (
          <button
            onClick={onPass}
            disabled={isBotTurn}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isBotTurn ? 'not-allowed' : 'pointer'
            }}
          >
            <SkipForward size={16} /> Pasar Turno
          </button>
        )}
      </div>

      {/* Tablero 8x8 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '6px solid #1e293b',
        boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
      }}>
        {Array(8).fill(null).map((_, y) => 
          Array(8).fill(null).map((_, x) => {
            const piece = game.board[y][x];
            const isLight = (x + y) % 2 === 0;
            const throne = isThrone(x, y);
            const isSelected = selectedCell?.x === x && selectedCell?.y === y;
            const isLegal = legalMoves.some(m => m.to.nx === x && m.to.ny === y);

            let cellBg = isLight ? '#f1f5f9' : '#94a3b8';
            if (throne) cellBg = isLight ? '#fef08a' : '#eab308';
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
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Corona de Trono Védico */}
                {throne && !piece && (
                  <Crown
                    size={24}
                    style={{
                      position: 'absolute',
                      color: '#b45309',
                      opacity: 0.65
                    }}
                  />
                )}

                {/* Marcador de movimiento legal */}
                {isLegal && !piece && (
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#15803d',
                    boxShadow: '0 0 8px #15803d'
                  }} />
                )}

                {/* Pieza */}
                {piece && (
                  <div style={{
                    width: '82%',
                    height: '82%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    filter: piece.owner === 'frozen' ? 'grayscale(100%) opacity(0.55)' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))'
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

      {/* Marcador de Puntuación de los 4 Bandos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        width: '100%'
      }}>
        {CHATURAJI_PLAYERS.map(player => {
          const cfg = CHATURAJI_CONFIG[player];
          const isEliminated = game.eliminated.has(player);
          const isTurn = activePlayer === player;

          return (
            <div
              key={player}
              style={{
                backgroundColor: isTurn ? 'rgba(30, 41, 59, 0.95)' : '#0f172a',
                border: isTurn ? `2px solid ${cfg.colorHex}` : '1px solid #334155',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isEliminated ? 0.45 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: cfg.colorHex
                }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                  {cfg.name}
                </span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: cfg.colorHex }}>
                {isEliminated ? 'ELIM' : `${game.scores[player]} pts`}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
