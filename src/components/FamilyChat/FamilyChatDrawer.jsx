import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { AvatarIcon } from '../../assets/avatars';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { OnlineBadge } from '../FamilyPresence/OnlineBadge';
import { audioManager } from '../../engine/audio';
import { 
  X, Send, Swords, Smile, MessageSquare, Volume2, Sparkles, 
  ChevronRight, Heart, Flame, Trophy, Award 
} from 'lucide-react';

const QUICK_FAMILY_PHRASES = [
  '¿Jugamos una partida? ⚔️',
  '¡Te reto a Dados Mágicos! 🎲',
  '¡Excelente jugada! 👏',
  '¡Estoy listo para jugar! 🟢',
  '¿Una revancha rápida? ⚡',
  '¡Nos vemos en el tablero! ♟️'
];

const CHAT_EMOTES = [
  { emoji: '👑', label: 'Corona' },
  { emoji: '🏆', label: 'Trofeo' },
  { emoji: '🔥', label: 'Fuego' },
  { emoji: '👏', label: 'Aplauso' },
  { emoji: '🎲', label: 'Dados' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🧠', label: 'Estrategia' },
  { emoji: '⚡', label: 'Rápido' }
];

export const FamilyChatDrawer = ({ 
  isOpen, 
  onClose, 
  targetUser = null,
  onOpenChallenge = null 
}) => {
  const { 
    currentUser, 
    users, 
    familyMessages, 
    sendFamilyMessage, 
    isUserOnline,
    markMessagesAsRead 
  } = useUser();

  const [activeChatUserId, setActiveChatUserId] = useState(targetUser?.id || null);
  const [inputText, setInputText] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (targetUser?.id) {
      setActiveChatUserId(targetUser.id);
    } else if (!activeChatUserId && users.length > 1) {
      const otherUser = users.find(u => u.id !== currentUser?.id);
      if (otherUser) setActiveChatUserId(otherUser.id);
    }
  }, [targetUser, users, currentUser?.id]);

  // Marcar como leídos
  useEffect(() => {
    if (isOpen && activeChatUserId && markMessagesAsRead) {
      markMessagesAsRead(activeChatUserId);
    }
  }, [isOpen, activeChatUserId, familyMessages.length]);

  // Scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [familyMessages, activeChatUserId]);

  if (!isOpen) return null;

  const otherFamilyMembers = users.filter(u => u.id !== currentUser?.id);
  const activeOpponent = users.find(u => u.id === activeChatUserId) || otherFamilyMembers[0];

  // Filtrar mensajes entre el usuario actual y el familiar activo
  const currentChatMessages = (familyMessages || []).filter(msg => 
    (msg.fromUser?.id === currentUser?.id && msg.toUserId === activeChatUserId) ||
    (msg.fromUser?.id === activeChatUserId && msg.toUserId === currentUser?.id)
  );

  const handleSendMessage = (textToSend = null, isEmote = false) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeOpponent) return;

    sendFamilyMessage(activeOpponent, text, isEmote);
    if (!textToSend) setInputText('');
    setShowEmotes(false);
    audioManager?.playMove?.();
  };

  const isOpponentOnline = activeOpponent ? isUserOnline(activeOpponent.id) : false;

  return (
    <div className="modal-overlay" style={{ zIndex: 125 }} onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: '720px', 
          width: '100%', 
          height: '620px', 
          maxHeight: '94vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          background: 'var(--bg-parchment-card, #0f172a)',
          border: '2px solid var(--color-gold, #ca8a04)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div style={{
          padding: '12px 18px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}>
              <MessageSquare size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#f8fafc' }}>
                Chat Familiar en Tiempo Real
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Envía mensajes directos y reta a jugar al instante
              </span>
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

        {/* CUERPO: SELECTOR DE FAMILIAR + CHAT */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* BARRA LATERAL: MIEMBROS FAMILIARES */}
          <div style={{
            width: '200px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 15, 29, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '10px 8px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-gold)', padding: '4px 6px', letterSpacing: '0.5px' }}>
              Familia Junvill
            </div>

            {otherFamilyMembers.map(member => {
              const isSelected = member.id === activeChatUserId;
              const online = isUserOnline(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setActiveChatUserId(member.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid var(--color-gold)' : '1px solid transparent',
                    background: isSelected ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                    {member.avatarConfig ? (
                      <DynamicAvatar config={member.avatarConfig} size={32} />
                    ) : (
                      <AvatarIcon avatarId={member.avatar || 'teen_gamer'} size={32} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '800', fontSize: '0.82rem', color: isSelected ? '#facc15' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.name}
                    </div>
                    <OnlineBadge isOnline={online} size="sm" showLabel={false} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* AREA PRINCIPAL DE CONVERSACIÓN */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0f1d' }}>
            {activeOpponent ? (
              <>
                {/* BARRA SUPERIOR DEL CHAT CON BOTÓN DE RETAR */}
                <div style={{
                  padding: '8px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '900', fontSize: '0.92rem', color: '#f8fafc' }}>
                      {activeOpponent.name}
                    </span>
                    <OnlineBadge isOnline={isOpponentOnline} size="sm" />
                  </div>

                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => {
                      if (onOpenChallenge) {
                        onOpenChallenge(activeOpponent);
                      }
                    }}
                    style={{ padding: '5px 12px', fontSize: '0.78rem', fontWeight: '900', gap: '5px' }}
                  >
                    <Swords size={14} />
                    <span>Retar a Jugar ⚔️</span>
                  </button>
                </div>

                {/* MENSAJES */}
                <div style={{
                  flex: 1,
                  padding: '14px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {currentChatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', margin: 'auto', color: '#64748b', padding: '20px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '6px' }}>💬</div>
                      <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#94a3b8' }}>
                        Inicia una conversación con {activeOpponent.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>
                        Elige una frase rápida o escribe un mensaje personalizado abajo.
                      </div>
                    </div>
                  ) : (
                    currentChatMessages.map(msg => {
                      const isMe = msg.fromUser?.id === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            alignSelf: isMe ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{
                            padding: msg.isEmote ? '4px 10px' : '8px 14px',
                            borderRadius: '12px',
                            background: isMe 
                              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                              : 'rgba(30, 41, 59, 0.9)',
                            color: '#ffffff',
                            fontSize: msg.isEmote ? '2rem' : '0.88rem',
                            fontWeight: msg.isEmote ? '400' : '600',
                            border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                            wordBreak: 'break-word',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                          }}>
                            {msg.text}
                          </div>
                          <span style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px', padding: '0 4px' }}>
                            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* CHIPS DE FRASES RÁPIDAS */}
                <div style={{
                  padding: '6px 12px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}>
                  {QUICK_FAMILY_PHRASES.map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(phrase)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        background: 'rgba(234, 179, 8, 0.1)',
                        color: '#facc15',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* PANEL DE EMOTES DESPLEGABLE */}
                {showEmotes && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {CHAT_EMOTES.map(item => (
                      <button
                        key={item.emoji}
                        type="button"
                        onClick={() => handleSendMessage(item.emoji, true)}
                        style={{
                          fontSize: '1.6rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          cursor: 'pointer'
                        }}
                        title={item.label}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* CAJA DE ENTRADA */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.98)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowEmotes(!showEmotes)}
                    style={{
                      background: showEmotes ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: showEmotes ? '#facc15' : '#cbd5e1',
                      padding: '8px',
                      cursor: 'pointer'
                    }}
                    title="Emotes y Reacciones"
                  >
                    <Smile size={18} />
                  </button>

                  <input
                    type="text"
                    placeholder={`Escribe a ${activeOpponent.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={140}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      background: '#0a0f1d',
                      color: '#f8fafc',
                      fontSize: '0.88rem'
                    }}
                  />

                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={!inputText.trim()}
                    style={{ padding: '10px 16px', gap: '6px', fontSize: '0.88rem', fontWeight: '900' }}
                  >
                    <Send size={16} />
                    <span>Enviar</span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', margin: 'auto', color: '#64748b' }}>
                No hay otros familiares registrados en el grupo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
