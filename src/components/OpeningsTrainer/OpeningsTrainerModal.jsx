import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { AvatarIcon } from '../../assets/avatars';
import { OPENINGS_CATALOG, getOpeningById } from '../../curriculum/openingsData';
import { getCoachById } from '../../assets/coachesData';
import { useUser } from '../../context/UserContext';
import { audioManager } from '../../engine/audio';
import { voiceEngine } from '../../engine/voiceEngine';
import confetti from 'canvas-confetti';
import { 
  X, BookOpen, Sparkles, CheckCircle2, ArrowRight, RotateCcw, 
  Bot, Swords, Volume2, VolumeX, Lightbulb, Play, Compass, ChevronRight
} from 'lucide-react';

export const OpeningsTrainerModal = ({ isOpen, onClose, onContinueMatchWithBot }) => {
  const { currentUser, addStars } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');

  const [selectedOpening, setSelectedOpening] = useState(OPENINGS_CATALOG[0]);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(0);
  const [chessGame, setChessGame] = useState(() => new Chess(OPENINGS_CATALOG[0].initialFen));
  const [lastMove, setLastMove] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Inicializar apertura seleccionada
  const handleSelectOpening = (opening) => {
    setSelectedOpening(opening);
    setCurrentMoveIdx(0);
    const newGame = new Chess(opening.initialFen);
    setChessGame(newGame);
    setLastMove(null);
    setIsCompleted(false);
    setFeedbackMessage(null);

    // Si el primer movimiento es del rival (ej. Siciliana con negras)
    const firstMoveObj = opening.moves[0];
    if (firstMoveObj.botResponse) {
      setTimeout(() => {
        const moveRes = newGame.move(firstMoveObj.botResponse);
        if (moveRes) {
          audioManager.playMove();
          setChessGame(new Chess(newGame.fen()));
          setLastMove(moveRes);
        }
      }, 400);
    }
  };

  // Narrar consejo del coach al cambiar de jugada
  useEffect(() => {
    if (!isOpen || isCompleted) return;
    const moveObj = selectedOpening.moves[currentMoveIdx];
    if (moveObj && moveObj.coachNote && isVoiceActive) {
      voiceEngine.speak(`${moveObj.title || ''}. ${moveObj.coachNote}`, activeCoach.id);
    }
    return () => voiceEngine.stop();
  }, [currentMoveIdx, selectedOpening, isOpen, isCompleted, isVoiceActive]);

  if (!isOpen) return null;

  const currentMoveData = selectedOpening.moves[currentMoveIdx];
  const isPlayerTurn = currentMoveData && !currentMoveData.botResponse;
  const playerColor = selectedOpening.side || 'white';

  const handlePlayerMove = (moveResult, newFen) => {
    if (isCompleted || !currentMoveData) return;

    // Verificar si la jugada realizada coincide con la línea teórica maestra
    if (moveResult.from === currentMoveData.from && moveResult.to === currentMoveData.to) {
      audioManager.playMove();
      const updatedGame = new Chess(newFen);
      setChessGame(updatedGame);
      setLastMove(moveResult);
      setFeedbackMessage({ type: 'success', text: `¡Excelente jugada! ${currentMoveData.san} es el movimiento teórico perfecto.` });

      const nextIdx = currentMoveIdx + 1;
      if (nextIdx >= selectedOpening.moves.length) {
        // Apertura completada con éxito
        setIsCompleted(true);
        addStars(25);
        audioManager.playVictory();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        if (isVoiceActive) {
          voiceEngine.speak(`¡Extraordinario! Has completado el repertorio de la ${selectedOpening.name}.`, activeCoach.id);
        }
      } else {
        const nextMoveObj = selectedOpening.moves[nextIdx];
        // Si el siguiente movimiento es la respuesta del oponente
        if (nextMoveObj.botResponse) {
          setTimeout(() => {
            const botMove = updatedGame.move(nextMoveObj.botResponse);
            if (botMove) {
              audioManager.playMove();
              setChessGame(new Chess(updatedGame.fen()));
              setLastMove(botMove);
              setCurrentMoveIdx(nextIdx + 1);
            }
          }, 600);
        } else {
          setCurrentMoveIdx(nextIdx);
        }
      }
    } else {
      // Jugada desviada
      audioManager.playWarning();
      setFeedbackMessage({
        type: 'warning',
        text: `Jugaste ${moveResult.san}. La teoría maestra recomienda ${currentMoveData.san} (${currentMoveData.from.toUpperCase()} a ${currentMoveData.to.toUpperCase()}) para mantener el plan estratégico.`
      });
      // Restaurar posición teórica
      setTimeout(() => {
        setChessGame(new Chess(chessGame.fen()));
      }, 700);
    }
  };

  const handleRestart = () => {
    handleSelectOpening(selectedOpening);
  };

  const handleContinueWithBot = () => {
    onClose();
    if (onContinueMatchWithBot) {
      onContinueMatchWithBot({
        fen: chessGame.fen(),
        openingName: selectedOpening.name,
        side: playerColor
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '960px', width: '100%', padding: '24px', maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={26} color="var(--color-primary)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-parchment-main)', fontSize: '1.35rem', margin: 0, fontWeight: '900' }}>
                Entrenador de Aperturas Guiadas
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', margin: '2px 0 0' }}>
                Aprende los primeros 5-8 movimientos clave con explicación estratégica del Gran Maestro.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Selector de Aperturas Rápidas */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
          {OPENINGS_CATALOG.map(op => {
            const isSel = op.id === selectedOpening.id;
            return (
              <button
                key={op.id}
                onClick={() => handleSelectOpening(op)}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isSel ? `2px solid ${op.color}` : '1.5px solid var(--bg-parchment-border)',
                  background: isSel ? 'var(--color-gold-light)' : 'var(--bg-parchment-card)',
                  color: isSel ? 'var(--color-gold-dark)' : 'var(--text-parchment-main)',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{op.side === 'white' ? '⚪' : '⚫'}</span>
                <span>{op.name}</span>
              </button>
            );
          })}
        </div>

        {/* Área Principal: Tablero + Explicación del Coach */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {/* Columna Izquierda: Tablero */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ChessBoard
              fen={chessGame.fen()}
              orientation={playerColor}
              interactive={isPlayerTurn && !isCompleted}
              onMove={handlePlayerMove}
              lastMove={lastMove}
              showLegalMoves={true}
              hintSquare={currentMoveData?.from}
            />
          </div>

          {/* Columna Derecha: Tarjeta Estratégica del Tutor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tarjeta de la Apertura Activa */}
            <div style={{
              background: 'var(--bg-parchment)',
              border: `2px solid ${selectedOpening.color}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', background: selectedOpening.color, color: 'white', fontWeight: '900', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  {selectedOpening.eco} • {selectedOpening.difficulty}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', fontWeight: '800' }}>
                  {selectedOpening.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-parchment-main)', margin: '8px 0 4px' }}>
                {selectedOpening.name}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-parchment-main)', margin: 0, lineHeight: '1.4' }}>
                {selectedOpening.description}
              </p>
            </div>

            {/* Bocadillo del Coach con la jugada activa */}
            <div className="coach-bubble" style={{ margin: 0, padding: '16px' }}>
              <div className="coach-avatar-bubble" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                <AvatarIcon avatarId={activeCoach.id} size={48} />
              </div>
              <div className="coach-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="coach-name">{activeCoach.name}</div>
                  <button
                    onClick={() => {
                      if (currentMoveData?.coachNote) {
                        voiceEngine.speak(currentMoveData.coachNote, activeCoach.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '2px' }}
                    title="Escuchar consejo"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-parchment-main)', marginBottom: '4px' }}>
                  {currentMoveData?.title || 'Secuencia de Apertura'}
                </div>
                <div className="coach-speech-text" style={{ fontSize: '0.90rem' }}>
                  {currentMoveData?.coachNote || 'Realiza el movimiento indicado para consolidar la estructura.'}
                </div>
              </div>
            </div>

            {/* Retroalimentación Dinámica */}
            {feedbackMessage && (
              <div style={{
                background: feedbackMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1.5px solid ${feedbackMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
                color: feedbackMessage.type === 'success' ? '#15803d' : '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: '800'
              }}>
                {feedbackMessage.text}
              </div>
            )}

            {/* Estado de Finalización / Botones de Acción */}
            {isCompleted ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 179, 8, 0.25) 100%)',
                border: '2px solid var(--color-gold)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-gold-dark)', fontWeight: '900', fontSize: '1.1rem' }}>
                  <Sparkles size={20} />
                  <span>¡Apertura Dominada con Éxito! (+25 ⭐)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-main)', margin: 0 }}>
                  Has completado la fase de apertura con una estructura sólida. ¿Quieres continuar la partida contra el Robot desde esta posición exacta?
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleRestart} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem', gap: '6px' }}>
                    <RotateCcw size={15} />
                    <span>Practicar de Nuevo</span>
                  </button>
                  <button onClick={handleContinueWithBot} className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.84rem', gap: '6px' }}>
                    <Swords size={16} />
                    <span>🤖 Jugar Partida vs Robot</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                <button onClick={handleRestart} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '5px' }}>
                  <RotateCcw size={14} />
                  <span>Reiniciar Apertura</span>
                </button>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-parchment-muted)' }}>
                  Paso {Math.min(currentMoveIdx + 1, selectedOpening.moves.length)} de {selectedOpening.moves.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
