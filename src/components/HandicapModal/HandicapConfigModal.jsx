import React, { useState } from 'react';
import { 
  PIECE_ODDS_OPTIONS, 
  ASSISTANCE_PRESETS,
  DEFAULT_HANDICAP_CONFIG, 
  getHandicapFen, 
  getHandicapSummary 
} from '../../engine/handicapEngine';
import { 
  X, Check, Sparkles, Swords, Lightbulb, RotateCcw, Eye, ShieldAlert, 
  ChevronRight, ArrowRight, ShieldCheck, Scale, Zap, Users, Bot, RefreshCw,
  Plus, Minus, Sliders
} from 'lucide-react';

export const HandicapConfigModal = ({
  isOpen,
  onClose,
  initialConfig = DEFAULT_HANDICAP_CONFIG,
  onApplyConfig,
  gameMode = 'bot', // 'bot' | 'pass_and_play' | 'p2p'
  opponentName = 'Rival',
  playerName = 'Jugador',
  isOnlineP2P = false,
  onSendP2POffer = null
}) => {
  const [config, setConfig] = useState(initialConfig || DEFAULT_HANDICAP_CONFIG);

  // Estados del flujo de negociación (Humano vs Humano en 3 Rondas)
  const [negotiationStep, setNegotiationStep] = useState(1);
  const [activeNegotiator, setActiveNegotiator] = useState(playerName);
  const [offerHistory, setOfferHistory] = useState([]);

  if (!isOpen) return null;

  const isHumanVsHuman = gameMode === 'pass_and_play' || gameMode === 'p2p';

  // Aplicar un Preset Predefinido
  const handleSelectPreset = (preset) => {
    if (preset.id === 'custom') {
      setConfig(prev => ({
        ...prev,
        presetId: 'custom'
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        presetId: preset.id,
        ...preset.config
      }));
    }
  };

  const handleTogglePieceOdds = (oddsId) => {
    setConfig(prev => ({
      ...prev,
      pieceOdds: oddsId
    }));
  };

  // Modos de Pistas
  const handleSetHintsMode = (mode) => {
    setConfig(prev => ({
      ...prev,
      presetId: 'custom',
      hintsMode: mode,
      hintsCount: mode === 'limited' ? (prev.hintsCount > 0 && prev.hintsCount < 99 ? prev.hintsCount : 3) : prev.hintsCount
    }));
  };

  const handleChangeHintsCount = (delta) => {
    setConfig(prev => {
      const nextCount = Math.max(1, Math.min(20, (prev.hintsCount || 3) + delta));
      return {
        ...prev,
        presetId: 'custom',
        hintsMode: 'limited',
        hintsCount: nextCount
      };
    });
  };

  // Modos de Deshacer
  const handleSetTakebacksMode = (mode) => {
    setConfig(prev => ({
      ...prev,
      presetId: 'custom',
      takebacksMode: mode,
      takebacksCount: mode === 'limited' ? (prev.takebacksCount > 0 && prev.takebacksCount < 99 ? prev.takebacksCount : 2) : prev.takebacksCount
    }));
  };

  const handleChangeTakebacksCount = (delta) => {
    setConfig(prev => {
      const nextCount = Math.max(1, Math.min(20, (prev.takebacksCount || 2) + delta));
      return {
        ...prev,
        presetId: 'custom',
        takebacksMode: 'limited',
        takebacksCount: nextCount
      };
    });
  };

  const handleToggleBoolean = (key) => {
    setConfig(prev => ({
      ...prev,
      presetId: 'custom',
      [key]: !prev[key]
    }));
  };

  // Enviar / Confirmar en Modo Bot
  const handleConfirmBotMode = () => {
    onApplyConfig(config);
    onClose();
  };

  // Enviar / Negociar en Modo Humano vs Humano Local (Pasar y Jugar)
  const handleLocalOffer = (isAccept = false, isReject = false) => {
    if (isAccept) {
      onApplyConfig(config);
      onClose();
      return;
    }

    if (isReject) {
      // Rechazar ➔ Partida competitiva estándar sin ventajas
      const standardConfig = {
        ...DEFAULT_HANDICAP_CONFIG,
        enabled: false,
        presetId: 'competitive',
        pieceOdds: 'none',
        hintsMode: 'off',
        takebacksMode: 'off',
        visualMoveGuide: false,
        blunderWarning: false
      };
      onApplyConfig(standardConfig);
      onClose();
      return;
    }

    // Replantear / Contra-propuesta
    if (negotiationStep === 1) {
      setOfferHistory(prev => [...prev, { from: playerName, config }]);
      setNegotiationStep(2);
      setActiveNegotiator(opponentName);
    } else if (negotiationStep === 2) {
      setOfferHistory(prev => [...prev, { from: opponentName, config }]);
      setNegotiationStep(3);
      setActiveNegotiator(playerName);
    }
  };

  // Enviar oferta P2P
  const handleP2POffer = () => {
    if (onSendP2POffer) {
      onSendP2POffer(config, negotiationStep);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 130 }} onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '96%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px',
          overflow: 'hidden',
          border: '2px solid var(--color-gold)'
        }}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Scale size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.28rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
                Ajuste de Ventajas y Nivel de Asistencia
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-parchment-muted)', margin: 0 }}>
                {gameMode === 'bot' 
                  ? 'Configura asistencias o piezas de ventaja contra la IA'
                  : `Negociación de ventaja entre ${playerName} y ${opponentName}`}
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* INDICADOR DE RONDA EN MODO HUMANO VS HUMANO */}
        {isHumanVsHuman && (
          <div style={{
            background: negotiationStep === 3 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)',
            border: negotiationStep === 3 ? '1.5px solid #ef4444' : '1.5px solid #3b82f6',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: '900', color: negotiationStep === 3 ? '#ef4444' : '#3b82f6' }}>
                {negotiationStep === 1 ? 'Ronda 1 de 3: Propuesta Inicial' : negotiationStep === 2 ? 'Ronda 2 de 3: Contra-propuesta' : 'Ronda 3 de 3: Decisión Final'}
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginTop: '2px' }}>
                Turno de negociar: <strong>{activeNegotiator}</strong>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', background: 'var(--bg-parchment-card)', padding: '4px 8px', borderRadius: '8px', fontWeight: '800', color: 'var(--text-parchment-muted)' }}>
              Máx. 3 Rondas
            </span>
          </div>
        )}

        {/* CONTENIDO SCROLLABLE */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. SECCIÓN: PERFILES DE AYUDA PREDEFINIDOS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sliders size={18} color="var(--color-primary)" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                Perfiles de Ayuda Predefinidos
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {ASSISTANCE_PRESETS.map(preset => {
                const isSelected = config.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                      border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: '900', fontSize: '0.82rem', color: isSelected ? 'var(--color-gold-dark)' : 'var(--text-parchment-main)' }}>
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SECCIÓN: ASISTENCIAS PEDAGÓGICAS (CON CONTADORES NUMÉRICOS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lightbulb size={18} color="#f59e0b" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                Personalizar Asistencias de Juego
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              
              {/* CONTROL 1: PISTAS DEL PROFESOR DON AURELIO */}
              <div style={{
                background: config.hintsMode !== 'off' ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-parchment)',
                border: config.hintsMode !== 'off' ? '1.5px solid #f59e0b' : '1px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lightbulb size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                        Pistas del Gran Maestro
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)' }}>
                        Consejos progresivos del tutor
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modos de Pistas: Ilimitadas / Con Límite / Desactivadas */}
                <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-parchment-card)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    type="button"
                    onClick={() => handleSetHintsMode('unlimited')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.hintsMode === 'unlimited' ? '#f59e0b' : 'transparent',
                      color: config.hintsMode === 'unlimited' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Ilimitadas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetHintsMode('limited')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.hintsMode === 'limited' ? '#f59e0b' : 'transparent',
                      color: config.hintsMode === 'limited' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Con Límite
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetHintsMode('off')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.hintsMode === 'off' ? '#64748b' : 'transparent',
                      color: config.hintsMode === 'off' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Apagadas
                  </button>
                </div>

                {/* Contador Numérico de Pistas (si está en modo limited) */}
                {config.hintsMode === 'limited' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-parchment)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-parchment-border)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                      Cantidad por partida:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleChangeHintsCount(-1)}
                        style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--bg-parchment-border)', background: 'var(--bg-parchment-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#f59e0b', minWidth: '22px', textAlign: 'center' }}>
                        {config.hintsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeHintsCount(1)}
                        style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--bg-parchment-border)', background: 'var(--bg-parchment-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTROL 2: DESHACER JUGADAS (TAKEBACKS) */}
              <div style={{
                background: config.takebacksMode !== 'off' ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-parchment)',
                border: config.takebacksMode !== 'off' ? '1.5px solid #3b82f6' : '1px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RotateCcw size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                        Deshacer Jugadas (Retroceder)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)' }}>
                        Rectifica jugadas en caso de error
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modos de Deshacer: Ilimitado / Con Límite / Desactivado */}
                <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-parchment-card)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    type="button"
                    onClick={() => handleSetTakebacksMode('unlimited')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.takebacksMode === 'unlimited' ? '#3b82f6' : 'transparent',
                      color: config.takebacksMode === 'unlimited' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Ilimitado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTakebacksMode('limited')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.takebacksMode === 'limited' ? '#3b82f6' : 'transparent',
                      color: config.takebacksMode === 'limited' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Con Límite
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetTakebacksMode('off')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: config.takebacksMode === 'off' ? '#64748b' : 'transparent',
                      color: config.takebacksMode === 'off' ? '#fff' : 'var(--text-parchment-muted)'
                    }}
                  >
                    Apagado
                  </button>
                </div>

                {/* Contador Numérico de Deshacer (si está en modo limited) */}
                {config.takebacksMode === 'limited' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-parchment)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-parchment-border)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                      Cantidad por partida:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleChangeTakebacksCount(-1)}
                        style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--bg-parchment-border)', background: 'var(--bg-parchment-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#3b82f6', minWidth: '22px', textAlign: 'center' }}>
                        {config.takebacksCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeTakebacksCount(1)}
                        style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--bg-parchment-border)', background: 'var(--bg-parchment-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTROL 3: GUÍA VISUAL DE CASILLAS */}
              <div 
                onClick={() => handleToggleBoolean('visualMoveGuide')}
                style={{
                  background: config.visualMoveGuide ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-parchment)',
                  border: config.visualMoveGuide ? '1.5px solid #10b981' : '1px solid var(--bg-parchment-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                    Guía Visual de Casillas
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)' }}>
                    Muestra puntos verdes en destinos legales
                  </div>
                </div>
                <input type="checkbox" checked={config.visualMoveGuide} onChange={() => {}} />
              </div>

              {/* CONTROL 4: ALERTA DE PELIGRO */}
              <div 
                onClick={() => handleToggleBoolean('blunderWarning')}
                style={{
                  background: config.blunderWarning ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-parchment)',
                  border: config.blunderWarning ? '1.5px solid #ef4444' : '1px solid var(--bg-parchment-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                    Alerta de Peligro
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)' }}>
                    Avisa si una pieza queda colgada
                  </div>
                </div>
                <input type="checkbox" checked={config.blunderWarning} onChange={() => {}} />
              </div>

            </div>
          </div>

          {/* 3. SECCIÓN: HÁNDICAP DE PIEZAS (RENUNCIA A FICHAS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Swords size={18} color="var(--color-primary)" />
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '900', color: 'var(--text-parchment-main)' }}>
                Hándicap de Piezas (Renuncia a Fichas)
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
              {PIECE_ODDS_OPTIONS.map(opt => {
                const isSelected = config.pieceOdds === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleTogglePieceOdds(opt.id)}
                    style={{
                      background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                      border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '0.86rem', color: isSelected ? 'var(--color-gold-dark)' : 'var(--text-parchment-main)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                        {opt.description}
                      </div>
                    </div>
                    {isSelected && <Check size={18} color="var(--color-gold-dark)" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESUMEN ACTUAL EN TIEMPO REAL */}
          <div style={{ background: 'var(--bg-parchment)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-parchment-border)' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', fontWeight: '800' }}>
              Resumen de la configuración seleccionada:
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginTop: '2px' }}>
              {getHandicapSummary(config)}
            </div>
          </div>

        </div>

        {/* BOTONES DE ACCIÓN SEGÚN EL MODO */}
        <div style={{ marginTop: '14px', borderTop: '1.5px solid var(--bg-parchment-border)', paddingTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* CASO 1: MODO CONTRA ROBOT (IA) */}
          {gameMode === 'bot' && (
            <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
              <button
                type="button"
                onClick={handleConfirmBotMode}
                className="btn-gold"
                style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
              >
                <Sparkles size={16} />
                <span>¡Aplicar y Comenzar vs {opponentName}!</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '12px 18px', fontSize: '0.92rem' }}
              >
                Cancelar
              </button>
            </div>
          )}

          {/* CASO 2: MODO ONLINE P2P */}
          {isOnlineP2P && (
            <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
              <button
                type="button"
                onClick={handleP2POffer}
                className="btn-gold"
                style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
              >
                <ArrowRight size={16} />
                <span>Enviar Propuesta a {opponentName}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '12px 18px', fontSize: '0.92rem' }}
              >
                Cancelar
              </button>
            </div>
          )}

          {/* CASO 3: MODO 2 JUGADORES LOCAL (PASAR Y JUGAR CON NEGOCIACIÓN) */}
          {gameMode === 'pass_and_play' && (
            <div style={{ display: 'flex', width: '100%', gap: '8px', flexWrap: 'wrap' }}>
              {negotiationStep < 3 ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleLocalOffer(true, false)}
                    className="btn-gold"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    <Check size={16} />
                    <span>✅ Aceptar y Jugar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLocalOffer(false, false)}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    <RefreshCw size={16} />
                    <span>🔄 Replantear ({opponentName})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLocalOffer(false, true)}
                    className="btn-secondary"
                    style={{ padding: '10px 14px', fontSize: '0.88rem', color: '#ef4444' }}
                  >
                    <span>❌ Modo Competitivo</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleLocalOffer(true, false)}
                    className="btn-gold"
                    style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.92rem' }}
                  >
                    <Check size={16} />
                    <span>✅ Aceptar Última Oferta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLocalOffer(false, true)}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.92rem', color: '#ef4444' }}
                  >
                    <span>❌ Modo Competitivo</span>
                  </button>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
