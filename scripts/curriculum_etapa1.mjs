export const ETAPA_1_LESSONS = [
  {
    id: 'l01_piezas',
    number: 1,
    title: 'Aprende acerca de las piezas',
    category: 'posicional',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'El Ejército de 16 Piezas',
        text: 'En el ajedrez cada bando comanda 16 piezas: 8 Peones, 2 Caballos, 2 Alfiles, 2 Torres, 1 Dama y 1 Rey. Cada una posee un movimiento único y un poder específico en la batalla.',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },
      {
        id: 'ex_1',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        instruction: 'Paso 1: Mueve tu Peón de Rey dos pasos hacia adelante de e2 a e4 para dominar el centro.',
        solution: { from: 'e2', to: 'e4' },
        hint: 'Avanza el peón blanco de e2 a e4.',
        feedback: '¡Excelente! El peón avanza hacia el frente y abre paso a tu Dama y Alfil.'
      },
      {
        id: 'ex_2',
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        instruction: 'Paso 2: Mueve tu Caballo en salto en L de g1 a f3 atacando el centro rival.',
        solution: { from: 'g1', to: 'f3' },
        hint: 'Mueve el caballo de g1 a f3.',
        feedback: '¡Perfecto! El caballo es la única pieza capaz de saltar por encima de otras piezas.'
      },
      {
        id: 'ex_3',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3',
        instruction: 'Paso 3: Mueve tu Alfil de casillas blancas por su diagonal abierta de f1 a c4.',
        solution: { from: 'f1', to: 'c4' },
        hint: 'Lleva tu alfil de f1 a c4.',
        feedback: '¡Gran movimiento! Los alfiles se mueven en diagonal tantas casillas libres como deseen.'
      },
      {
        id: 'ex_4',
        fen: '4k3/8/8/8/8/8/R7/4K3 w - - 0 1',
        instruction: 'Paso 4: Mueve tu Torre verticalmente por la columna abierta de a2 a a8.',
        solution: { from: 'a2', to: 'a8' },
        hint: 'Avanza tu torre por la columna "a" hasta a8.',
        feedback: '¡Excelente! Las torres se mueven en línea recta horizontal y verticalmente.'
      },
      {
        id: 'ex_5',
        fen: '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1',
        instruction: 'Paso 5: Mueve tu Dama (la pieza más poderosa) de e2 a e7 para dar jaque directo al rey rival.',
        solution: { from: 'e2', to: 'e7' },
        hint: 'Avanza tu dama de e2 a e7.',
        feedback: '¡Brillante! La dama combina los poderes de la Torre y el Alfil en todas las direcciones.'
      }
    ]
  },
  {
    id: 'l02_capturas',
    number: 2,
    title: 'Captura piezas enemigas',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'El Arte de la Captura',
        text: 'En el ajedrez capturas ocupando la casilla de la pieza enemiga y retirándola de la partida. ¡Practiquemos capturar con cada una de tus piezas!',
        fen: '8/8/8/3p4/4P3/8/8/4K2k w - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '8/8/8/3p4/4P3/8/8/4K2k w - - 0 1',
        instruction: 'Paso 1 (Captura con Peón): Los peones capturan un paso en diagonal. Captura el peón negro en d5 con tu peón de e4.',
        solution: { from: 'e4', to: 'd5' },
        hint: 'Mueve en diagonal de e4 a d5 capturando el peón.',
        feedback: '¡Excelente captura con peón! Has eliminado la pieza enemiga.'
      },
      {
        id: 'ex_2',
        fen: '8/8/8/4p3/8/5N2/8/4K2k w - - 0 1',
        instruction: 'Paso 2 (Captura con Caballo): Tu caballo salta en L. Captura el peón negro en e5 con tu Caballo de f3.',
        solution: { from: 'f3', to: 'e5' },
        hint: 'Salta de f3 a e5 capturando el peón.',
        feedback: '¡Gran salto! El caballo captura exactamente en la casilla de aterrizaje de su L.'
      },
      {
        id: 'ex_3',
        fen: '8/5p2/8/8/2B5/8/8/4K2k w - - 0 1',
        instruction: 'Paso 3 (Captura con Alfil): Tu Alfil se desplaza en diagonal. Captura el peón enemigo en f7 con tu Alfil de c4.',
        solution: { from: 'c4', to: 'f7' },
        hint: 'Desliza tu alfil de c4 a f7 capturando la pieza.',
        feedback: '¡Excelente diagonal! El alfil barrió la diagonal y capturó el peón.'
      },
      {
        id: 'ex_4',
        fen: '4r3/8/8/8/8/8/4R3/4K2k w - - 0 1',
        instruction: 'Paso 4 (Captura con Torre): Tu Torre domina la columna "e". Captura la Torre negra en e8 con tu Torre de e2.',
        solution: { from: 'e2', to: 'e8' },
        hint: 'Avanza tu torre por la columna hasta e8 capturando la torre rival.',
        feedback: '¡Captura limpia de Torre! Controlas toda la columna vertical.'
      },
      {
        id: 'ex_5',
        fen: '8/4n3/8/8/8/8/4Q3/4K2k w - - 0 1',
        instruction: 'Paso 5 (Captura con Dama): La Dama tiene máximo poder. Captura el Caballo negro en e7 con tu Dama de e2.',
        solution: { from: 'e2', to: 'e7' },
        hint: 'Lleva tu dama de e2 a e7 capturando el caballo.',
        feedback: '¡Dominio total! Has aprendido a capturar exitosamente con peón, caballo, alfil, torre y dama.'
      }
    ]
  },
  {
    id: 'l03_desprotegidas',
    number: 3,
    title: 'Captura piezas desprotegidas',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'Piezas en el Aire (Colgadas)',
        text: 'Una pieza desprotegida no tiene defensores aliados que la cuiden. Siempre debes estar atento para capturarlas totalmente gratis.',
        fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3'
      },
      {
        id: 'ex_1',
        fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3',
        instruction: 'Paso 1: El caballo negro en c6 está desprotegido. Captúralo con tu Alfil de b5.',
        solution: { from: 'b5', to: 'c6' },
        hint: 'Captura en c6 con tu alfil de b5.',
        feedback: '¡Excelente captura! Ganas un caballo limpio sin que ninguna pieza enemiga te contraataque.'
      },
      {
        id: 'ex_2',
        fen: 'r3k2r/ppp2ppp/8/8/3Q4/8/PPP2PPP/4K2R w Kkq - 0 1',
        instruction: 'Paso 2: Las negras dejaron su peón en g7 completamente desprotegido. Captúralo con tu Dama de d4.',
        solution: { from: 'd4', to: 'g7' },
        hint: 'Lleva tu dama de d4 a g7 capturando el peón.',
        feedback: '¡Gran visión táctica! Capturas el peón y amenazas directamente la torre de h8.'
      },
      {
        id: 'ex_3',
        fen: '4k3/8/8/4n3/8/5N2/8/4K3 w - - 0 1',
        instruction: 'Paso 3: El caballo negro en e5 está solo y sin protección. Captúralo con tu Caballo de f3.',
        solution: { from: 'f3', to: 'e5' },
        hint: 'Captura el caballo en e5 con tu caballo de f3.',
        feedback: '¡Caballo gratis! Has eliminado la pieza enemiga de un solo golpe.'
      },
      {
        id: 'ex_4',
        fen: '4k3/8/8/8/1b6/P7/8/4K3 w - - 0 1',
        instruction: 'Paso 4: El alfil negro en b4 está desprotegido. Captúralo con tu peón de a3.',
        solution: { from: 'a3', to: 'b4' },
        hint: 'Captura en diagonal el alfil de b4 con tu peón en a3.',
        feedback: '¡Ganancia de pieza colgada! Tu peón de 1 punto se come un alfil de 3 puntos.'
      },
      {
        id: 'ex_5',
        fen: '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1',
        instruction: 'Paso 5: La torre negra en d8 no tiene defensor. Captúrala directamente con tu Torre de d2.',
        solution: { from: 'd2', to: 'd8' },
        hint: 'Avanza tu torre por la columna hasta d8 capturando la torre rival.',
        feedback: '¡Captura y jaque mate! Al capturar la pieza desprotegida asestas además el jaque mate del pasillo.'
      }
    ]
  },
  {
    id: 'l04_valor_piezas',
    number: 4,
    title: 'Conoce el valor de las piezas',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'La Escala de Valor FIDE',
        text: 'Peón = 1 pt, Caballo = 3 pts, Alfil = 3 pts, Torre = 5 pts, Dama = 9 pts, Rey = ¡Infinito! Siempre busca capturar piezas de mayor valor.',
        fen: '4r3/4p3/8/8/8/8/4R3/4K2k w - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '4r3/4p3/8/8/8/8/4R3/4K2k w - - 0 1',
        instruction: 'Paso 1: Puedes capturar el peón en e7 (1 pt) o la Torre en e8 (5 pts). Captura la pieza de MAYOR valor con tu Torre.',
        solution: { from: 'e2', to: 'e8' },
        hint: 'Captura la torre negra en e8 con tu torre.',
        feedback: '¡Decisión perfecta! Ganar 5 puntos (Torre) es mucho mejor que ganar 1 punto (Peón).'
      },
      {
        id: 'ex_2',
        fen: '4q3/8/8/4p3/8/5N2/8/4K2k w - - 0 1',
        instruction: 'Paso 2: Tu Caballo (3 pts) puede capturar el peón de e5 (1 pt) o la Dama en e8 (9 pts). ¡Captura la Dama!',
        solution: { from: 'f3', to: 'e8' },
        hint: 'Salta con tu caballo hasta e8 para capturar la Dama rival.',
        feedback: '¡Ganancia monumental de +9 puntos! Has cambiado tu caballo por la pieza más poderosa del rival.'
      },
      {
        id: 'ex_3',
        fen: 'r7/8/8/8/2B5/8/8/4K2k w - - 0 1',
        instruction: 'Paso 3: Gana la calidad capturando la Torre enemiga en a8 (5 pts) con tu Alfil (3 pts).',
        solution: { from: 'c4', to: 'a8' },
        hint: 'Captura la torre en a8 con tu alfil de c4.',
        feedback: '¡Ganancia de calidad! Tu alfil de 3 pts captura una torre de 5 pts (+2 pts de ventaja).'
      },
      {
        id: 'ex_4',
        fen: '8/8/8/2b5/3P4/8/8/4K2k w - - 0 1',
        instruction: 'Paso 4: Tu peón (1 pt) puede capturar el alfil negro (3 pts) en c5. ¡Realiza la captura!',
        solution: { from: 'd4', to: 'c5' },
        hint: 'Captura en diagonal el alfil de c5 con tu peón en d4.',
        feedback: '¡Intercambio super rentable! Ganas 3 puntos entregando sólo 1 peón.'
      },
      {
        id: 'ex_5',
        fen: '3q4/8/8/8/8/8/3R4/4K2k w - - 0 1',
        instruction: 'Paso 5: Captura la Dama rival en d8 (9 pts) con tu Torre (5 pts) para sentenciar la victoria.',
        solution: { from: 'd2', to: 'd8' },
        hint: 'Avanza por la columna hasta d8 capturando la dama.',
        feedback: '¡Maestría en el valor material! Has consolidado una ventaja decisiva en el tablero.'
      }
    ]
  },
  {
    id: 'l05_coronacion',
    number: 5,
    title: 'Promueve tus peones (Coronación)',
    category: 'estrategia',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'La Gran Transformación',
        text: 'Cuando un peón llega a la última fila (la 8ª para blancas, la 1ª para negras), se transforma inmediatamente en Dama, Torre, Alfil o Caballo.',
        fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1',
        instruction: 'Paso 1: Tu peón blanco en e7 ha llegado al final. Avanza a e8 y corónalo en Dama.',
        solution: { from: 'e7', to: 'e8', promotion: 'q' },
        hint: 'Mueve el peón a e8 y corona en Dama.',
        feedback: '¡Corona en Dama con éxito! Ahora tienes una Dama invencible.'
      },
      {
        id: 'ex_2',
        fen: 'k7/P7/8/8/8/8/8/4K3 w - - 0 1',
        instruction: 'Paso 2: Avanza tu peón de a7 a a8 para coronar en Dama y arrinconar al rey negro.',
        solution: { from: 'a7', to: 'a8', promotion: 'q' },
        hint: 'Avanza a a8 coronando en Dama.',
        feedback: '¡Excelente coronación! La nueva Dama controla todo el flanco de dama.'
      },
      {
        id: 'ex_3',
        fen: '5k2/5P2/8/8/8/8/8/4K3 w - - 0 1',
        instruction: 'Paso 3: Avanza tu peón de f7 a f8 coronando en Dama con jaque directo al rey.',
        solution: { from: 'f7', to: 'f8', promotion: 'q' },
        hint: 'Corona en f8 transformando el peón en Dama.',
        feedback: '¡Coronación con jaque! El rey rival no tiene escapatoria.'
      },
      {
        id: 'ex_4',
        fen: '7k/7P/8/8/8/8/8/4K3 w - - 0 1',
        instruction: 'Paso 4: Corona tu peón de h7 a h8 para obtener una Dama decisiva.',
        solution: { from: 'h7', to: 'h8', promotion: 'q' },
        hint: 'Mueve a h8 y corona en Dama.',
        feedback: '¡Brillante! Peón coronado y posición totalmente ganada.'
      },
      {
        id: 'ex_5',
        fen: '4k3/8/8/8/8/8/3p4/4K3 b - - 0 1',
        instruction: 'Paso 5: Juegas con negras. Tu peón en d2 está a punto de coronar. Avanza a d1 y corona en Dama con jaque.',
        solution: { from: 'd2', to: 'd1', promotion: 'q' },
        hint: 'Mueve el peón negro a d1 coronando en Dama.',
        feedback: '¡Gran coronación con negras! Has dominado el concepto de promoción en ambos bandos.'
      }
    ]
  },
  {
    id: 'l06_jaque',
    number: 6,
    title: 'Cómo dar jaque al Rey',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'Amenaza al Monarca',
        text: 'Un jaque ocurre cuando una de tus piezas ataca directamente la casilla donde se encuentra el Rey rival. El rey amenazado debe responder de inmediato.',
        fen: '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1',
        instruction: 'Paso 1 (Jaque con Dama): Avanza tu Dama de e2 a e7 para dar jaque directo al rey en e8.',
        solution: { from: 'e2', to: 'e7' },
        hint: 'Mueve tu dama a e7 dando jaque.',
        feedback: '¡Jaque con Dama! El rey negro está bajo fuego directo.'
      },
      {
        id: 'ex_2',
        fen: '4k3/8/8/8/8/8/R7/4K3 w - - 0 1',
        instruction: 'Paso 2 (Jaque con Torre): Lleva tu Torre de a2 a a8 para dar jaque en la octava fila.',
        solution: { from: 'a2', to: 'a8' },
        hint: 'Avanza la torre por la columna hasta a8.',
        feedback: '¡Jaque con Torre! Toda la 8ª fila queda atacada.'
      },
      {
        id: 'ex_3',
        fen: '4k3/8/8/8/2B5/8/8/4K3 w - - 0 1',
        instruction: 'Paso 3 (Jaque con Alfil): Lleva tu Alfil de c4 a f7 atacando al rey en diagonal.',
        solution: { from: 'c4', to: 'f7' },
        hint: 'Mueve tu alfil de c4 a f7.',
        feedback: '¡Jaque en diagonal! El alfil apunta directamente a la casilla del rey.'
      },
      {
        id: 'ex_4',
        fen: '4k3/8/8/8/8/5N2/8/4K3 w - - 0 1',
        instruction: 'Paso 4 (Jaque con Caballo): Salta con tu Caballo de f3 a e5 para dar jaque en L al rey en e8.',
        solution: { from: 'f3', to: 'g5' },
        hint: 'Lleva tu caballo a e5 o g5 para amenazar al rey.',
        feedback: '¡Jaque de Caballo! Un ataque sorpresivo que no se puede bloquear interponiendo piezas.'
      },
      {
        id: 'ex_5',
        fen: '4k3/8/8/3P4/8/8/8/4K3 w - - 0 1',
        instruction: 'Paso 5 (Jaque con Peón): Avanza tu peón de d5 a d6 amenazando en diagonal al rey en e7 o e8.',
        solution: { from: 'd5', to: 'd6' },
        hint: 'Avanza tu peón a d6.',
        feedback: '¡Jaque con peón! Incluso la pieza más modesta puede poner al rey en apuros.'
      }
    ]
  },
  {
    id: 'l07_escapar_jaque',
    number: 7,
    title: 'Cómo escapar del jaque (C-I-M)',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'La Regla de Oro: C - I - M',
        text: 'Para escapar de un jaque sólo existen 3 formas: 1. C = Capturar la pieza atacante, 2. I = Interponer una pieza entre el atacante y el rey, 3. M = Mover el Rey a una casilla segura.',
        fen: '4k3/4r3/8/8/8/8/4Q3/4K3 b - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '4k3/4r3/8/8/8/8/4Q3/4K3 b - - 0 1',
        instruction: 'Paso 1 (C = Capturar): La Dama blanca en e2 te da jaque. ¡Captúrala con tu Torre en e7!',
        solution: { from: 'e7', to: 'e2' },
        hint: 'Captura la dama en e2 con tu torre.',
        feedback: '¡Excelente! Capturar la pieza atacante es la defensa más contundente.'
      },
      {
        id: 'ex_2',
        fen: '4r1k1/8/8/8/8/8/8/4K2R w K - 0 1',
        instruction: 'Paso 2 (M = Mover el Rey): La torre negra en e8 te da jaque. Mueve tu Rey a una casilla segura en d1 o d2.',
        solution: { from: 'e1', to: 'd2' },
        hint: 'Mueve tu rey a d2 para salir de la línea de jaque.',
        feedback: '¡Rey a salvo! Escapas de la columna atacada.'
      },
      {
        id: 'ex_3',
        fen: '4k3/4r3/8/8/8/8/8/3QK3 b - - 0 1',
        instruction: 'Paso 3 (I = Interponer): La Dama blanca en d1 te da jaque por la columna. Interpón tu Torre de e7 a d7 bloqueando el jaque.',
        solution: { from: 'e7', to: 'd7' },
        hint: 'Mueve tu torre a d7 para interponerla en la columna.',
        feedback: '¡Escudo perfecto! Has interpuesto una pieza salvando a tu monarca.'
      },
      {
        id: 'ex_4',
        fen: 'r1bqk2r/pppp1Qpp/2n5/2b1p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1',
        instruction: 'Paso 4 (C = Capturar): La Dama en f7 da jaque al rey. Captúrala directamente con tu Rey de e8 a f7.',
        solution: { from: 'e8', to: 'f7' },
        hint: 'Captura la dama con tu rey en f7.',
        feedback: '¡Dama neutralizada! Tu rey eliminó personalmente la amenaza.'
      },
      {
        id: 'ex_5',
        fen: '4k3/8/8/8/8/8/8/R3K3 b - - 0 1',
        instruction: 'Paso 5 (M = Mover el Rey): La Torre en a1 da jaque por la fila. Mueve tu Rey a una casilla libre en e7 o d7.',
        solution: { from: 'e8', to: 'e7' },
        hint: 'Mueve tu rey a e7.',
        feedback: '¡Has dominado el C-I-M! Ahora sabes exactamente cómo defenderte de cualquier jaque.'
      }
    ]
  },
  {
    id: 'l08_mate_1',
    number: 8,
    title: 'Jaque mate en 1 movimiento',
    category: 'tactica',
    badge: 'Iniciación',
    steps: [
      {
        type: 'theory',
        title: 'El Fin de la Partida',
        text: 'El Jaque Mate ocurre cuando el Rey rival está en jaque y NO puede Capturar, Interponer ni Mover a ninguna casilla segura. ¡La partida termina con victoria instantánea!',
        fen: '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1'
      },
      {
        id: 'ex_1',
        fen: '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1',
        instruction: 'Paso 1 (Mate del Pasillo): El rey negro está atrapado tras sus peones. Lleva tu Torre de a1 a a8 dando jaque mate.',
        solution: { from: 'a1', to: 'a8' },
        hint: 'Avanza tu torre hasta a8.',
        feedback: '¡Jaque Mate del pasillo! El rey no tiene escapatoria en la 8ª fila.'
      },
      {
        id: 'ex_2',
        fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4',
        instruction: 'Paso 2 (Mate del Pastor): Tu Dama y Alfil apuntan al punto débil f7. Captura en f7 con tu Dama dando Jaque Mate.',
        solution: { from: 'f3', to: 'f7' },
        hint: 'Captura el peón en f7 con tu dama.',
        feedback: '¡Jaque Mate del Pastor! El rey negro no puede capturar porque la Dama está defendida por el Alfil de c4.'
      },
      {
        id: 'ex_3',
        fen: '5rk1/5p1p/6N1/8/8/8/8/4K1R1 w - - 0 1',
        instruction: 'Paso 3 (Mate Árabe): El Caballo en g6 corta la casilla h8. Lleva tu Torre a g8 dando Jaque Mate.',
        solution: { from: 'g1', to: 'g8' },
        hint: 'Lleva tu torre a g8.',
        feedback: '¡Jaque Mate Árabe! Coordinación perfecta entre Torre y Caballo.'
      },
      {
        id: 'ex_4',
        fen: 'k7/8/1K6/8/8/8/8/R7 w - - 0 1',
        instruction: 'Paso 4 (Mate con Torre y Rey): El rey negro está arrinconado en a8. Lleva tu Torre de a1 a a7 o a8 dando Jaque Mate.',
        solution: { from: 'a1', to: 'a8' },
        hint: 'Mueve tu torre a a8.',
        feedback: '¡Jaque Mate! El rey blanco corta todas las casillas de escape.'
      },
      {
        id: 'ex_5',
        fen: 'k7/2B5/1K6/8/8/8/8/8 w - - 0 1',
        instruction: 'Paso 5 (Beso de la Muerte): Con tu Dama en d1, da jaque mate directo en a7 o a8.',
        solution: { from: 'c7', to: 'd6' },
        hint: 'Mueve tu alfil a d6 o d8.',
        feedback: '¡Victoria total! Has completado con éxito 5 patrones esenciales de mate en 1.'
      }
    ]
  }
];
