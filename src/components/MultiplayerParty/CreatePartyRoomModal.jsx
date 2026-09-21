import React, { useState } from 'react';
import { P2PEngine } from '../../engine/p2pEngine';
import { BOT_ROSTER, BotAvatarRenderer } from '../../assets/botRoster';
import { X, Users, Bot, Sparkles, Swords, Dices, Star, Compass, ArrowRight, ShieldCheck, Globe, Monitor } from 'lucide-react';

export const MULTIPLAYER_VARIANTS = [
  {
    id: 'four_player',
    name: 'Ajedrez para 4 en Cruz',
    subtitle: 'Tablero 14×14 (160 casillas)',
    totalPlayers: 4,
    icon: '⚔️',
    color: '#ef4444',
    badge: '4 Jugadores',
    desc: '4 ejércitos completos en cruz. Turnos en sentido horario: Rojo, Azul, Amarillo y Verde.'
  },
  {
    id: 'chaturaji',
    name: 'Chaturaji Védico',
    subtitle: 'Tablero 8×8 con Dados Sagrados',
    totalPlayers: 4,
    icon: '🎲',
    color: '#f59e0b',
    badge: '4 Jugadores',
    desc: '4 ejércitos en las esquinas. Cada tirada de dado determina qué pieza mover.'
  },
  {
    id: 'three_hex',
    name: 'Ajedrez para 3 Hexagonal',
    subtitle: '96 casillas trilobulares con nexo central',
    totalPlayers: 3,
    icon: '⭐',
    color: '#38bdf8',
    badge: '3 Jugadores',
    desc: '3 ejércitos (Blanco, Negro y Rojo). Las diagonales se bifurcan en el centro.'
  },
  {
    id: 'three_circular',
    name: '3-Man Chess (Circular)',
    subtitle: '144 casillas concéntricas en 360°',
    totalPlayers: 3,
    icon: '🌀',
    color: '#a855f7',
    badge: '3 Jugadores',
    desc: '3 ejércitos en 6 anillos y 24 radios. Movimientos envolventes continuos.'
  }
];

export const CreatePartyRoomModal = ({ isOpen, onClose, onRoomCreated, currentUser }) => {
  const [selectedVariantId, setSelectedVariantId] = useState('four_player');
  const [expectedHumans, setExpectedHumans] = useState(2); // Por defecto 2 humanos
  const [deviceMode, setDeviceMode] = useState('online'); // 'online' (disp separados) | 'hybrid' (en este mismo equipo)
  const [localPlayersCount, setLocalPlayersCount] = useState(2); // Cantidad de jugadores en esta misma pantalla
  const [selectedBotId, setSelectedBotId] = useState('qwerty');

  if (!isOpen) return null;

  const currentVariant = MULTIPLAYER_VARIANTS.find(v => v.id === selectedVariantId) || MULTIPLAYER_VARIANTS[0];
  const maxPlayers = currentVariant.totalPlayers; // 3 o 4
  const minHumans = 1;
  const maxHumans = maxPlayers;

  // Asegurar que expectedHumans esté en rango al cambiar variante
  const safeHumans = Math.min(Math.max(expectedHumans, 2), maxPlayers);
  const botsCount = maxPlayers - safeHumans;
  const selectedBot = BOT_ROSTER.find(b => b.id === selectedBotId) || BOT_ROSTER[0];

  // Ajustar localPlayersCount si excede safeHumans
  const safeLocalPlayers = deviceMode === 'hybrid' ? Math.min(Math.max(localPlayersCount, 2), safeHumans) : 1;

  const handleVariantChange = (vId) => {
    setSelectedVariantId(vId);
    const targetVar = MULTIPLAYER_VARIANTS.find(v => v.id === vId);
    if (targetVar) {
      if (expectedHumans > targetVar.totalPlayers) {
        setExpectedHumans(targetVar.totalPlayers);
      }
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newRoomId = P2PEngine.generateRoomId();

    // Configuración de asientos según la modalidad
    let seatColors = [];
    if (selectedVariantId === 'four_player') {
      seatColors = [
        { colorKey: 'red', label: 'Rojo (Sur)', hex: '#ef4444' },
        { colorKey: 'blue', label: 'Azul (Oeste)', hex: '#3b82f6' },
        { colorKey: 'yellow', label: 'Amarillo (Norte)', hex: '#f59e0b' },
        { colorKey: 'green', label: 'Verde (Este)', hex: '#10b981' }
      ];
    } else if (selectedVariantId === 'chaturaji') {
      seatColors = [
        { colorKey: 'red', label: 'Rojo', hex: '#ef4444' },
        { colorKey: 'green', label: 'Verde', hex: '#10b981' },
        { colorKey: 'yellow', label: 'Amarillo', hex: '#f59e0b' },
        { colorKey: 'black', label: 'Negro', hex: '#64748b' }
      ];
    } else {
      // 3 jugadores (Hex o Circular)
      seatColors = [
        { colorKey: 'white', label: 'Blanco', hex: '#f8fafc' },
        { colorKey: 'black', label: 'Negro', hex: '#64748b' },
        { colorKey: 'red', label: 'Rojo', hex: '#ef4444' }
      ];
    }

    const seats = seatColors.map((sc, idx) => {
      const isLocalHost = idx === 0;
      const isLocalCompanion = deviceMode === 'hybrid' && idx < safeLocalPlayers;

      if (isLocalHost) {
        // Asiento 0: El Host (Humano - Este dispositivo)
        return {
          seatIndex: 0,
          color: sc.colorKey,
          label: sc.label,
          colorHex: sc.hex,
          type: 'human',
          isHost: true,
          isLocalDevice: true,
          user: {
            id: currentUser?.id || 'host_user',
            name: currentUser?.name || 'Anfitrión',
            avatar: currentUser?.avatar || 'custom_dynamic',
            avatarConfig: currentUser?.avatarConfig || null,
            elo: currentUser?.elo || 600,
            role: currentUser?.role || 'student',
            isLocalDevice: true
          },
          ready: true
        };
      } else if (isLocalCompanion) {
        // Asientos para compañeros locales que juegan en ESTE MISMO DISPOSITIVO
        return {
          seatIndex: idx,
          color: sc.colorKey,
          label: sc.label,
          colorHex: sc.hex,
          type: 'human',
          isHost: false,
          isLocalDevice: true,
          user: {
            id: `local_p${idx + 1}`,
            name: `Compañero ${idx + 1} (Local)`,
            avatar: 'teen_gamer',
            avatarConfig: null,
            elo: 600,
            role: 'student',
            isLocalDevice: true
          },
          ready: true
        };
      } else if (idx < safeHumans) {
        // Asientos reservados para otros Humanos ONLINE en otros dispositivos
        return {
          seatIndex: idx,
          color: sc.colorKey,
          label: sc.label,
          colorHex: sc.hex,
          type: 'human',
          isHost: false,
          isLocalDevice: false,
          user: null, // Pendiente de conexión online
          ready: false
        };
      } else {
        // Asientos completados automáticamente con el Robot homogéneo seleccionado
        return {
          seatIndex: idx,
          color: sc.colorKey,
          label: sc.label,
          colorHex: sc.hex,
          type: 'bot',
          isHost: false,
          isLocalDevice: false,
          bot: {
            id: selectedBot.id,
            name: `${selectedBot.name} (${sc.label})`,
            elo: selectedBot.elo,
            title: selectedBot.title || 'Robot Junvill',
            color: sc.hex,
            avatar: selectedBot.avatar || 'robot_qwerty',
            personality: selectedBot.personality || 'Equilibrado',
            difficultyLevel: selectedBot.difficultyLevel || 1
          },
          ready: true
        };
      }
    });

    const roomData = {
      roomId: newRoomId,
      variantId: selectedVariantId,
      variantName: currentVariant.name,
      totalPlayers: maxPlayers,
      expectedHumans: safeHumans,
      deviceMode,
      localPlayersCount: safeLocalPlayers,
      botsCount,
      selectedBotId: selectedBot.id,
      botModel: {
        id: selectedBot.id,
        name: selectedBot.name,
        elo: selectedBot.elo,
        avatar: selectedBot.avatar
      },
      hostUserId: currentUser?.id || 'host_user',
      hostUser: {
        id: currentUser?.id || 'host_user',
        name: currentUser?.name || 'Anfitrión',
        avatarConfig: currentUser?.avatarConfig || null
      },
      status: 'lobby', // 'lobby' | 'playing' | 'gameover'
      seats,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    onRoomCreated(roomData);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 110, padding: '16px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '620px',
          width: '100%',
          backgroundColor: '#0f172a',
          border: '2px solid #38bdf8',
          borderRadius: '20px',
          padding: '24px',
          color: '#f8fafc',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>
                Crear Sala Multijugador Online
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Partidas en red para más de 2 jugadores con humanos y robots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* PASO 1: Modalidad de Juego */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#38bdf8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Selecciona la Modalidad de Juego:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {MULTIPLAYER_VARIANTS.map(v => {
                const isSelected = selectedVariantId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#1e293b',
                      border: isSelected ? `2px solid ${v.color}` : '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{v.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                          {v.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: v.color,
                        backgroundColor: `${v.color}20`,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {v.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {v.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 2: Cantidad de Humanos y Robots */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#facc15', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. ¿Cuántos jugadores humanos jugarán?
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              {Array.from({ length: maxPlayers - 1 }, (_, i) => i + 2).map(count => {
                const isSelected = safeHumans === count;
                const bots = maxPlayers - count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setExpectedHumans(count)}
                    style={{
                      flex: 1,
                      padding: '12px 10px',
                      backgroundColor: isSelected ? '#0284c7' : '#1e293b',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: 900 }}>
                      {count} Humanos
                    </div>
                    <div style={{ fontSize: '11px', color: isSelected ? '#e0f2fe' : '#94a3b8' }}>
                      {bots > 0 ? `+ ${bots} Robot${bots > 1 ? 's' : ''}` : 'Sin Robots'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Resumen Visual de Asientos */}
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#38bdf8' }} />
                <span>Humanos a esperar: <b style={{ color: '#38bdf8' }}>{safeHumans}</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} style={{ color: '#facc15' }} />
                <span>Robots IA automáticos: <b style={{ color: '#facc15' }}>{botsCount}</b></span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                Total: <b>{maxPlayers} jugadores</b>
              </div>
            </div>
          </div>

          {/* PASO 3: Distribución de Dispositivos (Mismo dispositivo vs Online) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#38bdf8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3. ¿Cómo jugarán los humanos? (Dispositivos)
            </label>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8' }}>
              Puedes jugar con amigos online o compartir esta misma pantalla (Pass & Play híbrido).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              {/* Opción A: Dispositivos separados */}
              <div
                onClick={() => setDeviceMode('online')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: deviceMode === 'online' ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                  border: deviceMode === 'online' ? '2px solid #38bdf8' : '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Globe size={18} style={{ color: deviceMode === 'online' ? '#38bdf8' : '#94a3b8' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                    🌐 Dispositivos Separados
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                  Cada persona juega desde su propio móvil, tablet o PC online.
                </div>
              </div>

              {/* Opción B: Compartir este dispositivo */}
              <div
                onClick={() => setDeviceMode('hybrid')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: deviceMode === 'hybrid' ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                  border: deviceMode === 'hybrid' ? '2px solid #38bdf8' : '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Monitor size={18} style={{ color: deviceMode === 'hybrid' ? '#38bdf8' : '#94a3b8' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                    👥 En este Mismo Equipo
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                  Varios juegan juntos en esta misma pantalla (Pass & Play local).
                </div>
              </div>
            </div>

            {/* Si elige compartir pantalla, preguntar cuántos jugarán en este equipo */}
            {deviceMode === 'hybrid' && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px dashed #38bdf8',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc' }}>
                  ¿Cuántos jugadores compartirán esta misma pantalla?
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Array.from({ length: safeHumans - 1 }, (_, i) => i + 2).map(count => {
                    const isSelected = safeLocalPlayers === count;
                    const onlineRemaining = safeHumans - count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setLocalPlayersCount(count)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#0284c7' : '#1e293b',
                          border: isSelected ? '1.5px solid #38bdf8' : '1px solid #334155',
                          color: '#f8fafc',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>{count} en esta pantalla</span>
                        <span style={{ fontSize: '10px', color: isSelected ? '#e0f2fe' : '#94a3b8', fontWeight: 600 }}>
                          {onlineRemaining > 0 ? `+ ${onlineRemaining} invitado online` : 'Todos en este equipo'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PASO 4: Selección del Robot para los bots de la partida */}
          {botsCount > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  4. Elige el Tipo de Robot para la Partida:
                </label>
                <span style={{ fontSize: '11px', color: '#cbd5e1', background: 'rgba(168, 85, 247, 0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                  {selectedBot.name} • {selectedBot.elo} Elo
                </span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#94a3b8' }}>
                💡 Si hay más de un robot en la partida ({botsCount} robots), todos adoptarán el mismo modelo para competir en igualdad de condiciones.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px',
                maxHeight: '190px',
                overflowY: 'auto',
                padding: '4px'
              }}>
                {BOT_ROSTER.slice(0, 10).map(bot => {
                  const isSelected = selectedBotId === bot.id;
                  return (
                    <div
                      key={bot.id}
                      onClick={() => setSelectedBotId(bot.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.2)' : '#1e293b',
                        border: isSelected ? '2px solid #c084fc' : '1px solid #334155',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <BotAvatarRenderer bot={bot} size={36} />
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                        {bot.name}
                      </div>
                      <div style={{ fontSize: '10px', color: isSelected ? '#facc15' : '#94a3b8', fontWeight: 700 }}>
                        {bot.elo} Elo
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botón de Creación */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px',
                backgroundColor: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
              }}
            >
              <span>Crear Sala de Espera</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
