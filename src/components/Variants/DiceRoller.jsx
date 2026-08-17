import React, { useState } from 'react';
import { PieceIcon } from '../../assets/pieces';
import { audioManager } from '../../engine/audio';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';

const PIECE_DICE_FACES = [
  { type: 'p', label: 'Peón', symbol: '♙', color: '#10b981' },
  { type: 'n', label: 'Caballo', symbol: '♘', color: '#3b82f6' },
  { type: 'b', label: 'Alfil', symbol: '♗', color: '#8b5cf6' },
  { type: 'r', label: 'Torre', symbol: '♖', color: '#f59e0b' },
  { type: 'q', label: 'Dama', symbol: '♕', color: '#ec4899' },
  { type: 'k', label: 'Rey / Comodín', symbol: '♔', color: '#eab308' }
];

export const DiceRoller = ({ 
  currentRoll = null, 
  onRoll, 
  isRolling = false, 
  turn = 'w', 
  hasLegalMovesForRoll = true,
  onPassTurn = null
}) => {
  const currentFace = PIECE_DICE_FACES.find(f => f.type === currentRoll) || PIECE_DICE_FACES[0];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
      border: '2px solid var(--color-gold)',
      borderRadius: 'var(--radius-md, 12px)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '10px',
          background: isRolling ? '#eab308' : (currentRoll ? currentFace.color : 'rgba(255, 255, 255, 0.1)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          color: '#ffffff',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.3)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isRolling ? 'rotate(360deg) scale(1.15)' : 'none'
        }}>
          {isRolling ? '🎲' : (currentRoll ? currentFace.symbol : '🎲')}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-gold-dark)', fontWeight: '900' }}>
              DADO MÁGICO
            </span>
            {currentRoll && (
              <span style={{ fontSize: '0.70rem', background: currentFace.color, color: 'white', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                Solo {currentFace.label}
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-parchment-main)', margin: '2px 0 0' }}>
            {isRolling 
              ? '¡Lanzando el dado...' 
              : currentRoll 
                ? `Debes mover: ${currentFace.label} (${currentFace.symbol})` 
                : 'Lanza el dado para tu turno'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!hasLegalMovesForRoll && currentRoll && onPassTurn && (
          <button
            onClick={onPassTurn}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px', color: '#ef4444' }}
            title="No tienes movimientos legales con esta pieza"
          >
            <AlertCircle size={14} />
            <span>Pasar Turno</span>
          </button>
        )}

        <button
          onClick={onRoll}
          disabled={isRolling}
          className="btn-gold"
          style={{
            padding: '8px 14px',
            fontSize: '0.82rem',
            fontWeight: '900',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Dices size={16} />
          <span>{currentRoll ? 'Relanzar' : 'Lanzar Dado'}</span>
        </button>
      </div>
    </div>
  );
};
