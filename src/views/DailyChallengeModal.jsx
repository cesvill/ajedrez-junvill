import React, { useState } from 'react';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { AvatarIcon } from '../assets/avatars';
import { getCoachById } from '../assets/coachesData';
import { useUser } from '../context/UserContext';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { X, Flame, CheckCircle, RotateCcw, Sparkles, Trophy, Calendar } from 'lucide-react';

const DAILY_PUZZLES = [
  {
    id: 'daily_1',
    title: 'Ataque Letal en h7',
    fen: 'r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7',
    solution: { from: 'c4', to: 'f7' },
    hint: 'Busca el sacrificio que desmantela el enroque negro.',
    explanation: '¡Magistral! El sacrificio de alfil en f7 destruye la estructura defensiva.'
  },
  {
    id: 'daily_2',
    title: 'El Doble Salto de Caballo',
    fen: 'r3k2r/pppq1ppp/8/4N3/1b6/8/PPPP1PPP/R1B1KB1R w KQkq - 0 1',
    solution: { from: 'e5', to: 'd7' },
    hint: 'Apunta a la dama indefensa en la 7ª fila.',
    explanation: '¡Brillante! Capturas la dama y dejas al rey rival sin respuesta.'
  },
  {
    id: 'daily_3',
    title: 'Mate del Pasillo en Primera Fila',
    fen: '4r1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1',
    solution: { from: 'e8', to: 'e1' },
    hint: 'La primera fila blanca carece de casillas de escape.',
    explanation: '¡Jaque Mate! La torre penetra por la columna e abierta.'
  }
];

export const DailyChallengeModal = ({ isOpen, onClose }) => {
  const { currentUser, addRewards } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');

  // Elegir puzzle del día según el día del año
  const dayIndex = new Date().getDate() % DAILY_PUZZLES.length;
  const todayPuzzle = DAILY_PUZZLES[dayIndex];
  const isBlack = (todayPuzzle.fen.split(' ')[1] === 'b');

  const [status, setStatus] = useState('playing'); // 'playing' | 'solved' | 'failed'
  const [feedback, setFeedback] = useState('');
  const [fenState, setFenState] = useState(() => todayPuzzle.fen);
  const [lastPlayedMove, setLastPlayedMove] = useState(null);

  if (!isOpen) return null;

  const handleMove = (moveResult, newFen) => {
    if (status === 'solved') return;

    const sol = todayPuzzle.solution;
    const isCorrect = moveResult.from === sol.from && moveResult.to === sol.to;

    if (isCorrect) {
      if (newFen) {
        setFenState(newFen);
      }
      setLastPlayedMove({ from: moveResult.from, to: moveResult.to });
      audioManager.playVictory();
      setStatus('solved');
      setFeedback(todayPuzzle.explanation);
      confetti({ particleCount: 70, spread: 70 });
      addRewards(15, 5); // +15 ⭐ y +5 💎 por reto diario
    } else {
      audioManager.playWarning();
      setStatus('failed');
      setFeedback('Esa no es la jugada ganadora del día. ¡Reinténtalo!');
    }
  };

  const handleRetry = () => {
    setFenState(todayPuzzle.fen);
    setLastPlayedMove(null);
    setStatus('playing');
    setFeedback('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>
                Reto Diario del Gran Maestro
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: '2px 0 0' }}>
              {todayPuzzle.title}
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* TABLERO */}
        <div style={{ margin: '10px 0' }}>
          <ChessBoard
            fen={fenState}
            orientation={isBlack ? 'black' : 'white'}
            interactive={status !== 'solved'}
            onMove={handleMove}
            lastMove={lastPlayedMove}
          />
        </div>

        {/* DIÁLOGO DEL TUTOR */}
        <div className="coach-bubble" style={{ margin: '14px 0 10px' }}>
          <div className="coach-avatar-bubble">
            <AvatarIcon avatarId={activeCoach.id} size={44} />
          </div>
          <div className="coach-content">
            <div className="coach-name">{activeCoach.name}</div>
            {status === 'playing' && (
              <div className="coach-speech-text">
                Juegas con <strong>{isBlack ? 'Negras' : 'Blancas'}</strong>. {todayPuzzle.hint} ¡Premio: +15⭐ y +5💎!
              </div>
            )}
            {status === 'solved' && (
              <div style={{ color: 'var(--color-success)', fontWeight: '700' }}>
                <div>¡RETO DIARIO SUPERADO! (+15⭐, +5💎)</div>
                <div className="coach-speech-text">{feedback}</div>
              </div>
            )}
            {status === 'failed' && (
              <div style={{ color: 'var(--color-danger)', fontWeight: '700' }}>
                <div>Respuesta incorrecta</div>
                <div className="coach-speech-text">{feedback}</div>
              </div>
            )}
          </div>
        </div>

        {/* CONTROLES */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          {status === 'failed' && (
            <button className="btn-secondary" onClick={handleRetry}>
              <RotateCcw size={16} />
              <span>Reintentar</span>
            </button>
          )}

          {status === 'solved' && (
            <button className="btn-primary" onClick={onClose}>
              <CheckCircle size={16} />
              <span>Reclamar y Cerrar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
