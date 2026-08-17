import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { AvatarIcon } from '../assets/avatars';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { BOT_ROSTER } from '../assets/botRoster';
import confetti from 'canvas-confetti';
import { 
  X, Trophy, Sparkles, Gift, Star, Award, Heart, Shield, Plus, 
  Trash2, Edit3, CheckCircle2, Clock, Flame, Compass, ChevronRight,
  UserCheck, Users, HelpCircle, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';

const PERIOD_LABELS = {
  daily: { label: 'Diario', icon: '☀️', color: '#f59e0b', bg: '#fef3c7' },
  weekly: { label: 'Semanal', icon: '🗓️', color: '#3b82f6', bg: '#dbeafe' },
  monthly: { label: 'Mensual', icon: '🏆', color: '#8b5cf6', bg: '#ede9fe' },
  quarterly: { label: 'Trimestral', icon: '🥇', color: '#10b981', bg: '#d1fae5' },
  annual: { label: 'Anual', icon: '👑', color: '#ec4899', bg: '#fce7f3' }
};

const SUGGESTED_TEMPLATES = [
  {
    title: 'Mente Caliente Diaria',
    period: 'daily',
    category: 'daily_challenge',
    target: 1,
    description: 'Completar el Reto Diario de Don Aurelio para calentar la mente.',
    rewardType: 'surprise',
    secretReward: '¡Elegir el postre o la merienda de hoy! 🍨',
    inGameReward: { stars: 20, gems: 5 }
  },
  {
    title: 'Táctico Imparable',
    period: 'daily',
    category: 'puzzles',
    target: 5,
    description: 'Resolver 5 problemas de táctica en el módulo de problemas.',
    rewardType: 'in_game',
    secretReward: '',
    inGameReward: { stars: 30, gems: 8 }
  },
  {
    title: 'Explorador Curricular',
    period: 'weekly',
    category: 'lessons',
    target: 3,
    description: 'Completar 3 lecciones curriculares con 5 estrellas ⭐⭐⭐⭐⭐.',
    rewardType: 'surprise',
    secretReward: '¡Noche de pizza familiar o salida al parque! 🍕🌳',
    inGameReward: { stars: 50, gems: 15 }
  },
  {
    title: 'Cazador de Robots',
    period: 'weekly',
    category: 'bots',
    target: 2,
    description: 'Derrotar a 2 robots de ajedrez diferentes.',
    rewardType: 'real_world',
    secretReward: '30 minutos extra de tiempo libre este fin de semana 🎮',
    inGameReward: { stars: 40, gems: 10 }
  },
  {
    title: 'Gran Maestro Mensual',
    period: 'monthly',
    category: 'lessons',
    target: 10,
    description: 'Completar 10 lecciones oficiales del método.',
    rewardType: 'surprise',
    secretReward: '¡Un libro de ajedrez o juguete especial acordado con Papá/Mamá! 🎁',
    inGameReward: { stars: 100, gems: 30 }
  },
  {
    title: 'Subidón de Elo',
    period: 'monthly',
    category: 'elo',
    target: 600,
    description: 'Alcanzar 600 o más puntos de Elo en tu perfil.',
    rewardType: 'real_world',
    secretReward: '¡Diploma especial y salida a tu restaurante favorito! 🍔',
    inGameReward: { stars: 80, gems: 25 }
  }
];

export const FamilyChallengesModal = ({ isOpen, onClose }) => {
  const { 
    users, 
    currentUser, 
    activeUserId, 
    addCustomChallenge, 
    editCustomChallenge, 
    deleteCustomChallenge, 
    toggleManualChallenge, 
    claimChallengeReward 
  } = useUser();

  const [activeTab, setActiveTab] = useState('child_view'); // 'child_view' | 'parent_panel'
  const [selectedParentRole, setSelectedParentRole] = useState('Papá'); // 'Papá' | 'Mamá' | 'Tutor'
  const [selectedChildId, setSelectedChildId] = useState(currentUser?.id || users[0]?.id);
  const [periodFilter, setPeriodFilter] = useState('all'); // 'all' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  
  // Estado para crear/editar reto
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false);
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    period: 'daily',
    category: 'lessons',
    target: 1,
    rewardType: 'surprise',
    rewardTitle: 'Premio Sorpresa',
    secretReward: '',
    starsReward: 25,
    gemsReward: 5
  });

  // Estado para el modal de apertura de cofre
  const [revealedReward, setRevealedReward] = useState(null);

  if (!isOpen) return null;

  // Obtener el hijo seleccionado para el panel de padres
  const targetChild = users.find(u => u.id === (activeTab === 'child_view' ? currentUser.id : selectedChildId)) || currentUser;
  const childChallenges = targetChild?.customChallenges || [];

  // Calcular progreso real del reto según las métricas del usuario
  const calculateProgress = (challenge, user) => {
    if (challenge.completed) return { current: challenge.target, isComplete: true, percent: 100 };

    let current = 0;
    const target = Number(challenge.target) || 1;

    switch (challenge.category) {
      case 'lessons':
        const completedLessons = Object.values(user.lessonProgress || {}).filter(p => p.completed || p.stars >= 5).length;
        current = completedLessons;
        break;
      case 'daily_challenge':
        current = 0; // Se evalúa o completa manualmente
        break;
      case 'puzzles':
        current = user.stats?.puzzlesSolved || 0;
        break;
      case 'bots':
        current = Object.keys(user.botVictories || {}).length;
        break;
      case 'elo':
        current = user.elo || 400;
        break;
      case 'games':
        current = user.stats?.gamesPlayed || 0;
        break;
      default:
        current = 0;
        break;
    }

    const isComplete = current >= target;
    const percent = Math.min(100, Math.round((current / target) * 100));
    return { current, isComplete, percent };
  };

  // Manejar reclamo de recompensa por el niño
  const handleClaim = (challenge) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const claimed = claimChallengeReward(targetChild.id, challenge.id);
    setRevealedReward(challenge);
  };

  // Manejar guardar reto (crear o editar)
  const handleSaveChallenge = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const challengePayload = {
      title: formData.title,
      description: formData.description,
      period: formData.period,
      category: formData.category,
      target: formData.target,
      rewardType: formData.rewardType,
      rewardTitle: formData.rewardType === 'surprise' ? '🎁 Premio Sorpresa' : formData.title,
      secretReward: formData.secretReward,
      inGameReward: {
        stars: Number(formData.starsReward) || 0,
        gems: Number(formData.gemsReward) || 0
      },
      assignedBy: selectedParentRole
    };

    if (editingChallengeId) {
      editCustomChallenge(selectedChildId, editingChallengeId, challengePayload);
    } else {
      addCustomChallenge(selectedChildId, challengePayload);
    }

    setIsCreatingChallenge(false);
    setEditingChallengeId(null);
    // Reset form
    setFormData({
      title: '',
      description: '',
      period: 'daily',
      category: 'lessons',
      target: 1,
      rewardType: 'surprise',
      rewardTitle: 'Premio Sorpresa',
      secretReward: '',
      starsReward: 25,
      gemsReward: 5
    });
  };

  // Cargar plantilla sugerida en el formulario
  const handleSelectTemplate = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      period: template.period,
      category: template.category,
      target: template.target,
      rewardType: template.rewardType,
      rewardTitle: template.rewardType === 'surprise' ? '🎁 Premio Sorpresa' : template.title,
      secretReward: template.secretReward,
      starsReward: template.inGameReward.stars,
      gemsReward: template.inGameReward.gems
    });
  };

  // Iniciar edición de un reto existente
  const handleStartEdit = (challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description || '',
      period: challenge.period || 'daily',
      category: challenge.category || 'custom',
      target: challenge.target || 1,
      rewardType: challenge.rewardType || 'surprise',
      rewardTitle: challenge.rewardTitle || 'Premio Sorpresa',
      secretReward: challenge.secretReward || '',
      starsReward: challenge.inGameReward?.stars || 25,
      gemsReward: challenge.inGameReward?.gems || 5
    });
    setEditingChallengeId(challenge.id);
    setIsCreatingChallenge(true);
  };

  const filteredChallenges = childChallenges.filter(ch => {
    if (periodFilter === 'all') return true;
    return ch.period === periodFilter;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Cabecera Principal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 3px 8px rgba(245, 158, 11, 0.35)' }}>
              <Trophy size={24} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
                Misiones & Retos Familiares
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-parchment-muted)', margin: 0 }}>
                Objetivos, constancia y premios especiales de Mamá y Papá
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Pestañas de Vista: Vista del Niño vs Panel de Papás */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => { setActiveTab('child_view'); setIsCreatingChallenge(false); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'child_view' ? '2px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
              background: activeTab === 'child_view' ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
              color: activeTab === 'child_view' ? 'var(--color-gold-dark)' : 'var(--text-parchment-muted)',
              fontWeight: '900',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Gift size={18} />
            <span>🌟 Mis Misiones & Cofres ({childChallenges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('parent_panel')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'parent_panel' ? '2px solid var(--color-primary)' : '1px solid var(--bg-parchment-border)',
              background: activeTab === 'parent_panel' ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-parchment)',
              color: activeTab === 'parent_panel' ? 'var(--color-primary)' : 'var(--text-parchment-muted)',
              fontWeight: '900',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Shield size={18} />
            <span>🛡️ Panel de Papá & Mamá (Editor)</span>
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL SCROLLABLE */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ========================================================
              VISTA 1: VISTA DEL NIÑO (MIS MISIONES & COFRES)
             ======================================================== */}
          {activeTab === 'child_view' && (
            <div>
              {/* Filtros de Periodicidad */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '14px' }}>
                <button
                  onClick={() => setPeriodFilter('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: periodFilter === 'all' ? '1.5px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                    background: periodFilter === 'all' ? 'var(--color-gold-light)' : 'transparent',
                    color: periodFilter === 'all' ? 'var(--color-gold-dark)' : 'var(--text-parchment-muted)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Todos ({childChallenges.length})
                </button>
                {Object.entries(PERIOD_LABELS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setPeriodFilter(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: periodFilter === key ? `1.5px solid ${config.color}` : '1px solid var(--bg-parchment-border)',
                      background: periodFilter === key ? config.bg : 'transparent',
                      color: periodFilter === key ? config.color : 'var(--text-parchment-muted)',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>

              {/* Lista de Retos del Niño */}
              {filteredChallenges.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg-parchment)', borderRadius: 'var(--radius-lg)', border: '1.5px dashed var(--bg-parchment-border)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎁</div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-parchment-main)', margin: '0 0 6px', fontWeight: '900' }}>
                    ¡Aún no hay retos activos en esta categoría!
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
                    Pídele a Papá o Mamá que te asigne una misión diaria, semanal o mensual con premios sorpresa.
                  </p>
                  <button
                    onClick={() => setActiveTab('parent_panel')}
                    className="btn-gold"
                    style={{ margin: '0 auto', fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    <Plus size={16} />
                    <span>Crear un Reto como Papá/Mamá</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredChallenges.map(ch => {
                    const periodInfo = PERIOD_LABELS[ch.period] || PERIOD_LABELS.daily;
                    const { current, isComplete, percent } = calculateProgress(ch, targetChild);

                    return (
                      <div
                        key={ch.id}
                        style={{
                          background: 'var(--bg-parchment-card)',
                          border: isComplete && !ch.claimed ? '2px solid #10b981' : '1.5px solid var(--bg-parchment-border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '16px 18px',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          position: 'relative'
                        }}
                      >
                        {/* Cabecera del Reto */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.74rem', background: periodInfo.bg, color: periodInfo.color, padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                                {periodInfo.icon} {periodInfo.label}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontWeight: '800' }}>
                                Asignado por {ch.assignedBy || 'Papá'} ❤️
                              </span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                              {ch.title}
                            </h4>
                            {ch.description && (
                              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-parchment-muted)' }}>
                                {ch.description}
                              </p>
                            )}
                          </div>

                          {/* Recompensa Badge */}
                          <div>
                            {ch.rewardType === 'surprise' ? (
                              <div style={{ background: '#fef3c7', border: '1.5px solid #f59e0b', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>🎁</span>
                                <span>Premio Sorpresa</span>
                              </div>
                            ) : ch.rewardType === 'real_world' ? (
                              <div style={{ background: '#dcfce7', border: '1.5px solid #10b981', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>🏆</span>
                                <span>{ch.secretReward || 'Premio Real'}</span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {ch.inGameReward?.stars > 0 && (
                                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                                    ⭐ +{ch.inGameReward.stars}
                                  </span>
                                )}
                                {ch.inGameReward?.gems > 0 && (
                                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                                    💎 +{ch.inGameReward.gems}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Barra de Progreso */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-parchment-muted)', marginBottom: '4px' }}>
                            <span>Progreso</span>
                            <span>{current} / {ch.target} ({percent}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--bg-parchment)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: isComplete ? '#10b981' : 'var(--color-primary)', transition: 'width 0.3s ease' }} />
                          </div>
                        </div>

                        {/* Botón de Reclamo si ya está completado */}
                        {isComplete && !ch.claimed && (
                          <button
                            onClick={() => handleClaim(ch)}
                            className="btn-gold"
                            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem', gap: '8px', animation: 'pulse 1.5s infinite' }}
                          >
                            <Sparkles size={18} />
                            <span>¡Objetivo Logrado! Abrir Cofre / Reclamar Premio</span>
                          </button>
                        )}

                        {ch.claimed && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.82rem', fontWeight: '900', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                            <CheckCircle2 size={16} />
                            <span>¡Completado y Reclamado! Disfruta tu premio 🎉</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VISTA 2: PANEL DE PAPÁ & MAMÁ (ADMINISTRADOR)
             ======================================================== */}
          {activeTab === 'parent_panel' && (
            <div>
              {/* 1. Selector de Quién está administrando (Mamá o Papá) */}
              <div style={{ background: 'var(--bg-parchment)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-parchment-border)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                      ¿Quién administra los retos hoy?
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Papá', 'Mamá', 'Profesor'].map(role => (
                      <button
                        key={role}
                        onClick={() => setSelectedParentRole(role)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: selectedParentRole === role ? '2px solid var(--color-primary)' : '1px solid var(--bg-parchment-border)',
                          background: selectedParentRole === role ? 'var(--color-primary)' : 'var(--bg-parchment-card)',
                          color: selectedParentRole === role ? '#fff' : 'var(--text-parchment-muted)',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {role === 'Papá' ? '👨 Papá' : role === 'Mamá' ? '👩 Mamá' : '🎓 Profesor'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Selector de Hijo/a a Administrar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '900', color: 'var(--text-parchment-main)', marginBottom: '8px' }}>
                  Selecciona al Hijo / Estudiante a Administrar:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {users.map(u => {
                    const isSelected = selectedChildId === u.id;
                    const challengeCount = (u.customChallenges || []).length;

                    return (
                      <div
                        key={u.id}
                        onClick={() => { setSelectedChildId(u.id); setIsCreatingChallenge(false); }}
                        style={{
                          background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment-card)',
                          border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--bg-parchment-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden' }}>
                          {u.avatarConfig ? (
                            <DynamicAvatar config={u.avatarConfig} size={36} />
                          ) : (
                            <AvatarIcon avatarId={u.avatar || 'teen_gamer'} size={36} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: '900', fontSize: '0.88rem', color: 'var(--text-parchment-main)' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>
                            {challengeCount} {challengeCount === 1 ? 'reto asignado' : 'retos asignados'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón para abrir creador de retos */}
              {!isCreatingChallenge && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                    Retos de {targetChild.name} ({childChallenges.length})
                  </h4>

                  <button
                    onClick={() => {
                      setIsCreatingChallenge(true);
                      setEditingChallengeId(null);
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.84rem', gap: '6px' }}
                  >
                    <Plus size={16} />
                    <span>+ Crear Nuevo Reto para {targetChild.name}</span>
                  </button>
                </div>
              )}

              {/* 3. Formulario de Creación / Edición de Retos */}
              {isCreatingChallenge ? (
                <div style={{ background: 'var(--bg-parchment-card)', border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-primary)', fontWeight: '900' }}>
                      {editingChallengeId ? '✏️ Editar Reto' : `🎯 Asignar Nuevo Reto para ${targetChild.name}`}
                    </h4>
                    <button
                      onClick={() => setIsCreatingChallenge(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Plantillas Rápidas con 1 Clic */}
                  {!editingChallengeId && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        💡 O Elige una Plantilla Sugerida:
                      </div>
                      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
                        {SUGGESTED_TEMPLATES.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectTemplate(tpl)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid var(--bg-parchment-border)',
                              background: 'var(--bg-parchment)',
                              color: 'var(--text-parchment-main)',
                              fontSize: '0.76rem',
                              fontWeight: '800',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            + {tpl.title} ({PERIOD_LABELS[tpl.period].label})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Periodicidad */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                        Periodicidad del Reto:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                        {Object.entries(PERIOD_LABELS).map(([key, config]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, period: key })}
                            style={{
                              padding: '6px 4px',
                              borderRadius: 'var(--radius-md)',
                              border: formData.period === key ? `2px solid ${config.color}` : '1px solid var(--bg-parchment-border)',
                              background: formData.period === key ? config.bg : 'transparent',
                              color: formData.period === key ? config.color : 'var(--text-parchment-muted)',
                              fontSize: '0.76rem',
                              fontWeight: '900',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            {config.icon} {config.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Título y Meta */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                          Título del Reto:
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ej: Completar 3 lecciones con 5 estrellas"
                          required
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--bg-parchment-border)',
                            background: 'var(--bg-parchment)',
                            color: 'var(--text-parchment-main)',
                            fontSize: '0.88rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                          Meta Cantidad:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={formData.target}
                          onChange={e => setFormData({ ...formData, target: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--bg-parchment-border)',
                            background: 'var(--bg-parchment)',
                            color: 'var(--text-parchment-main)',
                            fontSize: '0.88rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Categoría para auto-evaluación */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                        Tipo de Objetivo (Medición):
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--bg-parchment-border)',
                          background: 'var(--bg-parchment)',
                          color: 'var(--text-parchment-main)',
                          fontSize: '0.88rem'
                        }}
                      >
                        <option value="lessons">📖 Lecciones Curriculares Completadas</option>
                        <option value="daily_challenge">🔥 Reto Diario de Don Aurelio</option>
                        <option value="puzzles">🧩 Problemas Tácticos Resueltos</option>
                        <option value="bots">🤖 Robots IA Derrotados</option>
                        <option value="elo">📈 Nivel de Elo Alcanzado</option>
                        <option value="games">⚔️ Partidas Totales Jugadas</option>
                        <option value="custom">✍️ Reto Libre / Manual (Marcado por Papá/Mamá)</option>
                      </select>
                    </div>

                    {/* Tipo de Recompensa */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                        Tipo de Recompensa:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, rewardType: 'surprise' })}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            border: formData.rewardType === 'surprise' ? '2px solid #f59e0b' : '1px solid var(--bg-parchment-border)',
                            background: formData.rewardType === 'surprise' ? '#fef3c7' : 'transparent',
                            color: formData.rewardType === 'surprise' ? '#b45309' : 'var(--text-parchment-muted)',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            cursor: 'pointer'
                          }}
                        >
                          🎁 Premio Sorpresa
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, rewardType: 'real_world' })}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            border: formData.rewardType === 'real_world' ? '2px solid #10b981' : '1px solid var(--bg-parchment-border)',
                            background: formData.rewardType === 'real_world' ? '#dcfce7' : 'transparent',
                            color: formData.rewardType === 'real_world' ? '#15803d' : 'var(--text-parchment-muted)',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            cursor: 'pointer'
                          }}
                        >
                          🍦 Premio Real
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, rewardType: 'in_game' })}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            border: formData.rewardType === 'in_game' ? '2px solid #3b82f6' : '1px solid var(--bg-parchment-border)',
                            background: formData.rewardType === 'in_game' ? '#dbeafe' : 'transparent',
                            color: formData.rewardType === 'in_game' ? '#1d4ed8' : 'var(--text-parchment-muted)',
                            fontSize: '0.78rem',
                            fontWeight: '900',
                            cursor: 'pointer'
                          }}
                        >
                          ⭐💎 Estrellas & Gemas
                        </button>
                      </div>
                    </div>

                    {/* Campo de Premio Sorpresa / Premio Real */}
                    {(formData.rewardType === 'surprise' || formData.rewardType === 'real_world') && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                          {formData.rewardType === 'surprise' ? '🎁 Mensaje Secreto del Premio Sorpresa (Solo tú lo ves hasta que lo cumpla):' : '🏆 Premio de la Vida Real:'}
                        </label>
                        <input
                          type="text"
                          value={formData.secretReward}
                          onChange={e => setFormData({ ...formData, secretReward: e.target.value })}
                          placeholder={formData.rewardType === 'surprise' ? "Ej: ¡Vale por un helado triple el fin de semana! 🍦" : "Ej: Salida al parque de diversiones 🎡"}
                          required
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid var(--color-gold)',
                            background: 'var(--bg-parchment)',
                            color: 'var(--text-parchment-main)',
                            fontSize: '0.88rem'
                          }}
                        />
                      </div>
                    )}

                    {/* Divisas del juego */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#b45309', marginBottom: '4px' }}>
                          ⭐ Estrellas de Bono:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="500"
                          value={formData.starsReward}
                          onChange={e => setFormData({ ...formData, starsReward: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--bg-parchment-border)',
                            background: 'var(--bg-parchment)',
                            color: 'var(--text-parchment-main)',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#b91c1c', marginBottom: '4px' }}>
                          💎 Gemas de Bono:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.gemsReward}
                          onChange={e => setFormData({ ...formData, gemsReward: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--bg-parchment-border)',
                            background: 'var(--bg-parchment)',
                            color: 'var(--text-parchment-main)',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="submit"
                        className="btn-gold"
                        style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                      >
                        <CheckCircle2 size={16} />
                        <span>{editingChallengeId ? 'Guardar Cambios' : 'Asignar Reto'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingChallenge(false)}
                        className="btn-secondary"
                        style={{ padding: '10px 16px', fontSize: '0.88rem' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Lista de Retos de ese hijo para Editar / Eliminar / Validar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {childChallenges.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-parchment)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--bg-parchment-border)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-parchment-muted)' }}>
                      No hay retos configurados para <strong>{targetChild.name}</strong>. ¡Crea el primero arriba!
                    </p>
                  </div>
                ) : (
                  childChallenges.map(ch => {
                    const periodInfo = PERIOD_LABELS[ch.period] || PERIOD_LABELS.daily;
                    const { current, isComplete, percent } = calculateProgress(ch, targetChild);

                    return (
                      <div
                        key={ch.id}
                        style={{
                          background: 'var(--bg-parchment-card)',
                          border: '1.5px solid var(--bg-parchment-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.72rem', background: periodInfo.bg, color: periodInfo.color, padding: '2px 6px', borderRadius: '8px', fontWeight: '900' }}>
                              {periodInfo.icon} {periodInfo.label}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', fontWeight: '700' }}>
                              Por {ch.assignedBy || 'Papá'}
                            </span>
                          </div>
                          <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>
                            {ch.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                            Progreso: <strong>{current}/{ch.target}</strong> ({percent}%) • 
                            {ch.rewardType === 'surprise' ? ` 🎁 Secreto: "${ch.secretReward}"` : ch.rewardType === 'real_world' ? ` 🍦 Premio: "${ch.secretReward}"` : ` ⭐+${ch.inGameReward?.stars || 0} 💎+${ch.inGameReward?.gems || 0}`}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Botón para marcar manualmente como cumplido */}
                          <button
                            onClick={() => toggleManualChallenge(targetChild.id, ch.id, !ch.completed)}
                            className="btn-secondary"
                            style={{
                              padding: '6px 10px',
                              fontSize: '0.76rem',
                              borderColor: ch.completed ? '#10b981' : 'var(--bg-parchment-border)',
                              color: ch.completed ? '#10b981' : 'var(--text-parchment-muted)'
                            }}
                            title={ch.completed ? "Desmarcar cumplimiento" : "Marcar como cumplido manualmente"}
                          >
                            <CheckCircle2 size={14} />
                            <span>{ch.completed ? 'Cumplido' : 'Validar'}</span>
                          </button>

                          {/* Editar */}
                          <button
                            onClick={() => handleStartEdit(ch)}
                            className="btn-secondary"
                            style={{ padding: '6px 8px' }}
                            title="Editar reto"
                          >
                            <Edit3 size={14} color="var(--color-primary)" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => deleteCustomChallenge(targetChild.id, ch.id)}
                            className="btn-secondary"
                            style={{ padding: '6px 8px', color: '#ef4444' }}
                            title="Eliminar reto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL DE REVELACIÓN DEL PREMIO SORPRESA CUANDO SE ABRE EL COFRE */}
        {revealedReward && (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-card" style={{ maxWidth: '440px', padding: '28px', textAlign: 'center', animation: 'scaleUp 0.3s ease' }}>
              <div style={{ fontSize: '4rem', marginBottom: '10px', animation: 'bounce 1s infinite' }}>
                🎉🎁✨
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold-dark)', margin: '0 0 6px', fontWeight: '900' }}>
                ¡FELICIDADES! ¡MISIÓN CUMPLIDA!
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-parchment-muted)', marginBottom: '18px' }}>
                Has completado el reto <strong>"{revealedReward.title}"</strong> asignado por {revealedReward.assignedBy || 'Papá'} ❤️
              </p>

              {/* Tarjeta de Revelación del Premio */}
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2.5px solid #f59e0b',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '900', color: '#b45309', letterSpacing: '1px', marginBottom: '6px' }}>
                  Tu Recompensa Especial:
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#78350f', lineHeight: '1.3' }}>
                  {revealedReward.secretReward || (
                    revealedReward.rewardType === 'in_game' 
                      ? `⭐ +${revealedReward.inGameReward?.stars || 0} Estrellas y 💎 +${revealedReward.inGameReward?.gems || 0} Gemas`
                      : '¡Premio de Honor en la Familia!'
                  )}
                </div>
              </div>

              <button
                onClick={() => setRevealedReward(null)}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
              >
                <span>¡Genial! Gracias {revealedReward.assignedBy || 'Papá'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
