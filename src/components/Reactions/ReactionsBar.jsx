import React, { useState } from 'react';
import { Smile, X } from 'lucide-react';

export const REACTION_PRESETS = [
  { id: 'fire', emoji: '🔥', label: '¡Al ataque!' },
  { id: 'shock', emoji: '😲', label: '¡Qué jugada!' },
  { id: 'crown', emoji: '👑', label: '¡Maestro!' },
  { id: 'clap', emoji: '👏', label: '¡Bien jugado!' },
  { id: 'sweat', emoji: '😅', label: '¡Uff por poco!' },
  { id: 'bulb', emoji: '💡', label: '¡Buena idea!' },
  { id: 'shield', emoji: '🛡️', label: '¡Defensa!' },
  { id: 'cool', emoji: '😎', label: '¡Fácil!' },
  { id: 'think', emoji: '🤔', label: '¡Mmm...!' },
  { id: 'party', emoji: '🎉', label: '¡Fiesta!' }
];

export const ReactionsBar = ({ onSendReaction, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (reaction) => {
    onSendReaction(reaction);
    setIsOpen(false);
  };

  return (
    <div className="reactions-picker-container">
      {/* Botón trigger para abrir la barra de emojis */}
      <button
        type="button"
        className={`btn-reaction-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        title="Enviar reacción / cara"
        aria-label="Reaccionar"
      >
        <Smile size={16} />
        <span className="reaction-trigger-text">Reaccionar</span>
      </button>

      {/* Popover con la cuadrícula de reacciones rápidas */}
      {isOpen && (
        <>
          <div className="reaction-backdrop" onClick={() => setIsOpen(false)} />
          <div className="reaction-popover-menu">
            <div className="reaction-popover-header">
              <span>Elige una reacción:</span>
              <button className="reaction-close-btn" onClick={() => setIsOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="reaction-grid">
              {REACTION_PRESETS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="reaction-emoji-btn"
                  onClick={() => handleSelect(r)}
                  title={r.label}
                >
                  <span className="emoji-char">{r.emoji}</span>
                  <span className="emoji-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const ReactionFloatingBubble = ({ reaction, position = 'bottom' }) => {
  if (!reaction) return null;

  return (
    <div className={`reaction-floating-bubble position-${position}`}>
      <span className="bubble-emoji">{reaction.emoji}</span>
      {reaction.label && <span className="bubble-label">{reaction.label}</span>}
    </div>
  );
};
