import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { AvatarIcon } from '../assets/avatars';
import { audioManager } from '../engine/audio';
import { voiceEngine } from '../engine/voiceEngine';
import { useUser } from '../context/UserContext';
import { getCoachById } from '../assets/coachesData';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Lightbulb, Volume2, VolumeX, Sparkles, Bug, Maximize, Minimize } from 'lucide-react';

export const LessonPlayerModal = ({ lesson, onClose, onOpenBugReport }) => {
  const { currentUser, recordLessonScore } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    try {
      const stepKey = `junvill_lesson_step_${currentUser?.id || 'default'}_${lesson.id}`;
      const progress = currentUser?.lessonProgress?.[lesson.id];
      // Si la lección ya fue completada antes o el usuario la vuelve a abrir para repasarla, empezar SIEMPRE desde el inicio
      if (progress?.completed || (progress?.stars >= 5)) {
        sessionStorage.removeItem(stepKey);
        return 0;
      }
      const savedStep = parseInt(sessionStorage.getItem(stepKey), 10);
      if (!isNaN(savedStep) && savedStep >= 0 && savedStep < (lesson.steps?.length || 0)) {
        if (savedStep >= (lesson.steps?.length || 0) - 1) {
          sessionStorage.removeItem(stepKey);
          return 0;
        }
        return savedStep;
      }
    } catch (e) {}
    return 0;
  });

  useEffect(() => {
    try {
      const stepKey = `junvill_lesson_step_${currentUser?.id || 'default'}_${lesson.id}`;
      sessionStorage.setItem(stepKey, currentStepIdx.toString());
    } catch (e) {}
  }, [currentStepIdx, lesson.id, currentUser?.id]);

  const getInitialMoveForStep = (step) => {
    if (!step) return null;
    if (step.initialMove || step.lastMove) return step.initialMove || step.lastMove;
    const fenParts = (step.fen || '').split(' ');
    const epTarget = fenParts[3];
    if (epTarget && epTarget !== '-') {
      const file = epTarget[0];
      const rank = epTarget[1];
      if (rank === '6') {
        return { from: `${file}7`, to: `${file}5` };
      } else if (rank === '3') {
        return { from: `${file}2`, to: `${file}4` };
      }
    }
    return null;
  };

  const getPreMoveFen = (step) => {
    if (!step || !step.fen) return null;
    const fenParts = step.fen.split(' ');
    const epTarget = fenParts[3];
    if (!epTarget || epTarget === '-') return null;
    const file = epTarget[0];
    const rank = epTarget[1];

    try {
      if (rank === '6') {
        // Negras acaban de mover f7-f5. Posición previa: peón en f7
        const g = new Chess(step.fen);
        g.remove(`${file}5`);
        g.put({ type: 'p', color: 'b' }, `${file}7`);
        const fenTokens = g.fen().split(' ');
        fenTokens[1] = 'b'; // Turno de negras
        fenTokens[3] = '-'; // Sin casilla en passant previa
        return {
          fenBefore: fenTokens.join(' '),
          move: { from: `${file}7`, to: `${file}5` }
        };
      } else if (rank === '3') {
        // Blancas acaban de mover e2-e4. Posición previa: peón en e2
        const g = new Chess(step.fen);
        g.remove(`${file}4`);
        g.put({ type: 'p', color: 'w' }, `${file}2`);
        const fenTokens = g.fen().split(' ');
        fenTokens[1] = 'w'; // Turno de blancas
        fenTokens[3] = '-';
        return {
          fenBefore: fenTokens.join(' '),
          move: { from: `${file}2`, to: `${file}4` }
        };
      }
    } catch (e) {
      console.warn('Error calculating pre-move FEN', e);
    }
    return null;
  };

  const [exerciseState, setExerciseState] = useState({
    status: 'pending', // 'pending' | 'success' | 'failed'
    feedback: ''
  });
  const [score, setScore] = useState(0);
  const [fenState, setFenState] = useState(() => lesson.steps[currentStepIdx]?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [lastPlayedMove, setLastPlayedMove] = useState(() => getInitialMoveForStep(lesson.steps[currentStepIdx]));
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [hintLevel, setHintLevel] = useState(0); // 0: sin pista, 1: concepto, 2: casilla origen, 3: jugada completa
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sincronizar estado y animar en vivo el movimiento del rival al cambiar de paso
  useEffect(() => {
    const step = lesson.steps[currentStepIdx] || lesson.steps[0];
    const preMoveInfo = getPreMoveFen(step);

    if (preMoveInfo) {
      // Mostrar primero la posición antes del salto y animar en vivo el avance del rival
      setFenState(preMoveInfo.fenBefore);
      setLastPlayedMove(null);
      setExerciseState({ status: 'pending', feedback: '' });
      setHintLevel(0);

      const timer = setTimeout(() => {
        try { audioManager?.playMove?.(); } catch (e) {}
        setFenState(step.fen);
        setLastPlayedMove(preMoveInfo.move);
      }, 550);

      return () => clearTimeout(timer);
    } else {
      setFenState(step.fen);
      setLastPlayedMove(getInitialMoveForStep(step));
      setExerciseState({ status: 'pending', feedback: '' });
      setHintLevel(0);
    }
  }, [currentStepIdx, lesson]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
      else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  const currentStep = lesson.steps[currentStepIdx] || lesson.steps[0];
  const isTheory = currentStep.type === 'theory';
  const stepTurn = (currentStep.fen?.split(' ')[1] || 'w');
  const lessonOrientation = currentStep.orientation || (stepTurn === 'b' ? 'black' : 'white');

  // Narración por voz al entrar o cambiar de paso
  useEffect(() => {
    if (!isVoiceActive) return;

    if (isTheory) {
      const textToSpeak = `${currentStep.title}. ${currentStep.text}`;
      voiceEngine.speak(textToSpeak, activeCoach.id);
    } else {
      const textToSpeak = currentStep.instruction;
      voiceEngine.speak(textToSpeak, activeCoach.id);
    }

    return () => {
      voiceEngine.stop();
    };
  }, [currentStepIdx, isVoiceActive, isTheory]);

  // Narrar retroalimentación de acierto o fallo
  useEffect(() => {
    if (exerciseState.feedback && isVoiceActive) {
      voiceEngine.speak(exerciseState.feedback, activeCoach.id);
    }
  }, [exerciseState.feedback, isVoiceActive]);

  const handleMove = (moveResult, newFen) => {
    if (isTheory) return;

    const sol = currentStep.solution || currentStep.targetMove;
    if (!sol) return;

    const isPrimary = moveResult.from === sol.from && moveResult.to === sol.to;
    const matchedAlt = currentStep.alternativeSolutions?.find(
      alt => alt.from === moveResult.from && alt.to === moveResult.to
    );

    let isCorrect = isPrimary || !!matchedAlt;
    let successFeedback = matchedAlt?.feedback || currentStep.feedback || currentStep.explanation || '¡Jugada correcta! Has ejecutado el plan a la perfección.';

    // VALIDACIÓN PEDAGÓGICA AUTOMÁTICA DE TODAS LAS POSIBILIDADES VÁLIDAS
    if (!isCorrect) {
      try {
        const initialGame = new Chess(currentStep.fen);
        const wasInCheck = initialGame.inCheck();
        const updatedGame = new Chess(newFen || currentStep.fen);
        const isNowInCheck = updatedGame.inCheck(); // En el nuevo turno, ¿el oponente está en jaque?

        const inst = (currentStep.instruction || '').toLowerCase();
        const lessonTitle = (lesson.title || '').toLowerCase();
        const lessonCategory = (lesson.category || '').toLowerCase();
        const moveKey = `${moveResult.from}-${moveResult.to}`;
        const hasExplicitError = !!currentStep.incorrectFeedback?.[moveKey];

        // 1. Caso: Lección de "Escapar del Jaque" (C-I-M)
        if (!hasExplicitError && (wasInCheck || lessonCategory === 'escapar_jaque' || lessonTitle.includes('escapar del jaque') || inst.includes('escapar'))) {
          // Si estaba en jaque y realizó un movimiento legal (que elimina el jaque por regla de ajedrez)
          isCorrect = true;
          if (moveResult.captured) {
            successFeedback = `¡Excelente! Has eliminado el jaque capturando la pieza atacante (C = Capturar).`;
          } else if (moveResult.piece === 'k') {
            successFeedback = `¡Rey a salvo! Has escapado del jaque moviendo tu rey a una casilla segura (M = Mover).`;
          } else {
            successFeedback = `¡Escudo perfecto! Has interpuesto una pieza para bloquear la línea de jaque (I = Interponer).`;
          }
        }

        // 2. Caso: Lección de "Dar Jaque" (atacar al rey rival)
        else if (!hasExplicitError && isNowInCheck && (
          (lessonTitle.includes('jaque') && !lessonTitle.includes('mate')) ||
          (inst.includes('jaque') && !inst.includes('mate') && !inst.includes('escapar'))
        )) {
          isCorrect = true;
          successFeedback = `¡Excelente jaque! Has atacado directamente al Rey rival.`;
        }

        // 3. Caso: Jaque Mate
        else if (!hasExplicitError && updatedGame.isCheckmate() && (
          lessonTitle.includes('mate') || inst.includes('mate')
        )) {
          isCorrect = true;
          successFeedback = `¡Brillante jaque mate! El rey rival no tiene ninguna escapatoria posible.`;
        }
      } catch (err) {
        console.error("Error in pedagogical validation:", err);
      }
    }

    if (isCorrect) {
      // Actualizar posición del tablero para que la ficha permanezca en su destino
      if (newFen) {
        setFenState(newFen);
      }
      setLastPlayedMove({ from: moveResult.from, to: moveResult.to });
      audioManager.playVictory();
      setExerciseState({
        status: 'success',
        feedback: successFeedback
      });
      setScore(prev => prev + 1);
    } else {
      audioManager.playWarning();

      // Retroalimentación inteligente y específica
      const moveKey = `${moveResult.from}-${moveResult.to}`;
      let specificError = currentStep.incorrectFeedback?.[moveKey];

      if (!specificError) {
        // ¿El usuario intentó mover/capturar en la casilla objetivo con otra pieza?
        if (moveResult.to === sol.to) {
          const pieceNames = { p: 'peón', n: 'caballo', b: 'alfil', r: 'torre', q: 'dama', k: 'rey' };
          const playedPiece = pieceNames[moveResult.piece] || 'pieza';
          specificError = `Intentaste jugar a ${sol.to.toUpperCase()} con tu ${playedPiece}, pero para esta lección busca realizar la jugada desde ${sol.from.toUpperCase()}.`;
        } else if (moveResult.captured) {
          specificError = `Capturaste en ${moveResult.to.toUpperCase()}, pero esa no es la pieza prioritaria de esta lección. ¡Revisa la instrucción del maestro!`;
        } else {
          specificError = 'Esa no es la jugada óptima para esta situación. ¡Pide una pista o vuelve a intentarlo!';
        }
      }

      setExerciseState({
        status: 'failed',
        feedback: specificError
      });
    }
  };

  const handleRestartLesson = () => {
    voiceEngine.stop();
    const stepKey = `junvill_lesson_step_${currentUser?.id || 'default'}_${lesson.id}`;
    try { sessionStorage.removeItem(stepKey); } catch (e) {}
    setCurrentStepIdx(0);
    const firstStep = lesson.steps[0];
    const preMoveInfo = getPreMoveFen(firstStep);
    if (preMoveInfo) {
      setFenState(preMoveInfo.fenBefore);
      setLastPlayedMove(null);
      setTimeout(() => {
        try { audioManager?.playMove?.(); } catch (e) {}
        setFenState(firstStep.fen);
        setLastPlayedMove(preMoveInfo.move);
      }, 550);
    } else {
      setFenState(firstStep.fen);
      setLastPlayedMove(getInitialMoveForStep(firstStep));
    }
    setExerciseState({ status: 'pending', feedback: '' });
    setHintLevel(0);
  };

  const handleNextStep = () => {
    voiceEngine.stop();
    if (currentStepIdx + 1 < lesson.steps.length) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setFenState(lesson.steps[nextIdx].fen);
      setLastPlayedMove(null);
      setExerciseState({ status: 'pending', feedback: '' });
      setHintLevel(0);
    } else {
      // Lección finalizada: otorgar 5 estrellas completas y puntos
      try {
        const stepKey = `junvill_lesson_step_${currentUser?.id || 'default'}_${lesson.id}`;
        sessionStorage.removeItem(stepKey);
      } catch (e) {}
      const finalScore = 5;
      recordLessonScore(lesson.id, finalScore, lesson.category);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      audioManager.playVictory();
      if (isVoiceActive) {
        voiceEngine.speak(`¡Felicidades! Has completado la lección ${lesson.title} con cinco estrellas.`, activeCoach.id);
      }
      onClose();
    }
  };

  const handleRetryExercise = () => {
    voiceEngine.stop();
    setFenState(currentStep.fen);
    setLastPlayedMove(null);
    setExerciseState({ status: 'pending', feedback: '' });
    setHintLevel(0);
  };

  const handleRequestHint = () => {
    if (isTheory || !currentStep.solution) return;
    audioManager.playHint();
    const nextLevel = Math.min(hintLevel + 1, 3);
    setHintLevel(nextLevel);

    let hintText = '';
    const sol = currentStep.solution;
    if (nextLevel === 1) {
      hintText = currentStep.hint || `Presta atención al centro del tablero y activa una pieza con buena proyección.`;
    } else if (nextLevel === 2) {
      hintText = `Mueve tu pieza ubicada en la casilla ${sol.from.toUpperCase()}.`;
    } else {
      hintText = `¡La jugada ganadora es mover de ${sol.from.toUpperCase()} a ${sol.to.toUpperCase()}!`;
    }

    if (isVoiceActive) {
      voiceEngine.speak(hintText, activeCoach.id);
    }
  };

  const handleSpeakCurrent = () => {
    let text = '';
    if (isTheory) {
      text = `${currentStep.title}. ${currentStep.text}`;
    } else if (hintLevel > 0) {
      const sol = currentStep.solution;
      if (hintLevel === 1) text = currentStep.hint || 'Busca activar tus piezas hacia el centro.';
      else if (hintLevel === 2) text = `Mueve tu pieza en ${sol.from.toUpperCase()}.`;
      else text = `Mueve de ${sol.from.toUpperCase()} a ${sol.to.toUpperCase()}.`;
    } else {
      text = exerciseState.feedback || currentStep.instruction;
    }
    voiceEngine.speak(text, activeCoach.id);
  };

  const handleClose = () => {
    voiceEngine.stop();
    onClose();
  };

  // Texto de la pista activa
  const getActiveHintText = () => {
    if (!currentStep.solution || hintLevel === 0) return null;
    const sol = currentStep.solution;
    if (hintLevel === 1) {
      return currentStep.hint || 'Presta atención a las casillas centrales y desarrolla tus piezas activas.';
    }
    if (hintLevel === 2) {
      return `Mueve tu pieza ubicada en la casilla ${sol.from.toUpperCase()} (resaltada en amarillo).`;
    }
    return `¡Mueve de ${sol.from.toUpperCase()} hacia ${sol.to.toUpperCase()}!`;
  };

  const handleReportIssue = () => {
    if (onOpenBugReport) {
      onOpenBugReport({
        view: 'leccion',
        lesson: lesson,
        stepIndex: currentStepIdx,
        step: currentStep,
        fen: fenState,
        orientation: lessonOrientation
      });
    }
  };

  const activeHintText = getActiveHintText();

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="lesson-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera Compacta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1.5px solid var(--bg-parchment-border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)', fontWeight: '900' }}>
                Paso {currentStepIdx + 1} de {lesson.steps.length}
              </span>
              <span style={{ fontSize: '0.78rem', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                {isTheory ? '📖 Teoría' : `⭐ Ejercicio ${currentStepIdx}/5`}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-parchment-main)', margin: '4px 0 0', fontWeight: '900' }}>
              {lesson.title}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentStepIdx > 0 && (
              <button 
                onClick={handleRestartLesson} 
                className="btn-secondary" 
                style={{ padding: '6px 10px', fontSize: '0.82rem', gap: '5px', color: '#f59e0b' }}
                title="Volver a empezar la lección desde el inicio (Paso 0)"
              >
                <RotateCcw size={15} color="#f59e0b" />
                <span style={{ fontSize: '0.78rem', fontWeight: '800' }}>Reiniciar</span>
              </button>
            )}

            <button 
              onClick={toggleFullscreen} 
              className="btn-secondary" 
              style={{ padding: '6px 10px', fontSize: '0.82rem', gap: '5px' }}
              title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa (Ocultar Barra URL)"}
            >
              {isFullscreen ? <Minimize size={16} color="#10b981" /> : <Maximize size={16} color="#3b82f6" />}
              <span style={{ fontSize: '0.78rem', fontWeight: '800' }}>{isFullscreen ? 'Normal' : 'Completa'}</span>
            </button>

            <button 
              onClick={handleReportIssue} 
              className="btn-secondary" 
              style={{ padding: '6px 10px', fontSize: '0.82rem', gap: '5px', color: '#ef4444' }}
              title="Reportar un error en este ejercicio o lección"
            >
              <Bug size={16} color="#ef4444" />
              <span style={{ fontSize: '0.78rem', fontWeight: '800' }}>Reportar</span>
            </button>

            <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Cuerpo Principal Responsive (2 Columnas en Desktop/Laptop, 1 Columna en Móvil) */}
        <div className="lesson-modal-body">
          {/* Columna Izquierda: Tablero de Ajedrez */}
          <div className="lesson-board-column">
            <ChessBoard
              fen={fenState}
              orientation={lessonOrientation}
              interactive={!isTheory && exerciseState.status !== 'success'}
              onMove={handleMove}
              hintSquare={hintLevel >= 2 && currentStep.solution ? currentStep.solution.from : null}
              lastMove={lastPlayedMove || (hintLevel >= 3 && currentStep.solution ? { from: currentStep.solution.from, to: currentStep.solution.to } : null)}
            />
          </div>

          {/* Columna Derecha: Diálogo del Tutor, Pistas y Controles */}
          <div className="lesson-info-column">
            {/* Burbuja del Tutor */}
            <div className="coach-bubble" style={{ margin: 0, padding: '16px 20px' }}>
              <div className="coach-avatar-bubble" style={{ width: '52px', height: '52px', minWidth: '52px' }}>
                <AvatarIcon avatarId={activeCoach.id} size={52} />
              </div>
              <div className="coach-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div className="coach-name" style={{ fontSize: '0.92rem', fontWeight: '900' }}>{activeCoach.name} • {activeCoach.title}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleSpeakCurrent}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '2px' }}
                      title="Escuchar con narración de voz"
                    >
                      <Volume2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        const newState = !isVoiceActive;
                        setIsVoiceActive(newState);
                        if (!newState) voiceEngine.stop();
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isVoiceActive ? 'var(--color-success)' : 'var(--text-parchment-muted)', padding: '2px' }}
                      title={isVoiceActive ? 'Voz activada' : 'Voz silenciada'}
                    >
                      {isVoiceActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>
                </div>

                {isTheory ? (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ fontWeight: '900', fontSize: '1.08rem', marginBottom: '4px', color: 'var(--text-parchment-main)' }}>
                      {currentStep.title}
                    </div>
                    <div className="coach-speech-text" style={{ fontSize: '0.98rem', lineHeight: '1.45', color: 'var(--text-parchment-main)' }}>
                      {currentStep.text}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.02rem', color: 'var(--text-parchment-main)', lineHeight: '1.4' }}>
                      {currentStep.instruction}
                    </div>

                    {/* Mensaje de Pista Progresiva */}
                    {activeHintText && (
                      <div style={{
                        background: 'var(--color-gold-light)',
                        border: '1.5px solid var(--color-gold)',
                        borderRadius: 'var(--radius-md, 8px)',
                        padding: '10px 14px',
                        marginTop: '10px',
                        fontSize: '0.90rem',
                        color: 'var(--color-gold-dark)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <Lightbulb size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong>Pista ({hintLevel}/3):</strong> {activeHintText}
                        </div>
                      </div>
                    )}

                    {/* Estado de Éxito con Retroalimentación Pedagógica Clara */}
                    {exerciseState.status === 'success' && (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1.5px solid var(--color-success)',
                        borderRadius: 'var(--radius-md, 8px)',
                        padding: '12px 14px',
                        color: 'var(--color-success)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginTop: '12px',
                        fontSize: '0.92rem',
                        fontWeight: '700',
                        lineHeight: '1.4'
                      }}>
                        <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>{exerciseState.feedback}</div>
                      </div>
                    )}

                    {/* Estado de Fallo */}
                    {exerciseState.status === 'failed' && (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1.5px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md, 8px)',
                        padding: '10px 14px',
                        color: 'var(--color-danger)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginTop: '10px',
                        fontSize: '0.90rem',
                        fontWeight: '700'
                      }}>
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{exerciseState.feedback}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Barra de Acciones y Pistas */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {!isTheory && exerciseState.status !== 'success' && (
                  <button
                    className="btn-gold"
                    onClick={handleRequestHint}
                    style={{ padding: '10px 20px', fontSize: '0.92rem', fontWeight: '800' }}
                    title="Obtener pista progresiva"
                  >
                    <Lightbulb size={18} />
                    <span>{hintLevel === 0 ? '💡 Pista' : `Pista (${hintLevel}/3)`}</span>
                  </button>
                )}

                {!isTheory && exerciseState.status === 'failed' && (
                  <button
                    className="btn-secondary"
                    onClick={handleRetryExercise}
                    style={{ padding: '10px 18px', fontSize: '0.90rem', fontWeight: '800' }}
                  >
                    <RotateCcw size={16} />
                    <span>Reintentar</span>
                  </button>
                )}
              </div>

              <div style={{ marginLeft: 'auto' }}>
                {(isTheory || exerciseState.status === 'success') && (
                  <button
                    className="btn-primary"
                    onClick={handleNextStep}
                    style={{ padding: '12px 26px', fontSize: '1rem', fontWeight: '900', boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)' }}
                  >
                    <span>{currentStepIdx + 1 === lesson.steps.length ? 'Finalizar (+5⭐, +2💎)' : 'Continuar'}</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
