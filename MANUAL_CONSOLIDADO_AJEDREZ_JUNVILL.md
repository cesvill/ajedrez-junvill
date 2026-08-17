# 📖 MANUAL CONSOLIDADO Y MAESTRO DE AJEDREZ JUNVILL ♟️✨
*Guía Integral de Arquitectura, Motores Pedagógicos, Módulos y Reglas Especiales*

---

## 1. 🌟 VISIÓN GENERAL Y FILOSOFÍA PEDAGÓGICA
**Ajedrez Junvill** es una plataforma web integral de ajedrez educativo, táctico y familiar inspirada en las mejores prácticas de la escuela de ajedrez infantil (ChessKid, Método Yusupov y Academia Rusa de Ajedrez).

Está diseñada para:
1. **Educar sin frustración**: Ofrecer una curva de aprendizaje adaptada desde niños de 4 años hasta jugadores avanzados.
2. **Integrar a la familia**: Variantes lúdicas (Dados Mágicos, Rey de la Colina) y sistema de hándicap negociable para que padres e hijos compitan en igualdad de condiciones.
3. **Gamificación positiva**: Ganancia de estrellas ⭐, gemas 💎, coronas 👑, diplomas descargables y desbloqueo de accesorios para avatares 3D.

---

## 2. 🏛️ ARQUITECTURA TECNOLÓGICA Y MOTORES

### 🧠 Los 7 Motores Internos:
1. **Motor de Reglas y Validación (`chess.js`)**: Valida todos los movimientos legales según el reglamento oficial FIDE (incluyendo enroques, peón al paso, coronaciones y tablas por repetición/ahogado).
2. **Motor de IA Graduable (`aiBot.js`)**:
   - Dificultades desde Nivel 1 (~400 Elo) hasta Nivel 5 (2000+ Elo).
   - Algoritmo Minimax con Poda Alfa-Beta, Tablas de Posición por Pieza (PST) y heurística especial de mates en 1 jugada.
   - Soporte nativo para variantes (*Dados Mágicos* y *Rey de la Colina*).
3. **Motor del Tutor Dinámico (`coachEngine.js`)**:
   - Generación de pistas en 4 niveles progresivos (Concepto general ➡️ Cuadrante del tablero ➡️ Casilla de origen ➡️ Jugada exacta).
   - Detección en tiempo real de errores graves (*Blunders*) y alertas de amenaza directa (*Danger Threat*).
4. **Motor de Voz y Sonido (`voiceEngine.js` y `audio.js`)**:
   - Síntesis de voz en español para Don Aurelio y los demás profesores.
   - Efectos sonoros binaurales para movimientos, capturas, jaques, victorias y pistas.
5. **Motor de Análisis y Revisión (`gameReviewEngine.js`)**:
   - Calcula la precisión porcentual de cada jugador.
   - Califica cada jugada como: *Brillante (!!) 🌟, Mejor jugada (⭐), Buena (👍), Imprecisión (?!), Error (?) o Error Grave (??)*.
6. **Motor de Hándicap Pedagógico (`handicapEngine.js`)**:
   - Permite dar ventajas a jugadores novatos: Peón de ventaja, Caballo/Torre de ventaja, pistas ilimitadas o retroceder jugadas.
7. **Motor Multijugador P2P (`p2pEngine.js`)**:
   - Partidas multijugador directas entre dos dispositivos mediante WebRTC / PeerJS sin necesidad de servidores externos complejos.
   - Conexión instantánea mediante código de sala o escaneo de código QR.

---

## 3. 🗺️ GUÍA DE PANTALLAS Y MÓDULOS

### 🏠 1. Pantalla de Inicio (`HomeView.jsx`)
- **Radar Yusupov de 6 Dimensiones**: Gráfico interactivo que mide tus habilidades en: *Táctica, Finales, Aperturas, Estrategia, Cálculo y Ataque al Rey*.
- **Próxima Lección Sugerida**: Acceso en 1 clic a la siguiente lección pendiente del currículo.
- **Robot Desafiante Recomendado**: Sugerencia de bot acorde a tu nivel Elo actual.
- **Partida en Curso Guardada**: Banner para reanudar al instante tu última partida contra el bot sin perder jugadas.

---

### 📚 2. Escuela de Ajedrez / Aprender (`LessonsView.jsx` y `LessonPlayerModal.jsx`)
- **110 Lecciones Maestras** organizadas en 5 Etapas Curriculares:
  1. *Etapa 1: El Despertar del Tablero* (Movimiento de piezas, valores, jaque y mate).
  2. *Etapa 2: Arsenal Táctico Infantil* (Ataque doble, clavada, enfilada, peón al paso).
  3. *Etapa 3: Maestría Posicional y Finales* (Finales de rey y peón, oposición, estructura).
  4. *Etapa 4: Ataque Estratégico y Combinaciones* (Pieza sobrecargada, rayos X, desviación).
  5. *Etapa 5: Maestría de Torneo y Cálculo FIDE* (Planes profundos, sacrificios, profilaxis).
- **Animación en Vivo de Movimientos del Rival**: El tablero anima el avance de la pieza enemiga (ej. salto de 2 casillas en el peón al paso) para entender visualmente la causa del ejercicio.
- **Doble soporte de interacción**: Posibilidad de arrastrar la pieza o hacer clic en casilla origen y casilla destino.
- **Sistema de Reporte Inteligente de Bugs**: Botón con 10 opciones rápidas en 1 clic y consolidado exportable a JSON.

---

### 📖 3. Entrenador de Aperturas (`OpeningsTrainerModal.jsx`)
- 12 Aperturas Clásicas y Modernas (Apertura Italiana, Ruy López, Defensa Siciliana, Francesa, Caro-Kann, Gambito de Dama, India de Rey, etc.).
- Modo guiado con flechas estratégicas y comentarios didácticos en cada jugada.

---

### 🤖 4. Sala de Robots (`RobotsView.jsx`)
- 12 Robots con historias, nacionalidades, Elo desde 400 hasta 2200 y estilos de juego diversos (desde robots amigables para niños como *Pip el Peón* hasta grandes maestros como *Magnus Bot*).

---

### ⚔️ 5. Partida / Jugar (`PlayView.jsx`)
- **Modalidades Disponibles**:
  1. **Contra Robot / IA**: Con tutor interactivo, barra de evaluación y pistas progresivas.
  2. **Dos Jugadores (Pasa y Juega)**: Para jugar en la misma pantalla alternando turnos.
  3. **Multijugador Online P2P**: Jugar desde dos celulares o computadores mediante código de sala o QR.
- **Variantes Familiares Lúdicas (Fase 4)**:
  - 🎲 **Ajedrez con Dados Mágicos (Dice Chess)**: En cada turno se lanza un dado que indica si debes mover Peón, Caballo, Alfil, Torre, Dama o Rey/Comodín. ¡Nivela la partida entre niños y adultos con azar y emoción!
  - ⛰️👑 **Rey de la Colina (King of the Hill)**: Las 4 casillas centrales (`d4`, `d5`, `e4`, `e5`) representan la cima de la montaña. ¡El primer Rey que pise el centro gana la partida al instante!
- **Sistema de Reacciones en Vivo**: Emojis interactivos y caras dinámicas para celebrar o reaccionar ante jugadas.
- **Modo Pantalla Completa**: Oculta la interfaz del navegador para una experiencia de app nativa.

---

### 🎨 6. Avatar Studio & Tienda (`AvatarStudioView.jsx`, `FullBodyAvatar.jsx`)
- Personalización completa del avatar del jugador:
  - Color de piel, peinados, ojos, expresiones y sombreros.
  - Ropa elegante, trajes medievales y accesorios reales.
  - Renderizado en **cuerpo entero 3D sobre pedestal de ajedrez** con animaciones de victoria y flotación.

---

### 🏆 7. Torneos, Retos Familiares y Diplomas (`CertificatesModal.jsx`, `FamilyChallengesModal.jsx`)
- **Retos Familiares**: Creación de desafíos personalizados para jugar en casa (ej. *"Vence a papá con blancas"*, *"Resuelve 5 problemas seguidos"*).
- **Diplomas y Certificados Oficiales**: Generación automática de certificados imprimibles con el nombre del alumno al completar etapas del curso.

---

## 4. 🔄 GESTIÓN Y SINCRONIZACIÓN CON GITHUB
El proyecto está vinculado al repositorio oficial de GitHub:
👉 **[https://github.com/cesvill/ajedrez-junvill](https://github.com/cesvill/ajedrez-junvill)**

Para sincronizar cualquier cambio futuro, solo se requiere indicar *"haz push en github"*.
