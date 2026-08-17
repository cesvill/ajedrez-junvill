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
    title: '🌟 Guía Especial: Las 5 Fases de Diversión & Gamificación Familiar',
    shortTitle: '🌟 2. Centro de Diversión y 5 Fases',
    icon: Sparkles,
    badge: 'Especial Familiar',
    color: '#f59e0b',
    content: [
      {
        subtitle: '1. Filosofía de Ajedrez Junvill: Aprender Jugando',
        text: 'Ajedrez Junvill no es solo un tablero tradicional: es un videojuego educativo y familiar diseñado para que niños, padres y abuelos disfruten juntos sin frustración, combinando rigor técnico FIDE con magia, recompensas y emoción.'
      },
      {
        subtitle: '2. 🎭 Fase 1: Reacciones y Caras en Tiempo Real',
        text: 'Barra de emoticonos interactivos para enviar caras animadas (😄, 🤔, 😲, 👏, 🔥) y 15 robots con inteligencia emocional que reaccionan con sorpresa, risas o lamentos ante jugadas brillantes y capturas.'
      },
      {
        subtitle: '3. 🎨 Fase 2: Avatares 3D de Cuerpo Completo y Avatar Studio',
        text: 'Personajes ilustrados en alta definición de cuerpo entero sobre pedestales de madera noble con física de flotación y personalización completa de piel, peinados, ropa y accesorios reales.'
      },
      {
        subtitle: '4. 📖 Fase 3: Entrenador de Aperturas Guiadas',
        text: 'Biblioteca interactiva para aprender las 12 aperturas maestras (Italiana, Ruy López, Siciliana, Francesa, Gambito de Dama, Londres) jugada a jugada con flechas y explicaciones estratégicas.'
      },
      {
        subtitle: '5. 🎲 Fase 4: Variantes Familiares (Dados Mágicos & Rey de la Colina)',
        text: 'Ajedrez con Dados Mágicos (el azar nivela la partida entre niños y adultos) y Rey de la Colina (conquistar el centro con el Rey otorga victoria instantánea).'
      },
      {
        subtitle: '6. 🏆 Fase 5: Liga Familiar, Exportación y Reloj',
        text: 'Tabla de clasificación y podio del hogar 🥇🥈🥉, tarjetas coleccionables listas para enviar a WhatsApp y reloj de ajedrez opcional con partidas rápidas y blitz.'
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
        subtitle: '1. Misiones Creadas por Papá y Mamá',
        text: 'Los padres o profesores pueden crear misiones personalizadas para los niños (ejemplo: "Hacer 3 lecciones antes de ver TV", "Derrotar a Sparky", "Resolver 5 tácticas diarias").'
      },
      {
        subtitle: '2. Cofres y Recompensas Reales o Virtuales',
        text: 'Al completar los objetivos, los niños pueden reclamar gemas 💎 virtuales o recompensas pactadas en casa (tiempo de parque, postre favorito, salida familiar).'
      },
      {
        subtitle: '3. Panel de Control Parental',
        text: 'Permite a los adultos activar o desactivar retos, verificar el progreso del estudiante y reiniciar misiones diarias o semanales en 1 clic.'
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
        subtitle: '1. Las 5 Etapas Curriculares',
        text: 'El plan de estudios abarca desde la Etapa 1 (El despertar del tablero y movimiento de piezas) hasta la Etapa 5 (Maestría de Torneo y Cálculo FIDE).'
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
    title: '🎭 Reacciones y Emociones en Tiempo Real (Fase 1)',
    shortTitle: '🎭 6. Reacciones en Vivo (Fase 1)',
    icon: Smile,
    badge: 'Fase 1',
    color: '#38bdf8',
    content: [
      {
        subtitle: '1. Barra de Emoticonos y Caras Animadas',
        text: 'Durante la partida, en la barra inferior dispones de un botón de emojis para expresar alegría 😄, concentración 🤔, sorpresa 😲, aplausos 👏 o fuego 🔥.'
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
    title: '🎨 Avatares 3D y Avatar Studio (Fase 2)',
    shortTitle: '🎨 7. Avatares 3D Studio (Fase 2)',
    icon: User,
    badge: 'Fase 2',
    color: '#a855f7',
    content: [
      {
        subtitle: '1. Ilustraciones HD de Cuerpo Completo en Pedestal',
        text: 'Los avatares ya no son simples círculos: ahora cuentan con ilustraciones de cuerpo entero sobre un pedestal de madera noble con física de flotación interactiva.'
      },
      {
        subtitle: '2. Personalización Total en el Avatar Studio',
        text: 'Modifica el tono de piel, peinados modernos (con flequillo, rizado, liso, corto), ojos expresivos, ropa (sudaderas, trajes formales, camisetas) y accesorios (coronas, auriculares, capas, gafas).'
      },
      {
        subtitle: '3. Estados de Ánimo Reactivos',
        text: 'Tu avatar cambia de expresión según tu desempeño en la partida: concentrado al pensar, alegre en victorias y motivado para volver a intentarlo tras una derrota.'
      }
    ]
  },
  {
    id: 'aperturas',
    title: '📖 Entrenador de Aperturas Guiadas (Fase 3)',
    shortTitle: '📖 8. Aperturas Guiadas (Fase 3)',
    icon: Compass,
    badge: 'Fase 3',
    color: '#8b5cf6',
    content: [
      {
        subtitle: '1. Biblioteca de 12 Grandes Aperturas',
        text: 'Aprende la Apertura Italiana, Ruy López (Española), Defensa Siciliana, Francesa, Caro-Kann, Gambito de Dama, Sistema Londres, India de Rey y más.'
      },
      {
        subtitle: '2. Explicaciones Jugada a Jugada',
        text: 'El maestro te explica por qué se juega cada movimiento, los planes estratégicos para controlar el centro y cómo castigar los errores típicos del rival.'
      },
      {
        subtitle: '3. Flechas Pedagógicas y Árbol de Variantes',
        text: 'Visualiza las líneas principales y alternativas con flechas de colores en el tablero interactivo.'
      }
    ]
  },
  {
    id: 'variantes',
    title: '🎲 Variantes Familiares y Modos Mágicos (Fase 4)',
    shortTitle: '🎲 9. Dados y Colina (Fase 4)',
    icon: Dices,
    badge: 'Fase 4',
    color: '#f43f5e',
    content: [
      {
        subtitle: '1. 🎲 Ajedrez con Dados Mágicos (Dice Chess)',
        text: 'En cada turno el tirador de dados determina qué pieza debes mover (Peón, Caballo, Alfil, Torre, Dama o Rey/Comodín). El tablero filtra únicamente las piezas válidas. ¡Iguala partidas entre niños y grandes con diversión y azar táctico!'
      },
      {
        subtitle: '2. ⛰️👑 Rey de la Colina (King of the Hill)',
        text: 'Las 4 casillas centrales (d4, d5, e4, e5) forman la cima de la colina dorada. ¡El primer jugador o robot que logre colocar a su Rey en cualquiera de estas casillas gana la partida al instante!'
      },
      {
        subtitle: '3. ⚖️ Negociación de Hándicap / Ventajas',
        text: 'Permite dar ventajas pedagógicas al jugador novato: peón o pieza de ventaja inicial, pistas ilimitadas o posibilidad de deshacer movimientos para nivelar el juego en familia.'
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
        text: 'Configura partidas Sin Tiempo (Infinito), Rápida 10 min, Blitz 5m+3s, Blitz 3m+2s o Bala 1 min con ticks sonoros en los últimos 10 segundos y derrota por tiempo.'
      },
      {
        subtitle: '2. 🤖 Partidas contra 15 Robots con Tutor en Vivo',
        text: 'Enfrenta a bots graduados desde 400 hasta 2200 Elo con pistas, alertas de peligro y análisis posicional en tiempo real.'
      },
      {
        subtitle: '3. 🌐 Multijugador Online P2P y Modo Pasa y Juega',
        text: 'Crea una sala privada, escanea el código QR o comparte el enlace para jugar en 2 celulares o computadores en tiempo real sin servidores intermediarios.'
      }
    ]
  },
  {
    id: 'liga_exportacion',
    title: '🏆 Liga Familiar, Diplomas y WhatsApp (Fase 5)',
    shortTitle: '🏆 11. Liga, Diplomas y WhatsApp',
    icon: Trophy,
    badge: 'Fase 5',
    color: '#eab308',
    content: [
      {
        subtitle: '1. 👑 Liga Familiar (Tabla de Clasificación del Hogar)',
        text: 'Podio 🥇 🥈 🥉 y ranking general ordenable de todos los perfiles de la familia según Puntos de Liga, Elo, Estrellas ⭐, Victorias 🏆 y Lecciones completadas.'
      },
      {
        subtitle: '2. 📲 Tarjeta Coleccionable de Victoria (WhatsApp)',
        text: 'Al finalizar cualquier partida, genera un cromo de lujo con los avatares del duelo, precisión de jugadas y resultado, listo para compartir en WhatsApp o guardar como imagen PNG.'
      },
      {
        subtitle: '3. 📜 Diplomas y Certificados Oficiales',
        text: 'Diplomas oficiales descargables e imprimibles con sello dorado y firma del maestro Don Aurelio al culminar las etapas del plan de estudios.'
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
                Reglas, modalidades familiares, economía de estrellas/gemas y las 5 fases de Ajedrez Junvill
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
          {/* Sidebar de Secciones con Ancho Cómodo y Sin Cortes */}
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

            {/* Bloques de Explicación con Alto Contraste */}
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
