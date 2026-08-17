import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { audioManager } from '../../engine/audio';

export const TIME_CONTROLS = [
  { id: 'unlimited', label: 'Sin Tiempo (Infinito)', initialSeconds: null, increment: 0 },
  { id: '10m', label: 'Rápida (10 min)', initialSeconds: 600, increment: 0 },
  { id: '5m3s', label: 'Blitz (5 min + 3s)', initialSeconds: 300, increment: 3 },
  { id: '3m2s', label: 'Blitz Rápido (3 min + 2s)', initialSeconds: 180, increment: 2 },
  { id: '1m', label: 'Bala (1 min)', initialSeconds: 60, increment: 0 }
];

export const ChessClock = ({
  timeControl = 'unlimited',
  activeTurn = 'w', // 'w' | 'b'
  isGameRunning = true,
  onTimeout = null,
  playerColor = 'white',
  whiteName = 'Blancas',
  blackName = 'Negras'
}) => {
  const selectedConfig = TIME_CONTROLS.find(t => t.id === timeControl) || TIME_CONTROLS[0];
  
  if (selectedConfig.id === 'unlimited' || !selectedConfig.initialSeconds) {
    return null;
  }

  const [whiteTime, setWhiteTime] = useState(selectedConfig.initialSeconds);
  const [blackTime, setBlackTime] = useState(selectedConfig.initialSeconds);
  const lastTickTurnRef = useRef(activeTurn);

  // Reiniciar tiempos al cambiar configuración
  useEffect(() => {
    setWhiteTime(selectedConfig.initialSeconds);
    setBlackTime(selectedConfig.initialSeconds);
  }, [timeControl, selectedConfig.initialSeconds]);

  // Manejar incremento tras cada cambio de turno
  useEffect(() => {
    if (selectedConfig.increment > 0 && lastTickTurnRef.current !== activeTurn) {
      if (lastTickTurnRef.current === 'w') {
        setWhiteTime(prev => prev + selectedConfig.increment);
      } else {
        setBlackTime(prev => prev + selectedConfig.increment);
      }
    }
    lastTickTurnRef.current = activeTurn;
  }, [activeTurn, selectedConfig.increment]);

  // Intervalo del reloj
  useEffect(() => {
    if (!isGameRunning) return;

    const interval = setInterval(() => {
      if (activeTurn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            if (onTimeout) onTimeout('w');
            return 0;
          }
          if (prev <= 10 && prev > 1) {
            try { audioManager?.playClick?.(); } catch (e) {}
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            if (onTimeout) onTimeout('b');
            return 0;
          }
          if (prev <= 10 && prev > 1) {
            try { audioManager?.playClick?.(); } catch (e) {}
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTurn, isGameRunning, onTimeout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isWhiteLow = whiteTime <= 20;
  const isBlackLow = blackTime <= 20;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '10px',
      background: 'var(--bg-parchment-card)',
      border: '1.5px solid var(--bg-parchment-border)',
      borderRadius: 'var(--radius-md, 12px)',
      padding: '8px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      {/* Reloj Negras */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: activeTurn === 'b' ? (isBlackLow ? 'rgba(239, 68, 68, 0.25)' : 'rgba(30, 41, 59, 0.8)') : 'transparent',
        border: activeTurn === 'b' ? `2px solid ${isBlackLow ? '#ef4444' : '#38bdf8'}` : '1px solid transparent',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-parchment-muted)' }}>
          ⚫ {blackName}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '1.15rem',
          fontWeight: '900',
          color: isBlackLow ? '#ef4444' : (activeTurn === 'b' ? '#38bdf8' : 'var(--text-parchment-main)')
        }}>
          {formatTime(blackTime)}
        </div>
      </div>

      {/* Indicador Central */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: '800' }}>
        <Clock size={14} />
        <span>{selectedConfig.label}</span>
      </div>

      {/* Reloj Blancas */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: activeTurn === 'w' ? (isWhiteLow ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)') : 'transparent',
        border: activeTurn === 'w' ? `2px solid ${isWhiteLow ? '#ef4444' : '#f59e0b'}` : '1px solid transparent',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-parchment-muted)' }}>
          ⚪ {whiteName}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '1.15rem',
          fontWeight: '900',
          color: isWhiteLow ? '#ef4444' : (activeTurn === 'w' ? '#f59e0b' : 'var(--text-parchment-main)')
        }}>
          {formatTime(whiteTime)}
        </div>
      </div>
    </div>
  );
};
