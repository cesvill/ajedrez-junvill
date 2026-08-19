import React, { useState } from 'react';
import { BOT_ROSTER, BOT_CATEGORIES, BotAvatarRenderer } from '../assets/botRoster';
import { useUser } from '../context/UserContext';
import { Swords, Trophy, Sparkles, Volume2, Star, Zap } from 'lucide-react';

export const RobotsView = ({ onStartBotMatch, onStartBotGame, onOpenBugReport }) => {
  const { currentUser } = useUser();
  const [selectedBotId, setSelectedBotId] = useState('qwerty');
  const [activeCategory, setActiveCategory] = useState('robots');

  const selectedBot = BOT_ROSTER.find(b => b.id === selectedBotId) || BOT_ROSTER[0];
  const filteredBots = BOT_ROSTER.filter(b => b.category === activeCategory);
  const victoriesCount = currentUser?.botVictories?.[selectedBot.id] || 0;

  const handleBotChallenge = (botToChallenge) => {
    const target = botToChallenge || selectedBot;
    const fn = onStartBotMatch || onStartBotGame;
    if (fn) {
      fn(target);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Escaparate Superior del Bot Seleccionado (Estilo ChessKid Hero) */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #312e81 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Decoraciones espaciales */}
        <div style={{ position: 'absolute', top: '12px', left: '18px', opacity: 0.5, fontSize: '0.9rem' }}>✨ 🪐 🌌</div>
        <div style={{ position: 'absolute', top: '15px', right: '24px', opacity: 0.5, fontSize: '0.9rem' }}>🌕 🛸 ⭐</div>

        {/* Info y Avatar del Bot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 320px' }}>
          <div style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
            <BotAvatarRenderer bot={selectedBot} size={90} />
          </div>

          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>
              {selectedBot.name}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#93c5fd', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#fde047', fontWeight: '800', background: 'rgba(253, 224, 71, 0.2)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                {selectedBot.elo} Elo
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Trophy size={15} color="#f59e0b" />
                {victoriesCount} {victoriesCount === 1 ? 'victoria' : 'victorias'}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.88rem', color: '#e0e7ff', maxWidth: '480px', fontStyle: 'italic' }}>
              "{selectedBot.greeting}"
            </div>
          </div>
        </div>

        {/* Botón de Reto */}
        <div>
          <button
            onClick={() => handleBotChallenge(selectedBot)}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 36px',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.1rem',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(234, 88, 12, 0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Swords size={22} />
            <span>Retar a {selectedBot.name}</span>
          </button>
        </div>
      </div>

      {/* Selector de Categorías (Robots, Zoo, Personalidades) */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-parchment-card)',
        padding: '6px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--bg-parchment-border)',
        maxWidth: '560px',
        margin: '0 auto'
      }}>
        {BOT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-parchment-muted)',
                fontWeight: '800',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid Responsivo de Oponentes (Hasta 5 columnas en PC) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '16px'
      }}>
        {filteredBots.map((bot) => {
          const isSelected = selectedBot.id === bot.id;
          const wins = currentUser?.botVictories?.[bot.id] || 0;

          return (
            <button
              key={bot.id}
              onClick={() => setSelectedBotId(bot.id)}
              style={{
                background: isSelected ? 'var(--color-gold-light)' : 'var(--bg-parchment-card)',
                border: `2px solid ${isSelected ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: isSelected ? '0 6px 16px rgba(201, 139, 44, 0.3)' : 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Badge de victorias */}
              {wins > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 7px',
                  fontSize: '0.7rem',
                  fontWeight: '800'
                }}>
                  ⭐ {wins}
                </div>
              )}

              <BotAvatarRenderer bot={bot} size={64} />

              <div style={{ fontWeight: '800', fontSize: '0.98rem', color: 'var(--text-parchment-main)', marginTop: '10px' }}>
                {bot.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: '800' }}>
                {bot.elo} Elo
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted)', marginTop: '4px', textAlign: 'center' }}>
                {bot.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
