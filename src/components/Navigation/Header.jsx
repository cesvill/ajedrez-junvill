import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon } from '../../assets/avatars';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../PWA/PWAInstallModal';
import { 
  Home, Swords, Bot, Puzzle, BookOpen, User, Trophy, 
  Settings, Maximize, Minimize, Bug, FileText, Award, Flame, Download, Smartphone, Users, DoorOpen, Globe
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
  onOpenP2P 
}) => {
  const { currentUser, activeGroup, users, forceCloudSync } = useUser();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  const { isInstalled, isIOS, showInstallModal, setShowInstallModal, openInstallModal, triggerNativePrompt, hasNativePrompt } = usePWAInstall();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setIsToolsMenuOpen(false);
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
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'aprender', label: 'Aprender', icon: BookOpen },
    { id: 'problemas', label: 'Problemas', icon: Puzzle },
    { id: 'robots', label: 'Robots', icon: Bot },
    { id: 'jugar', label: 'Jugar', icon: Swords },
    { id: 'torneos', label: 'Torneos', icon: Trophy },
    { id: 'yo', label: 'Yo', icon: User },
  ];

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          {/* 1. SECCIÓN MARCA / LOGO */}
          <div className="brand-section" onClick={() => onTabChange('inicio')} style={{ cursor: 'pointer' }} title="Ir al Inicio">
            <div className="brand-logo-badge">
              <span style={{ fontSize: '1.2rem' }}>♟️</span>
            </div>
            <h1 className="brand-title">Ajedrez Junvill</h1>
          </div>

          {/* 2. PESTAÑAS DE NAVEGACIÓN DESKTOP (PC) */}
          <nav className="desktop-nav-tabs" aria-label="Navegación principal">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`desktop-nav-tab ${isActive ? 'active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. BARRA RÁPIDA DE USUARIO, HERRAMIENTAS Y MANUAL */}
          <div className="user-quick-bar">
            {/* Divisas del Jugador: Estrellas ⭐ */}
            <div className="currency-badge stars-badge" title="Estrellas acumuladas">
              <span>⭐</span>
              <span className="currency-val">{currentUser?.stars || 0}</span>
            </div>

            {/* Divisas del Jugador: Gemas 💎 */}
            <div className="currency-badge gems-badge" title="Gemas ganadas">
              <span>💎</span>
              <span className="currency-val">{currentUser?.gems || 0}</span>
            </div>

            {/* CONTENEDOR RELATIVO PARA EL MENÚ POPOVER */}
            <div style={{ position: 'relative' }} ref={toolsMenuRef}>
              <button
                type="button"
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`btn-secondary header-tools-toggle-btn ${isToolsMenuOpen ? 'active' : ''}`}
                title="Abrir menú de herramientas, manual y opciones"
                style={{
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  gap: '5px',
                  border: isToolsMenuOpen ? '1.5px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                  background: isToolsMenuOpen ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-parchment-card)',
                  color: isToolsMenuOpen ? 'var(--color-gold)' : 'var(--text-parchment-main)'
                }}
              >
                <Settings size={14} />
                <span>Menú ▾</span>
              </button>

              {/* MENÚ POPOVER DESPLEGABLE FLOTANTE */}
              {isToolsMenuOpen && (
                <div className="header-dropdown-menu" style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '250px',
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
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: 'var(--color-gold-dark)',
                  padding: '4px 8px 6px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '2px'
                }}>
                  Herramientas & Grupo
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
