import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon } from '../../assets/avatars';
import { 
  Home, Swords, Bot, Puzzle, BookOpen, User, Trophy, 
  Settings, Maximize, Minimize, Bug, FileText, Award, Flame
} from 'lucide-react';

export const Header = ({ 
  activeTab, 
  onTabChange, 
  onOpenProfile, 
  onOpenDaily, 
  onOpenCertificates, 
  onOpenPgn, 
  onOpenSettings, 
  onOpenBugReport, 
  onOpenManual 
}) => {
  const { currentUser } = useUser();
  const [isFullscreen, setIsFullscreen] = useState(false);

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

        {/* 3. BARRA RÁPIDA DE USUARIO, DIVISAS Y MANUAL */}
        <div className="user-quick-bar">
          {/* Botón Destacado: Manual de Ayuda */}
          <button
            type="button"
            onClick={onOpenManual}
            className="btn-gold header-manual-btn"
            title="Manual de Ayuda y Guía del Usuario"
          >
            <BookOpen size={15} />
            <span className="hide-mobile-compact">Manual</span>
          </button>

          {/* Divisas del Jugador: Estrellas ⭐ */}
          <div className="currency-badge stars-badge" title="Estrellas acumuladas">
            <span>⭐</span>
            <span className="currency-val">{currentUser.stars || 0}</span>
          </div>

          {/* Divisas del Jugador: Gemas 💎 */}
          <div className="currency-badge gems-badge" title="Gemas ganadas">
            <span>💎</span>
            <span className="currency-val">{currentUser.gems || 0}</span>
          </div>

          {/* Botón de Pantalla Completa Compacto */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="header-icon-btn hide-mobile-compact"
            title={isFullscreen ? "Salir de Pantalla Completa" : "Modo Pantalla Completa"}
          >
            {isFullscreen ? <Minimize size={16} color="#10b981" /> : <Maximize size={16} color="#94a3b8" />}
          </button>

          {/* Botón Configuración y Herramientas */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="header-icon-btn"
            title="Configuración y Herramientas (Audio, Tableros, Reportes)"
          >
            <Settings size={16} color="#94a3b8" />
          </button>

          {/* Perfil del Usuario Activo */}
          <button 
            type="button"
            className="profile-button" 
            onClick={onOpenProfile} 
            title="Cambiar usuario o avatar"
          >
            <div className="user-avatar-mini">
              <AvatarIcon avatarId={currentUser.avatar} avatarConfig={currentUser.avatarConfig} size={28} />
            </div>
            <span className="user-name-text">{currentUser.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
