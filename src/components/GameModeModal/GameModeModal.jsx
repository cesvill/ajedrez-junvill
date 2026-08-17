import React from 'react';
import { BotAvatarRenderer, BOT_ROSTER } from '../../assets/botRoster';
import { Bot, Users, Globe, Play, Sparkles, X, Swords, Zap, ArrowRight, Award } from 'lucide-react';

export const GameModeModal = ({
  isOpen,
  onClose,
  onSelectBotMode,
  onSelectPassAndPlay,
  onSelectP2P,
  onOpenRobotsView,
  activeBot = null
}) => {
  if (!isOpen) return null;

  const currentBot = activeBot || BOT_ROSTER[0];

  return (
    <div className="modal-overlay" style={{ zIndex: 120, padding: '12px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '24px',
          background: 'var(--bg-parchment-card)',
          border: '2px solid var(--color-gold)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '14px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-gold-light)',
              color: 'var(--color-gold-dark)',
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.76rem',
              fontWeight: '900',
              marginBottom: '6px'
            }}>
              <Swords size={14} />
              <span>MODALIDADES DE AJEDREZ</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
              ¿Cómo quieres jugar hoy?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* LISTA DE MODALIDADES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          {/* 1. MODO ROBOT / IA */}
          <div
            onClick={() => onSelectBotMode(currentBot)}
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(30, 58, 138, 0.25) 100%)',
              border: '2px solid #3b82f6',
              borderRadius: 'var(--radius-md, 12px)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.15)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#3b82f6', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                    <Bot size={18} />
                  </div>
                  <div style={{ fontWeight: '900', color: '#60a5fa', fontSize: '1.05rem' }}>
                    Contra Robots & IA
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                  Con Tutor & Pistas
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '0 0 10px', lineHeight: '1.4' }}>
                Juega contra <b>{currentBot.name}</b> ({currentBot.elo} Elo) con explicaciones en vivo y consejos de tu profesor.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBotMode(currentBot);
                }}
              >
                <Play size={14} />
                <span>Jugar vs {currentBot.name}</span>
              </button>
              {onOpenRobotsView && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.80rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRobotsView();
                  }}
                  title="Ver todos los robots"
                >
                  <span>Ver Todos</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. MODO 2 JUGADORES EN EL MISMO DISPOSITIVO (PASA Y JUEGA) */}
          <div
            onClick={() => onSelectPassAndPlay()}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
              border: '2px solid #10b981',
              borderRadius: 'var(--radius-md, 12px)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: '#10b981', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                    <Users size={18} />
                  </div>
                  <div style={{ fontWeight: '900', color: '#34d399', fontSize: '1.05rem' }}>
                    Dos Jugadores (Misma Pantalla)
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                  Pasa y Juega
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '0 0 10px', lineHeight: '1.4' }}>
                Juega cara a cara con un amigo, hermano o profesor compartiendo la misma pantalla alternando turnos.
              </p>
            </div>

            <button
              type="button"
              className="btn-gold"
              style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPassAndPlay();
              }}
            >
              <Zap size={14} />
              <span>Iniciar Partida 2 Jugadores</span>
            </button>
          </div>

          {/* 3. MODO ONLINE MULTIJUGADOR P2P */}
          <div
            onClick={() => onSelectP2P()}
            style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(120, 53, 15, 0.25) 100%)',
              border: '2px solid #f59e0b',
              borderRadius: 'var(--radius-md, 12px)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.15)'
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ background: '#f59e0b', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                  <Globe size={18} />
                </div>
                <div style={{ fontWeight: '900', color: '#fbbf24', fontSize: '1.05rem' }}>
                  🌐 Partida Online con Amigos (Multijugador P2P)
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: 0, lineHeight: '1.4' }}>
                Crea una sala privada, escanea el código QR o comparte el enlace para jugar en tiempo real desde dos celulares o computadores.
              </p>
            </div>

            <button
              type="button"
              className="btn-gold"
              style={{ padding: '10px 18px', fontSize: '0.88rem', fontWeight: '900' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectP2P();
              }}
            >
              <span>Abrir Sala Online 🚀</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
