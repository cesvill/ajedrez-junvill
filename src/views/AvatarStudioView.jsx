import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { AvatarIcon, AVATAR_LIST } from '../assets/avatars';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { COACHES_LIST, getCoachById } from '../assets/coachesData';
import { Sparkles, Palette, Crown, Shield, Shirt, Layers, Check, Lock, GraduationCap, UserCheck, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../engine/audio';

const BOARD_THEMES = [
  { id: 'board_emerald', name: 'Esmeralda ChessKid', light: '#ffffff', dark: '#689838', cost: 0, preview: '#689838' },
  { id: 'board_wood', name: 'Madera de Torneo', light: '#eedab2', dark: '#b88b4a', cost: 0, preview: '#b88b4a' },
  { id: 'board_royal', name: 'Azul Real FIDE', light: '#e0e7ff', dark: '#3730a3', cost: 30, gems: 0, preview: '#3730a3' },
  { id: 'board_cyber', name: 'Cyberpunk Neón', light: '#1e293b', dark: '#0f172a', cost: 50, gems: 5, preview: '#0f172a' },
  { id: 'board_crimson', name: 'Rubí Carmesí', light: '#fee2e2', dark: '#991b1b', cost: 60, gems: 8, preview: '#991b1b' },
];

const SHIRTS_STORE = [
  { id: 'shirt_blue', name: 'Camiseta Azul Real', color: '#2563eb', cost: 0 },
  { id: 'shirt_red', name: 'Camiseta Roja Campeón', color: '#dc2626', cost: 10 },
  { id: 'shirt_green', name: 'Camiseta Verde Pradera', color: '#16a34a', cost: 15 },
  { id: 'shirt_gold', name: 'Túnica Dorada Gran Maestro', color: '#d97706', cost: 40, gems: 5 },
  { id: 'shirt_cyber', name: 'Traje Espacial Cibernético', color: '#7c3aed', cost: 60, gems: 10 },
];

export const AvatarStudioView = ({ onOpenAvatarBuilder }) => {
  const { currentUser, updateCurrentUser, unlockItem } = useUser();
  const [activeTab, setActiveTab] = useState('yo'); // 'yo' | 'tutores' | 'tablero' | 'app_theme'

  const unlocked = currentUser?.unlockedItems || [];
  const currentCoachId = currentUser?.coachSettings?.coachAvatar || 'coach_aurelio';
  const activeCoach = getCoachById(currentCoachId);

  const handleSelectCoach = (coachId) => {
    updateCurrentUser({
      coachSettings: { ...currentUser.coachSettings, coachAvatar: coachId }
    });
    audioManager.playVictory();
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleBuyOrEquipBoard = (board) => {
    const isUnlocked = unlocked.includes(board.id) || board.cost === 0;
    if (isUnlocked) {
      updateCurrentUser({ boardTheme: board.id });
      audioManager.playMove();
    } else {
      const success = unlockItem(board.id, board.cost, board.gems || 0);
      if (success) {
        audioManager.playVictory();
        confetti({ particleCount: 50, spread: 60 });
        updateCurrentUser({ boardTheme: board.id });
      } else {
        audioManager.playWarning();
        alert('No tienes suficientes estrellas o gemas para desbloquear este tablero.');
      }
    }
  };

  const handleBuyOrEquipShirt = (shirt) => {
    const isUnlocked = unlocked.includes(shirt.id) || shirt.cost === 0;
    if (isUnlocked) {
      updateCurrentUser({
        avatarConfig: { ...currentUser.avatarConfig, shirtColor: shirt.color }
      });
      audioManager.playMove();
    } else {
      const success = unlockItem(shirt.id, shirt.cost, 0);
      if (success) {
        audioManager.playVictory();
        confetti({ particleCount: 50, spread: 60 });
        updateCurrentUser({
          avatarConfig: { ...currentUser.avatarConfig, shirtColor: shirt.color }
        });
      } else {
        audioManager.playWarning();
        alert('No tienes suficientes estrellas para desbloquear esta prenda.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* CABECERA */}
      <div className="lessons-header-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="points-summary-text" style={{ margin: 0, textAlign: 'left' }}>
            👑 Tienda & Estudio de Personalización
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '4px 0 0' }}>
            Equipa trajes, tableros temáticos, elige a tu tutor pedagógico y diseña tu avatar único.
          </p>
        </div>

        {/* Monedas */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="currency-badge stars-badge">
            <span>⭐</span>
            <span>{currentUser.stars || 0} Estrellas</span>
          </div>

          <div className="currency-badge gems-badge">
            <span>💎</span>
            <span>{currentUser.gems || 0} Gemas</span>
          </div>
        </div>

        {/* Subpestañas */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-parchment)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--bg-parchment-border)',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'yo', label: 'Mi Personaje' },
            { id: 'tutores', label: 'Tutores Junvill' },
            { id: 'tablero', label: 'Tableros' },
            { id: 'app_theme', label: 'Temas Visuales' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? 'var(--color-primary)' : 'transparent',
                color: activeTab === t.id ? 'white' : 'var(--text-parchment-muted)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENEDOR 2 COLUMNAS EN PC */}
      <div className="game-responsive-container">
        {/* Tarima del Personaje y del Tutor Activo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: 'radial-gradient(circle at 50% 30%, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '12px', left: '15px', fontSize: '1.2rem' }}>☁️</div>
            <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.2rem' }}>☀️</div>

            <div style={{ margin: '0 auto', display: 'inline-block', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }}>
              <AvatarIcon avatarId={currentUser.avatar} avatarConfig={currentUser.avatarConfig} size={110} />
            </div>

            <div style={{ marginTop: '12px', color: 'white', fontWeight: '900', fontSize: '1.3rem', textShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#f0fdf4', fontWeight: '700', marginTop: '2px' }}>
              {currentUser.title} • {currentUser.elo} Elo
            </div>
          </div>

          {/* Tarjeta del Tutor Activo */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <AvatarIcon avatarId={activeCoach.id} size={48} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', fontWeight: '800', textTransform: 'uppercase' }}>
                Tutor Activo
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                {activeCoach.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
                {activeCoach.title}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO DE LA SUBPESTAÑA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* PESTAÑA: TUTORES JUNVILL (HOMBRES, MUJERES, JÓVENES, SENIORS) */}
          {activeTab === 'tutores' && (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-parchment-main)', margin: '0 0 4px' }}>
                  Elige tu Entrenador Titular de Ajedrez Junvill
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: 0 }}>
                  Cada tutor cuenta con una metodología pedagógica, explicaciones y tono adaptados a distintas edades y estilos.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {COACHES_LIST.map((coach) => {
                  const isSelected = coach.id === activeCoach.id;
                  return (
                    <div
                      key={coach.id}
                      style={{
                        background: 'var(--bg-parchment-card)',
                        border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: isSelected ? '0 4px 14px rgba(245, 158, 11, 0.25)' : 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
                          <AvatarIcon avatarId={coach.id} size={56} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '800', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                              {coach.ageGroup === 'senior' ? 'Maestro Senior' : coach.ageGroup === 'young' ? 'Joven Talento' : 'Inteligencia IA'}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-parchment-muted)', fontWeight: '700' }}>
                              {coach.gender === 'female' ? 'Mujer' : coach.gender === 'male' ? 'Hombre' : 'Bot'}
                            </span>
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-parchment-main)', marginTop: '2px' }}>
                            {coach.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', fontWeight: '700' }}>
                            {coach.title}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-parchment-muted)', lineHeight: '1.35' }}>
                        {coach.description}
                      </div>

                      <div style={{ background: 'var(--bg-parchment)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-parchment-main)' }}>
                        "{coach.greeting}"
                      </div>

                      <button
                        onClick={() => handleSelectCoach(coach.id)}
                        className={isSelected ? "btn-gold" : "btn-secondary"}
                        style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '0.85rem' }}
                      >
                        {isSelected ? (
                          <>
                            <UserCheck size={16} />
                            <span>Tutor Activo ✅</span>
                          </>
                        ) : (
                          <span>Elegir a {coach.name.split(' ')[0]}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PESTAÑA: YO (ROPA Y AVATARES) */}
          {activeTab === 'yo' && (
            <div>
              {/* Botón Maestro para Abrir el Avatar Builder */}
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                color: 'white',
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 0 4px', color: '#fde047' }}>
                    🎨 Estudio Modular de Avatares
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#e0e7ff', margin: 0 }}>
                    Personaliza piel, cabello, ojos, expresiones, ropa, gorras, coronas y fondos en tiempo real.
                  </p>
                </div>

                <button
                  onClick={onOpenAvatarBuilder}
                  className="btn-gold"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  <Sparkles size={18} />
                  <span>Diseñar mi Avatar Único</span>
                </button>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-parchment-main)' }}>
                Avatares Rápidos Predefinidos
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {AVATAR_LIST.map((av) => {
                  const isSelected = currentUser.avatar === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => updateCurrentUser({ avatar: av.id, avatarConfig: null })}
                      style={{
                        background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment-card)',
                        border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        color: isSelected ? 'var(--color-gold-dark)' : 'var(--text-parchment-main)'
                      }}
                    >
                      <AvatarIcon avatarId={av.id} size={48} />
                      <span style={{ fontSize: '0.78rem', fontWeight: '800', marginTop: '6px', color: isSelected ? 'var(--color-gold-dark)' : '#f8fafc' }}>
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-parchment-main)' }}>
                Tienda de Trajes y Camisetas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {SHIRTS_STORE.map((shirt) => {
                  const isUnlocked = unlocked.includes(shirt.id) || shirt.cost === 0;
                  const isEquipped = currentUser.avatarConfig?.shirtColor === shirt.color;

                  return (
                    <button
                      key={shirt.id}
                      onClick={() => handleBuyOrEquipShirt(shirt)}
                      style={{
                        background: 'var(--bg-parchment-card)',
                        border: `1.5px solid ${isEquipped ? 'var(--color-success)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: shirt.color }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                            {shirt.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: isUnlocked ? 'var(--color-success)' : 'var(--color-gold-dark)', fontWeight: '700' }}>
                            {isUnlocked ? (isEquipped ? 'Equipada ✅' : 'Desbloqueada') : `⭐ ${shirt.cost} Estrellas`}
                          </div>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isEquipped ? 'var(--color-success)' : 'var(--color-primary)' }}>
                          {isEquipped ? 'Puesto' : 'Usar'}
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-gold-light)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: '800' }}>
                          <Lock size={12} />
                          <span>Comprar</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PESTAÑA: TABLEROS */}
          {activeTab === 'tablero' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-parchment-main)' }}>
                Diseños de Tablero de Ajedrez
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {BOARD_THEMES.map((b) => {
                  const isEquipped = currentUser.boardTheme === b.id;
                  const isUnlocked = unlocked.includes(b.id) || b.cost === 0;

                  return (
                    <button
                      key={b.id}
                      onClick={() => handleBuyOrEquipBoard(b)}
                      style={{
                        background: 'var(--bg-parchment-card)',
                        border: `2px solid ${isEquipped ? 'var(--color-primary)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '4px', height: '36px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ flex: 1, background: b.light }} />
                        <div style={{ flex: 1, background: b.dark }} />
                        <div style={{ flex: 1, background: b.light }} />
                        <div style={{ flex: 1, background: b.dark }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-parchment-main)' }}>
                            {b.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: isUnlocked ? 'var(--color-success)' : 'var(--color-gold-dark)', fontWeight: '700' }}>
                            {isUnlocked ? (isEquipped ? 'En uso ✅' : 'Comprado') : `⭐ ${b.cost} ${b.gems ? `+ 💎 ${b.gems}` : ''}`}
                          </div>
                        </div>

                        {isUnlocked ? (
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isEquipped ? 'var(--color-primary)' : 'var(--text-parchment-muted)' }}>
                            {isEquipped ? 'Activo' : 'Equipar'}
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-gold-light)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', color: 'var(--color-gold-dark)', fontSize: '0.75rem', fontWeight: '800' }}>
                            <Lock size={12} />
                            <span>Comprar</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PESTAÑA: TEMAS VISUALES DE LA APP */}
          {activeTab === 'app_theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { id: 'modern_dark', name: '🌟 Modo Moderno Dark & Gold (Adolescentes y Adultos)', desc: 'Fondo oscuro de alto contraste con detalles dorados y estética de campeonato.' },
                { id: 'kids_vibrant', name: '🌿 Modo ChessKid Alegre (Niños)', desc: 'Colores vivos, verde pradera y ambientación lúdica estimulante para los más pequeños.' },
                { id: 'classic_parchment', name: '📜 Modo Pergamino Clásico Junvill', desc: 'Estética cálida tradicional de madera y papel antiguo de academia.' },
              ].map((theme) => {
                const isSelected = (currentUser.theme || 'modern_dark') === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updateCurrentUser({ theme: theme.id })}
                    style={{
                      background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment-card)',
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
        </div>
      </div>
    </div>
  );
};
