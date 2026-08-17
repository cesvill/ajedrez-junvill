/**
 * Base de Datos de Retos de Entrenamiento Táctico y Problemas Junvill
 * Incluye problemas con Blancas y con Negras, con orientación y pistas progresivas en 4 niveles
 */

export const TRAINING_CATEGORIES = [
  {
    id: 'mate-en-1',
    title: 'Jaque Mate en 1 Jugada',
    subtitle: 'Encuentra el golpe definitivo para ganar la partida en un solo movimiento',
    icon: 'Crown',
    difficulty: 'Fácil',
    puzzles: [
      {
        id: 'm1_01',
        title: 'Mate del Pasillo (Blancas)',
        fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'a1', to: 'a8' },
        hints: [
          { level: 1, text: 'Observa la 8ª fila enemiga en el flanco de rey.', quadrant: 'kingside' },
          { level: 2, text: 'El rey negro está atrapado detrás de su propia muralla de peones (f7, g7, h7).', quadrant: 'kingside' },
          { level: 3, text: 'Mueve tu Torre blanca ubicada en a1.', square: 'a1' },
          { level: 4, text: '¡Juega Torre a a8! (1.Ta8#). Da jaque mate porque el rey no puede salir de la octava fila.', square: 'a8' }
        ],
        explanation: 'Las casillas de escape del rey negro están bloqueadas por sus propios peones.'
      },
      {
        id: 'm1_02',
        title: 'Mate del Pasillo (Negras)',
        fen: '4r1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1',
        turn: 'b',
        orientation: 'black',
        solution: { from: 'e8', to: 'e1' },
        hints: [
          { level: 1, text: 'Observa la 1ª fila blanca en el flanco de rey.', quadrant: 'white_camp' },
          { level: 2, text: 'El rey blanco no tiene casillas de escape por sus peones en f2, g2, h2.', quadrant: 'white_camp' },
          { level: 3, text: 'Mueve tu Torre negra en e8.', square: 'e8' },
          { level: 4, text: '¡Juega Torre a e1! (1...Te1#). Jaque mate imparable en la primera fila.', square: 'e1' }
        ],
        explanation: '¡Excelente contragolpe! El rey blanco cayó víctima del mate del pasillo.'
      },
      {
        id: 'm1_03',
        title: 'El Beso de la Muerte (Dama y Alfil)',
        fen: 'r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'h5', to: 'f7' },
        hints: [
          { level: 1, text: 'Examina el punto más débil en el enroque negro: la casilla f7.', quadrant: 'black_camp' },
          { level: 2, text: 'Tu Dama y tu Alfil de c4 convergen sobre la misma casilla indefensa.', quadrant: 'black_camp' },
          { level: 3, text: 'Mueve tu Dama blanca en h5.', square: 'h5' },
          { level: 4, text: '¡Juega Dama por f7! (1.Dxf7#). La dama da mate pegada al rey negro respaldada por el alfil.', square: 'f7' }
        ],
        explanation: 'El punto f7 al inicio solo está protegido por el rey, haciéndolo vulnerable a este ataque coordinado.'
      },
      {
        id: 'm1_04',
        title: 'Mate de Dama y Caballo',
        fen: '6k1/5Npp/8/8/8/8/8/4Q2K w - - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'e1', to: 'e8' },
        hints: [
          { level: 1, text: 'Dirige tu mirada a la octava fila del rey negro.', quadrant: 'black_camp' },
          { level: 2, text: 'El caballo en f7 quita las casillas de escape g8 y h8.', quadrant: 'black_camp' },
          { level: 3, text: 'Mueve tu Dama blanca en e1.', square: 'e1' },
          { level: 4, text: '¡Juega Dama a e8! (1.De8#). La combinación de Dama y Caballo asesta el jaque mate definitivo.', square: 'e8' }
        ],
        explanation: 'El caballo controla las casillas de fuga mientras la dama penetra en la última fila.'
      }
    ]
  },
  {
    id: 'piezas-colgadas',
    title: 'Piezas Desprotegidas y Táctica',
    subtitle: 'Aprende a capturar material gratuito y castigar los descuidos',
    icon: 'Target',
    difficulty: 'Fácil - Medio',
    puzzles: [
      {
        id: 'colgada_01',
        title: 'La Gran Diagonal de Alfil',
        fen: 'r3k2r/ppp2ppp/2n5/8/8/2B5/PPP2PPP/R3K2R w KQkq - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'c3', to: 'g7' },
        hints: [
          { level: 1, text: 'Observa el flanco de rey de las negras.', quadrant: 'kingside' },
          { level: 2, text: 'El peón en g7 no tiene defensores y al capturarlo atacarás la torre de h8.', quadrant: 'kingside' },
          { level: 3, text: 'Mueve tu Alfil blanco en c3.', square: 'c3' },
          { level: 4, text: '¡Juega Alfil por g7! (1.Axg7). Capturas un peón y dejas a la torre de h8 atrapada.', square: 'g7' }
        ],
        explanation: 'El alfil en c3 ejerce un dominio letal a lo largo de toda la gran diagonal a1-h8.'
      },
      {
        id: 'colgada_02',
        title: 'Jaque Doble de Dama (Blancas)',
        fen: 'r2qk2r/ppp2ppp/8/3n4/8/4P3/PP3PPP/R1BQK2R w KQkq - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'd1', to: 'a4' },
        hints: [
          { level: 1, text: 'Busca una jugada de Dama que cree dos amenazas simultáneas.', quadrant: 'queenside' },
          { level: 2, text: 'Desde la casilla a4 puedes dar jaque al rey y a la vez amenazar al caballo en d5.', quadrant: 'queenside' },
          { level: 3, text: 'Mueve tu Dama blanca en d1.', square: 'd1' },
          { level: 4, text: '¡Juega Dama a a4 jaque! (1.Da4+). Tras la respuesta del rival, capturarás el caballo de d5.', square: 'a4' }
        ],
        explanation: 'El jaque doble de dama es una de las tácticas más efectivas para ganar piezas desprotegidas.'
      },
      {
        id: 'colgada_03',
        title: 'Captura con Negras',
        fen: 'r3k2r/ppp2ppp/2n5/8/8/2N1bN2/PPP2PPP/R1B1K2R b KQkq - 0 1',
        turn: 'b',
        orientation: 'black',
        solution: { from: 'e3', to: 'c1' },
        hints: [
          { level: 1, text: 'Examina la primera fila de las blancas.', quadrant: 'white_camp' },
          { level: 2, text: 'Tu Alfil en e3 puede capturar una pieza enemiga indefensa en c1.', quadrant: 'white_camp' },
          { level: 3, text: 'Mueve tu Alfil negro en e3.', square: 'e3' },
          { level: 4, text: '¡Juega Alfil por c1! (1...Axc1). Capturas el alfil enemigo ganando ventaja material limpia.', square: 'c1' }
        ],
        explanation: 'Detectar piezas rivales indefensas es el pilar de la táctica práctica.'
      }
    ]
  },
  {
    id: 'clavadas-tenedores',
    title: 'Clavadas y Tenedores',
    subtitle: 'El arsenal táctico de maestros para inmovilizar y ganar piezas',
    icon: 'Zap',
    difficulty: 'Medio',
    puzzles: [
      {
        id: 'tac_01',
        title: 'Tenedor de Caballo (Gana la Dama)',
        fen: 'r3k2r/pppq1ppp/8/4N3/1b6/8/PPPP1PPP/R1B1KB1R w KQkq - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'e5', to: 'd7' },
        hints: [
          { level: 1, text: 'Busca una debilidad en la 7ª fila de las negras.', quadrant: 'center' },
          { level: 2, text: 'La dama negra en d7 está al alcance de tu caballo de e5.', quadrant: 'center' },
          { level: 3, text: 'Mueve tu Caballo blanco en e5.', square: 'e5' },
          { level: 4, text: '¡Juega Caballo por d7! (1.Cxd7). Capturas la dama rival ganando una ventaja decisiva.', square: 'd7' }
        ],
        explanation: 'Aprovechar piezas desprotegidas o mal colocadas con el caballo decide la partida.'
      },
      {
        id: 'tac_02',
        title: 'Ataque sobre Pieza Clavada',
        fen: 'r3k2r/pppq1ppp/2n5/1B6/8/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
        turn: 'w',
        orientation: 'white',
        solution: { from: 'b5', to: 'c6' },
        hints: [
          { level: 1, text: 'Examina el caballo negro en c6.', quadrant: 'queenside' },
          { level: 2, text: 'El caballo en c6 está clavado respecto a la dama de d7.', quadrant: 'queenside' },
          { level: 3, text: 'Mueve tu Alfil en b5.', square: 'b5' },
          { level: 4, text: '¡Juega Alfil por c6! (1.Axc6). Ganas el caballo ya que si la dama recaptura, cambiarás damas con ventaja.', square: 'c6' }
        ],
        explanation: 'Atacar una pieza clavada es un principio táctico elemental.'
      }
    ]
  }
];
