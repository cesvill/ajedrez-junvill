# 🗺️ Roadmap de Desarrollo - Ajedrez Junvill

> **Plataforma Integral de Enseñanza de Ajedrez**  
> *Desde Nivel 0 (Iniciación y Cuentos) hasta 2200+ Elo (Maestría Yusupov & Torneos FIDE)*  
> *Integración Pedagógica: Dr. Wolf (Tutor Socrático con Pistas Progresivas) + ChessKid (Gamificación, Economía de Estrellas/Gemas, Bots con Personalidad y Tienda) + Rigor Yusupov/KCF para Jóvenes y Adultos.*

---

## 🧭 Visión y Principios del Proyecto

1. **Pedagogía Socrática Progresiva (Estilo Dr. Wolf)**:
   - 4 niveles de pistas graduadas (Nivel 1: Concepto/Sector ➡️ Nivel 2: Pieza ➡️ Nivel 3: Casilla destino ➡️ Nivel 4: Jugada exacta).
   - Tutor en tiempo real que felicita buenas jugadas, advierte de errores tácticos ("¿Seguro que quieres mover ahí? Tu torre quedaría indefensa") y explica el **¿Por qué?** de cada jugada.
2. **Gamificación y Motivación Intergeneracional (Estilo ChessKid + Plataformas Modernas)**:
   - **Economía dual**: Estrellas ⭐ (ganadas en lecciones y problemas) y Gemas/Rubíes 💎 (ganadas en victorias contra bots y rachas).
   - **Estudio de Avatares ("Yo")**: Personalización de ropa, peinados, accesorios y títulos de jugador.
   - **Tienda de Estilos**: Desbloqueo de tableros (Esmeralda, Madera noble, Neón Cyberpunk, Azul Real) y sets de piezas.
   - **Roster de Oponentes ("Robots")**:
     - *Robots Futuristas*: Qwerty (400), Cosmo-7 (700), Sparky (1050), Titán (1450), Quantum Core (2000).
     - *Robots del Zoológico*: Mono Travieso (500), Tiburón Táctico (850), Elefante (1200), Búho Sabio (1600), Tigre (1950).
     - *Personalidades Humanas*: Mateo (450), Sofía Streamer (950), Carlos de Club (1350), Maestra Elena (1750), GM Kaspar (2150).
   - **Multi-Tema Visual Adaptativo**:
     - 🌟 *Modo Moderno Dark & Gold*: Para adolescentes y adultos que buscan una interfaz elegante y profesional.
     - 🌿 *Modo ChessKid Alegre*: Colores vivos, verde pradera y ambientación lúdica para niños.
     - 📜 *Modo Pergamino Clásico*: Estética tradicional cálida inspirada en Dr. Wolf.
3. **Currículo Completo de 110 Puntos**:
   - Basado en *Guía Curricular de Ajedrez Infantil.docx* combinando:
     - Etapa 1: *Story Time Chess & ChessKid* (0 - 800 Elo)
     - Etapa 2: *Método de los Pasos (Steps Method 1-3)* (800 - 1400 Elo)
     - Etapa 3: *Artur Yusupov Fundamentals & Beyond* (1400 - 1800 Elo)
     - Etapa 4: *Kasparov Chess Foundation (KCF) & FIDE Master Prep* (1800 - 2200+ Elo)
   - Radar de Habilidades Yusupov de 6 ejes: *Táctica, Estrategia, Juego Posicional, Cálculo, Aperturas y Finales*.

---

## 📌 Fases del Proyecto

```
Fase 1: Motor, Tablero, Perfiles y Lecciones Básicas ───── [COMPLETADO ✅]
Fase 2: Gamificación, Robots Roster, Temas y Tienda ─────── [COMPLETADO ✅]
Fase 3: Árbol Curricular Completo (110 Puntos Interactivos) ── [COMPLETADO ✅]
Fase 4: Análisis de Partidas con Motor (Game Review) ─────── [COMPLETADO ✅]
Fase 5: Torneos Arena, Retos Diarios, PGN y Diplomas ──────── [COMPLETADO ✅]
```

---

## 📋 Detalle de Fases y Funcionalidades

### ✅ FASE 1: Núcleo, Tablero y Tutor Inteligente (Completada)
- [x] Arquitectura React + Vite con arquitectura de componentes modular.
- [x] Motor de reglas de ajedrez con `chess.js` y renderizado SVG nítido.
- [x] Sistema de Audio Web Synth (movimientos, capturas, jaques, victorias y pistas sin dependencias pesadas).
- [x] Gestión de perfiles locales múltiples (crear, cambiar y persistir usuarios en LocalStorage).
- [x] Bot de IA Minimax con poda alfa-beta y tablas de piezas por casilla (PST) en 5 niveles de dificultad (400 a 2000+ Elo).
- [x] Motor del Tutor Pedagógico con generación de pistas en 4 niveles y botón "¿Por qué?".
- [x] Tablero interactivo con soporte de clic/tap y arrastrar y soltar (drag & drop), puntos de jugadas legales y anillo de captura.

### ✅ FASE 2: Gamificación, Robots, Temas y Tienda (Completada)
- [x] **Economía de Recompensas**: Acumulación de Estrellas ⭐ y Gemas 💎 en lecciones, problemas y partidas.
- [x] **Roster de 15 Oponentes con Personalidad**:
  - Selector de categoría (Robots espaciales, Animales del zoo, Personalidades humanas).
  - Seguimiento de victorias individuales por bot.
  - Frases características y estilos tácticos diferenciados.
- [x] **Módulo "Yo" (Avatar Studio & Tienda)**:
  - Personalización de avatares, camisetas y accesorios.
  - Tienda de tableros temáticos (Esmeralda ChessKid, Madera noble, Cyberpunk, Azul Real, Rubí).
- [x] **Motor de Temas Adaptativo**:
  - Selector en vivo de 3 temas: *Moderno Dark & Gold (Adolescentes y Adultos)*, *ChessKid Alegre (Niños)* y *Pergamino Clásico (Dr. Wolf)*.
- [x] **Módulo de Problemas Tácticos ("Problemas / Puzzle Rush")**:
  - Rating dinámico de problemas.
  - Retroalimentación inmediata con pistas del Dr. Wolf.
- [x] **Navegación de 5 Pestañas Modernas**: `Jugar`, `Robots`, `Problemas`, `Aprender`, `Yo`.

---

### 🚀 FASE 3: Árbol Curricular Extendido (110 Puntos de Aprendizaje)
- [ ] Cargar los 110 módulos interactivos completos según el documento `Guía Curricular de Ajedrez Infantil.docx`:
  - **Módulo 1 (0-800 Elo)**: Reglas, cuentos de piezas, jaques básicos, rey ahogado, valor de piezas, jaque mate del pasillo.
  - **Módulo 2 (800-1200 Elo)**: Clavadas, ataques dobles / tenedores, enfiladas, piezas sobrecargadas, jaque a la descubierta, mates elementales (Dama + Rey, Torre + Rey).
  - **Módulo 3 (1200-1500 Elo)**: Finales de peones (Regla del cuadrado, oposición, casillas clave), estructuras de peones (doblados, aislados, peón pasado).
  - **Módulo 4 (1500-1800 Elo)**: Profilaxis, piezas malas vs piezas buenas, casillas débiles, sacrificios posicionales (Yusupov Tomos 1-3).
  - **Módulo 5 (1800-2200+ Elo)**: Repertorio de aperturas magistrales, juego de iniciativa, cálculo en árbol de variantes complejas (KCF).
- [ ] Modo "Camino de Aventura" con nodos desbloqueables visuales tipo mapa.

---

### ⏳ FASE 4: Análisis Post-Partida & Motor Stockfish WASM
- [ ] Integración de Stockfish en WebWorker (WASM) para evaluación numérica (+1.5, -2.3, #M3).
- [ ] Gráfico de evaluación interactivo a lo largo de toda la partida.
- [ ] Clasificación automática de jugadas: *Brillante (!!), Mejor jugada (!), Buena, Imprecisión (?!), Error (?), Grave error (??)*.
- [ ] Función "Revisar mis errores": permite al usuario jugar la posición crítica de nuevo hasta encontrar la jugada correcta.

---

### ⏳ FASE 5: Torneos, Retos Diarios y Exportación
- [ ] Modo "Torneo Arena": simulación de torneos suizos o round-robin con los bots de la plataforma.
- [ ] Desafío diario del Gran Maestro con recompensas extra de Gemas 💎.
- [ ] Exportación e importación de partidas en formato PGN y FEN.
- [ ] Certificados de graduación imprimibles en PDF al completar cada una de las 4 etapas curriculares.
