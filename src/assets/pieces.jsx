import React from 'react';

/**
 * Piezas vectoriales Staunton optimizadas para Ajedrez Junvill
 * Renderizado nítido en cualquier resolución.
 */

export const PLAYER_PIECE_COLORS = {
  white: { fill: '#ffffff', stroke: '#1a1a1a', detail: '#555555', bg: '#ffffff', text: '#0f172a', name: 'Blanco' },
  black: { fill: '#262421', stroke: '#f8fafc', detail: '#cbd5e1', bg: '#1e293b', text: '#ffffff', name: 'Negro' },
  red: { fill: '#ef4444', stroke: '#7f1d1d', detail: '#fee2e2', bg: '#ef4444', text: '#ffffff', name: 'Rojo' },
  blue: { fill: '#3b82f6', stroke: '#1e3a8a', detail: '#dbeafe', bg: '#3b82f6', text: '#ffffff', name: 'Azul' },
  yellow: { fill: '#f59e0b', stroke: '#78350f', detail: '#fef3c7', bg: '#f59e0b', text: '#ffffff', name: 'Amarillo' },
  green: { fill: '#10b981', stroke: '#064e3b', detail: '#d1fae5', bg: '#10b981', text: '#ffffff', name: 'Verde' },
  frozen: { fill: '#64748b', stroke: '#334155', detail: '#94a3b8', bg: '#64748b', text: '#ffffff', name: 'Congelado' }
};

export const PieceIcon = ({ piece, color = 'w', className = "chess-piece" }) => {
  let theme = PLAYER_PIECE_COLORS.white;

  if (typeof color === 'string') {
    const c = color.toLowerCase();
    if (c === 'w' || c === 'white') theme = PLAYER_PIECE_COLORS.white;
    else if (c === 'b' || c === 'black') theme = PLAYER_PIECE_COLORS.black;
    else if (c === 'r' || c === 'red') theme = PLAYER_PIECE_COLORS.red;
    else if (c === 'u' || c === 'blue') theme = PLAYER_PIECE_COLORS.blue;
    else if (c === 'y' || c === 'yellow' || c === 'gold') theme = PLAYER_PIECE_COLORS.yellow;
    else if (c === 'g' || c === 'green') theme = PLAYER_PIECE_COLORS.green;
    else if (c === 'frozen' || c === 'gray' || c === 'neutral') theme = PLAYER_PIECE_COLORS.frozen;
    else if (c.startsWith('#')) {
      theme = { fill: c, stroke: '#1a1a1a', detail: '#ffffff' };
    }
  }

  const fillColor = theme.fill;
  const strokeColor = theme.stroke;
  const detailColor = theme.detail;

  const type = (piece || '').toLowerCase();

  switch (type) {
    case 'p': // Peón
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 L 34,39.5 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'r': // Torre
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 z" />
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 z" />
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 z" />
            <path d="M 34,14 L 31,17 L 14,17 L 11,14 z" />
            <path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17 z" />
            <path d="M 14,29.5 L 11,32 L 34,32 L 31,29.5 z" />
            <path d="M 14,16.5 L 31,16.5" stroke={detailColor} strokeWidth="1" />
          </g>
        </svg>
      );

    case 'n': // Caballo
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10 z" />
            <circle cx="15" cy="14" r="1.5" fill={detailColor} />
          </g>
        </svg>
      );

    case 'b': // Alfil
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 z" />
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,26 27.5,23 C 25,20 22.5,12 22.5,12 C 22.5,12 20,20 17.5,23 C 15,26 14.5,30.5 15,32 z" />
            <circle cx="22.5" cy="9" r="2.5" />
            <path d="M 17.5,26 L 27.5,26 M 22.5,21 L 22.5,30" stroke={detailColor} strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 'q': // Dama
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14,11 L 14,25 L 7,14 L 9,26 z" />
            <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 L 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="14" cy="9" r="2" />
            <circle cx="22.5" cy="8" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="39" cy="12" r="2" />
          </g>
        </svg>
      );

    case 'k': // Rey
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22.5,11.5 L 22.5,4.5 M 19,8 L 26,8" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
            <path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 36.5,35 34.5,29 34.5,29 C 31.5,27 30,23 30,23 C 27,24 25.5,24 22.5,24 C 19.5,24 18,24 15,23 C 15,23 13.5,27 10.5,29 C 10.5,29 8.5,35 11.5,37 z" />
            <circle cx="22.5" cy="30" r="2.5" fill={detailColor} />
          </g>
        </svg>
      );

    case 'boat':
    case 's': // Barco / Ratha (Chaturaji)
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Casco del barco */}
            <path d="M 7,27 C 10,36 35,36 38,27 L 33,23 L 12,23 Z" />
            {/* Mástil */}
            <line x1="22.5" y1="8" x2="22.5" y2="23" strokeWidth="2" stroke={strokeColor} />
            {/* Vela principal */}
            <path d="M 22.5,9 C 30,12 28,20 22.5,21 Z" fill={detailColor} />
            {/* Banderín */}
            <polygon points="22.5,8 18,10 22.5,12" fill={strokeColor} />
            {/* Base/ondas */}
            <path d="M 10,38 Q 16,35 22.5,38 Q 29,41 35,38" fill="none" stroke={detailColor} strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'elephant':
    case 'e': // Elefante / Gaja (Chaturaji)
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Cuerpo del elefante */}
            <path d="M 11,38 L 11,26 C 11,18 16,14 26,14 C 33,14 36,17 38,23 C 39,26 39,32 37,34 C 35,36 33,33 33,30 C 33,26 34,22 32,20 C 30,18 28,19 28,24 L 28,38 L 24,38 L 24,28 L 18,28 L 18,38 Z" />
            {/* Colmillo */}
            <path d="M 33,27 Q 38,28 39,24" fill="none" stroke={detailColor} strokeWidth="2" />
            {/* Ojo */}
            <circle cx="28" cy="18" r="1.5" fill={detailColor} />
            {/* Corona / Torreón sobre el elefante */}
            <path d="M 18,14 L 18,9 L 26,9 L 26,14 Z" fill={detailColor} />
          </g>
        </svg>
      );

    default:
      return null;
  }
};

