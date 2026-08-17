import React from 'react';

export const EvaluationBar = ({ evalCp = 0, isBlackTurn = false }) => {
  // Convertir centipeones a porcentaje (de 5% a 95%)
  let whitePercent = 50;
  if (evalCp >= 10000) {
    whitePercent = 100;
  } else if (evalCp <= -10000) {
    whitePercent = 0;
  } else {
    whitePercent = 50 + (evalCp / 20);
    whitePercent = Math.min(95, Math.max(5, whitePercent));
  }

  const evalFormatted = evalCp >= 10000 ? 'M' : evalCp <= -10000 ? '-M' : (evalCp >= 0 ? `+${(evalCp / 100).toFixed(1)}` : `${(evalCp / 100).toFixed(1)}`);

  return (
    <div style={{
      width: '26px',
      height: '100%',
      minHeight: '380px',
      background: '#1e293b', // Negro arriba
      borderRadius: '6px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
      border: '1.5px solid var(--bg-parchment-border)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }}>
      {/* Barra Blanca abajo */}
      <div style={{
        width: '100%',
        height: `${whitePercent}%`,
        background: '#ffffff',
        transition: 'height 0.3s ease',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.2)'
      }} />

      {/* Texto de Evaluación */}
      <div style={{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        bottom: evalCp >= 0 ? '8px' : 'auto',
        top: evalCp < 0 ? '8px' : 'auto',
        fontSize: '0.68rem',
        fontWeight: '900',
        fontFamily: 'var(--font-mono)',
        color: evalCp >= 0 ? '#1e293b' : '#ffffff',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {evalFormatted}
      </div>
    </div>
  );
};
