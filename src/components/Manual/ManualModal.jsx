import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, Search, X, ChevronRight, Home, Swords, Bot, Puzzle, 
  Trophy, User, Sparkles, Clock, Dices, Mountain, HelpCircle, 
  Award, FileText, ShieldAlert, Share2, Compass, CheckCircle2 
} from 'lucide-react';

export const MANUAL_SECTIONS = [
  {
    id: 'inicio',
    title: 'Pantalla de Inicio (Centro de Mando)',
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
    id: 'aprender',
    title: 'Escuela de Ajedrez (110 Lecciones)',
    icon: BookOpen,
    badge: 'Currículo',
    color: '#10b981',
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
    id: 'aperturas',
    title: 'Entrenador de Aperturas Guiadas',
    icon: Compass,
    badge: 'Estrategia',
    color: '#8b5cf6',
    content: [
      {
        subtitle: '1. Biblioteca de 12 Grandes Aperturas',
        text: 'Aprende la Apertura Italiana, Ruy López (Española), Defensa Siciliana, Francesa, Caro-Kann, Gambito de Dama, India de Rey y más.'
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
    id: 'robots',
    title: 'Robots e Inteligencia Artificial (IA)',
    icon: Bot,
    badge: '15 Bots',
    color: '#f59e0b',
    content: [
      {
        subtitle: '1. Graduación de Dificultad (400 a 2200 Elo)',
        text: '15 personajes con avatares e historias únicas: desde robots amigables para niños como Qwerty y Pip hasta grandes maestros de torneo como GM Kaspar.'
      },
      {
        subtitle: '2. Tutor Pedagógico y Alertas de Peligro',
        text: 'Durante la partida, tu profesor Don Aurelio analiza tus jugadas y emite una "Alerta de Peligro" con sonido de advertencia si el bot amenaza una de tus piezas valiosas.'
      },
      {
        subtitle: '3. Reacciones Emocionales en Tiempo Real',
        text: 'Los bots responden con emojis y expresiones flotantes sobre el tablero ante capturas de dama, jaques o jugadas brillantes.'
      }
    ]
  },
  {
    id: 'jugar',
    title: 'Partidas, Reloj y Variantes Familiares',
    icon: Swords,
    badge: 'Juego',
    color: '#ec4899',
    content: [
      {
        subtitle: '1. Modalidades de Juego',
        text: 'Contra Robots (IA con tutor), Dos Jugadores en la Misma Pantalla (Pasa y Juega) y Multijugador Online P2P (Salas privadas con código y QR).'
      },
      {
        subtitle: '2. 🎲 Variante: Ajedrez con Dados Mágicos (Dice Chess)',
        text: 'En cada turno se lanza un dado que determina si debes mover Peón, Caballo, Alfil, Torre, Dama o Rey/Comodín. ¡Nivela la partida entre niños y adultos con azar y emoción!'
      },
      {
        subtitle: '3. ⛰️👑 Variante: Rey de la Colina (King of the Hill)',
        text: 'Las 4 casillas centrales (d4, d5, e4, e5) forman la colina central. ¡El primer Rey que pise el centro gana la partida inmediatamente!'
      },
      {
        subtitle: '4. ⏱️ Reloj de Ajedrez Opcional',
        text: 'Configura partidas Sin Tiempo (Infinito), Rápida 10 min, Blitz 5m+3s, Blitz 3m+2s o Bala 1 min con alertas de tiempo bajo y derrota por caída de bandera.'
      },
      {
        subtitle: '5. ⚙️ Hándicap Pedagógico Negociable',
        text: 'Otorga ventajas al jugador novato: peón/pieza de ventaja inicial, pistas ilimitadas o posibilidad de retroceder jugadas.'
      }
    ]
  },
  {
    id: 'problemas',
    title: 'Problemas Tácticos y Reto Diario',
    icon: Puzzle,
    badge: 'Táctica',
    color: '#06b6d4',
    content: [
      {
        subtitle: '1. Sala de Puzzles por Temas',
        text: 'Entrena ejercicios de Mate en 1, Mate en 2, Horquillas, Clavadas, Enfiladas y Piezas Atrapadas con Elo táctico dinámico.'
      },
      {
        subtitle: '2. Reto Diario del Gran Maestro',
        text: 'Un puzzle diario especial con multiplicador de racha de días consecutivos que otorga estrellas y gemas para la tienda.'
      }
    ]
  },
  {
    id: 'torneos',
    title: 'Torneos y Liga Familiar (Ranking)',
    icon: Trophy,
    badge: 'Competencia',
    color: '#eab308',
    content: [
      {
        subtitle: '1. 🏆 4 Copas de Torneo Oficiales',
        text: 'Copa Promesas (400-800), Torneo Zoo (800-1300), Abierto Yusupov (1300-1800) y Grand Prix FIDE (1800-2200+) con eliminatorias a 2 rondas.'
      },
      {
        subtitle: '2. 👑 Liga Familiar (Tabla de Clasificación del Hogar)',
        text: 'Podio 🥇 🥈 🥉 y ranking general ordenable de todos los perfiles de la familia según Puntos, Elo, Estrellas, Victorias y Lecciones completadas.'
      },
      {
        subtitle: '3. 📜 Diplomas y Certificados Imprimibles',
        text: 'Certificados oficiales generados automáticamente con el nombre del alumno al completar las etapas del plan de estudios.'
      }
    ]
  },
  {
    id: 'yo',
    title: 'Avatar Studio 3D y Personalización',
    icon: User,
    badge: 'Personalización',
    color: '#a855f7',
    content: [
      {
        subtitle: '1. Creador de Personajes en Pedestal 3D',
        text: 'Personaliza el tono de piel, peinados modernos, ojos expresivos, ropa elegante y accesorios reales (coronas, auriculares, capas).'
      },
      {
        subtitle: '2. Tienda de Recompensas',
        text: 'Usa tus gemas ganadas en partidas y torneos para desbloquear tableros temáticos (Esmeralda, Madera, Neón, Océano) y nuevos atuendos.'
      }
    ]
  },
  {
    id: 'compartir',
    title: 'Cromos de Victoria y Compartir WhatsApp',
    icon: Share2,
    badge: 'Exportación',
    color: '#22c55e',
    content: [
      {
        subtitle: '1. Tarjeta Coleccionable de Victoria',
        text: 'Al finalizar cualquier partida, genera un cromo de lujo con los avatares del duelo, precisión de movimientos, estrellas y resultado.'
      },
      {
        subtitle: '2. Compartir en WhatsApp en 1 Clic',
        text: 'Abre WhatsApp automáticamente con un mensaje formateado listo para enviar a familiares o amigos.'
      },
      {
        subtitle: '3. Descarga de Imagen en Alta Resolución (PNG)',
        text: 'Descarga el cromo en formato imagen PNG con marco dorado para guardar o imprimir.'
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

  // Actualizar sección inicial al abrir según dónde esté el usuario
  useEffect(() => {
    if (initialSection) {
      setActiveSectionId(initialSection);
    }
  }, [initialSection, isOpen]);

  // Filtrado por búsqueda
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MANUAL_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MANUAL_SECTIONS.filter(s => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchContent = s.content.some(c => c.subtitle.toLowerCase().includes(q) || c.text.toLowerCase().includes(q));
      return matchTitle || matchContent;
    });
  }, [searchQuery]);

  const activeSection = MANUAL_SECTIONS.find(s => s.id === activeSectionId) || MANUAL_SECTIONS[0];

  return (
    <div className="modal-overlay" style={{ zIndex: 140, padding: '12px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '920px',
          width: '100%',
          height: '88vh',
          maxHeight: '820px',
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
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.30rem', color: '#ffffff', margin: 0, fontWeight: '900', letterSpacing: '0.3px' }}>
                MANUAL DE AYUDA & GUÍA DEL USUARIO 📖
              </h2>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Explora todas las funciones, reglas especiales y características de Ajedrez Junvill
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
                placeholder="Buscar tema (ej. dados, peón al paso, reloj)..."
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
            width: '270px',
            background: '#090d16',
            borderRight: '1.5px solid #1e293b',
            overflowY: 'auto',
            padding: '12px 10px'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px', padding: '6px 8px', marginBottom: '6px' }}>
              Índice de Capítulos:
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
                    marginBottom: '5px',
                    cursor: 'pointer',
                    background: isSelected ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.30) 100%)' : '#0f172a',
                    border: isSelected ? '1.5px solid #f59e0b' : '1px solid #1e293b',
                    color: isSelected ? '#fbbf24' : '#cbd5e1',
                    fontWeight: isSelected ? '900' : '700',
                    fontSize: '0.83rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Icon size={16} color={isSelected ? '#fbbf24' : sec.color} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sec.title}
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
