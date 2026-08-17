import React from 'react';
import { BotAvatarRenderer } from '../../assets/botRoster';
import { AvatarIcon } from '../../assets/avatars';
import { Trophy, ShieldAlert, Scale, RotateCcw, FileSearch, Bot, Home, Eye, X, Sparkles } from 'lucide-react';

export const GameOverModal = ({
  isOpen,
  onClose,
  summaryData,
  currentUser,
  botOpponent,
  gameMode,
  playerColor,
  activeCoach,
  onOpenReview,
  onOpenVictoryCard,
  onRestartGame,
  onOpenRobots,
  onExitToMenu
}) => {
  if (!isOpen || !summaryData) return null;

  const { resultType, title, subtitle, finalReason, moveCount, turnsCount, rewardsText } = summaryData;

  const isWin = resultType === 'win';
  const isLoss = resultType === 'loss';
  const isDraw = resultType === 'draw';

  return (
    <div className="modal-overlay gameover-overlay" role="dialog" aria-modal="true">
      <div className={`modal-content gameover-modal-content result-${resultType}`}>
        {/* Botón cerrar para ver el tablero final */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar y ver tablero"
          title="Ver tablero final"
        >
          <X size={20} />
        </button>

        {/* Cabecera del Resultado */}
        <div className="gameover-header">
          <div className="gameover-icon-badge">
            {isWin && <Trophy size={42} className="gameover-result-icon win-icon" />}
            {isLoss && <ShieldAlert size={42} className="gameover-result-icon loss-icon" />}
            {isDraw && <Scale size={42} className="gameover-result-icon draw-icon" />}
          </div>

          <h2 className="gameover-title">{title}</h2>
          <p className="gameover-subtitle">{subtitle}</p>

          {rewardsText && (
            <div className="gameover-rewards-pill">
              <Sparkles size={14} />
              <span>{rewardsText}</span>
            </div>
          )}
        </div>

        {/* Resumen de la Partida */}
        <div className="gameover-summary-card">
          <div className="gameover-vs-row">
            {/* Jugador */}
            <div className="gameover-player-col">
              <div className="gameover-avatar-wrap">
                <AvatarIcon iconId={currentUser?.avatarId || 'avatar_boy_1'} size={44} />
              </div>
              <span className="gameover-player-name">{currentUser?.name || 'Tú'}</span>
              <span className="gameover-player-meta">
                {playerColor === 'white' ? '⚪ Blancas' : '⚫ Negras'}
              </span>
            </div>

            <div className="gameover-vs-divider">
              <span className="gameover-vs-badge">VS</span>
              <span className="gameover-reason-pill">{finalReason}</span>
            </div>

            {/* Rival */}
            <div className="gameover-player-col">
              <div className="gameover-avatar-wrap">
                {gameMode === 'pass_and_play' ? (
                  <AvatarIcon iconId="avatar_girl_2" size={44} />
                ) : (
                  <BotAvatarRenderer avatar={botOpponent?.avatar || 'bot_1'} size={44} />
                )}
              </div>
              <span className="gameover-player-name">
                {gameMode === 'pass_and_play' ? 'Jugador 2' : (botOpponent?.name || 'Robot')}
              </span>
              <span className="gameover-player-meta">
                {gameMode === 'pass_and_play' ? (playerColor === 'white' ? '⚫ Negras' : '⚪ Blancas') : `${botOpponent?.elo || 400} Elo`}
              </span>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="gameover-stats-grid">
            <div className="gameover-stat-box">
              <span className="stat-label">Movimientos</span>
              <span className="stat-value">{moveCount}</span>
            </div>
            <div className="gameover-stat-box">
              <span className="stat-label">Turnos Jugados</span>
              <span className="stat-value">{turnsCount}</span>
            </div>
            <div className="gameover-stat-box">
              <span className="stat-label">Modalidad</span>
              <span className="stat-value">{gameMode === 'pass_and_play' ? '2 Jugadores' : 'Contra IA'}</span>
            </div>
          </div>

          {/* Mensaje Pedagógico del Tutor */}
          {activeCoach && (
            <div className="gameover-coach-note">
              <div className="coach-note-avatar">
                <AvatarIcon iconId={activeCoach.avatarId || 'avatar_coach_1'} size={32} />
              </div>
              <div className="coach-note-text">
                <span className="coach-note-name">{activeCoach.name} (Tutor):</span>
                <p>
                  {isWin
                    ? '¡Excelente visión estratégica! Revisa la partida para identificar tus mejores jugadas tácticas.'
                    : isLoss
                    ? 'Cada partida perdida es una gran oportunidad de aprendizaje. ¡Analicemos en qué momento se inclinó la balanza!'
                    : 'Las tablas demuestran que diste una gran batalla táctica. ¡Revisa cómo evitar el ahogado o cómo forzar la ventaja!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Acción Post-Partida */}
        <div className="gameover-actions-container">
          {/* Botón Principal: Análisis con IA */}
          <button
            id="btn-gameover-review"
            className="gameover-btn btn-action-review"
            onClick={onOpenReview}
          >
            <FileSearch size={20} />
            <div className="btn-text-block">
              <span className="btn-main-title">🔍 Revisar y Analizar Partida</span>
              <span className="btn-sub-title">Ver jugadas brillantes, errores y precisión %</span>
            </div>
          </button>

          {/* Botón Cromo de Victoria y Compartir en WhatsApp */}
          {onOpenVictoryCard && (
            <button
              id="btn-gameover-victory-card"
              className="btn-gold"
              onClick={onOpenVictoryCard}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.88rem',
                fontWeight: '900',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Trophy size={18} />
              <span>📲 Tarjeta de Victoria / Compartir WhatsApp</span>
            </button>
          )}

          {/* Grid de Botones de Salida y Revancha */}
          <div className="gameover-secondary-grid">
            <button
              id="btn-gameover-rematch"
              className="gameover-btn btn-action-rematch"
              onClick={onRestartGame}
            >
              <RotateCcw size={18} />
              <span>Jugar Revancha</span>
            </button>

            {gameMode === 'bot' && onOpenRobots && (
              <button
                id="btn-gameover-robots"
                className="gameover-btn btn-action-robots"
                onClick={onOpenRobots}
              >
                <Bot size={18} />
                <span>Cambiar Robot</span>
              </button>
            )}

            <button
              id="btn-gameover-exit"
              className="gameover-btn btn-action-exit"
              onClick={() => onExitToMenu('inicio')}
            >
              <Home size={18} />
              <span>Volver al Inicio</span>
            </button>
          </div>

          {/* Botón sutil para ver el tablero final */}
          <button
            className="gameover-btn-view-board"
            onClick={onClose}
          >
            <Eye size={16} />
            <span>Ver tablero final</span>
          </button>
        </div>
      </div>
    </div>
  );
};
