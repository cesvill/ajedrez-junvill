import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { CURRICULUM_SECTIONS } from '../curriculum/lessonsData';
import { LessonPlayerModal } from './LessonPlayerModal';
import { OpeningsTrainerModal } from '../components/OpeningsTrainer/OpeningsTrainerModal';
import { YusupovRadar } from '../components/RadarChart/YusupovRadar';
import { AvatarIcon } from '../assets/avatars';
import { getCoachById } from '../assets/coachesData';
import { Check, Lock, Sparkles, Map, Grid, Award, Trophy, Gift, Compass, ChevronDown, ChevronUp, Star, BookOpen } from 'lucide-react';

const LessonIcon = ({ category = 'tactica', className = "lesson-icon-svg" }) => {
  if (category === 'aperturas') {
    return (
      <svg viewBox="0 0 24 24" className={className}>
        <path d="M19 22H5v-2h14v2M17.6 7.2c-.3-.8-.9-1.4-1.7-1.8L16 2h-2l-.5 2.5c-.3.1-.7.2-1 .4L12 3l-.5 1.9c-.3-.2-.7-.3-1-.4L10 2H8l.1 3.4c-.8.4-1.4 1-1.7 1.8-.7 1.6-.2 3.5 1.1 4.5l-.5 5.3h10.2l-.5-5.3c1.3-1 1.8-2.9 1.1-4.5z" />
      </svg>
    );
  }
  if (category === 'posicional' || category === 'estrategia') {
    return (
      <svg viewBox="0 0 24 24" className={className}>
        <path d="M19 22H5v-2h14v2M12 2a2 2 0 0 0-2 2c0 .7.4 1.4 1 1.7V7c-2.2 0-4 1.8-4 4 0 1.5.8 2.8 2 3.5V18h6v-3.5c1.2-.7 2-2 2-3.5 0-2.2-1.8-4-4-4V5.7c.6-.3 1-1 1-1.7a2 2 0 0 0-2-2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export const LessonsView = ({ onSelectLesson, onStartLesson, onOpenBugReport }) => {
  const { currentUser } = useUser();
  const [activeLesson, setActiveLesson] = useState(null);
  const [isOpeningsModalOpen, setIsOpeningsModalOpen] = useState(false);

  const handleLessonStarter = onSelectLesson || onStartLesson;

  const handleOpenLesson = (lesson) => {
    if (handleLessonStarter) {
      handleLessonStarter(lesson);
    } else {
      setActiveLesson(lesson);
    }
  };
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'adventure'
  const [showRadar, setShowRadar] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState('all');

  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');

  const getLessonProgress = (lessonId) => {
    return currentUser.lessonProgress?.[lessonId] || { stars: 0, completed: false };
  };

  const totalLessons = CURRICULUM_SECTIONS.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessonsCount = Object.values(currentUser?.lessonProgress || {}).filter(p => p.completed || p.stars >= 5).length;
  const progressPercentage = Math.min(100, Math.round((completedLessonsCount / 110) * 100));

  const filteredSections = selectedStageId === 'all'
    ? CURRICULUM_SECTIONS
    : CURRICULUM_SECTIONS.filter(s => s.id === selectedStageId);

  return (
    <div className="lessons-container">
      {/* BANNER PRINCIPAL DE PROGRESO 110 PUNTOS */}
      <div className="lessons-header-banner" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className="points-summary-text" style={{ margin: 0, textAlign: 'left' }}>
              Has ganado {completedLessonsCount} de 110 puntos acumulados
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '4px 0 0' }}>
              {completedLessonsCount} de {totalLessons} lecciones completadas con maestría (5⭐)
            </p>
          </div>

          {/* Switcher de Vista y Botón de Aperturas Guiadas */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsOpeningsModalOpen(true)}
              className="btn-gold"
              style={{ padding: '6px 14px', fontSize: '0.82rem', gap: '6px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)' }}
            >
              <BookOpen size={16} />
              <span>Aperturas Guiadas</span>
            </button>

            <button
              onClick={() => setShowRadar(!showRadar)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Compass size={16} color="#3b82f6" />
              <span>Radar Yusupov</span>
              {showRadar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <div style={{
              display: 'flex',
              background: 'var(--bg-parchment)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--bg-parchment-border)'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : 'var(--text-parchment-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Grid size={15} />
                <span>Cuadrícula</span>
              </button>

              <button
                onClick={() => setViewMode('adventure')}
                style={{
                  background: viewMode === 'adventure' ? 'var(--color-primary)' : 'transparent',
                  color: viewMode === 'adventure' ? 'white' : 'var(--text-parchment-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Map size={15} />
                <span>Aventura</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Progreso Global */}
        <div style={{
          width: '100%',
          height: '10px',
          background: 'var(--bg-parchment)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          border: '1px solid var(--bg-parchment-border)'
        }}>
          <div style={{
            width: `${Math.min(100, Math.max(4, progressPercentage))}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3b82f6 0%, #f59e0b 100%)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* PANEL EXPANDIBLE DE RADAR YUSUPOV */}
      {showRadar && (
        <div style={{
          background: 'var(--bg-parchment-card)',
          border: '1.5px solid var(--bg-parchment-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <YusupovRadar size={270} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Award size={24} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-parchment-main)' }}>
                Evaluación de Habilidades Yusupov
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-parchment-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
              Tu radar de 6 ejes evoluciona con cada lección completada. Este sistema equilibra tu comprensión táctica, posicional, de cálculo, aperturas y finales.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { label: 'Táctica', val: currentUser.radarSkills?.tactica || 20, color: '#ef4444' },
                { label: 'Cálculo', val: currentUser.radarSkills?.calculo || 20, color: '#f59e0b' },
                { label: 'Aperturas', val: currentUser.radarSkills?.aperturas || 20, color: '#3b82f6' },
                { label: 'Estrategia', val: currentUser.radarSkills?.estrategia || 20, color: '#10b981' },
                { label: 'Posicional', val: currentUser.radarSkills?.posicional || 20, color: '#8b5cf6' },
                { label: 'Finales', val: currentUser.radarSkills?.finales || 20, color: '#ec4899' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-parchment)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-parchment-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-parchment-main)' }}>{s.label}</span>
                    <span style={{ color: s.color }}>{s.val}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FILTROS POR ETAPA */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'Todas las 110 Lecciones' },
          { id: 'etapa-1-basicos', label: 'Etapa 1 (Básicos)' },
          { id: 'etapa-2-tactica', label: 'Etapa 2 (Táctica)' },
          { id: 'etapa-3-finales', label: 'Etapa 3 (Finales)' },
          { id: 'etapa-4-mediojuego', label: 'Etapa 4 (Estrategia)' },
          { id: 'etapa-5-maestria', label: 'Etapa 5 (Maestría FIDE)' }
        ].map(stage => (
          <button
            key={stage.id}
            onClick={() => setSelectedStageId(stage.id)}
            style={{
              background: selectedStageId === stage.id ? 'var(--color-primary)' : 'var(--bg-parchment-card)',
              color: selectedStageId === stage.id ? 'white' : 'var(--text-parchment-main)',
              border: '1.5px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* VISTA 1: CUADRÍCULA DE 110 PUNTOS */}
      {viewMode === 'grid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {filteredSections.map((section) => (
            <div key={section.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '6px', borderBottom: '1.5px solid var(--bg-parchment-border)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-parchment-main)' }}>
                  {section.title}
                </h3>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                  {section.badge} ({section.eloRange})
                </span>
              </div>

              <div className="lessons-grid">
                {section.lessons.map((lesson) => {
                  const progress = getLessonProgress(lesson.id);
                  const isCompleted = progress.completed || progress.stars >= 5;
                  const hasProgress = progress.stars > 0;

                  return (
                      <button
                        key={lesson.id}
                        className={`lesson-card ${isCompleted ? 'completed' : ''}`}
                        onClick={() => handleOpenLesson(lesson)}
                      >
                        <div className="lesson-icon-wrapper">
                          <LessonIcon category={lesson.category} />

                          {/* Círculo indicador / Check */}
                          {isCompleted ? (
                            <div className="lesson-status-badge completed">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          ) : hasProgress ? (
                            <div className="lesson-status-badge in-progress" />
                          ) : (
                            <div className="lesson-status-badge" />
                          )}
                        </div>

                        {/* Puntuación (ej. 1/5) */}
                        <div className="lesson-progress-pill">
                          {progress.stars} / 5 ⭐
                        </div>

                        <span className="lesson-card-title">
                          {lesson.number}. {lesson.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA 2: CAMINO DE AVENTURA GAMIFICADO */}
        {viewMode === 'adventure' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', alignItems: 'center', padding: '20px 0' }}>
            {filteredSections.map((section, sIdx) => (
              <div key={section.id} style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Cartel de Etapa */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md)',
                  marginBottom: '28px',
                  textAlign: 'center',
                  border: '2px solid #818cf8'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#c7d2fe', fontWeight: '800', textTransform: 'uppercase' }}>
                    {section.badge}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '900' }}>
                    {section.title}
                  </div>
                </div>

                {/* Nodos del Sendero en Zigzag */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                  {section.lessons.map((lesson, idx) => {
                    const progress = getLessonProgress(lesson.id);
                    const isCompleted = progress.completed || progress.stars >= 5;
                    const hasProgress = progress.stars > 0;
                    const xOffset = Math.sin(idx * 0.8) * 90; // Efecto zigzag suave

                    return (
                      <div
                        key={lesson.id}
                        style={{
                          transform: `translateX(${xOffset}px)`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <button
                          onClick={() => handleOpenLesson(lesson)}
                          style={{
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            background: isCompleted ? '#10b981' : hasProgress ? '#f59e0b' : 'var(--bg-parchment-card)',
                            color: isCompleted || hasProgress ? 'white' : 'var(--text-parchment-main)',
                            border: `3px solid ${isCompleted ? '#059669' : hasProgress ? '#d97706' : 'var(--bg-parchment-border)'}`,
                            boxShadow: 'var(--shadow-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1.1rem', fontWeight: '900' }}>
                            {lesson.number}
                          </span>
                          <span style={{ fontSize: '0.62rem', fontWeight: '800' }}>
                            {progress.stars}/5⭐
                          </span>

                          {isCompleted && (
                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#047857', borderRadius: '50%', padding: '3px', color: 'white' }}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>

                        <span style={{
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          color: 'var(--text-parchment-main)',
                          textAlign: 'center',
                          maxWidth: '140px',
                          lineHeight: '1.2'
                        }}>
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Reproductor de Lección Fallback */}
        {activeLesson && !handleLessonStarter && (
          <LessonPlayerModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
            onOpenBugReport={onOpenBugReport}
          />
        )}

        {/* Modal Entrenador de Aperturas Guiadas (Fase 3) */}
        <OpeningsTrainerModal
          isOpen={isOpeningsModalOpen}
          onClose={() => setIsOpeningsModalOpen(false)}
        />
      </div>
    );
  };
