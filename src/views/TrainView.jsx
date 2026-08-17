import React, { useState } from 'react';
import { TRAINING_CATEGORIES } from '../curriculum/trainingData';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { AvatarIcon } from '../assets/avatars';
import { useUser } from '../context/UserContext';
import { getCoachById } from '../assets/coachesData';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { Target, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, ShieldAlert, Sparkles, ChevronLeft } from 'lucide-react';

export const TrainView = () => {
  const { currentUser } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');
  const [selectedCat, setSelectedCat] = useState(null);
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [hintLevel, setHintLevel] = useState(0); // 0 = sin pista, 1 a 4
  const [status, setStatus] = useState('playing'); // 'playing' | 'solved' | 'failed'
  const [feedback, setFeedback] = useState('');
  const [fenState, setFenState] = useState(null);

  const activeCategory = selectedCat ? TRAINING_CATEGORIES.find(c => c.id === selectedCat) : null;
  const currentPuzzle = activeCategory ? activeCategory.puzzles[currentPuzzleIdx] : null;

  const handleSelectCategory = (catId) => {
    setSelectedCat(catId);
    setCurrentPuzzleIdx(0);
    setHintLevel(0);
    setStatus('playing');
    setFeedback('');
    const cat = TRAINING_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.puzzles[0]) {
      setFenState(cat.puzzles[0].fen);
    }
  };

  const handleMove = (moveResult) => {
    if (!currentPuzzle || status === 'solved') return;

    const sol = currentPuzzle.solution;
    const isCorrect = moveResult.from === sol.from && moveResult.to === sol.to;

    if (isCorrect) {
      audioManager.playVictory();
      setStatus('solved');
      setFeedback(currentPuzzle.explanation);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      audioManager.playWarning();
      setStatus('failed');
      setFeedback('Esa no es la mejor jugada táctica. ¡Analiza el tablero y reintenta!');
    }
  };

  const handleRequestHint = () => {
    if (hintLevel < 4) {
      audioManager.playHint();
      setHintLevel(prev => prev + 1);
    }
  };

  const handleNextPuzzle = () => {
    if (activeCategory && currentPuzzleIdx + 1 < activeCategory.puzzles.length) {
      const nextIdx = currentPuzzleIdx + 1;
      setCurrentPuzzleIdx(nextIdx);
      setHintLevel(0);
      setStatus('playing');
      setFeedback('');
      setFenState(activeCategory.puzzles[nextIdx].fen);
    } else {
      // Finalizó categoría
      setSelectedCat(null);
    }
  };

  const handleRetry = () => {
    if (currentPuzzle) {
      setFenState(currentPuzzle.fen);
      setStatus('playing');
      setFeedback('');
    }
  };

  // Si no ha elegido categoría, mostrar menú de selección
  if (!selectedCat || !currentPuzzle) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-parchment-main)' }}>
            Gimnasio de Entrenamiento Táctico
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-parchment-muted)', marginTop: '4px' }}>
            Selecciona un tema para entrenar patrones visuales, detectar mates y cazar piezas desprotegidas.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {TRAINING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              style={{
                background: 'var(--bg-parchment-card)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Target size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-parchment-main)' }}>
                    {cat.title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted)' }}>
                  {cat.subtitle}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-parchment)', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--bg-parchment-border)' }}>
                    {cat.puzzles.length} ejercicios
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    {cat.difficulty}
                  </span>
                </div>
              </div>
              <ArrowRight size={20} color="var(--text-parchment-muted)" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Pista actual activa
  const activeHint = hintLevel > 0 ? currentPuzzle.hints[hintLevel - 1] : null;

  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Botón Volver y Título */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={() => setSelectedCat(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-parchment-muted)', fontWeight: '600' }}
        >
          <ChevronLeft size={18} />
          Volver a categorías
        </button>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-gold-dark)', background: 'var(--color-gold-light)', padding: '3px 10px', borderRadius: '12px' }}>
          Reto {currentPuzzleIdx + 1} de {activeCategory.puzzles.length}
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-parchment-main)' }}>
          {currentPuzzle.title}
        </h3>
      </div>

      {/* Tablero con soporte de pistas visuales */}
      <ChessBoard
        fen={fenState || currentPuzzle.fen}
        interactive={status !== 'solved'}
        onMove={handleMove}
        hintQuadrant={activeHint?.quadrant}
        hintSquare={activeHint?.square}
      />

      {/* Bocadillo del Entrenador */}
      <div className="coach-bubble" style={{ marginTop: '14px' }}>
        <div className="coach-avatar-bubble">
          <AvatarIcon avatarId={activeCoach.id} size={44} />
        </div>
        <div className="coach-content">
          <div className="coach-name">{activeCoach.name} • {activeCoach.title}</div>

          {status === 'playing' && hintLevel === 0 && (
            <div className="coach-speech-text">
              Juegan las blancas. Encuentra la jugada óptima. Si necesitas orientación, pulsa <strong>"Pedir Pista"</strong>.
            </div>
          )}

          {status === 'playing' && hintLevel > 0 && activeHint && (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-gold-dark)', textTransform: 'uppercase', marginBottom: '2px' }}>
                Pista Nivel {hintLevel} de 4
              </div>
              <div className="coach-speech-text" style={{ fontWeight: '500' }}>
                {activeHint.text}
              </div>
            </div>
          )}

          {status === 'solved' && (
            <div style={{ color: 'var(--color-success)' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px' }}>¡Brillante resolución!</div>
              <div className="coach-speech-text">{feedback}</div>
            </div>
          )}

          {status === 'failed' && (
            <div style={{ color: 'var(--color-danger)' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '2px' }}>Jugada incorrecta</div>
              <div className="coach-speech-text">{feedback}</div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Acciones y Pistas */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'center' }}>
        {status === 'playing' && (
          <button
            className="btn-gold"
            onClick={handleRequestHint}
            disabled={hintLevel >= 4}
            style={{ opacity: hintLevel >= 4 ? 0.6 : 1 }}
          >
            <Lightbulb size={17} />
            <span>Pedir Pista {hintLevel > 0 ? `(${hintLevel}/4)` : ''}</span>
          </button>
        )}

        {status === 'failed' && (
          <button className="btn-secondary" onClick={handleRetry}>
            <RotateCcw size={17} />
            <span>Reintentar</span>
          </button>
        )}

        {status === 'solved' && (
          <button className="btn-primary" onClick={handleNextPuzzle}>
            <span>Siguiente Reto</span>
            <ArrowRight size={17} />
          </button>
        )}
      </div>
    </div>
  );
};
