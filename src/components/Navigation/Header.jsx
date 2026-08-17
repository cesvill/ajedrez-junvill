import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon } from '../../assets/avatars';
import { Home, Swords, Bot, Puzzle, BookOpen, User, Trophy, Flame, Award, FileText, Settings, Bug, Maximize, Minimize } from 'lucide-react';

export const Header = ({ activeTab, onTabChange, onOpenProfile, onOpenDaily, onOpenCertificates, onOpenPgn, onOpenSettings, onOpenBugReport, onOpenManual }) => {
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
        {/* Marca / Logo */}
        <div className="brand-section" onClick={() => onTabChange('inicio')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">
            <span style={{ fontSize: '1.2rem' }}>♟️</span>
          </div>
          <h1 className="brand-title">Ajedrez Junvill</h1>
        </div>

        {/* Pestañas de Navegación para PC / Escritorio */}
        <div className="desktop-nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`desktop-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Monedas del Usuario y Accesos Rápidos */}
        <div className="user-quick-bar">
          {/* Botón Manual de Ayuda y Guía */}
          <button
            onClick={onOpenManual}
            className="btn-gold"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '5px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}
            title="Manual de Ayuda y Guía de Uso de la Pantalla Actual"
          >
            <BookOpen size={15} />
            <span style={{ fontWeight: '900' }}>Manual</span>
          </button>

          {/* Botón Reto Diario */}
          <button
            onClick={onOpenDaily}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
            title="Reto Diario del Gran Maestro (+15⭐, +5💎)"
          >
            <span>🔥</span>
          </button>

          {/* Botón Diplomas */}
          <button
            onClick={onOpenCertificates}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
            title="Diplomas y Certificados Oficiales"
          >
            <Award size={15} color="#f59e0b" />
          </button>

          {/* Botón PGN */}
          <button
            onClick={onOpenPgn}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
            title="Exportar / Importar PGN"
          >
            <FileText size={15} color="#3b82f6" />
          </button>

          {/* Botón Reportar Error */}
          <button
            onClick={onOpenBugReport}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px', color: '#ef4444' }}
            title="Reportar un error o problema en pantalla"
          >
            <Bug size={15} color="#ef4444" />
          </button>

          {/* Botón Pantalla Completa (Ocultar Barra del Navegador) */}
          <button
            onClick={toggleFullscreen}
            className="btn-secondary"
            style={{ 
              padding: '5px 10px', 
              fontSize: '0.78rem', 
              gap: '5px',
              border: isFullscreen ? '1.5px solid #10b981' : '1.5px solid #3b82f6',
              background: isFullscreen ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)'
            }}
            title={isFullscreen ? "Salir de Pantalla Completa (Modo Normal)" : "Pantalla Completa (Ocultar Barra URL del Navegador)"}
          >
            {isFullscreen ? <Minimize size={15} color="#10b981" /> : <Maximize size={15} color="#3b82f6" />}
            <span style={{ fontWeight: '800', color: isFullscreen ? '#10b981' : '#3b82f6' }}>
              {isFullscreen ? 'Normal' : 'Pantalla Completa'}
            </span>
          </button>

          {/* Botón Configuración Maestro */}
          <button
            onClick={onOpenSettings}
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.78rem', gap: '4px' }}
            title="Configuración y Preferencias"
          >
            <Settings size={15} color="var(--text-parchment-main)" />
          </button>

          {/* Estrellas ⭐ */}
          <div className="currency-badge stars-badge" title="Estrellas acumuladas">
            <span>⭐</span>
            <span>{currentUser.stars || 0}</span>
          </div>

          {/* Gemas 💎 */}
          <div className="currency-badge gems-badge" title="Gemas ganadas">
            <span>💎</span>
            <span>{currentUser.gems || 0}</span>
          </div>

          {/* Perfil */}
          <button className="profile-button" onClick={onOpenProfile} title="Cambiar usuario o avatar">
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
