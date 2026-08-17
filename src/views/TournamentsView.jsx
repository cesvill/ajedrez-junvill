import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { BotAvatarRenderer, BOT_ROSTER } from '../assets/botRoster';
import { AvatarIcon } from '../assets/avatars';
import { getCoachById } from '../assets/coachesData';
import { getBestBotMove } from '../engine/aiBot';
import { useUser } from '../context/UserContext';
import { audioManager } from '../engine/audio';
import confetti from 'canvas-confetti';
import { Trophy, Swords, Crown, Award, ChevronRight, Play, RotateCcw, CheckCircle, Flame, Shield, ArrowLeft } from 'lucide-react';

const TOURNAMENTS = [
  {
    id: 'tourney_promesas',
    title: 'Copa Promesas Junvill',
    eloRange: '400 - 800 Elo',
    category: 'Iniciación',
    color: '#3b82f6',
    rewardStars: 40,
    rewardGems: 8,
    trophy: '🏆 Copa de Bronce',
    bots: [BOT_ROSTER[0], BOT_ROSTER[1], BOT_ROSTER[5], BOT_ROSTER[6]] // Qwerty, Cosmo-7, Mono, Tiburón
  },
  {
    id: 'tourney_zoo',
    title: 'Torneo Rápido del Zoo',
    eloRange: '800 - 1300 Elo',
    category: 'Táctica Intermedia',
    color: '#10b981',
    rewardStars: 60,
    rewardGems: 15,
    trophy: '🥈 Copa de Plata',
    bots: [BOT_ROSTER[2], BOT_ROSTER[6], BOT_ROSTER[7], BOT_ROSTER[11]] // Sparky, Tiburón, Elefante, Sofía
  },
  {
    id: 'tourney_yusupov',
    title: 'Abierto Maestría Yusupov',
    eloRange: '1300 - 1800 Elo',
    category: 'Estrategia Avanzada',
    color: '#8b5cf6',
    rewardStars: 90,
    rewardGems: 25,
    trophy: '🥇 Copa de Oro',
    bots: [BOT_ROSTER[3], BOT_ROSTER[8], BOT_ROSTER[12], BOT_ROSTER[13]] // Titán, Búho, Carlos, Elena
  },
  {
    id: 'tourney_fide',
    title: 'Grand Prix Corona Real FIDE',
    eloRange: '1800 - 2200+ Elo',
    category: 'Gran Maestro',
    color: '#d97706',
    rewardStars: 150,
    rewardGems: 50,
    trophy: '👑 Corona de Diamante',
    bots: [BOT_ROSTER[4], BOT_ROSTER[9], BOT_ROSTER[13], BOT_ROSTER[14]] // Quantum, Tigre, Elena, GM Kaspar
  }
];

export const TournamentsView = () => {
  const { users = [], currentUser, setActiveUserId, addRewards, recordGameResult } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');

  const [activeMainTab, setActiveMainTab] = useState('tourneys'); // 'tourneys' | 'family_league'
  const [activeTourney, setActiveTourney] = useState(null);
  const [round, setRound] = useState(1); // 1 = Semifinal, 2 = Gran Final, 3 = Campeón
  const [matchState, setMatchState] = useState('bracket'); // 'bracket' | 'playing' | 'won' | 'lost'

  const [game, setGame] = useState(() => new Chess());
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  // Ordenar usuarios por Puntos / Elo para la Liga Familiar
  const rankedUsers = [...users].sort((a, b) => (b.elo + (b.stars || 0)) - (a.elo + (a.stars || 0)));

  const currentOpponent = activeTourney
    ? (round === 1 ? activeTourney.bots[0] : activeTourney.bots[3])
    : null;

  const handleStartTournament = (tourney) => {
    setActiveTourney(tourney);
    setRound(1);
    setMatchState('bracket');
  };

  const handleStartMatch = () => {
    setGame(new Chess());
    setLastMove(null);
    setMatchState('playing');
  };

  const handlePlayerMove = (moveResult, newFen) => {
    if (game.turn() === 'b' || matchState !== 'playing') return;

    setLastMove(moveResult);

    if (game.isGameOver()) {
      handleMatchOver();
      return;
    }

    setIsBotThinking(true);
    setTimeout(() => {
      if (game.isGameOver()) return;
      const botMove = getBestBotMove(game.fen(), activeTourney?.id === 'tourney_fide' ? 4 : 2);
      if (botMove) {
        const nextGame = new Chess(game.fen());
        nextGame.move(botMove);
        setGame(nextGame);
        setLastMove(botMove);
        setIsBotThinking(false);

        if (nextGame.isGameOver()) {
          handleMatchOver(nextGame);
        }
      }
    }, 500);
  };

  const handleMatchOver = (finalGame = game) => {
    setIsBotThinking(false);
    if (finalGame.isCheckmate() && finalGame.turn() === 'b') {
      audioManager.playVictory();
      confetti({ particleCount: 100, spread: 70 });
      if (round === 1) {
        setRound(2);
        setMatchState('bracket');
      } else {
        audioManager.playWarning();
        setMatchState('lost');
        recordGameResult('loss', -5, 60);
      }
    } else {
      setMatchState('lost');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* CABECERA DE TORNEOS */}
      <div className="lessons-header-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="points-summary-text" style={{ margin: 0, textAlign: 'left' }}>
            🏆 Arena de Torneos Junvill
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', margin: '4px 0 0' }}>
            Compite en eliminatorias directas contra los mejores bots y gana trofeos, estrellas ⭐ y gemas 💎.
          </p>
        </div>

        {activeTourney && (
          <button className="btn-secondary" onClick={() => setActiveTourney(null)}>
            <ArrowLeft size={16} />
            <span>Volver a las Copas</span>
          </button>
        )}
      </div>

      {/* VISTA 1: CATÁLOGO DE COPAS */}
      {!activeTourney && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {TOURNAMENTS.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--bg-parchment-card)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', background: 'var(--bg-parchment)', padding: '3px 10px', borderRadius: 'var(--radius-full)', color: t.color, border: `1px solid ${t.color}` }}>
                    {t.category}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-gold-dark)', fontWeight: '800' }}>
                    {t.eloRange}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-parchment-main)', margin: '4px 0 8px' }}>
                  {t.title}
                </h3>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#f59e0b', marginBottom: '12px' }}>
                  {t.trophy}
                </div>

                {/* Rivales */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-parchment-muted)', marginBottom: '6px' }}>Participantes:</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {t.bots.map(b => (
                    <div key={b.id} title={`${b.name} (${b.elo} Elo)`}>
                      <BotAvatarRenderer bot={b} size={32} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Premios y Botón */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--bg-parchment-border)' }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', fontWeight: '800' }}>
                  <span style={{ color: '#f59e0b' }}>⭐ +{t.rewardStars}</span>
                  <span style={{ color: '#ef4444' }}>💎 +{t.rewardGems}</span>
                </div>

                <button className="btn-primary" onClick={() => handleStartTournament(t)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <span>Inscribirse</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA 2: CUADRO DE ELIMINATORIA (BRACKET) */}
      {activeTourney && matchState === 'bracket' && (
        <div style={{
          background: 'var(--bg-parchment-card)',
          border: '1.5px solid var(--bg-parchment-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-parchment-main)', marginBottom: '6px' }}>
            {activeTourney.title} - {round === 1 ? 'Semifinales' : 'Gran Final'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-parchment-muted)', marginBottom: '24px' }}>
            {round === 1 ? 'Vence en la semifinal para asegurar un puesto en la gran final.' : '¡Has llegado a la Gran Final! Lucha por el trofeo del torneo.'}
          </p>

          {/* Cuadro de Enfrentamiento */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {/* Jugador */}
            <div style={{
              background: 'var(--bg-parchment)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px'
            }}>
              <AvatarIcon avatarId={currentUser.avatar} size={54} />
              <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{currentUser.name} (Tú)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: '700' }}>{currentUser.elo} Elo</div>
            </div>

            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--color-gold-dark)' }}>VS</div>

            {/* Rival Bot */}
            <div style={{
              background: 'var(--bg-parchment)',
              border: '2px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px'
            }}>
              <BotAvatarRenderer bot={currentOpponent} size={54} />
              <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{currentOpponent.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '700' }}>{currentOpponent.elo} Elo</div>
            </div>
          </div>

          <button className="btn-gold" onClick={handleStartMatch} style={{ padding: '12px 32px', fontSize: '1rem' }}>
            <Play size={20} />
            <span>Jugar {round === 1 ? 'Semifinal' : 'Gran Final'}</span>
          </button>
        </div>
      )}

      {/* VISTA 3: PARTIDA EN JUEGO */}
      {activeTourney && matchState === 'playing' && (
        <div className="game-responsive-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Oponente */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-parchment-card)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--bg-parchment-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BotAvatarRenderer bot={currentOpponent} size={42} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{currentOpponent.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)' }}>{activeTourney.title} • {currentOpponent.elo} Elo</div>
                </div>
              </div>
              {isBotThinking && <span style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.8rem' }}>Pensando...</span>}
            </div>

            {/* Tablero */}
            <ChessBoard
              fen={game.fen()}
              interactive={game.turn() === 'w' && !isBotThinking}
              onMove={handlePlayerMove}
              lastMove={lastMove}
            />

            {/* Jugador */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-parchment-card)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-parchment-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AvatarIcon avatarId={currentUser.avatar} size={36} />
                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{currentUser.name} (Blancas)</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: '800' }}>⭐ {currentUser.stars}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="coach-bubble">
              <div className="coach-avatar-bubble">
                <AvatarIcon avatarId={activeCoach.id} size={46} />
              </div>
              <div className="coach-content">
                <div className="coach-name">{activeCoach.name}</div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-parchment-main)', margin: '2px 0' }}>
                  {round === 1 ? 'Semifinal del Torneo' : '¡La Gran Final!'}
                </div>
                <div className="coach-speech-text">
                  Mantén la calma y no apresures tus jugadas. Una victoria te otorgará el pase directo.
                </div>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setMatchState('bracket')}>
              <RotateCcw size={16} />
              <span>Rendirse / Salir del Torneo</span>
            </button>
          </div>
        </div>
      )}

      {/* VISTA 4: CAMPEÓN DEL TORNEO */}
      {activeTourney && matchState === 'won' && (
        <div style={{
          background: 'radial-gradient(circle at 50% 30%, #fef3c7 0%, #fde68a 60%, #f59e0b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px 20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          color: '#451a03'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🏆</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '900', margin: '0 0 6px' }}>
            ¡CAMPEÓN DE LA {activeTourney.title.toUpperCase()}!
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px' }}>
            Has superado todas las rondas eliminatorias con maestría impecable.
          </p>

          <div style={{ display: 'inline-flex', gap: '16px', background: 'rgba(255,255,255,0.8)', padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: '900', fontSize: '1.1rem', marginBottom: '28px' }}>
            <span>⭐ +{activeTourney.rewardStars} Estrellas</span>
            <span>💎 +{activeTourney.rewardGems} Gemas</span>
            <span>📈 +25 Elo</span>
          </div>

          <div>
            <button className="btn-primary" onClick={() => setActiveTourney(null)} style={{ padding: '12px 32px', fontSize: '1rem' }}>
              Volver a la Arena
            </button>
          </div>
        </div>
      )}

      {/* VISTA 5: DERROTA */}
      {activeTourney && matchState === 'lost' && (
        <div style={{
          background: 'var(--bg-parchment-card)',
          border: '1.5px solid var(--bg-parchment-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚔️</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-danger)', margin: '0 0 8px' }}>
            Eliminado del Torneo
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-parchment-muted)', marginBottom: '20px' }}>
            {currentOpponent.name} logró imponerse en esta ronda. ¡Entrena tus tácticas e inténtalo de nuevo!
          </p>
          <button className="btn-secondary" onClick={() => setActiveTourney(null)}>
            Volver a la Arena
          </button>
        </div>
      )}
    </div>
  );
};
