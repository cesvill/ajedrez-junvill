import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { useUser } from '../context/UserContext';
import { AvatarIcon } from '../assets/avatars';
import { DynamicAvatar } from '../components/AvatarCreator/DynamicAvatar';
import { OnlineBadge } from '../components/FamilyPresence/OnlineBadge';
import { MINIGAMES_LIST } from '../components/FamilyChallenges/FamilyChallengeDialog';
import { FullBodyAvatar } from '../components/AvatarCreator/FullBodyAvatar';
import { BOT_ROSTER, BotAvatarRenderer } from '../assets/botRoster';
import { CURRICULUM_SECTIONS } from '../curriculum/lessonsData';
import { YusupovRadar } from '../components/RadarChart/YusupovRadar';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { 
  Trophy, Swords, Target, BookOpen, Sparkles, TrendingUp, Flame, 
  Shield, Award, Play, ChevronRight, User, Users, Bot, Star, 
  CheckCircle2, Compass, ArrowRight, Zap, Globe, Crown, ShieldCheck,
  RotateCcw, Trash2, Clock, PlayCircle, X
} from 'lucide-react';

export const HomeView = ({ 
  onNavigate, 
  onOpenProfile, 
  onOpenDaily, 
  onOpenCertificates, 
  onOpenP2P,
  onOpenFamilyChallenges,
  onStartLesson,
  onStartBotGame
}) => {
  const { 
    currentUser, 
    pendingInvitationsForMe, 
    outgoingInvitationsByMe, 
    acceptFamilyInvitation, 
    declineFamilyInvitation,
    activeP2PGame,
    clearActiveP2PGame
  } = useUser();
  const [showRadarSection, setShowRadarSection] = useState(true);

  // 1. Encontrar la siguiente lección recomendada
  const allLessons = CURRICULUM_SECTIONS.flatMap(s => s.lessons);
  const nextLesson = allLessons.find(l => {
    const progress = currentUser.lessonProgress?.[l.id];
    return !progress || (progress.stars < 5 && !progress.completed);
  }) || allLessons[0];

  // 2. Encontrar el siguiente bot recomendado según Elo
  const nextBot = BOT_ROSTER.find(b => {
    const wins = currentUser.botVictories?.[b.id] || 0;
    return wins === 0 && b.elo >= (currentUser.elo - 200);
  }) || BOT_ROSTER[0];

  // Estadísticas del jugador
  const stats = currentUser.stats || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, puzzlesSolved: 0 };
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const completedLessons = Object.values(currentUser.lessonProgress || {}).filter(p => p.completed || p.stars >= 5).length;
  const totalLessonsCount = allLessons.length;
  const progressPercent = Math.min(100, Math.round((currentUser.totalPoints / 110) * 100));

  // Conteo de bots derrotados
  const defeatedBotsCount = Object.keys(currentUser.botVictories || {}).length;
  const familyChallengesCount = (currentUser.customChallenges || []).length;

  // Detección de Partida en Curso Guardada (Aislada por perfil de usuario)
  const STORAGE_KEY = `junvill_ongoing_game_v1_${currentUser?.id || 'default'}`;
  const ONGOING_P2P_KEY = `junvill_ongoing_p2p_game_v1_${currentUser?.id || 'default'}`;
  
  const getOngoingGame = React.useCallback(() => {
    try {
      // 1. Prioridad: Partida P2P familiar activa
      const p2pRaw = localStorage.getItem(ONGOING_P2P_KEY);
      if (p2pRaw) {
        const parsedP2P = JSON.parse(p2pRaw);
        if (parsedP2P && parsedP2P.fen && parsedP2P.roomId) {
          const testP2P = new Chess(parsedP2P.fen);
          if (!testP2P.isGameOver()) {
            return { ...parsedP2P, type: 'p2p', turn: testP2P.turn() };
          } else {
            localStorage.removeItem(ONGOING_P2P_KEY);
          }
        }
      }

      // 2. Partida local vs Bot o Pass and Play
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.fen) return null;
      const testGame = new Chess(parsed.fen);
      if (testGame.isGameOver()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return { ...parsed, type: 'bot', turn: testGame.turn() };
    } catch (e) {
      return null;
    }
  }, [STORAGE_KEY, ONGOING_P2P_KEY]);

  const [ongoingGame, setOngoingGame] = useState(() => getOngoingGame());

  // Actualizar inmediatamente al cambiar de perfil de usuario o al enfocar ventana
  useEffect(() => {
    setOngoingGame(getOngoingGame());
    const handleFocus = () => {
      setOngoingGame(getOngoingGame());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [getOngoingGame, currentUser?.id, activeP2PGame]);

  const ongoingBot = ongoingGame?.botId
    ? (BOT_ROSTER.find(b => b.id === ongoingGame.botId) || BOT_ROSTER[0])
    : BOT_ROSTER[0];

  const handleCancelOngoingGame = () => {
    if (window.confirm('¿Deseas cancelar y descartar la partida en curso?')) {
      try {
        if (ongoingGame?.type === 'p2p') {
          localStorage.removeItem(ONGOING_P2P_KEY);
          if (clearActiveP2PGame) clearActiveP2PGame();
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {}
      setOngoingGame(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '32px' }}>
      
      {/* 0. RETOS E INVITACIONES FAMILIARES ENTRANTES (PRIMERO EN HOME) */}
      {pendingInvitationsForMe && pendingInvitationsForMe.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pendingInvitationsForMe.map((inv) => (
            <div
              key={inv.id}
              style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(16, 185, 129, 0.20) 100%)',
                border: '2.5px solid var(--color-gold)',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '16px 20px',
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                  {inv.fromUser?.avatarConfig ? (
                    <DynamicAvatar config={inv.fromUser.avatarConfig} size={48} />
                  ) : (
                    <AvatarIcon avatarId={inv.fromUser?.avatar || 'teen_gamer'} size={48} />
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚔️</span>
                    <span style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-parchment-main)' }}>
                      ¡{inv.fromUser?.name || 'Un miembro de la familia'} te ha invitado a una partida!
                    </span>
                  </div>
                  <div style={{ fontSize: '0.80rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                    ⏱️ {Math.round((inv.timeControl || 300) / 60)} min • {inv.withAssistance ? '💡 Con Ayudas' : '🛡️ Modo Clásico (Sin Ayudas)'} • Código: <b style={{ color: '#60a5fa', fontFamily: 'monospace' }}>{inv.roomId}</b>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    acceptFamilyInvitation(inv.id);
                    if (onOpenP2P) onOpenP2P(inv.roomId);
                  }}
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.90rem',
                    fontWeight: '900',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  <Swords size={16} />
                  <span>Aceptar y Jugar Ahora ⚔️</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => declineFamilyInvitation(inv.id)}
                  style={{ padding: '10px 14px', fontSize: '0.82rem' }}
                >
                  <X size={15} />
                  <span>Rechazar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 0.1 RETOS SALIENTES ENVIADOS POR MÍ (EN ESPERA DE RIVAL) */}
      {outgoingInvitationsByMe && outgoingInvitationsByMe.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {outgoingInvitationsByMe.map((inv) => (
            <div
              key={inv.id}
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(245, 158, 11, 0.12) 100%)',
                border: '2px solid #3b82f6',
                borderRadius: 'var(--radius-lg, 16px)',
                padding: '14px 20px',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>⏳</span>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#60a5fa' }}>
                    Reto familiar enviado a {inv.toUserName} • Esperando que se una...
                  </div>
                  <div style={{ fontSize: '0.80rem', color: 'var(--text-parchment-muted)', marginTop: '2px' }}>
                    ⏱️ {Math.round((inv.timeControl || 300) / 60)} min • {inv.withAssistance ? '💡 Con Ayudas' : '🛡️ Sin Ayudas'} • Sala: <b style={{ color: '#fbbf24', fontFamily: 'monospace', letterSpacing: '1px' }}>{inv.roomId}</b>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={() => {
                    if (onOpenP2P) onOpenP2P(inv.roomId);
                  }}
                  style={{ padding: '8px 16px', fontSize: '0.86rem', fontWeight: '900', gap: '6px' }}
                >
                  <Swords size={15} />
                  <span>Entrar a la Sala ➔</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => declineFamilyInvitation(inv.id)}
                  style={{ padding: '8px 12px', fontSize: '0.80rem' }}
                >
                  <X size={14} />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. TARJETA HERO: BIENVENIDA Y PERFIL DEL JUGADOR */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-parchment-card) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '2px solid var(--color-gold)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: '14px 20px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={onOpenProfile}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease'
            }}
            title="Haz clic para ver o editar tu perfil y avatar"
          >
            <FullBodyAvatar
              characterId={currentUser.avatar || 'teen_gamer'}
              config={currentUser.avatarConfig}
              width={70}
              height={95}
              interactive={true}
              showPedestal={true}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
                ¡Hola, {currentUser.name}!
              </h2>
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
              }}>
                {currentUser.elo || 400} Elo
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: '800', margin: '2px 0 4px' }}>
              {currentUser.title || 'Aprendiz Promesa'}
            </p>

            {/* Divisas y Racha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '800', color: '#b45309' }}>
                <span>⭐</span>
                <span>{currentUser.stars || 0} estrellas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '800', color: '#b91c1c' }}>
                <span>💎</span>
                <span>{currentUser.gems || 0} gemas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción rápida de perfil */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button 
            className="btn-gold" 
            onClick={onOpenFamilyChallenges} 
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '5px' }}
            title="Ver misiones y premios de Papá y Mamá"
          >
            <span>🎁</span>
            <span>Retos de Familia ({familyChallengesCount})</span>
          </button>
          <button 
            className="btn-secondary" 
            onClick={onOpenDaily} 
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '5px' }}
          >
            <Flame size={14} color="#f59e0b" />
            <span>Reto Diario</span>
          </button>
          <button 
            className="btn-secondary" 
            onClick={onOpenProfile} 
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '5px' }}
          >
            <User size={14} color="var(--color-primary)" />
            <span>Perfil</span>
          </button>
        </div>
      </div>

      {/* TARJETA DE PARTIDA EN CURSO (SI HAY UNA PARTIDA ACTIVA/SIN TERMINAR) */}
      {ongoingGame && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(245, 158, 11, 0.12) 100%)',
          border: '2px solid var(--color-gold)',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: '18px 22px',
          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', flex: 1 }}>
            {ongoingGame.type === 'p2p' ? (
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #3b82f6', flexShrink: 0, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)' }}>
                {ongoingGame.opponent?.avatarConfig ? (
                  <DynamicAvatar config={ongoingGame.opponent.avatarConfig} size={56} />
                ) : (
                  <AvatarIcon avatarId={ongoingGame.opponent?.avatar || 'knight'} size={56} />
                )}
              </div>
            ) : ongoingGame.gameMode === 'pass_and_play' ? (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                border: '3px solid #34d399',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}>
                👥
              </div>
            ) : (
              <div style={{ flexShrink: 0 }}>
                <BotAvatarRenderer bot={ongoingBot} size={56} />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                <span style={{
                  background: ongoingGame.type === 'p2p' ? '#3b82f6' : '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {ongoingGame.type === 'p2p' ? 'Partida Familiar P2P ⚔️' : 'Partida en Curso ⚔️'}
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                  {ongoingGame.updatedAt ? `Guardada ${new Date(ongoingGame.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Activa'}
                </span>
              </div>

              <h3 style={{ margin: '0 0 3px', fontSize: '1.15rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                {ongoingGame.type === 'p2p'
                  ? `Partida en Línea vs ${ongoingGame.opponent?.name || 'Familiar'} (Sala: ${ongoingGame.roomId})`
                  : (ongoingGame.gameMode === 'pass_and_play' 
                      ? 'Partida 2 Jugadores (Pasa y Juega)' 
                      : `Partida vs ${ongoingBot.name} (${ongoingBot.elo} Elo)`)}
              </h3>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-parchment-muted)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span>
                  <strong>Turno {Math.floor((ongoingGame.moveHistory?.length || 0) / 2) + 1}</strong>
                </span>
                <span>•</span>
                <span style={{ color: ongoingGame.turn === 'w' ? '#60a5fa' : '#f59e0b', fontWeight: '700' }}>
                  {ongoingGame.type === 'p2p'
                    ? (ongoingGame.turn === (ongoingGame.assignedColor === 'white' ? 'w' : 'b') ? '🟢 Tu turno para mover' : `⏳ Turno de ${ongoingGame.opponent?.name || 'rival'}`)
                    : (ongoingGame.gameMode === 'pass_and_play'
                        ? (ongoingGame.turn === 'w' ? '⚪ Mueven Blancas (Jugador 1)' : '⚫ Mueven Negras (Jugador 2)')
                        : (ongoingGame.turn === 'w' 
                            ? (ongoingGame.playerColor === 'white' ? '🟢 Tu turno (Blancas)' : `🤖 Turno de ${ongoingBot.name} (Blancas)`)
                            : (ongoingGame.playerColor === 'black' ? '🟢 Tu turno (Negras)' : `🤖 Turno de ${ongoingBot.name} (Negras)`)))}
                </span>
                {ongoingGame.lastMove && (
                  <>
                    <span>•</span>
                    <span>Última: <strong style={{ color: 'var(--text-parchment-main)' }}>{ongoingGame.lastMove.san || `${ongoingGame.lastMove.from}➔${ongoingGame.lastMove.to}`}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción: Reanudar o Cancelar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (ongoingGame.type === 'p2p') {
                  if (onOpenP2P) onOpenP2P(ongoingGame.roomId);
                } else {
                  onNavigate('jugar');
                }
              }}
              className="btn-gold"
              style={{
                padding: '10px 18px',
                fontSize: '0.90rem',
                fontWeight: '900',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
              }}
              title="Continuar jugando exactamente donde ibas"
            >
              <Play size={17} />
              <span>▶ Reanudar Partida</span>
            </button>

            <button
              onClick={handleCancelOngoingGame}
              className="btn-secondary"
              style={{
                padding: '10px 14px',
                fontSize: '0.86rem',
                gap: '6px',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.08)'
              }}
              title="Cancelar y descartar esta partida"
            >
              <Trash2 size={16} color="#ef4444" />
              <span>Cancelar Partida</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. SECCIÓN: SIGUIENTES PASOS RECOMENDADOS (TU RUTA DE HOY) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Compass size={20} color="var(--color-primary)" />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
            🎯 Siguientes Pasos Recomendados
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {/* Tarjeta 1: Continuar Ruta Curricular */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--color-primary)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
                  Lección Recomendada
                </span>
                <span style={{ fontSize: '0.74rem', background: 'var(--color-gold-light)', color: 'var(--color-gold-dark)', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  Paso a paso
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                Lección {nextLesson.number}: {nextLesson.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
                Aprende conceptos fundamentales y gana puntos curriculares para tu diploma.
              </p>
            </div>

            <button
              onClick={() => {
                if (onStartLesson) onStartLesson(nextLesson);
                else onNavigate('aprender');
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <Play size={15} />
              <span>Continuar Lección {nextLesson.number}</span>
            </button>
          </div>

          {/* Tarjeta 2: Siguiente Robot a Vencer */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#10b981' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: '900', color: '#10b981', letterSpacing: '0.5px' }}>
                  Desafío de IA
                </span>
                <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  {nextBot.elo} Elo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '2px 0 6px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                  <BotAvatarRenderer bot={nextBot} size={32} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                    Derrota a {nextBot.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                    {nextBot.role} • {nextBot.personality}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onStartBotGame) onStartBotGame(nextBot);
                else onNavigate('robots');
              }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '0.84rem', borderColor: '#10b981', color: '#10b981' }}
            >
              <Swords size={15} />
              <span>Retar a {nextBot.name}</span>
            </button>
          </div>

          {/* Tarjeta 3: Reto Diario & Problemas Tácticos */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#f59e0b' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: '900', color: '#f59e0b', letterSpacing: '0.5px' }}>
                  Entrenamiento Diario
                </span>
                <span style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  +15 ⭐ +5 💎
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                Desafío Táctico del Día
              </h4>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                Resuelve la posición táctica recomendada por Don Aurelio para mejorar tu visión de juego.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={onOpenDaily}
                className="btn-gold"
                style={{ flex: 1, justifyContent: 'center', padding: '8px 10px', fontSize: '0.82rem' }}
              >
                <Flame size={14} />
                <span>Reto Diario</span>
              </button>
              <button
                onClick={() => onNavigate('problemas')}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '8px 10px', fontSize: '0.82rem' }}
              >
                <Target size={14} />
                <span>Puzzles</span>
              </button>
            </div>
          </div>

          {/* Tarjeta 4: Misiones de Papá & Mamá */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ec4899' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: '900', color: '#ec4899', letterSpacing: '0.5px' }}>
                  Retos Familiares
                </span>
                <span style={{ fontSize: '0.74rem', background: '#fce7f3', color: '#be185d', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  {familyChallengesCount} {familyChallengesCount === 1 ? 'Misión' : 'Misiones'}
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: 'var(--text-parchment-main)', fontWeight: '900' }}>
                Misiones de Papá & Mamá
              </h4>
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                Cumple los objetivos diarios, semanales y mensuales para abrir cofres con premios sorpresa.
              </p>
            </div>

            <button
              onClick={onOpenFamilyChallenges}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', fontSize: '0.84rem', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: '#fff', border: 'none' }}
            >
              <span>🎁 Ver Misiones & Cofres</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN: RESUMEN DE ESTADÍSTICAS Y PROGRESO */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
              📊 Estadísticas de Rendimiento
            </h3>
          </div>

          <button
            onClick={() => setShowRadarSection(!showRadarSection)}
            className="btn-secondary"
            style={{ padding: '3px 10px', fontSize: '0.76rem' }}
          >
            {showRadarSection ? 'Ocultar Radar' : 'Ver Radar Yusupov'}
          </button>
        </div>

        {/* Métricas Principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: showRadarSection ? '14px' : '0'
        }}>
          {/* Puntos Curriculares */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', fontWeight: '800' }}>
              Puntos Curriculares
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--color-gold-dark)', margin: '3px 0 1px' }}>
              {currentUser.totalPoints || 0} <span style={{ fontSize: '0.80rem', color: 'var(--text-parchment-muted)' }}>/ 110</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>
              {progressPercent}% del curso completado
            </div>
          </div>

          {/* Lecciones Completadas */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', fontWeight: '800' }}>
              Lecciones 5⭐
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)', margin: '4px 0 2px' }}>
              {completedLessons} <span style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted)' }}>/ {totalLessonsCount}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
              {totalLessonsCount - completedLessons} restantes
            </div>
          </div>

          {/* Partidas & Victorias */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', fontWeight: '800' }}>
              Partidas Jugadas
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', margin: '4px 0 2px' }}>
              {stats.gamesPlayed}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
              {stats.wins}V • {stats.losses}D ({winRate}% victoria)
            </div>
          </div>

          {/* Problemas Resueltos */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', fontWeight: '800' }}>
              Problemas Resueltos
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#8b5cf6', margin: '4px 0 2px' }}>
              {stats.puzzlesSolved || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)' }}>
              Elo táctico: {currentUser.puzzleRating || 400}
            </div>
          </div>
        </div>

        {/* Radar Yusupov Desplegable */}
        {showRadarSection && (
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-parchment-main)', margin: '0 0 4px', fontWeight: '900' }}>
                Radar de Competencias Ajedrecísticas (Método Yusupov)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: 0 }}>
                Evolución de tus habilidades en las 6 áreas del ajedrez integral
              </p>
            </div>

            <YusupovRadar size={280} />
          </div>
        )}
      </div>

      {/* 4. SECCIÓN: LOGROS, TROFEOS Y DIPLOMAS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={20} color="#f59e0b" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900' }}>
              🏆 Vitrina de Logros y Diplomas
            </h3>
          </div>

          <button
            onClick={onOpenCertificates}
            className="btn-secondary"
            style={{ padding: '4px 12px', fontSize: '0.78rem', gap: '6px' }}
          >
            <Award size={15} color="#f59e0b" />
            <span>Ver Diplomas Oficiales</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {/* Logro: Bots Vencidos */}
          <div style={{
            background: 'var(--bg-parchment-card)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                {defeatedBotsCount} / {BOT_ROSTER.length} Robots Vencidos
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                Domina toda la lista de bots
              </div>
            </div>
          </div>

          {/* Logro: Torneos y Copas */}
          <div 
            onClick={() => onNavigate('torneos')}
            style={{
              background: 'var(--bg-parchment-card)',
              border: '1.5px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Crown size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                Copas de Torneo
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                4 Torneos oficiales disponibles
              </div>
            </div>
          </div>

          {/* Logro: Diplomas Curriculares */}
          <div 
            onClick={onOpenCertificates}
            style={{
              background: 'var(--bg-parchment-card)',
              border: '1.5px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-parchment-main)' }}>
                Diplomas Imprimibles
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-parchment-muted)' }}>
                Con firma y sello oficial
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SECCIÓN: ACCESOS DIRECTOS A MODALIDADES DE JUEGO */}
      <div style={{
        background: 'var(--bg-parchment-card)',
        border: '1.5px solid var(--bg-parchment-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-parchment-main)', margin: '0 0 14px', fontWeight: '900' }}>
          ⚔️ ¿A qué deseas jugar hoy?
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Botón 1: Jugar contra Robots */}
          <button
            onClick={() => onNavigate('robots')}
            className="btn-secondary"
            style={{ padding: '16px 14px', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}
          >
            <Bot size={28} color="#3b82f6" />
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>Contra Robots (IA)</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>15 bots de 400 a 2200 Elo</div>
            </div>
          </button>

          {/* Botón 2: Partida Online P2P */}
          <button
            onClick={onOpenP2P}
            className="btn-secondary"
            style={{ padding: '16px 14px', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}
          >
            <Globe size={28} color="#10b981" />
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>Retar Amigo Online</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>Conexión directa por Sala o QR</div>
            </div>
          </button>

          {/* Botón 3: Torneos Oficiales */}
          <button
            onClick={() => onNavigate('torneos')}
            className="btn-secondary"
            style={{ padding: '16px 14px', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}
          >
            <Trophy size={28} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>Torneos & Copas</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>Eliminatorias y trofeos</div>
            </div>
          </button>

          {/* Botón 4: Pasar y Jugar Local */}
          <button
            onClick={() => onNavigate('jugar')}
            className="btn-secondary"
            style={{ padding: '16px 14px', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}
          >
            <Users size={28} color="var(--color-primary)" />
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--text-parchment-main)' }}>Tablero Libre / 2P</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)' }}>Jugar en el mismo dispositivo</div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
