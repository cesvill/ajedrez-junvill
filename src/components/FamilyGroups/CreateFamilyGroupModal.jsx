import React, { useState } from 'react';
import { useUser, MAX_FAMILY_GROUPS } from '../../context/UserContext';
import { X, Users, Lock, Eye, EyeOff, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';

const EMBLEMS = ['👑', '🦁', '🦅', '🛡️', '🚀', '⚡', '🌟', '🏆', '🐺', '🐉', '🏰', '🦄'];
const THEME_COLORS = [
  { id: 'gold', name: 'Dorado Real', hex: '#ca8a04' },
  { id: 'emerald', name: 'Esmeralda', hex: '#059669' },
  { id: 'sapphire', name: 'Zafiro', hex: '#2563eb' },
  { id: 'ruby', name: 'Rubí', hex: '#dc2626' },
  { id: 'amethyst', name: 'Amatista', hex: '#9333ea' },
  { id: 'amber', name: 'Ámbar', hex: '#d97706' }
];

export const CreateFamilyGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const { groups, createFamilyGroup } = useUser();
  const [groupName, setGroupName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedEmblem, setSelectedEmblem] = useState('🛡️');
  const [selectedColor, setSelectedColor] = useState('#ca8a04');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const isAtLimit = groups.length >= MAX_FAMILY_GROUPS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAtLimit) {
      setErrorMsg(`Límite máximo de ${MAX_FAMILY_GROUPS} grupos alcanzado en este entorno.`);
      return;
    }

    if (!groupName.trim()) {
      setErrorMsg('Por favor ingresa un nombre para el grupo familiar.');
      return;
    }

    if (!groupPassword.trim() || groupPassword.trim().length < 4) {
      setErrorMsg('La contraseña del grupo debe tener al menos 4 caracteres.');
      return;
    }

    const res = createFamilyGroup(
      groupName.trim(),
      groupPassword.trim(),
      adminName.trim() || 'Tutor Familiar',
      selectedEmblem,
      selectedColor
    );

    if (res.success) {
      setGroupName('');
      setAdminName('');
      setGroupPassword('');
      setErrorMsg('');
      if (onSuccess) onSuccess(res.group);
      onClose();
    } else {
      setErrorMsg(res.error || 'Error al crear el grupo.');
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120, padding: '12px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '24px',
          background: '#0f172a',
          border: `2px solid ${selectedColor}`,
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
          color: '#f8fafc'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{selectedEmblem}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0, fontWeight: '900', color: '#f8fafc' }}>
                Crear Nuevo Grupo Familiar
              </h2>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Capacidad del servidor: {groups.length} de {MAX_FAMILY_GROUPS} grupos ocupados
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {isAtLimit ? (
          <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1.5px solid #ef4444', borderRadius: '12px', textAlign: 'center' }}>
            <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ margin: '0 0 6px', color: '#ef4444', fontSize: '1.05rem', fontWeight: '900' }}>
              Límite de Capacidad Alcanzado ({MAX_FAMILY_GROUPS}/{MAX_FAMILY_GROUPS})
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#fca5a5', margin: 0 }}>
              Para mantener el servidor gratuito 100% rápido y fluido, se permite un máximo de {MAX_FAMILY_GROUPS} grupos familiares.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nombre del Grupo */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'block', marginBottom: '4px', color: '#e2e8f0' }}>
                Nombre del Grupo o Familia:
              </label>
              <input
                type="text"
                placeholder="Ej. Familia Villamil, Club San Mateo, Los Campeones..."
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: '#0a0f1d',
                  color: '#f8fafc',
                  fontSize: '0.94rem',
                  fontWeight: '700',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Nombre del Administrador */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'block', marginBottom: '4px', color: '#e2e8f0' }}>
                Nombre del Tutor / Administrador:
              </label>
              <input
                type="text"
                placeholder="Ej. Papá, Mamá, Profesor Andrés..."
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: '#0a0f1d',
                  color: '#f8fafc',
                  fontSize: '0.94rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Contraseña Secreta del Grupo */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#facc15' }}>
                <Lock size={14} />
                <span>Contraseña Secreta del Grupo (para ingresar):</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Define una contraseña para tu grupo (mín. 4 caracteres)"
                  value={groupPassword}
                  onChange={(e) => {
                    setGroupPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-gold, #ca8a04)',
                    background: '#0a0f1d',
                    color: '#f8fafc',
                    fontSize: '0.94rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Selector de Emblema */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'block', marginBottom: '6px', color: '#e2e8f0' }}>
                Elige el Escudo de tu Familia:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                {EMBLEMS.map(emb => {
                  const isSel = selectedEmblem === emb;
                  return (
                    <button
                      key={emb}
                      type="button"
                      onClick={() => setSelectedEmblem(emb)}
                      style={{
                        background: isSel ? 'rgba(245, 158, 11, 0.25)' : '#0a0f1d',
                        border: `2px solid ${isSel ? selectedColor : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '8px',
                        padding: '6px',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        transform: isSel ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {emb}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Color */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'block', marginBottom: '6px', color: '#e2e8f0' }}>
                Color del Estandarte:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {THEME_COLORS.map(c => {
                  const isSel = selectedColor === c.hex;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      style={{
                        background: c.hex,
                        border: `2px solid ${isSel ? '#ffffff' : 'transparent'}`,
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        cursor: 'pointer',
                        boxShadow: isSel ? `0 0 10px ${c.hex}` : 'none'
                      }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gold"
                style={{ flex: 2, padding: '11px', justifyContent: 'center', fontSize: '0.90rem', fontWeight: '900' }}
              >
                <Check size={16} />
                <span>Crear Grupo y Entrar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
