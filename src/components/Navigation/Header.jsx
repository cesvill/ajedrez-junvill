import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon } from '../../assets/avatars';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../PWA/PWAInstallModal';
import { 
  Home, Swords, Bot, Puzzle, BookOpen, User, Trophy, 
  Settings, Maximize, Minimize, Bug, FileText, Award, Flame, Download, Smartphone, Users, DoorOpen, Globe, MessageSquare,
  ChevronDown, Compass, Sparkles
} from 'lucide-react';

export const Header = ({ 
  activeTab, 
  onTabChange, 
  onOpenProfile, 
  onOpenGatekeeper,
  onOpenDaily, 
  onOpenCertificates, 
  onOpenPgn, 
  onOpenSettings, 
  onOpenBugReport, 
  onOpenManual,
  onOpenP2P,
  onOpenFamilyChat
}) => {
  const { currentUser, activeGroup, users, forceCloudSync, unreadMessagesCount } = useUser();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const toolsMenuRef = useRef(null);
  const navMenuRef = useRef(null);

  const { isInstalled, isIOS, showInstallModal, setShowInstallModal, openInstallModal, triggerNativePrompt, hasNativePrompt } = usePWAInstall();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setIsToolsMenuOpen(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(e.target)) {
        setIsNavMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home, desc: 'Panel principal, resumen y estado familiar', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    { id: 'aprender', label: 'Aprender', icon: BookOpen, desc: '110 lecciones pedagógicas interactivas', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
    { id: 'problemas', label: 'Problemas', icon: Puzzle, desc: 'Puzzles tácticos diarios y jaques mate', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    { id: 'robots', label: 'Robots', icon: Bot, desc: '6 bots con personalidades y Elo dinámico', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)' },
    { id: 'jugar', label: 'Jugar', icon: Swords, desc: 'Partidas P2P familiares y 10 minijuegos', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
    { id: 'torneos', label: 'Torneos', icon: Trophy, desc: 'Copas, campeonatos y tabla de clasificación', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' },
    { id: 'yo', label: 'Yo / Perfil', icon: User, desc: 'Avatar studio, logros y estadísticas', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
  ];

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabObj.icon;

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          {/* 1. SECCIÓN MARCA / LOGO (Solo icono para ganar máximo espacio horizontal en móviles) */}
          <div className="brand-section" onClick={() => onTabChange('inicio')} style={{ cursor: 'pointer' }} title="Ir al Inicio">
            <div className="brand-logo-badge">
              <span style={{ fontSize: '1.2rem' }}>♟️</span>
            </div>
          </div>

          {/* 2. BOTÓN CENTRAL LLAMATIVO: SELECTOR / DESPLEGABLE DE SECCIONES */}
          <div style={{ position: 'relative' }} ref={navMenuRef}>
            <button
              type="button"
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="central-nav-hub-btn"
              title="Explorar y cambiar de sección"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '1.5px solid #eab308',
                borderRadius: '9999px',
                color: '#f8fafc',
                cursor: 'pointer',
                boxShadow: isNavMenuOpen 
                  ? '0 0 16px rgba(234, 179, 8, 0.4)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px rgba(234, 179, 8, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                color: '#0f172a',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(234, 179, 8, 0.4)'
              }}>
                <ActiveIcon size={14} strokeWidth={2.5} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800' }}>
                  Sección
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#facc15' }}>
                  {activeTabObj.label}
                </span>
              </div>

              <ChevronDown 
                size={16} 
                strokeWidth={2.5}
                color="#eab308"
                style={{
                  transition: 'transform 0.2s ease',
                  transform: isNavMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  marginLeft: '2px'
                }}
              />
            </button>

            {/* MENÚ DESPLEGABLE CENTRAL (HUB DE SECCIONES) */}
            {isNavMenuOpen && (
              <div
                className="central-nav-popover animate-scale-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0f172a',
                  border: '2px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: '18px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 25px rgba(234, 179, 8, 0.25)',
                  padding: '14px',
                  minWidth: '330px',
                  maxWidth: '380px',
                  zIndex: 2500,
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={15} color="#eab308" />
                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#fde047', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Secciones de la Academia
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    7 Módulos
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          onTabChange(tab.id);
                          setIsNavMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: isActive ? '1.5px solid #eab308' : '1px solid transparent',
                          background: isActive 
                            ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.18) 0%, rgba(30, 41, 59, 0.5) 100%)' 
                            : 'rgba(30, 41, 59, 0.4)',
                          color: isActive ? '#facc15' : '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                        }}
                      >
                        <div style={{
                          background: isActive ? '#eab308' : tab.bg || 'rgba(100, 116, 139, 0.2)',
                          color: isActive ? '#0f172a' : tab.color || '#38bdf8',
                          padding: '7px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive ? '0 2px 8px rgba(234, 179, 8, 0.4)' : 'none'
                        }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: '900' }}>
                              {tab.label}
                            </span>
                            {isActive && (
                              <span style={{ fontSize: '0.65rem', background: '#eab308', color: '#0f172a', padding: '1px 6px', borderRadius: '999px', fontWeight: '900' }}>
                                Actual
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '1px 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>
                            {tab.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. BARRA RÁPIDA DE USUARIO, HERRAMIENTAS Y MANUAL */}
          <div className="user-quick-bar">
            {/* Divisas del Jugador: Estrellas ⭐ arriba, Diamantes 💎 abajo */}
            <div className="currencies-stacked-column" style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center' }}>
              <div 
                className="currency-badge stars-badge" 
                title={`Estrellas acumuladas: ${currentUser?.stars || 0}`}
                style={{ padding: '1px 6px', fontSize: '0.68rem', height: '15px', display: 'flex', alignItems: 'center', gap: '3px', borderRadius: '4px' }}
              >
                <span style={{ fontSize: '0.70rem' }}>⭐</span>
                <span className="currency-val" style={{ fontWeight: '800' }}>{currentUser?.stars || 0}</span>
              </div>
              <div 
                className="currency-badge gems-badge" 
                title={`Diamantes ganados: ${currentUser?.gems || 0}`}
                style={{ padding: '1px 6px', fontSize: '0.68rem', height: '15px', display: 'flex', alignItems: 'center', gap: '3px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
              >
                <span style={{ fontSize: '0.70rem' }}>💎</span>
                <span className="currency-val" style={{ fontWeight: '800' }}>{currentUser?.gems || 0}</span>
              </div>
            </div>

            {/* CONTENEDOR RELATIVO PARA EL MENÚ POPOVER (con Chat y Herramientas) */}
            <div style={{ position: 'relative' }} ref={toolsMenuRef}>
              <button
                type="button"
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`btn-secondary header-tools-toggle-btn ${isToolsMenuOpen ? 'active' : ''}`}
                title="Abrir menú de chat familiar, herramientas y opciones"
                style={{
                  position: 'relative',
                  padding: '5px 12px',
                  fontSize: '0.80rem',
                  fontWeight: '800',
                  gap: '6px',
                  border: isToolsMenuOpen ? '1.5px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                  background: isToolsMenuOpen ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-parchment-card)',
                  color: isToolsMenuOpen ? 'var(--color-gold)' : 'var(--text-parchment-main)'
                }}
              >
                <Settings size={14} />
                <span>Menú ▾</span>
                {(unreadMessagesCount || 0) > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: '900',
                    padding: '1px 5px',
                    borderRadius: '999px',
                    boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
                  }}>
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* MENÚ POPOVER DESPLEGABLE FLOTANTE */}
              {isToolsMenuOpen && (
                <div className="header-dropdown-menu" style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  maxWidth: 'calc(100vw - 20px)',
                  background: '#0f172a',
                  border: '2px solid var(--bg-parchment-border)',
                  borderRadius: 'var(--radius-md, 12px)',
                  padding: '8px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                {/* 1. Chat Familiar en Tiempo Real */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); if (onOpenFamilyChat) onOpenFamilyChat(); }}
                  style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', marginBottom: '4px' }}
                >
                  <MessageSquare size={16} color="#34d399" />
                  <div className="item-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <span className="item-title" style={{ color: '#34d399' }}>💬 Chat Familiar</span>
                      <span className="item-sub">Mensajes y emojis en vivo</span>
                    </div>
                    {(unreadMessagesCount || 0) > 0 && (
                      <span style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: '900',
                        padding: '1px 6px',
                        borderRadius: '999px'
                      }}>
                        {unreadMessagesCount}
                      </span>
                    )}
                  </div>
                </button>

                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: 'var(--color-gold-dark)',
                  padding: '4px 8px 6px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '2px'
                }}>
                  Herramientas & Opciones
                </div>

                {/* 0. Cambiar de Grupo Familiar */}
                <button
                  type="button"
                  className="header-dropdown-item item-gold"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenGatekeeper(); }}
                  style={{ background: 'rgba(234, 179, 8, 0.10)', border: '1px solid rgba(234, 179, 8, 0.25)' }}
                >
                  <Users size={16} color="#facc15" />
                  <div className="item-text">
                    <span className="item-title" style={{ color: '#facc15' }}>👨‍👩‍👧‍👦 Portal Familiar</span>
                    <span className="item-sub">{activeGroup ? `${activeGroup.name} (${users.length} miembros)` : 'Cambiar de grupo'}</span>
                  </div>
                </button>

                {/* 0.1 Sincronizar Nube Central */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={async () => {
                    setIsToolsMenuOpen(false);
                    try {
                      const res = await forceCloudSync();
                      alert(res?.message || '¡Sincronizado con éxito!');
                    } catch (e) {
                      alert('Error al sincronizar: ' + e.message);
                    }
                  }}
                  style={{ background: 'rgba(59, 130, 246, 0.10)', border: '1px solid rgba(59, 130, 246, 0.25)' }}
                >
                  <Globe size={16} color="#60a5fa" />
                  <div className="item-text">
                    <span className="item-title" style={{ color: '#60a5fa' }}>☁️ Sincronizar Nube Central</span>
                    <span className="item-sub">Actualizar avances en todos tus dispositivos</span>
                  </div>
                </button>

                {/* Opción PWA en el Menú */}
                {!isInstalled && (
                  <button
                    type="button"
                    className="header-dropdown-item item-gold"
                    onClick={() => { setIsToolsMenuOpen(false); openInstallModal(); }}
                    style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)' }}
                  >
                    <Download size={16} color="#facc15" />
                    <div className="item-text">
                      <span className="item-title" style={{ color: '#facc15' }}>📲 Instalar Aplicación</span>
                      <span className="item-sub">Modo offline y pantalla completa</span>
                    </div>
                  </button>
                )}

                {/* 1. Manual de Usuario */}
                <button
                  type="button"
                  className="header-dropdown-item item-gold"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenManual(); }}
                >
                  <BookOpen size={16} color="#f59e0b" />
                  <div className="item-text">
                    <span className="item-title">Manual de Usuario</span>
                    <span className="item-sub">Guía interactiva y reglas</span>
                  </div>
                </button>

                {/* 2. Reto Diario */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenDaily(); }}
                >
                  <Flame size={16} color="#f97316" />
                  <div className="item-text">
                    <span className="item-title">Reto Diario del Maestro</span>
                    <span className="item-sub">+15⭐ y +5💎 cada día</span>
                  </div>
                </button>

                {/* 3. Diplomas y Certificados */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenCertificates(); }}
                >
                  <Award size={16} color="#eab308" />
                  <div className="item-text">
                    <span className="item-title">Diplomas Oficiales</span>
                    <span className="item-sub">Certificados descargables</span>
                  </div>
                </button>

                {/* 3.1. Juego en Línea & Retos P2P */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); if (onOpenP2P) onOpenP2P(); }}
                >
                  <Globe size={16} color="#3b82f6" />
                  <div className="item-text">
                    <span className="item-title" style={{ color: '#60a5fa' }}>⚔️ Retos & Juego en Línea</span>
                    <span className="item-sub">Salas familiares y P2P</span>
                  </div>
                </button>

                {/* 4. Importar / Exportar PGN */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenPgn(); }}
                >
                  <FileText size={16} color="#38bdf8" />
                  <div className="item-text">
                    <span className="item-title">Visor & Editor PGN</span>
                    <span className="item-sub">Cargar y guardar partidas</span>
                  </div>
                </button>

                {/* 5. Reportar Bug / Error */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenBugReport(); }}
                >
                  <Bug size={16} color="#ef4444" />
                  <div className="item-text">
                    <span className="item-title" style={{ color: '#f87171' }}>Reportar un Error</span>
                    <span className="item-sub">Ayúdanos a mejorar la app</span>
                  </div>
                </button>

                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

                {/* 6. Pantalla Completa ⛶ */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); toggleFullscreen(); }}
                >
                  {isFullscreen ? <Minimize size={16} color="#10b981" /> : <Maximize size={16} color="#94a3b8" />}
                  <div className="item-text">
                    <span className="item-title">{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}</span>
                    <span className="item-sub">Ocultar barras del navegador</span>
                  </div>
                </button>

                {/* 7. Ajustes ⚙️ */}
                <button
                  type="button"
                  className="header-dropdown-item"
                  onClick={() => { setIsToolsMenuOpen(false); onOpenSettings(); }}
                >
                  <Settings size={16} color="#94a3b8" />
                  <div className="item-text">
                    <span className="item-title">⚙️ Ajustes del Sistema</span>
                    <span className="item-sub">Sonido, tablero y temas</span>
                  </div>
                </button>
              </div>
            )}
            </div>

            {/* Perfil del Usuario Activo */}
            <button 
              type="button"
              className="profile-button" 
              onClick={onOpenProfile} 
              title="Cambiar usuario o avatar"
            >
              <div className="user-avatar-mini">
                <AvatarIcon avatarId={currentUser?.avatar || 'custom_dynamic'} avatarConfig={currentUser?.avatarConfig} size={28} />
              </div>
              <span className="user-name-text">{currentUser?.name || 'Estudiante'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL DE INSTALACIÓN PWA UNIVERSAL */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={isIOS}
        hasNativePrompt={hasNativePrompt}
        onNativeInstall={triggerNativePrompt}
      />
    </>
  );
};
