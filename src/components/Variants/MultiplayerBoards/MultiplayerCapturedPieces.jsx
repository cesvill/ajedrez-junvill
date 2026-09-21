import React from 'react';

const SYMBOLS = {
  k: '♔',
  q: '♕',
  r: '♖',
  e: '♖', // Elefante védico
  b: '♗',
  s: '⛵', // Barco de Chaturaji
  n: '♘',
  p: '♙'
};

const COLOR_MAP = {
  white: '#f8fafc',
  black: '#94a3b8',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#facc15',
  blue: '#38bdf8'
};

export const MultiplayerCapturedPieces = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div 
      className="multiplayer-captured-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        flexWrap: 'wrap',
        marginTop: '2px'
      }}
    >
      {items.map((item, idx) => {
        const symbol = SYMBOLS[item.type] || '♟';
        const color = COLOR_MAP[item.owner] || '#cbd5e1';
        return (
          <span
            key={`${item.type}_${item.owner}_${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '13px',
              color,
              lineHeight: 1,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
            }}
            title={`Capturada: ${item.type.toUpperCase()} de ${item.owner}`}
          >
            {symbol}
            {item.count > 1 && (
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#fde047', marginLeft: '1px' }}>
                {item.count}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};
