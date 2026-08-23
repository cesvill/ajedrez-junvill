import React, { useState } from 'react';
import { useUser, DEFAULT_GENERIC_PASSWORD } from '../../context/UserContext';
import { AvatarIcon, AVATAR_LIST } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { FullBodyAvatar } from '../AvatarCreator/FullBodyAvatar';
import { X, UserPlus, Check, Award, Trash2, Sparkles, User, Shield, GraduationCap, Users, RotateCcw, Edit2, Database, Download, Upload, CheckCircle2, Lock, Eye, EyeOff, KeyRound, AlertCircle, DoorOpen } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, onOpenAvatarBuilder, onOpenGatekeeper }) => {
  const { 
    activeGroup,
    users, 
    currentUser, 
    setActiveUserId, 
    createUser, 
    editUser, 
    deleteUser, 
    resetUserProgress, 
    verifyPassword,
    changeUserPassword,
    isDbSynced,
    exportSaveData,
    importSaveData,
    forceCloudSync
  } = useUser();

  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('student');
  const [editPassword, setEditPassword] = useState('');

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserPassword, setNewUserPassword] = useState(DEFAULT_GENERIC_PASSWORD);
  const [selectedAvatar, setSelectedAvatar] = useState('teen_gamer');

  // Estado para verificar clave al cambiar de usuario
  const [switchTargetUser, setSwitchTargetUser] = useState(null);
  const [switchPassword, setSwitchPassword] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');

  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      const pwd = newUserPassword.trim() || DEFAULT_GENERIC_PASSWORD;
      createUser(newUserName.trim(), selectedAvatar, newUserRole, null, pwd);
      setNewUserName('');
      setNewUserPassword(DEFAULT_GENERIC_PASSWORD);
      setIsCreating(false);
      showToast(`¡Perfil "${newUserName.trim()}" creado y guardado en la Base de Datos!`);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditRole(user.role || 'student');
    setEditPassword(user.password || DEFAULT_GENERIC_PASSWORD);
  };

  const handleSaveEdit = (userId) => {
    if (editName.trim()) {
      const pwd = editPassword.trim() || DEFAULT_GENERIC_PASSWORD;
      editUser(userId, { name: editName.trim(), role: editRole, password: pwd });
      setEditingUserId(null);
      showToast('Perfil y contraseña actualizados con éxito');
    }
  };

  const handleRequestSwitchUser = (user) => {
    if (user.id === currentUser?.id) return;
    setSwitchTargetUser(user);
    setSwitchPassword('');
    setSwitchError('');
    setShowSwitchPassword(false);
  };

  const handleConfirmSwitchUser = (e) => {
    e.preventDefault();
    if (!switchTargetUser) return;

    if (verifyPassword(switchTargetUser.id, switchPassword)) {
      setActiveUserId(switchTargetUser.id);
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      setSwitchTargetUser(null);
      showToast(`¡Cambiado a perfil "${switchTargetUser.name}"!`);
    } else {
      setSwitchError('Contraseña incorrecta.');
    }
  };

  const handleDelete = (user) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a "${user.name}"? Se borrarán sus datos de forma permanente.`)) {
      const ok = deleteUser(user.id);
      if (ok) {
        showToast(`Perfil "${user.name}" eliminado de la Base de Datos`);
      }
    }
  };

  const handleResetProgress = (user) => {
    if (confirm(`¿Deseas resetear todo el avance de "${user.name}"? Se reiniciarán las estrellas, puntos, Elo y lecciones a cero, conservando su nombre y ajustes.`)) {
      resetUserProgress(user.id);
      showToast(`Avance de "${user.name}" reiniciado a valores iniciales`);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportSaveData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajedrez_junvill_db_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Base de datos exportada en archivo JSON');
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importSaveData(event.target.result);
      if (success) {
        showToast('Base de datos restaurada correctamente');
      } else {
        alert('El archivo seleccionado no tiene un formato válido de base de datos.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px', width: '100%', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--color-primary)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-parchment-main)', fontSize: '1.3rem', margin: 0, fontWeight: '900' }}>
                Gestión de Usuarios & Base de Datos
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#10b981', fontWeight: '800', marginTop: '2px' }}>
                <CheckCircle2 size={13} />
                <span>Base de Datos Persistente con Contraseñas Seguras</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* BANNER DE GRUPO FAMILIAR ACTIVO */}
        {activeGroup && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            border: `1.5px solid ${activeGroup.themeColor || 'var(--color-gold)'}`,
            borderRadius: 'var(--radius-md, 12px)',
            padding: '10px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>{activeGroup.emblem || '👑'}</span>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.96rem', color: 'var(--text-parchment-main)' }}>
                  {activeGroup.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>
                  {users.length} miembros registrados • Admin: {activeGroup.adminName || 'Tutor'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={async () => {
                  showToast('⏳ Sincronizando con la Nube Central...');
                  try {
                    const res = await forceCloudSync();
                    showToast(res?.message || '¡Sincronizado!');
                  } catch (e) {
                    showToast('Error: ' + e.message);
                  }
                }}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  gap: '6px'
                }}
                title="Sincroniza y descarga los últimos avances de todos los perfiles de la nube"
              >
                <span>🔄 Sincronizar Nube</span>
              </button>

              {onOpenGatekeeper && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    onOpenGatekeeper();
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    gap: '6px',
                    border: '1.5px solid var(--color-gold)',
                    color: 'var(--color-gold)'
                  }}
                  title="Cambiar o administrar grupos familiares"
                >
                  <Users size={14} />
                  <span>👨‍👩‍👧‍👦 Portal Familiar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* NOTIFICACIÓN TOAST */}
        {notification && (
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#15803d', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '800', marginBottom: '14px', textAlign: 'center' }}>
            {notification}
          </div>
        )}

        {/* MODAL / SUB-PROMPT DE CONTRASEÑA PARA CAMBIO DE PERFIL */}
        {switchTargetUser && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            border: '2px solid var(--color-gold)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '0.96rem', fontWeight: '900', color: 'var(--color-gold)' }}>
              🔒 Ingresar contraseña para activar a "{switchTargetUser.name}":
            </h4>
            <form onSubmit={handleConfirmSwitchUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showSwitchPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={switchPassword}
                  onChange={(e) => {
                    setSwitchPassword(e.target.value);
                    if (switchError) setSwitchError('');
                  }}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '9px 38px 9px 12px',
                    borderRadius: '8px',
                    border: switchError ? '1.5px solid #ef4444' : '1.5px solid var(--color-gold)',
                    background: '#0a0f1d',
                    color: '#f8fafc',
                    fontSize: '0.90rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showSwitchPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {switchError && (
                <div style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: '800' }}>
                  {switchError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSwitchTargetUser(null)}
                  style={{ padding: '6px 12px', fontSize: '0.80rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '6px 14px', fontSize: '0.80rem', fontWeight: '800' }}
                >
                  Confirmar y Activar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USUARIO ACTIVO */}
        <div style={{
          background: 'var(--bg-parchment)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-gold)',
          display: 'flex',
          gap: '18px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '105px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FullBodyAvatar
                characterId={currentUser.avatar || 'teen_gamer'}
                config={currentUser.avatarConfig}
                width={80}
                height={105}
                interactive={true}
                showPedestal={true}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-parchment-main)', fontWeight: '900', margin: 0 }}>
                  {currentUser.name}
                </h3>
                <span style={{ fontSize: '0.72rem', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '900' }}>
                  {currentUser.role === 'coach' ? 'Profesor' : currentUser.role === 'parent' ? 'Padre/Tutor' : 'Estudiante'} • ACTIVO
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '3px 0 0' }}>
                {currentUser.title} • {currentUser.elo} Elo • {currentUser.stars} ⭐ • {currentUser.gems} 💎 • {currentUser.totalPoints} pts
              </p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); onOpenAvatarBuilder(); }}
            className="btn-gold"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Sparkles size={15} />
            <span>Editar Avatar</span>
          </button>
        </div>

        {/* LISTA DE PERFILES REGISTRADOS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.90rem', fontWeight: '800', color: 'var(--text-parchment-main)', margin: 0 }}>
              Perfiles Registrados en la Base de Datos ({users.length})
            </h4>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.80rem', gap: '6px' }}
              >
                <UserPlus size={15} />
                <span>+ Crear Perfil</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
            {users.map((u) => {
              const isActive = u.id === currentUser.id;
              const isEditing = editingUserId === u.id;

              return (
                <div
                  key={u.id}
                  style={{
                    background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-parchment)',
                    border: `1.5px solid ${isActive ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                    borderRadius: 'var(--radius-md, 10px)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  {/* Vista Normal vs Edición */}
                  {!isEditing ? (
                    <div
                      onClick={() => handleRequestSwitchUser(u)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--color-gold)', flexShrink: 0 }}>
                        {u.avatarConfig ? <DynamicAvatar config={u.avatarConfig} size={38} /> : <AvatarIcon avatarId={u.avatar} size={38} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>
                          {u.name} {isActive && '✅ (Jugando ahora)'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)' }}>
                          {u.role === 'coach' ? 'Profesor' : u.role === 'parent' ? 'Padre/Tutor' : 'Estudiante'} • {u.elo} Elo • {u.stars} ⭐ • {Object.keys(u.lessonProgress || {}).length} lecciones
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-gold)', fontSize: '0.85rem', flex: 2, minWidth: '110px' }}
                      />
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--bg-parchment-border)', fontSize: '0.80rem', flex: 1, minWidth: '95px' }}
                      >
                        <option value="student">Estudiante</option>
                        <option value="coach">Profesor</option>
                        <option value="parent">Padre/Tutor</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Contraseña"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-gold)', fontSize: '0.85rem', flex: 1, minWidth: '90px' }}
                        title="Cambiar contraseña del usuario"
                      />
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleSaveEdit(u.id)}
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="Guardar cambios"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setEditingUserId(null)}
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="Cancelar edición"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Botones de Acción: Activar, Editar, Resetear Avance, Eliminar */}
                  {!isEditing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {!isActive && (
                        <button
                          onClick={() => handleRequestSwitchUser(u)}
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.76rem', fontWeight: '800' }}
                        >
                          Activar
                        </button>
                      )}

                      {/* Editar Nombre/Rol/Password */}
                      <button
                        onClick={() => handleStartEdit(u)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}
                        title="Editar nombre, rol o contraseña"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Resetear Avance */}
                      <button
                        onClick={() => handleResetProgress(u)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f59e0b', padding: '4px' }}
                        title="Resetear avance y puntos de este jugador"
                      >
                        <RotateCcw size={16} />
                      </button>

                      {/* Eliminar Usuario */}
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDelete(u)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                          title="Eliminar perfil"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FORMULARIO DE CREAR NUEVO USUARIO */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} style={{ background: 'var(--bg-parchment)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gold)', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
              Crear Nuevo Perfil de Jugador
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Nombre:</label>
                <input
                  type="text"
                  placeholder="Ej. Sofía, Carlos, Mateo..."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-parchment-card)',
                    border: '1px solid var(--bg-parchment-border)',
                    color: 'var(--text-parchment-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Rol:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-parchment-card)',
                    border: '1px solid var(--bg-parchment-border)',
                    color: 'var(--text-parchment-main)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="student">Estudiante / Alumno</option>
                  <option value="coach">Profesor / Entrenador</option>
                  <option value="parent">Padre / Tutor</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Contraseña:</label>
                <input
                  type="text"
                  placeholder="Contraseña del jugador"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-parchment-card)',
                    border: '1px solid var(--bg-parchment-border)',
                    color: 'var(--text-parchment-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Perfil
              </button>
            </div>
          </form>
        )}

        {/* HERRAMIENTAS DE COPIA DE SEGURIDAD DB */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid var(--bg-parchment-border)', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportBackup}
              style={{ padding: '6px 12px', fontSize: '0.76rem', gap: '6px' }}
              title="Descargar base de datos completa en JSON"
            >
              <Download size={14} />
              <span>Exportar DB</span>
            </button>

            <label
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.76rem', gap: '6px', cursor: 'pointer' }}
              title="Restaurar base de datos desde un archivo JSON"
            >
              <Upload size={14} />
              <span>Importar DB</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <button className="btn-primary" onClick={onClose} style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
            Listo, Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};
