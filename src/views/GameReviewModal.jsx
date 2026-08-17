import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { EvaluationBar } from '../components/EvaluationBar/EvaluationBar';
import { AvatarIcon } from '../assets/avatars';
import { BotAvatarRenderer } from '../assets/botRoster';
import { getCoachById } from '../assets/coachesData';
import { useUser } from '../context/UserContext';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Award, Zap, AlertTriangle, CheckCircle, Sparkles, Trophy } from 'lucide-react';

export const GameReviewModal = ({ isOpen, onClose, reviewData, fenHistory, moveHistory, botOpponent }) => {
  const { currentUser, addRewards } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');

  const [currentMoveIdx, setCurrentMoveIdx] = useState(0); // 0 = posición inicial
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'mistakes'
  const [mistakeIdx, setMistakeIdx] = useState(0);
  const [mistakeSolved, setMistakeSolved] = useState(false);
  const [mistakeFen, setMistakeFen] = useState(null);

  // Auto-reproducción de la partida
  useEffect(() => {
    let interval = null;
    if (isPlaying && isOpen && fenHistory && fenHistory.length > 0) {
      interval = setInterval(() => {
        setCurrentMoveIdx(prev => {
          if (prev + 1 < fenHistory.length) {
            audioManager.playMove();
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, fenHistory]);

  const currentMistake = (isOpen && reviewData?.keyMistakes) ? reviewData.keyMistakes[mistakeIdx] : null;

  useEffect(() => {
    if (currentMistake) {
      setMistakeFen(currentMistake.fenBefore);
      setMistakeSolved(false);
    }
  }, [mistakeIdx, currentMistake]);

  // Resetear posición inicial al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentMoveIdx(0);
      setIsPlaying(false);
      setMistakeIdx(0);
      setMistakeSolved(false);
    }
  }, [isOpen]);

  if (!isOpen || !reviewData) return null;

  const { classifiedMoves = [], evaluations = [], whiteAccuracy = 100, blackAccuracy = 100, whiteCounts = {}, blackCounts = {}, keyMistakes = [] } = reviewData;

  const currentFen = (fenHistory && fenHistory[currentMoveIdx]) || (fenHistory && fenHistory[0]) || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const currentMoveInfo = currentMoveIdx > 0 ? classifiedMoves[currentMoveIdx - 1] : null;
  const currentEvalCp = evaluations[currentMoveIdx]?.evalCp || 0;

  const handleNext = () => {
    if (fenHistory && currentMoveIdx + 1 < fenHistory.length) {
      setCurrentMoveIdx(prev => prev + 1);
      audioManager.playMove();
    }
  };

  const handlePrev = () => {
    if (currentMoveIdx > 0) {
      setCurrentMoveIdx(prev => prev - 1);
      audioManager.playMove();
    }
  };

  const handleFirst = () => setCurrentMoveIdx(0);
  const handleLast = () => setCurrentMoveIdx((fenHistory?.length || 1) - 1);

  const handleMistakeMove = (moveResult) => {
    if (!currentMistake || mistakeSolved) return;

    const best = currentMistake.bestMove;
    const isCorrect = best && moveResult.from === best.from && moveResult.to === best.to;

    if (isCorrect) {
      audioManager.playVictory();
      setMistakeSolved(true);
      confetti({ particleCount: 50, spread: 60 });
      addRewards(5, 1);
    } else {
      audioManager.playWarning();
      alert('Esa no es la jugada que sugirió el motor. ¡Prueba otra opción más activa!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '960px', width: '95vw', padding: '24px', maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA: PRECISIÓN DE JUEGO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} color="#f59e0b" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0 }}>
                Revisión de Partida (Game Review)
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '4px 0 0' }}>
              Análisis posicional y pedagógico con {activeCoach.name}
            </p>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* TARJETAS DE PRECISIÓN % COMPARATIVA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {/* Jugador */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AvatarIcon avatarId={currentUser.avatar} size={44} />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{currentUser.name} (Tú)</div>
                <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Blancas</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: whiteAccuracy >= 80 ? '#4ade80' : '#fde047' }}>
                {whiteAccuracy}%
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e0e7ff' }}>Precisión</div>
            </div>
          </div>

          {/* Oponente Bot */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {botOpponent ? <BotAvatarRenderer bot={botOpponent} size={44} /> : <AvatarIcon avatarId="knight" size={44} />}
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                  {botOpponent?.name || 'Rival'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)' }}>Negras • {botOpponent?.elo || 600} Elo</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-gold-dark)' }}>
                {blackAccuracy}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)' }}>Precisión</div>
            </div>
          </div>
        </div>

        {/* SUBPESTAÑAS: ANÁLISIS VS APRENDER DE ERRORES */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('review')}
            style={{
              background: activeTab === 'review' ? 'var(--color-primary)' : 'var(--bg-parchment)',
              color: activeTab === 'review' ? 'white' : 'var(--text-parchment-muted)',
              border: '1.5px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              fontSize: '0.82rem',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Análisis Jugada a Jugada
          </button>

          {keyMistakes.length > 0 && (
            <button
              onClick={() => setActiveTab('mistakes')}
              style={{
                background: activeTab === 'mistakes' ? '#ea580c' : 'var(--bg-parchment)',
                color: activeTab === 'mistakes' ? 'white' : 'var(--text-parchment-muted)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={15} />
              <span>Aprende de tus Errores ({keyMistakes.length})</span>
            </button>
          )}
        </div>

        {/* PESTAÑA 1: ANÁLISIS JUGADA A JUGADA */}
        {activeTab === 'review' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Tablero + Barra de Evaluación */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
              <EvaluationBar evalCp={currentEvalCp} />
              <div style={{ flex: 1 }}>
                <ChessBoard
                  fen={currentFen}
                  interactive={false}
                  lastMove={currentMoveInfo}
                />
              </div>
            </div>

            {/* Panel de Comentarios y Navegación */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
              {/* Bocadillo del Tutor */}
              <div className="coach-bubble" style={{ margin: 0 }}>
                <div className="coach-avatar-bubble">
                  <AvatarIcon avatarId={activeCoach.id} size={46} />
                </div>
                <div className="coach-content">
                  <div className="coach-name">{activeCoach.name}</div>
                  {currentMoveInfo ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                        <span style={{ fontSize: '1.2rem' }}>{currentMoveInfo.badge}</span>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-parchment-main)' }}>
                          {currentMoveInfo.label} ({currentMoveInfo.san})
                        </span>
                      </div>
                      <div className="coach-speech-text">
                        {currentMoveInfo.explanation}
                      </div>
                      {currentMoveInfo.bestMoveSan && currentMoveInfo.classification !== 'best' && currentMoveInfo.classification !== 'brilliant' && (
                        <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--color-gold-dark)', fontWeight: '700' }}>
                          💡 Sugerencia del motor: <strong>{currentMoveInfo.bestMoveSan}</strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Posición Inicial</div>
                      <div className="coach-speech-text">
                        Usa las flechas de navegación para recorrer la partida jugada por jugada.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gráfico SVG de Evaluación */}
              <div style={{
                background: 'var(--bg-parchment-card)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase' }}>
                  Flujo de Ventaja de la Partida
                </div>
                <svg width="100%" height="80" viewBox="0 0 400 80" style={{ overflow: 'visible' }}>
                  {/* Línea Central (0.0) */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="var(--bg-parchment-border)" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Curva de evaluación */}
                  {evaluations.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      points={evaluations.map((ev, idx) => {
                        const x = (idx / (evaluations.length - 1)) * 400;
                        const y = Math.min(75, Math.max(5, 40 - (ev.evalCp / 50)));
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  )}

                  {/* Marcador de Jugada Actual */}
                  {evaluations.length > 0 && (
                    <circle
                      cx={(currentMoveIdx / (evaluations.length - 1)) * 400}
                      cy={Math.min(75, Math.max(5, 40 - (currentEvalCp / 50)))}
                      r="6"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>

              {/* Botones de Control y Navegación */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button className="btn-secondary" onClick={handleFirst} disabled={currentMoveIdx === 0} style={{ padding: '8px 12px' }}>
                  |◀
                </button>
                <button className="btn-secondary" onClick={handlePrev} disabled={currentMoveIdx === 0} style={{ padding: '8px 14px' }}>
                  <ChevronLeft size={18} />
                </button>
                <button className="btn-primary" onClick={() => setIsPlaying(!isPlaying)} style={{ padding: '8px 18px' }}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>
                <button className="btn-secondary" onClick={handleNext} disabled={currentMoveIdx >= fenHistory.length - 1} style={{ padding: '8px 14px' }}>
                  <ChevronRight size={18} />
                </button>
                <button className="btn-secondary" onClick={handleLast} disabled={currentMoveIdx >= fenHistory.length - 1} style={{ padding: '8px 12px' }}>
                  ▶|
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: APRENDE DE TUS ERRORES */}
        {activeTab === 'mistakes' && currentMistake && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div>
              <ChessBoard
                fen={mistakeFen}
                interactive={!mistakeSolved}
                onMove={handleMistakeMove}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <div className="coach-bubble" style={{ margin: 0 }}>
                <div className="coach-avatar-bubble">
                  <AvatarIcon avatarId={activeCoach.id} size={46} />
                </div>
                <div className="coach-content">
                  <div className="coach-name">{activeCoach.name}</div>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#ea580c', margin: '4px 0' }}>
                    Momento Crítico: Error en la jugada {currentMistake.moveIndex}
                  </div>
                  <div className="coach-speech-text">
                    En la partida jugaste <strong>{currentMistake.moveMade.san}</strong>. ¿Qué jugada más sólida y activa tenías disponible? ¡Muévela en el tablero!
                  </div>

                  {mistakeSolved && (
                    <div style={{ marginTop: '10px', color: 'var(--color-success)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={18} />
                      <span>¡Excelente! Encontraste la jugada ganadora (+5⭐, +1💎).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de navegación entre errores */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setMistakeIdx(prev => Math.max(0, prev - 1))}
                  disabled={mistakeIdx === 0}
                >
                  <ChevronLeft size={16} />
                  <span>Error Anterior</span>
                </button>

                <button
                  className="btn-primary"
                  onClick={() => setMistakeIdx(prev => Math.min(keyMistakes.length - 1, prev + 1))}
                  disabled={mistakeIdx >= keyMistakes.length - 1}
                >
                  <span>Siguiente Error</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
