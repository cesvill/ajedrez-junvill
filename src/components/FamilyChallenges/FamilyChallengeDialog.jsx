import React, { useState } from 'react';
import { CHESS_VARIANTS } from '../../engine/variantsEngine';
import { AvatarIcon } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { OnlineBadge } from '../FamilyPresence/OnlineBadge';
import { Swords, Clock, ShieldCheck, Sparkles, X, MessageSquare, Send, Dice5, Trophy, Zap } from 'lucide-react';

export const MINIGAMES_LIST = [
  {
    id: 'standard',
    name: 'Ajedrez Tradicional',
    subtitle: 'Reglamentario FIDE (32 piezas)',
    icon: '♟️',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    description: 'Partida estándar clásica con todas las reglas oficiales.'
  },
  {
    id: 'dice_chess',
    name: 'Dados Mágicos',
    subtitle: 'El dado elige qué pieza mueves',
    icon: '🎲',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    description: 'En cada turno un dado indica qué pieza mover. ¡Diversión familiar asegurada!'
  },
  {
    id: 'king_of_the_hill',
    name: 'Rey de la Colina',
    subtitle: 'Lleva tu rey a las 4 casillas centrales',
    icon: '⛰️👑',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    description: 'El primer rey en pisar d4, d5, e4 o e5 gana de inmediato.'
  },
  {
    id: 'pawn_wars_pure',
    name: 'Guerra de Peones Pura',
    subtitle: '8 Peones vs 8 Peones (Sin Reyes)',
    icon: '⚔️♟️',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    description: 'Sin reyes ni jaques. El primero que corone o capture todos los peones gana.'
  },
  {
    id: 'pawns_vs_knights',
    name: 'Peones vs Caballos (PECA)',
    subtitle: '8 Peones Blancos vs 2 Caballos Negros',
    icon: '🐴♟️',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    description: 'Los peones asaltan la meta mientras los caballos defienden con horquillas.'
  },
  {
    id: 'rooks_sweeper',
    name: 'La Torre Cazadora',
    subtitle: '8 Peones vs 1 Torre Negra',
    icon: '🏰♟️',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    description: '¿Podrán los peones coordinarse o la torre limpiará todas las columnas?'
  },
  {
    id: 'bishops_duel',
    name: 'Alfiles Cruzados',
    subtitle: '8 Peones vs 2 Alfiles',
    icon: '♗♟️',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    description: 'Entrenamiento táctico de diagonales largas y rupturas con peones.'
  },
  {
    id: 'queens_duel',
    name: 'Duelo de Damas y Peones',
    subtitle: '1 Dama + 8 Peones por bando',
    icon: '👸♟️',
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.15)',
    description: 'Juego de alta velocidad con ataques dobles masivos y coronaciones relámpago.'
  },
  {
    id: 'fischer_960',
    name: 'Ajedrez 960 (Fischer)',
    subtitle: 'Piezas iniciales aleatorias simétricas',
    icon: '🎲♟️',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    description: 'Sin memoria de aperturas: pura visión táctica e intuición.'
  }
];

export const FamilyChallengeDialog = ({ 
  isOpen, 
  onClose, 
  opponent, 
  isOpponentOnline = false,
  onSendChallenge 
}) => {
  const [selectedVariant, setSelectedVariant] = useState('standard');
  const [timeControl, setTimeControl] = useState(300); // 300 seg (5 min)
  const [withAssistance, setWithAssistance] = useState(true);
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen || !opponent) return null;

  const timeOptions = [
    { secs: 60, label: '⚡ 1 min (Bala)' },
    { secs: 180, label: '⏱️ 3 min (Blitz)' },
    { secs: 300, label: '⏱️ 5 min (Rápida)' },
    { secs: 600, label: '⏳ 10 min (Clásica)' },
    { secs: 0, label: '♾️ Sin Tiempo' }
  ];

  const handleSend = () => {
    onSendChallenge({
      opponent,
      timeControl,
      withAssistance,
      gameVariant: selectedVariant,
      customMessage: customMessage.trim()
    });
    onClose();
  };

  const selectedGameInfo = MINIGAMES_LIST.find(g => g.id === selectedVariant) || MINIGAMES_LIST[0];

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }} onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '680px', 
          width: '100%', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          padding: '24px',
          background: 'var(--bg-parchment-card, #0f172a)',
          border: '2px solid var(--color-gold, #ca8a04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--color-gold)'
            }}>
              {opponent.avatarConfig ? (
                <DynamicAvatar config={opponent.avatarConfig} size={46} />
              ) : (
                <AvatarIcon avatarId={opponent.avatar || 'teen_gamer'} size={46} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#f8fafc' }}>
                  Retar a {opponent.name}
                </h3>
                <OnlineBadge isOnline={isOpponentOnline} size="sm" />
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                {opponent.title || 'Miembro Familiar'} • {opponent.elo || 600} Elo
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* 1. SELECCIÓN DE MINIJUEGO O MODALIDAD */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '900', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            1. Elige el Tipo de Juego o Minijuego:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '8px' }}>
            {MINIGAMES_LIST.map((game) => {
              const isSelected = selectedVariant === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setSelectedVariant(game.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: isSelected ? `2px solid ${game.color}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? game.bg : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '1.4rem' }}>{game.icon}</span>
                    {isSelected && <span style={{ color: game.color, fontSize: '0.72rem', fontWeight: '900' }}>✓ Seleccionado</span>}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.86rem', color: isSelected ? '#ffffff' : '#e2e8f0', marginTop: '2px' }}>
                    {game.name}
                  </div>
                  <div style={{ fontSize: '0.70rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    {game.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicación del juego seleccionado */}
        <div style={{
          background: selectedGameInfo.bg,
          border: `1px solid ${selectedGameInfo.color}`,
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '18px',
          fontSize: '0.80rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.6rem' }}>{selectedGameInfo.icon}</span>
          <div>
            <strong style={{ color: selectedGameInfo.color }}>{selectedGameInfo.name}: </strong>
            <span>{selectedGameInfo.description}</span>
          </div>
        </div>

        {/* 2. CONTROL DE TIEMPO */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '900', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            2. Tiempo por Jugador:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {timeOptions.map((t) => (
              <button
                key={t.secs}
                type="button"
                onClick={() => setTimeControl(t.secs)}
                style={{
                  flex: '1 1 auto',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: timeControl === t.secs ? '2px solid var(--color-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: timeControl === t.secs ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.04)',
                  color: timeControl === t.secs ? '#000000' : '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.80rem',
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. AYUDAS TÁCTICAS */}
        <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.86rem', color: '#f8fafc' }}>
              Ayudas Tácticas y Guías Visuales
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              {withAssistance ? 'Muestra casillas bajo amenaza y pistas para principiantes' : 'Modo clásico puro sin sugerencias'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWithAssistance(!withAssistance)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: withAssistance ? '1.5px solid #10b981' : '1.5px solid #64748b',
              background: withAssistance ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
              color: withAssistance ? '#34d399' : '#94a3b8',
              fontWeight: '900',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {withAssistance ? '💡 Activadas' : '🛡️ Desactivadas'}
          </button>
        </div>

        {/* 4. MENSAJE PERSONALIZADO OPCIONAL */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ fontSize: '0.80rem', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
            💬 Mensaje o Frase para tu Rival (Opcional):
          </label>
          <input
            type="text"
            placeholder="Ej: ¡A ver si me ganas en Dados Mágicos! 🎲"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            maxLength={80}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              background: '#0a0f1d',
              color: '#f8fafc',
              fontSize: '0.88rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-gold"
            onClick={handleSend}
            style={{ padding: '10px 24px', fontSize: '0.96rem', fontWeight: '900', gap: '8px', boxShadow: '0 4px 16px rgba(234, 179, 8, 0.4)' }}
          >
            <Swords size={18} />
            <span>Enviar Reto a {opponent.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
