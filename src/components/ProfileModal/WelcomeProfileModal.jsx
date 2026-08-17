import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon, AVATAR_LIST } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { Sparkles, UserPlus, Check, User, GraduationCap, Shield, Swords, ArrowRight } from 'lucide-react';

export const WelcomeProfileModal = ({ isOpen, onClose, onOpenAvatarBuilder, roomToJoin = null }) => {
  const { users, currentUser, setActiveUserId, createUser } = useUser();
  const [isCreatingNew, setIsCreatingNew] = useState(users.length === 0);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [selectedAvatar, setSelectedAvatar] = useState('teen_gamer');

  if (!isOpen) return null;

  const handleSelectExistingUser = (userId) => {
    setActiveUserId(userId);
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    onClose();
  };

  const handleCreateAndStart = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      const newUser = createUser(newUserName.trim(), selectedAvatar, newUserRole);
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
          maxWidth: '620px',
          width: '100%',
          padding: '24px',
          background: 'var(--bg-parchment-card)',
          border: '2px solid var(--color-gold)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de Bienvenida */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-gold-light)',
            color: 'var(--color-gold-dark)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: '900',
            marginBottom: '8px'
          }}>
            <Sparkles size={16} />
            <span>¡BIENVENIDO A AJEDREZ JUNVILL!</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-parchment-main)', margin: '4px 0 6px', fontWeight: '900' }}>
            {roomToJoin ? '¿Quién jugará esta partida?' : '¿Quién está jugando hoy?'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-parchment-muted)', margin: 0 }}>
            {roomToJoin 
              ? `Estás a punto de unirte a la sala multijugador ${roomToJoin}. Elige o crea tu perfil:`
              : 'Selecciona tu perfil de jugador o crea uno nuevo para guardar tu progreso y puntos.'}
          </p>
        </div>

        {/* LISTA DE PERFILES EXISTENTES */}
        {!isCreatingNew && users.length > 0 && (
          <div>
            <div style={{ fontSize: '0.80rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
              Seleccionar Jugador:
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
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
                    onClick={() => handleSelectExistingUser(u.id)}
                    style={{
                      background: isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-parchment)',
                      border: `2px solid ${isCurrent ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                      borderRadius: 'var(--radius-md, 10px)',
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
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                        {u.title || 'Aprendiz'} • {u.elo || 600} Elo
                      </div>
                    </div>

                    <div style={{
                      marginTop: '4px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      color: 'var(--color-primary)',
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

            <div style={{ textAlign: 'center', paddingTop: '10px', borderTop: '1px solid var(--bg-parchment-border)' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsCreatingNew(true)}
                style={{ padding: '10px 20px', fontSize: '0.88rem', gap: '8px' }}
              >
                <UserPlus size={16} />
                <span>+ Crear un Nuevo Perfil de Jugador</span>
              </button>
            </div>
          </div>
        )}

        {/* FORMULARIO PARA CREAR NUEVO PERFIL */}
        {isCreatingNew && (
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
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1.5px solid var(--color-gold)',
                    background: 'var(--bg-parchment)',
                    color: 'var(--text-parchment-main)',
                    fontSize: '1rem',
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
                  gridTemplateColumns: 'repeat(auto-fill, minmax(58px, 1fr))',
                  gap: '8px',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  background: 'var(--bg-parchment)',
                  padding: '8px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--bg-parchment-border)'
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
                        <AvatarIcon avatarId={av.id} size={46} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Rol */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                  Tipo de Jugador:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'student', label: 'Estudiante', icon: GraduationCap },
                    { id: 'coach', label: 'Profesor', icon: Shield },
                    { id: 'parent', label: 'Padre / Tutor', icon: User }
                  ].map(r => {
                    const Icon = r.icon;
                    const isSel = newUserRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setNewUserRole(r.id)}
                        style={{
                          flex: 1,
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-md, 8px)',
                          border: `1.5px solid ${isSel ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          background: isSel ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          color: isSel ? 'var(--color-gold-dark)' : 'var(--text-parchment-muted)',
                          fontWeight: '800',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Icon size={18} />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones de Acción */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {users.length > 0 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsCreatingNew(false)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Volver a la lista
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center', padding: '12px', fontSize: '0.98rem', fontWeight: '900' }}
                >
                  <Check size={18} />
                  <span>¡Listo, Entrar al Juego!</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
