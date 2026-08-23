import React, { useState } from 'react';
import { ShieldCheck, MessageCircle, Send, Smile, ThumbsUp, Sparkles, Heart } from 'lucide-react';

export const SAFE_MESSAGES = [
  {
    category: '🤝 Saludos y Cortesía',
    messages: [
      { id: 'm1', text: '¡Hola! Que tengamos una gran partida ♟️' },
      { id: 'm2', text: '¡Buena suerte! A divertirnos 🍀' },
      { id: 'm3', text: 'Gracias por jugar conmigo 🤝' },
      { id: 'm4', text: '¡Saludos desde mi tablero! 🌟' }
    ]
  },
  {
    category: '♟️ Durante la Partida',
    messages: [
      { id: 'm5', text: '¡Bien jugado! 👏' },
      { id: 'm6', text: '¡Excelente jugada táctica! 🧠' },
      { id: 'm7', text: '¡Esa no la vi venir, muy buena! 😮' },
      { id: 'm8', text: 'Estoy calculando mi plan... 🤔' },
      { id: 'm9', text: '¡Gran defensa! 🛡️' },
      { id: 'm10', text: '¡Qué partida tan emocionante y reñida! ⚔️' }
    ]
  },
  {
    category: '⏱️ Propuestas y Tiempo',
    messages: [
      { id: 'm11', text: '¿Te gustaría que quedemos en tablas? 🤝' },
      { id: 'm12', text: '¡Final de infarto con el reloj! ⚡' },
      { id: 'm13', text: '¡Tomate tu tiempo, no hay prisa! ⏳' }
    ]
  },
  {
    category: '🏆 Fin de Partida',
    messages: [
      { id: 'm14', text: '¡Felicidades por tu victoria! 🏆' },
      { id: 'm15', text: '¡Gran partida! ¿Jugamos la revancha? 🔄' },
      { id: 'm16', text: '¡Aprendí mucho de este juego, gracias! 🎓' },
      { id: 'm17', text: '¡Nos vemos en el próximo torneo! 👑' }
    ]
  }
];

export const QUICK_EMOTES = ['👏', '🤝', '♟️', '👑', '🧠', '🏆', '⚡', '🔥', '🛡️', '🎉'];

export const SafeChat = ({ onSendMessage, messages = [], activeReaction = null }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div style={{
      background: 'var(--bg-parchment-card)',
      border: '1.5px solid var(--bg-parchment-border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* CABECERA CON SELLO DE PROTECCIÓN INFANTIL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-parchment-border)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageCircle size={17} color="var(--color-primary)" />
          <span style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--text-parchment-main)' }}>
            Chat Deportivo Seguro
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(22, 163, 74, 0.12)', color: 'var(--color-success)', padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: '800' }}>
          <ShieldCheck size={13} />
          <span>Protección Infantil 100%</span>
        </div>
      </div>

      {/* BARRA DE REACCIONES RÁPIDAS (EMOTES) */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Reacciones Rápidas:
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {QUICK_EMOTES.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage(emoji, true);
                }
              }}
              style={{
                background: 'var(--bg-parchment)',
                border: '1px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              title="Enviar reacción"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* HISTORIAL DE MENSAJES RECIBIDOS Y ENVIADOS */}
      <div style={{
        background: 'var(--bg-parchment)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px',
        maxHeight: '130px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        border: '1px solid var(--bg-parchment-border)'
      }}>
        {messages.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-parchment-muted)', textAlign: 'center', fontStyle: 'italic', padding: '12px 0' }}>
            Los mensajes deportivos aparecerán aquí. ¡Sé el primero en saludar!
          </div>
        ) : (
          messages.map((msg, i) => {
            const rawText = msg?.text;
            const displayText = typeof rawText === 'object' && rawText !== null
              ? (rawText.text || rawText.emoji || '')
              : String(rawText || '');

            return (
              <div
                key={i}
                style={{
                  alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                  background: msg.isMe ? 'var(--color-primary)' : 'var(--bg-parchment-card)',
                  color: msg.isMe ? 'white' : 'var(--text-parchment-main)',
                  border: msg.isMe ? 'none' : '1px solid var(--bg-parchment-border)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: msg.isEmote ? '1.4rem' : '0.82rem',
                  fontWeight: '600',
                  maxWidth: '85%',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '0.65rem', opacity: 0.75, marginBottom: '2px', fontWeight: '800' }}>
                  {msg.senderName} {msg.isMe ? '(Tú)' : ''}
                </div>
                {displayText}
              </div>
            );
          })
        )}
      </div>

      {/* CATEGORÍAS DE FRASES PREESTABLECIDAS */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {SAFE_MESSAGES.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedCategory(idx)}
            style={{
              background: selectedCategory === idx ? 'var(--color-primary)' : 'var(--bg-parchment)',
              color: selectedCategory === idx ? 'white' : 'var(--text-parchment-muted)',
              border: '1px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.category.split(' ')[1] || cat.category}
          </button>
        ))}
      </div>

      {/* LISTA DE FRASES PREESTABLECIDAS PARA ENVIAR CON 1 CLIC */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
        {SAFE_MESSAGES[selectedCategory].messages.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              if (onSendMessage) {
                onSendMessage(m.text, false);
              }
            }}
            style={{
              background: 'var(--bg-parchment)',
              border: '1px solid var(--bg-parchment-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: 'var(--text-parchment-main)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{m.text}</span>
            <Send size={12} color="var(--color-primary)" />
          </button>
        ))}
      </div>
    </div>
  );
};
