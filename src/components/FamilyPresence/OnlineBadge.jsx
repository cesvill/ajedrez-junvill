import React from 'react';

export const OnlineBadge = ({ isOnline = false, showLabel = true, size = 'md' }) => {
  const dotSize = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const fontSize = size === 'sm' ? '0.70rem' : size === 'lg' ? '0.82rem' : '0.74rem';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.10)',
      border: `1px solid ${isOnline ? '#10b981' : 'rgba(148, 163, 184, 0.25)'}`,
      padding: '2px 8px',
      borderRadius: '999px',
      color: isOnline ? '#34d399' : '#94a3b8',
      fontSize,
      fontWeight: '800',
      userSelect: 'none'
    }}>
      <span style={{
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: '50%',
        background: isOnline ? '#10b981' : '#64748b',
        display: 'inline-block',
        boxShadow: isOnline ? '0 0 8px #10b981' : 'none',
        animation: isOnline ? 'pulse 1.8s infinite' : 'none'
      }} />
      {showLabel && (
        <span>{isOnline ? 'En línea' : 'Desconectado'}</span>
      )}
    </div>
  );
};
