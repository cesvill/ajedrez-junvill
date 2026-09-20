import React, { useState } from 'react';
import { P2PEngine } from '../../engine/p2pEngine';
import { X, Users, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';

export const JoinPartyRoomModal = ({ isOpen, onClose, onJoin }) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = P2PEngine.cleanRoomId(roomIdInput);
    if (!clean || clean.length < 3) {
      setErrorMsg('Por favor ingresa un código de sala válido (ej. JUN8K2).');
      return;
    }
    setErrorMsg('');
    onJoin(clean);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 110, padding: '16px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#0f172a',
          border: '2px solid #38bdf8',
          borderRadius: '20px',
          padding: '24px',
          color: '#f8fafc',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <KeyRound size={22} style={{ color: '#38bdf8' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
              Unirse a Sala Multijugador
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
              Código de la Sala:
            </label>
            <input
              type="text"
              autoFocus
              placeholder="Ej. JUN8K2"
              value={roomIdInput}
              onChange={(e) => {
                setRoomIdInput(e.target.value.toUpperCase());
                if (errorMsg) setErrorMsg('');
              }}
              maxLength={10}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#1e293b',
                border: errorMsg ? '2px solid #ef4444' : '2px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '20px',
                fontWeight: 900,
                textAlign: 'center',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}
            <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0 0', textAlign: 'center' }}>
              Pide el código de 6 caracteres al anfitrión que creó la sala.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                backgroundColor: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span>Entrar a la Sala</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
