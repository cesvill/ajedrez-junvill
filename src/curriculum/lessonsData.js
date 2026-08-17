/**
 * Base de Datos Curricular de Ajedrez Junvill (110 Puntos de Aprendizaje)
 * Basada en la Guía Curricular Infantil y Métodos Yusupov, Steps Method y KCF.
 * 
 * 5 Grandes Etapas:
 * - Etapa 1: Dominar los Conceptos Básicos (24 lecciones / 24 pts)
 * - Etapa 2: Táctica Fundamental y Combinaciones (26 lecciones / 26 pts)
 * - Etapa 3: Estrategia y Finales Esenciales (22 lecciones / 22 pts)
 * - Etapa 4: Aperturas y Medio Juego (20 lecciones / 20 pts)
 * - Etapa 5: Maestría Yusupov & Nivel FIDE (18 lecciones / 18 pts)
 * Total = 110 lecciones interactivas con teoría + 5 ejercicios únicos cada una.
 */

export const CURRICULUM_SECTIONS = [
  {
    "id": "etapa-1-basicos",
    "title": "ETAPA 1: DOMINAR LOS CONCEPTOS BÁSICOS (0 - 800 Elo)",
    "category": "basicos",
    "badge": "Iniciación Junvill",
    "eloRange": "0 - 800 Elo",
    "lessons": [
      {
        "id": "l01_piezas",
        "number": 1,
        "title": "Conoce las piezas y sus movimientos",
        "category": "fundamentos",
        "steps": [
          {
            "type": "theory",
            "title": "El Ejército del Tablero",
            "text": "Cada pieza tiene su propio superpoder de movimiento: el Peón avanza hacia el frente, el Caballo salta en \"L\", el Alfil recorre diagonales, la Torre domina filas y columnas, y la Dama combina el poder de la Torre y el Alfil.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Mueve tu peón de rey dos casillas al centro (de e2 a e4).",
            "solution": {
              "from": "e2",
              "to": "e4"
            },
            "hint": "Avanza el peón a e4.",
            "feedback": "¡Excelente! Controlas las casillas centrales d5 y f5."
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Caballo en salto en \"L\" de g1 a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Salta con el caballo a f3.",
            "feedback": "¡Gran salto en \"L\"! El caballo ataca el centro y prepara el enroque."
          },
          {
            "id": "ex_3",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            "instruction": "Paso 3: Desarrolla tu Alfil en diagonal de f1 a c4 apuntando al rey enemigo.",
            "solution": {
              "from": "f1",
              "to": "c4"
            },
            "hint": "Lleva tu alfil a c4.",
            "feedback": "¡Brillante! El alfil controla la gran diagonal a2-g8."
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 4: Mueve tu Torre verticalmente por la columna abierta de a2 a a8.",
            "solution": {
              "from": "a2",
              "to": "a8"
            },
            "hint": "Avanza tu torre por la columna \"a\" hasta a8.",
            "feedback": "¡Poder lineal! Las torres dominan filas y columnas abiertas con gran alcance."
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1",
            "instruction": "Paso 5: Centraliza tu Dama (la pieza más poderosa) moviéndola de e2 a e4.",
            "solution": {
              "from": "e2",
              "to": "e4"
            },
            "hint": "Mueve tu dama de e2 a e4.",
            "feedback": "¡Ataque demoledor! La dama combina el movimiento de la Torre y el Alfil en todas las direcciones."
          }
        ]
      },
      {
        "id": "l02_capturas",
        "number": 2,
        "title": "Captura piezas enemigas",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Arte de la Captura",
            "text": "En el ajedrez capturas ocupando la casilla de la pieza enemiga y retirándola de la partida. ¡Practiquemos capturar con cada una de tus piezas!",
            "fen": "8/8/8/3p4/4P3/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/3p4/4P3/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1 (Captura con Peón): Los peones capturan un paso en diagonal. Captura el peón negro en d5 con tu peón de e4.",
            "solution": {
              "from": "e4",
              "to": "d5"
            },
            "hint": "Mueve en diagonal de e4 a d5 capturando el peón.",
            "feedback": "¡Excelente captura con peón! Has eliminado la pieza enemiga ganando el centro."
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/4p3/8/5N2/8/4K2k w - - 0 1",
            "instruction": "Paso 2 (Captura con Caballo): Tu caballo salta en L. Captura el peón negro en e5 con tu Caballo de f3.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Salta de f3 a e5 capturando el peón.",
            "feedback": "¡Gran salto! El caballo captura exactamente en la casilla de aterrizaje de su L."
          },
          {
            "id": "ex_3",
            "fen": "8/5p2/8/8/2B5/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3 (Captura con Alfil): Tu Alfil se desplaza en diagonal. Captura el peón enemigo en f7 con tu Alfil de c4.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Desliza tu alfil de c4 a f7 capturando la pieza.",
            "feedback": "¡Diagonal perfecta! El alfil barrió la diagonal y capturó el peón."
          },
          {
            "id": "ex_4",
            "fen": "4r3/8/8/8/8/8/4R3/4K2k w - - 0 1",
            "instruction": "Paso 4 (Captura con Torre): Tu Torre domina la columna \"e\". Captura la Torre negra en e8 con tu Torre de e2.",
            "solution": {
              "from": "e2",
              "to": "e8"
            },
            "hint": "Avanza tu torre por la columna hasta e8 capturando la torre rival.",
            "feedback": "¡Captura limpia de Torre! Controlas toda la columna vertical."
          },
          {
            "id": "ex_5",
            "fen": "8/4n3/8/8/8/8/4Q3/4K2k w - - 0 1",
            "instruction": "Paso 5 (Captura con Dama): La Dama tiene máximo poder. Captura el Caballo negro en e7 con tu Dama de e2.",
            "solution": {
              "from": "e2",
              "to": "e7"
            },
            "hint": "Lleva tu dama de e2 a e7 capturando el caballo.",
            "feedback": "¡Dominio total! Has aprendido a capturar exitosamente con peón, caballo, alfil, torre y dama."
          }
        ]
      },
      {
        "id": "l03_desprotegidas",
        "number": 3,
        "title": "Captura piezas desprotegidas",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Piezas en el Aire (Colgadas)",
            "text": "Una pieza desprotegida no tiene defensores aliados que la cuiden. Siempre debes estar atento para capturarlas totalmente gratis.",
            "fen": "r1bqkbnr/pppp1ppp/8/4n3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pppp1ppp/8/4n3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
            "instruction": "Paso 1: El caballo negro en e5 saltó al centro y no tiene defensores (está colgado). Captúralo con tu Caballo de f3.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Salta de f3 a e5 capturando el caballo desprotegido.",
            "feedback": "¡Caballo gratis! Al no tener defensores, ganas 3 puntos limpios sin que el rival pueda recapturar."
          },
          {
            "id": "ex_2",
            "fen": "r1bqk1nr/pppp1ppp/2n5/4p3/4P2b/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            "instruction": "Paso 2: Las negras dejaron su Alfil en h4 completamente solo e indefenso. Captúralo con tu Caballo de f3.",
            "solution": {
              "from": "f3",
              "to": "h4"
            },
            "hint": "Mueve tu caballo de f3 a h4 capturando el alfil colgado.",
            "feedback": "¡Alfil capturado gratis! Has eliminado la pieza desprotegida."
          },
          {
            "id": "ex_3",
            "fen": "r3k3/8/8/8/4B3/8/8/4K3 w - - 0 1",
            "instruction": "Paso 3: La torre negra en a8 está olvidada en la esquina sin defensores. Captúrala con tu Alfil en diagonal.",
            "solution": {
              "from": "e4",
              "to": "a8"
            },
            "hint": "Desliza tu alfil de e4 a a8 capturando la torre desprotegida.",
            "feedback": "¡Torre limpia de 5 puntos! Gran visión de piezas colgadas."
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/1b6/P7/8/4K3 w - - 0 1",
            "instruction": "Paso 4: El alfil negro en b4 está desprotegido. Captúralo con tu peón de a3.",
            "solution": {
              "from": "a3",
              "to": "b4"
            },
            "hint": "Captura en diagonal el alfil de b4 con tu peón en a3.",
            "feedback": "¡Ganancia de pieza colgada! Tu peón de 1 punto se come un alfil de 3 puntos gratis."
          },
          {
            "id": "ex_5",
            "fen": "r1b1kbnr/pppp1ppp/8/3q4/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 1",
            "instruction": "Paso 5: Las negras sacaron su Dama a d5 prematuramente y nadie la defiende. ¡Captura la Dama con tu Caballo en c3 o con tu peón de e4!",
            "solution": {
              "from": "c3",
              "to": "d5"
            },
            "hint": "Captura la dama en d5 con tu caballo o con tu peón.",
            "feedback": "¡Dama de 9 puntos gratis! Lección dominada: siempre castiga las piezas desprotegidas.",
            "alternativeSolutions": [
              {
                "from": "e4",
                "to": "d5",
                "feedback": "¡Excelente captura con el peón! Matar la Dama en d5 con tu peón (exd5) es totalmente ganador y te da una ventaja colosal (+9 puntos)."
              }
            ]
          }
        ]
      },
      {
        "id": "l04_valor_piezas",
        "number": 4,
        "title": "Conoce el valor de las piezas y los intercambios ventajosos",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Escala de Valor y los Intercambios",
            "text": "Cada pieza tiene un valor relativo:\n• Peón = 1 punto\n• Caballo = 3 puntos\n• Alfil = 3 puntos\n• Torre = 5 puntos\n• Dama = 9 puntos\n• Rey = ¡Infinito!\n\nEn ajedrez siempre vale la pena sacrificar una pieza de menor valor para capturar una de mayor valor (por ejemplo: entregar un peón de 1 pt o un alfil de 3 pts para capturar una Dama de 9 pts o una Torre de 5 pts).",
            "fen": "r1b1kbnr/p1pp1ppp/1p6/1p1q4/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1b1kbnr/p1pp1ppp/1p6/1p1q4/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1",
            "instruction": "Paso 1 (Elegir la pieza más valiosa): Tu Caballo (3 pts) puede capturar el peón en b5 (1 pt) o la Dama en d5 (9 pts). ¡Decide capturar la pieza más valiosa!",
            "solution": {
              "from": "c3",
              "to": "d5"
            },
            "hint": "Captura la Dama en d5 con tu caballo.",
            "feedback": "¡Decisión magistral! Capturar la Dama te otorga +9 puntos en vez de solo 1 punto del peón.",
            "incorrectFeedback": {
              "c3-b5": "¡Cuidado! El peón de b5 solo vale 1 punto. Tu Caballo podía capturar la Dama en d5 (9 puntos). En ajedrez siempre priorizamos la pieza de mayor valor."
            }
          },
          {
            "id": "ex_2",
            "fen": "r1b1kbnr/ppp2ppp/3p4/4q3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 2 (Sacrificio favorable: Peón por Dama): La Dama negra en e5 está defendida por su peón de d6. Sacrifica tu peón de d4 (1 pt) capturando la Dama (9 pts) sabiendo que el peón negro te recapturará.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura la Dama en e5 con tu peón.",
            "feedback": "¡Intercambio super favorable! Aunque el peón negro de d6 recaptura en e5 (dxe5), ganaste una Dama de 9 puntos entregando solo 1 peón (+8 de ganancia neta)."
          },
          {
            "id": "ex_3",
            "fen": "5rk1/5rpp/8/8/2B5/8/4PPPP/4K2R w K - 0 1",
            "instruction": "Paso 3 (Ganancia de Calidad: Alfil por Torre): Entrega tu Alfil de c4 (3 pts) para capturar la Torre enemiga en f7 (5 pts).",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura la torre en f7 con tu alfil.",
            "feedback": "¡Ganancia de calidad (+2 pts)! Entregar una pieza menor (3 pts) a cambio de una Torre (5 pts) es una ventaja táctica excelente."
          },
          {
            "id": "ex_4",
            "fen": "3qkb1r/4pppp/8/8/8/8/3R4/4K2R w Kk - 0 1",
            "instruction": "Paso 4 (Sacrificio de Pieza Mayor: Torre por Dama): Sacrifica tu Torre en d2 (5 pts) para devorar la Dama rival en d8 (9 pts).",
            "solution": {
              "from": "d2",
              "to": "d8"
            },
            "hint": "Avanza por la columna hasta d8 capturando la Dama.",
            "feedback": "¡Sacrificio rentable (+4 pts)! Entregas 5 puntos para arrebatar la pieza más temible del adversario."
          },
          {
            "id": "ex_5",
            "fen": "r1b1kbnr/ppp2ppp/3p4/2n1q3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 5 (Doble ataque: elegir el botín supremo): Tu peón en d4 ataca tanto al Caballo en c5 (3 pts) como a la Dama en e5 (9 pts), ambos defendidos por el peón de d6. ¡Decide capturar la pieza de mayor valor!",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura la Dama en e5 con tu peón.",
            "feedback": "¡Maestría en la escala de valores! Capturaste la Dama (9 pts) logrando +8 pts netos en lugar del caballo (+2 pts netos).",
            "incorrectFeedback": {
              "d4-c5": "¡El caballo en c5 solo vale 3 puntos! Tu peón también podía capturar la Dama en e5 (9 puntos). En ajedrez siempre elegimos la presa de mayor valor."
            }
          }
        ]
      },
      {
        "id": "l05_coronacion",
        "number": 5,
        "title": "Promueve tus peones (Coronación)",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Gran Transformación",
            "text": "Cuando un peón llega a la última fila con el apoyo de tus piezas, corona inmediatamente en Dama protegida para asegurar la victoria.",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 1: Tu peón en e7 avanza a e8 para coronar en Dama protegida por tu Torre de e2.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Mueve el peón a e8 y corona en Dama.",
            "feedback": "¡Corona en Dama protegida! Tu torre de e2 defiende a la nueva Dama, por lo que el rey negro no puede capturarla."
          },
          {
            "id": "ex_2",
            "fen": "1k6/P7/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 2: Corona tu peón de a7 a a8 en Dama con el respaldo de tu Torre en a2.",
            "solution": {
              "from": "a7",
              "to": "a8",
              "promotion": "q"
            },
            "hint": "Avanza a a8 coronando en Dama.",
            "feedback": "¡Excelente coronación protegida! La nueva Dama está defendida y el rey negro no puede tocarla."
          },
          {
            "id": "ex_3",
            "fen": "k7/1PK5/8/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 3: Corona tu peón en b8 con Jaque Mate asistido por tu Rey en c7.",
            "solution": {
              "from": "b7",
              "to": "b8",
              "promotion": "q"
            },
            "hint": "Corona en b8 transformando el peón en Dama.",
            "feedback": "¡Coronación con Jaque Mate! El rey negro está acorralado y la Dama está blindada por el rey."
          },
          {
            "id": "ex_4",
            "fen": "6k1/7P/8/8/8/8/7R/4K3 w - - 0 1",
            "instruction": "Paso 4: Corona tu peón de h7 a h8 obteniendo una Dama defendida por tu Torre en h2.",
            "solution": {
              "from": "h7",
              "to": "h8",
              "promotion": "q"
            },
            "hint": "Mueve a h8 y corona en Dama.",
            "feedback": "¡Brillante! Peón coronado, defendido y posición totalmente ganada."
          },
          {
            "id": "ex_5",
            "fen": "4k3/3r4/8/8/8/8/3p4/4K3 b - - 0 1",
            "instruction": "Paso 5: Juegas con negras. Corona tu peón en d1 con jaque defendido por tu Torre en d7.",
            "solution": {
              "from": "d2",
              "to": "d1",
              "promotion": "q"
            },
            "hint": "Mueve el peón negro a d1 coronando en Dama.",
            "feedback": "¡Gran coronación con negras! Tu Dama en d1 está blindada por tu torre en d7."
          }
        ]
      },
      {
        "id": "l06_jaque",
        "number": 6,
        "title": "Cómo dar jaque al Rey",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Amenaza al Monarca",
            "text": "Un jaque ocurre cuando una de tus piezas ataca directamente al Rey rival. El rival está obligado a responder de inmediato para salvar a su rey.",
            "fen": "4k3/8/8/8/8/8/8/3Q2K1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/8/3Q2K1 w - - 0 1",
            "instruction": "Paso 1 (Jaque a Distancia con Dama): Mueve tu Dama para dar jaque al Rey negro en e8 desde una casilla segura a distancia.",
            "solution": {
              "from": "d1",
              "to": "e2"
            },
            "alternativeSolutions": [
              {
                "from": "d1",
                "to": "a4",
                "feedback": "¡Excelente jaque diagonal! Desde a4 tu Dama apunta directamente al Rey sin ponerse en peligro."
              },
              {
                "from": "d1",
                "to": "h5",
                "feedback": "¡Magnífico jaque diagonal! Desde h5 tu Dama amenaza al Rey a larga distancia con total seguridad."
              },
              {
                "from": "d1",
                "to": "e1",
                "feedback": "¡Bien jugado! Llevas la Dama a e1 dando jaque vertical por la columna e."
              }
            ],
            "incorrectFeedback": {
              "d1-d7": "¡Cuidado! En d7 pones tu Dama justo al lado del Rey negro y te la capturará gratis (Rxd7). Da jaque a distancia segura.",
              "d1-d8": "¡Cuidado! En d8 el Rey negro capturará tu Dama desprotegida (Rxd8). Busca dar jaque desde casillas seguras como e2, a4 o h5."
            },
            "hint": "Puedes colocar tu Dama en e2 para dar jaque vertical, o en a4 / h5 para dar jaque diagonal a distancia.",
            "feedback": "¡Jaque seguro con Dama! Has amenazado directamente al Rey rival manteniéndote fuera de su alcance."
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 2 (Jaque con Torre): Mueve tu Torre de a2 para dar jaque al Rey negro en e8.",
            "solution": {
              "from": "a2",
              "to": "a8"
            },
            "alternativeSolutions": [
              {
                "from": "a2",
                "to": "e2",
                "feedback": "¡Muy bien! Llevas la Torre a la columna 'e' (e2) dando jaque vertical al Rey."
              }
            ],
            "hint": "Puedes avanzar la torre por la columna hasta a8 (jaque de fila) o colocarla en e2 (jaque de columna).",
            "feedback": "¡Jaque con Torre! Toda la 8ª fila queda atacada a distancia segura."
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/8/2B5/8/8/4K3 w - - 0 1",
            "instruction": "Paso 3 (Jaque con Alfil): Lleva tu Alfil a b5 dando jaque en diagonal desde una distancia segura.",
            "solution": {
              "from": "c4",
              "to": "b5"
            },
            "incorrectFeedback": {
              "c4-f7": "¡Cuidado! En f7 el alfil da jaque pero está desprotegido y el Rey negro lo capturará (Rxf7). Juega a b5 para dar jaque a distancia segura."
            },
            "hint": "Mueve tu alfil de c4 a b5 para apuntar al Rey por la diagonal sin exponerte.",
            "feedback": "¡Jaque diagonal seguro! El alfil apunta al rey sin ponerse a tiro de captura."
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/4N3/8/8/4K3 w - - 0 1",
            "instruction": "Paso 4 (Jaque con Caballo): Salta con tu Caballo para asestar un jaque directo al Rey en e8.",
            "solution": {
              "from": "e4",
              "to": "d6"
            },
            "alternativeSolutions": [
              {
                "from": "e4",
                "to": "f6",
                "feedback": "¡Excelente! Desde f6 tu Caballo también asesta un jaque en 'L' que no se puede bloquear."
              }
            ],
            "hint": "El caballo puede saltar en 'L' a d6 o a f6 para atacar directamente a e8.",
            "feedback": "¡Jaque de Caballo legítimo! Un ataque sorpresivo en \"L\" que no se puede bloquear."
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/3P4/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 5 (Jaque con Peón): Avanza tu peón de d6 a d7 atacando directamente al Rey negro en diagonal.",
            "solution": {
              "from": "d6",
              "to": "d7"
            },
            "hint": "Avanza tu peón a d7.",
            "feedback": "¡Jaque con peón! Incluso la pieza más modesta pone en jaque directo al rey."
          }
        ]
      },
      {
        "id": "l07_escapar_jaque",
        "number": 7,
        "title": "Cómo escapar del jaque (C-I-M)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Regla de Oro: C - I - M",
            "text": "Para escapar de un jaque sólo existen 3 formas: 1. C = Capturar la pieza atacante, 2. I = Interponer una pieza entre el atacante y el rey, 3. M = Mover el Rey a una casilla segura.",
            "fen": "4k3/4r3/8/8/8/8/4Q3/2K5 b - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/4r3/8/8/8/8/4Q3/2K5 b - - 0 1",
            "instruction": "Paso 1 (C = Capturar): La Dama blanca en e2 te da jaque. ¡Captúrala gratis con tu Torre en e7!",
            "solution": {
              "from": "e7",
              "to": "e2"
            },
            "hint": "Captura la dama en e2 con tu torre.",
            "feedback": "¡Excelente! Capturar la pieza atacante elimina el peligro ganando la Dama rival (+9 pts)."
          },
          {
            "id": "ex_2",
            "fen": "4r1k1/8/8/8/8/8/8/4K2R w K - 0 1",
            "instruction": "Paso 2 (M = Mover el Rey): La torre negra en e8 te da jaque. Mueve tu Rey a una casilla segura en d2.",
            "solution": {
              "from": "e1",
              "to": "d2"
            },
            "alternativeSolutions": [
              {
                "from": "e1",
                "to": "f1",
                "feedback": "¡Rey a salvo! Escapas del jaque moviendo tu Rey a f1."
              },
              {
                "from": "e1",
                "to": "f2",
                "feedback": "¡Rey a salvo! Escapas de la columna atacada moviendo a f2."
              },
              {
                "from": "e1",
                "to": "d1",
                "feedback": "¡Rey a salvo! Escapas de la columna atacada moviendo a d1."
              }
            ],
            "hint": "Mueve tu rey a cualquier casilla libre fuera de la columna 'e' (d1, d2, f1 o f2).",
            "feedback": "¡Rey a salvo! Escapas de la columna atacada."
          },
          {
            "id": "ex_3",
            "fen": "3k4/4r3/8/8/8/8/8/3QK3 b - - 0 1",
            "instruction": "Paso 3 (I = Interponer): La Dama blanca en d1 da jaque a tu Rey en d8. Interpón tu Torre de e7 a d7 como escudo para bloquear el jaque.",
            "solution": {
              "from": "e7",
              "to": "d7"
            },
            "alternativeSolutions": [
              {
                "from": "d8",
                "to": "c7",
                "feedback": "¡También es válido! Has escapado del jaque moviendo tu rey a c7."
              },
              {
                "from": "d8",
                "to": "c8",
                "feedback": "¡También es válido! Has escapado del jaque moviendo tu rey a c8."
              },
              {
                "from": "d8",
                "to": "e8",
                "feedback": "¡También es válido! Has escapado del jaque moviendo tu rey a e8."
              }
            ],
            "hint": "Mueve tu torre a d7 para interponerla en la columna y bloquear el jaque.",
            "feedback": "¡Escudo perfecto! Has interpuesto tu torre en d7 salvando a tu monarca."
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1Qpp/2n5/4p3/4P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1",
            "instruction": "Paso 4 (C = Capturar): La Dama desprotegida en f7 da jaque al rey. Captúrala directamente con tu Rey de e8 a f7.",
            "solution": {
              "from": "e8",
              "to": "f7"
            },
            "hint": "Captura la dama con tu rey en f7.",
            "feedback": "¡Dama neutralizada! Tu rey eliminó personalmente la amenaza."
          },
          {
            "id": "ex_5",
            "fen": "R3k3/8/8/8/8/8/8/4K3 b - - 0 1",
            "instruction": "Paso 5 (M = Mover el Rey): La Torre en a8 da jaque en la octava fila. Mueve tu Rey a una casilla segura en la 7ª fila (e7, d7 o f7).",
            "solution": {
              "from": "e8",
              "to": "e7"
            },
            "alternativeSolutions": [
              {
                "from": "e8",
                "to": "d7",
                "feedback": "¡Muy bien! Escapas del jaque de la octava fila moviendo tu Rey a d7."
              },
              {
                "from": "e8",
                "to": "f7",
                "feedback": "¡Muy bien! Escapas del jaque de la octava fila moviendo tu Rey a f7."
              }
            ],
            "hint": "Mueve tu rey a una casilla libre como e7, d7 o f7.",
            "feedback": "¡Has dominado el C-I-M! Ahora sabes exactamente cómo defenderte de cualquier jaque."
          }
        ]
      },
      {
        "id": "l08_mate_1",
        "number": 8,
        "title": "Jaque mate en 1 movimiento",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Fin de la Partida",
            "text": "El Jaque Mate ocurre cuando el Rey rival está en jaque y NO puede Capturar, Interponer ni Mover a ninguna casilla segura. ¡La partida termina con victoria instantánea!",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 1 (Mate del Pasillo): El rey negro está atrapado tras sus peones. Lleva tu Torre de a1 a a8 dando jaque mate.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Avanza tu torre hasta a8.",
            "feedback": "¡Jaque Mate del pasillo! El rey no tiene escapatoria en la 8ª fila."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4",
            "instruction": "Paso 2 (Mate del Pastor): Tu Dama y Alfil apuntan al punto débil f7. Captura en f7 con tu Dama dando Jaque Mate.",
            "solution": {
              "from": "f3",
              "to": "f7"
            },
            "hint": "Captura el peón en f7 con tu dama.",
            "feedback": "¡Jaque Mate del Pastor! El rey negro no puede capturar porque la Dama está defendida por el Alfil de c4.",
            "incorrectFeedback": {
              "c4-f7": "¡Axf7+ da jaque, pero NO es jaque mate porque el rey negro puede huir a e7! Para asestar Jaque Mate en 1, debes usar la Dama en f7 (Dxf7#) defendida por el Alfil."
            }
          },
          {
            "id": "ex_3",
            "fen": "7k/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1",
            "instruction": "Paso 3 (Mate Árabe): El Caballo en f6 apoya a la Torre. Lleva tu Torre de g1 a g8 dando Jaque Mate.",
            "solution": {
              "from": "g1",
              "to": "g8"
            },
            "hint": "Lleva tu torre a g8.",
            "feedback": "¡Jaque Mate Árabe! Coordinación perfecta entre Torre y Caballo."
          },
          {
            "id": "ex_4",
            "fen": "k7/8/1K6/8/8/8/8/7R w - - 0 1",
            "instruction": "Paso 4 (Mate con Torre y Rey): El rey negro está arrinconado en a8. Lleva tu Torre de h1 a h8 dando Jaque Mate.",
            "solution": {
              "from": "h1",
              "to": "h8"
            },
            "hint": "Mueve tu torre a h8.",
            "feedback": "¡Jaque Mate! El rey blanco corta todas las casillas de escape."
          },
          {
            "id": "ex_5",
            "fen": "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
            "instruction": "Paso 5: Asesta el golpe definitivo llevando tu Torre a la octava fila dando Jaque Mate.",
            "solution": {
              "from": "e1",
              "to": "e8"
            },
            "hint": "Mueve tu torre a e8 dando mate.",
            "feedback": "¡Victoria total! Has completado con éxito 5 patrones esenciales de mate en 1."
          }
        ]
      },
      {
        "id": "l09_rey_ahogado",
        "number": 9,
        "title": "El peligro del rey ahogado (Tablas)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Cuidado con el Ahogado",
            "text": "El rey ahogado ocurre cuando el bando al que le toca mover NO está en jaque pero NO tiene ninguna jugada legal. La partida termina en TABLAS (empate). ¡Aprende a evitarlo al ganar o provocarlo para salvarte!",
            "fen": "k7/8/1K6/8/8/8/8/8 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1",
            "instruction": "Paso 1: Mueve tu Dama a h7 para preparar el mate en la siguiente sin ahogar al rey rival.",
            "solution": {
              "from": "b1",
              "to": "h7"
            },
            "hint": "Mueve la dama a h7.",
            "feedback": "¡Excelente! Dejas espacio para que el rey negro mueva y luego rematas con mate."
          },
          {
            "id": "ex_2",
            "fen": "1k6/7Q/1K6/8/8/8/8/8 w - - 1 2",
            "instruction": "Paso 2: Ahora que el rey negro está en b8, da Jaque Mate llevando tu Dama a b7.",
            "solution": {
              "from": "h7",
              "to": "b7"
            },
            "hint": "Mueve tu dama a b7 dando mate.",
            "feedback": "¡Jaque Mate limpio! Evitaste el ahogado y aseguraste la victoria."
          },
          {
            "id": "ex_3",
            "fen": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
            "instruction": "Paso 3: Con Rey y Torre, aleja tu Torre a h1 para permitir que el rey negro mueva a b8 antes del mate.",
            "solution": {
              "from": "b1",
              "to": "h1"
            },
            "hint": "Mueve tu torre a h1.",
            "feedback": "¡Maniobra precisa! Evitas el ahogado inmediato."
          },
          {
            "id": "ex_4",
            "fen": "1k6/8/1K6/8/8/8/8/7R w - - 1 2",
            "instruction": "Paso 4: El rey negro fue a b8. Da Jaque Mate en la octava fila llevando tu Torre a h8.",
            "solution": {
              "from": "h1",
              "to": "h8"
            },
            "hint": "Lleva tu torre a h8.",
            "feedback": "¡Jaque Mate perfecto con Torre y Rey!"
          },
          {
            "id": "ex_5",
            "fen": "k7/8/2K5/8/8/8/8/1Q6 w - - 0 1",
            "instruction": "Paso 5: En esta posición el jaque mate en 1 es directo. Lleva tu Dama a b7.",
            "solution": {
              "from": "b1",
              "to": "b7"
            },
            "hint": "Lleva tu dama a b7 dando mate.",
            "feedback": "¡Lección dominada! Nunca regales unas tablas por descuido con el rey ahogado."
          }
        ]
      },
      {
        "id": "l10_enroque",
        "number": 10,
        "title": "Enroque corto y enroque largo",
        "category": "posicional",
        "steps": [
          {
            "type": "theory",
            "title": "El Castillo del Rey",
            "text": "El enroque es la única jugada donde mueves dos piezas a la vez (el Rey y la Torre). Protege a tu Rey y activa tu Torre hacia el centro.",
            "fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4"
          },
          {
            "id": "ex_1",
            "fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
            "instruction": "Paso 1: Realiza el Enroque Corto con blancas llevando a tu Rey de e1 a g1.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey dos casillas a g1 para enrocar corto.",
            "feedback": "¡Enroque Corto perfecto! Tu rey queda protegido tras los peones y tu torre de h1 pasa a f1."
          },
          {
            "id": "ex_2",
            "fen": "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4",
            "instruction": "Paso 2: Juegas con negras. Realiza también el Enroque Corto llevando a tu Rey de e8 a g8.",
            "solution": {
              "from": "e8",
              "to": "g8"
            },
            "hint": "Mueve el rey negro de e8 a g8.",
            "feedback": "¡Rey negro seguro! Ambos bandos han completado su enroque corto."
          },
          {
            "id": "ex_3",
            "fen": "r3kbnr/pppqpppp/2n5/3p4/3P4/2N5/PPPQPPPP/R3KBNR w KQkq - 0 5",
            "instruction": "Paso 3: Realiza el Enroque Largo con blancas llevando a tu Rey de e1 a c1.",
            "solution": {
              "from": "e1",
              "to": "c1"
            },
            "hint": "Mueve tu rey a c1 para el enroque largo.",
            "feedback": "¡Enroque Largo magistral! Tu torre de a1 entra directo a la columna central d1."
          },
          {
            "id": "ex_4",
            "fen": "r3kbnr/pppqpppp/2n5/3p4/3P4/2N5/PPPQPPPP/2KR1BNR b kq - 1 5",
            "instruction": "Paso 4: Juegas con negras. Realiza el Enroque Largo negro de e8 a c8.",
            "solution": {
              "from": "e8",
              "to": "c8"
            },
            "hint": "Lleva el rey negro de e8 a c8.",
            "feedback": "¡Enroque largo completado! Gran dinamismo para las piezas mayores."
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5",
            "instruction": "Paso 5: Consolida tu partida realizando el Enroque Corto de e1 a g1.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey en el castillo! Has aprendido los dos tipos de enroque a la perfección."
          }
        ]
      },
      {
        "id": "l11_al_paso",
        "number": 11,
        "title": "La regla del peón al paso",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "¿Por qué capturar en una casilla vacía? (El Peón al Paso)",
            "text": "En el ajedrez normal, los peones solo comen en diagonal si hay una pieza enemiga ahí. ¡Pero el Peón al Paso (En Passant) es la ÚNICA excepción de todo el juego! Cuando el peón negro intenta 'escapar' saltando 2 casillas de f7 a f5 y se pone a tu lado, la regla dice: ¡no se vale escapar de un peón en 5ª fila! Mueves tu peón blanco a la casilla vacía f6 (la que él saltó) y, como por arte de magia, ¡el peón negro de f5 queda capturado y desaparece del tablero!",
            "fen": "4k3/8/8/4Pp2/8/8/8/4K3 w - f6 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/4Pp2/8/8/8/4K3 w - f6 0 1",
            "instruction": "Paso 1: El peón negro saltó 2 casillas (f7 a f5) para ponerse a tu lado. ¡Atrápalo al paso! Mueve tu peón de e5 a la casilla vacía f6 (con el aro rojo). Al pisar f6, ¡el peón negro de f5 desaparecerá capturado!",
            "solution": {
              "from": "e5",
              "to": "f6"
            },
            "hint": "Mueve tu peón blanco a la casilla vacía f6 (detrás del peón negro). ¡Verás cómo desaparece el peón de f5!",
            "feedback": "¡Magia del ajedrez! Al pisar la casilla f6, el peón negro de f5 ha sido capturado al paso."
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/3Pp3/8/8/8/4K3 w - e6 0 1",
            "instruction": "Paso 2: Las negras intentaron escapar jugando e7 a e5 junto a tu peón de d5. ¡Mueve de d5 a la casilla vacía e6 para capturar al paso el peón de e5!",
            "solution": {
              "from": "d5",
              "to": "e6"
            },
            "hint": "Mueve tu peón blanco de d5 a la casilla vacía e6.",
            "feedback": "¡Excelente En Passant! El peón negro de e5 ha sido eliminado al saltar la casilla e6."
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/2pP4/8/8/8/4K3 w - c6 0 1",
            "instruction": "Paso 3: Las negras jugaron c7 a c5 junto a tu peón de d5. ¡Mueve de d5 a la casilla vacía c6 para capturar al paso el peón de c5!",
            "solution": {
              "from": "d5",
              "to": "c6"
            },
            "hint": "Mueve tu peón de d5 a la casilla vacía c6.",
            "feedback": "¡Gran captura al paso! Desbaratas el flanco de dama enemigo."
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1",
            "instruction": "Paso 4: Juegas con negras. Las blancas avanzaron su peón de e2 a e4 dos pasos junto a tu peón de d4. ¡Mueve de d4 a la casilla vacía e3 para capturar al paso el peón de e4!",
            "solution": {
              "from": "d4",
              "to": "e3"
            },
            "hint": "Mueve el peón negro de d4 a la casilla vacía e3.",
            "feedback": "¡Captura al paso con negras! Creas un peón pasado camino al triunfo."
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/2Pp4/8/8/8/4K3 w - d6 0 1",
            "instruction": "Paso 5: Las negras jugaron d7 a d5 junto a tu peón de c5. ¡Mueve de c5 a la casilla vacía d6 para capturar al paso el peón de d5 y abrir camino a coronar!",
            "solution": {
              "from": "c5",
              "to": "d6"
            },
            "hint": "Mueve tu peón blanco de c5 a la casilla vacía d6.",
            "feedback": "¡Regla del peón al paso dominada al 100%! Nunca olvidarás este recurso táctico."
          }
        ]
      },
      {
        "id": "l12_ataque_doble_peon",
        "number": 12,
        "title": "Ataque doble elemental con peón (Horquilla)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Horquilla de Peón",
            "text": "Un peón que avanza protegido y amenaza simultáneamente a dos piezas enemigas en sus diagonales crea un ataque doble (horquilla). Como el peón vale menos, ¡el rival perderá una de sus dos piezas!",
            "fen": "r1bqk2r/ppp2ppp/2nb1n2/8/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/ppp2ppp/2nb1n2/8/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Avanza tu peón central de e4 a e5 para hacer una horquilla protegida por d3, atacando al Caballo en f6 y al Alfil en d6.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Avanza a e5 con el peón para atacar a ambas piezas a la vez.",
            "feedback": "¡Horquilla de Peón demoledora! Las negras no pueden salvar ambas piezas menores a la vez."
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/ppp2ppp/4b1n1/8/5P2/6P1/PPP1P2P/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 2: Avanza tu peón de f4 a f5 con apoyo de tu peón de g3, haciendo horquilla al Alfil en e6 y al Caballo en g6.",
            "solution": {
              "from": "f4",
              "to": "f5"
            },
            "hint": "Mueve el peón a f5. Si el alfil te captura, lo recapturarás con tu peón de g3.",
            "feedback": "¡Doble amenaza perfecta! Al estar protegido por g3, ganarás una pieza en el intercambio."
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/ppp2ppp/1n1n4/8/2P5/1P6/P2PPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 3: Avanza tu peón de c4 a c5 con apoyo de b3, atacando a los dos Caballos negros en b6 y d6.",
            "solution": {
              "from": "c4",
              "to": "c5"
            },
            "hint": "Avanza a c5 con el peón para amenazar ambos caballos.",
            "feedback": "¡Doble horquilla de caballos! Uno de los dos caballos caerá inexorablemente."
          },
          {
            "id": "ex_4",
            "fen": "2r1k3/8/3P4/2P5/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 4: Avanza tu peón de d6 a d7 con jaque al Rey negro en e8 y atacando a la Torre en c8.",
            "solution": {
              "from": "d6",
              "to": "d7"
            },
            "hint": "Avanza a d7 dando jaque al Rey y amenazando a la Torre.",
            "feedback": "¡Jaque y horquilla magistral! El Rey debe moverse y capturarás la Torre en la siguiente jugada."
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/ppp2ppp/4p3/3p4/2B1N3/8/PPP2PPP/R1BQK2R b KQkq - 0 1",
            "instruction": "Paso 5: Juegas con negras. Avanza tu peón de d5 a d4 para hacer una horquilla protegida por e6, atacando al Alfil en c4 y al Caballo en e4.",
            "solution": {
              "from": "d5",
              "to": "d4"
            },
            "hint": "Avanza tu peón negro a d4 para atacar ambas piezas blancas.",
            "feedback": "¡Horquilla de peón ejecutada con negras! Has dominado el ataque doble con peones a la perfección."
          }
        ]
      },
      {
        "id": "l13_mate_pasillo",
        "number": 13,
        "title": "El jaque mate del pasillo",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Trampa de la 8ª Fila",
            "text": "Cuando el rey está encerrado detrás de su propia barrera de peones sin casilla de escape, una Torre o Dama en la última fila da un mate fulminante.",
            "fen": "3r2k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3r2k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
            "instruction": "Paso 1: La torre negra en d8 defiende, pero tu Torre en e1 penetra en la 8ª fila dando jaque.",
            "solution": {
              "from": "e1",
              "to": "e8"
            },
            "hint": "Lleva tu torre a e8.",
            "feedback": "¡Penetración en 8ª fila! Obligas a la torre rival a bloquear."
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 2: El rey negro no tiene aire. Lleva tu Torre de a1 a a8 dando Jaque Mate directo.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Jaque Mate del pasillo clásico! Los peones f7-g7-h7 impiden el escape."
          },
          {
            "id": "ex_3",
            "fen": "6k1/ppp2ppp/8/8/8/8/8/3Q2K1 w - - 0 1",
            "instruction": "Paso 3: Lleva tu Dama de d1 a d8 para dar jaque mate del pasillo en la 8ª fila.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Mueve tu dama a d8.",
            "feedback": "¡Dama en la 8ª fila! Jaque mate inapelable."
          },
          {
            "id": "ex_4",
            "fen": "2r3k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1",
            "instruction": "Paso 4: Captura la Torre negra en c8 con tu Torre de c1 para dar jaque mate del pasillo.",
            "solution": {
              "from": "c1",
              "to": "c8"
            },
            "hint": "Captura en c8 con tu torre.",
            "feedback": "¡Captura y Mate! Se acaba la partida."
          },
          {
            "id": "ex_5",
            "fen": "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1",
            "instruction": "Paso 5: Remata la posición llevando tu Torre de e1 a e8 dando Jaque Mate.",
            "solution": {
              "from": "e1",
              "to": "e8"
            },
            "hint": "Mueve tu torre a e8.",
            "feedback": "¡Patrón del pasillo dominado al 100%!"
          }
        ]
      },
      {
        "id": "l14_mate_dama_rey",
        "number": 14,
        "title": "Jaque mate de Dama y Rey",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Cerrar la Caja",
            "text": "Para dar mate con Dama y Rey debes usar la Dama para acorralar al Rey enemigo en una banda (cerrando una caja imaginaria) y luego acercar tu Rey para apoyar el mate.",
            "fen": "4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1",
            "instruction": "Paso 1: Coloca tu Dama a salto de caballo en e6 para acorralar al rey rival en la 8ª fila.",
            "solution": {
              "from": "e2",
              "to": "e6"
            },
            "hint": "Mueve tu dama a e6.",
            "feedback": "¡Caja reducida con seguridad! La dama corta la 7ª fila sin exponerse."
          },
          {
            "id": "ex_2",
            "fen": "4k3/4Q3/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 2: Ahora acerca tu Rey de e1 a e2 para apoyar a tu Dama.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza con tu rey a e2.",
            "feedback": "¡Marcha del Rey! El rey viene a escoltar a la Dama."
          },
          {
            "id": "ex_3",
            "fen": "4k3/4Q3/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 3: Continúa avanzando tu Rey a e4 para preparar el mate.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡El rey blanco se aproxima al centro!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/4Q3/8/8/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Da un paso más con tu Rey a e5 para colocarte en oposición frente al rey negro.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Lleva el rey a e5.",
            "feedback": "¡Oposición lograda! La Dama tiene el apoyo necesario."
          },
          {
            "id": "ex_5",
            "fen": "4k3/Q7/4K3/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Asesta el Jaque Mate definitivo (el Beso de la Muerte) con tu Dama en e7 defendida por tu Rey.",
            "solution": {
              "from": "a7",
              "to": "e7"
            },
            "hint": "Mueve tu dama a e7 dando mate.",
            "feedback": "¡Jaque Mate perfecto! Técnica de Dama y Rey dominada."
          }
        ]
      },
      {
        "id": "l15_mate_torre_rey",
        "number": 15,
        "title": "Jaque mate de Torre y Rey",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "El Corte de Fila y la Oposición",
            "text": "A diferencia de la Dama, la Torre necesita obligatoriamente el apoyo del Rey frente a frente (oposición) para quitar casillas y empujar al rey rival hacia el borde.",
            "fen": "4k3/8/8/8/8/8/R7/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 1: Corta al rey negro en la 7ª fila llevando tu Torre de a2 a a7.",
            "solution": {
              "from": "a2",
              "to": "a7"
            },
            "hint": "Lleva tu torre a a7.",
            "feedback": "¡Corte de fila! El rey negro queda confinado a la 8ª fila."
          },
          {
            "id": "ex_2",
            "fen": "4k3/R7/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 2: Acerca tu Rey de e1 a e2 hacia el centro.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡El rey blanco se suma al ataque!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/R7/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 3: Continúa avanzando tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Paso firme hacia el frente!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/R7/8/8/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Lleva tu Rey a e5 para controlar las casillas de escape.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Avanza a e5.",
            "feedback": "¡Posición de mate lista!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/R7/4K3/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Con los reyes en oposición directa, lleva tu Torre de a7 a a8 dando Jaque Mate.",
            "solution": {
              "from": "a7",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Jaque Mate de Torre y Rey! Un final fundamental en ajedrez competitivo."
          }
        ]
      },
      {
        "id": "l16_clavada_absoluta",
        "number": 16,
        "title": "La clavada absoluta sobre el Rey",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Inmovilidad Total",
            "text": "Una pieza está en clavada absoluta cuando se interpone directamente ante su propio Rey. ¡Las reglas prohíben mover una pieza en clavada absoluta!",
            "fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
            "instruction": "Paso 1: El caballo negro en c6 está clavado por tu alfil. Captúralo con tu Alfil de b5.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Explotación de la clavada! Ganas material destruyendo la estructura negra."
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/4n3/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 2: El caballo negro en e5 está clavado frente a su Rey. Captúralo con tu Torre de e2.",
            "solution": {
              "from": "e2",
              "to": "e5"
            },
            "hint": "Captura el caballo en e5 con la torre.",
            "feedback": "¡Pieza clavada pieza ganada! El caballo no podía huir."
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/4b3/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 3: El alfil negro en e6 está clavado absolutamente frente a su rey. Captúralo con tu Torre.",
            "solution": {
              "from": "e2",
              "to": "e6"
            },
            "hint": "Captura el alfil en e6.",
            "feedback": "¡Alfil clavado eliminado!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/4q3/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 4: La Dama negra en e6 está clavada por tu Torre en la columna abierta. Captúrala.",
            "solution": {
              "from": "e2",
              "to": "e6"
            },
            "hint": "Captura la dama en e6 con la torre.",
            "feedback": "¡Ganancia de Dama limpia gracias a la clavada!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/7r/8/8/8/2B5/8/4K3 w - - 0 1",
            "instruction": "Paso 5: La torre negra en h8 está en la diagonal de tu Alfil. Captúrala en h8.",
            "solution": {
              "from": "c3",
              "to": "h8"
            },
            "hint": "Captura en h8 con tu alfil.",
            "feedback": "¡Clavadas dominadas al máximo!"
          }
        ]
      },
      {
        "id": "l17_clavada_relativa",
        "number": 17,
        "title": "La clavada relativa",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Clavada sobre Pieza Mayor",
            "text": "En la clavada relativa la pieza no está clavada sobre el Rey sino sobre una pieza de mayor valor (como la Dama o Torre). Si se mueve, ¡perderá la pieza mayor!",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Clava al caballo negro en f6 sobre su Dama en d8 llevando tu Alfil de c1 a g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Clavada relativa perfecta! El caballo negro no se atreverá a moverse."
          },
          {
            "id": "ex_2",
            "fen": "r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/2N2N2/PPPP1bPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Captura el alfil negro en f2 con tu Rey de e1.",
            "solution": {
              "from": "e1",
              "to": "f2"
            },
            "hint": "Captura el alfil en f2.",
            "feedback": "¡Eliminación del atacante!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 3: Captura el caballo en e4 con tu Caballo en c3.",
            "solution": {
              "from": "c3",
              "to": "e4"
            },
            "hint": "Captura en e4.",
            "feedback": "¡Intercambio favorable!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Desclava tu caballo de c3 moviendo tu Dama a e2.",
            "solution": {
              "from": "d1",
              "to": "e2"
            },
            "hint": "Lleva tu dama a e2.",
            "feedback": "¡Desclavada y consolidación!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/4p1B1/1bB1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 1",
            "instruction": "Paso 5: Captura el caballo clavado en f6 con tu Alfil de g5.",
            "solution": {
              "from": "g5",
              "to": "f6"
            },
            "hint": "Captura en f6 con tu alfil.",
            "feedback": "¡Ruptura táctica con ganancia!"
          }
        ]
      },
      {
        "id": "l18_horquilla_caballo",
        "number": 18,
        "title": "La horquilla o doblete de Caballo",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Salto Mortal",
            "text": "El Caballo es el rey de las horquillas porque ataca en 8 casillas diferentes saltando por encima de las piezas sin poder ser bloqueado.",
            "fen": "r3k2r/ppp2ppp/2n5/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r3k2r/ppp2ppp/2n5/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1",
            "instruction": "Paso 1: Salta a c7 con tu Caballo haciendo horquilla sobre el Rey en e8 y la Torre en a8.",
            "solution": {
              "from": "d5",
              "to": "c7"
            },
            "hint": "Lleva tu caballo a c7.",
            "feedback": "¡Doble Real seguro! Jaque al rey y captura de torre garantizada sin que nadie te capture."
          },
          {
            "id": "ex_2",
            "fen": "r3k2r/ppp2ppp/8/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1",
            "instruction": "Paso 2: Repite la horquilla en c7 amenazando al rey y la torre.",
            "solution": {
              "from": "d5",
              "to": "c7"
            },
            "hint": "Lleva tu caballo a c7.",
            "feedback": "¡Doble Real! Jaque al rey y captura de torre garantizada."
          },
          {
            "id": "ex_3",
            "fen": "r3k2r/ppp2ppp/2n5/8/4N3/8/PPP2PPP/R3K2R w KQkq - 0 1",
            "instruction": "Paso 3: Centraliza tu Caballo a c5 atacando el flanco de dama.",
            "solution": {
              "from": "e4",
              "to": "c5"
            },
            "hint": "Mueve tu caballo a c5.",
            "feedback": "¡Caballo central dominante!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/2N5/8/8/5K2/7r w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Caballo a e4.",
            "solution": {
              "from": "c5",
              "to": "e4"
            },
            "hint": "Mueve tu caballo a e4.",
            "feedback": "¡Caballo central activo!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 5: Captura el caballo negro en e4 con tu Caballo de c3.",
            "solution": {
              "from": "c3",
              "to": "e4"
            },
            "hint": "Captura en e4 con el caballo.",
            "feedback": "¡Horquillas y caballos dominados!"
          }
        ]
      },
      {
        "id": "l19_enfilada_skewer",
        "number": 19,
        "title": "La enfilada o ataque por rayos directos (Skewer)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Brocheta de Piezas",
            "text": "La enfilada (Skewer) es el reverso de la clavada: atacas una pieza valiosa que está AL FRENTE (como el Rey o Dama); cuando se mueve, ¡capturas la pieza detrás!",
            "fen": "4k2r/8/8/8/8/8/8/R3K3 w Qk - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k2r/8/8/8/8/8/8/R3K3 w Qk - 0 1",
            "instruction": "Paso 1: Da jaque al rey en a8 con tu Torre; cuando el rey se mueva, capturarás la torre en h8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Enfilada perfecta! El rey debe huir y la torre en h8 caerá."
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/8/R3K2r w Q - 0 1",
            "instruction": "Paso 2: La torre negra en h1 te da enfilada. Mueve tu Rey a d2.",
            "solution": {
              "from": "e1",
              "to": "d2"
            },
            "hint": "Mueve tu rey a d2.",
            "feedback": "¡Rey escapa a salvo!"
          },
          {
            "id": "ex_3",
            "fen": "r3k3/8/8/8/8/8/8/4K2R w Kq - 0 1",
            "instruction": "Paso 3: Lleva tu Torre de h1 a h8 para dar jaque enfilando al rey y a la torre en a8.",
            "solution": {
              "from": "h1",
              "to": "h8"
            },
            "hint": "Mueve tu torre a h8.",
            "feedback": "¡Brocheta ganadora! Ganas la torre en a8."
          },
          {
            "id": "ex_4",
            "fen": "8/k7/8/8/8/8/1B6/4K2r w - - 0 1",
            "instruction": "Paso 4: Mueve tu Rey a f2 protegiéndolo de los jaques.",
            "solution": {
              "from": "e1",
              "to": "f2"
            },
            "hint": "Lleva el rey a f2.",
            "feedback": "¡Rey seguro!"
          },
          {
            "id": "ex_5",
            "fen": "8/k7/8/8/8/8/5B2/4K2r w - - 0 1",
            "instruction": "Paso 5: Interpón tu Alfil en g1 tapando el jaque.",
            "solution": {
              "from": "f2",
              "to": "g1"
            },
            "hint": "Mueve el alfil a g1.",
            "feedback": "¡Enfiladas asimiladas con éxito!"
          }
        ]
      },
      {
        "id": "l20_ataque_descubierta",
        "number": 20,
        "title": "El ataque a la descubierta",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Cañón Oculto",
            "text": "Ocurre cuando mueves una pieza y al quitarla LIBERAS el ataque de otra pieza de largo alcance que estaba detrás de ella. ¡Una emboscada mortal!",
            "fen": "r1bqk2r/pppp1ppp/2n5/4N3/1bB1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/4N3/1bB1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Salta con tu Caballo a f7 atacando la Dama y Torre descubriendo el ataque de tu Alfil sobre el rey.",
            "solution": {
              "from": "e5",
              "to": "f7"
            },
            "hint": "Mueve tu caballo a f7.",
            "feedback": "¡Ataque a la descubierta doble!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 2: Captura en e4 con tu Caballo abriendo la columna \"d\".",
            "solution": {
              "from": "c3",
              "to": "e4"
            },
            "hint": "Captura en e4.",
            "feedback": "¡Línea abierta!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2BP4/5N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 3: Captura en e5 con tu peón abriendo la diagonal de tu alfil.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura en e5.",
            "feedback": "¡Ataque descubierto potente!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/8/4n3/2BP4/8/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Captura el caballo en e5 con tu peón en d4.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura en e5.",
            "feedback": "¡Ganancia limpia!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/8/4N3/1b1P4/8/PPP2PPP/RNBQKB1R w KQkq - 0 1",
            "instruction": "Paso 5: Bloquea el jaque avanzando tu peón a c3 atacando al alfil.",
            "solution": {
              "from": "c2",
              "to": "c3"
            },
            "hint": "Mueve el peón a c3.",
            "feedback": "¡Emboscadas a la descubierta dominadas!"
          }
        ]
      },
      {
        "id": "l21_jaque_descubierta",
        "number": 21,
        "title": "El jaque a la descubierta",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Jaque Sorpresivo",
            "text": "Al mover una pieza descubres un jaque directo al rey rival desde una Torre, Alfil o Dama. Tu pieza que se mueve puede capturar lo que quiera impunemente.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/4n3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/4n3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1",
            "instruction": "Paso 1: Salta con tu Caballo a c6 dando jaque descubierto con la Dama y capturando la Dama rival en la siguiente.",
            "solution": {
              "from": "e5",
              "to": "c6"
            },
            "hint": "Mueve tu caballo a c6.",
            "feedback": "¡Jaque a la descubierta letal! Ganarás la dama negra en d8."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/8/4N3/8/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1",
            "instruction": "Paso 2: Mueve tu Caballo a c6 descubriendo jaque de Dama.",
            "solution": {
              "from": "e5",
              "to": "c6"
            },
            "hint": "Lleva tu caballo a c6.",
            "feedback": "¡Jaque descubierto demoledor!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/8/4N3/3b4/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1",
            "instruction": "Paso 3: Salta a c6 con tu caballo dando jaque descubierto.",
            "solution": {
              "from": "e5",
              "to": "c6"
            },
            "hint": "Mueve el caballo a c6.",
            "feedback": "¡Imparable!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/8/8/3bN3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1",
            "instruction": "Paso 4: Salta a d6 dando jaque descubierto.",
            "solution": {
              "from": "e4",
              "to": "d6"
            },
            "hint": "Lleva tu caballo a d6.",
            "feedback": "¡Ganancia total!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/8/8/3BN3/8/PPP1QPPP/RN2KB1R w KQkq - 0 1",
            "instruction": "Paso 5: Remata la posición con jaque descubierto en f6.",
            "solution": {
              "from": "e4",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Jaque a la descubierta dominado!"
          }
        ]
      },
      {
        "id": "l22_jaque_doble",
        "number": 22,
        "title": "El jaque doble",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Golpe Más Devastador",
            "text": "Ocurre cuando DOS piezas dan jaque AL MISMO TIEMPO al Rey enemigo. ¡No se puede interponer ni capturar a ambas piezas a la vez! El Rey está OBLIGADO a moverse.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1",
            "instruction": "Paso 1: Salta a c6 con tu Caballo dando jaque con Caballo y con Dama simultáneamente (jaque doble).",
            "solution": {
              "from": "e5",
              "to": "c6"
            },
            "hint": "Lleva tu caballo a c6.",
            "feedback": "¡Jaque Doble letal! Las negras no pueden bloquear ni capturar, el rey debe huir."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/8/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1",
            "instruction": "Paso 2: Salta a g6 dando jaque doble de Dama y Caballo.",
            "solution": {
              "from": "e5",
              "to": "g6"
            },
            "hint": "Mueve tu caballo a g6.",
            "feedback": "¡Doble jaque imparable!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkb1r/pppp1ppp/8/4N3/2BB4/8/PPPPQPPP/RN2K2R w KQkq - 0 1",
            "instruction": "Paso 3: Salta a f7 dando jaque doble de Caballo y Alfil.",
            "solution": {
              "from": "e5",
              "to": "f7"
            },
            "hint": "Mueve el caballo a f7.",
            "feedback": "¡Mate o ganancia de dama inmediata!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkb1r/pppp1ppp/8/8/2BBn3/8/PPPPQPPP/RN2K2R w KQkq - 0 1",
            "instruction": "Paso 4: Clava el caballo en e4 con tu peón en d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Presión absoluta!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/8/8/2BB4/3P4/PPP1QPPP/RN2K2R w KQkq - 0 1",
            "instruction": "Paso 5: Mueve tu alfil a c5 controlando diagonales.",
            "solution": {
              "from": "d4",
              "to": "c5"
            },
            "hint": "Lleva tu alfil a c5.",
            "feedback": "¡Jaque doble y combinaciones al 100%!"
          }
        ]
      },
      {
        "id": "l23_ataque_doble_dama",
        "number": 23,
        "title": "El ataque doble con Dama",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Reina de las Horquillas",
            "text": "La Dama puede amenazar simultáneamente dos piezas rivales separadas en cualquier rincón del tablero gracias a su inmenso radio de acción.",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 1: Lleva tu Dama a h5 atacando el peón central en e5 y el punto débil f7 a la vez.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Ataque doble de Dama! Creas múltiples amenazas simultáneas."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 1",
            "instruction": "Paso 2: Interpón tu Caballo en e7 bloqueando el jaque de Dama.",
            "solution": {
              "from": "c6",
              "to": "e7"
            },
            "hint": "Mueve tu caballo a e7.",
            "feedback": "¡Defensa correcta!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
            "instruction": "Paso 3: Mueve tu Dama a b3 atacando b7 y f7 a la vez.",
            "solution": {
              "from": "f3",
              "to": "b3"
            },
            "hint": "Lleva tu dama a b3.",
            "feedback": "¡Doble ataque a puntos débiles!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P1Q1/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
            "instruction": "Paso 4: Retira tu Dama a f3 preparando amenazas sobre f7.",
            "solution": {
              "from": "g4",
              "to": "f3"
            },
            "hint": "Mueve la dama a f3.",
            "feedback": "¡Batería Dama y Alfil lista!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
            "instruction": "Paso 5: Asesta el Jaque Mate en f7 con tu Dama.",
            "solution": {
              "from": "f3",
              "to": "f7"
            },
            "hint": "Captura en f7 con tu dama.",
            "feedback": "¡Ataques dobles de Dama dominados!"
          }
        ]
      },
      {
        "id": "l24_mate_pastor",
        "number": 24,
        "title": "El mate del pastor y cómo defenderlo",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Trampa Más Famosa",
            "text": "El Mate del Pastor intenta ganar en 4 jugadas atacando f7 con Dama y Alfil. ¡Aprende a ejecutarlo contra novatos y a castigarlo como un Gran Maestro!",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
            "instruction": "Paso 1: Desarrolla tu Alfil a c4 apuntando directamente al peón débil de f7.",
            "solution": {
              "from": "f1",
              "to": "c4"
            },
            "hint": "Lleva tu alfil a c4.",
            "feedback": "¡Alfil activo! Apuntas al talón de Aquiles de las negras en f7."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 1 3",
            "instruction": "Paso 2: Lleva tu Dama a h5 amenazando jaque mate en f7 en la siguiente jugada.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Amenaza de Mate del Pastor en f7!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 2 3",
            "instruction": "Paso 3 (Defensa Magistral): Juegas con negras. Defiende el mate avanzando tu peón a g6 atacando la Dama.",
            "solution": {
              "from": "g7",
              "to": "g6"
            },
            "hint": "Avanza el peón a g6.",
            "feedback": "¡Bloqueo perfecto! Neutralizas el mate y obligas a la Dama blanca a perder un tiempo."
          },
          {
            "id": "ex_4",
            "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
            "instruction": "Paso 4: Las blancas insisten con Dama en f3. Desarrolla tu Caballo a f6 defendiendo y ganando desarrollo.",
            "solution": {
              "from": "h5",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Doble barrera infranqueable! Las blancas han perdido tiempos valiosos."
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 1 5",
            "instruction": "Paso 5: Desarrolla tu Caballo a e2 para continuar tu juego sano.",
            "solution": {
              "from": "g1",
              "to": "e2"
            },
            "hint": "Mueve el caballo a e2.",
            "feedback": "¡Graduación de Etapa 1 Completada con Éxito!"
          }
        ]
      }
    ]
  },
  {
    "id": "etapa-2-tactica",
    "title": "ETAPA 2: TÁCTICA FUNDAMENTAL Y COMBINACIONES (800 - 1200 Elo)",
    "category": "tactica",
    "badge": "Táctica Junvill",
    "eloRange": "800 - 1200 Elo",
    "lessons": [
      {
        "id": "l25_sobrecarga",
        "number": 25,
        "title": "La pieza sobrecargada",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Exceso de Responsabilidades",
            "text": "Una pieza está sobrecargada cuando debe defender dos o más objetivos críticos al mismo tiempo. Al atacar uno de ellos, el otro queda indefenso.",
            "fen": "r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K1NR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K1NR w KQkq - 0 1",
            "instruction": "Paso 1: El peón de f7 defiende al rey pero está sobrecargado. Captura en f7 con tu Dama.",
            "solution": {
              "from": "f3",
              "to": "f7"
            },
            "hint": "Captura en f7 con tu dama.",
            "feedback": "¡Ataque a la debilidad sobrecargada! Ganancia decisiva."
          },
          {
            "id": "ex_2",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1",
            "instruction": "Paso 2: La torre negra en d8 está sobrecargada defendiendo el mate del pasillo. Captúrala.",
            "solution": {
              "from": "d2",
              "to": "d8"
            },
            "hint": "Captura en d8 con tu torre.",
            "feedback": "¡Sobrecarga explotada! Jaque mate del pasillo."
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Captura el caballo en e4 con tu peón en d3.",
            "solution": {
              "from": "d3",
              "to": "e4"
            },
            "hint": "Captura en e4.",
            "feedback": "¡Intercambio ganador!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Mueve tu Dama a e2 para clavar al caballo.",
            "solution": {
              "from": "d1",
              "to": "e2"
            },
            "hint": "Lleva tu dama a e2.",
            "feedback": "¡Presión táctica sobre la pieza!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 5: Captura el caballo en c6 eliminando el defensor del peón central.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Sobrecargas y defensores dominados!"
          }
        ]
      },
      {
        "id": "l26_pieza_atrapada",
        "number": 26,
        "title": "La pieza atrapada o encerrada",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Sin Casillas de Escape",
            "text": "Una pieza activa que penetra en territorio rival sin vías de retorno puede quedar completamente atrapada y cazada con peones o piezas menores.",
            "fen": "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Avanza tu peón a b4 atacando al Alfil negro en a5.",
            "solution": {
              "from": "b2",
              "to": "b4"
            },
            "hint": "Avanza el peón a b4.",
            "feedback": "¡Alfil encerrado! El alfil negro se queda sin diagonales seguras."
          },
          {
            "id": "ex_2",
            "fen": "r1bqk1nr/pppp1ppp/2n5/1b2p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Captura el alfil en b5 con tu Alfil de c4.",
            "solution": {
              "from": "c4",
              "to": "b5"
            },
            "hint": "Captura en b5 con el alfil.",
            "feedback": "¡Pieza atrapada eliminada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 3: Captura el alfil negro en b4 con tu peón en c3.",
            "solution": {
              "from": "c3",
              "to": "b4"
            },
            "hint": "Captura en b4 con el peón.",
            "feedback": "¡Ganancia material neta!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/1bn5/8/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Avanza tu peón central a d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Centro dominante y piezas rivales limitadas!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/1bn5/4p3/3PP3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1",
            "instruction": "Paso 5: Avanza a d5 con el peón para asfixiar al caballo negro.",
            "solution": {
              "from": "d4",
              "to": "d5"
            },
            "hint": "Mueve el peón a d5.",
            "feedback": "¡Atrapamiento y dominio posicional!"
          }
        ]
      },
      {
        "id": "l27_despeje_casillas",
        "number": 27,
        "title": "Despeje de casillas",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Ceder el Paso a la Gloria",
            "text": "A veces una de tus piezas estorba la casilla óptima donde otra pieza más contundente daría jaque mate o ganaría la partida. ¡Despéjala con energía!",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Sacrifica tu Alfil en f7 dando jaque para liberar casillas para tu Dama.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Despeje violento! El rey negro pierde el enroque."
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1Bpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 2: Mueve el rey negro a e7.",
            "solution": {
              "from": "e8",
              "to": "e7"
            },
            "hint": "Mueve el rey a e7.",
            "feedback": "¡Rey descolocado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2",
            "instruction": "Paso 3: Expulsa al caballo negro avanzando d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Líneas abiertas para el ataque blanco!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1b1r/ppppkBpp/2n5/4N3/4P3/8/PPP2PPP/RNBQK2R w KQ - 0 1",
            "instruction": "Paso 4: Lleva tu Alfil a g5 dando jaque al rey en e7.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Ataque coordinado decisivo!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1b1r/ppppkBpp/2n5/6B1/4P3/8/PPP2PPP/RN1QK2R b KQ - 1 1",
            "instruction": "Paso 5: Captura el alfil en f7 con el rey.",
            "solution": {
              "from": "e7",
              "to": "f7"
            },
            "hint": "Captura en f7 con el rey.",
            "feedback": "¡Despejes y ataques fulminantes!"
          }
        ]
      },
      {
        "id": "l28_despeje_lineas",
        "number": 28,
        "title": "Despeje de líneas o columnas",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Abrir la Autopista",
            "text": "Consiste en avanzar o cambiar un peón o pieza menor para abrir de par en par una columna o diagonal para las piezas pesadas.",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 1: Captura en e4 con tu Caballo abriendo la columna \"d\".",
            "solution": {
              "from": "c3",
              "to": "e4"
            },
            "hint": "Captura en e4 con el caballo.",
            "feedback": "¡Columna semiabierta lista para la Dama!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/3PN3/5N2/PPP2PPP/R1BQKB1R b KQkq - 0 1",
            "instruction": "Paso 2: Captura en d4 con el peón negro.",
            "solution": {
              "from": "e5",
              "to": "d4"
            },
            "hint": "Captura en d4.",
            "feedback": "¡Centro abierto!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/8/3pN3/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 3: Recaptura en d4 con tu Caballo en f3.",
            "solution": {
              "from": "f3",
              "to": "d4"
            },
            "hint": "Captura en d4 con el caballo.",
            "feedback": "¡Pieza centralizada con líneas abiertas!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/8/8/3nN3/8/PPP2PPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 4: Captura el caballo en d4 con tu Dama dominando el centro.",
            "solution": {
              "from": "d1",
              "to": "d4"
            },
            "hint": "Captura en d4 con tu dama.",
            "feedback": "¡Dama en el centro con total control!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/8/8/3QN3/8/PPP2PPP/R1B1KB1R b KQkq - 0 1",
            "instruction": "Paso 5: Enroca corto con negras para poner a tu Rey a salvo.",
            "solution": {
              "from": "e8",
              "to": "g8"
            },
            "hint": "Enroca corto de e8 a g8.",
            "feedback": "¡Líneas despejadas!"
          }
        ]
      },
      {
        "id": "l29_intercepcion_lineas",
        "number": 29,
        "title": "Intercepción de líneas",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Cortar la Comunicación",
            "text": "Interponer una pieza en la intersección de dos líneas defensivas enemigas para cortar la protección mutua entre sus piezas.",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Desarrolla tu Alfil a d2 interceptando la clavada del alfil negro sobre tu caballo.",
            "solution": {
              "from": "c1",
              "to": "d2"
            },
            "hint": "Mueve tu alfil a d2.",
            "feedback": "¡Intercepción defensiva! Tu caballo queda libre de ataduras."
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/2bP1N2/PPPB1PPP/R2QK2R w KQkq - 0 1",
            "instruction": "Paso 2: Captura en c3 con tu peón en b2.",
            "solution": {
              "from": "b2",
              "to": "c3"
            },
            "hint": "Captura en c3 con el peón.",
            "feedback": "¡Estructura reforzada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/2PP1N2/P1PB1PPP/R2QK2R b KQkq - 0 1",
            "instruction": "Paso 3: Avanza tu peón a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa sólida!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/P1PB1PPP/R2QK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey protegido!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/P1PB1PPP/R2Q1RK1 b - - 0 1",
            "instruction": "Paso 5: Clava el caballo en f3 con tu Alfil en g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Intercepción y desarrollo!"
          }
        ]
      },
      {
        "id": "l30_rayos_x",
        "number": 30,
        "title": "Rayos X tácticos",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Ver a Través de las Piezas",
            "text": "Los Rayos X permiten a una pieza de largo alcance (Dama, Torre, Alfil) ejercer presión o defensa a través de una pieza enemiga o aliada.",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1",
            "instruction": "Paso 1: Tu Torre en d2 ejerce rayos X sobre la 8ª fila. Captura en d8 dando mate.",
            "solution": {
              "from": "d2",
              "to": "d8"
            },
            "hint": "Captura en d8 con tu torre.",
            "feedback": "¡Rayos X demoledores! Ganancia de partida."
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
            "instruction": "Paso 2: Lleva tu Torre de d1 a d8 dando Jaque Mate.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Mueve la torre a d8.",
            "feedback": "¡Mate del pasillo ejecutado!"
          },
          {
            "id": "ex_3",
            "fen": "8/5p2/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Acerca tu Rey a f2.",
            "solution": {
              "from": "e1",
              "to": "f2"
            },
            "hint": "Mueve el rey a f2.",
            "feedback": "¡Final ganado!"
          },
          {
            "id": "ex_4",
            "fen": "8/5p2/8/8/8/8/5K2/7k w - - 1 2",
            "instruction": "Paso 4: Avanza con tu Rey a g3.",
            "solution": {
              "from": "f2",
              "to": "g3"
            },
            "hint": "Lleva el rey a g3.",
            "feedback": "¡Rey arrincona al rival!"
          },
          {
            "id": "ex_5",
            "fen": "8/5p2/8/8/8/6K1/8/7k w - - 2 3",
            "instruction": "Paso 5: Coloca tu Rey en h3.",
            "solution": {
              "from": "g3",
              "to": "h3"
            },
            "hint": "Mueve el rey a h3.",
            "feedback": "¡Rayos X y técnica de finales dominada!"
          }
        ]
      },
      {
        "id": "l31_jaque_perpetuo",
        "number": 31,
        "title": "Jaque perpetuo como salvación",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Recurso del Náufrago",
            "text": "Cuando estás en desventaja de material pero el Rey enemigo no puede escapar de una serie interminable de jaques, puedes forzar TABLAS por jaque continuo.",
            "fen": "6k1/5ppp/8/8/8/8/5q2/7K b - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/8/8/5q2/7K b - - 0 1",
            "instruction": "Paso 1: Juegas con negras. Da jaque en f1 con tu Dama.",
            "solution": {
              "from": "f2",
              "to": "f1"
            },
            "hint": "Mueve tu dama a f1.",
            "feedback": "¡Primer jaque salvador!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/5q1K w - - 1 2",
            "instruction": "Paso 2: El rey blanco se ve obligado a mover a h2.",
            "solution": {
              "from": "h1",
              "to": "h2"
            },
            "hint": "Mueve el rey a h2.",
            "feedback": "¡Rey obligado a moverse!"
          },
          {
            "id": "ex_3",
            "fen": "6k1/5ppp/8/8/8/8/8/5q1K b - - 1 2",
            "instruction": "Paso 3: Da jaque con Dama en h3.",
            "solution": {
              "from": "f1",
              "to": "h3"
            },
            "hint": "Mueve tu dama a h3.",
            "feedback": "¡Jaque continuo! El rey no tiene refugio."
          },
          {
            "id": "ex_4",
            "fen": "6k1/5ppp/8/8/8/8/7K/7q w - - 1 1",
            "instruction": "Paso 4: Mueve tu Rey a g3.",
            "solution": {
              "from": "h2",
              "to": "g3"
            },
            "hint": "Mueve el rey a g3.",
            "feedback": "¡Rey bajo asedio!"
          },
          {
            "id": "ex_5",
            "fen": "6k1/5ppp/8/8/8/6K1/8/7q b - - 2 1",
            "instruction": "Paso 5: Da jaque en g2 forzando las tablas por repetición.",
            "solution": {
              "from": "h1",
              "to": "g2"
            },
            "hint": "Mueve tu dama a g2.",
            "feedback": "¡Tablas salvadas por Jaque Perpetuo!"
          }
        ]
      },
      {
        "id": "l32_ahogado_salvador",
        "number": 32,
        "title": "Ahogado como recurso salvador",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Trinchera Inexpugnable",
            "text": "Entregar tus últimas piezas activas para quedar sin jugadas legales en una posición donde NO estás en jaque salva medio punto milagroso.",
            "fen": "k7/8/1K6/8/8/8/8/7R w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "k7/8/1K6/8/8/8/8/7R w - - 0 1",
            "instruction": "Paso 1: Da Jaque Mate en h8 con tu Torre.",
            "solution": {
              "from": "h1",
              "to": "h8"
            },
            "hint": "Lleva tu torre a h8.",
            "feedback": "¡Mate limpio!"
          },
          {
            "id": "ex_2",
            "fen": "8/k7/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 2: Corta en la 7ª fila con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a7"
            },
            "hint": "Mueve la torre a a7.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_3",
            "fen": "8/Rk6/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 3: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza el rey a e2.",
            "feedback": "¡Rey en marcha!"
          },
          {
            "id": "ex_4",
            "fen": "8/Rk6/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 4: Continúa a e4 con tu Rey.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Mueve el rey a e4.",
            "feedback": "¡Rey centralizado!"
          },
          {
            "id": "ex_5",
            "fen": "8/Rk6/4K3/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Da Jaque Mate en a8.",
            "solution": {
              "from": "a7",
              "to": "a8"
            },
            "hint": "Lleva la torre a a8.",
            "feedback": "¡Técnica de ahogado y mate asimilada!"
          }
        ]
      },
      {
        "id": "l33_atraccion",
        "number": 33,
        "title": "Sacrificio de atracción",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Cebo Irresistible",
            "text": "Sacrificar material para forzar al Rey o Dama enemigo a situarse en una casilla fatal donde recibirá un doblete, clavada o jaque mate.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Atrae al rey negro a f7 sacrificando tu Alfil.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con tu alfil.",
            "feedback": "¡Atracción mortal! El rey negro queda en campo abierto."
          },
          {
            "id": "ex_2",
            "fen": "r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2",
            "instruction": "Paso 2: Lleva tu Dama a h5 con jaque al rey.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Ataque coordinado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3",
            "instruction": "Paso 3: Retira tu Dama a h4.",
            "solution": {
              "from": "h5",
              "to": "h4"
            },
            "hint": "Mueve tu dama a h4.",
            "feedback": "¡Presión continua!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3",
            "instruction": "Paso 4: Juegas con negras. Defiende con g6-g5.",
            "solution": {
              "from": "g6",
              "to": "g5"
            },
            "hint": "Avanza el peón a g5.",
            "feedback": "¡Defensa activa!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4",
            "instruction": "Paso 5: Captura el caballo en e4 con tu Dama.",
            "solution": {
              "from": "h4",
              "to": "e4"
            },
            "hint": "Captura en e4 con la dama.",
            "feedback": "¡Atracción y victoria total!"
          }
        ]
      },
      {
        "id": "l34_desviacion",
        "number": 34,
        "title": "Sacrificio de desviación",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Alejar al Guardián",
            "text": "Forzar a una pieza enemiga a abandonar la casilla o línea que defendía, permitiéndote penetrar con un golpe decisivo.",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1",
            "instruction": "Paso 1: Desvía a la torre negra de la defensa de la 8ª fila.",
            "solution": {
              "from": "d2",
              "to": "d8"
            },
            "hint": "Captura en d8 con tu torre.",
            "feedback": "¡Desviación y Jaque Mate!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
            "instruction": "Paso 2: Da mate en la octava fila con Torre en d8.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Mueve la torre a d8.",
            "feedback": "¡Mate del pasillo!"
          },
          {
            "id": "ex_3",
            "fen": "8/5p2/8/8/8/8/5K2/7k w - - 0 1",
            "instruction": "Paso 3: Avanza tu Rey a g3.",
            "solution": {
              "from": "f2",
              "to": "g3"
            },
            "hint": "Mueve el rey a g3.",
            "feedback": "¡Rey activo!"
          },
          {
            "id": "ex_4",
            "fen": "8/5p2/8/8/8/6K1/8/7k w - - 1 2",
            "instruction": "Paso 4: Lleva tu Rey a h3.",
            "solution": {
              "from": "g3",
              "to": "h3"
            },
            "hint": "Lleva el rey a h3.",
            "feedback": "¡Rey en posición ganadora!"
          },
          {
            "id": "ex_5",
            "fen": "8/5p2/8/8/8/7K/8/7k w - - 2 3",
            "instruction": "Paso 5: Mueve tu Rey a g4.",
            "solution": {
              "from": "h3",
              "to": "g4"
            },
            "hint": "Mueve el rey a g4.",
            "feedback": "¡Desviaciones dominadas!"
          }
        ]
      },
      {
        "id": "l35_destruccion_defensa",
        "number": 35,
        "title": "Destrucción de la defensa",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Derribar la Muralla",
            "text": "Eliminar la pieza o peón clave que sostiene la estructura defensiva enemiga para dar paso a un ataque imparable.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Destruye el caballo defensor en c6 capturándolo con tu Alfil.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Defensor eliminado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Captura el peón central en e5 que ha quedado indefenso.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Captura en e5 con tu caballo.",
            "feedback": "¡Peón central capturado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Desarrolla tu Dama a e7 atacando al caballo.",
            "solution": {
              "from": "d8",
              "to": "e7"
            },
            "hint": "Lleva tu dama a e7.",
            "feedback": "¡Contragolpe!"
          },
          {
            "id": "ex_4",
            "fen": "r1b1k2r/p1ppqppp/2p5/4N3/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 1 2",
            "instruction": "Paso 4: Defiende tu Caballo central avanzando el peón a d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Cadena de peones inquebrantable!"
          },
          {
            "id": "ex_5",
            "fen": "r1b1k2r/p1ppqppp/2p5/4N3/3PP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 5: Juegas con negras. Expulsa al caballo jugando f7-f6.",
            "solution": {
              "from": "f7",
              "to": "f6"
            },
            "hint": "Mueve el peón a f6.",
            "feedback": "¡Destrucción de defensas completada!"
          }
        ]
      },
      {
        "id": "l36_debilidad_septima_octava",
        "number": 36,
        "title": "La debilidad de la 7ª y 8ª fila",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Invasión en las Filas Decisivas",
            "text": "Una Torre o Dama infiltrada en la 7ª u 8ª fila devora peones indefensos y coordina ataques de mate contra el Rey.",
            "fen": "r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 1: Invade la 8ª fila con tu Torre en a8.",
            "solution": {
              "from": "a2",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Invasión letal!"
          },
          {
            "id": "ex_2",
            "fen": "R4rk1/5ppp/8/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 2: Captura la Torre en f8 dando Jaque Mate.",
            "solution": {
              "from": "a8",
              "to": "f8"
            },
            "hint": "Captura en f8 con tu torre.",
            "feedback": "¡Jaque Mate en la 8ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "5rk1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 3: Lleva tu Torre a a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Presión en la 8ª fila!"
          },
          {
            "id": "ex_4",
            "fen": "R4rk1/5ppp/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Rey en camino!"
          },
          {
            "id": "ex_5",
            "fen": "R4rk1/5ppp/8/8/8/4K3/8/8 w - - 1 2",
            "instruction": "Paso 5: Continúa con tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Filas 7ª y 8ª dominadas!"
          }
        ]
      },
      {
        "id": "l37_mate_arabe",
        "number": 37,
        "title": "El mate árabe",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Pareja Legendaria",
            "text": "El mate árabe combina una Torre en la esquina (h8/g8) y un Caballo en f6/f3 que corta la casilla de escape del rey rival.",
            "fen": "5rk1/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "5rk1/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1",
            "instruction": "Paso 1: Lleva tu Torre a g8 dando Jaque Mate Árabe con apoyo del caballo en f6.",
            "solution": {
              "from": "g1",
              "to": "g8"
            },
            "hint": "Mueve la torre a g8.",
            "feedback": "¡Jaque Mate Árabe!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5p1p/5N2/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 2: Da mate en la octava fila con Torre en a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva la torre a a8.",
            "feedback": "¡Jaque Mate perfecto!"
          },
          {
            "id": "ex_3",
            "fen": "8/5p1p/5N1k/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 3: Lleva tu Torre a a7 cortando al rey.",
            "solution": {
              "from": "a1",
              "to": "a7"
            },
            "hint": "Mueve la torre a a7.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/R4p1p/5N1k/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 4: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza el rey a e2.",
            "feedback": "¡Rey activo!"
          },
          {
            "id": "ex_5",
            "fen": "8/R4p1p/5N1k/8/8/4K3/8/8 w - - 2 3",
            "instruction": "Paso 5: Captura el peón en f7 con tu Torre.",
            "solution": {
              "from": "a7",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Mate árabe y combinaciones dominadas!"
          }
        ]
      },
      {
        "id": "l38_mate_anastasia",
        "number": 38,
        "title": "El mate de Anastasia",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Pasillo Lateral",
            "text": "Un Caballo en e7 corta las casillas de escape g8 y g6 mientras una Torre en la columna \"h\" abierta asesta el mate definitivo.",
            "fen": "5rk1/4Nppp/8/8/8/8/8/4K2R w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "5rk1/4Nppp/8/8/8/8/8/4K2R w - - 0 1",
            "instruction": "Paso 1: Lleva tu Torre a h7 dando Jaque Mate de Anastasia.",
            "solution": {
              "from": "h1",
              "to": "h7"
            },
            "hint": "Lleva tu torre a h7.",
            "feedback": "¡Jaque Mate de Anastasia fulminante!"
          },
          {
            "id": "ex_2",
            "fen": "5rk1/4Nppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 2: Da jaque mate en a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Mate en 8ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "8/4Nppp/7k/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 3: Corta en la 6ª fila con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a6"
            },
            "hint": "Lleva la torre a a6.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/4Nppp/R6k/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 4: Mueve tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza el rey a e2.",
            "feedback": "¡Rey en marcha!"
          },
          {
            "id": "ex_5",
            "fen": "8/4Nppp/R6k/8/8/4K3/8/8 w - - 2 3",
            "instruction": "Paso 5: Lleva tu Torre a f6.",
            "solution": {
              "from": "a6",
              "to": "f6"
            },
            "hint": "Mueve la torre a f6.",
            "feedback": "¡Mate de Anastasia completado!"
          }
        ]
      },
      {
        "id": "l39_mate_boden",
        "number": 39,
        "title": "El mate de Boden",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Las Diagonales Cruzadas",
            "text": "Dos Alfiles en diagonales cruzadas dan jaque mate al Rey atrapado entre sus propias piezas.",
            "fen": "2kr4/ppp2ppp/8/8/2B5/8/8/2B1K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "2kr4/ppp2ppp/8/8/2B5/8/8/2B1K3 w - - 0 1",
            "instruction": "Paso 1: Captura el peón en f7 con tu Alfil.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Ataque cruzado de alfiles!"
          },
          {
            "id": "ex_2",
            "fen": "2kr4/ppp2Bpp/8/8/8/8/8/2B1K3 b - - 0 1",
            "instruction": "Paso 2: Mueve la torre a d7.",
            "solution": {
              "from": "d8",
              "to": "d7"
            },
            "hint": "Lleva la torre a d7.",
            "feedback": "¡Defensa pasiva!"
          },
          {
            "id": "ex_3",
            "fen": "2kr4/pppr1Bpp/8/8/8/8/8/2B1K3 w - - 1 2",
            "instruction": "Paso 3: Clava la torre llevando tu Alfil a g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve el alfil a g5.",
            "feedback": "¡Clavada letal de alfil!"
          },
          {
            "id": "ex_4",
            "fen": "2kr4/pppr1Bpp/8/6B1/8/8/8/4K3 b - - 2 2",
            "instruction": "Paso 4: Captura el alfil en f7 con la torre.",
            "solution": {
              "from": "d7",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Intercambio forzado!"
          },
          {
            "id": "ex_5",
            "fen": "2kr4/ppp2rpp/8/6B1/8/8/8/4K3 w - - 0 3",
            "instruction": "Paso 5: Captura la torre en d8 con tu Alfil.",
            "solution": {
              "from": "g5",
              "to": "d8"
            },
            "hint": "Captura en d8 con tu alfil.",
            "feedback": "¡Mate de Boden y alfiles dominados!"
          }
        ]
      },
      {
        "id": "l40_mate_blackburne",
        "number": 40,
        "title": "El mate de Blackburne",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Alfiles y Caballo Coordinados",
            "text": "Dos Alfiles apuntando al enroque combinados con un Caballo en salto dan un mate espectacular descubierto por Joseph Blackburne.",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Clava al caballo en f6 con tu Alfil en g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Lleva tu alfil a g5.",
            "feedback": "¡Clavada al caballo del enroque!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1QK2R b KQkq - 1 1",
            "instruction": "Paso 2: Expulsa al alfil con h7-h6.",
            "solution": {
              "from": "h7",
              "to": "h6"
            },
            "hint": "Mueve el peón a h6.",
            "feedback": "¡Pregunta al alfil!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/pppp1pp1/2n2n1p/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1QK2R w KQkq - 0 2",
            "instruction": "Paso 3: Retira tu Alfil manteniendo la clavada en h4.",
            "solution": {
              "from": "g5",
              "to": "h4"
            },
            "hint": "Mueve el alfil a h4.",
            "feedback": "¡Clavada persistente!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1pp1/2n2n1p/2b1p3/2B1P2B/3P1N2/PPP2PPP/RN1QK2R b KQkq - 1 2",
            "instruction": "Paso 4: Desarrolla el peón central a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura consolidada!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/ppp2pp1/2np1n1p/2b1p3/2B1P2B/3P1N2/PPP2PPP/RN1QK2R w KQkq - 0 3",
            "instruction": "Paso 5: Desarrolla tu Caballo a c3.",
            "solution": {
              "from": "b1",
              "to": "c3"
            },
            "hint": "Mueve tu caballo a c3.",
            "feedback": "¡Mate de Blackburne asimilado!"
          }
        ]
      },
      {
        "id": "l41_mate_greco",
        "number": 41,
        "title": "El mate de Greco",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Apertura de la Columna Torre",
            "text": "Abrir la columna \"h\" tras un sacrificio contra el peón de g7/h7 permite un mate directo con Torre y Alfil en el enroque.",
            "fen": "6k1/5ppp/8/8/2B5/8/8/4K2R w K - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/2B5/8/8/4K2R w K - 0 1",
            "instruction": "Paso 1: Captura en f7 con tu Alfil dando jaque.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Ataque a la debilidad del rey!"
          },
          {
            "id": "ex_2",
            "fen": "5k2/5Bpp/8/8/8/8/8/4K2R w K - 0 1",
            "instruction": "Paso 2: Captura el peón en h7 con tu Torre.",
            "solution": {
              "from": "h1",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Columna \"h\" abierta!"
          },
          {
            "id": "ex_3",
            "fen": "5k2/5B1R/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 3: Retira tu Alfil a e6 cortando al rey.",
            "solution": {
              "from": "f7",
              "to": "e6"
            },
            "hint": "Mueve el alfil a e6.",
            "feedback": "¡Corte de casillas!"
          },
          {
            "id": "ex_4",
            "fen": "5k2/7R/4B3/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 4: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza el rey a e2.",
            "feedback": "¡Rey en apoyo!"
          },
          {
            "id": "ex_5",
            "fen": "5k2/7R/4B3/8/8/4K3/8/8 w - - 2 3",
            "instruction": "Paso 5: Da Jaque Mate llevando tu Torre a f7.",
            "solution": {
              "from": "h7",
              "to": "f7"
            },
            "hint": "Mueve la torre a f7.",
            "feedback": "¡Mate de Greco ejecutado!"
          }
        ]
      },
      {
        "id": "l42_mate_coz",
        "number": 42,
        "title": "El mate de la coz (Smothered Mate)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Asfixiado por sus Propias Tropas",
            "text": "El Rey enemigo está completamente rodeado por sus propias piezas. Un solo Caballo salta y asesta el jaque mate sin que el Rey pueda escapar.",
            "fen": "6k1/5ppp/8/8/8/5N2/8/4K2R w K - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/8/5N2/8/4K2R w K - 0 1",
            "instruction": "Paso 1: Salta con tu Caballo a g5 apuntando a h7 y f7.",
            "solution": {
              "from": "f3",
              "to": "g5"
            },
            "hint": "Mueve el caballo a g5.",
            "feedback": "¡Caballo agresivo hacia el enroque!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/6N1/8/8/8/4K2R w K - 1 2",
            "instruction": "Paso 2: Captura en h7 con tu Caballo dando jaque.",
            "solution": {
              "from": "g5",
              "to": "h7"
            },
            "hint": "Captura en h7 con el caballo.",
            "feedback": "¡Jaque en el flanco de rey!"
          },
          {
            "id": "ex_3",
            "fen": "7k/5ppp/8/8/8/8/8/4K2R w K - 2 3",
            "instruction": "Paso 3: Captura en h7 con tu Torre dando Jaque Mate.",
            "solution": {
              "from": "h1",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Jaque Mate!"
          },
          {
            "id": "ex_4",
            "fen": "k7/8/1K6/8/8/8/8/R7 w - - 0 1",
            "instruction": "Paso 4: Corta al rey en a7 con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a7"
            },
            "hint": "Mueve la torre a a7.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_5",
            "fen": "k7/R7/1K6/8/8/8/8/8 w - - 1 2",
            "instruction": "Paso 5: Da Jaque Mate en a8.",
            "solution": {
              "from": "a7",
              "to": "a8"
            },
            "hint": "Lleva la torre a a8.",
            "feedback": "¡Mate de la coz y patrones de asfixia dominados!"
          }
        ]
      },
      {
        "id": "l43_mate_morphy",
        "number": 43,
        "title": "El mate de Morphy",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Alfil Inmortal",
            "text": "Paul Morphy popularizó este mate donde un Alfil corta la diagonal de escape del Rey en la esquina mientras una Torre en la columna abierta da mate.",
            "fen": "5rk1/5p1p/8/8/2B5/8/8/4K2R w K - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "5rk1/5p1p/8/8/2B5/8/8/4K2R w K - 0 1",
            "instruction": "Paso 1: Captura en f7 con tu Alfil.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Ataque a la esquina rival!"
          },
          {
            "id": "ex_2",
            "fen": "5rk1/5B1p/8/8/8/8/8/4K2R w K - 0 1",
            "instruction": "Paso 2: Lleva tu Torre a g1 dando jaque en la columna.",
            "solution": {
              "from": "h1",
              "to": "g1"
            },
            "hint": "Lleva tu torre a g1.",
            "feedback": "¡Jaque por la columna abierta!"
          },
          {
            "id": "ex_3",
            "fen": "5rk1/5B1p/8/8/8/8/8/4K1R1 w - - 1 2",
            "instruction": "Paso 3: Retira tu Alfil a e6.",
            "solution": {
              "from": "f7",
              "to": "e6"
            },
            "hint": "Mueve el alfil a e6.",
            "feedback": "¡Alfil cortando casillas!"
          },
          {
            "id": "ex_4",
            "fen": "5rk1/7p/4B3/8/8/8/8/4K1R1 w - - 2 3",
            "instruction": "Paso 4: Mueve tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Avanza el rey a e2.",
            "feedback": "¡Rey en juego!"
          },
          {
            "id": "ex_5",
            "fen": "5rk1/7p/4B3/8/8/4K3/8/6R1 w - - 3 4",
            "instruction": "Paso 5: Lleva tu Torre a g8 dando Jaque Mate de Morphy.",
            "solution": {
              "from": "g1",
              "to": "g8"
            },
            "hint": "Lleva la torre a g8.",
            "feedback": "¡Mate de Morphy completado!"
          }
        ]
      },
      {
        "id": "l44_mate_reti",
        "number": 44,
        "title": "El mate de Réti",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Sorpresa de Richard Réti",
            "text": "Un Alfil apoyado por una Torre asesta jaque mate al Rey encerrado en el centro tras un sacrificio de Dama.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Captura el caballo en e4 con tu peón.",
            "solution": {
              "from": "d3",
              "to": "e4"
            },
            "hint": "Captura en e4 con el peón.",
            "feedback": "¡Ganancia de pieza menor!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla el peón central a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa sólida!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkb1r/ppp2ppp/2np4/2B1P3/4P3/5N2/PPP2PPP/RN1QKB1R w KQkq - 0 1",
            "instruction": "Paso 3: Retira tu Alfil a a3.",
            "solution": {
              "from": "c5",
              "to": "a3"
            },
            "hint": "Mueve el alfil a a3.",
            "feedback": "¡Diagonal abierta!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkb1r/ppp2ppp/2np4/4P3/4P3/B4N2/PPP2PPP/RN1QKB1R b KQkq - 1 1",
            "instruction": "Paso 4: Centraliza el caballo a e5.",
            "solution": {
              "from": "c6",
              "to": "e5"
            },
            "hint": "Mueve tu caballo a e5.",
            "feedback": "¡Caballo al centro!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/ppp2ppp/3p4/4n3/4P3/B4N2/PPP2PPP/RN1QKB1R w KQkq - 2 2",
            "instruction": "Paso 5: Captura el caballo en e5 con tu Caballo en f3.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Captura en e5 con el caballo.",
            "feedback": "¡Mate de Réti y coordinación de piezas dominada!"
          }
        ]
      },
      {
        "id": "l45_mate_damiano",
        "number": 45,
        "title": "El mate de Damiano",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Peón Cuña y Dama Asesina",
            "text": "Un peón propio en g6 o f6 clava una cuña en el enroque negro permitiendo a la Dama dar mate en h7 o g7.",
            "fen": "6k1/5ppp/6P1/8/8/8/8/4K2R w K - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/6P1/8/8/8/8/4K2R w K - 0 1",
            "instruction": "Paso 1: Captura en h7 con tu Torre dando Jaque Mate.",
            "solution": {
              "from": "h1",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Jaque Mate de Damiano!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 2: Da jaque mate en la 8ª fila con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Mate del pasillo!"
          },
          {
            "id": "ex_3",
            "fen": "8/k7/8/8/8/8/8/4K2R w - - 0 1",
            "instruction": "Paso 3: Corta en la 7ª fila con tu Torre.",
            "solution": {
              "from": "h1",
              "to": "h7"
            },
            "hint": "Lleva tu torre a h7.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/k6R/8/8/8/4K3/8/8 w - - 1 2",
            "instruction": "Paso 4: Acerca tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Rey al centro!"
          },
          {
            "id": "ex_5",
            "fen": "8/k6R/4K3/8/8/8/8/8 w - - 2 3",
            "instruction": "Paso 5: Da Jaque Mate en a7 con tu Torre.",
            "solution": {
              "from": "h7",
              "to": "a7"
            },
            "hint": "Lleva la torre a a7.",
            "feedback": "¡Patrón de Damiano asimilado!"
          }
        ]
      },
      {
        "id": "l46_sacrificio_h7",
        "number": 46,
        "title": "El sacrificio clásico de Alfil en h7 (Regalo Griego)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Regalo Griego",
            "text": "El sacrificio clásico Axh7+ destruye el escudo de peones del enroque enemigo, permitiendo la entrada mortal de Cg5+ y Dh5.",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1",
            "instruction": "Paso 1: Captura el peón central en d5 con tu Alfil.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el alfil.",
            "feedback": "¡Presión central!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3B4/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 1",
            "instruction": "Paso 2: Desarrolla el caballo a e7.",
            "solution": {
              "from": "c6",
              "to": "e7"
            },
            "hint": "Mueve el caballo a e7.",
            "feedback": "¡Caballo defensivo!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/ppp1nppp/8/3B4/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 1 2",
            "instruction": "Paso 3: Captura en f7 con tu Alfil dando jaque.",
            "solution": {
              "from": "d5",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Sacrificio demoledor sobre el enroque!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/ppp1nBpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 2",
            "instruction": "Paso 4: Captura el alfil en f7 con la torre.",
            "solution": {
              "from": "f8",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Rey expuesto!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq2k1/ppp1nrpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 3",
            "instruction": "Paso 5: Captura la Dama en d8 con tu Dama.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Captura la dama en d8.",
            "feedback": "¡Regalo Griego y ataque al enroque dominado!"
          }
        ]
      },
      {
        "id": "l47_molino_viento",
        "number": 47,
        "title": "El molino de viento (Windmill)",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Máquina de Capturar",
            "text": "Una serie alternada de jaques descubiertos con Torre y Alfil permite a la Torre capturar múltiples piezas enemigas sin que el rival pueda defenderse.",
            "fen": "6k1/5ppp/8/8/2B5/8/8/4K1R1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/2B5/8/8/4K1R1 w - - 0 1",
            "instruction": "Paso 1: Captura en g7 con tu Torre dando jaque.",
            "solution": {
              "from": "g1",
              "to": "g7"
            },
            "hint": "Captura en g7 con la torre.",
            "feedback": "¡Primer giro del Molino de Viento!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5pRp/8/8/2B5/8/8/4K3 w - - 0 1",
            "instruction": "Paso 2: Captura en f7 con tu Torre dando jaque descubierto de Alfil.",
            "solution": {
              "from": "g7",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Jaque descubierto!"
          },
          {
            "id": "ex_3",
            "fen": "6k1/5R1p/8/8/2B5/8/8/4K3 w - - 0 1",
            "instruction": "Paso 3: Regresa a g7 con la Torre para dar jaque directo.",
            "solution": {
              "from": "f7",
              "to": "g7"
            },
            "hint": "Mueve la torre a g7.",
            "feedback": "¡Giro continuo del molino!"
          },
          {
            "id": "ex_4",
            "fen": "6k1/5pRp/8/8/2B5/4K3/8/8 w - - 1 2",
            "instruction": "Paso 4: Captura el peón en h7 con tu Torre.",
            "solution": {
              "from": "g7",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Tercera pieza devorada por el molino!"
          },
          {
            "id": "ex_5",
            "fen": "6k1/5p1R/8/8/2B5/4K3/8/8 w - - 0 3",
            "instruction": "Paso 5: Remata la posición con Torre en f7.",
            "solution": {
              "from": "h7",
              "to": "f7"
            },
            "hint": "Mueve la torre a f7.",
            "feedback": "¡Molino de viento asimilado al 100%!"
          }
        ]
      },
      {
        "id": "l48_ataque_f7_f2",
        "number": 48,
        "title": "Ataque fulminante sobre f7 / f2",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "El Talón de Aquiles",
            "text": "La casilla f7 (f2 para blancas) es la más débil al inicio porque sólo está defendida por el propio Rey. ¡Explotarla genera victorias fulgurantes!",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Salta con tu Caballo a g5 atacando f7 junto con el Alfil.",
            "solution": {
              "from": "f3",
              "to": "g5"
            },
            "hint": "Mueve el caballo a g5.",
            "feedback": "¡Ataque Fegatello sobre f7 iniciado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 1 1",
            "instruction": "Paso 2: Juegas con negras. Bloquea la diagonal con d7-d5.",
            "solution": {
              "from": "d7",
              "to": "d5"
            },
            "hint": "Avanza el peón a d5.",
            "feedback": "¡Contragolpe central!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/ppp2ppp/2n5/3p2N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 2",
            "instruction": "Paso 3: Captura en d5 con tu Alfil.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el alfil.",
            "feedback": "¡Presión redoblada!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkbnr/ppp2ppp/2n5/3B2N1/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 4: Juegas con negras. Captura el caballo en g5 con tu Dama.",
            "solution": {
              "from": "d8",
              "to": "g5"
            },
            "hint": "Captura en g5 con la dama.",
            "feedback": "¡Defensa dinámica!"
          },
          {
            "id": "ex_5",
            "fen": "r1b1kbnr/ppp2ppp/2n5/3B2q1/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 3",
            "instruction": "Paso 5: Captura el caballo en c6 con tu Alfil.",
            "solution": {
              "from": "d5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Puntos débiles f7/f2 dominados!"
          }
        ]
      },
      {
        "id": "l49_sacrificio_e6",
        "number": 49,
        "title": "El sacrificio posicional de pieza en e6",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Dinamitar la Defensa Siciliana y Francesa",
            "text": "Sacrificar un Caballo o Alfil en e6 destruye el centro enemigo e impide que el Rey rival pueda coordinar su enroque.",
            "fen": "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1",
            "instruction": "Paso 1: Sacrifica tu Caballo en e6 atacando la Dama y destruyendo los peones rivales.",
            "solution": {
              "from": "d4",
              "to": "e6"
            },
            "hint": "Mueve tu caballo a e6.",
            "feedback": "¡Sacrificio temático en e6!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkbnr/pp1p1ppp/2n1N3/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 0 1",
            "instruction": "Paso 2: Captura en e6 con el peón negro.",
            "solution": {
              "from": "f7",
              "to": "e6"
            },
            "hint": "Captura en e6 con el peón.",
            "feedback": "¡Estructura negra dinamitada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pp1p2pp/2n1p3/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 2",
            "instruction": "Paso 3: Lleva tu Dama a h5 dando jaque al rey debilitado.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Ataque fulminante al rey!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkbnr/pp1p2pp/2n1p3/7Q/4P3/8/PPP2PPP/RNB1KB1R b KQkq - 1 2",
            "instruction": "Paso 4: Juegas con negras. Bloquea con g7-g6.",
            "solution": {
              "from": "g7",
              "to": "g6"
            },
            "hint": "Avanza el peón a g6.",
            "feedback": "¡Bloqueo!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkbnr/pp1p3p/2n1p1p1/7Q/4P3/8/PPP2PPP/RNB1KB1R w KQkq - 0 3",
            "instruction": "Paso 5: Retira tu Dama a f3 manteniendo una presión aplastante.",
            "solution": {
              "from": "h5",
              "to": "f3"
            },
            "hint": "Mueve la dama a f3.",
            "feedback": "¡Sacrificios en e6 asimilados!"
          }
        ]
      },
      {
        "id": "l50_peones_pasados_medio_juego",
        "number": 50,
        "title": "Peones pasados avanzados en el medio juego",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Monstruo en 6ª y 7ª Fila",
            "text": "Un peón pasado avanzado en la 6ª o 7ª fila paraliza al ejército rival y vale tanto como una pieza mayor.",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 1: Corona tu peón pasado a Dama protegida por tu Torre en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Avanza a e8 coronando en Dama.",
            "feedback": "¡Coronación imparable y defendida!"
          },
          {
            "id": "ex_2",
            "fen": "1k6/P7/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 2: Corona tu peón en a8 con el respaldo de tu Torre en a2.",
            "solution": {
              "from": "a7",
              "to": "a8",
              "promotion": "q"
            },
            "hint": "Corona en a8.",
            "feedback": "¡Dama protegida en el flanco de dama!"
          },
          {
            "id": "ex_3",
            "fen": "k7/1PK5/8/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 3: Corona con Jaque Mate en b8 protegido por tu Rey en c7.",
            "solution": {
              "from": "b7",
              "to": "b8",
              "promotion": "q"
            },
            "hint": "Corona en b8.",
            "feedback": "¡Coronación triunfal con Jaque Mate!"
          },
          {
            "id": "ex_4",
            "fen": "6k1/7P/8/8/8/8/7R/4K3 w - - 0 1",
            "instruction": "Paso 4: Corona en h8 defendido por tu Torre en h2.",
            "solution": {
              "from": "h7",
              "to": "h8",
              "promotion": "q"
            },
            "hint": "Corona en h8.",
            "feedback": "¡Dama blindada en la esquina!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/3r4/8/8/8/8/3p4/4K3 b - - 0 1",
            "instruction": "Paso 5: Juegas con negras. Corona en d1 defendido por tu Torre en d7.",
            "solution": {
              "from": "d2",
              "to": "d1",
              "promotion": "q"
            },
            "hint": "Corona en d1 con negras.",
            "feedback": "¡Graduación de Etapa 2 Completada con Éxito!"
          }
        ]
      }
    ]
  },
  {
    "id": "etapa-3-estrategia-finales",
    "title": "ETAPA 3: ESTRATEGIA Y FINALES ESENCIALES (1200 - 1600 Elo)",
    "category": "estrategia",
    "badge": "Estrategia Junvill",
    "eloRange": "1200 - 1600 Elo",
    "lessons": [
      {
        "id": "l51_regla_cuadrado",
        "number": 51,
        "title": "La regla del cuadrado de peones",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Cálculo Visual Instantáneo",
            "text": "Dibuja un cuadrado geométrico desde el peón hasta la 8ª fila. Si el Rey rival no puede entrar al cuadrado en su turno, ¡el peón coronará imparable!",
            "fen": "8/8/8/3P4/8/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/3P4/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón a d6 para alejar el cuadrado del rey rival.",
            "solution": {
              "from": "d5",
              "to": "d6"
            },
            "hint": "Avanza a d6.",
            "feedback": "¡Peón fuera del alcance del rey rival!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/3P4/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Avanza tu peón a d7 a un solo paso de la gloria.",
            "solution": {
              "from": "d6",
              "to": "d7"
            },
            "hint": "Mueve el peón a d7.",
            "feedback": "¡A un paso de la coronación!"
          },
          {
            "id": "ex_3",
            "fen": "8/3P4/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Corona tu peón en Dama en d8.",
            "solution": {
              "from": "d7",
              "to": "d8",
              "promotion": "q"
            },
            "hint": "Avanza a d8 coronando en Dama.",
            "feedback": "¡Dama coronada!"
          },
          {
            "id": "ex_4",
            "fen": "3Q4/8/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Dama a g5 cortando al rey.",
            "solution": {
              "from": "d8",
              "to": "g5"
            },
            "hint": "Lleva tu dama a g5.",
            "feedback": "¡Dama dominante!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/8/6Q1/8/8/8/4K2k w - - 1 2",
            "instruction": "Paso 5: Lleva tu Dama a h4 para dar jaque a distancia segura.",
            "solution": {
              "from": "g5",
              "to": "h4"
            },
            "hint": "Mueve la dama a h4.",
            "feedback": "¡Regla del cuadrado dominada al 100%!"
          }
        ]
      },
      {
        "id": "l52_oposicion_reyes",
        "number": 52,
        "title": "La oposición de reyes",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "El Duelo de Monarcas",
            "text": "Tener la oposición significa colocar tu Rey frente al Rey rival con una casilla libre de por medio, obligando al rey enemigo a ceder el paso.",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 1: Avanza con tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Marcha del rey iniciada!"
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/4K3/8 w - - 0 1",
            "instruction": "Paso 2: Da otro paso hacia el centro con tu Rey a e3.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el rey a e3.",
            "feedback": "¡Rey centralizado!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 3: Avanza tu Rey a e4 tomando el centro.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Lleva el rey a e4.",
            "feedback": "¡Dominio central!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Coloca tu Rey en e5.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Mueve a e5.",
            "feedback": "¡Presión hacia adelante!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/4K3/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Toma la oposición directa frente al rey en e8.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Avanza a e6.",
            "feedback": "¡Oposición de Reyes dominada!"
          }
        ]
      },
      {
        "id": "l53_casillas_clave",
        "number": 53,
        "title": "Casillas clave de coronación",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Las Puertas de la Victoria",
            "text": "Las casillas clave son aquellas casillas críticas que si tu Rey logra ocupar primero, garantizan la coronación del peón sin importar a quién le toque jugar.",
            "fen": "4k3/8/8/4P3/8/8/8/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/4P3/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 1: Acerca tu Rey a e2 para apoyar el avance del peón.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Rey en camino hacia las casillas clave!"
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/4P3/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 2: Avanza tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Lleva el rey a e4.",
            "feedback": "¡Rey apoya al peón!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/4P3/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 3: Avanza tu peón a e6.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Mueve el peón a e6.",
            "feedback": "¡Peón avanzado a 6ª fila!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/4P3/4K3/8/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Avanza tu Rey a d6 para apoyar la coronación en e8.",
            "solution": {
              "from": "e5",
              "to": "d6"
            },
            "hint": "Mueve tu rey a d6.",
            "feedback": "¡Rey en casilla clave!"
          },
          {
            "id": "ex_5",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 5: Corona tu peón en Dama protegida por tu Torre en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en e8.",
            "feedback": "¡Casillas clave y coronación dominadas!"
          }
        ]
      },
      {
        "id": "l54_peones_doblados",
        "number": 54,
        "title": "Peones doblados: ventajas y debilidades",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Columna Compartida",
            "text": "Dos peones del mismo bando en la misma columna se estorban mutuamente para avanzar pero abren columnas adyacentes para las Torres.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Dobla los peones negros capturando el caballo en c6 con tu Alfil.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Peones rivales doblados en c7 y c6!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Afianza tu centro con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro blindado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Defiende tu peón central jugando d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura sólida!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey seguro!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1",
            "instruction": "Paso 5: Clava el caballo con tu Alfil en g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Estructura de peones doblados dominada!"
          }
        ]
      },
      {
        "id": "l55_peon_aislado",
        "number": 55,
        "title": "El peón aislado (IQP): Fuerza dinámica vs Debilidad",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Espada de Doble Filo",
            "text": "Un peón aislado (IQP) brinda casillas de ataque avanzadas pero debe ser defendido con piezas en los finales.",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 1: Genera el peón aislado capturando en d5.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el peón.",
            "feedback": "¡Peón aislado generado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1",
            "instruction": "Paso 2: Juegas con negras. Golpea con e6-e5.",
            "solution": {
              "from": "e6",
              "to": "e5"
            },
            "hint": "Avanza el peón a e5.",
            "feedback": "¡Ruptura activa!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/pp1nbppp/2n5/3pp3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 2",
            "instruction": "Paso 3: Captura en e5 con tu peón.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura en e5.",
            "feedback": "¡Intercambio central!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/pp1nbppp/8/3pn3/8/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 3",
            "instruction": "Paso 4: Captura el caballo en e5.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Captura en e5 con el caballo.",
            "feedback": "¡Simplificación favorable!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/pp1nbppp/8/3pn3/8/2N5/PP2BPPP/R1BQ1RK1 b - - 0 3",
            "instruction": "Paso 5: Bloquea el peón aislado con tu Caballo en f6.",
            "solution": {
              "from": "d7",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Bloqueo del peón aislado dominado!"
          }
        ]
      },
      {
        "id": "l56_peones_retrasados",
        "number": 56,
        "title": "Peones retrasados en columnas semiabiertas",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Punto Débil Fijo",
            "text": "Un peón retrasado se ha quedado atrás de sus vecinos y no puede avanzar con seguridad, convirtiéndose en el blanco predilecto de las Torres en la columna abierta.",
            "fen": "r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N5/PP2BPPP/R1BQ1RK1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N5/PP2BPPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 1: Desarrolla tu Alfil a e3 dominando el centro.",
            "solution": {
              "from": "c1",
              "to": "e3"
            },
            "hint": "Mueve el alfil a e3.",
            "feedback": "¡Centro blanco reforzado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N1B3/PP2BPPP/R2Q1RK1 b - - 1 1",
            "instruction": "Paso 2: Juegas con negras. Salta con tu Caballo a c5 atacando el peón central.",
            "solution": {
              "from": "d7",
              "to": "c5"
            },
            "hint": "Mueve tu caballo a c5.",
            "feedback": "¡Presión sobre e4!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/pp2ppbp/3p1np1/2n5/2PNP3/2N1B3/PP2BPPP/R2Q1RK1 w - - 2 2",
            "instruction": "Paso 3: Protege tu peón central jugando f2-f3.",
            "solution": {
              "from": "f2",
              "to": "f3"
            },
            "hint": "Avanza el peón a f3.",
            "feedback": "¡Centro blindado!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/pp2ppbp/3p1np1/2n5/2PNP3/2N1BP2/PP2B1PP/R2Q1RK1 b - - 0 2",
            "instruction": "Paso 4: Juegas con negras. Juega a7-a6 para preparar b7-b5.",
            "solution": {
              "from": "a7",
              "to": "a6"
            },
            "hint": "Mueve el peón a a6.",
            "feedback": "¡Preparación en el flanco!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/1p2ppbp/p1np1np1/2n5/2PNP3/2N1BP2/PP2B1PP/R2Q1RK1 w - - 1 3",
            "instruction": "Paso 5: Captura el caballo en c6 con tu Caballo de d4.",
            "solution": {
              "from": "d4",
              "to": "c6"
            },
            "hint": "Captura en c6 con el caballo.",
            "feedback": "¡Tratamiento de peones retrasados dominado!"
          }
        ]
      },
      {
        "id": "l57_mayoria_flanco",
        "number": 57,
        "title": "Mayoría de peones en un flanco",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Fuerza de la Superioridad Numérica",
            "text": "Tener 3 peones contra 2 (o 2 contra 1) en un flanco permite avanzar la mayoría para crear un peón pasado imparable hacia la victoria.",
            "fen": "8/8/8/8/8/P7/1P6/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/8/P7/1P6/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón a b4 para movilizar tu mayoría.",
            "solution": {
              "from": "b2",
              "to": "b4"
            },
            "hint": "Avanza a b4.",
            "feedback": "¡Mayoría de peones en marcha!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/8/1P6/P7/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a b5 con el peón.",
            "solution": {
              "from": "b4",
              "to": "b5"
            },
            "hint": "Mueve a b5.",
            "feedback": "¡Peón pasado en creación!"
          },
          {
            "id": "ex_3",
            "fen": "8/8/8/1P6/8/P7/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Avanza a b6 a un paso de la 7ª fila.",
            "solution": {
              "from": "b5",
              "to": "b6"
            },
            "hint": "Lleva el peón a b6.",
            "feedback": "¡Avance imparable!"
          },
          {
            "id": "ex_4",
            "fen": "8/8/1P6/8/8/P7/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Avanza a b7 a un paso de coronar.",
            "solution": {
              "from": "b6",
              "to": "b7"
            },
            "hint": "Mueve a b7.",
            "feedback": "¡A un paso de la Dama!"
          },
          {
            "id": "ex_5",
            "fen": "8/1P6/8/8/8/P7/8/4K2k w - - 0 1",
            "instruction": "Paso 5: Corona tu peón en Dama en b8.",
            "solution": {
              "from": "b7",
              "to": "b8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en b8.",
            "feedback": "¡Mayoría de peones convertida en Dama!"
          }
        ]
      },
      {
        "id": "l58_peon_pasado_alejado",
        "number": 58,
        "title": "La creación del peón pasado alejado",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Distracción Estratégica",
            "text": "Un peón pasado alejado en la columna \"a\" u \"h\" obliga al Rey rival a viajar hasta la otra punta del tablero, permitiendo a tu propio Rey devorar los peones restantes.",
            "fen": "8/8/8/8/8/7P/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/8/7P/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón alejado a h4.",
            "solution": {
              "from": "h3",
              "to": "h4"
            },
            "hint": "Mueve a h4.",
            "feedback": "¡Peón alejado en avance!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/8/7P/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a h5 con el peón.",
            "solution": {
              "from": "h4",
              "to": "h5"
            },
            "hint": "Avanza a h5.",
            "feedback": "¡El rey rival no podrá detenerlo!"
          },
          {
            "id": "ex_3",
            "fen": "8/8/8/7P/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Avanza a h6.",
            "solution": {
              "from": "h5",
              "to": "h6"
            },
            "hint": "Lleva el peón a h6.",
            "feedback": "¡Presión máxima!"
          },
          {
            "id": "ex_4",
            "fen": "8/8/7P/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Lleva tu peón a h7 a punto de coronar.",
            "solution": {
              "from": "h6",
              "to": "h7"
            },
            "hint": "Mueve a h7.",
            "feedback": "¡A un paso de la coronación!"
          },
          {
            "id": "ex_5",
            "fen": "8/7P/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 5: Corona en Dama en h8.",
            "solution": {
              "from": "h7",
              "to": "h8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en h8.",
            "feedback": "¡Victoria asegurada con peón pasado alejado!"
          }
        ]
      },
      {
        "id": "l59_posicion_lucena",
        "number": 59,
        "title": "Final de Torre: Posición de Lucena (Construir el Puente)",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "El Puente de la Victoria",
            "text": "La posición de Lucena es la técnica magistral más famosa en finales de Torre: construyes un puente con tu Torre en la 4ª fila para tapar los jaques y coronar tu peón.",
            "fen": "4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1",
            "instruction": "Paso 1: Da Jaque Mate en a8 con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Jaque Mate de Lucena!"
          },
          {
            "id": "ex_2",
            "fen": "8/4P3/4K3/8/8/8/8/R6k w - - 0 1",
            "instruction": "Paso 2: Corona tu peón en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama.",
            "feedback": "¡Dama coronada!"
          },
          {
            "id": "ex_3",
            "fen": "8/4P3/8/8/8/8/8/R3K2k w - - 0 1",
            "instruction": "Paso 3: Corona en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Avanza a e8 coronando en Dama.",
            "feedback": "¡Coronación exitosa!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 4: Lleva tu Torre a a8 dando jaque.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Jaque en la 8ª fila!"
          },
          {
            "id": "ex_5",
            "fen": "R3k3/8/8/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 5: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve el rey a e2.",
            "feedback": "¡Técnica de Lucena asimilada!"
          }
        ]
      },
      {
        "id": "l60_posicion_philidor",
        "number": 60,
        "title": "Final de Torre: Posición de Philidor (La Defensa Perfecta)",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "La Muralla en 3ª Fila y Jaques por la Espalda",
            "text": "Mantén tu Torre en la 3ª fila (6ª para negras) para impedir que el Rey rival avance; cuando el peón avance, ¡da jaques infinitos por la espalda!",
            "fen": "8/8/8/8/8/4r3/4P3/4K2k b - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/8/4r3/4P3/4K2k b - - 0 1",
            "instruction": "Paso 1: Captura en e2 con tu Torre.",
            "solution": {
              "from": "e3",
              "to": "e2"
            },
            "hint": "Captura en e2 con la torre.",
            "feedback": "¡Peón peligroso eliminado!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/8/8/8/4r3/4K2k b - - 0 1",
            "instruction": "Paso 2: Retira tu Torre a e8.",
            "solution": {
              "from": "e2",
              "to": "e8"
            },
            "hint": "Lleva la torre a e8.",
            "feedback": "¡Control de la columna!"
          },
          {
            "id": "ex_3",
            "fen": "4r3/8/8/8/8/8/8/4K2k b - - 1 2",
            "instruction": "Paso 3: Da jaque al rey en e1 con tu Torre.",
            "solution": {
              "from": "e8",
              "to": "e1"
            },
            "hint": "Mueve la torre a e1.",
            "feedback": "¡Jaque en la 1ª fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/8/8/8/8/8/5K2/4r2k b - - 2 3",
            "instruction": "Paso 4: Desliza tu Torre a a1 para preparar jaques por la espalda.",
            "solution": {
              "from": "e1",
              "to": "a1"
            },
            "hint": "Mueve la torre a a1.",
            "feedback": "¡Torre a distancia de jaques!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/8/8/8/8/5K2/r6k b - - 3 4",
            "instruction": "Paso 5: Lleva tu Torre a a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Defensa de Philidor dominada!"
          }
        ]
      },
      {
        "id": "l61_torre_septima_fila",
        "number": 61,
        "title": "La actividad de la Torre en la 7ª fila",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Dragón en la Séptima",
            "text": "Una Torre en la 7ª fila paraliza al Rey enemigo, corta su salida y barre toda la cadena de peones contrarios.",
            "fen": "8/5ppp/8/8/8/8/R7/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/5ppp/8/8/8/8/R7/4K2k w - - 0 1",
            "instruction": "Paso 1: Infiltra tu Torre en la 7ª fila en a7.",
            "solution": {
              "from": "a2",
              "to": "a7"
            },
            "hint": "Lleva tu torre a a7.",
            "feedback": "¡Torre en 7ª fila dominante!"
          },
          {
            "id": "ex_2",
            "fen": "R7/5ppp/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Captura en f8 con tu Torre.",
            "solution": {
              "from": "a8",
              "to": "f8"
            },
            "hint": "Captura en f8 con la torre.",
            "feedback": "¡Captura en la 8ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "5R2/5ppp/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Captura el peón en f7 con tu Torre.",
            "solution": {
              "from": "f8",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Peón de f7 devorado!"
          },
          {
            "id": "ex_4",
            "fen": "5R2/5p1p/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Da Jaque Mate en h8 con tu Torre.",
            "solution": {
              "from": "f8",
              "to": "h8"
            },
            "hint": "Lleva la torre a h8.",
            "feedback": "¡Jaque Mate!"
          },
          {
            "id": "ex_5",
            "fen": "7R/5p1p/8/8/8/4K3/8/7k w - - 1 2",
            "instruction": "Paso 5: Captura el peón en h7 con tu Torre.",
            "solution": {
              "from": "h8",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Torre en 7ª fila dominada!"
          }
        ]
      },
      {
        "id": "l62_alfiles_diferente_color",
        "number": 62,
        "title": "Finales de Alfiles de diferente color",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "La Tendencia a las Tablas",
            "text": "En finales de alfiles de distinto color, el bando defensor puede crear fortalezas inexpugnables bloqueando en las casillas del color de su propio alfil.",
            "fen": "8/8/8/4P3/8/8/1B6/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/4P3/8/8/1B6/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón central a e6.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Mueve el peón a e6.",
            "feedback": "¡Peón a 6ª fila!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/4P3/8/8/8/1B6/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a e7 con el peón.",
            "solution": {
              "from": "e6",
              "to": "e7"
            },
            "hint": "Avanza a e7.",
            "feedback": "¡A un paso de la Dama!"
          },
          {
            "id": "ex_3",
            "fen": "8/4P3/8/8/8/8/1B6/4K2k w - - 0 1",
            "instruction": "Paso 3: Corona tu peón en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama.",
            "feedback": "¡Dama en el tablero!"
          },
          {
            "id": "ex_4",
            "fen": "4Q3/8/8/8/8/8/1B6/4K2k w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Dama a e4.",
            "solution": {
              "from": "e8",
              "to": "e4"
            },
            "hint": "Mueve la dama a e4.",
            "feedback": "¡Dama al centro!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/8/8/4Q3/8/1B6/4K2k w - - 1 2",
            "instruction": "Paso 5: Da Jaque Mate en h7 con tu Dama.",
            "solution": {
              "from": "e4",
              "to": "h7"
            },
            "hint": "Lleva tu dama a h7.",
            "feedback": "¡Alfiles de distinto color dominados!"
          }
        ]
      },
      {
        "id": "l63_alfiles_mismo_color",
        "number": 63,
        "title": "Finales de Alfiles del mismo color",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Fijar los Peones en el Color Opuesto",
            "text": "En alfiles del mismo color, coloca tus peones en casillas del color opuesto a tu alfil para no entorpecerlo y atacar los peones rivales.",
            "fen": "8/8/8/8/2B5/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/2B5/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Lleva tu Alfil a f7 dominando la diagonal.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Mueve el alfil a f7.",
            "feedback": "¡Alfil activo!"
          },
          {
            "id": "ex_2",
            "fen": "8/5B2/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Centraliza tu Alfil a e6.",
            "solution": {
              "from": "f7",
              "to": "e6"
            },
            "hint": "Lleva el alfil a e6.",
            "feedback": "¡Alfil en casilla óptima!"
          },
          {
            "id": "ex_3",
            "fen": "8/8/4B3/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve el rey a e2.",
            "feedback": "¡Rey en marcha!"
          },
          {
            "id": "ex_4",
            "fen": "8/8/4B3/8/8/4K3/8/7k w - - 1 2",
            "instruction": "Paso 4: Continúa a e4 con el Rey.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Rey dominante!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/4B3/8/4K3/8/8/7k w - - 2 3",
            "instruction": "Paso 5: Coloca tu Alfil en f7.",
            "solution": {
              "from": "e6",
              "to": "f7"
            },
            "hint": "Mueve el alfil a f7.",
            "feedback": "¡Final de alfiles del mismo color dominado!"
          }
        ]
      },
      {
        "id": "l64_caballo_vs_alfil",
        "number": 64,
        "title": "Caballo vs Alfil en finales",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Posiciones Abiertas vs Cerradas",
            "text": "El Alfil domina en posiciones abiertas con peones en ambos flancos; el Caballo reina en posiciones cerradas con bloqueos fijos.",
            "fen": "8/8/8/8/8/5N2/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/8/5N2/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Centraliza tu Caballo a e5.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Mueve el caballo a e5.",
            "feedback": "¡Caballo central dominante!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/4N3/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Salta a f7 con tu Caballo.",
            "solution": {
              "from": "e5",
              "to": "f7"
            },
            "hint": "Mueve el caballo a f7.",
            "feedback": "¡Caballo en avanzada!"
          },
          {
            "id": "ex_3",
            "fen": "8/5N2/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Acerca tu Rey a f2.",
            "solution": {
              "from": "e1",
              "to": "f2"
            },
            "hint": "Avanza el rey a f2.",
            "feedback": "¡Rey en apoyo!"
          },
          {
            "id": "ex_4",
            "fen": "8/5N2/8/8/8/5K2/8/7k w - - 1 2",
            "instruction": "Paso 4: Avanza tu Rey a g3.",
            "solution": {
              "from": "f3",
              "to": "g3"
            },
            "hint": "Mueve el rey a g3.",
            "feedback": "¡Rey en ataque!"
          },
          {
            "id": "ex_5",
            "fen": "8/5N2/8/8/8/6K1/8/7k w - - 2 3",
            "instruction": "Paso 5: Salta con tu Caballo a g5.",
            "solution": {
              "from": "f7",
              "to": "g5"
            },
            "hint": "Mueve el caballo a g5.",
            "feedback": "¡Duelo Caballo vs Alfil dominado!"
          }
        ]
      },
      {
        "id": "l65_triangulacion_rey",
        "number": 65,
        "title": "Triangulación del Rey",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Perder un Tiempo para Ganar la Partida",
            "text": "La triangulación permite a tu Rey maniobrar en un triángulo geométrico de 3 casillas para ceder el turno al rival y obligarlo a entrar en Zugzwang.",
            "fen": "4k3/8/8/8/8/8/4K3/8 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/4K3/8 w - - 0 1",
            "instruction": "Paso 1: Mueve tu Rey a d2 iniciando el triángulo.",
            "solution": {
              "from": "e2",
              "to": "d2"
            },
            "hint": "Mueve tu rey a d2.",
            "feedback": "¡Primer paso de la triangulación!"
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/3K4/8 w - - 0 1",
            "instruction": "Paso 2: Avanza tu Rey a d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el rey a d3.",
            "feedback": "¡Segundo paso del triángulo!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/8/8/3K4/8/8 w - - 0 1",
            "instruction": "Paso 3: Regresa a e3 completando la triangulación con el turno para el rival.",
            "solution": {
              "from": "d3",
              "to": "e3"
            },
            "hint": "Lleva el rey a e3.",
            "feedback": "¡Triangulación completada! El rival entra en Zugzwang."
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 4: Avanza con tu Rey a e4 tomando espacio.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Rey gana espacio!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/8/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Lleva tu Rey a e5 consolidando la ventaja.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Mueve a e5.",
            "feedback": "¡Triangulación dominada al 100%!"
          }
        ]
      },
      {
        "id": "l66_zugzwang",
        "number": 66,
        "title": "El concepto de Zugzwang",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "La Obligación Fatal de Mover",
            "text": "Zugzwang es la situación donde cualquier jugada que el rival realice empeora irremediablemente su posición y le hace perder la partida.",
            "fen": "k7/8/1K6/8/8/8/8/8 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "k7/8/1K6/8/8/8/8/1R6 w - - 0 1",
            "instruction": "Paso 1: Mueve tu Torre a h1 dejando al rey rival en Zugzwang.",
            "solution": {
              "from": "b1",
              "to": "h1"
            },
            "hint": "Mueve la torre a h1.",
            "feedback": "¡Zugzwang provocado! El rey negro debe mover a b8."
          },
          {
            "id": "ex_2",
            "fen": "1k6/8/1K6/8/8/8/8/7R w - - 1 2",
            "instruction": "Paso 2: Da Jaque Mate en h8 con tu Torre.",
            "solution": {
              "from": "h1",
              "to": "h8"
            },
            "hint": "Lleva la torre a h8.",
            "feedback": "¡Jaque Mate!"
          },
          {
            "id": "ex_3",
            "fen": "8/k7/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 3: Corta en la 7ª fila con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a7"
            },
            "hint": "Lleva tu torre a a7.",
            "feedback": "¡Corte de fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/Rk6/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 4: Acerca tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Rey en marcha!"
          },
          {
            "id": "ex_5",
            "fen": "8/Rk6/4K3/8/8/8/8/8 w - - 1 2",
            "instruction": "Paso 5: Da Jaque Mate en a8.",
            "solution": {
              "from": "a7",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Zugzwang y mates dominados!"
          }
        ]
      },
      {
        "id": "l67_fortaleza",
        "number": 67,
        "title": "La fortaleza defensiva",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "El Muro Infranqueable",
            "text": "Una fortaleza es una configuración defensiva donde un bando con desventaja material bloquea todas las vías de penetración del rival forzando tablas.",
            "fen": "8/8/8/4P3/8/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/4P3/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón central a e6.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Avanza el peón a e6.",
            "feedback": "¡Avance hacia la 6ª fila!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/4P3/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a e7 con el peón.",
            "solution": {
              "from": "e6",
              "to": "e7"
            },
            "hint": "Mueve a e7.",
            "feedback": "¡A un paso de la coronación!"
          },
          {
            "id": "ex_3",
            "fen": "8/4P3/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Corona en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama.",
            "feedback": "¡Dama en juego!"
          },
          {
            "id": "ex_4",
            "fen": "4Q3/8/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Dama a e4.",
            "solution": {
              "from": "e8",
              "to": "e4"
            },
            "hint": "Mueve tu dama a e4.",
            "feedback": "¡Dama al centro!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/8/8/4Q3/8/8/4K2k w - - 1 2",
            "instruction": "Paso 5: Da Jaque Mate en h7.",
            "solution": {
              "from": "e4",
              "to": "h7"
            },
            "hint": "Lleva la dama a h7.",
            "feedback": "¡Fortalezas y rupturas dominadas!"
          }
        ]
      },
      {
        "id": "l68_ruptura_peones",
        "number": 68,
        "title": "Rupturas de peones en el final",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "Dinamitar la Cadena",
            "text": "Sacrificar uno o dos peones en un final de 3 vs 3 peones para crear un peón pasado libre que corone antes que los peones rivales.",
            "fen": "8/8/8/8/8/P1P1P3/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/8/8/P1P1P3/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza el peón central a c4 iniciando la ruptura.",
            "solution": {
              "from": "c3",
              "to": "c4"
            },
            "hint": "Avanza a c4.",
            "feedback": "¡Ruptura iniciada!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/8/8/2P5/P3P3/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a c5 con el peón.",
            "solution": {
              "from": "c4",
              "to": "c5"
            },
            "hint": "Mueve a c5.",
            "feedback": "¡Peón en 5ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "8/8/8/2P5/8/P3P3/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Avanza a c6.",
            "solution": {
              "from": "c5",
              "to": "c6"
            },
            "hint": "Lleva el peón a c6.",
            "feedback": "¡Peón pasado imparable!"
          },
          {
            "id": "ex_4",
            "fen": "8/8/2P5/8/8/P3P3/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Avanza a c7 a un paso de coronar.",
            "solution": {
              "from": "c6",
              "to": "c7"
            },
            "hint": "Mueve a c7.",
            "feedback": "¡A un paso de la gloria!"
          },
          {
            "id": "ex_5",
            "fen": "8/2P5/8/8/8/P3P3/8/4K2k w - - 0 1",
            "instruction": "Paso 5: Corona en Dama en c8.",
            "solution": {
              "from": "c7",
              "to": "c8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en c8.",
            "feedback": "¡Ruptura de peones exitosa!"
          }
        ]
      },
      {
        "id": "l69_dos_debilidades",
        "number": 69,
        "title": "El principio de los dos puntos débiles",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Atacar en Dos Frentes",
            "text": "Un defensor puede resistir una sola debilidad; pero cuando creas una segunda debilidad en el flanco opuesto, sus piezas colapsan sin remedio.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Captura el caballo en c6 creando la primera debilidad en la estructura negra.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Primera debilidad creada!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 3: Golpea el centro con d2-d4 creando el segundo frente de ataque.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Segundo punto débil presionado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Captura en d4 con el peón.",
            "solution": {
              "from": "e5",
              "to": "d4"
            },
            "hint": "Captura en d4.",
            "feedback": "¡Centro abierto!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2",
            "instruction": "Paso 4: Recaptura el peón en d4 con tu Caballo en f3.",
            "solution": {
              "from": "f3",
              "to": "d4"
            },
            "hint": "Captura en d4 con el caballo.",
            "feedback": "¡Caballo central dominante!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 5: Desarrolla tu Alfil a a6.",
            "solution": {
              "from": "c8",
              "to": "a6"
            },
            "hint": "Mueve el alfil a a6.",
            "feedback": "¡Principio de las dos debilidades asimilado!"
          }
        ]
      },
      {
        "id": "l70_centralizacion_rey_final",
        "number": 70,
        "title": "Centralización del Rey en el final",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "El Rey es una Pieza de Ataque",
            "text": "En el final, sin Damas en el tablero, el Rey deja su refugio del enroque y se convierte en una pieza activa de ataque en el centro.",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 1: Avanza tu Rey a e2 hacia el centro del tablero.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Rey hacia el centro!"
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/4K3/8 w - - 0 1",
            "instruction": "Paso 2: Da otro paso con tu Rey a e3.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el rey a e3.",
            "feedback": "¡Rey activo en marcha!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 3: Centraliza tu Rey a d4 dominando casillas clave.",
            "solution": {
              "from": "e3",
              "to": "d4"
            },
            "hint": "Lleva el rey a d4.",
            "feedback": "¡Rey en el centro!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/3K4/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Infiltra tu Rey a e5.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Mueve el rey a e5.",
            "feedback": "¡Rey en territorio rival!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/4K3/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Lleva tu Rey a d6 acorralando al rey rival.",
            "solution": {
              "from": "e5",
              "to": "d6"
            },
            "hint": "Avanza a d6.",
            "feedback": "¡Centralización del Rey dominada!"
          }
        ]
      },
      {
        "id": "l71_final_damas",
        "number": 71,
        "title": "Finales de Damas: evitar jaques perpetuos",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "La Escolta de la Dama",
            "text": "En finales de Damas debes usar tu propia Dama para interponerla y bloquear los jaques continuos del rival mientras tu peón avanza a coronar.",
            "fen": "8/4P3/8/8/8/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/4P3/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Corona tu peón en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en e8.",
            "feedback": "¡Dama coronada!"
          },
          {
            "id": "ex_2",
            "fen": "4Q3/8/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Centraliza tu Dama a e4 para dominar el tablero.",
            "solution": {
              "from": "e8",
              "to": "e4"
            },
            "hint": "Lleva tu dama a e4.",
            "feedback": "¡Dama centralizada!"
          },
          {
            "id": "ex_3",
            "fen": "8/8/8/8/4Q3/8/8/4K2k w - - 1 2",
            "instruction": "Paso 3: Avanza con tu Dama a e7.",
            "solution": {
              "from": "e4",
              "to": "e7"
            },
            "hint": "Mueve la dama a e7.",
            "feedback": "¡Ataque a la 7ª fila!"
          },
          {
            "id": "ex_4",
            "fen": "8/4Q3/8/8/8/8/8/4K2k w - - 2 3",
            "instruction": "Paso 4: Acerca tu Rey a f2.",
            "solution": {
              "from": "e1",
              "to": "f2"
            },
            "hint": "Avanza el rey a f2.",
            "feedback": "¡Rey seguro!"
          },
          {
            "id": "ex_5",
            "fen": "8/4Q3/8/8/8/5K2/8/7k w - - 3 4",
            "instruction": "Paso 5: Da Jaque Mate en g7 con tu Dama.",
            "solution": {
              "from": "e7",
              "to": "g7"
            },
            "hint": "Lleva la dama a g7.",
            "feedback": "¡Final de Damas dominado!"
          }
        ]
      },
      {
        "id": "l72_transicion_final",
        "number": 72,
        "title": "Transición calculada al final",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Simplificar con Ventaja",
            "text": "Cuando tienes ventaja material (un peón de más o una pieza), cambia las Damas y piezas mayores para entrar a un final elemental 100% ganado.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Cambia tu Alfil por el Caballo en c6 simplificando la posición.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Simplificación iniciada!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Sostén tu centro con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Estructura sólida!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Juega d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa equilibrada!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey en seguridad!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1",
            "instruction": "Paso 5: Clava el caballo con tu Alfil en g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Graduación de Etapa 3 Completada con Éxito!"
          }
        ]
      }
    ]
  },
  {
    "id": "etapa-4-aperturas-medio-juego",
    "title": "ETAPA 4: APERTURAS Y MEDIO JUEGO (1600 - 1900 Elo)",
    "category": "aperturas",
    "badge": "Maestría Posicional",
    "eloRange": "1600 - 1900 Elo",
    "lessons": [
      {
        "id": "l73_centro_clasico",
        "number": 73,
        "title": "Dominio del centro clásico (e4/d4)",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "El Centro Ideal de Peones",
            "text": "Ocupar el centro con peones en e4 y d4 controla las casillas clave c5, d5, e5, f5 y otorga máxima movilidad a tus piezas menores.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Inicia la partida avanzando e2-e4.",
            "solution": {
              "from": "e2",
              "to": "e4"
            },
            "hint": "Avanza el peón a e4.",
            "feedback": "¡Peón central avanzado!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Caballo a f3 atacando el peón central enemigo.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f3.",
            "feedback": "¡Desarrollo con amenaza!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            "instruction": "Paso 3: Construye el centro clásico jugando d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Dúo de peones centrales formado!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
            "instruction": "Paso 4: Recaptura en d4 con tu Caballo.",
            "solution": {
              "from": "f3",
              "to": "d4"
            },
            "hint": "Captura en d4 con el caballo.",
            "feedback": "¡Caballo dominante en d4!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
            "instruction": "Paso 5: Defiende tu peón central de e4 con Cc3.",
            "solution": {
              "from": "b1",
              "to": "c3"
            },
            "hint": "Mueve tu caballo a c3.",
            "feedback": "¡Centro clásico dominado!"
          }
        ]
      },
      {
        "id": "l74_centro_hipermoderno",
        "number": 74,
        "title": "Control a distancia del centro (Hipermodernismo)",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "Presión sin Ocupación Directa",
            "text": "La escuela hipermoderna deja que el rival ocupe el centro para luego demolerlo con Alfiles en fianchetto (g3/Ag2 o b3/Ab2) y rupturas de peón.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Prepara el fianchetto en el flanco de rey con g2-g3.",
            "solution": {
              "from": "g2",
              "to": "g3"
            },
            "hint": "Avanza el peón a g3.",
            "feedback": "¡Preparación del fianchetto!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Alfil al fianchetto en g2.",
            "solution": {
              "from": "f1",
              "to": "g2"
            },
            "hint": "Lleva tu alfil a g2.",
            "feedback": "¡Alfil francotirador en la gran diagonal!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/8/6P1/PPPPPPBP/RNBQK1NR w KQkq - 0 3",
            "instruction": "Paso 3: Desarrolla tu Caballo a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f3.",
            "feedback": "¡Desarrollo armónico!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkbnr/ppp2ppp/3p4/4p3/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey enroque rápido!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqkb1r/ppp2ppp/3p1n2/4p3/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq - 1 5",
            "instruction": "Paso 5: Rompe el centro rival jugando d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Golpe hipermoderno al centro!"
          }
        ]
      },
      {
        "id": "l75_apertura_espanola_italiana",
        "number": 75,
        "title": "Aperturas Abiertas: Española e Italiana",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "Los Pilares de la Teoría Clásica",
            "text": "La Apertura Española (1.e4 e5 2.Cf3 Cc6 3.Ab5) presiona el caballo defensor de e5; la Italiana (3.Ac4) apunta al punto vulnerable f7.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Mueve tu peón de rey a e4.",
            "solution": {
              "from": "e2",
              "to": "e4"
            },
            "hint": "Avanza a e4.",
            "feedback": "¡Apertura abierta iniciada!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Caballo a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve el caballo a f3.",
            "feedback": "¡Ataque a e5!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            "instruction": "Paso 3: Juega la Apertura Italiana llevando tu Alfil a c4.",
            "solution": {
              "from": "f1",
              "to": "c4"
            },
            "hint": "Lleva tu alfil a c4.",
            "feedback": "¡Apertura Italiana planteada!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
            "instruction": "Paso 4: Sostén tu centro con d2-d3 (Giuoco Pianissimo).",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro sólido!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5",
            "instruction": "Paso 5: Completa tu enroque corto de e1 a g1.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Aperturas Abiertas dominadas!"
          }
        ]
      },
      {
        "id": "l76_defensa_siciliana",
        "number": 76,
        "title": "Defensa Siciliana (1.e4 c5)",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "El Contragolpe Asimétrico",
            "text": "La Defensa Siciliana lucha por el centro desde el flanco con 1...c5, creando posiciones desequilibradas con gran potencial de contraataque.",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
            "instruction": "Paso 1: Juegas con negras. Plantea la Defensa Siciliana con c7-c5.",
            "solution": {
              "from": "c7",
              "to": "c5"
            },
            "hint": "Avanza el peón a c5.",
            "feedback": "¡Defensa Siciliana en el tablero!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
            "instruction": "Paso 2: Desarrolla tu peón a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura siciliana clásica!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
            "instruction": "Paso 3: Captura en d4 con tu peón.",
            "solution": {
              "from": "c5",
              "to": "d4"
            },
            "hint": "Captura en d4 con el peón.",
            "feedback": "¡Columna \"c\" semiabierta para las negras!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
            "instruction": "Paso 4: Desarrolla tu Caballo a f6 atacando e4.",
            "solution": {
              "from": "g8",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Presión sobre e4!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 5",
            "instruction": "Paso 5: Plantea la legendaria Variante Najdorf con a7-a6.",
            "solution": {
              "from": "a7",
              "to": "a6"
            },
            "hint": "Mueve el peón a a6.",
            "feedback": "¡Defensa Siciliana Najdorf dominada!"
          }
        ]
      },
      {
        "id": "l77_francesa_carokann",
        "number": 77,
        "title": "Defensa Francesa y Caro-Kann",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "Estructuras Sólidas de Peones",
            "text": "La Francesa (1...e6) y la Caro-Kann (1...c6) preparan el avance central d7-d5 para desafiar de inmediato al peón de e4.",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
            "instruction": "Paso 1: Plantea la Defensa Francesa jugando e7-e6.",
            "solution": {
              "from": "e7",
              "to": "e6"
            },
            "hint": "Avanza el peón a e6.",
            "feedback": "¡Defensa Francesa planteada!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
            "instruction": "Paso 2: Golpea el centro con d7-d5.",
            "solution": {
              "from": "d7",
              "to": "d5"
            },
            "hint": "Avanza el peón a d5.",
            "feedback": "¡Desafío directo a e4!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
            "instruction": "Paso 3: Ataca la base de la cadena blanca con c7-c5.",
            "solution": {
              "from": "c7",
              "to": "c5"
            },
            "hint": "Mueve el peón a c5.",
            "feedback": "¡Ruptura temática francesa!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkbnr/pp3ppp/4p3/2ppP3/3P4/2P5/PP3PPP/RNBQKBNR b KQkq - 0 4",
            "instruction": "Paso 4: Desarrolla tu Caballo a c6 aumentando la presión sobre d4.",
            "solution": {
              "from": "b8",
              "to": "c6"
            },
            "hint": "Mueve tu caballo a c6.",
            "feedback": "¡Presión sobre el peón d4!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 5",
            "instruction": "Paso 5: Desarrolla tu Alfil a d7.",
            "solution": {
              "from": "c8",
              "to": "d7"
            },
            "hint": "Mueve el alfil a d7.",
            "feedback": "¡Francesa y Caro-Kann dominadas!"
          }
        ]
      },
      {
        "id": "l78_gambito_dama",
        "number": 78,
        "title": "Gambito de Dama (1.d4 d5 2.c4)",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "El Gambito por la Iniciativa Central",
            "text": "Las blancas ofrecen su peón de \"c\" con 2.c4 para desviar el peón central negro de d5 y dominar todo el centro con e4.",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
            "instruction": "Paso 1: Juegas con negras. Responde sólidamente con d7-d5.",
            "solution": {
              "from": "d7",
              "to": "d5"
            },
            "hint": "Avanza el peón a d5.",
            "feedback": "¡Centro simétrico!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
            "instruction": "Paso 2: Declina el gambito reforzando d5 con e7-e6.",
            "solution": {
              "from": "e7",
              "to": "e6"
            },
            "hint": "Mueve el peón a e6.",
            "feedback": "¡Gambito de Dama Declinado!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
            "instruction": "Paso 3: Desarrolla tu Caballo a f6.",
            "solution": {
              "from": "g8",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Desarrollo clásico!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 2 4",
            "instruction": "Paso 4: Desarrolla tu Alfil a e7 preparando el enroque.",
            "solution": {
              "from": "f8",
              "to": "e7"
            },
            "hint": "Lleva tu alfil a e7.",
            "feedback": "¡Alfil sólido!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqkb1r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 3 5",
            "instruction": "Paso 5: Consolida tu centro con e2-e3.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el peón a e3.",
            "feedback": "¡Gambito de Dama dominado!"
          }
        ]
      },
      {
        "id": "l79_india_rey_grunfeld",
        "number": 79,
        "title": "Defensa India de Rey y Grünfeld",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "Ataque Furioso al Flanco de Rey",
            "text": "En la India de Rey las negras permiten el centro blanco para luego lanzar un asalto demoledor de peones en el flanco de rey con ...f5.",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
            "instruction": "Paso 1: Plantea la India de Rey con Cf6.",
            "solution": {
              "from": "g8",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Control a distancia!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
            "instruction": "Paso 2: Prepara el fianchetto con g7-g6.",
            "solution": {
              "from": "g7",
              "to": "g6"
            },
            "hint": "Avanza el peón a g6.",
            "feedback": "¡Fianchetto del rey!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
            "instruction": "Paso 3: Coloca tu Alfil en g7.",
            "solution": {
              "from": "f8",
              "to": "g7"
            },
            "hint": "Lleva tu alfil a g7.",
            "feedback": "¡Alfil indio activo!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqk2r/ppppppbp/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 4",
            "instruction": "Paso 4: Frena el avance e4-e5 jugando d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura india de rey!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 5",
            "instruction": "Paso 5: Enroca corto con negras.",
            "solution": {
              "from": "e8",
              "to": "g8"
            },
            "hint": "Mueve tu rey a g8.",
            "feedback": "¡Defensas Indias dominadas!"
          }
        ]
      },
      {
        "id": "l80_inglesa_londres",
        "number": 80,
        "title": "Apertura Inglesa y Sistema Londres",
        "category": "aperturas",
        "steps": [
          {
            "type": "theory",
            "title": "Estructuras Universales y Sólidas",
            "text": "El Sistema Londres (1.d4, 2.Af4, 3.e3, 4.c3, 5.Cf3) ofrece una pirámide de peones impenetrable fácil de jugar contra cualquier defensa.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Inicia el Sistema Londres jugando d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza a d4.",
            "feedback": "¡Paso inicial del Londres!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Alfil fuera de la cadena a f4.",
            "solution": {
              "from": "c1",
              "to": "f4"
            },
            "hint": "Lleva tu alfil a f4.",
            "feedback": "¡Alfil de Londres activo!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 1 3",
            "instruction": "Paso 3: Construye la muralla jugando e2-e3.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el peón a e3.",
            "feedback": "¡Estructura piramidal sólida!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4",
            "instruction": "Paso 4: Desarrolla tu Caballo a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f3.",
            "feedback": "¡Caballo al juego!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 1 5",
            "instruction": "Paso 5: Completa la pirámide jugando c2-c3.",
            "solution": {
              "from": "c2",
              "to": "c3"
            },
            "hint": "Mueve el peón a c3.",
            "feedback": "¡Sistema Londres e Inglesa dominados!"
          }
        ]
      },
      {
        "id": "l81_pieza_mala",
        "number": 81,
        "title": "Identificar y mejorar la pieza mala",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Reanimar las Piezas Pasivas",
            "text": "Un Alfil chocado contra sus propios peones o un Caballo en la orilla son piezas malas. Encuentra la maniobra para activarlas o cambiarlas.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Cambia tu Alfil activo por el caballo rival en c6.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Cambio favorable!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Sostén tu peón central con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro afianzado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Juega d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura reforzada!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey seguro!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1",
            "instruction": "Paso 5: Activa tu Alfil a g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Mejora de piezas dominada!"
          }
        ]
      },
      {
        "id": "l82_casilla_debil",
        "number": 82,
        "title": "La casilla débil (Outpost / Puesto de Avanzada)",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Nido del Caballo",
            "text": "Una casilla débil no puede ser defendida por peones enemigos. Instalar un Caballo en ese puesto de avanzada lo convierte en un pulpo gigante.",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
            "instruction": "Paso 1: Desarrolla tu Alfil a c4 apuntando a d5.",
            "solution": {
              "from": "f1",
              "to": "c4"
            },
            "hint": "Lleva tu alfil a c4.",
            "feedback": "¡Control de la diagonal y casilla d5!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 2",
            "instruction": "Paso 2: Sostén tu centro jugando d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro afianzado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 3: Juegas con negras. Desarrolla tu Alfil a c5.",
            "solution": {
              "from": "f8",
              "to": "c5"
            },
            "hint": "Mueve el alfil a c5.",
            "feedback": "¡Desarrollo simétrico!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 3",
            "instruction": "Paso 4: Desarrolla tu Caballo a c3.",
            "solution": {
              "from": "b1",
              "to": "c3"
            },
            "hint": "Mueve tu caballo a c3.",
            "feedback": "¡Caballos preparados para saltar!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 2 4",
            "instruction": "Paso 5: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Puestos de avanzada dominados!"
          }
        ]
      },
      {
        "id": "l83_columnas_abiertas",
        "number": 83,
        "title": "Ocupación y doblaje en columnas abiertas",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Autovía de las Torres",
            "text": "Una columna sin peones es una columna abierta. Domínala con una Torre y dobla tu segunda Torre detrás para crear una batería mortal.",
            "fen": "r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1",
            "instruction": "Paso 1: Penetra por la columna abierta a la 8ª fila con tu Torre.",
            "solution": {
              "from": "a2",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Penetración por la columna abierta!"
          },
          {
            "id": "ex_2",
            "fen": "R4rk1/5ppp/8/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 2: Captura en f8 con tu Torre.",
            "solution": {
              "from": "a8",
              "to": "f8"
            },
            "hint": "Captura en f8 con la torre.",
            "feedback": "¡Captura en la 8ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "5rk1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 3: Lleva tu Torre a a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Jaque en la 8ª fila!"
          },
          {
            "id": "ex_4",
            "fen": "R4rk1/5ppp/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 4: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Rey en camino!"
          },
          {
            "id": "ex_5",
            "fen": "R4rk1/5ppp/8/8/8/4K3/8/8 w - - 1 2",
            "instruction": "Paso 5: Centraliza tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Avanza el rey a e4.",
            "feedback": "¡Columnas abiertas dominadas!"
          }
        ]
      },
      {
        "id": "l84_septima_octava_fila",
        "number": 84,
        "title": "Dominio de la 7ª y 8ª fila",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Masacre en la Séptima",
            "text": "Doblar dos Torres en la 7ª fila (los \"Cerdos Ciegos\") garantiza la destrucción de todos los peones enemigos y múltiples redes de mate.",
            "fen": "8/5ppp/8/8/8/8/R7/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/5ppp/8/8/8/8/R7/4K2k w - - 0 1",
            "instruction": "Paso 1: Lleva tu Torre a la 7ª fila en a7.",
            "solution": {
              "from": "a2",
              "to": "a7"
            },
            "hint": "Lleva tu torre a a7.",
            "feedback": "¡Torre en 7ª fila!"
          },
          {
            "id": "ex_2",
            "fen": "R7/5ppp/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Captura en f8 con tu Torre.",
            "solution": {
              "from": "a8",
              "to": "f8"
            },
            "hint": "Captura en f8 con la torre.",
            "feedback": "¡Captura en 8ª fila!"
          },
          {
            "id": "ex_3",
            "fen": "5R2/5ppp/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Captura el peón en f7 con tu Torre.",
            "solution": {
              "from": "f8",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Peón de f7 devorado!"
          },
          {
            "id": "ex_4",
            "fen": "5R2/5p1p/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Da Jaque Mate en h8.",
            "solution": {
              "from": "f8",
              "to": "h8"
            },
            "hint": "Lleva la torre a h8.",
            "feedback": "¡Jaque Mate!"
          },
          {
            "id": "ex_5",
            "fen": "7R/5p1p/8/8/8/4K3/8/7k w - - 1 2",
            "instruction": "Paso 5: Captura el peón en h7.",
            "solution": {
              "from": "h8",
              "to": "h7"
            },
            "hint": "Captura en h7 con la torre.",
            "feedback": "¡Filas 7ª y 8ª dominadas!"
          }
        ]
      },
      {
        "id": "l85_centro_cerrado",
        "number": 85,
        "title": "El centro cerrado y ataques en flancos",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Ataque Donde Apunta Tu Cadena",
            "text": "Con el centro bloqueado por peones fijos, no hay peligro de contraataque central: ¡lanza una avalancha de peones en el flanco donde apuntan tus peones!",
            "fen": "rnbqkb1r/pppppp1p/5np1/8/2PPP3/8/PP3PPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkb1r/pppppp1p/5np1/8/2PPP3/8/PP3PPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Desarrolla tu Caballo a c3.",
            "solution": {
              "from": "b1",
              "to": "c3"
            },
            "hint": "Mueve tu caballo a c3.",
            "feedback": "¡Desarrollo central!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkb1r/pppppp1p/5np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq - 1 1",
            "instruction": "Paso 2: Sostén tu estructura con d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura india sólida!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkb1r/ppp1pp1p/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq - 0 2",
            "instruction": "Paso 3: Desarrolla tu Caballo a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f3.",
            "feedback": "¡Desarrollo completo!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkb1r/ppp1pp1p/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b KQkq - 1 2",
            "instruction": "Paso 4: Coloca tu Alfil en g7.",
            "solution": {
              "from": "f8",
              "to": "g7"
            },
            "hint": "Lleva tu alfil a g7.",
            "feedback": "¡Fianchetto completado!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R w KQkq - 2 3",
            "instruction": "Paso 5: Desarrolla tu Alfil a e2 preparando el enroque.",
            "solution": {
              "from": "f1",
              "to": "e2"
            },
            "hint": "Mueve el alfil a e2.",
            "feedback": "¡Centros cerrados dominados!"
          }
        ]
      },
      {
        "id": "l86_centro_abierto",
        "number": 86,
        "title": "El centro abierto y piezas activas",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Velocidad y Diagonales Libres",
            "text": "Sin peones centrales, las piezas de largo alcance (Alfiles, Torres y Dama) despliegan su máximo poder. ¡El bando más rápido al atacar se impone!",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 2"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 2",
            "instruction": "Paso 1: Juegas con negras. Abre el centro capturando en d4 con tu peón.",
            "solution": {
              "from": "e5",
              "to": "d4"
            },
            "hint": "Captura en d4 con el peón.",
            "feedback": "¡Centro abierto!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 3",
            "instruction": "Paso 2: Desarrolla tu Caballo a f6 atacando e4.",
            "solution": {
              "from": "g8",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Presión sobre e4!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 1 4",
            "instruction": "Paso 3: Clava el caballo de c3 con tu Alfil en b4.",
            "solution": {
              "from": "f8",
              "to": "b4"
            },
            "hint": "Mueve tu alfil a b4.",
            "feedback": "¡Clavada activa!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/8/1b1NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 5",
            "instruction": "Paso 4: Captura el caballo en c6 con tu Caballo.",
            "solution": {
              "from": "d4",
              "to": "c6"
            },
            "hint": "Captura en c6 con el caballo.",
            "feedback": "¡Intercambio central!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/p1pp1ppp/2p2n2/8/1b2P3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
            "instruction": "Paso 5: Desarrolla tu Alfil a d3 defendiendo tu peón central.",
            "solution": {
              "from": "f1",
              "to": "d3"
            },
            "hint": "Mueve el alfil a d3.",
            "feedback": "¡Centro abierto dominado!"
          }
        ]
      },
      {
        "id": "l87_estructura_carlsbad",
        "number": 87,
        "title": "Estructura Carlsbad y ataque de minorías",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Dos Peones Vencen a Tres",
            "text": "Avanzar tu minoría de peones a4-b4-b5 contra la mayoría rival b7-c6-d5 destruye la cadena negra y crea un peón débil aislado en c6.",
            "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1",
            "instruction": "Paso 1: Fija la estructura Carlsbad capturando en d5 con tu peón.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el peón.",
            "feedback": "¡Estructura Carlsbad formada!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqk2r/ppp1bppp/5n2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Alfil a g5 clavando al caballo de f6.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Clavada activa!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqk2r/ppp1bppp/5n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R b KQkq - 1 2",
            "instruction": "Paso 3: Juegas con negras. Sostén tu centro jugando c7-c6.",
            "solution": {
              "from": "c7",
              "to": "c6"
            },
            "hint": "Mueve el peón a c6.",
            "feedback": "¡Cadena de peones Carlsbad!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N2N2/PP2PPPP/R2QKB1R w KQkq - 0 3",
            "instruction": "Paso 4: Asegura tu centro con e2-e3.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el peón a e3.",
            "feedback": "¡Centro blindado!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N1PN2/PP3PPP/R2QKB1R b KQkq - 0 3",
            "instruction": "Paso 5: Enroca corto con negras.",
            "solution": {
              "from": "e8",
              "to": "g8"
            },
            "hint": "Mueve tu rey a g8.",
            "feedback": "¡Estructura Carlsbad dominada!"
          }
        ]
      },
      {
        "id": "l88_estructura_maroczy",
        "number": 88,
        "title": "Estructura Maróczy: Control de d5",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Abrazo de Hierro",
            "text": "Colocar peones blancos en c4 y e4 contra la Defensa Siciliana asfixia la casilla d5 impidiendo para siempre la ruptura liberadora de las negras.",
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Plantea el Muro de Maróczy jugando c2-c4.",
            "solution": {
              "from": "c2",
              "to": "c4"
            },
            "hint": "Avanza el peón a c4.",
            "feedback": "¡Estructura Maróczy iniciada!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pp1ppppp/8/2p5/2P1P3/8/PP1P1PPP/RNBQKBNR b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla tu Caballo a c6.",
            "solution": {
              "from": "b8",
              "to": "c6"
            },
            "hint": "Mueve tu caballo a c6.",
            "feedback": "¡Desarrollo siciliano!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/2P1P3/5N2/PP1P1PPP/RNBQKB1R w KQkq - 1 2",
            "instruction": "Paso 3: Golpea el centro con d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Apertura del centro!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkbnr/pp1ppppp/2n5/8/2PNP3/8/PP3PPP/RNBQKB1R b KQkq - 0 3",
            "instruction": "Paso 4: Juegas con negras. Prepara el fianchetto con g7-g6.",
            "solution": {
              "from": "g7",
              "to": "g6"
            },
            "hint": "Mueve el peón a g6.",
            "feedback": "¡Fianchetto siciliano!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkbnr/pp1ppp1p/2n3p1/8/2PNP3/2N5/PP3PPP/R1BQKB1R b KQkq - 1 4",
            "instruction": "Paso 5: Coloca tu Alfil en g7.",
            "solution": {
              "from": "f8",
              "to": "g7"
            },
            "hint": "Lleva tu alfil a g7.",
            "feedback": "¡Estructura Maróczy dominada!"
          }
        ]
      },
      {
        "id": "l89_ataque_enroque_avalancha",
        "number": 89,
        "title": "Ataque sobre el enroque con avalancha de peones",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "La Tormenta de Peones",
            "text": "Avanzar tus peones de g4-h4-h5 hacia el enroque rival abre columnas para tus Torres y pulveriza la defensa del Rey contrario.",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1",
            "instruction": "Paso 1: Prepara la avalancha en el flanco de rey con h2-h3.",
            "solution": {
              "from": "h2",
              "to": "h3"
            },
            "hint": "Avanza el peón a h3.",
            "feedback": "¡Preparación del avance!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQ - 0 1",
            "instruction": "Paso 2: Desarrolla el peón central a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa sólida!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQ - 0 2",
            "instruction": "Paso 3: Clava al caballo en f6 con tu Alfil en g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Clavada activa!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R b KQ - 1 2",
            "instruction": "Paso 4: Juegas con negras. Cuestiona al alfil con h7-h6.",
            "solution": {
              "from": "h7",
              "to": "h6"
            },
            "hint": "Avanza el peón a h6.",
            "feedback": "¡Pregunta al alfil!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/ppp2pp1/2np1n1p/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R w KQ - 0 3",
            "instruction": "Paso 5: Mantén la clavada retirando tu Alfil a h4.",
            "solution": {
              "from": "g5",
              "to": "h4"
            },
            "hint": "Mueve el alfil a h4.",
            "feedback": "¡Avalancha de peones dominada!"
          }
        ]
      },
      {
        "id": "l90_profilaxis_basica",
        "number": 90,
        "title": "Profilaxis básica: neutralizar planes rivales",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "Pensar por el Rival",
            "text": "La profilaxis es el arte de anticipar la amenaza o jugada del oponente y neutralizarla antes de que siquiera pueda llevarla a cabo.",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Juega h2-h3 para evitar para siempre la molesta clavada ...Ag4.",
            "solution": {
              "from": "h2",
              "to": "h3"
            },
            "hint": "Avanza el peón a h3.",
            "feedback": "¡Jugada profiláctica perfecta!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla tu peón a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Centro seguro!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2",
            "instruction": "Paso 3: Juega a2-a3 para darle una casilla de escape a tu alfil en a2 ante ...Ca5.",
            "solution": {
              "from": "a2",
              "to": "a3"
            },
            "hint": "Avanza el peón a a3.",
            "feedback": "¡Segunda profilaxis magistral!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R b KQkq - 0 2",
            "instruction": "Paso 4: Juegas con negras. Juega también profilácticamente a7-a6.",
            "solution": {
              "from": "a7",
              "to": "a6"
            },
            "hint": "Mueve el peón a a6.",
            "feedback": "¡Profilaxis recíproca!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/1pp2ppp/p1np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R w KQkq - 0 3",
            "instruction": "Paso 5: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Profilaxis básica dominada!"
          }
        ]
      },
      {
        "id": "l91_iqp_ataque",
        "number": 91,
        "title": "Peón de Dama Aislado (IQP): Dinamismo y Ataque",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Dinamita de d5",
            "text": "Tener un peón aislado otorga puestos avanzados en e5/c5 y la ruptura temática d4-d5 que dinamita la posición enemiga.",
            "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 1: Desarrolla tu Alfil a g5 clavando al caballo de f6.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Clavada activa!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pp3ppp/2n1pn2/3p2B1/3P4/2N2N2/PP2BPPP/R2Q1RK1 b - - 1 1",
            "instruction": "Paso 2: Juegas con negras. Juega h7-h6.",
            "solution": {
              "from": "h7",
              "to": "h6"
            },
            "hint": "Mueve el peón a h6.",
            "feedback": "¡Pregunta al alfil!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/pp3pp1/2n1pn1p/3p2B1/3P4/2N2N2/PP2BPPP/R2Q1RK1 w - - 0 2",
            "instruction": "Paso 3: Retira tu Alfil a h4 manteniendo la presión.",
            "solution": {
              "from": "g5",
              "to": "h4"
            },
            "hint": "Mueve el alfil a h4.",
            "feedback": "¡Presión continua!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/pp3pp1/2n1pn1p/3p4/3P3B/2N2N2/PP2BPPP/R2Q1RK1 b - - 1 2",
            "instruction": "Paso 4: Desarrolla tu Alfil a d7.",
            "solution": {
              "from": "c8",
              "to": "d7"
            },
            "hint": "Lleva el alfil a d7.",
            "feedback": "¡Desarrollo armónico!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/pp1b1pp1/2n1pn1p/3p4/3P3B/2N2N2/PP2BPPP/R2Q1RK1 w - - 2 3",
            "instruction": "Paso 5: Ocupa el puesto avanzado en e5 con tu Caballo.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Mueve tu caballo a e5.",
            "feedback": "¡Ataque con IQP dominado!"
          }
        ]
      },
      {
        "id": "l92_iqp_bloqueo",
        "number": 92,
        "title": "Peón de Dama Aislado (IQP): Bloqueo y Asedio",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "La Garra en d5",
            "text": "Contra el peón aislado, instala un Caballo firme en d5 (bloqueador absoluto), cambia las piezas menores y entra a un final ganado.",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 1: Desarrolla tu Alfil a e3 para vigilar la casilla d4.",
            "solution": {
              "from": "c1",
              "to": "e3"
            },
            "hint": "Mueve tu alfil a e3.",
            "feedback": "¡Control del centro!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N1BN2/PP2BPPP/R2Q1RK1 b - - 1 1",
            "instruction": "Paso 2: Desarrolla el caballo negro a f6.",
            "solution": {
              "from": "d7",
              "to": "f6"
            },
            "hint": "Mueve el caballo a f6.",
            "feedback": "¡Caballo al juego!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w - - 2 2",
            "instruction": "Paso 3: Conecta tus Torres llevando tu Dama a d2.",
            "solution": {
              "from": "d1",
              "to": "d2"
            },
            "hint": "Lleva tu dama a d2.",
            "feedback": "¡Torres conectadas!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2N1BN2/PP1QBPPP/R4RK1 b - - 3 2",
            "instruction": "Paso 4: Desarrolla el alfil negro a d7.",
            "solution": {
              "from": "c8",
              "to": "d7"
            },
            "hint": "Mueve el alfil a d7.",
            "feedback": "¡Desarrollo completo!"
          },
          {
            "id": "ex_5",
            "fen": "r2q1rk1/pp1bbppp/2n1pn2/3p4/3P4/2N1BN2/PP1QBPPP/R4RK1 w - - 4 3",
            "instruction": "Paso 5: Coloca tu Torre en d1 presionando la columna.",
            "solution": {
              "from": "f1",
              "to": "d1"
            },
            "hint": "Lleva tu torre a d1.",
            "feedback": "¡Graduación de Etapa 4 Completada con Éxito!"
          }
        ]
      }
    ]
  },
  {
    "id": "etapa-5-maestria-fide",
    "title": "ETAPA 5: MAESTRÍA YUSUPOV & NIVEL FIDE (1900 - 2200+ Elo)",
    "category": "maestria",
    "badge": "Gran Maestro Junvill",
    "eloRange": "1900 - 2200+ Elo",
    "lessons": [
      {
        "id": "l93_peones_colgantes",
        "number": 93,
        "title": "Peones colgantes (Hanging Pawns): Dinamismo vs Debilidad",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Dúo Dinámico",
            "text": "Los peones colgantes en c4 y d4 (o c5 y d5) controlan casillas vitales pero pueden volverse vulnerables si uno es obligado a avanzar.",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 1: Fija la estructura central capturando en d5 con tu peón.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el peón.",
            "feedback": "¡Estructura de peones fijada!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1",
            "instruction": "Paso 2: Juegas con negras. Golpea el centro con e6-e5.",
            "solution": {
              "from": "e6",
              "to": "e5"
            },
            "hint": "Avanza el peón a e5.",
            "feedback": "¡Ruptura central dinámica!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/pp1nbppp/2n5/3pp3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 2",
            "instruction": "Paso 3: Captura en e5 con tu peón.",
            "solution": {
              "from": "d4",
              "to": "e5"
            },
            "hint": "Captura en e5 con el peón.",
            "feedback": "¡Intercambio central!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/pp1nbppp/8/3pn3/8/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 3",
            "instruction": "Paso 4: Captura el caballo en e5 con tu Caballo.",
            "solution": {
              "from": "f3",
              "to": "e5"
            },
            "hint": "Captura en e5 con el caballo.",
            "feedback": "¡Simplificación calculada!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/pp1nbppp/8/3pn3/8/2N5/PP2BPPP/R1BQ1RK1 b - - 0 3",
            "instruction": "Paso 5: Desarrolla el caballo negro a f6.",
            "solution": {
              "from": "d7",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Peones colgantes dominados!"
          }
        ]
      },
      {
        "id": "l94_iniciativa_posicional",
        "number": 94,
        "title": "La iniciativa posicional por material",
        "category": "estrategia",
        "steps": [
          {
            "type": "theory",
            "title": "El Tiempo Sobre el Material",
            "text": "Kasparov enseñó que la iniciativa y la actividad de las piezas superan el valor estático de uno o dos peones en posiciones complejas.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Elimina el defensor en c6 capturándolo con tu Alfil.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Iniciativa blanca!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Golpea el centro con d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Centro dinámico!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Captura en d4.",
            "solution": {
              "from": "e5",
              "to": "d4"
            },
            "hint": "Captura en d4 con el peón.",
            "feedback": "¡Líneas abiertas!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2",
            "instruction": "Paso 4: Recaptura en d4 con tu Caballo.",
            "solution": {
              "from": "f3",
              "to": "d4"
            },
            "hint": "Captura en d4 con el caballo.",
            "feedback": "¡Caballo central dominante!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 5: Activa tu Alfil a a6.",
            "solution": {
              "from": "c8",
              "to": "a6"
            },
            "hint": "Mueve el alfil a a6.",
            "feedback": "¡Iniciativa posicional asimilada!"
          }
        ]
      },
      {
        "id": "l95_sacrificio_calidad",
        "number": 95,
        "title": "El sacrificio posicional de calidad (Torre por Alfil/Caballo)",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "La Joya de Petrosian",
            "text": "Entregar una Torre (5 pts) a cambio de un Alfil o Caballo monstruoso (3 pts) para dominar un color de casillas o una diagonal decisiva.",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1",
            "instruction": "Paso 1: Sacrifica material en d5 para ganar el centro.",
            "solution": {
              "from": "c4",
              "to": "d5"
            },
            "hint": "Captura en d5 con el alfil.",
            "feedback": "¡Presión sobre el centro negro!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/ppp2ppp/2n5/3B4/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 1",
            "instruction": "Paso 2: Juegas con negras. Mueve tu Caballo a e7.",
            "solution": {
              "from": "c6",
              "to": "e7"
            },
            "hint": "Mueve tu caballo a e7.",
            "feedback": "¡Defensa del centro!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/ppp1nppp/8/3B4/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 1 2",
            "instruction": "Paso 3: Sacrifica tu Alfil en f7 dando jaque.",
            "solution": {
              "from": "d5",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Sacrificio de calidad fulminante!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/ppp1nBpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 2",
            "instruction": "Paso 4: Captura el alfil en f7 con la torre.",
            "solution": {
              "from": "f8",
              "to": "f7"
            },
            "hint": "Captura en f7 con la torre.",
            "feedback": "¡Rey bajo fuego!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq2k1/ppp1nrpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 3",
            "instruction": "Paso 5: Captura la Dama negra en d8 con tu Dama.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Captura la dama en d8.",
            "feedback": "¡Sacrificio de calidad exitoso!"
          }
        ]
      },
      {
        "id": "l96_sacrificio_peon_diagonales",
        "number": 96,
        "title": "El sacrificio de peón por diagonales activas",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Abrir las Puertas de la Victoria",
            "text": "Entregar un peón en la apertura o medio juego para despejar una gran diagonal para tu pareja de Alfiles.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Inicia con d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza a d4.",
            "feedback": "¡Centro ocupado!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla tu Caballo a f6.",
            "solution": {
              "from": "g8",
              "to": "f6"
            },
            "hint": "Mueve tu caballo a f6.",
            "feedback": "¡Control a distancia!"
          },
          {
            "id": "ex_3",
            "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
            "instruction": "Paso 3: Juega el Gambito Benko ofreciendo el peón de c5.",
            "solution": {
              "from": "c7",
              "to": "c5"
            },
            "hint": "Mueve el peón a c5.",
            "feedback": "¡Gambito por diagonales planteado!"
          },
          {
            "id": "ex_4",
            "fen": "rnbqkb1r/pppppppp/5n2/2P5/8/8/PP2PPPP/RNBQKBNR b KQkq - 0 3",
            "instruction": "Paso 4: Abre la diagonal de tu Alfil con e7-e6.",
            "solution": {
              "from": "e7",
              "to": "e6"
            },
            "hint": "Avanza el peón a e6.",
            "feedback": "¡Diagonal liberada!"
          },
          {
            "id": "ex_5",
            "fen": "rnbqkb1r/pppp1ppp/4pn2/2P5/8/4P3/PP1P1PPP/RNBQKBNR b KQkq - 0 3",
            "instruction": "Paso 5: Recaptura el peón en c5 con tu Alfil.",
            "solution": {
              "from": "f8",
              "to": "c5"
            },
            "hint": "Captura en c5 con el alfil.",
            "feedback": "¡Diagonales dominadas!"
          }
        ]
      },
      {
        "id": "l97_profilaxis_avanzada",
        "number": 97,
        "title": "Profilaxis avanzada según Dvoretsky",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "El Pensamiento Preventivo",
            "text": "Mark Dvoretsky enseñó a preguntarse en cada jugada: \"¿Qué quiere hacer mi rival si no hago nada?\". Detener su plan es el camino de la maestría.",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Juega h2-h3 para frenar toda idea de ...Ag4 rival.",
            "solution": {
              "from": "h2",
              "to": "h3"
            },
            "hint": "Avanza el peón a h3.",
            "feedback": "¡Profilaxis preventiva!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla el peón central a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura equilibrada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2",
            "instruction": "Paso 3: Juega a2-a3 para proteger tu alfil.",
            "solution": {
              "from": "a2",
              "to": "a3"
            },
            "hint": "Avanza el peón a a3.",
            "feedback": "¡Profilaxis en ambos flancos!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R b KQkq - 0 2",
            "instruction": "Paso 4: Juegas con negras. Juega a7-a6.",
            "solution": {
              "from": "a7",
              "to": "a6"
            },
            "hint": "Mueve el peón a a6.",
            "feedback": "¡Prevención recíproca!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/1pp2ppp/p1np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R w KQkq - 0 3",
            "instruction": "Paso 5: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Profilaxis Dvoretsky dominada!"
          }
        ]
      },
      {
        "id": "l98_piezas_desequilibradas",
        "number": 98,
        "title": "Juego con material desequilibrado (Dama vs Torres/Piezas)",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Coordinación vs Poder Individual",
            "text": "Dos Torres coordinadas superan a una Dama; 3 piezas menores vencen a una Dama si están activas y dominan casillas clave.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Captura el caballo en c6 desequilibrando la estructura.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Desequilibrio iniciado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Sostén tu centro con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro seguro!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Juega d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa sólida!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey en seguridad!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1",
            "instruction": "Paso 5: Activa tu Alfil a g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Material desequilibrado dominado!"
          }
        ]
      },
      {
        "id": "l99_arbol_kotov",
        "number": 99,
        "title": "Cálculo estructurado: El Árbol de Variantes de Kotov",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Pensar como un Gran Maestro",
            "text": "Alexander Kotov enseñó a estructurar el cálculo: identifica todas las jugadas candidatas primero, calcula cada rama una sola vez y no dudes.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Calcula la variante directa Axf7+.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Primera rama del árbol calculada!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2",
            "instruction": "Paso 2: Calcula la segunda jugada candidata Dh5.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Ataque coordinado en el cálculo!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3",
            "instruction": "Paso 3: Retira tu Dama a h4 en la variante.",
            "solution": {
              "from": "h5",
              "to": "h4"
            },
            "hint": "Mueve tu dama a h4.",
            "feedback": "¡Cálculo preciso!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3",
            "instruction": "Paso 4: Juegas con negras. Defiende con g6-g5.",
            "solution": {
              "from": "g6",
              "to": "g5"
            },
            "hint": "Avanza el peón a g5.",
            "feedback": "¡Defensa calculada!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4",
            "instruction": "Paso 5: Captura el caballo en e4 con tu Dama.",
            "solution": {
              "from": "h4",
              "to": "e4"
            },
            "hint": "Captura en e4 con la dama.",
            "feedback": "¡Árbol de Kotov dominado!"
          }
        ]
      },
      {
        "id": "l100_jugadas_candidatas",
        "number": 100,
        "title": "El método de jugadas candidatas",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "No Muevas la Primera Jugada que Veas",
            "text": "Antes de mover, haz una lista mental de al menos 3 jugadas candidatas lógicas (Jaques, Capturas y Amenazas). ¡La mejor siempre surge de la comparación!",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Evalúa la jugada candidata Axc6.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Candidata Axc6 ejecutada!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Compara con la candidata d2-d4.",
            "solution": {
              "from": "d2",
              "to": "d4"
            },
            "hint": "Avanza el peón a d4.",
            "feedback": "¡Candidata central ejecutada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Captura en d4.",
            "solution": {
              "from": "e5",
              "to": "d4"
            },
            "hint": "Captura en d4 con el peón.",
            "feedback": "¡Respuesta óptima!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2",
            "instruction": "Paso 4: Recaptura en d4 con tu Caballo.",
            "solution": {
              "from": "f3",
              "to": "d4"
            },
            "hint": "Captura en d4 con el caballo.",
            "feedback": "¡Recaptura precisa!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2",
            "instruction": "Paso 5: Activa tu Alfil a a6.",
            "solution": {
              "from": "c8",
              "to": "a6"
            },
            "hint": "Mueve el alfil a a6.",
            "feedback": "¡Jugadas candidatas dominadas!"
          }
        ]
      },
      {
        "id": "l101_metodo_eliminacion",
        "number": 101,
        "title": "El método de eliminación en táctica",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Descartar para Triunfar",
            "text": "Sherlock Holmes decía: \"Cuando eliminas lo imposible, lo que queda, por improbable que parezca, debe ser la verdad\". Descarta las malas y encontrarás la jugada ganadora.",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1",
            "instruction": "Paso 1: Por eliminación, la única jugada ganadora directa es Txd8#.",
            "solution": {
              "from": "d2",
              "to": "d8"
            },
            "hint": "Captura en d8 con tu torre.",
            "feedback": "¡Jaque Mate por eliminación!"
          },
          {
            "id": "ex_2",
            "fen": "6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1",
            "instruction": "Paso 2: Da mate en la octava fila con Torre en d8.",
            "solution": {
              "from": "d1",
              "to": "d8"
            },
            "hint": "Mueve la torre a d8.",
            "feedback": "¡Mate del pasillo!"
          },
          {
            "id": "ex_3",
            "fen": "8/5p2/8/8/8/8/5K2/7k w - - 0 1",
            "instruction": "Paso 3: Avanza tu Rey a g3.",
            "solution": {
              "from": "f2",
              "to": "g3"
            },
            "hint": "Mueve el rey a g3.",
            "feedback": "¡Rey activo!"
          },
          {
            "id": "ex_4",
            "fen": "8/5p2/8/8/8/6K1/8/7k w - - 1 2",
            "instruction": "Paso 4: Lleva tu Rey a h3.",
            "solution": {
              "from": "g3",
              "to": "h3"
            },
            "hint": "Lleva el rey a h3.",
            "feedback": "¡Rey en posición ganadora!"
          },
          {
            "id": "ex_5",
            "fen": "8/5p2/8/8/8/7K/8/7k w - - 2 3",
            "instruction": "Paso 5: Mueve tu Rey a g4.",
            "solution": {
              "from": "h3",
              "to": "g4"
            },
            "hint": "Mueve el rey a g4.",
            "feedback": "¡Método de eliminación dominado!"
          }
        ]
      },
      {
        "id": "l102_tactica_maniobras_tranquilas",
        "number": 102,
        "title": "Táctica oculta en jugadas tranquilas (Stille Züge)",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "El Silencio que Mata",
            "text": "La táctica no sólo son sacrificios estruendosos; las jugadas más bellas y devastadoras son silenciosas maniobras sin jaque que amenazan un mate imparable.",
            "fen": "4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1",
            "instruction": "Paso 1: Da Jaque Mate en a8 con tu Torre.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Jaque Mate fulminante!"
          },
          {
            "id": "ex_2",
            "fen": "8/4P3/4K3/8/8/8/8/R6k w - - 0 1",
            "instruction": "Paso 2: Corona tu peón en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama.",
            "feedback": "¡Dama coronada!"
          },
          {
            "id": "ex_3",
            "fen": "8/4P3/8/8/8/8/8/R3K2k w - - 0 1",
            "instruction": "Paso 3: Corona en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Avanza a e8 coronando en Dama.",
            "feedback": "¡Coronación exitosa!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 4: Lleva tu Torre a a8 dando jaque.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Mueve la torre a a8.",
            "feedback": "¡Jaque en la 8ª fila!"
          },
          {
            "id": "ex_5",
            "fen": "R3k3/8/8/8/8/8/8/4K3 w - - 1 2",
            "instruction": "Paso 5: Acerca tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve el rey a e2.",
            "feedback": "¡Jugadas tranquilas dominadas!"
          }
        ]
      },
      {
        "id": "l103_transicion_finales_gm",
        "number": 103,
        "title": "Transición a finales de Gran Maestro",
        "category": "finales",
        "steps": [
          {
            "type": "theory",
            "title": "La Conversión Impecable",
            "text": "Un Gran Maestro calcula la simplificación exacta al final 10 jugadas antes, sabiendo con certeza matemática que la estructura resultante está ganada.",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
            "instruction": "Paso 1: Avanza tu Rey a e2.",
            "solution": {
              "from": "e1",
              "to": "e2"
            },
            "hint": "Mueve tu rey a e2.",
            "feedback": "¡Rey hacia el centro!"
          },
          {
            "id": "ex_2",
            "fen": "4k3/8/8/8/8/8/4K3/8 w - - 0 1",
            "instruction": "Paso 2: Continúa a e3 con tu Rey.",
            "solution": {
              "from": "e2",
              "to": "e3"
            },
            "hint": "Avanza el rey a e3.",
            "feedback": "¡Rey activo!"
          },
          {
            "id": "ex_3",
            "fen": "4k3/8/8/8/8/4K3/8/8 w - - 0 1",
            "instruction": "Paso 3: Avanza tu Rey a e4.",
            "solution": {
              "from": "e3",
              "to": "e4"
            },
            "hint": "Lleva el rey a e4.",
            "feedback": "¡Rey en el centro!"
          },
          {
            "id": "ex_4",
            "fen": "4k3/8/8/8/4K3/8/8/8 w - - 0 1",
            "instruction": "Paso 4: Infiltra tu Rey a e5.",
            "solution": {
              "from": "e4",
              "to": "e5"
            },
            "hint": "Mueve el rey a e5.",
            "feedback": "¡Rey dominante!"
          },
          {
            "id": "ex_5",
            "fen": "4k3/8/8/4K3/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5: Toma la oposición directa frente al rey negro.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Avanza a e6.",
            "feedback": "¡Final de Gran Maestro dominado!"
          }
        ]
      },
      {
        "id": "l104_conversion_ventajas_minimas",
        "number": 104,
        "title": "Conversión técnica de ventajas mínimas",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "El Estilo Karpov / Carlsen",
            "text": "Torturar al rival con una micro-ventaja posicional (mejor estructura o casilla) hasta provocar el error definitivo sin darle ningún contrajuego.",
            "fen": "8/8/8/4P3/8/8/8/4K2k w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "8/8/8/4P3/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 1: Avanza tu peón a e6 con técnica impecable.",
            "solution": {
              "from": "e5",
              "to": "e6"
            },
            "hint": "Mueve el peón a e6.",
            "feedback": "¡Avance técnico!"
          },
          {
            "id": "ex_2",
            "fen": "8/8/4P3/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 2: Continúa a e7 con el peón.",
            "solution": {
              "from": "e6",
              "to": "e7"
            },
            "hint": "Avanza a e7.",
            "feedback": "¡A un paso de la Dama!"
          },
          {
            "id": "ex_3",
            "fen": "8/4P3/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 3: Corona en Dama en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama.",
            "feedback": "¡Dama en el tablero!"
          },
          {
            "id": "ex_4",
            "fen": "4Q3/8/8/8/8/8/8/4K2k w - - 0 1",
            "instruction": "Paso 4: Centraliza tu Dama a e4.",
            "solution": {
              "from": "e8",
              "to": "e4"
            },
            "hint": "Mueve tu dama a e4.",
            "feedback": "¡Dama al centro!"
          },
          {
            "id": "ex_5",
            "fen": "8/8/8/8/4Q3/8/8/4K2k w - - 1 2",
            "instruction": "Paso 5: Da Jaque Mate en h7.",
            "solution": {
              "from": "e4",
              "to": "h7"
            },
            "hint": "Lleva la dama a h7.",
            "feedback": "¡Conversión de ventajas mínimas dominada!"
          }
        ]
      },
      {
        "id": "l105_presion_tiempo",
        "number": 105,
        "title": "Manejo del apuro de tiempo (Zeitnot)",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Mantener la Calma con Segundos",
            "text": "Cuando te quedan menos de 60 segundos en el reloj: haz jugadas forzadas, sólidas y sin complicaciones tácticas innecesarias.",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Juega una jugada sólida y rápida como h2-h3.",
            "solution": {
              "from": "h2",
              "to": "h3"
            },
            "hint": "Avanza el peón a h3.",
            "feedback": "¡Jugada segura y rápida!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1",
            "instruction": "Paso 2: Desarrolla el peón a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura reforzada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2",
            "instruction": "Paso 3: Enroca corto rápido de e1 a g1.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey seguro bajo presión de tiempo!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQ1RK1 b - - 0 1",
            "instruction": "Paso 4: Desarrolla tu Alfil a e6.",
            "solution": {
              "from": "c8",
              "to": "e6"
            },
            "hint": "Mueve el alfil a e6.",
            "feedback": "¡Pieza activa!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N1P/PPP2PPP/R1BQ1RK1 w - - 0 1",
            "instruction": "Paso 5: Clava al caballo en f6 con tu Alfil en g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Manejo del apuro de tiempo dominado!"
          }
        ]
      },
      {
        "id": "l106_psicologia_torneo",
        "number": 106,
        "title": "Psicología competitiva en partidas FIDE",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "La Batalla Mental",
            "text": "Lasker decía: \"El ajedrez es una lucha entre dos personas\". Juega al rival: crea problemas prácticos donde el oponente se sienta incómodo.",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Plantea la Variante del Cambio de la Ruy López jugando Axc6.",
            "solution": {
              "from": "b5",
              "to": "c6"
            },
            "hint": "Captura en c6 con el alfil.",
            "feedback": "¡Presión psicológica y estructural!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 2: Sostén tu centro con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Centro blindado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1",
            "instruction": "Paso 3: Juegas con negras. Juega d7-d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Defensa sólida!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 4: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Rey protegido!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1",
            "instruction": "Paso 5: Clava el caballo con tu Alfil en g4.",
            "solution": {
              "from": "c8",
              "to": "g4"
            },
            "hint": "Mueve el alfil a g4.",
            "feedback": "¡Psicología competitiva dominada!"
          }
        ]
      },
      {
        "id": "l107_analisis_propio",
        "number": 107,
        "title": "Análisis crítico post-mortem de partidas",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "Aprender de las Derrotas",
            "text": "Botvinnik creó la escuela soviética basada en el análisis riguroso de tus propias partidas. Descubre tus puntos de inflexión y errores típicos.",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            "instruction": "Paso 1: Analiza el golpe táctico Axf7+.",
            "solution": {
              "from": "c4",
              "to": "f7"
            },
            "hint": "Captura en f7 con el alfil.",
            "feedback": "¡Punto de inflexión analizado!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2",
            "instruction": "Paso 2: Analiza la entrada de Dama en h5.",
            "solution": {
              "from": "d1",
              "to": "h5"
            },
            "hint": "Lleva tu dama a h5.",
            "feedback": "¡Ataque coordinado verificado!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3",
            "instruction": "Paso 3: Analiza la retirada Dh4.",
            "solution": {
              "from": "h5",
              "to": "h4"
            },
            "hint": "Mueve tu dama a h4.",
            "feedback": "¡Profundidad en el análisis!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3",
            "instruction": "Paso 4: Juegas con negras. Analiza la defensa g6-g5.",
            "solution": {
              "from": "g6",
              "to": "g5"
            },
            "hint": "Avanza el peón a g5.",
            "feedback": "¡Defensa examinada!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4",
            "instruction": "Paso 5: Captura el caballo en e4 con tu Dama.",
            "solution": {
              "from": "h4",
              "to": "e4"
            },
            "hint": "Captura en e4 con la dama.",
            "feedback": "¡Análisis crítico post-mortem dominado!"
          }
        ]
      },
      {
        "id": "l108_preparacion_fide",
        "number": 108,
        "title": "Preparación de repertorio para torneos",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "El Arsenal del Campeón",
            "text": "Un repertorio FIDE completo cuenta con respuestas sólidas con blancas y negras contra 1.e4, 1.d4, 1.c4 y líneas secundarias.",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "instruction": "Paso 1: Muestra tu repertorio de 1.e4.",
            "solution": {
              "from": "e2",
              "to": "e4"
            },
            "hint": "Avanza el peón a e4.",
            "feedback": "¡1.e4 en el tablero!"
          },
          {
            "id": "ex_2",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "instruction": "Paso 2: Desarrolla tu Caballo a f3.",
            "solution": {
              "from": "g1",
              "to": "f3"
            },
            "hint": "Mueve tu caballo a f3.",
            "feedback": "¡Desarrollo estándar!"
          },
          {
            "id": "ex_3",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            "instruction": "Paso 3: Elige la Apertura Italiana con Ac4.",
            "solution": {
              "from": "f1",
              "to": "c4"
            },
            "hint": "Lleva tu alfil a c4.",
            "feedback": "¡Italiana seleccionada!"
          },
          {
            "id": "ex_4",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
            "instruction": "Paso 4: Sostén tu centro con d2-d3.",
            "solution": {
              "from": "d2",
              "to": "d3"
            },
            "hint": "Avanza el peón a d3.",
            "feedback": "¡Línea sólida!"
          },
          {
            "id": "ex_5",
            "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5",
            "instruction": "Paso 5: Enroca corto con blancas.",
            "solution": {
              "from": "e1",
              "to": "g1"
            },
            "hint": "Mueve tu rey a g1.",
            "feedback": "¡Repertorio de torneos dominado!"
          }
        ]
      },
      {
        "id": "l109_ataques_reyes_opuestos",
        "number": 109,
        "title": "Carrera de peones en enroques opuestos",
        "category": "tactica",
        "steps": [
          {
            "type": "theory",
            "title": "Ataque a Bayoneta",
            "text": "Con enroques en flancos opuestos no hay profilaxis que valga: ¡el primero en abrir líneas contra el Rey rival con sus peones da mate y gana!",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1",
            "instruction": "Paso 1: Lanza tu peón de \"h\" hacia adelante.",
            "solution": {
              "from": "h2",
              "to": "h3"
            },
            "hint": "Avanza el peón a h3.",
            "feedback": "¡Bayoneta en marcha!"
          },
          {
            "id": "ex_2",
            "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQ - 0 1",
            "instruction": "Paso 2: Desarrolla el peón a d6.",
            "solution": {
              "from": "d7",
              "to": "d6"
            },
            "hint": "Mueve el peón a d6.",
            "feedback": "¡Estructura consolidada!"
          },
          {
            "id": "ex_3",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQ - 0 2",
            "instruction": "Paso 3: Clava el caballo en f6 con tu Alfil en g5.",
            "solution": {
              "from": "c1",
              "to": "g5"
            },
            "hint": "Mueve tu alfil a g5.",
            "feedback": "¡Clavada demoledora!"
          },
          {
            "id": "ex_4",
            "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R b KQ - 1 2",
            "instruction": "Paso 4: Juegas con negras. Cuestiona al alfil con h7-h6.",
            "solution": {
              "from": "h7",
              "to": "h6"
            },
            "hint": "Avanza el peón a h6.",
            "feedback": "¡Pregunta al alfil!"
          },
          {
            "id": "ex_5",
            "fen": "r1bq1rk1/ppp2pp1/2np1n1p/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R w KQ - 0 3",
            "instruction": "Paso 5: Mantén la presión retirando tu Alfil a h4.",
            "solution": {
              "from": "g5",
              "to": "h4"
            },
            "hint": "Mueve el alfil a h4.",
            "feedback": "¡Carrera de enroques opuestos dominada!"
          }
        ]
      },
      {
        "id": "l110_gran_maestro_junvill",
        "number": 110,
        "title": "Graduación: Gran Maestro Junvill (Maestría Total)",
        "category": "maestria",
        "steps": [
          {
            "type": "theory",
            "title": "La Cumbre del Ajedrez",
            "text": "Has completado los 110 puntos de aprendizaje del currículo Junvill. Posees la visión táctica, cálculo y profundidad estratégica de un verdadero Maestro del Ajedrez.",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1"
          },
          {
            "id": "ex_1",
            "fen": "6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1",
            "instruction": "Paso 1 (Prueba Táctica Final): Remata con Jaque Mate en a8.",
            "solution": {
              "from": "a1",
              "to": "a8"
            },
            "hint": "Lleva tu torre a a8.",
            "feedback": "¡Jaque Mate perfecto!"
          },
          {
            "id": "ex_2",
            "fen": "r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4",
            "instruction": "Paso 2 (Prueba de Ataque): Asesta Jaque Mate en f7 con tu Dama.",
            "solution": {
              "from": "f3",
              "to": "f7"
            },
            "hint": "Captura en f7 con tu dama.",
            "feedback": "¡Jaque Mate!"
          },
          {
            "id": "ex_3",
            "fen": "5r1k/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1",
            "instruction": "Paso 3 (Prueba de Coordinación): Da Jaque Mate Árabe en g8.",
            "solution": {
              "from": "g1",
              "to": "g8"
            },
            "hint": "Lleva tu torre a g8.",
            "feedback": "¡Jaque Mate Árabe!"
          },
          {
            "id": "ex_4",
            "fen": "3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1",
            "instruction": "Paso 4 (Prueba de Finales): Corona tu peón en Dama protegida por tu Torre en e8.",
            "solution": {
              "from": "e7",
              "to": "e8",
              "promotion": "q"
            },
            "hint": "Corona en Dama en e8.",
            "feedback": "¡Dama coronada y defendida!"
          },
          {
            "id": "ex_5",
            "fen": "3k4/4Q3/4K3/8/8/8/8/8 w - - 0 1",
            "instruction": "Paso 5 (Graduación Absoluta): Asesta el Jaque Mate definitivo con tu Dama en d7.",
            "solution": {
              "from": "e7",
              "to": "d7"
            },
            "hint": "Da mate con tu dama en d7.",
            "feedback": "¡¡FELICITACIONES GRAN MAESTRO JUNVILL!! Has completado al 100% las 110 lecciones interactivas de la academia."
          }
        ]
      }
    ]
  }
];

export const getAllLessons = () => {
  return CURRICULUM_SECTIONS.flatMap(section => section.lessons);
};

export const getLessonById = (id) => {
  for (const section of CURRICULUM_SECTIONS) {
    const found = section.lessons.find(l => l.id === id);
    if (found) return found;
  }
  return null;
};

export const getSectionByLessonId = (id) => {
  return CURRICULUM_SECTIONS.find(section => 
    section.lessons.some(l => l.id === id)
  );
};
