export function getStage4(ex, th) {
  return {
    id: 'etapa-4-aperturas-medio-juego',
    title: 'ETAPA 4: APERTURAS Y MEDIO JUEGO (1600 - 1900 Elo)',
    category: 'aperturas',
    badge: 'Maestría Posicional',
    eloRange: '1600 - 1900 Elo',
    lessons: [
      {
        id: 'l73_centro_clasico',
        number: 73,
        title: 'Dominio del centro clásico (e4/d4)',
        category: 'aperturas',
        steps: [
          th('El Centro Ideal de Peones', 'Ocupar el centro con peones en e4 y d4 controla las casillas clave c5, d5, e5, f5 y otorga máxima movilidad a tus piezas menores.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e2', 'e4', 'Paso 1: Inicia la partida avanzando e2-e4.', 'Avanza el peón a e4.', '¡Peón central avanzado!'),
          ex('ex_2', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'g1', 'f3', 'Paso 2: Desarrolla tu Caballo a f3 atacando el peón central enemigo.', 'Mueve tu caballo a f3.', '¡Desarrollo con amenaza!'),
          ex('ex_3', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3', 'd2', 'd4', 'Paso 3: Construye el centro clásico jugando d2-d4.', 'Avanza el peón a d4.', '¡Dúo de peones centrales formado!'),
          ex('ex_4', 'r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4', 'f3', 'd4', 'Paso 4: Recaptura en d4 con tu Caballo.', 'Captura en d4 con el caballo.', '¡Caballo dominante en d4!'),
          ex('ex_5', 'r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5', 'b1', 'c3', 'Paso 5: Defiende tu peón central de e4 con Cc3.', 'Mueve tu caballo a c3.', '¡Centro clásico dominado!')
        ]
      },
      {
        id: 'l74_centro_hipermoderno',
        number: 74,
        title: 'Control a distancia del centro (Hipermodernismo)',
        category: 'aperturas',
        steps: [
          th('Presión sin Ocupación Directa', 'La escuela hipermoderna deja que el rival ocupe el centro para luego demolerlo con Alfiles en fianchetto (g3/Ag2 o b3/Ab2) y rupturas de peón.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'g2', 'g3', 'Paso 1: Prepara el fianchetto en el flanco de rey con g2-g3.', 'Avanza el peón a g3.', '¡Preparación del fianchetto!'),
          ex('ex_2', 'rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 2', 'f1', 'g2', 'Paso 2: Desarrolla tu Alfil al fianchetto en g2.', 'Lleva tu alfil a g2.', '¡Alfil francotirador en la gran diagonal!'),
          ex('ex_3', 'rnbqkbnr/ppp2ppp/3p4/4p3/8/6P1/PPPPPPBP/RNBQK1NR w KQkq - 0 3', 'g1', 'f3', 'Paso 3: Desarrolla tu Caballo a f3.', 'Mueve tu caballo a f3.', '¡Desarrollo armónico!'),
          ex('ex_4', 'rnbqkbnr/ppp2ppp/3p4/4p3/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey enroque rápido!'),
          ex('ex_5', 'rnbqkb1r/ppp2ppp/3p1n2/4p3/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq - 1 5', 'd2', 'd4', 'Paso 5: Rompe el centro rival jugando d2-d4.', 'Avanza el peón a d4.', '¡Golpe hipermoderno al centro!')
        ]
      },
      {
        id: 'l75_apertura_espanola_italiana',
        number: 75,
        title: 'Aperturas Abiertas: Española e Italiana',
        category: 'aperturas',
        steps: [
          th('Los Pilares de la Teoría Clásica', 'La Apertura Española (1.e4 e5 2.Cf3 Cc6 3.Ab5) presiona el caballo defensor de e5; la Italiana (3.Ac4) apunta al punto vulnerable f7.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e2', 'e4', 'Paso 1: Mueve tu peón de rey a e4.', 'Avanza a e4.', '¡Apertura abierta iniciada!'),
          ex('ex_2', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'g1', 'f3', 'Paso 2: Desarrolla tu Caballo a f3.', 'Mueve el caballo a f3.', '¡Ataque a e5!'),
          ex('ex_3', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3', 'f1', 'c4', 'Paso 3: Juega la Apertura Italiana llevando tu Alfil a c4.', 'Lleva tu alfil a c4.', '¡Apertura Italiana planteada!'),
          ex('ex_4', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', 'd2', 'd3', 'Paso 4: Sostén tu centro con d2-d3 (Giuoco Pianissimo).', 'Avanza el peón a d3.', '¡Centro sólido!'),
          ex('ex_5', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5', 'e1', 'g1', 'Paso 5: Completa tu enroque corto de e1 a g1.', 'Mueve tu rey a g1.', '¡Aperturas Abiertas dominadas!')
        ]
      },
      {
        id: 'l76_defensa_siciliana',
        number: 76,
        title: 'Defensa Siciliana (1.e4 c5)',
        category: 'aperturas',
        steps: [
          th('El Contragolpe Asimétrico', 'La Defensa Siciliana lucha por el centro desde el flanco con 1...c5, creando posiciones desequilibradas con gran potencial de contraataque.', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 'c7', 'c5', 'Paso 1: Juegas con negras. Plantea la Defensa Siciliana con c7-c5.', 'Avanza el peón a c5.', '¡Defensa Siciliana en el tablero!'),
          ex('ex_2', 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', 'd7', 'd6', 'Paso 2: Desarrolla tu peón a d6.', 'Mueve el peón a d6.', '¡Estructura siciliana clásica!'),
          ex('ex_3', 'rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3', 'c5', 'd4', 'Paso 3: Captura en d4 con tu peón.', 'Captura en d4 con el peón.', '¡Columna "c" semiabierta para las negras!'),
          ex('ex_4', 'rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4', 'g8', 'f6', 'Paso 4: Desarrolla tu Caballo a f6 atacando e4.', 'Mueve tu caballo a f6.', '¡Presión sobre e4!'),
          ex('ex_5', 'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 5', 'a7', 'a6', 'Paso 5: Plantea la legendaria Variante Najdorf con a7-a6.', 'Mueve el peón a a6.', '¡Defensa Siciliana Najdorf dominada!')
        ]
      },
      {
        id: 'l77_francesa_carokann',
        number: 77,
        title: 'Defensa Francesa y Caro-Kann',
        category: 'aperturas',
        steps: [
          th('Estructuras Sólidas de Peones', 'La Francesa (1...e6) y la Caro-Kann (1...c6) preparan el avance central d7-d5 para desafiar de inmediato al peón de e4.', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 'e7', 'e6', 'Paso 1: Plantea la Defensa Francesa jugando e7-e6.', 'Avanza el peón a e6.', '¡Defensa Francesa planteada!'),
          ex('ex_2', 'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2', 'd7', 'd5', 'Paso 2: Golpea el centro con d7-d5.', 'Avanza el peón a d5.', '¡Desafío directo a e4!'),
          ex('ex_3', 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3', 'c7', 'c5', 'Paso 3: Ataca la base de la cadena blanca con c7-c5.', 'Mueve el peón a c5.', '¡Ruptura temática francesa!'),
          ex('ex_4', 'rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4', 'b8', 'c6', 'Paso 4: Desarrolla tu Caballo a c6 aumentando la presión sobre d4.', 'Mueve tu caballo a c6.', '¡Presión sobre el peón d4!'),
          ex('ex_5', 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 5', 'c8', 'd7', 'Paso 5: Desarrolla tu Alfil a d7.', 'Mueve el alfil a d7.', '¡Francesa y Caro-Kann dominadas!')
        ]
      },
      {
        id: 'l78_gambito_dama',
        number: 78,
        title: 'Gambito de Dama (1.d4 d5 2.c4)',
        category: 'aperturas',
        steps: [
          th('El Gambito por la Iniciativa Central', 'Las blancas ofrecen su peón de "c" con 2.c4 para desviar el peón central negro de d5 y dominar todo el centro con e4.', 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', 'd7', 'd5', 'Paso 1: Juegas con negras. Responde sólidamente con d7-d5.', 'Avanza el peón a d5.', '¡Centro simétrico!'),
          ex('ex_2', 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', 'e7', 'e6', 'Paso 2: Declina el gambito reforzando d5 con e7-e6.', 'Mueve el peón a e6.', '¡Gambito de Dama Declinado!'),
          ex('ex_3', 'rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', 'g8', 'f6', 'Paso 3: Desarrolla tu Caballo a f6.', 'Mueve tu caballo a f6.', '¡Desarrollo clásico!'),
          ex('ex_4', 'rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 2 4', 'f8', 'e7', 'Paso 4: Desarrolla tu Alfil a e7 preparando el enroque.', 'Lleva tu alfil a e7.', '¡Alfil sólido!'),
          ex('ex_5', 'rnbqkb1r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 3 5', 'e2', 'e3', 'Paso 5: Consolida tu centro con e2-e3.', 'Avanza el peón a e3.', '¡Gambito de Dama dominado!')
        ]
      },
      {
        id: 'l79_india_rey_grunfeld',
        number: 79,
        title: 'Defensa India de Rey y Grünfeld',
        category: 'aperturas',
        steps: [
          th('Ataque Furioso al Flanco de Rey', 'En la India de Rey las negras permiten el centro blanco para luego lanzar un asalto demoledor de peones en el flanco de rey con ...f5.', 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', 'g8', 'f6', 'Paso 1: Plantea la India de Rey con Cf6.', 'Mueve tu caballo a f6.', '¡Control a distancia!'),
          ex('ex_2', 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', 'g7', 'g6', 'Paso 2: Prepara el fianchetto con g7-g6.', 'Avanza el peón a g6.', '¡Fianchetto del rey!'),
          ex('ex_3', 'rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3', 'f8', 'g7', 'Paso 3: Coloca tu Alfil en g7.', 'Lleva tu alfil a g7.', '¡Alfil indio activo!'),
          ex('ex_4', 'rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4', 'd7', 'd6', 'Paso 4: Frena el avance e4-e5 jugando d7-d6.', 'Mueve el peón a d6.', '¡Estructura india de rey!'),
          ex('ex_5', 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5', 'e8', 'g8', 'Paso 5: Enroca corto con negras.', 'Mueve tu rey a g8.', '¡Defensas Indias dominadas!')
        ]
      },
      {
        id: 'l80_inglesa_londres',
        number: 80,
        title: 'Apertura Inglesa y Sistema Londres',
        category: 'aperturas',
        steps: [
          th('Estructuras Universales y Sólidas', 'El Sistema Londres (1.d4, 2.Af4, 3.e3, 4.c3, 5.Cf3) ofrece una pirámide de peones impenetrable fácil de jugar contra cualquier defensa.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'd2', 'd4', 'Paso 1: Inicia el Sistema Londres jugando d2-d4.', 'Avanza a d4.', '¡Paso inicial del Londres!'),
          ex('ex_2', 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2', 'c1', 'f4', 'Paso 2: Desarrolla tu Alfil fuera de la cadena a f4.', 'Lleva tu alfil a f4.', '¡Alfil de Londres activo!'),
          ex('ex_3', 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 1 3', 'e2', 'e3', 'Paso 3: Construye la muralla jugando e2-e3.', 'Avanza el peón a e3.', '¡Estructura piramidal sólida!'),
          ex('ex_4', 'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4', 'g1', 'f3', 'Paso 4: Desarrolla tu Caballo a f3.', 'Mueve tu caballo a f3.', '¡Caballo al juego!'),
          ex('ex_5', 'rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 1 5', 'c2', 'c3', 'Paso 5: Completa la pirámide jugando c2-c3.', 'Mueve el peón a c3.', '¡Sistema Londres e Inglesa dominados!')
        ]
      },
      {
        id: 'l81_pieza_mala',
        number: 81,
        title: 'Identificar y mejorar la pieza mala',
        category: 'estrategia',
        steps: [
          th('Reanimar las Piezas Pasivas', 'Un Alfil chocado contra sus propios peones o un Caballo en la orilla son piezas malas. Encuentra la maniobra para activarlas o cambiarlas.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Cambia tu Alfil activo por el caballo rival en c6.', 'Captura en c6 con el alfil.', '¡Cambio favorable!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd3', 'Paso 2: Sostén tu peón central con d2-d3.', 'Avanza el peón a d3.', '¡Centro afianzado!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Juegas con negras. Juega d7-d6.', 'Mueve el peón a d6.', '¡Estructura reforzada!'),
          ex('ex_4', 'r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey seguro!'),
          ex('ex_5', 'r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Activa tu Alfil a g4.', 'Mueve el alfil a g4.', '¡Mejora de piezas dominada!')
        ]
      },
      {
        id: 'l82_casilla_debil',
        number: 82,
        title: 'La casilla débil (Outpost / Puesto de Avanzada)',
        category: 'estrategia',
        steps: [
          th('El Nido del Caballo', 'Una casilla débil no puede ser defendida por peones enemigos. Instalar un Caballo en ese puesto de avanzada lo convierte en un pulpo gigante.', 'r1bqk2r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1', 'f1', 'c4', 'Paso 1: Desarrolla tu Alfil a c4 apuntando a d5.', 'Lleva tu alfil a c4.', '¡Control de la diagonal y casilla d5!'),
          ex('ex_2', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 2', 'd2', 'd3', 'Paso 2: Sostén tu centro jugando d2-d3.', 'Avanza el peón a d3.', '¡Centro afianzado!'),
          ex('ex_3', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 2', 'f8', 'c5', 'Paso 3: Juegas con negras. Desarrolla tu Alfil a c5.', 'Mueve el alfil a c5.', '¡Desarrollo simétrico!'),
          ex('ex_4', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 3', 'b1', 'c3', 'Paso 4: Desarrolla tu Caballo a c3.', 'Mueve tu caballo a c3.', '¡Caballos preparados para saltar!'),
          ex('ex_5', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 2 4', 'e1', 'g1', 'Paso 5: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Puestos de avanzada dominados!')
        ]
      },
      {
        id: 'l83_columnas_abiertas',
        number: 83,
        title: 'Ocupación y doblaje en columnas abiertas',
        category: 'estrategia',
        steps: [
          th('La Autovía de las Torres', 'Una columna sin peones es una columna abierta. Domínala con una Torre y dobla tu segunda Torre detrás para crear una batería mortal.', 'r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1'),
          ex('ex_1', 'r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1', 'a2', 'a8', 'Paso 1: Penetra por la columna abierta a la 8ª fila con tu Torre.', 'Lleva tu torre a a8.', '¡Penetración por la columna abierta!'),
          ex('ex_2', 'R4rk1/5ppp/8/8/8/8/8/4K3 w - - 1 2', 'a8', 'f8', 'Paso 2: Captura en f8 con tu Torre.', 'Captura en f8 con la torre.', '¡Captura en la 8ª fila!'),
          ex('ex_3', '5rk1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 3: Lleva tu Torre a a8.', 'Mueve la torre a a8.', '¡Jaque en la 8ª fila!'),
          ex('ex_4', 'R4rk1/5ppp/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 4: Acerca tu Rey a e2.', 'Mueve tu rey a e2.', '¡Rey en camino!'),
          ex('ex_5', 'R4rk1/5ppp/8/8/8/4K3/8/8 w - - 1 2', 'e3', 'e4', 'Paso 5: Centraliza tu Rey a e4.', 'Avanza el rey a e4.', '¡Columnas abiertas dominadas!')
        ]
      },
      {
        id: 'l84_septima_octava_fila',
        number: 84,
        title: 'Dominio de la 7ª y 8ª fila',
        category: 'estrategia',
        steps: [
          th('La Masacre en la Séptima', 'Doblar dos Torres en la 7ª fila (los "Cerdos Ciegos") garantiza la destrucción de todos los peones enemigos y múltiples redes de mate.', '8/5ppp/8/8/8/8/R7/4K2k w - - 0 1'),
          ex('ex_1', '8/5ppp/8/8/8/8/R7/4K2k w - - 0 1', 'a2', 'a7', 'Paso 1: Lleva tu Torre a la 7ª fila en a7.', 'Lleva tu torre a a7.', '¡Torre en 7ª fila!'),
          ex('ex_2', 'R7/5ppp/8/8/8/8/8/4K2k w - - 0 1', 'a8', 'f8', 'Paso 2: Captura en f8 con tu Torre.', 'Captura en f8 con la torre.', '¡Captura en 8ª fila!'),
          ex('ex_3', '5R2/5ppp/8/8/8/8/8/4K2k w - - 0 1', 'f8', 'f7', 'Paso 3: Captura el peón en f7 con tu Torre.', 'Captura en f7 con la torre.', '¡Peón de f7 devorado!'),
          ex('ex_4', '5R2/5p1p/8/8/8/8/8/4K2k w - - 0 1', 'f8', 'h8', 'Paso 4: Da Jaque Mate en h8.', 'Lleva la torre a h8.', '¡Jaque Mate!'),
          ex('ex_5', '7R/5p1p/8/8/8/4K3/8/7k w - - 1 2', 'h8', 'h7', 'Paso 5: Captura el peón en h7.', 'Captura en h7 con la torre.', '¡Filas 7ª y 8ª dominadas!')
        ]
      },
      {
        id: 'l85_centro_cerrado',
        number: 85,
        title: 'El centro cerrado y ataques en flancos',
        category: 'estrategia',
        steps: [
          th('Ataque Donde Apunta Tu Cadena', 'Con el centro bloqueado por peones fijos, no hay peligro de contraataque central: ¡lanza una avalancha de peones en el flanco donde apuntan tus peones!', 'rnbqkb1r/pppppp1p/5np1/8/2PPP3/8/PP3PPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkb1r/pppppp1p/5np1/8/2PPP3/8/PP3PPP/RNBQKBNR w KQkq - 0 1', 'b1', 'c3', 'Paso 1: Desarrolla tu Caballo a c3.', 'Mueve tu caballo a c3.', '¡Desarrollo central!'),
          ex('ex_2', 'rnbqkb1r/pppppp1p/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 1 1', 'd7', 'd6', 'Paso 2: Sostén tu estructura con d7-d6.', 'Mueve el peón a d6.', '¡Estructura india sólida!'),
          ex('ex_3', 'rnbqkb1r/ppp1pp1p/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 2', 'g1', 'f3', 'Paso 3: Desarrolla tu Caballo a f3.', 'Mueve tu caballo a f3.', '¡Desarrollo completo!'),
          ex('ex_4', 'rnbqkb1r/ppp1pp1p/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 2', 'f8', 'g7', 'Paso 4: Coloca tu Alfil en g7.', 'Lleva tu alfil a g7.', '¡Fianchetto completado!'),
          ex('ex_5', 'rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQkq - 2 3', 'f1', 'e2', 'Paso 5: Desarrolla tu Alfil a e2 preparando el enroque.', 'Mueve el alfil a e2.', '¡Centros cerrados dominados!')
        ]
      },
      {
        id: 'l86_centro_abierto',
        number: 86,
        title: 'El centro abierto y piezas activas',
        category: 'estrategia',
        steps: [
          th('Velocidad y Diagonales Libres', 'Sin peones centrales, las piezas de largo alcance (Alfiles, Torres y Dama) despliegan su máximo poder. ¡El bando más rápido al atacar se impone!', 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 2'),
          ex('ex_1', 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 2', 'e5', 'd4', 'Paso 1: Juegas con negras. Abre el centro capturando en d4 con tu peón.', 'Captura en d4 con el peón.', '¡Centro abierto!'),
          ex('ex_2', 'r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 3', 'g8', 'f6', 'Paso 2: Desarrolla tu Caballo a f6 atacando e4.', 'Mueve tu caballo a f6.', '¡Presión sobre e4!'),
          ex('ex_3', 'r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 4', 'f8', 'b4', 'Paso 3: Clava el caballo de c3 con tu Alfil en b4.', 'Mueve tu alfil a b4.', '¡Clavada activa!'),
          ex('ex_4', 'r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 5', 'd4', 'c6', 'Paso 4: Captura el caballo en c6 con tu Caballo.', 'Captura en c6 con el caballo.', '¡Intercambio central!'),
          ex('ex_5', 'r1bqk2r/p1pp1ppp/2p2n2/8/1b2P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6', 'f1', 'd3', 'Paso 5: Desarrolla tu Alfil a d3 defendiendo tu peón central.', 'Mueve el alfil a d3.', '¡Centro abierto dominado!')
        ]
      },
      {
        id: 'l87_estructura_carlsbad',
        number: 87,
        title: 'Estructura Carlsbad y ataque de minorías',
        category: 'estrategia',
        steps: [
          th('Dos Peones Vencen a Tres', 'Avanzar tu minoría de peones a4-b4-b5 contra la mayoría rival b7-c6-d5 destruye la cadena negra y crea un peón débil aislado en c6.', 'rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1'),
          ex('ex_1', 'rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1', 'c4', 'd5', 'Paso 1: Fija la estructura Carlsbad capturando en d5 con tu peón.', 'Captura en d5 con el peón.', '¡Estructura Carlsbad formada!'),
          ex('ex_2', 'rnbqk2r/ppp1bppp/5n2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 2', 'c1', 'g5', 'Paso 2: Desarrolla tu Alfil a g5 clavando al caballo de f6.', 'Mueve tu alfil a g5.', '¡Clavada activa!'),
          ex('ex_3', 'rnbqk2r/ppp1bppp/5n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 2', 'c7', 'c6', 'Paso 3: Juegas con negras. Sostén tu centro jugando c7-c6.', 'Mueve el peón a c6.', '¡Cadena de peones Carlsbad!'),
          ex('ex_4', 'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 3', 'e2', 'e3', 'Paso 4: Asegura tu centro con e2-e3.', 'Avanza el peón a e3.', '¡Centro blindado!'),
          ex('ex_5', 'rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N1PN2/PP3PPP/R2QKB1R b KQkq - 0 3', 'e8', 'g8', 'Paso 5: Enroca corto con negras.', 'Mueve tu rey a g8.', '¡Estructura Carlsbad dominada!')
        ]
      },
      {
        id: 'l88_estructura_maroczy',
        number: 88,
        title: 'Estructura Maróczy: Control de d5',
        category: 'estrategia',
        steps: [
          th('El Abrazo de Hierro', 'Colocar peones blancos en c4 y e4 contra la Defensa Siciliana asfixia la casilla d5 impidiendo para siempre la ruptura liberadora de las negras.', 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', 'c2', 'c4', 'Paso 1: Plantea el Muro de Maróczy jugando c2-c4.', 'Avanza el peón a c4.', '¡Estructura Maróczy iniciada!'),
          ex('ex_2', 'rnbqkbnr/pp1ppppp/8/2p5/2P1P3/8/PP1P1PPP/RNBQKBNR b KQkq - 0 1', 'b8', 'c6', 'Paso 2: Desarrolla tu Caballo a c6.', 'Mueve tu caballo a c6.', '¡Desarrollo siciliano!'),
          ex('ex_3', 'r1bqkbnr/pp1ppppp/2n5/2p5/2P1P3/5N2/PP1P1PPP/RNBQKB1R w KQkq - 1 2', 'd2', 'd4', 'Paso 3: Golpea el centro con d2-d4.', 'Avanza el peón a d4.', '¡Apertura del centro!'),
          ex('ex_4', 'r1bqkbnr/pp1ppppp/2n5/8/2PNP3/8/PP3PPP/RNBQKB1R b KQkq - 0 3', 'g7', 'g6', 'Paso 4: Juegas con negras. Prepara el fianchetto con g7-g6.', 'Mueve el peón a g6.', '¡Fianchetto siciliano!'),
          ex('ex_5', 'r1bqkbnr/pp1ppp1p/2n3p1/8/2PNP3/2N5/PP3PPP/R1BQKB1R b KQkq - 1 4', 'f8', 'g7', 'Paso 5: Coloca tu Alfil en g7.', 'Lleva tu alfil a g7.', '¡Estructura Maróczy dominada!')
        ]
      },
      {
        id: 'l89_ataque_enroque_avalancha',
        number: 89,
        title: 'Ataque sobre el enroque con avalancha de peones',
        category: 'tactica',
        steps: [
          th('La Tormenta de Peones', 'Avanzar tus peones de g4-h4-h5 hacia el enroque rival abre columnas para tus Torres y pulveriza la defensa del Rey contrario.', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1'),
          ex('ex_1', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1', 'h2', 'h3', 'Paso 1: Prepara la avalancha en el flanco de rey con h2-h3.', 'Avanza el peón a h3.', '¡Preparación del avance!'),
          ex('ex_2', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQ - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla el peón central a d6.', 'Mueve el peón a d6.', '¡Defensa sólida!'),
          ex('ex_3', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQ - 0 2', 'c1', 'g5', 'Paso 3: Clava al caballo en f6 con tu Alfil en g5.', 'Mueve tu alfil a g5.', '¡Clavada activa!'),
          ex('ex_4', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R b KQ - 1 2', 'h7', 'h6', 'Paso 4: Juegas con negras. Cuestiona al alfil con h7-h6.', 'Avanza el peón a h6.', '¡Pregunta al alfil!'),
          ex('ex_5', 'r1bq1rk1/ppp2pp1/2np1n1p/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R w KQ - 0 3', 'g5', 'h4', 'Paso 5: Mantén la clavada retirando tu Alfil a h4.', 'Mueve el alfil a h4.', '¡Avalancha de peones dominada!')
        ]
      },
      {
        id: 'l90_profilaxis_basica',
        number: 90,
        title: 'Profilaxis básica: neutralizar planes rivales',
        category: 'estrategia',
        steps: [
          th('Pensar por el Rival', 'La profilaxis es el arte de anticipar la amenaza o jugada del oponente y neutralizarla antes de que siquiera pueda llevarla a cabo.', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'h2', 'h3', 'Paso 1: Juega h2-h3 para evitar para siempre la molesta clavada ...Ag4.', 'Avanza el peón a h3.', '¡Jugada profiláctica perfecta!'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla tu peón a d6.', 'Mueve el peón a d6.', '¡Centro seguro!'),
          ex('ex_3', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2', 'a2', 'a3', 'Paso 3: Juega a2-a3 para darle una casilla de escape a tu alfil en a2 ante ...Ca5.', 'Avanza el peón a a3.', '¡Segunda profilaxis magistral!'),
          ex('ex_4', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R b KQkq - 0 2', 'a7', 'a6', 'Paso 4: Juegas con negras. Juega también profilácticamente a7-a6.', 'Mueve el peón a a6.', '¡Profilaxis recíproca!'),
          ex('ex_5', 'r1bqk2r/1pp2ppp/p1np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R w KQkq - 0 3', 'e1', 'g1', 'Paso 5: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Profilaxis básica dominada!')
        ]
      },
      {
        id: 'l91_iqp_ataque',
        number: 91,
        title: 'Peón de Dama Aislado (IQP): Dinamismo y Ataque',
        category: 'estrategia',
        steps: [
          th('La Dinamita de d5', 'Tener un peón aislado otorga puestos avanzados en e5/c5 y la ruptura temática d4-d5 que dinamita la posición enemiga.', 'r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1'),
          ex('ex_1', 'r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1', 'c1', 'g5', 'Paso 1: Desarrolla tu Alfil a g5 clavando al caballo de f6.', 'Mueve tu alfil a g5.', '¡Clavada activa!'),
          ex('ex_2', 'r1bq1rk1/pp3ppp/2n1pn2/3p2B1/3P4/2N2N2/PP2BPPP/R2Q1RK1 b - - 1 1', 'h7', 'h6', 'Paso 2: Juegas con negras. Juega h7-h6.', 'Mueve el peón a h6.', '¡Pregunta al alfil!'),
          ex('ex_3', 'r1bq1rk1/pp3pp1/2n1pn1p/3p2B1/3P4/2N2N2/PP2BPPP/R2Q1RK1 w - - 0 2', 'g5', 'h4', 'Paso 3: Retira tu Alfil a h4 manteniendo la presión.', 'Mueve el alfil a h4.', '¡Presión continua!'),
          ex('ex_4', 'r1bq1rk1/pp3pp1/2n1pn1p/3p4/3P3B/2N2N2/PP2BPPP/R2Q1RK1 b - - 1 2', 'c8', 'd7', 'Paso 4: Desarrolla tu Alfil a d7.', 'Lleva el alfil a d7.', '¡Desarrollo armónico!'),
          ex('ex_5', 'r1bq1rk1/pp1b1pp1/2n1pn1p/3p4/3P3B/2N2N2/PP2BPPP/R2Q1RK1 w - - 2 3', 'f3', 'e5', 'Paso 5: Ocupa el puesto avanzado en e5 con tu Caballo.', 'Mueve tu caballo a e5.', '¡Ataque con IQP dominado!')
        ]
      },
      {
        id: 'l92_iqp_bloqueo',
        number: 92,
        title: 'Peón de Dama Aislado (IQP): Bloqueo y Asedio',
        category: 'estrategia',
        steps: [
          th('La Garra en d5', 'Contra el peón aislado, instala un Caballo firme en d5 (bloqueador absoluto), cambia las piezas menores y entra a un final ganado.', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1'),
          ex('ex_1', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1', 'c1', 'e3', 'Paso 1: Desarrolla tu Alfil a e3 para vigilar la casilla d4.', 'Mueve tu alfil a e3.', '¡Control del centro!'),
          ex('ex_2', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N1BN2/PP2BPPP/R2Q1RK1 b - - 1 1', 'd7', 'f6', 'Paso 2: Desarrolla el caballo negro a f6.', 'Mueve el caballo a f6.', '¡Caballo al juego!'),
          ex('ex_3', 'r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w - - 2 2', 'd1', 'd2', 'Paso 3: Conecta tus Torres llevando tu Dama a d2.', 'Lleva tu dama a d2.', '¡Torres conectadas!'),
          ex('ex_4', 'r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2N1BN2/PP1QBPPP/R4RK1 b - - 3 2', 'c8', 'd7', 'Paso 4: Desarrolla el alfil negro a d7.', 'Mueve el alfil a d7.', '¡Desarrollo completo!'),
          ex('ex_5', 'r2q1rk1/pp1bbppp/2n1pn2/3p4/3P4/2N1BN2/PP1QBPPP/R4RK1 w - - 4 3', 'f1', 'd1', 'Paso 5: Coloca tu Torre en d1 presionando la columna.', 'Lleva tu torre a d1.', '¡Graduación de Etapa 4 Completada con Éxito!')
        ]
      }
    ]
  };
}
