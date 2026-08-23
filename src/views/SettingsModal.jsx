import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { AvatarIcon } from '../assets/avatars';
import { getCoachById, COACHES_LIST } from '../assets/coachesData';
import { audioManager } from '../engine/audio';
import { voiceEngine } from '../engine/voiceEngine';
import { QRCodeDisplay } from '../components/QRCodeModal/QRCodeDisplay';
import { X, Settings, User, Volume2, VolumeX, Eye, Palette, Shield, Database, Download, Upload, Trash2, Check, Sparkles, Sliders, Bug, Globe, Copy, Swords, QrCode, Wifi, Loader2, Play, Square } from 'lucide-react';

const BOARD_THEMES = [
  { id: 'board_emerald', name: 'Esmeralda ChessKid', preview: '#689838' },
  { id: 'board_wood', name: 'Madera de Torneo', preview: '#b88b4a' },
  { id: 'board_royal', name: 'Azul Real FIDE', preview: '#3730a3' },
  { id: 'board_cyber', name: 'Cyberpunk Neón', preview: '#0f172a' },
  { id: 'board_crimson', name: 'Rubí Carmesí', preview: '#991b1b' },
];

export const SettingsModal = ({ isOpen, onClose, onOpenAvatarBuilder, onOpenProfileModal, onOpenBugReport, onOpenP2P }) => {
  const { currentUser, updateCurrentUser, exportSaveData, importSaveData, resetUserData, forceCloudSync } = useUser();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'board' | 'sound' | 'coach' | 'theme' | 'server' | 'data'
  const [importJsonText, setImportJsonText] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);
  const [copiedQuickCode, setCopiedQuickCode] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState(null);
  const [copiedServerLink, setCopiedServerLink] = useState(false);
  const [copiedLocalLink, setCopiedLocalLink] = useState(false);

  // Estados para Modo Servidor (Red Local vs Túnel Online)
  const [serverViewMode, setServerViewMode] = useState('online'); // 'online' | 'local'
  const [tunnelData, setTunnelData] = useState({
    active: false,
    status: 'idle', // 'idle' | 'starting' | 'running' | 'error'
    url: null,
    localIp: '192.168.86.32',
    localUrl: 'http://192.168.86.32:3000/'
  });
  const [isTunnelLoading, setIsTunnelLoading] = useState(false);

  // Consultar estado del túnel al abrir la pestaña Servidor
  useEffect(() => {
    if (activeTab === 'server') {
      fetch('/api/tunnel/status')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setTunnelData(prev => ({
              ...prev,
              active: data.active,
              status: data.status,
              url: data.url,
              localIp: data.localIp || prev.localIp,
              localUrl: data.localUrl || prev.localUrl
            }));
          }
        })
        .catch(err => console.log('Estado de túnel:', err));
    }
  }, [activeTab]);

  const handleStartTunnel = async () => {
    setIsTunnelLoading(true);
    try {
      const res = await fetch('/api/tunnel/start', { method: 'POST' });
      const data = await res.json();
      if (data && data.url) {
        setTunnelData(prev => ({
          ...prev,
          active: true,
          status: 'running',
          url: data.url
        }));
      }
    } catch (e) {
      console.error("Error al iniciar túnel", e);
    } finally {
      setIsTunnelLoading(false);
    }
  };

  const handleStopTunnel = async () => {
    setIsTunnelLoading(true);
    try {
      await fetch('/api/tunnel/stop', { method: 'POST' });
      setTunnelData(prev => ({
        ...prev,
        active: false,
        status: 'idle',
        url: null
      }));
    } catch (e) {
      console.error("Error al detener túnel", e);
    } finally {
      setIsTunnelLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentSettings = currentUser?.systemSettings || {
    soundEnabled: true,
    soundVolume: 80,
    autoQueen: true,
    showCoordinates: true,
    highlightMoves: true,
    highlightLastMove: true
  };

  const handleUpdateSettings = (newSettings) => {
    updateCurrentUser({
      systemSettings: { ...currentSettings, ...newSettings }
    });
  };

  const handleExport = () => {
    const data = exportSaveData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajedrez_junvill_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
  };

  const handleManualCloudSync = async () => {
    setIsSyncingCloud(true);
    setCloudSyncStatus(null);
    try {
      const result = await forceCloudSync();
      setCloudSyncStatus(result);
    } catch (e) {
      setCloudSyncStatus({ success: false, message: 'Error de sincronización: ' + e.message });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleCopyQuickCode = () => {
    const data = exportSaveData();
    try {
      navigator.clipboard.writeText(data).then(() => {
        setCopiedQuickCode(true);
        setTimeout(() => setCopiedQuickCode(false), 3000);
      });
    } catch (e) {
      setCopiedQuickCode(true);
      setTimeout(() => setCopiedQuickCode(false), 3000);
    }
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      alert('Pega el contenido JSON de tu copia de seguridad para restaurar.');
      return;
    }
    const success = importSaveData(importJsonText.trim());
    if (success) {
      alert('¡Datos restaurados con éxito!');
      setImportJsonText('');
      onClose();
    } else {
      alert('El formato del archivo JSON no es válido.');
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar todos los progresos a los valores de fábrica? Esta acción no se puede deshacer.')) {
      resetUserData();
      alert('Datos reiniciados con éxito.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '820px', width: '95vw', padding: '24px', maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={22} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Configuración y Preferencias Junvill
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* SUBPESTAÑAS DE CONFIGURACIÓN */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
          {[
            { id: 'general', label: '👤 Perfil & Usuario' },
            { id: 'board', label: '♟️ Tablero & Piezas' },
            { id: 'sound', label: '🔊 Audio & Efectos' },
            { id: 'coach', label: '🎓 Tutor & Ayudas' },
            { id: 'theme', label: '🎨 Tema Visual' },
            { id: 'server', label: '🌐 Servidor & Online' },
            { id: 'data', label: '💾 Copia de Seguridad' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--bg-parchment)',
                color: activeTab === tab.id ? 'white' : 'var(--text-parchment-muted)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENIDO DE LA PESTAÑA SELECCIONADA */}
        <div style={{ minHeight: '300px' }}>
          {/* 1. PERFIL & USUARIO */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: 'var(--bg-parchment)',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--bg-parchment-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                    {currentUser.avatarConfig ? (
                      <DynamicAvatar config={currentUser.avatarConfig} size={64} />
                    ) : (
                      <AvatarIcon avatarId={currentUser.avatar} size={64} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-parchment-main)' }}>
                        {currentUser.name}
                      </h3>
                      <span style={{ fontSize: '0.72rem', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                        {currentUser.role === 'coach' ? 'Profesor / Entrenador' : currentUser.role === 'parent' ? 'Padre / Tutor' : 'Estudiante'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                      {currentUser.title} • {currentUser.elo} Elo • {currentUser.totalPoints} puntos
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { onClose(); onOpenAvatarBuilder(); }}
                    className="btn-gold"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <Sparkles size={15} />
                    <span>Estudio de Avatar</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenProfileModal(); }}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <User size={15} />
                    <span>Cambiar Usuario</span>
                  </button>
                </div>
              </div>

              {/* Editar Nombre y Rol */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                    Nombre del Jugador:
                  </label>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => updateCurrentUser({ name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-parchment)',
                      border: '1.5px solid var(--bg-parchment-border)',
                      color: 'var(--text-parchment-main)',
                      fontSize: '0.9rem',
                      fontWeight: '700'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-parchment-main)', display: 'block', marginBottom: '6px' }}>
                    Rol en la Plataforma:
                  </label>
                  <select
                    value={currentUser.role || 'student'}
                    onChange={(e) => updateCurrentUser({ role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-parchment)',
                      border: '1.5px solid var(--bg-parchment-border)',
                      color: 'var(--text-parchment-main)',
                      fontSize: '0.9rem',
                      fontWeight: '700'
                    }}
                  >
                    <option value="student">Estudiante / Alumno</option>
                    <option value="coach">Profesor / Entrenador</option>
                    <option value="parent">Padre / Tutor Familiar</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. TABLERO & PIEZAS */}
          {activeTab === 'board' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Tema de Casillas del Tablero:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {BOARD_THEMES.map(b => (
                    <button
                      key={b.id}
                      onClick={() => updateCurrentUser({ boardTheme: b.id })}
                      style={{
                        background: 'var(--bg-parchment)',
                        border: `2px solid ${currentUser.boardTheme === b.id ? 'var(--color-primary)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: b.preview }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-parchment-main)' }}>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--bg-parchment-border)' }}>
                {[
                  { key: 'showCoordinates', label: 'Mostrar coordenadas en los bordes del tablero (a-h, 1-8)', desc: 'Facilita el aprendizaje de la notación algebraica' },
                  { key: 'highlightMoves', label: 'Resaltar puntos de movimientos legales al tocar una pieza', desc: 'Muestra círculos indicadores en las casillas permitidas' },
                  { key: 'highlightLastMove', label: 'Resaltar la última jugada realizada en color amarillo', desc: 'Indica de dónde vino y a dónde fue la última pieza' },
                  { key: 'autoQueen', label: 'Auto-promocionar peones a Dama al llegar a 8ª fila', desc: 'Agiliza las partidas coronando automáticamente a Dama' },
                ].map(opt => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--bg-parchment)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!currentSettings[opt.key]}
                      onChange={(e) => handleUpdateSettings({ [opt.key]: e.target.checked })}
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--color-primary)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-parchment-main)' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)' }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 3. AUDIO & EFECTOS Y VOZ */}
          {activeTab === 'sound' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-parchment)', padding: '14px 18px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {currentSettings.soundEnabled ? <Volume2 size={22} color="var(--color-success)" /> : <VolumeX size={22} color="var(--color-danger)" />}
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>Efectos de Sonido Web Synth</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>Sonidos al mover piezas, capturas, jaques y victorias</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentSettings.soundEnabled}
                  onChange={(e) => handleUpdateSettings({ soundEnabled: e.target.checked })}
                  style={{ width: '22px', height: '22px', accentColor: 'var(--color-primary)' }}
                />
              </label>

              {/* Narración de Voz en Español Latino */}
              <div style={{ background: 'var(--bg-parchment)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-parchment-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                      🎙️ Narración de Voz en Español Latino
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
                      Tu tutor activo lee en voz alta los conceptos, pistas y jugadas
                    </div>
                  </div>
                  <button
                    className="btn-gold"
                    onClick={() => {
                      voiceEngine.speak(`¡Hola! Soy tu tutor en Ajedrez Junvill y te acompañaré en cada paso de tu aprendizaje.`, currentUser.coachSettings?.coachAvatar || 'coach_aurelio');
                    }}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <Volume2 size={15} />
                    <span>Probar Voz</span>
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  <span>Volumen General de Audio</span>
                  <span>{currentSettings.soundVolume || 80}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentSettings.soundVolume || 80}
                  onChange={(e) => handleUpdateSettings({ soundVolume: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>

              <div style={{ background: 'var(--color-gold-light)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gold)', fontSize: '0.82rem', color: 'var(--text-parchment-main)' }}>
                💡 <strong>Voz Adaptada al Tutor:</strong> El timbre, entonación y velocidad se ajustan de manera única según el tutor que hayas seleccionado (*Don Aurelio, Doña Beatriz, Mateo, Valeria, Ada-9000 o Rey Sabio*).
              </div>
            </div>
          )}

          {/* 4. TUTOR & AYUDAS */}
          {activeTab === 'coach' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Tutor Pedagógico Activo:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {COACHES_LIST.map(c => {
                    const isSelected = (currentUser.coachSettings?.coachAvatar || 'coach_aurelio') === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => updateCurrentUser({ coachSettings: { ...currentUser.coachSettings, coachAvatar: c.id } })}
                        style={{
                          background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <AvatarIcon avatarId={c.id} size={36} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>{c.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-parchment-muted)' }}>{c.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Nivel de Asistencia durante Partidas:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'full', label: 'Completa (Tutor Activo)', desc: 'Consejos en cada turno y avisos de peligro' },
                    { id: 'moderate', label: 'Solo Alertas', desc: 'Solo avisa cuando dejes una pieza colgada' },
                    { id: 'off', label: 'Sin Ayuda (Modo Torneo)', desc: 'Sin intervenciones durante la partida' },
                  ].map(lvl => {
                    const isSelected = (currentUser.coachSettings?.assistanceLevel || 'full') === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => updateCurrentUser({ coachSettings: { ...currentUser.coachSettings, assistanceLevel: lvl.id } })}
                        style={{
                          background: isSelected ? 'var(--color-primary)' : 'var(--bg-parchment)',
                          color: isSelected ? 'white' : 'var(--text-parchment-main)',
                          border: '1.5px solid var(--bg-parchment-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: '800' }}>{lvl.label}</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.8, marginTop: '2px' }}>{lvl.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. TEMA VISUAL */}
          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'modern_dark', name: '🌟 Modo Moderno Dark & Gold (Adolescentes y Adultos)', desc: 'Elegante, fondo oscuro con acentos dorados y alto contraste.' },
                { id: 'kids_vibrant', name: '🌿 Modo ChessKid Alegre (Niños)', desc: 'Colores vivos, verde pradera y ambientación lúdica con botones grandes.' },
                { id: 'classic_parchment', name: '📜 Modo Pergamino Clásico Junvill', desc: 'Estética cálida tradicional de madera y papel antiguo de academia.' },
              ].map((theme) => {
                const isSelected = (currentUser.theme || 'modern_dark') === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateCurrentUser({ theme: theme.id })}
                    style={{
                      background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                      border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                      {theme.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', marginTop: '4px' }}>
                      {theme.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 6. MODO SERVIDOR ONLINE & ACCESO REMOTO */}
          {activeTab === 'server' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Selector de Modo: Red Local Wi-Fi vs Internet / Túnel */}
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: 'var(--radius-lg, 12px)', border: '1.5px solid var(--bg-parchment-border)' }}>
                <button
                  type="button"
                  onClick={() => setServerViewMode('online')}
                  style={{
                    flex: 1,
                    background: serverViewMode === 'online' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                    color: serverViewMode === 'online' ? '#ffffff' : 'var(--text-parchment-muted)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: serverViewMode === 'online' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  <Globe size={18} />
                  <span>🌐 Modo Internet (Túnel Online)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setServerViewMode('local')}
                  style={{
                    flex: 1,
                    background: serverViewMode === 'local' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                    color: serverViewMode === 'local' ? '#ffffff' : 'var(--text-parchment-muted)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: serverViewMode === 'local' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  <Wifi size={18} />
                  <span>🏠 Modo Red Local Wi-Fi</span>
                </button>
              </div>

              {/* VISTA 1: MODO INTERNET / TÚNEL CLOUDFLARE */}
              {serverViewMode === 'online' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.9) 100%)',
                  border: '2px solid #6366f1',
                  borderRadius: 'var(--radius-lg, 12px)',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '900', color: '#ffffff' }}>
                        Túnel Seguro Cloudflare (Jugar por Internet)
                      </h3>
                      <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#c7d2fe' }}>
                        Permite a amigos y alumnos conectarse desde cualquier lugar del mundo.
                      </p>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: tunnelData.active ? 'rgba(34, 197, 94, 0.25)' : 'rgba(148, 163, 184, 0.2)',
                      border: `1.5px solid ${tunnelData.active ? '#22c55e' : '#94a3b8'}`,
                      color: tunnelData.active ? '#86efac' : '#cbd5e1',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.80rem',
                      fontWeight: '900'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: tunnelData.active ? '#22c55e' : '#94a3b8',
                        boxShadow: tunnelData.active ? '0 0 10px #22c55e' : 'none'
                      }}></span>
                      <span>{tunnelData.active ? 'ONLINE ACTIVO' : 'TÚNEL DETENIDO'}</span>
                    </div>
                  </div>

                  {/* Botón de Control de Inicio / Parada desde la WebApp */}
                  <div style={{ margin: '14px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {!tunnelData.active ? (
                      <button
                        type="button"
                        className="btn-gold"
                        onClick={handleStartTunnel}
                        disabled={isTunnelLoading}
                        style={{ padding: '12px 22px', fontSize: '0.95rem', fontWeight: '900', gap: '8px', width: '100%', justifyContent: 'center' }}
                      >
                        {isTunnelLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                        <span>{isTunnelLoading ? 'Iniciando Túnel Seguro Cloudflare...' : '🚀 Iniciar Modo Online / Túnel Ahora'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopTunnel}
                        disabled={isTunnelLoading}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          padding: '12px 22px',
                          fontSize: '0.95rem',
                          fontWeight: '900',
                          gap: '8px',
                          width: '100%',
                          justifyContent: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        {isTunnelLoading ? <Loader2 size={20} className="animate-spin" /> : <Square size={20} />}
                        <span>{isTunnelLoading ? 'Deteniendo...' : '⏹️ Detener Modo Online / Cerrar Túnel'}</span>
                      </button>
                    )}
                  </div>

                  {/* Si el túnel está activo, mostrar Enlace y Código QR */}
                  {tunnelData.active && tunnelData.url && (
                    <div style={{ marginTop: '14px' }}>
                      <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-md, 8px)', padding: '14px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                          🌍 Enlace Público Seguro para Amigos / Celulares:
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            readOnly
                            value={tunnelData.url}
                            style={{
                              flex: 1,
                              minWidth: '240px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: 'var(--radius-sm, 6px)',
                              padding: '10px 12px',
                              color: '#60a5fa',
                              fontFamily: 'monospace',
                              fontSize: '0.92rem',
                              fontWeight: '800'
                            }}
                          />
                          <button
                            type="button"
                            className="btn-gold"
                            onClick={() => {
                              navigator.clipboard.writeText(tunnelData.url);
                              setCopiedServerLink(true);
                              setTimeout(() => setCopiedServerLink(false), 2500);
                            }}
                            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                          >
                            {copiedServerLink ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedServerLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Código QR Dinámico del Túnel */}
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                        <QRCodeDisplay
                          value={tunnelData.url}
                          size={180}
                          title="Escanear para Jugar Online"
                          subtitle="Apunta la cámara de cualquier celular para entrar desde cualquier lugar del mundo"
                        />
                      </div>
                    </div>
                  )}

                  {/* Panel de Información de Lanzadores Windows */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-md, 8px)', padding: '12px 14px', marginTop: '12px' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#fde047', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ⚡ Lanzadores de 1 Clic en tu Computador:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                      También puedes usar los ejecutables creados en tu carpeta: <strong>INICIAR_SERVIDOR_ONLINE.bat</strong> y <strong>DETENER_SERVIDOR.bat</strong>.
                    </div>
                  </div>
                </div>
              )}

              {/* VISTA 2: MODO RED LOCAL WI-FI */}
              {serverViewMode === 'local' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(6, 95, 70, 0.9) 100%)',
                  border: '2px solid #10b981',
                  borderRadius: 'var(--radius-lg, 12px)',
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '900', color: '#ffffff' }}>
                        Red Local Wi-Fi (Misma Casa / Sin Internet)
                      </h3>
                      <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#a7f3d0' }}>
                        Conecta celulares y tablets en la misma red Wi-Fi sin gastar datos y sin necesidad de túnel.
                      </p>
                    </div>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.3)', border: '1.5px solid #34d399', color: '#a7f3d0', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.80rem', fontWeight: '900' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>
                      <span>WI-FI LISTO</span>
                    </div>
                  </div>

                  {/* Dirección IP Local */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-md, 8px)', padding: '14px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                      🏠 Dirección IP en tu Red Local:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        readOnly
                        value={tunnelData.localUrl}
                        style={{
                          flex: 1,
                          minWidth: '240px',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 'var(--radius-sm, 6px)',
                          padding: '10px 12px',
                          color: '#fde047',
                          fontFamily: 'monospace',
                          fontSize: '0.92rem',
                          fontWeight: '800'
                        }}
                      />
                      <button
                        type="button"
                        className="btn-gold"
                        onClick={() => {
                          navigator.clipboard.writeText(tunnelData.localUrl);
                          setCopiedLocalLink(true);
                          setTimeout(() => setCopiedLocalLink(false), 2500);
                        }}
                        style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                      >
                        {copiedLocalLink ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copiedLocalLink ? '¡IP Copiada!' : 'Copiar IP'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Código QR Dinámico de Red Local */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                    <QRCodeDisplay
                      value={tunnelData.localUrl}
                      size={180}
                      title="Escanear en tu Casa (Mismo Wi-Fi)"
                      subtitle="Apunta la cámara de tu smartphone conectado al Wi-Fi de tu casa para abrir la app"
                    />
                  </div>
                </div>
              )}

              {/* Botón de Acción Directa para Jugar P2P */}
              <div style={{
                background: 'var(--bg-parchment)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--text-parchment-main)', fontSize: '0.95rem' }}>
                    ¿Listo para retar a tu amigo o alumno?
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-parchment-muted)', margin: '2px 0 0' }}>
                    Abre la sala multijugador protegida para generar tu código o recibir invitaciones.
                  </p>
                </div>
                {onOpenP2P && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      onClose();
                      onOpenP2P();
                    }}
                    style={{ padding: '10px 18px', fontSize: '0.88rem', gap: '8px' }}
                  >
                    <Swords size={18} />
                    <span>Abrir Sala P2P Ahora 🚀</span>
                  </button>
                )}
              </div>

              {/* Información de Ciberseguridad */}
              <div style={{
                background: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.82rem',
                color: 'var(--color-success)'
              }}>
                <Shield size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: '800', marginBottom: '2px' }}>Garantía de Ciberseguridad y Privacidad:</div>
                  <div style={{ color: 'var(--text-parchment-muted)', lineHeight: '1.4' }}>
                    Tu dirección IP pública y router doméstico nunca quedan expuestos a Internet. Todo el tráfico viaja cifrado con túnel Cloudflare TLS 1.3 y los movimientos de ajedrez se transmiten con cifrado de extremo a extremo (E2EE con WebRTC DTLS). Los invitados no requieren instalar absolutamente nada.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. COPIA DE SEGURIDAD & DATOS */}
          {activeTab === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* SECCIÓN 1: SINCRONIZACIÓN EN LA NUBE CENTRALIZADA */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(234, 179, 8, 0.12) 100%)',
                border: '2px solid var(--color-gold)',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '900' }}>
                    ☁️
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                      Base de Datos Centralizada en la Nube
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
                      Sincroniza lecciones, estrellas y avances de Martin, César, Leti y todos los miembros entre tus tablets, PCs y móviles.
                    </div>
                  </div>
                </div>

                {cloudSyncStatus && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    background: cloudSyncStatus.success ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                    color: cloudSyncStatus.success ? '#34d399' : '#f87171',
                    border: `1px solid ${cloudSyncStatus.success ? '#10b981' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{cloudSyncStatus.success ? '✅' : '⚠️'}</span>
                    <span>{cloudSyncStatus.message}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-gold"
                    onClick={handleManualCloudSync}
                    disabled={isSyncingCloud}
                    style={{
                      padding: '11px 20px',
                      fontSize: '0.88rem',
                      fontWeight: '900',
                      gap: '8px'
                    }}
                  >
                    {isSyncingCloud ? <Loader2 size={16} className="spin" /> : <span>🔄</span>}
                    <span>{isSyncingCloud ? 'Sincronizando con la Nube...' : 'Sincronizar con la Nube Ahora'}</span>
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={handleCopyQuickCode}
                    style={{
                      padding: '11px 16px',
                      fontSize: '0.86rem',
                      fontWeight: '800',
                      gap: '6px'
                    }}
                    title="Copia todo el avance de la familia al portapapeles para pegarlo en otro dispositivo"
                  >
                    <Copy size={15} />
                    <span>{copiedQuickCode ? '¡Copiado al Portapapeles! 📋' : 'Copiar Código de Transferencia'}</span>
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Exportar Progreso a un Archivo JSON:
                </div>
                <button className="btn-primary" onClick={handleExport} style={{ padding: '10px 20px' }}>
                  <Download size={16} />
                  <span>{copiedExport ? '¡Copia Descargada!' : 'Descargar Copia de Seguridad'}</span>
                </button>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--bg-parchment-border)' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Restaurar Copia de Seguridad o Código de Transferencia:
                </div>
                <textarea
                  placeholder="Pega aquí el código copiado o contenido JSON de tu otro dispositivo..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  style={{
                    width: '100%',
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-parchment)',
                    border: '1.5px solid var(--bg-parchment-border)',
                    padding: '10px',
                    fontSize: '0.8rem',
                    color: 'var(--text-parchment-main)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '10px'
                  }}
                />
                <button className="btn-secondary" onClick={handleImport}>
                  <Upload size={16} />
                  <span>Restaurar / Aplicar Avance</span>
                </button>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--bg-parchment-border)' }}>
                <button
                  onClick={handleReset}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1.5px solid #ef4444',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 18px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Trash2 size={16} />
                  <span>Reiniciar Todos los Datos a Valores de Fábrica</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PIE DE PÁGINA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1.5px solid var(--bg-parchment-border)', paddingTop: '14px' }}>
          {onOpenBugReport && (
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => {
                onClose();
                onOpenBugReport({ view: 'configuracion' });
              }}
              style={{ color: '#ef4444', fontSize: '0.82rem', gap: '6px' }}
            >
              <Bug size={15} color="#ef4444" />
              <span>Reportar Error Técnico</span>
            </button>
          )}
          <button className="btn-primary" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
