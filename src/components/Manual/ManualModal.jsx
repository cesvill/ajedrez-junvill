import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, X, ChevronRight, Home, Swords, Bot, Puzzle, 
  Trophy, User, Sparkles, Clock, Dices, Mountain, HelpCircle, 
  Award, FileText, ShieldAlert, Share2, Compass, CheckCircle2,
  Coins, Gift, Smile, Flame, Scale, Globe, Star
} from 'lucide-react';

export const MANUAL_SECTIONS = [
  {
    id: 'inicio',
    title: 'Pantalla de Inicio (Centro de Mando)',
    shortTitle: '🏠 1. Inicio y Centro de Mando',
    icon: Home,
    badge: 'Dashboard',
    color: '#3b82f6',
    content: [
      {
        subtitle: '1. Tarjeta Hero y Avatar 3D',
        text: 'Muestra al alumno de cuerpo entero sobre un pedestal de ajedrez interactivo con animación de flotación. Al hacer clic sobre el avatar se abre el Avatar Studio. También muestra tu Elo actual, rango (ej. Aprendiz Promesa), estrellas ⭐ y gemas 💎.'
      },
      {
        subtitle: '2. Partida en Curso Guardada (Persistencia)',
        text: 'Si saliste de una partida sin terminar contra un bot o en modo local, aparece un banner con el turno actual, la última jugada y el botón "▶ Reanudar Partida" para continuar exactamente en la misma posición sin perder nada.'
      },
      {
        subtitle: '3. Siguientes Pasos Recomendados (Tu Ruta de Hoy)',
        text: 'Cuatro tarjetas inteligentes que te sugieren: la siguiente lección curricular pendiente con 5⭐, el robot recomendado según tu nivel Elo, el Reto Diario con gemas y las Misiones Familiares de Papá y Mamá.'
      },
      {
        subtitle: '4. Radar de Competencias Yusupov',
        text: 'Gráfico hexagonal que mide tu equilibrio en las 6 áreas del ajedrez integral: Táctica, Estrategia, Posicional, Cálculo, Aperturas y Finales.'
      },
      {
        subtitle: '5. Vitrina de Logros y Accesos Rápidos',
        text: 'Resumen de robots derrotados, copas de torneos conquistadas y botones directos para jugar contra IA, retar amigos online con QR o abrir el tablero de 2 jugadores.'
      }
    ]
  },
  {
    id: 'guia_diversion_especial',
    title: '🌟 Guía de Modalidades Familiares & Formas de Jugar',
    shortTitle: '🌟 2. Todas las Formas de Jugar',
    icon: Sparkles,
    badge: 'Guía Rápida',
    color: '#f59e0b',
    content: [
      {
        subtitle: '1. ¿Cómo jugar con Dados Mágicos 🎲?',
        text: '👉 Paso a paso: Ve a la pestaña "⚔️ Jugar". En el menú "¿Cómo quieres jugar hoy?", pulsa la tarjeta rosa "🎲 Jugar Dados Mágicos". En cada turno, lanza el dado y mueve únicamente la pieza indicada. ¡Ideal para que niños y adultos jueguen en igualdad!'
      },
      {
        subtitle: '2. ¿Cómo jugar Rey de la Colina ⛰️👑?',
        text: '👉 Paso a paso: Ve a la pestaña "⚔️ Jugar" y selecciona la tarjeta dorada "⛰️👑 Rey de la Colina". El primer jugador o robot que logre llevar a su Rey a cualquiera de las 4 casillas centrales (d4, d5, e4, e5) gana la partida al instante.'
      },
      {
        subtitle: '3. ¿Cómo activar el Reloj de Ajedrez ⏱️?',
        text: '👉 Paso a paso: Al iniciar una partida en "⚔️ Jugar", en la ventana donde eliges jugar con Blancas o Negras, encontrarás el selector "⏱️ Reloj de Ajedrez". Puedes elegir: Rápida 10 min, Blitz 5 min (+3s), Blitz 3 min (+2s) o Bala 1 min.'
      },
      {
        subtitle: '4. ¿Cómo dar Ventajas / Hándicap ⚖️?',
        text: '👉 Paso a paso: En la ventana de inicio de partida antes de comenzar, pulsa el botón "⚖️ Configurar Ventajas / Hándicap". Podrás otorgar piezas de ventaja al principiante, permitir retroceder jugadas o activar pistas infinitas del tutor.'
      },
      {
        subtitle: '5. ¿Cómo jugar Online con un Amigo o Familiar 🌐?',
        text: '👉 Paso a paso: Ve a "⚔️ Jugar" y pulsa "🌐 Partida Online con Amigos (P2P)". Crea una sala y comparte el enlace o pide a tu amigo que escanee el código QR desde su celular o computador.'
      },
      {
        subtitle: '6. ¿Cómo ver la Liga Familiar del Hogar 👑?',
        text: '👉 Paso a paso: Ve a la pestaña "🏆 Torneos" y pulsa en la parte superior el botón "👑 Liga Familiar (Ranking)" para ver el podio 🥇🥈🥉 y la clasificación entre todos los perfiles de la casa.'
      }
    ]
  },
  {
    id: 'economia',
    title: 'Economía del Juego: Puntos, Estrellas ⭐ y Diamantes 💎',
    shortTitle: '💎 3. Estrellas ⭐ vs Diamantes 💎',
    icon: Coins,
    badge: 'Economía',
    color: '#10b981',
    content: [
      {
        subtitle: '1. ¿Para qué sirven las Estrellas ⭐?',
        text: 'Las Estrellas son la medida de tu maestría educativa. Se ganan al completar lecciones del currículo (hasta 5 estrellas por lección) y resolviendo problemas tácticos. Te permiten desbloquear etapas avanzadas, subir en la Liga Familiar y validar tus Diplomas Oficiales.'
      },
      {
        subtitle: '2. ¿Para qué sirven los Diamantes / Gemas 💎?',
        text: 'Las Gemas son la divisa mágica del juego. Se ganan ganando Torneos Oficiales 🏆, cumpliendo el Reto Diario 🔥 y completando las Misiones de Papá y Mamá 🎁. Se gastan en el Avatar Studio para desbloquear nuevos tableros (Esmeralda, Madera noble, Neón, Océano), piezas y atuendos exclusivos.'
      },
      {
        subtitle: '3. Puntos Curriculares (0 a 110)',
        text: 'Cada lección completada otorga 1 Punto Curricular. Al alcanzar los 110 puntos se desbloquea el Gran Diploma Maestro de Graduación emitido por Ajedrez Junvill.'
      },
      {
        subtitle: '4. Puntuación Elo (Fuerza de Juego)',
        text: 'Tu Elo sube cuando derrotas a robots o ganas torneos, y se ajusta según la dificultad del oponente. Comienzas como Aprendiz (400-650 Elo) y puedes llegar hasta Gran Maestro (+2200 Elo).'
      }
    ]
  },
  {
    id: 'retos_familia',
    title: 'Retos de Familia, Misiones y Cofres 🎁',
    shortTitle: '🎁 4. Retos de Familia y Misiones',
    icon: Gift,
    badge: 'Hogar',
    color: '#ec4899',
    content: [
      {
        subtitle: '1. ¿Cómo acceder a los Retos de Familia?',
        text: '👉 Desde la Pantalla de Inicio, pulsa el botón dorado "🎁 Retos de Familia" en la tarjeta de tu perfil. También puedes abrirlo desde los accesos rápidos de la cabecera.'
      },
      {
        subtitle: '2. Misiones Creadas por Papá y Mamá',
        text: 'Los padres o profesores pueden crear misiones personalizadas para los niños (ejemplo: "Hacer 3 lecciones antes de ver TV", "Derrotar a Sparky", "Resolver 5 tácticas diarias").'
      },
      {
        subtitle: '3. Cofres y Recompensas Reales o Virtuales',
        text: 'Al completar los objetivos, los niños pueden reclamar gemas 💎 virtuales o recompensas pactadas en casa (tiempo de parque, postre favorito, salida familiar).'
      }
    ]
  },
  {
    id: 'aprender',
    title: '📚 Escuela de Ajedrez (110 Lecciones y Peón al Paso)',
    shortTitle: '📚 5. Escuela y 110 Lecciones',
    icon: BookOpen,
    badge: 'Currículo',
    color: '#3b82f6',
    content: [
      {
        subtitle: '1. ¿Cómo acceder a las lecciones?',
        text: '👉 Ve a la pestaña "📚 Aprender" en el menú de navegación. Verás las 5 Etapas del plan de estudios ordenadas progresivamente con sus 110 lecciones interactivas.'
      },
      {
        subtitle: '2. Animación en Vivo del Rival',
        text: 'Al iniciar cualquier ejercicio o pulsar Reiniciar, el rival realiza su movimiento en vivo frente a tus ojos (por ejemplo, el peón negro corriendo 2 casillas en el peón al paso) para entender visualmente la causa del ejercicio.'
      },
      {
        subtitle: '3. La Regla del Peón al Paso (En Passant)',
        text: 'Cuando un peón enemigo salta 2 casillas para pasar de largo a tu peón en 5ª fila, la regla FIDE te permite moverte a la casilla vacía que él saltó (con el aro rojo) para capturarlo y retirarlo del tablero.'
      },
      {
        subtitle: '4. Sistema de Pistas en 3 Niveles',
        text: 'Pista 1: Concepto pedagógico. Pista 2: Casilla o pieza a mover. Pista 3: Jugada exacta con flecha dorada.'
      },
      {
        subtitle: '5. Reporte Inteligente de Errores (1 Clic)',
        text: 'Si encuentras alguna posición dudosa, pulsa el botón "Reportar" para seleccionar entre 10 plantillas automáticas y registrarlo en el consolidado.'
      }
    ]
  },
  {
    id: 'reacciones',
    title: '🎭 Reacciones y Emociones en Tiempo Real',
    shortTitle: '🎭 6. Reacciones y Emociones',
    icon: Smile,
    badge: 'Interacción',
    color: '#38bdf8',
    content: [
      {
        subtitle: '1. ¿Cómo enviar reacciones durante una partida?',
        text: '👉 Mientras juegas cualquier partida, en la barra inferior del tablero pulsa el botón de caras para abrir la paleta de emoticonos (😄, 🤔, 😲, 👏, 🔥).'
      },
      {
        subtitle: '2. Inteligencia Emocional de los Robots',
        text: 'Los 15 robots de IA no son fríos: reaccionan en tiempo real a lo que ocurre en el tablero. Si haces una jugada brillante mostrarán sorpresa 😮; si te dan jaque sonreirán con confianza 😏; y si pierden su dama expresarán lamento 🥺.'
      },
      {
        subtitle: '3. Burbujas Flotantes con Sonido Sutil',
        text: 'Las reacciones emergen flotando suavemente sobre el avatar correspondiente con un efecto de sonido agradable que no interrumpe el pensamiento táctico.'
      }
    ]
  },
  {
    id: 'avatares_3d',
    title: '🎨 Avatar Studio 3D y Personalización',
    shortTitle: '🎨 7. Avatar Studio 3D',
    icon: User,
    badge: 'Personaje',
    color: '#a855f7',
    content: [
      {
        subtitle: '1. ¿Cómo acceder al Avatar Studio?',
        text: '👉 Ve a la pestaña "👤 Yo" en el menú principal o haz clic directamente sobre el avatar 3D en la pantalla de Inicio.'
      },
      {
        subtitle: '2. Ilustraciones HD de Cuerpo Completo en Pedestal',
        text: 'Crea personajes únicos sobre un pedestal de madera noble con física de flotación interactiva.'
      },
      {
        subtitle: '3. Personalización Total y Tienda',
        text: 'Modifica el tono de piel, peinados modernos, ojos expresivos, ropa (sudaderas, trajes formales, camisetas) y accesorios reales (coronas, auriculares, capas, gafas) desbloqueables con gemas 💎.'
      }
    ]
  },
  {
    id: 'aperturas',
    title: '📖 Entrenador de Aperturas Guiadas',
    shortTitle: '📖 8. Aperturas Guiadas',
    icon: Compass,
    badge: 'Estrategia',
    color: '#8b5cf6',
    content: [
      {
        subtitle: '1. ¿Cómo acceder al Entrenador de Aperturas?',
        text: '👉 Ve a la pestaña "📚 Aprender" y selecciona la sección "📖 Entrenador de Aperturas". Podrás elegir entre 12 grandes aperturas maestras.'
      },
      {
        subtitle: '2. Biblioteca de 12 Grandes Aperturas',
        text: 'Aprende la Apertura Italiana, Ruy López (Española), Defensa Siciliana, Francesa, Caro-Kann, Gambito de Dama, Sistema Londres, India de Rey y más.'
      },
      {
        subtitle: '3. Explicaciones Jugada a Jugada y Flechas',
        text: 'El maestro te explica por qué se juega cada movimiento, los planes estratégicos para controlar el centro y cómo castigar los errores típicos del rival con flechas tácticas.'
      }
    ]
  },
  {
    id: 'variantes',
    title: '🎲 Variantes Familiares (Dados Mágicos & Rey de la Colina)',
    shortTitle: '🎲 9. Dados y Colina Mágica',
    icon: Dices,
    badge: 'Variantes',
    color: '#f43f5e',
    content: [
      {
        subtitle: '1. 🎲 Ajedrez con Dados Mágicos (Dice Chess)',
        text: '👉 Cómo acceder: Ve a "⚔️ Jugar" y selecciona "🎲 Jugar Dados Mágicos". En cada turno se lanza un dado que determina si debes mover Peón, Caballo, Alfil, Torre, Dama o Rey/Comodín. El tablero filtra únicamente las piezas válidas.'
      },
      {
        subtitle: '2. ⛰️👑 Rey de la Colina (King of the Hill)',
        text: '👉 Cómo acceder: Ve a "⚔️ Jugar" y pulsa "⛰️👑 Rey de la Colina". Las 4 casillas centrales (d4, d5, e4, e5) forman la cima de la montaña. ¡El primer Rey que pise el centro gana la partida inmediatamente!'
      },
      {
        subtitle: '3. ⚖️ Negociación de Hándicap / Ventajas',
        text: '👉 Cómo acceder: En la ventana de configuración antes de jugar, pulsa "⚖️ Configurar Ventajas" para activar pistas infinitas, peón de ventaja inicial o desmarcar el reloj.'
      }
    ]
  },
  {
    id: 'reloj_partidas',
    title: '⏱️ Reloj de Ajedrez, IA y Multijugador P2P',
    shortTitle: '⏱️ 10. Reloj, Robots y P2P',
    icon: Clock,
    badge: 'Partidas',
    color: '#06b6d4',
    content: [
      {
        subtitle: '1. ⏱️ Reloj de Ajedrez Dual',
        text: '👉 Cómo acceder: Al iniciar una partida en "⚔️ Jugar", elige el tiempo en el desplegable de reloj: Sin Tiempo (Infinito), Rápida (10 min), Blitz (5 min + 3s), Blitz Rápido (3 min + 2s) o Bala (1 min).'
      },
      {
        subtitle: '2. 🤖 Partidas contra 15 Robots con Tutor en Vivo',
        text: '👉 Cómo acceder: Ve a la pestaña "🤖 Robots" para elegir rivales desde 400 hasta 2200 Elo con pistas, alertas de peligro y análisis posicional.'
      },
      {
        subtitle: '3. 🌐 Multijugador Online P2P y Modo Pasa y Juega',
        text: '👉 Cómo acceder: Ve a "⚔️ Jugar" y pulsa "🌐 Partida Online con Amigos (P2P)" para crear una sala y compartir el enlace o QR.'
      }
    ]
  },
  {
    id: 'liga_exportacion',
    title: '🏆 Liga Familiar, Diplomas y WhatsApp',
    shortTitle: '🏆 11. Liga, Diplomas y WhatsApp',
    icon: Trophy,
    badge: 'Competencia',
    color: '#eab308',
    content: [
      {
        subtitle: '1. 👑 Liga Familiar (Tabla de Clasificación del Hogar)',
        text: '👉 Cómo acceder: Ve a la pestaña "🏆 Torneos" y selecciona la pestaña "👑 Liga Familiar (Ranking)". Muestra el podio 🥇🥈🥉 y la clasificación general de todos los perfiles de la casa.'
      },
      {
        subtitle: '2. 📲 Tarjeta Coleccionable de Victoria (WhatsApp)',
        text: '👉 Cómo acceder: Al finalizar cualquier partida, en la ventana de resultados pulsa el botón dorado "📲 Tarjeta de Victoria / Compartir WhatsApp" para abrir WhatsApp o descargar el cromo en imagen PNG.'
      },
      {
        subtitle: '3. 📜 Diplomas y Certificados Oficiales',
        text: '👉 Cómo acceder: Pulsa el botón de diploma (icono de medalla 🎖️) en la barra superior para ver e imprimir tus certificados oficiales con sello y firma.'
      }
    ]
  }
];

export const ManualModal = ({
  isOpen,
  onClose,
  initialSection = 'inicio'
}) => {
  if (!isOpen) return null;

  const [activeSectionId, setActiveSectionId] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState('');

  // Mapear pestaña activa de la app con la sección correspondiente del manual
  useEffect(() => {
    if (initialSection) {
      if (initialSection === 'robots') setActiveSectionId('reloj_partidas');
      else if (initialSection === 'jugar') setActiveSectionId('variantes');
      else if (initialSection === 'torneos') setActiveSectionId('liga_exportacion');
      else if (initialSection === 'yo') setActiveSectionId('avatares_3d');
      else if (initialSection === 'aprender') setActiveSectionId('aprender');
      else if (initialSection === 'problemas') setActiveSectionId('economia');
      else setActiveSectionId(initialSection);
    }
  }, [initialSection, isOpen]);

  // Filtrado por búsqueda en tiempo real
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MANUAL_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MANUAL_SECTIONS.filter(s => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchShortTitle = (s.shortTitle || '').toLowerCase().includes(q);
      const matchBadge = s.badge.toLowerCase().includes(q);
      const matchContent = s.content.some(c => c.subtitle.toLowerCase().includes(q) || c.text.toLowerCase().includes(q));
      return matchTitle || matchShortTitle || matchBadge || matchContent;
    });
  }, [searchQuery]);

  const activeSection = MANUAL_SECTIONS.find(s => s.id === activeSectionId) || MANUAL_SECTIONS[0];

  return (
    <div className="modal-overlay" style={{ zIndex: 140, padding: '12px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '980px',
          width: '100%',
          height: '88vh',
          maxHeight: '840px',
          background: '#0f172a',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          color: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA CON BÚSQUEDA Y BOTÓN CERRAR */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1.5px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#f59e0b', color: '#0f172a', padding: '7px', borderRadius: '10px', display: 'flex' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: '900', letterSpacing: '0.3px' }}>
                MANUAL MAESTRO & GUÍA DEL USUARIO 📖
              </h2>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Reglas, modalidades familiares, economía de estrellas/gemas y cómo acceder a cada función
              </span>
            </div>
          </div>

          {/* Barra de Búsqueda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', maxWidth: '340px' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Buscar tema (ej. dados, peón al paso, reloj, gemas)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '999px',
                  border: '1.5px solid #334155',
                  background: '#1e293b',
                  fontSize: '0.82rem',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              title="Cerrar Manual"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* CUERPO DEL MANUAL: SIDEBAR DE CAPÍTULOS + PANEL DE CONTENIDO */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar de Secciones */}
          <div style={{
            width: '310px',
            minWidth: '290px',
            flex: '0 0 310px',
            background: '#090d16',
            borderRight: '1.5px solid #1e293b',
            overflowY: 'auto',
            padding: '12px 10px'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '6px 8px', marginBottom: '6px' }}>
              Índice de Capítulos ({filteredSections.length}):
            </div>

            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = sec.id === activeSectionId;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    background: isSelected ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.30) 100%)' : '#0f172a',
                    border: isSelected ? '1.5px solid #f59e0b' : '1px solid #1e293b',
                    color: isSelected ? '#fbbf24' : '#cbd5e1',
                    fontWeight: isSelected ? '900' : '700',
                    fontSize: '0.82rem',
                    lineHeight: '1.3',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginRight: '6px' }}>
                    <Icon size={16} color={isSelected ? '#fbbf24' : sec.color} style={{ flexShrink: 0 }} />
                    <span style={{ wordBreak: 'break-word' }}>
                      {sec.shortTitle || sec.title}
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ opacity: isSelected ? 1 : 0.4, flexShrink: 0, color: isSelected ? '#fbbf24' : '#64748b' }} />
                </div>
              );
            })}
          </div>

          {/* Panel de Contenido Detallado */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            background: '#0b1120'
          }}>
            {/* Título de Sección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: '1.5px solid #1e293b', paddingBottom: '14px' }}>
              <div style={{ background: activeSection.color, color: '#fff', padding: '10px', borderRadius: '12px', display: 'flex', boxShadow: `0 4px 14px ${activeSection.color}40` }}>
                <activeSection.icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', background: '#f59e0b', color: '#0f172a', padding: '2px 9px', borderRadius: '999px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {activeSection.badge}
                </span>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.45rem', color: '#ffffff', margin: '3px 0 0', fontWeight: '900' }}>
                  {activeSection.title}
                </h3>
              </div>
            </div>

            {/* Bloques de Explicación con Alto Contraste y Guías Paso a Paso */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeSection.content.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#1e293b',
                    border: '1.5px solid #334155',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '10px',
                    padding: '16px 18px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.02rem', fontWeight: '900', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <span>{item.subtitle}</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.90rem', color: '#f1f5f9', lineHeight: '1.6', fontWeight: '400' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
