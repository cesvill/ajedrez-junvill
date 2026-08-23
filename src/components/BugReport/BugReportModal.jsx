import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { audioManager } from '../../engine/audio';
import { 
  Bug, 
  X, 
  Send, 
  Copy, 
  Check, 
  Download, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ListFilter,
  FileText,
  Trash2
} from 'lucide-react';

export const PREDEFINED_BUG_TEMPLATES = [
  {
    id: 'casilla_pieza_incoherente',
    category: 'movimiento_invalido',
    label: '📍 Texto dice una casilla o pieza incorrecta (ej: dice h8 y está en h7)',
    description: 'La instrucción o pista menciona una casilla o pieza diferente a la que está en el tablero.'
  },
  {
    id: 'jaque_previo_ilegal',
    category: 'movimiento_invalido',
    label: '⚠️ El rey rival ya estaba en jaque antes de mi turno (Posición ilegal)',
    description: 'La posición del ejercicio comenzó con una jugada previa imposible según las reglas del ajedrez.'
  },
  {
    id: 'jaque_mate_falso',
    category: 'movimiento_invalido',
    label: '👑 Dice Jaque Mate pero el rey tiene escapatoria o defensa',
    description: 'La posición no cumple con la definición técnica de Jaque Mate.'
  },
  {
    id: 'pieza_invisible',
    category: 'movimiento_invalido',
    label: '♟️ La pieza no aparece o no se ve en el tablero',
    description: 'El texto menciona una pieza o movimiento pero no coincide con lo que está en el tablero.'
  },
  {
    id: 'movimiento_bloqueado',
    category: 'movimiento_invalido',
    label: '🚫 El movimiento que pide la lección no se puede realizar',
    description: 'El tablero no permite mover a la casilla indicada o dice que es incorrecto.'
  },
  {
    id: 'pieza_desprotegida',
    category: 'movimiento_invalido',
    label: '🛡️ La pieza que muevo queda desprotegida y la comen gratis',
    description: 'Al hacer la jugada, el rival la captura sin que haya compensación táctica.'
  },
  {
    id: 'no_es_ataque_doble',
    category: 'movimiento_invalido',
    label: '⚔️ Pide ataque doble/horquilla pero no ataca 2 piezas',
    description: 'El ejercicio pide una horquilla pero el movimiento solo amenaza 1 sola pieza.'
  },
  {
    id: 'error_peon_al_paso',
    category: 'movimiento_invalido',
    label: '💨 Error con la regla del Peón al Paso (En Passant)',
    description: 'Problema al capturar al paso o la posición no refleja el salto de dos casillas.'
  },
  {
    id: 'posicion_antinatural',
    category: 'diseno_visual',
    label: '👑 Piezas o Reyes en posiciones extrañas / fuera de lugar',
    description: 'El rey u otras piezas aparecen en casillas incorrectas o invertidas.'
  },
  {
    id: 'bot_bucle_infinito',
    category: 'robot_ia',
    label: '🤖 El robot se queda repitiendo jugadas o en bucle',
    description: 'El robot no busca el jaque mate o mueve la misma pieza de un lado a otro.'
  },
  {
    id: 'reinicio_leccion',
    category: 'movimiento_invalido',
    label: '🔄 La lección no empieza desde el inicio al repetirla',
    description: 'Al abrir o repasar una lección ya completada, no arrancó en el paso 0.'
  },
  {
    id: 'audio_voz_error',
    category: 'diseno_visual',
    label: '🔊 La voz del tutor no coincide con lo que hay en pantalla',
    description: 'El audio lee algo diferente al texto de la instrucción.'
  },
  {
    id: 'visual_recorte',
    category: 'diseno_visual',
    label: '📱 Botones tapados, textos cortados o pantalla completa',
    description: 'Problema de visualización o tamaño del tablero en la pantalla.'
  }
];

export const BugReportModal = ({ isOpen, onClose, contextData = {} }) => {
  const { currentUser } = useUser();
  const [category, setCategory] = useState('movimiento_invalido');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'consolidated'
  const [savedReports, setSavedReports] = useState([]);

  // Cargar reportes consolidados guardados
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('junvill_bug_reports') || '[]');
        setSavedReports(stored);
      } catch (e) {
        setSavedReports([]);
      }
    }
  }, [isOpen]);

  // Manejar selección de plantilla rápida de bug
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setCategory(template.category);
    setComment((prev) => {
      if (!prev.trim()) {
        return template.label + ': ' + template.description;
      }
      return prev + '\n• ' + template.label;
    });
  };

  // Armar el diagnóstico completo del contexto actual
  const diagnosticReport = {
    reportId: `REP-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString(),
    currentView: contextData.view || 'general',
    lessonContext: contextData.lesson ? {
      lessonId: contextData.lesson.id,
      lessonNumber: contextData.lesson.number,
      lessonTitle: contextData.lesson.title,
      stepIndex: contextData.stepIndex,
      stepType: contextData.step?.type,
      stepTitle: contextData.step?.title,
      instruction: contextData.step?.instruction,
      solution: contextData.step?.solution,
      fen: contextData.fen || contextData.step?.fen
    } : null,
    gameContext: contextData.game ? {
      bot: contextData.game.botName,
      botElo: contextData.game.botElo,
      fen: contextData.fen,
      turn: contextData.turn,
      moveCount: contextData.game.moveCount,
      pgn: contextData.game.pgn
    } : null,
    puzzleContext: contextData.puzzle ? {
      puzzleId: contextData.puzzle.id,
      puzzleTitle: contextData.puzzle.title,
      fen: contextData.fen || contextData.puzzle.fen,
      solution: contextData.puzzle.solution
    } : null,
    boardState: {
      fen: contextData.fen || 'N/A',
      orientation: contextData.orientation || 'white'
    },
    userContext: {
      userId: currentUser?.id,
      userName: currentUser?.name,
      elo: currentUser?.elo,
      puzzleRating: currentUser?.puzzleRating,
      theme: currentUser?.theme,
      boardTheme: currentUser?.boardTheme,
      pieceTheme: currentUser?.pieceTheme
    },
    systemEnvironment: {
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      language: typeof navigator !== 'undefined' ? navigator.language : 'es',
      currentUrl: typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  const handleCopyDiagnostic = () => {
    const fullText = JSON.stringify({
      ...diagnosticReport,
      selectedTemplateId,
      userCategory: category,
      userComment: comment,
      userContact: email
    }, null, 2);

    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      try { audioManager?.playSuccess?.(); } catch (e) {}
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleDownloadDiagnostic = () => {
    const fullData = {
      ...diagnosticReport,
      selectedTemplateId,
      userCategory: category,
      userComment: comment,
      userContact: email
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ajedrez-junvill-${diagnosticReport.reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportConsolidatedJson = () => {
    const blob = new Blob([JSON.stringify(savedReports, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consolidado_bugs_junvill_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllReports = () => {
    if (confirm('¿Deseas vaciar el historial de reportes consolidados?')) {
      localStorage.removeItem('junvill_bug_reports');
      setSavedReports([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const reportRecord = {
      ...diagnosticReport,
      selectedTemplateId,
      userCategory: category,
      userComment: comment,
      userContact: email,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    // Guardar en almacenamiento local persistente
    try {
      const existing = JSON.parse(localStorage.getItem('junvill_bug_reports') || '[]');
      existing.unshift(reportRecord);
      const trimmed = existing.slice(0, 100);
      localStorage.setItem('junvill_bug_reports', JSON.stringify(trimmed));
      setSavedReports(trimmed);
    } catch (err) {
      console.error('Error saving bug report locally', err);
    }

    try {
      audioManager?.playSuccess?.();
    } catch (e) {}

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      setSelectedTemplateId(null);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 12000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '680px', 
          width: '100%', 
          maxHeight: '94vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--color-surface, #1e293b)',
          color: 'var(--text-parchment-main, #f8fafc)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.2s ease-out'
        }}
      >
        {/* Cabecera del Modal */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}>
              <Bug size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#f8fafc' }}>
                Reportar Error o Diagnóstico
              </h2>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                Opciones predefinidas + Captura técnica de la posición
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={onClose} 
              className="btn-secondary" 
              style={{ padding: '6px', borderRadius: '50%', width: '32px', height: '32px' }}
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Pestañas: Crear Reporte vs Ver Consolidado */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'report' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
              color: activeTab === 'report' ? '#ef4444' : '#94a3b8',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'report' ? '2px solid #ef4444' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Bug size={15} />
            <span>Nuevo Reporte</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('consolidated')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'consolidated' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeTab === 'consolidated' ? '#f59e0b' : '#94a3b8',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'consolidated' ? '2px solid #f59e0b' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} />
            <span>Consolidado de Bugs ({savedReports.length})</span>
          </button>
        </div>

        {/* Contenido de la pestaña */}
        <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'consolidated' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontWeight: '700' }}>
                  Total de reportes registrados: {savedReports.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {savedReports.length > 0 && (
                    <>
                      <button
                        onClick={handleExportConsolidatedJson}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px', color: '#38bdf8' }}
                      >
                        <Download size={14} />
                        <span>Exportar JSON</span>
                      </button>
                      <button
                        onClick={handleClearAllReports}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '6px', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                        <span>Vaciar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {savedReports.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No hay reportes registrados aún. Cuando reportes un bug, se guardará aquí con todo su contexto técnico.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                  {savedReports.map((rep, idx) => (
                    <div
                      key={rep.reportId || idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', background: '#ef4444', color: 'white', fontWeight: '900', padding: '2px 8px', borderRadius: '12px' }}>
                          {rep.reportId}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          {new Date(rep.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#f8fafc' }}>
                        {rep.lessonContext 
                          ? `Lección ${rep.lessonContext.lessonNumber}: ${rep.lessonContext.lessonTitle} (Paso ${Number(rep.lessonContext.stepIndex || 0) + 1})`
                          : rep.gameContext 
                            ? `Partida vs ${rep.gameContext.bot}` 
                            : 'Reporte General'}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', background: 'rgba(0, 0, 0, 0.3)', padding: '6px 8px', borderRadius: '6px' }}>
                        "{rep.userComment}"
                      </div>

                      {rep.boardState?.fen && rep.boardState.fen !== 'N/A' && (
                        <div style={{ fontSize: '0.70rem', fontFamily: 'monospace', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          FEN: {rep.boardState.fen}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isSubmitted ? (
            <div style={{
              padding: '30px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#22c55e', fontWeight: '700' }}>
                ¡Reporte Enviado y Guardado en el Consolidado!
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', maxWidth: '400px' }}>
                Registramos la posición exacta, paso curricular y detalles técnicos para solucionarlo de inmediato.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tarjeta de Resumen de Contexto Capturado */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '0.82rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold, #f59e0b)', fontWeight: '600' }}>
                  <MapPin size={14} />
                  <span>Contexto Capturado Automáticamente:</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', color: '#cbd5e1' }}>
                  <strong style={{ color: '#94a3b8' }}>Ubicación:</strong>
                  <span style={{ color: '#f8fafc', fontWeight: '500' }}>
                    {contextData.lesson 
                      ? `Lección ${contextData.lesson.number}: ${contextData.lesson.title} (Paso ${Number(contextData.stepIndex || 0) + 1})`
                      : contextData.game 
                        ? `Partida vs ${contextData.game.botName || 'Robot'} (${contextData.game.botElo || 'Bot'} Elo)`
                        : contextData.puzzle
                          ? `Problema: ${contextData.puzzle.title}`
                          : `Sección: ${contextData.view || 'General'}`}
                  </span>

                  {diagnosticReport.boardState.fen !== 'N/A' && (
                    <>
                      <strong style={{ color: '#94a3b8' }}>FEN:</strong>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.74rem', 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={diagnosticReport.boardState.fen}>
                        {diagnosticReport.boardState.fen}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* SECCIÓN DE OPCIONES PREDEFINIDAS RÁPIDAS (CHIPS) */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: '800', marginBottom: '8px', color: '#fde047' }}>
                  <Sparkles size={16} color="#facc15" />
                  <span>Selecciona un problema común (1 clic):</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {PREDEFINED_BUG_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handleSelectTemplate(tmpl)}
                        style={{
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                          color: isSelected ? '#ffffff' : '#cbd5e1',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          lineHeight: '1.3'
                        }}
                      >
                        {tmpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentario del usuario */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px', color: '#e2e8f0' }}>
                  Detalles del error o notas adicionales <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea 
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Puedes añadir más detalles aquí o editar la opción seleccionada..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Acordeón de Detalles Técnicos */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0'
                  }}
                >
                  {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{showTechnicalDetails ? 'Ocultar diagnóstico técnico' : 'Ver diagnóstico técnico completo (JSON)'}</span>
                </button>

                {showTechnicalDetails && (
                  <pre style={{
                    marginTop: '8px',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    color: '#38bdf8',
                    overflowX: 'auto',
                    maxHeight: '140px'
                  }}>
                    {JSON.stringify(diagnosticReport, null, 2)}
                  </pre>
                )}
              </div>

              {/* Botones de Acción */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '6px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCopyDiagnostic}
                    className="btn-secondary"
                    style={{ padding: '7px 12px', fontSize: '0.78rem', gap: '5px' }}
                    title="Copiar informe técnico al portapapeles"
                  >
                    {isCopied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                    <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDiagnostic}
                    className="btn-secondary"
                    style={{ padding: '7px 12px', fontSize: '0.78rem', gap: '5px' }}
                    title="Descargar archivo JSON con el diagnóstico"
                  >
                    <Download size={14} />
                    <span>Descargar</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: '0.80rem' }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '7px 18px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)'
                    }}
                  >
                    <Send size={15} />
                    <span>Enviar Reporte</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
