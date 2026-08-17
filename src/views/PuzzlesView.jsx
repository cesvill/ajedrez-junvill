import React, { useState } from 'react';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { TRAINING_CATEGORIES } from '../curriculum/trainingData';
import { useUser } from '../context/UserContext';
import { AvatarIcon } from '../assets/avatars';
import { getCoachById } from '../assets/coachesData';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { Zap, SkipForward, Lightbulb, CheckCircle2, RotateCcw, ArrowRight, Trophy } from 'lucide-react';

export const PuzzlesView = () => {
  const { currentUser, recordPuzzleSuccess } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');
  const allPuzzles = TRAINING_CATEGORIES.flatMap(c => c.puzzles);

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing' | 'solved' | 'failed'
  const [feedback, setFeedback] = useState('');
  const [fenState, setFenState] = useState(() => allPuzzles[0]?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [lastPlayedMove, setLastPlayedMove] = useState(null);

  const currentPuzzle = allPuzzles[puzzleIdx % allPuzzles.length];
  const isBlackTurn = currentPuzzle.turn === 'b' || currentPuzzle.fen.split(' ')[1] === 'b';
  const puzzleOrientation = currentPuzzle.orientation || (isBlackTurn ? 'black' : 'white');
  const activeHint = hintLevel > 0 ? currentPuzzle.hints[hintLevel - 1] : null;

  const handleMove = (moveResult, newFen) => {
    if (status === 'solved') return;

    const sol = currentPuzzle.solution;
    const isCorrect = moveResult.from === sol.from && moveResult.to === sol.to;

    if (isCorrect) {
      if (newFen) {
        setFenState(newFen);
      }
      setLastPlayedMove({ from: moveResult.from, to: moveResult.to });
      audioManager.playVictory();
      setStatus('solved');
      setFeedback(currentPuzzle.explanation);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      recordPuzzleSuccess(12);
    } else {
      audioManager.playWarning();
      setStatus('failed');
      setFeedback('Esa no es la jugada óptima. ¡Vuelve a intentarlo!');
    }
  };

  const handleNextPuzzle = () => {
    const nextIdx = puzzleIdx + 1;
    const nextPuzzle = allPuzzles[nextIdx % allPuzzles.length];
    setPuzzleIdx(nextIdx);
    setFenState(nextPuzzle.fen);
    setLastPlayedMove(null);
    setHintLevel(0);
    setStatus('playing');
    setFeedback('');
  };

  const handleSkip = () => {
    handleNextPuzzle();
  };

  const handleRetry = () => {
    setFenState(currentPuzzle.fen);
    setLastPlayedMove(null);
    setStatus('playing');
    setFeedback('');
  };

  const handleRequestHint = () => {
    if (hintLevel < 4) {
      audioManager.playHint();
      setHintLevel(prev => prev + 1);
    }
  };

  return (
    <div className="game-responsive-container">
      {/* COLUMNA IZQUIERDA: CABECERA Y TABLERO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-parchment-card)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--bg-parchment-border)'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-parchment-main)' }}>
              Tu jugada ({isBlackTurn ? 'con Negras ♟️' : 'con Blancas ♙'})
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)' }}>
              {currentPuzzle.title}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="currency-badge stars-badge">
              <span>⭐</span>
              <span>{currentUser.stars}</span>
            </div>
            <div className="currency-badge gems-badge">
              <span>💎</span>
              <span>{currentUser.gems}</span>
            </div>
          </div>
        </div>

        {/* Tablero con orientación y cuadrantes adecuados */}
        <ChessBoard
          fen={fenState}
          orientation={puzzleOrientation}
          interactive={status !== 'solved'}
          onMove={handleMove}
          lastMove={lastPlayedMove}
          hintQuadrant={activeHint?.quadrant}
          hintSquare={activeHint?.square}
        />
      </div>

      {/* COLUMNA DERECHA: ESTADÍSTICAS + TUTOR PERSONALIZADO + ACCIONES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Rating Táctico Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '50%' }}>
              <Zap size={24} color="#fde047" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#c7d2fe', fontWeight: '700', textTransform: 'uppercase' }}>Rating de Problemas</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fde047' }}>
                {currentUser.puzzleRating || 400} Elo
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#e0e7ff' }}>
            <div>Resueltos: <b>{currentUser.stats?.puzzlesSolved || 0}</b></div>
            <div style={{ color: '#86efac' }}>+12 pts por acierto</div>
          </div>
        </div>

        {/* Bocadillo del Entrenador */}
        <div className="coach-bubble">
          <div className="coach-avatar-bubble">
            <AvatarIcon avatarId={activeCoach.id} size={48} />
          </div>
          <div className="coach-content">
            <div className="coach-name">{activeCoach.name} • {activeCoach.title}</div>

            {status === 'playing' && hintLevel === 0 && (
              <div className="coach-speech-text">
                Juegas con <strong>{isBlackTurn ? 'Negras' : 'Blancas'}</strong>. Encuentra la jugada táctica precisa para ganar material o dar mate. ¡Ganarás ⭐ y 💎!
              </div>
            )}

            {status === 'playing' && hintLevel > 0 && activeHint && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: '800', textTransform: 'uppercase' }}>
                  Pista de {activeCoach.name.split(' ')[0]} ({hintLevel}/4):
                </div>
                <div className="coach-speech-text">{activeHint.text}</div>
              </div>
            )}

            {status === 'solved' && (
              <div style={{ color: 'var(--color-success)' }}>
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>¡Problema superado! (+12 Rating, +3⭐, +1💎)</div>
                <div className="coach-speech-text">{feedback}</div>
              </div>
            )}

            {status === 'failed' && (
              <div style={{ color: 'var(--color-danger)' }}>
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>Respuesta incorrecta</div>
                <div className="coach-speech-text">{feedback}</div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {status === 'playing' && (
            <>
              <button
                className="btn-gold"
                onClick={handleRequestHint}
                disabled={hintLevel >= 4}
                style={{ opacity: hintLevel >= 4 ? 0.6 : 1, flex: '1 1 140px' }}
              >
                <Lightbulb size={18} />
                <span>Pista {hintLevel > 0 ? `(${hintLevel}/4)` : ''}</span>
              </button>

              <button className="btn-secondary" onClick={handleSkip} style={{ flex: '1 1 120px' }}>
                <SkipForward size={18} />
                <span>Omitir</span>
              </button>
            </>
          )}

          {status === 'failed' && (
            <button className="btn-secondary" onClick={handleRetry} style={{ width: '100%', justifyContent: 'center' }}>
              <RotateCcw size={18} />
              <span>Reintentar Problema</span>
            </button>
          )}

          {status === 'solved' && (
            <button className="btn-primary" onClick={handleNextPuzzle} style={{ width: '100%', justifyContent: 'center' }}>
              <span>Siguiente Problema</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
