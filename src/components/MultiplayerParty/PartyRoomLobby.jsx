import React, { useState, useEffect } from 'react';
import { DynamicAvatar } from '../AvatarCreator/DynamicAvatar';
import { AvatarIcon } from '../../assets/avatars';
import { BotAvatarRenderer, BOT_ROSTER } from '../../assets/botRoster';
import { QRCodeDisplay } from '../QRCodeModal/QRCodeDisplay';
import { 
  Users, Bot, Crown, Copy, Check, QrCode, Play, LogOut, 
  Sparkles, Clock, Swords, UserPlus, Share2, AlertCircle, RefreshCw,
  Pause, Bell, Trash2, Monitor, Globe
} from 'lucide-react';

export const PartyRoomLobby = ({
  roomData,
  currentUser,
  isHost,
  mySeatIndex,
  onStartGame,
  onStartWithBotsNow,
  onLeaveRoom,
  onPauseAndExit,
  onInviteFamilyMember,
  onClaimSeat,
  onToggleSeatBot,
  onSetSeatLocal,
  onSetSeatOnline,
  familyMembers = []
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [invitingSeatIdx, setInvitingSeatIdx] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState(new Set());

  const cleanDisplayRoomId = (typeof roomData?.roomId === 'string' && roomData.roomId !== 'OBJECTOBJECT' && roomData.roomId) 
    ? roomData.roomId 
    : 'JUNVILL';
  const { variantName, seats = [], expectedHumans, botsCount, totalPlayers } = roomData || {};
  const roomId = cleanDisplayRoomId;

  // Contar cuántos humanos ya están sentados
  const connectedHumans = seats.filter(s => s.type === 'human' && s.user).length;
  const allHumansConnected = connectedHumans >= expectedHumans;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?partyRoom=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInvite = (user) => {
    if (onInviteFamilyMember) {
      onInviteFamilyMember(user, roomId);
      setInvitedUsers(prev => new Set([...prev, user.id]));
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Banner Principal de la Sala de Espera */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '2px solid #38bdf8',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Info de la Sala y Modalidad */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                padding: '4px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Lobby Multijugador en Vivo
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                • {variantName} ({totalPlayers} Jugadores)
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, color: '#f8fafc', letterSpacing: '0.04em' }}>
                SALA: <span style={{ color: '#facc15', fontFamily: 'monospace' }}>{roomId}</span>
              </h1>

              <button
                onClick={handleCopyCode}
                title="Copiar Código"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: copiedCode ? '#4ade80' : '#cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                title="Copiar Enlace de Invitación"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: copiedLink ? '#4ade80' : '#cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Enlace'}</span>
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                title="Código QR"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: showQR ? '#0284c7' : '#1e293b',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <QrCode size={14} />
                <span>QR</span>
              </button>
            </div>
          </div>

          {/* Contador de Conexiones */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '10px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: allHumansConnected ? '#4ade80' : '#38bdf8' }} />
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>HUMANOS</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: allHumansConnected ? '#4ade80' : '#f8fafc' }}>
                  {connectedHumans} de {expectedHumans} conectados
                </div>
              </div>
            </div>
            {botsCount > 0 && (
              <div style={{ borderLeft: '1px solid #334155', paddingLeft: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} style={{ color: '#facc15' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>ROBOTS IA</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#facc15' }}>
                    {botsCount} asignado{botsCount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal QR si está abierto */}
        {showQR && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#1e293b', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1' }}>
              Escanea este código con tu teléfono o tablet para unirte directamente a la sala:
            </div>
            <QRCodeDisplay value={`${window.location.origin}${window.location.pathname}?partyRoom=${roomId}`} size={160} />
          </div>
        )}
      </div>

      {/* Cuadrícula de Asientos de Jugadores (Seats) */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Asientos de la Partida ({seats.length})</span>
          {seats.length > 0 && (
            allHumansConnected ? (
              <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700 }}>• ¡Todos los humanos están listos!</span>
            ) : (
              <span style={{ color: '#facc15', fontSize: '12px', fontWeight: 700 }}>• Esperando a que se unan {expectedHumans - connectedHumans} humano(s)...</span>
            )
          )}
        </h2>

        {seats.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '36px 20px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: '2px dashed #38bdf8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <RefreshCw size={36} color="#38bdf8" style={{ animation: 'spin 1.5s linear infinite' }} />
            <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Sincronizando Asientos con la Sala en la Nube...
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
              Conectando con el anfitrión y descargando la configuración de asientos. En un instante verás tus colores asignados.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}>
          {seats.map((seat, idx) => {
            const isMySeat = mySeatIndex === idx;
            const isHumanOccupied = seat.type === 'human' && seat.user;
            const isHumanWaiting = seat.type === 'human' && !seat.user;
            const isBot = seat.type === 'bot';

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#0f172a',
                  border: `2px solid ${seat.colorHex || '#334155'}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                  boxShadow: isHumanOccupied ? `0 8px 20px ${seat.colorHex}22` : 'none',
                  animation: isHumanWaiting ? 'pulse 2s infinite' : 'none'
                }}
              >
                {/* Cabecera del Asiento */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: seat.colorHex || '#94a3b8'
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#f8fafc' }}>
                      {seat.label}
                    </span>
                  </div>

                  {seat.isHost && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#facc15',
                      backgroundColor: 'rgba(250, 204, 21, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <Crown size={12} /> Anfitrión
                    </span>
                  )}

                  {isMySeat && !seat.isHost && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#38bdf8',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      (Tú)
                    </span>
                  )}

                  {seat.isLocalDevice && !seat.isHost && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#4ade80',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <Monitor size={12} /> Este equipo
                    </span>
                  )}

                  {isBot && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#cbd5e1',
                      backgroundColor: '#1e293b',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <Bot size={12} /> Robot IA
                    </span>
                  )}
                </div>

                {/* Contenido del Asiento */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '68px',
                  padding: '8px',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px'
                }}>
                  {/* CASO 1: Humano Conectado */}
                  {isHumanOccupied && (
                    <>
                      <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        {seat.user.avatarConfig ? (
                          <DynamicAvatar config={seat.user.avatarConfig} size={48} />
                        ) : (
                          <AvatarIcon avatarId={seat.user.avatar || 'teen_gamer'} size={48} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {seat.user.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          ELO: {seat.user.elo || 600} • {seat.isLocalDevice ? 'Compartiendo pantalla' : seat.user.role === 'coach' ? 'Profesor' : seat.user.role === 'parent' ? 'Tutor' : 'Estudiante'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700, marginTop: '2px' }}>
                          🟢 {seat.isLocalDevice ? 'Listo en este equipo' : 'En Línea y Listo'}
                        </div>
                      </div>
                    </>
                  )}

                  {/* CASO 2: Robot IA Asignado */}
                  {isBot && (
                    <>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: `${seat.bot?.color || '#38bdf8'}22`,
                        border: `1.5px solid ${seat.bot?.color || '#38bdf8'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {BOT_ROSTER.find(b => b.id === seat.bot?.id) ? (
                          <BotAvatarRenderer bot={BOT_ROSTER.find(b => b.id === seat.bot?.id)} size={44} />
                        ) : (
                          <span style={{ fontSize: '24px' }}>🤖</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                          {seat.bot?.name || 'Robot'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          ELO: {seat.bot?.elo || 500} • {seat.bot?.title || 'Robot Homogéneo'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginTop: '2px' }}>
                          ⚡ Listo para jugar
                        </div>
                      </div>
                    </>
                  )}

                  {/* CASO 3: Asiento Humano en Espera */}
                  {isHumanWaiting && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      textAlign: 'center',
                      padding: '6px'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#facc15', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} />
                        <span>Esperando jugador humano...</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Comparte el código <b style={{ color: '#f8fafc' }}>{roomId}</b>
                      </div>
                    </div>
                  )}
                </div>

                {/* Si el asiento es un compañero en este equipo y somos el host, permitir volver a poner online o cambiar a bot */}
                {seat.isLocalDevice && !seat.isHost && isHost && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {onSetSeatOnline && (
                      <button
                        onClick={() => onSetSeatOnline(idx)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          color: '#38bdf8',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Globe size={12} />
                        <span>Pasar a Online</span>
                      </button>
                    )}
                    {onToggleSeatBot && (
                      <button
                        onClick={() => onToggleSeatBot(idx)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#facc15',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Bot size={12} />
                        <span>Bot</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Botón para que el invitado tome este asiento si aún no tiene uno */}
                {isHumanWaiting && !isHost && mySeatIndex === -1 && onClaimSeat && (
                  <button
                    onClick={() => onClaimSeat(idx)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#16a34a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    <UserPlus size={15} />
                    <span>Tomar este Asiento</span>
                  </button>
                )}

                {/* Acciones para Asiento Vacío (En este equipo / Invitar Familiar / Bot) */}
                {isHumanWaiting && isHost && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {onSetSeatLocal && (
                        <button
                          onClick={() => onSetSeatLocal(idx)}
                          title="Jugar en este mismo dispositivo (Pass & Play)"
                          style={{
                            flex: 1,
                            padding: '8px 10px',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            borderRadius: '8px',
                            color: '#4ade80',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <Monitor size={13} />
                          <span>En este equipo</span>
                        </button>
                      )}

                      <button
                        onClick={() => setInvitingSeatIdx(invitingSeatIdx === idx ? null : idx)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          color: '#38bdf8',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <UserPlus size={13} />
                        <span>{invitingSeatIdx === idx ? 'Cerrar' : 'Familiar'}</span>
                      </button>

                      {onToggleSeatBot && (
                        <button
                          onClick={() => onToggleSeatBot(idx)}
                          title="Convertir a Robot IA"
                          style={{
                            padding: '8px 10px',
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#facc15',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Bot size={13} />
                          <span>Bot</span>
                        </button>
                      )}
                    </div>

                    {/* Selector de familiares desplegable */}
                    {invitingSeatIdx === idx && (
                      <div style={{
                        marginTop: '8px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxHeight: '160px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, padding: '2px 4px' }}>
                          Selecciona a quién invitar:
                        </div>
                        {familyMembers.filter(m => m.id !== currentUser?.id).map(member => {
                          const isAlreadyInvited = invitedUsers.has(member.id);
                          return (
                            <div
                              key={member.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '6px 8px',
                                backgroundColor: '#0f172a',
                                borderRadius: '6px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '22px', height: '22px' }}>
                                  {member.avatarConfig ? (
                                    <DynamicAvatar config={member.avatarConfig} size={22} />
                                  ) : (
                                    <AvatarIcon avatarId={member.avatar || 'teen_gamer'} size={22} />
                                  )}
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                                  {member.name}
                                </span>
                              </div>

                              <button
                                onClick={() => handleSendInvite(member)}
                                style={{
                                  backgroundColor: isAlreadyInvited ? '#d97706' : '#0284c7',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {isAlreadyInvited ? (
                                  <>
                                    <Bell size={11} />
                                    <span>Dar Toque</span>
                                  </>
                                ) : (
                                  <span>Invitar</span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Barra de Controles Inferior del Lobby */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onPauseAndExit || onLeaveRoom}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              padding: '12px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
            title="Guarda la sala en tus partidas pendientes y vuelve al menú"
          >
            <Pause size={16} />
            <span>Pausar y Volver a Jugar</span>
          </button>

          <button
            onClick={onLeaveRoom}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '12px 14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
            title={isHost ? 'Cancelar y eliminar esta sala' : 'Abandonar sala'}
          >
            <Trash2 size={16} />
            <span>{isHost ? 'Cancelar Sala' : 'Abandonar'}</span>
          </button>
        </div>

        {/* Acciones del Anfitrión */}
        {isHost ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!allHumansConnected && (
              <button
                onClick={onStartWithBotsNow}
                title="Si no quieres esperar a más humanos, completa los asientos restantes con robots ahora mismo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#334155',
                  color: '#facc15',
                  border: '1px solid #475569',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <Bot size={16} />
                <span>Empezar Ahora (Rellenar con Bots)</span>
              </button>
            )}

            <button
              onClick={onStartGame}
              disabled={!allHumansConnected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: allHumansConnected ? '#16a34a' : '#334155',
                color: allHumansConnected ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '15px',
                cursor: allHumansConnected ? 'pointer' : 'not-allowed',
                boxShadow: allHumansConnected ? '0 4px 18px rgba(22, 163, 74, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Play size={18} />
              <span>{allHumansConnected ? '¡Todos Listos! Iniciar Partida' : `Esperando ${expectedHumans - connectedHumans} humano(s)...`}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#facc15', fontSize: '13px', fontWeight: 700 }}>
            <Clock size={16} />
            <span>Esperando a que el anfitrión inicie la partida...</span>
          </div>
        )}
      </div>
    </div>
  );
};
