import React, { useState } from 'react';
import { BOT_ROSTER } from '../../assets/botRoster';
import { CHESS_VARIANTS } from '../../engine/variantsEngine';
import { VariantRulesModal } from '../Variants/VariantRulesModal';
import { 
  Bot, Users, Globe, Play, Sparkles, X, Swords, Zap, 
  ArrowRight, ArrowLeft, GraduationCap, Trophy, ChevronRight, HelpCircle, BookOpen 
} from 'lucide-react';

export const GameModeModal = ({
  isOpen,
  onClose,
  onStartMatch,
  onSelectP2P,
  onOpenRobotsView,
  activeBot = null
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState(null); // 'bot' | 'pass_and_play' | null
  const [chosenBot, setChosenBot] = useState(activeBot || BOT_ROSTER[0]);
  const [rulesVariantId, setRulesVariantId] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedOpponent(null);
    setRulesVariantId(null);
    onClose();
  };

  const handleChooseOpponent = (mode) => {
    if (mode === 'p2p') {
      handleClose();
      if (onSelectP2P) onSelectP2P();
      return;
    }
    setSelectedOpponent(mode);
  };

  const handleSelectVariantAndStart = (variantId) => {
    if (onStartMatch) {
      onStartMatch({
        opponentMode: selectedOpponent || 'bot',
        bot: chosenBot,
        variantId
      });
    }
    handleClose();
  };

  const popularVariants = CHESS_VARIANTS.filter(v => v.category === 'popular');
  const learningVariants = CHESS_VARIANTS.filter(v => v.category === 'learning');

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 120, padding: '12px' }} onClick={handleClose}>
        <div
          className="modal-card"
          style={{
            maxWidth: '820px',
            width: '100%',
            padding: '24px',
            background: 'var(--bg-parchment-card)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg, 16px)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* CABECERA CON NAVEGACIÓN DE PASOS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-gold-light)',
                  color: 'var(--color-gold-dark)',
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: '900'
                }}>
                  <Swords size={13} />
                  <span>{selectedOpponent ? 'PASO 2 DE 2: ELIGE LA MODALIDAD' : 'PASO 1 DE 2: ELIGE OPONENTE'}</span>
                </div>

                {selectedOpponent && (
                  <button
                    type="button"
                    onClick={() => setSelectedOpponent(null)}
                    className="btn-secondary"
                    style={{ padding: '3px 10px', fontSize: '0.75rem', gap: '4px', height: '24px' }}
                    title="Volver a elegir oponente"
                  >
                    <ArrowLeft size={13} />
                    <span>Cambiar Oponente</span>
                  </button>
                )}
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
                {selectedOpponent 
                  ? '¿Qué modalidad o variante deseas jugar?' 
                  : '¿Con quién quieres jugar hoy?'}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}
              title="Cerrar ventana"
            >
              <X size={22} />
            </button>
          </div>

          {/* =========================================================================
              PASO 1: SELECCIÓN DE OPONENTE (ROBOT / 2 JUGADORES / ONLINE P2P)
             ========================================================================= */}
          {!selectedOpponent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* 1. MODO ROBOT / IA */}
                <div
                  onClick={() => handleChooseOpponent('bot')}
                  style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(30, 58, 138, 0.25) 100%)',
                    border: '2px solid #3b82f6',
                    borderRadius: 'var(--radius-md, 12px)',
                    padding: '18px',
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
                          <Bot size={20} />
                        </div>
                        <div style={{ fontWeight: '900', color: '#60a5fa', fontSize: '1.1rem' }}>
                          Contra Robots & IA
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                        Con Tutor
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '0 0 12px', lineHeight: '1.4' }}>
                      Juega contra <b>{chosenBot.name}</b> ({chosenBot.elo} Elo) con explicaciones pedagógicas en vivo y pistas.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '0.84rem', justifyContent: 'center' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseOpponent('bot');
                      }}
                    >
                      <span>Elegir Variante vs {chosenBot.name}</span>
                      <ChevronRight size={15} />
                    </button>
                    {onOpenRobotsView && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '9px 10px', fontSize: '0.80rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClose();
                          onOpenRobotsView();
                        }}
                        title="Ver todos los robots"
                      >
                        <span>Cambiar Bot</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. MODO 2 JUGADORES EN EL MISMO DISPOSITIVO */}
                <div
                  onClick={() => handleChooseOpponent('pass_and_play')}
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
                    border: '2px solid #10b981',
                    borderRadius: 'var(--radius-md, 12px)',
                    padding: '18px',
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
                          <Users size={20} />
                        </div>
                        <div style={{ fontWeight: '900', color: '#34d399', fontSize: '1.1rem' }}>
                          Dos Jugadores
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                        Pasa y Juega
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '0 0 12px', lineHeight: '1.4' }}>
                      Juega cara a cara con un amigo, hermano, hijo o alumno compartiendo la misma pantalla en turnos alternos.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-gold"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', justifyContent: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseOpponent('pass_and_play');
                    }}
                  >
                    <span>Elegir Variante para 2 Jugadores</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* 3. MODO ONLINE MULTIJUGADOR P2P */}
              <div
                onClick={() => handleChooseOpponent('p2p')}
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(120, 53, 15, 0.25) 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: 'var(--radius-md, 12px)',
                  padding: '16px 20px',
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
                      Partida Online con Amigos (Multijugador P2P)
                    </div>
                  </div>
                  <p style={{ fontSize: '0.80rem', color: 'var(--text-parchment-muted)', margin: 0, lineHeight: '1.4' }}>
                    Crea una sala privada, escanea el código QR o comparte el enlace para jugar a distancia sin servidores intermedios.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-gold"
                  style={{ padding: '10px 18px', fontSize: '0.88rem', fontWeight: '900' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChooseOpponent('p2p');
                  }}
                >
                  <span>Abrir Sala Online 🚀</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PASO 2: CATÁLOGO DE MODALIDADES Y VARIANTES PEDAGÓGICAS
             ========================================================================= */}
          {selectedOpponent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Banner Informativo del Oponente Seleccionado */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '8px',
                border: '1px solid var(--bg-parchment-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                  <span>🎯 Oponente:</span>
                  <span style={{ color: 'var(--color-gold)' }}>
                    {selectedOpponent === 'bot' 
                      ? `Robot ${chosenBot.name} (${chosenBot.elo} Elo)` 
                      : '2 Jugadores (Pasa y Juega)'}
                  </span>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                  Selecciona una modalidad para comenzar:
                </span>
              </div>

              {/* SECCIÓN 1: MODALIDADES PRINCIPALES Y POPULARES */}
              <div>
                <div style={{ fontSize: '0.80rem', fontWeight: '900', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="#f59e0b" />
                  <span>Modalidades Populares & Familiares:</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
                  {popularVariants.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => handleSelectVariantAndStart(variant.id)}
                      style={{
                        background: variant.borderGradient,
                        border: `1.5px solid ${variant.borderColor}`,
                        borderRadius: 'var(--radius-md, 10px)',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                      className="variant-card-hover"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: variant.borderColor, fontSize: '0.94rem' }}>
                            <span>{variant.icon}</span>
                            <span>{variant.name}</span>
                          </div>
                          <span style={{ fontSize: '0.66rem', background: variant.borderColor, color: 'white', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                            {variant.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)', margin: '0 0 8px', lineHeight: '1.3' }}>
                          {variant.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ flex: 1, padding: '6px', fontSize: '0.76rem', justifyContent: 'center', color: variant.borderColor, borderColor: variant.borderColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVariantAndStart(variant.id);
                          }}
                        >
                          <span>Jugar {variant.name}</span>
                        </button>
                        {variant.id !== 'standard' && (
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '6px 8px', fontSize: '0.72rem', gap: '3px', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--text-parchment-muted)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRulesVariantId(variant.id);
                            }}
                            title={`Ver reglas mínimas de ${variant.name}`}
                          >
                            <HelpCircle size={13} />
                            <span>Reglas</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECCIÓN 2: MINIJUEGOS PEDAGÓGICOS DE APRENDIZAJE PROGRESIVO */}
              <div>
                <div style={{ fontSize: '0.80rem', fontWeight: '900', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} color="#10b981" />
                  <span>Minijuegos Pedagógicos de Entrenamiento Progresivo:</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
                  {learningVariants.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => handleSelectVariantAndStart(variant.id)}
                      style={{
                        background: variant.borderGradient,
                        border: `1.5px solid ${variant.borderColor}`,
                        borderRadius: 'var(--radius-md, 10px)',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                      className="variant-card-hover"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: variant.borderColor, fontSize: '0.94rem' }}>
                            <span>{variant.icon}</span>
                            <span>{variant.name}</span>
                          </div>
                          <span style={{ fontSize: '0.66rem', background: variant.borderColor, color: 'white', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                            {variant.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)', margin: '0 0 8px', lineHeight: '1.3' }}>
                          {variant.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ flex: 1, padding: '6px', fontSize: '0.76rem', justifyContent: 'center', color: variant.borderColor, borderColor: variant.borderColor }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVariantAndStart(variant.id);
                          }}
                        >
                          <span>Practicar {variant.name}</span>
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '6px 8px', fontSize: '0.72rem', gap: '3px', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--text-parchment-muted)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRulesVariantId(variant.id);
                          }}
                          title={`Ver reglas mínimas de ${variant.name}`}
                        >
                          <HelpCircle size={13} />
                          <span>Reglas</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE REGLAS ESPECÍFICAS DE LA VARIANTE */}
      <VariantRulesModal
        isOpen={Boolean(rulesVariantId)}
        onClose={() => setRulesVariantId(null)}
        variantId={rulesVariantId}
      />
    </>
  );
};
