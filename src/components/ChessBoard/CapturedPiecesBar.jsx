import React from 'react';
import { PIECE_SYMBOLS } from '../../engine/capturedPieces';

export const CapturedPiecesBar = ({ capturedList = [], advantage = 0, color = 'w' }) => {
  if ((!capturedList || capturedList.length === 0) && !advantage) {
    return (
      <div style={{ height: '18px', display: 'flex', alignItems: 'center', fontSize: '0.70rem', color: '#64748b', fontStyle: 'italic' }}>
        Sin capturas
      </div>
    );
  }

  // color indica el bando de las piezas que se muestran (las que fueron capturadas)
  const symbols = PIECE_SYMBOLS[color] || PIECE_SYMBOLS.w;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(0, 0, 0, 0.25)',
      padding: '2px 6px',
      borderRadius: '4px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      minHeight: '20px',
      flexWrap: 'wrap'
    }}>
      {capturedList.map((item) => (
        <span
          key={item.type}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.88rem',
            color: color === 'w' ? '#f8fafc' : '#94a3b8',
            lineHeight: 1,
            fontWeight: 'bold'
          }}
          title={`Pieza capturada: ${item.type.toUpperCase()} x${item.count}`}
        >
          {symbols[item.type]}
          {item.count > 1 && (
            <span style={{ fontSize: '0.65rem', marginLeft: '1px', color: '#fbbf24', fontWeight: '900' }}>
              {item.count}
            </span>
          )}
        </span>
      ))}

      {advantage > 0 && (
        <span style={{
          fontSize: '0.70rem',
          fontWeight: '900',
          color: '#fbbf24',
          background: 'rgba(251, 191, 36, 0.15)',
          padding: '1px 4px',
          borderRadius: '3px',
          marginLeft: '4px'
        }}>
          +{advantage}
        </span>
      )}
    </div>
  );
};
