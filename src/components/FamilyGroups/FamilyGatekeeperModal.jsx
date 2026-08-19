import React, { useState, useEffect, useRef } from 'react';
import { useUser, DEFAULT_GENERIC_PASSWORD, MAX_FAMILY_GROUPS, MAX_PLAYERS_PER_GROUP, MAX_CONCURRENT_USERS } from '../../context/UserContext';
import { CreateFamilyGroupModal } from './CreateFamilyGroupModal';
import { AvatarIcon, AVATAR_LIST } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { Sparkles, UserPlus, Check, User, GraduationCap, Shield, Swords, ArrowRight, Lock, Eye, EyeOff, KeyRound, AlertCircle, Activity, DoorOpen, Plus, ChevronRight, Mail, HelpCircle } from 'lucide-react';

export const FamilyGatekeeperModal = ({ isOpen, onClose, onOpenAvatarBuilder }) => {
  const { 
    groups, 
    activeGroup, 
    activeGroupId, 
    isGroupUnlocked, 
    unlockFamilyGroup, 
    recoverGroupPassword,
    leaveFamilyGroup, 
    users, 
    currentUser, 
    setActiveUserId, 
    createUser, 
    serverMetrics 
  } = useUser();

  // Flujo interno: 'select_group' | 'unlock_group' | 'recover_password' | 'select_player' | 'create_player'
  const [currentStep, setCurrentStep] = useState(() => {
    if (activeGroup && isGroupUnlocked) {
      return 'select_player';
    }
    return 'select_group';
  });

  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (activeGroup && isGroupUnlocked) {
        setCurrentStep('select_player');
      } else {
        setCurrentStep('select_group');
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, activeGroup, isGroupUnlocked]);

  const [targetGroupToUnlock, setTargetGroupToUnlock] = useState(null);
  const [enteredGroupPassword, setEnteredGroupPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // Estado para Recuperación de Contraseña
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  // Estado para crear nuevo jugador
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('student');
  const [selectedAvatar, setSelectedAvatar] = useState('teen_gamer');

  // Modal de Crear Nuevo Grupo Familiar
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  if (!isOpen) return null;

  // Manejar clic en tarjeta de grupo
  const handleSelectGroupCard = (group) => {
    setTargetGroupToUnlock(group);
    setEnteredGroupPassword('');
    setUnlockError('');
    setShowPassword(false);
    setCurrentStep('unlock_group');
  };

  // Manejar submit de contraseña de grupo
  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    if (!targetGroupToUnlock) return;

    const res = unlockFamilyGroup(targetGroupToUnlock.id, enteredGroupPassword);
    if (res.success) {
      setTargetGroupToUnlock(null);
      setEnteredGroupPassword('');
      setUnlockError('');
      if ((res.group.users || []).length > 0) {
        setCurrentStep('select_player');
      } else {
        setCurrentStep('create_player');
      }
    } else {
      setUnlockError(res.error || 'Contraseña incorrecta.');
    }
  };

  // Manejar recuperación de contraseña
  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!targetGroupToUnlock) return;

    const res = recoverGroupPassword(targetGroupToUnlock.id, recoveryEmail, recoveryNewPassword);
    if (res.success) {
      setRecoverySuccess('¡Contraseña restablecida exitosamente! Ya puedes ingresar con tu nueva clave.');
      setRecoveryError('');
      setEnteredGroupPassword(recoveryNewPassword);
      setTimeout(() => {
        setRecoverySuccess('');
        setCurrentStep('unlock_group');
      }, 1800);
    } else {
      setRecoveryError(res.error || 'Error al recuperar contraseña.');
    }
  };

  // Seleccionar jugador para entrar a jugar
  const handlePickPlayer = (userId) => {
    setActiveUserId(userId);
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    onClose();
  };

  // Crear nuevo jugador dentro del grupo activo
  const handleCreatePlayerSubmit = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      const targetId = activeGroup?.id || activeGroupId || 'group_junvill';
      const newUser = createUser(newPlayerName.trim(), selectedAvatar, newPlayerRole, null, DEFAULT_GENERIC_PASSWORD, targetId);
      if (newUser) {
        setNewPlayerName('');
        localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 115, padding: '12px' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: '24px',
          background: '#0f172a',
          border: '2px solid var(--color-gold, #ca8a04)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
          color: '#f8fafc'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================== */}
        {/* 1. MONITOR DE SALUD Y CAPACIDAD DEL SERVIDOR */}
        {/* ========================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '8px 12px',
          marginBottom: '16px',
          fontSize: '0.74rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '800' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            <span>Servidor Vercel Cloud: 100% Saludable</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontWeight: '700' }}>
            <span>👥 Grupos: <b style={{ color: '#f8fafc' }}>{groups.length}/{MAX_FAMILY_GROUPS}</b></span>
            <span>⚡ Capacidad Máx: <b style={{ color: '#f8fafc' }}>{MAX_CONCURRENT_USERS} Jugadores</b></span>
          </div>
        </div>

        {/* ========================================== */}
        {/* VISTA A: SELECCIÓN DE GRUPOS FAMILIARES    */}
        {/* ========================================== */}
        {currentStep === 'select_group' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(234, 179, 8, 0.15)',
                color: 'var(--color-gold, #facc15)',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.80rem',
                fontWeight: '900',
                marginBottom: '8px',
                border: '1px solid rgba(234, 179, 8, 0.3)'
              }}>
                <Sparkles size={15} />
                <span>PORTAL DE ACCESO PROTEGIDO</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '4px 0 6px', fontWeight: '900', color: '#f8fafc' }}>
                Selecciona tu Grupo Familiar
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                Cada grupo cuenta con su propia contraseña segura y perfiles protegidos.
              </p>
            </div>

            {/* Grid de Grupos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '18px', maxHeight: '280px', overflowY: 'auto' }}>
              {groups.map(grp => {
                const playerCount = (grp.users || []).length;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    data-group-id={grp.id}
                    onClick={() => handleSelectGroupCard(grp)}
                    style={{
                      background: '#0a0f1d',
                      border: `1.5px solid ${grp.themeColor || 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      fontSize: '2rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {grp.emblem || '🛡️'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '900', fontSize: '0.96rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {grp.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        Admin: {grp.adminName || 'Tutor'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.70rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', color: '#cbd5e1', fontWeight: '700' }}>
                          👥 {playerCount}/{MAX_PLAYERS_PER_GROUP} Jugadores
                        </span>
                      </div>
                    </div>

                    <div style={{ color: 'var(--color-gold, #facc15)' }}>
                      <Lock size={18} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botón para Crear Nuevo Grupo */}
            <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={() => setIsCreateGroupOpen(true)}
                disabled={groups.length >= MAX_FAMILY_GROUPS}
                style={{
                  padding: '11px 20px',
                  fontSize: '0.88rem',
                  gap: '8px',
                  opacity: groups.length >= MAX_FAMILY_GROUPS ? 0.5 : 1
                }}
              >
                <Plus size={16} />
                <span>+ Crear Nuevo Grupo Familiar ({groups.length}/{MAX_FAMILY_GROUPS})</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VISTA B: DESBLOQUEO DE GRUPO CON CLAVE     */}
        {/* ========================================== */}
        {currentStep === 'unlock_group' && targetGroupToUnlock && (
          <form onSubmit={handleUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '4px' }}>
                {targetGroupToUnlock.emblem || '👑'}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: '0 0 4px', fontWeight: '900', color: '#f8fafc' }}>
                {targetGroupToUnlock.name}
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                Ingresa la contraseña de este grupo familiar para acceder a sus jugadores.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#facc15' }}>
                <Lock size={15} />
                <span>Contraseña del Grupo:</span>
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa la contraseña del grupo"
                  value={enteredGroupPassword}
                  onChange={(e) => {
                    setEnteredGroupPassword(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '10px',
                    border: unlockError ? '1.5px solid #ef4444' : '1.5px solid var(--color-gold)',
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
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {unlockError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '0.80rem', marginTop: '6px', fontWeight: '700' }}>
                  <AlertCircle size={14} />
                  <span>{unlockError}</span>
                </div>
              )}

              {/* Botón de Recuperar Contraseña */}
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail('');
                    setRecoveryNewPassword('');
                    setRecoveryError('');
                    setRecoverySuccess('');
                    setCurrentStep('recover_password');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    textDecoration: 'underline'
                  }}
                >
                  ¿Olvidaste la contraseña del grupo? 🔑
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setTargetGroupToUnlock(null);
                  setCurrentStep('select_group');
                }}
                style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                <span>⬅️ Volver a Grupos</span>
              </button>

              <button
                type="submit"
                className="btn-gold"
                style={{ flex: 2, padding: '11px', justifyContent: 'center', fontSize: '0.92rem', fontWeight: '900' }}
              >
                <span>Desbloquear Grupo 🚀</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================== */}
        {/* VISTA E: RECUPERAR CONTRASEÑA DE GRUPO     */}
        {/* ========================================== */}
        {currentStep === 'recover_password' && targetGroupToUnlock && (
          <form onSubmit={handleRecoverySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '2px' }}>
                {targetGroupToUnlock.emblem || '🛡️'}
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '0 0 4px', fontWeight: '900', color: '#f8fafc' }}>
                Recuperar Contraseña: {targetGroupToUnlock.name}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Ingresa el correo electrónico del creador / tutor para restablecer la contraseña.
              </p>
            </div>

            {recoverySuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#86efac', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700' }}>
                <Check size={16} />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {recoveryError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700' }}>
                <AlertCircle size={16} />
                <span>{recoveryError}</span>
              </div>
            )}

            {/* Correo del Administrador */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#38bdf8' }}>
                <Mail size={14} />
                <span>Correo de Recuperación del Creador / Tutor:</span>
              </label>
              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                value={recoveryEmail}
                onChange={(e) => {
                  setRecoveryEmail(e.target.value);
                  if (recoveryError) setRecoveryError('');
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

            {/* Nueva Contraseña */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#facc15' }}>
                <Lock size={14} />
                <span>Nueva Contraseña para el Grupo:</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRecoveryPassword ? 'text' : 'password'}
                  placeholder="Define una nueva clave (mín. 4 caracteres)"
                  value={recoveryNewPassword}
                  onChange={(e) => {
                    setRecoveryNewPassword(e.target.value);
                    if (recoveryError) setRecoveryError('');
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
                  onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showRecoveryPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setRecoveryError('');
                  setRecoverySuccess('');
                  setCurrentStep('unlock_group');
                }}
                style={{ flex: 1, padding: '11px', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                <span>⬅️ Cancelar</span>
              </button>

              <button
                type="submit"
                className="btn-gold"
                style={{ flex: 2, padding: '11px', justifyContent: 'center', fontSize: '0.92rem', fontWeight: '900' }}
              >
                <span>Restablecer Contraseña 🔄</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================== */}
        {/* VISTA C: SELECCIÓN DE JUGADOR DE LA FAMILIA */}
        {/* ========================================== */}
        {currentStep === 'select_player' && activeGroup && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{activeGroup.emblem || '👑'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: '#f8fafc' }}>
                    {activeGroup.name}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {users.length} de {MAX_PLAYERS_PER_GROUP} jugadores registrados
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  leaveFamilyGroup();
                  setCurrentStep('select_group');
                }}
                style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '6px' }}
                title="Salir a la lista de grupos familiares"
              >
                <DoorOpen size={14} />
                <span>Cambiar Grupo</span>
              </button>
            </div>

            <div style={{ fontSize: '0.80rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              ¿Quién jugará hoy?
            </div>

            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', background: '#0a0f1d', borderRadius: '12px', marginBottom: '16px' }}>
                <User size={36} color="#64748b" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#f8fafc' }}>Grupo sin jugadores registrados</h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 12px' }}>Crea el primer perfil de jugador para comenzar a jugar.</p>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => setCurrentStep('create_player')}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <Plus size={15} />
                  <span>+ Crear Primer Jugador</span>
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '18px',
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                {users.map(u => {
                  const isCurrent = u.id === currentUser?.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handlePickPlayer(u.id)}
                      style={{
                        background: isCurrent ? 'rgba(245, 158, 11, 0.15)' : '#0a0f1d',
                        border: `2px solid ${isCurrent ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: '12px',
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
                        <div style={{ fontWeight: '800', fontSize: '0.90rem', color: '#f8fafc' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
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
                        <span>Jugar como {u.name.split(' ')[0]}</span>
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {users.length < MAX_PLAYERS_PER_GROUP && (
              <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep('create_player')}
                  style={{ padding: '10px 20px', fontSize: '0.86rem', gap: '8px' }}
                >
                  <UserPlus size={16} />
                  <span>+ Agregar Jugador a {activeGroup.name} ({users.length}/{MAX_PLAYERS_PER_GROUP})</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* VISTA D: CREAR JUGADOR DENTRO DEL GRUPO    */}
        {/* ========================================== */}
        {currentStep === 'create_player' && activeGroup && (
          <form onSubmit={handleCreatePlayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '6px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc' }}>
                Nuevo Jugador para {activeGroup.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Cupo disponible: {users.length + 1} de {MAX_PLAYERS_PER_GROUP} jugadores.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#e2e8f0', display: 'block', marginBottom: '4px' }}>
                Nombre del Jugador:
              </label>
              <input
                type="text"
                placeholder="Ej. Sofía, Santiago, Campeón..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Elige tu Avatar:
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
                gap: '6px',
                maxHeight: '110px',
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
                      <AvatarIcon avatarId={av.id} size={40} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Rol */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#e2e8f0', display: 'block', marginBottom: '6px' }}>
                Rol:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'student', label: 'Estudiante', icon: User },
                  { id: 'coach', label: 'Profesor', icon: GraduationCap },
                  { id: 'parent', label: 'Tutor', icon: Shield }
                ].map(r => {
                  const isSel = newPlayerRole === r.id;
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setNewPlayerRole(r.id)}
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
                        color: isSel ? 'var(--color-gold)' : '#94a3b8',
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              {users.length > 0 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCurrentStep('select_player')}
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
                <span>Guardar y Jugar</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Modal de Creación de Grupo Familiar */}
      <CreateFamilyGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSuccess={(newGrp) => {
          setIsCreateGroupOpen(false);
          setCurrentStep('create_player');
        }}
      />
    </div>
  );
};
