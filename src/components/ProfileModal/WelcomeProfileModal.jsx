import React, { useState } from 'react';
import { useUser, DEFAULT_GENERIC_PASSWORD } from '../../context/UserContext';
import { AvatarIcon, AVATAR_LIST } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { Sparkles, UserPlus, Check, User, GraduationCap, Shield, Swords, ArrowRight, Lock, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';

export const WelcomeProfileModal = ({ isOpen, onClose, onOpenAvatarBuilder, roomToJoin = null }) => {
  const { users, currentUser, setActiveUserId, createUser, verifyPassword } = useUser();
  const [isCreatingNew, setIsCreatingNew] = useState(users.length === 0);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserPassword, setNewUserPassword] = useState(DEFAULT_GENERIC_PASSWORD);
  const [selectedAvatar, setSelectedAvatar] = useState('teen_gamer');

  // Estado para autenticación de usuario existente seleccionado
  const [authTargetUser, setAuthTargetUser] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleSelectUserCard = (user) => {
    setAuthTargetUser(user);
    setEnteredPassword('');
    setAuthError('');
    setShowPassword(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authTargetUser) return;

    const isValid = verifyPassword(authTargetUser.id, enteredPassword);
    if (isValid) {
      setActiveUserId(authTargetUser.id);
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      setAuthTargetUser(null);
      onClose();
    } else {
      setAuthError('Contraseña incorrecta. Por favor inténtalo de nuevo.');
    }
  };

  const handleCreateAndStart = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      const pwd = newUserPassword.trim() || DEFAULT_GENERIC_PASSWORD;
      const newUser = createUser(newUserName.trim(), selectedAvatar, newUserRole, null, pwd);
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      if (newUser && newUser.id) {
        setActiveUserId(newUser.id);
      }
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 110, padding: '12px' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '24px',
          background: 'var(--bg-parchment-card, #0f172a)',
          border: '2px solid var(--color-gold, #ca8a04)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
          color: 'var(--text-parchment-main, #f8fafc)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de Bienvenida */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(234, 179, 8, 0.15)',
            color: 'var(--color-gold, #facc15)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.80rem',
            fontWeight: '900',
            marginBottom: '8px',
            border: '1px solid rgba(234, 179, 8, 0.3)'
          }}>
            <Sparkles size={15} />
            <span>¡BIENVENIDO A AJEDREZ JUNVILL!</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--text-parchment-main, #f8fafc)', margin: '4px 0 6px', fontWeight: '900' }}>
            {authTargetUser 
              ? `Ingreso Seguro: ${authTargetUser.name}` 
              : roomToJoin 
              ? '¿Quién jugará esta partida?' 
              : '¿Quién está jugando hoy?'}
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted, #94a3b8)', margin: 0 }}>
            {authTargetUser 
              ? 'Ingresa tu contraseña para acceder a tu perfil y progreso guardado.'
              : roomToJoin 
              ? `Estás a punto de unirte a la sala multijugador ${roomToJoin}. Elige tu perfil:`
              : 'Selecciona tu perfil de jugador o crea uno nuevo para continuar.'}
          </p>
        </div>

        {/* 1. PANTALLA DE INGRESO DE CONTRASEÑA PARA EL USUARIO SELECCIONADO */}
        {authTargetUser && (
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                {authTargetUser.avatarConfig ? (
                  <DynamicAvatar config={authTargetUser.avatarConfig} size={48} />
                ) : (
                  <AvatarIcon avatarId={authTargetUser.avatar || 'teen_gamer'} size={48} />
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-parchment-main)' }}>
                  {authTargetUser.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)' }}>
                  {authTargetUser.title || 'Aprendiz'} • {authTargetUser.elo || 600} Elo
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#facc15' }}>
                <Lock size={15} />
                <span>Contraseña de Acceso:</span>
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña (por defecto: JunV1ll123)"
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '10px',
                    border: authError ? '1.5px solid #ef4444' : '1.5px solid var(--color-gold)',
                    background: '#0a0f1d',
                    color: '#f8fafc',
                    fontSize: '1rem',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {authError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '0.80rem', marginTop: '6px', fontWeight: '700' }}>
                  <AlertCircle size={14} />
                  <span>{authError}</span>
                </div>
              )}

              <div style={{
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                marginTop: '10px',
                fontSize: '0.75rem',
                color: '#fde047',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <KeyRound size={14} />
                <span>💡 <b>Contraseña genérica inicial:</b> <code>JunV1ll123</code></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAuthTargetUser(null)}
                style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                <span>⬅️ Volver</span>
              </button>

              <button
                type="submit"
                className="btn-gold"
                style={{ flex: 2, padding: '11px', justifyContent: 'center', fontSize: '0.92rem', fontWeight: '900' }}
              >
                <span>Entrar a Jugar 🚀</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. LISTA DE PERFILES EXISTENTES */}
        {!authTargetUser && !isCreatingNew && users.length > 0 && (
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
              Selecciona tu perfil para ingresar:
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '2px'
            }}>
              {users.map(u => {
                const isCurrent = u.id === currentUser?.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUserCard(u)}
                    style={{
                      background: isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `2px solid ${isCurrent ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: 'var(--radius-md, 12px)',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: isCurrent ? '0 0 14px rgba(245, 158, 11, 0.3)' : 'none',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                      {u.avatarConfig ? (
                        <DynamicAvatar config={u.avatarConfig} size={52} />
                      ) : (
                        <AvatarIcon avatarId={u.avatar || 'teen_gamer'} size={52} />
                      )}
                    </div>

                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.90rem', color: 'var(--text-parchment-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                        {u.title || 'Aprendiz'} • {u.elo || 600} Elo
                      </div>
                    </div>

                    <div style={{
                      marginTop: '4px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      color: 'var(--color-gold, #facc15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Lock size={12} />
                      <span>Ingresar con Clave</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsCreatingNew(true)}
                style={{ padding: '10px 20px', fontSize: '0.86rem', gap: '8px' }}
              >
                <UserPlus size={16} />
                <span>+ Crear un Nuevo Perfil de Jugador</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. FORMULARIO PARA CREAR NUEVO PERFIL */}
        {!authTargetUser && isCreatingNew && (
          <form onSubmit={handleCreateAndStart}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                  Tu Nombre o Apodo:
                </label>
                <input
                  type="text"
                  placeholder="Ej: César, Sofía, Campeón..."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-gold)',
                    background: '#0a0f1d',
                    color: '#f8fafc',
                    fontSize: '0.96rem',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Contraseña Inicial */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                  Contraseña de Acceso (por defecto: JunV1ll123):
                </label>
                <input
                  type="text"
                  placeholder="JunV1ll123"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-gold)',
                    background: '#0a0f1d',
                    color: '#f8fafc',
                    fontSize: '0.96rem',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Selector de Avatar */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                  Elige tu Avatar:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(54px, 1fr))',
                  gap: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  background: '#0a0f1d',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {AVATAR_LIST.map(av => {
                    const isSel = selectedAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        style={{
                          background: isSel ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                          border: `2px solid ${isSel ? 'var(--color-gold)' : 'transparent'}`,
                          borderRadius: '50%',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AvatarIcon avatarId={av.id} size={42} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Rol */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                  Rol en la Plataforma:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'student', label: 'Estudiante', icon: User },
                    { id: 'coach', label: 'Profesor', icon: GraduationCap },
                    { id: 'parent', label: 'Tutor', icon: Shield }
                  ].map(r => {
                    const isSel = newUserRole === r.id;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setNewUserRole(r.id)}
                        style={{
                          background: isSel ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1.5px solid ${isSel ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '8px',
                          padding: '8px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          color: isSel ? 'var(--color-gold)' : 'var(--text-parchment-muted)',
                          fontSize: '0.78rem',
                          fontWeight: '800'
                        }}
                      >
                        <Icon size={16} />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {users.length > 0 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsCreatingNew(false)}
                    style={{ flex: 1, padding: '11px', justifyContent: 'center' }}
                  >
                    <span>Cancelar</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ flex: 2, padding: '11px', justifyContent: 'center', fontWeight: '900' }}
                >
                  <Check size={18} />
                  <span>Crear y Comenzar</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
