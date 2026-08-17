/**
 * Biblioteca de Aperturas Guiadas de Ajedrez Junvill
 * Repertorio interactivo con planes estratégicos, flechas tácticas y continuación contra bots.
 */

export const OPENINGS_CATALOG = [
  {
    id: 'italiana',
    name: 'Apertura Italiana (Giuoco Piano)',
    side: 'white',
    eco: 'C50',
    category: 'Abiertas (1.e4 e5)',
    difficulty: 'Principiante',
    badge: 'Fundamental',
    color: '#2563eb',
    description: 'La apertura clásica por excelencia. Desarrolla piezas rápidamente apuntando al punto débil f7 del rey negro.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      {
        san: 'e4',
        from: 'e2',
        to: 'e4',
        title: '1. Ocupar el Centro (e4)',
        coachNote: 'Avanzamos el peón de rey dos casillas para controlar el centro (d5 y f5) y liberar las diagonales de la Dama y el Alfil.',
        arrow: { from: 'e2', to: 'e4', color: '#10b981' }
      },
      {
        botResponse: { san: 'e5', from: 'e7', to: 'e5' },
        botNote: 'Las negras responden igualando el control central y abriendo paso a sus piezas.'
      },
      {
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        title: '2. Desarrollar y Atacar (Cf3)',
        coachNote: 'Desarrollamos el caballo hacia el centro. No solo es una pieza activa, ¡sino que presiona directamente el peón de e5!',
        arrow: { from: 'g1', to: 'f3', color: '#3b82f6' }
      },
      {
        botResponse: { san: 'Nc6', from: 'b8', to: 'c6' },
        botNote: 'Las negras defienden su peón central con su Caballo de dama.'
      },
      {
        san: 'Bc4',
        from: 'f1',
        to: 'c4',
        title: '3. El Alfil Italiano (Ac4)',
        coachNote: '¡El movimiento clave! El Alfil se coloca en la gran diagonal a2-g8, apuntando a la casilla f7, el punto más vulnerable del rey negro.',
        arrow: { from: 'f1', to: 'c4', color: '#f59e0b' }
      },
      {
        botResponse: { san: 'Bc5', from: 'f8', to: 'c5' },
        botNote: 'Las negras desarrollan su propio alfil en Giuoco Piano.'
      },
      {
        san: 'c3',
        from: 'c2',
        to: 'c3',
        title: '4. Preparar el Gran Centro (c3)',
        coachNote: 'Jugamos c3 para apoyar el futuro avance d2-d4 y crear un muro de peones indestructible en el centro.',
        arrow: { from: 'c2', to: 'c3', color: '#8b5cf6' }
      },
      {
        botResponse: { san: 'Nf6', from: 'g8', to: 'f6' },
        botNote: 'Las negras contraatacan nuestro peón de e4.'
      },
      {
        san: 'd4',
        from: 'd2',
        to: 'd4',
        title: '5. ¡Ruptura Central! (d4)',
        coachNote: '¡Golpe al centro! Atacamos el alfil negro y el peón de e5, dominando las casillas clave del tablero.',
        arrow: { from: 'd2', to: 'd4', color: '#ef4444' }
      }
    ]
  },
  {
    id: 'ruy_lopez',
    name: 'Apertura Española (Ruy López)',
    side: 'white',
    eco: 'C60',
    category: 'Abiertas (1.e4 e5)',
    difficulty: 'Intermedio',
    badge: 'Estratégica',
    color: '#d97706',
    description: 'La apertura favorita de los campeones mundiales. Presiona indirectamente el peón de e5 atacando a su defensor en c6.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      {
        san: 'e4',
        from: 'e2',
        to: 'e4',
        title: '1. Peón de Rey (e4)',
        coachNote: 'Iniciamos con el control del centro.',
        arrow: { from: 'e2', to: 'e4', color: '#10b981' }
      },
      {
        botResponse: { san: 'e5', from: 'e7', to: 'e5' },
        botNote: 'Las negras disputan el centro.'
      },
      {
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        title: '2. Caballo activo (Cf3)',
        coachNote: 'Atacamos el peón e5 de inmediato.',
        arrow: { from: 'g1', to: 'f3', color: '#3b82f6' }
      },
      {
        botResponse: { san: 'Nc6', from: 'b8', to: 'c6' },
        botNote: 'Las negras defienden con su caballo.'
      },
      {
        san: 'Bb5',
        from: 'f1',
        to: 'b5',
        title: '3. El Alfil Español (Ab5)',
        coachNote: '¡La jugada Ruy López! Clavamos y amenazamos al defensor del peón central.',
        arrow: { from: 'f1', to: 'b5', color: '#f59e0b' }
      },
      {
        botResponse: { san: 'a6', from: 'a7', to: 'a6' },
        botNote: 'Defensa Morphy: las negras preguntan las intenciones a nuestro alfil.'
      },
      {
        san: 'Ba4',
        from: 'b5',
        to: 'a4',
        title: '4. Retirada Táctica (Aa4)',
        coachNote: 'Mantenemos la presión sobre el caballo sin entregar la pareja de alfiles.',
        arrow: { from: 'b5', to: 'a4', color: '#10b981' }
      },
      {
        botResponse: { san: 'Nf6', from: 'g8', to: 'f6' },
        botNote: 'Las negras atacan nuestro peón de e4.'
      },
      {
        san: 'O-O',
        from: 'e1',
        to: 'g1',
        title: '5. Enroque Corto (0-0)',
        coachNote: '¡Rey seguro y torre en juego! Si las negras capturan en e4, la columna abierta nos dará un ataque letal.',
        arrow: { from: 'e1', to: 'g1', color: '#3b82f6' }
      }
    ]
  },
  {
    id: 'siciliana',
    name: 'Defensa Siciliana (Variante Abierta)',
    side: 'black',
    eco: 'B20',
    category: 'Semiabiertas (1.e4 c5)',
    difficulty: 'Avanzado',
    badge: 'Combativa',
    color: '#dc2626',
    description: 'La respuesta más agresiva y con mayor porcentaje de victoria para las negras contra 1.e4. Crea un juego asimétrico y dinámico.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      {
        botResponse: { san: 'e4', from: 'e2', to: 'e4' },
        botNote: 'Las blancas abren con peón de rey.'
      },
      {
        san: 'c5',
        from: 'c7',
        to: 'c5',
        title: '1. Golpe Asimétrico (c5)',
        coachNote: '¡La Defensa Siciliana! Luchamos por la casilla d4 con un peón lateral, preparando la apertura de la columna \"c\".',
        arrow: { from: 'c7', to: 'c5', color: '#ef4444' }
      },
      {
        botResponse: { san: 'Nf3', from: 'g1', to: 'f3' },
        botNote: 'Las blancas preparan el avance d2-d4.'
      },
      {
        san: 'd6',
        from: 'd7',
        to: 'd6',
        title: '2. Estructura Flexible (d6)',
        coachNote: 'Controlamos la casilla e5 y abrimos paso para desarrollar el alfil de casillas blancas.',
        arrow: { from: 'd7', to: 'd6', color: '#f59e0b' }
      },
      {
        botResponse: { san: 'd4', from: 'd2', to: 'd4' },
        botNote: 'Las blancas abren el centro.'
      },
      {
        san: 'cxd4',
        from: 'c5',
        to: 'd4',
        title: '3. Cambio Favorable (cxd4)',
        coachNote: '¡Excelente! Cambiamos un peón de flanco (c) por un peón central blanco (d) y obtenemos la columna semiabierta \"c\".',
        arrow: { from: 'c5', to: 'd4', color: '#10b981' }
      },
      {
        botResponse: { san: 'Nxd4', from: 'f3', to: 'd4' },
        botNote: 'El caballo blanco retoma en d4.'
      },
      {
        san: 'Nf6',
        from: 'g8',
        to: 'f6',
        title: '4. Presión Inmediata (Cf6)',
        coachNote: 'Desarrollamos el caballo atacando el peón desprotegido de e4.',
        arrow: { from: 'g8', to: 'f6', color: '#3b82f6' }
      },
      {
        botResponse: { san: 'Nc3', from: 'b1', to: 'c3' },
        botNote: 'Las blancas defienden e4.'
      },
      {
        san: 'a6',
        from: 'a7',
        to: 'a6',
        title: '5. La Variante Najdorf (a6)',
        coachNote: '¡La legendaria variante Najdorf de Kasparov y Fischer! Controla b5 y prepara la expansión en el flanco de dama con b7-b5.',
        arrow: { from: 'a7', to: 'a6', color: '#8b5cf6' }
      }
    ]
  },
  {
    id: 'londres',
    name: 'Sistema Londres',
    side: 'white',
    eco: 'D02',
    category: 'Cerradas (1.d4 d5)',
    difficulty: 'Principiante',
    badge: 'Muro Sólido',
    color: '#059669',
    description: 'Un sistema moderno y ultrasólido ideal para todas las edades. Fácil de recordar y garantiza una posición segura y armoniosa.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      {
        san: 'd4',
        from: 'e2',
        to: 'd4',
        title: '1. Peón de Dama (d4)',
        coachNote: 'Controlamos las casillas e5 y c5 desde el primer turno.',
        arrow: { from: 'd2', to: 'd4', color: '#10b981' }
      },
      {
        botResponse: { san: 'd5', from: 'd7', to: 'd5' },
        botNote: 'Las negras igualan en el centro.'
      },
      {
        san: 'Bf4',
        from: 'c1',
        to: 'f4',
        title: '2. El Alfil de Londres (Af4)',
        coachNote: '¡La marca del Sistema Londres! Desarrollamos el Alfil fuera de la cadena de peones antes de jugar e2-e3.',
        arrow: { from: 'c1', to: 'f4', color: '#059669' }
      },
      {
        botResponse: { san: 'Nf6', from: 'g8', to: 'f6' },
        botNote: 'Las negras desarrollan el flanco de rey.'
      },
      {
        san: 'e3',
        from: 'e2',
        to: 'e3',
        title: '3. Cerrar la Pirámide (e3)',
        coachNote: 'Sólida cadena de peones que defiende d4 y abre la diagonal para nuestro alfil de f1.',
        arrow: { from: 'e2', to: 'e3', color: '#3b82f6' }
      },
      {
        botResponse: { san: 'e6', from: 'e7', to: 'e6' },
        botNote: 'Las negras preparan su alfil.'
      },
      {
        san: 'Nf3',
        from: 'g1',
        to: 'f3',
        title: '4. Caballo Fuerte (Cf3)',
        coachNote: 'Controlamos la casilla central e5 y preparamos el enroque.',
        arrow: { from: 'g1', to: 'f3', color: '#f59e0b' }
      },
      {
        botResponse: { san: 'Bd6', from: 'f8', to: 'd6' },
        botNote: 'Las negras desafían nuestro alfil.'
      },
      {
        san: 'Bg3',
        from: 'f4',
        to: 'g3',
        title: '5. Retirada Estratégica (Ag3)',
        coachNote: '¡Maestría posicional! Si las negras cambian en g3, abriremos la columna \"h\" para nuestra torre.',
        arrow: { from: 'f4', to: 'g3', color: '#10b981' }
      }
    ]
  },
  {
    id: 'gambito_dama',
    name: 'Gambito de Dama (Declinado)',
    side: 'white',
    eco: 'D30',
    category: 'Cerradas (1.d4 d5)',
    difficulty: 'Intermedio',
    badge: 'Clásica',
    color: '#9333ea',
    description: 'El gambito más prestigioso de la historia. Ofrecemos un peón en c4 para desviar el centro negro y dominar el tablero.',
    initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moves: [
      {
        san: 'd4',
        from: 'd2',
        to: 'd4',
        title: '1. Peón de Dama (d4)',
        coachNote: 'Ocupamos el centro.',
        arrow: { from: 'd2', to: 'd4', color: '#10b981' }
      },
      {
        botResponse: { san: 'd5', from: 'd7', to: 'd5' },
        botNote: 'Las negras responden en el centro.'
      },
      {
        san: 'c4',
        from: 'c2',
        to: 'c4',
        title: '2. ¡El Gambito de Dama! (c4)',
        coachNote: 'Atacamos el peón negro de d5. Si lo capturan, dominaremos el centro con e2-e4.',
        arrow: { from: 'c2', to: 'c4', color: '#9333ea' }
      },
      {
        botResponse: { san: 'e6', from: 'e7', to: 'e6' },
        botNote: 'Gambito Declinado: las negras defienden d5 sólidamente.'
      },
      {
        san: 'Nc3',
        from: 'b1',
        to: 'c3',
        title: '3. Presión en d5 (Cc3)',
        coachNote: 'Aumentamos la presión sobre la casilla d5.',
        arrow: { from: 'b1', to: 'c3', color: '#3b82f6' }
      },
      {
        botResponse: { san: 'Nf6', from: 'g8', to: 'f6' },
        botNote: 'Las negras refuerzan su defensa.'
      },
      {
        san: 'Bg5',
        from: 'c1',
        to: 'g5',
        title: '4. Clavada Magistral (Ag5)',
        coachNote: '¡Clavamos el caballo negro! No puede moverse sin exponer a su Dama.',
        arrow: { from: 'c1', to: 'g5', color: '#ef4444' }
      }
    ]
  }
];

export const getOpeningById = (id) => OPENINGS_CATALOG.find(o => o.id === id) || OPENINGS_CATALOG[0];
