export function getStage5(ex, th) {
  return {
    id: 'etapa-5-maestria-fide',
    title: 'ETAPA 5: MAESTRÍA YUSUPOV & NIVEL FIDE (1900 - 2200+ Elo)',
    category: 'maestria',
    badge: 'Gran Maestro Junvill',
    eloRange: '1900 - 2200+ Elo',
    lessons: [
      {
        id: 'l93_peones_colgantes',
        number: 93,
        title: 'Peones colgantes (Hanging Pawns): Dinamismo vs Debilidad',
        category: 'estrategia',
        steps: [
          th('El Dúo Dinámico', 'Los peones colgantes en c4 y d4 (o c5 y d5) controlan casillas vitales pero pueden volverse vulnerables si uno es obligado a avanzar.', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1'),
          ex('ex_1', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1', 'c4', 'd5', 'Paso 1: Fija la estructura central capturando en d5 con tu peón.', 'Captura en d5 con el peón.', '¡Estructura de peones fijada!'),
          ex('ex_2', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1', 'e6', 'e5', 'Paso 2: Juegas con negras. Golpea el centro con e6-e5.', 'Avanza el peón a e5.', '¡Ruptura central dinámica!'),
          ex('ex_3', 'r1bq1rk1/pp1nbppp/2n5/3pp3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 2', 'd4', 'e5', 'Paso 3: Captura en e5 con tu peón.', 'Captura en e5 con el peón.', '¡Intercambio central!'),
          ex('ex_4', 'r1bq1rk1/pp1nbppp/8/3pn3/8/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 3', 'f3', 'e5', 'Paso 4: Captura el caballo en e5 con tu Caballo.', 'Captura en e5 con el caballo.', '¡Simplificación calculada!'),
          ex('ex_5', 'r1bq1rk1/pp1nbppp/8/3pn3/8/2N5/PP2BPPP/R1BQ1RK1 b - - 0 3', 'd7', 'f6', 'Paso 5: Desarrolla el caballo negro a f6.', 'Mueve tu caballo a f6.', '¡Peones colgantes dominados!')
        ]
      },
      {
        id: 'l94_iniciativa_posicional',
        number: 94,
        title: 'La iniciativa posicional por material',
        category: 'estrategia',
        steps: [
          th('El Tiempo Sobre el Material', 'Kasparov enseñó que la iniciativa y la actividad de las piezas superan el valor estático de uno o dos peones en posiciones complejas.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Elimina el defensor en c6 capturándolo con tu Alfil.', 'Captura en c6 con el alfil.', '¡Iniciativa blanca!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd4', 'Paso 2: Golpea el centro con d2-d4.', 'Avanza el peón a d4.', '¡Centro dinámico!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'e5', 'd4', 'Paso 3: Juegas con negras. Captura en d4.', 'Captura en d4 con el peón.', '¡Líneas abiertas!'),
          ex('ex_4', 'r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2', 'f3', 'd4', 'Paso 4: Recaptura en d4 con tu Caballo.', 'Captura en d4 con el caballo.', '¡Caballo central dominante!'),
          ex('ex_5', 'r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2', 'c8', 'a6', 'Paso 5: Activa tu Alfil a a6.', 'Mueve el alfil a a6.', '¡Iniciativa posicional asimilada!')
        ]
      },
      {
        id: 'l95_sacrificio_calidad',
        number: 95,
        title: 'El sacrificio posicional de calidad (Torre por Alfil/Caballo)',
        category: 'maestria',
        steps: [
          th('La Joya de Petrosian', 'Entregar una Torre (5 pts) a cambio de un Alfil o Caballo monstruoso (3 pts) para dominar un color de casillas o una diagonal decisiva.', 'r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1'),
          ex('ex_1', 'r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1', 'c4', 'd5', 'Paso 1: Sacrifica material en d5 para ganar el centro.', 'Captura en d5 con el alfil.', '¡Presión sobre el centro negro!'),
          ex('ex_2', 'r1bq1rk1/ppp2ppp/2n5/3B4/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 1', 'c6', 'e7', 'Paso 2: Juegas con negras. Mueve tu Caballo a e7.', 'Mueve tu caballo a e7.', '¡Defensa del centro!'),
          ex('ex_3', 'r1bq1rk1/ppp1nppp/8/3B4/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 1 2', 'd5', 'f7', 'Paso 3: Sacrifica tu Alfil en f7 dando jaque.', 'Captura en f7 con el alfil.', '¡Sacrificio de calidad fulminante!'),
          ex('ex_4', 'r1bq1rk1/ppp1nBpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 2', 'f8', 'f7', 'Paso 4: Captura el alfil en f7 con la torre.', 'Captura en f7 con la torre.', '¡Rey bajo fuego!'),
          ex('ex_5', 'r1bq2k1/ppp1nrpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 3', 'd1', 'd8', 'Paso 5: Captura la Dama negra en d8 con tu Dama.', 'Captura la dama en d8.', '¡Sacrificio de calidad exitoso!')
        ]
      },
      {
        id: 'l96_sacrificio_peon_diagonales',
        number: 96,
        title: 'El sacrificio de peón por diagonales activas',
        category: 'maestria',
        steps: [
          th('Abrir las Puertas de la Victoria', 'Entregar un peón en la apertura o medio juego para despejar una gran diagonal para tu pareja de Alfiles.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'd2', 'd4', 'Paso 1: Inicia con d2-d4.', 'Avanza a d4.', '¡Centro ocupado!'),
          ex('ex_2', 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1', 'g8', 'f6', 'Paso 2: Desarrolla tu Caballo a f6.', 'Mueve tu caballo a f6.', '¡Control a distancia!'),
          ex('ex_3', 'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2', 'c7', 'c5', 'Paso 3: Juega el Gambito Benko ofreciendo el peón de c5.', 'Mueve el peón a c5.', '¡Gambito por diagonales planteado!'),
          ex('ex_4', 'rnbqkb1r/pppppppp/5n2/2P5/8/8/PP2PPPP/RNBQKBNR b KQkq - 0 3', 'e7', 'e6', 'Paso 4: Abre la diagonal de tu Alfil con e7-e6.', 'Avanza el peón a e6.', '¡Diagonal liberada!'),
          ex('ex_5', 'rnbqkb1r/pppp1ppp/4pn2/2P5/8/4P3/PP1P1PPP/RNBQKBNR b KQkq - 0 3', 'f8', 'c5', 'Paso 5: Recaptura el peón en c5 con tu Alfil.', 'Captura en c5 con el alfil.', '¡Diagonales dominadas!')
        ]
      },
      {
        id: 'l97_profilaxis_avanzada',
        number: 97,
        title: 'Profilaxis avanzada según Dvoretsky',
        category: 'maestria',
        steps: [
          th('El Pensamiento Preventivo', 'Mark Dvoretsky enseñó a preguntarse en cada jugada: "¿Qué quiere hacer mi rival si no hago nada?". Detener su plan es el camino de la maestría.', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'h2', 'h3', 'Paso 1: Juega h2-h3 para frenar toda idea de ...Ag4 rival.', 'Avanza el peón a h3.', '¡Profilaxis preventiva!'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla el peón central a d6.', 'Mueve el peón a d6.', '¡Estructura equilibrada!'),
          ex('ex_3', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2', 'a2', 'a3', 'Paso 3: Juega a2-a3 para proteger tu alfil.', 'Avanza el peón a a3.', '¡Profilaxis en ambos flancos!'),
          ex('ex_4', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R b KQkq - 0 2', 'a7', 'a6', 'Paso 4: Juegas con negras. Juega a7-a6.', 'Mueve el peón a a6.', '¡Prevención recíproca!'),
          ex('ex_5', 'r1bqk2r/1pp2ppp/p1np1n2/2b1p3/2B1P3/P1NP1N1P/1PP2PPP/R1BQK2R w KQkq - 0 3', 'e1', 'g1', 'Paso 5: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Profilaxis Dvoretsky dominada!')
        ]
      },
      {
        id: 'l98_piezas_desequilibradas',
        number: 98,
        title: 'Juego con material desequilibrado (Dama vs Torres/Piezas)',
        category: 'maestria',
        steps: [
          th('Coordinación vs Poder Individual', 'Dos Torres coordinadas superan a una Dama; 3 piezas menores vencen a una Dama si están activas y dominan casillas clave.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Captura el caballo en c6 desequilibrando la estructura.', 'Captura en c6 con el alfil.', '¡Desequilibrio iniciado!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd3', 'Paso 2: Sostén tu centro con d2-d3.', 'Avanza el peón a d3.', '¡Centro seguro!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Juegas con negras. Juega d7-d6.', 'Mueve el peón a d6.', '¡Defensa sólida!'),
          ex('ex_4', 'r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey en seguridad!'),
          ex('ex_5', 'r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Activa tu Alfil a g4.', 'Mueve el alfil a g4.', '¡Material desequilibrado dominado!')
        ]
      },
      {
        id: 'l99_arbol_kotov',
        number: 99,
        title: 'Cálculo estructurado: El Árbol de Variantes de Kotov',
        category: 'maestria',
        steps: [
          th('Pensar como un Gran Maestro', 'Alexander Kotov enseñó a estructurar el cálculo: identifica todas las jugadas candidatas primero, calcula cada rama una sola vez y no dudes.', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'c4', 'f7', 'Paso 1: Calcula la variante directa Axf7+.', 'Captura en f7 con el alfil.', '¡Primera rama del árbol calculada!'),
          ex('ex_2', 'r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2', 'd1', 'h5', 'Paso 2: Calcula la segunda jugada candidata Dh5.', 'Lleva tu dama a h5.', '¡Ataque coordinado en el cálculo!'),
          ex('ex_3', 'r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3', 'h5', 'h4', 'Paso 3: Retira tu Dama a h4 en la variante.', 'Mueve tu dama a h4.', '¡Cálculo preciso!'),
          ex('ex_4', 'r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3', 'g6', 'g5', 'Paso 4: Juegas con negras. Defiende con g6-g5.', 'Avanza el peón a g5.', '¡Defensa calculada!'),
          ex('ex_5', 'r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4', 'h4', 'e4', 'Paso 5: Captura el caballo en e4 con tu Dama.', 'Captura en e4 con la dama.', '¡Árbol de Kotov dominado!')
        ]
      },
      {
        id: 'l100_jugadas_candidatas',
        number: 100,
        title: 'El método de jugadas candidatas',
        category: 'maestria',
        steps: [
          th('No Muevas la Primera Jugada que Veas', 'Antes de mover, haz una lista mental de al menos 3 jugadas candidatas lógicas (Jaques, Capturas y Amenazas). ¡La mejor siempre surge de la comparación!', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Evalúa la jugada candidata Axc6.', 'Captura en c6 con el alfil.', '¡Candidata Axc6 ejecutada!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd4', 'Paso 2: Compara con la candidata d2-d4.', 'Avanza el peón a d4.', '¡Candidata central ejecutada!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'e5', 'd4', 'Paso 3: Juegas con negras. Captura en d4.', 'Captura en d4 con el peón.', '¡Respuesta óptima!'),
          ex('ex_4', 'r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2', 'f3', 'd4', 'Paso 4: Recaptura en d4 con tu Caballo.', 'Captura en d4 con el caballo.', '¡Recaptura precisa!'),
          ex('ex_5', 'r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2', 'c8', 'a6', 'Paso 5: Activa tu Alfil a a6.', 'Mueve el alfil a a6.', '¡Jugadas candidatas dominadas!')
        ]
      },
      {
        id: 'l101_metodo_eliminacion',
        number: 101,
        title: 'El método de eliminación en táctica',
        category: 'maestria',
        steps: [
          th('Descartar para Triunfar', 'Sherlock Holmes decía: "Cuando eliminas lo imposible, lo que queda, por improbable que parezca, debe ser la verdad". Descarta las malas y encontrarás la jugada ganadora.', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1'),
          ex('ex_1', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1', 'd2', 'd8', 'Paso 1: Por eliminación, la única jugada ganadora directa es Txd8#.', 'Captura en d8 con tu torre.', '¡Jaque Mate por eliminación!'),
          ex('ex_2', '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', 'd1', 'd8', 'Paso 2: Da mate en la octava fila con Torre en d8.', 'Mueve la torre a d8.', '¡Mate del pasillo!'),
          ex('ex_3', '8/5p2/8/8/8/8/5K2/7k w - - 0 1', 'f2', 'g3', 'Paso 3: Avanza tu Rey a g3.', 'Mueve el rey a g3.', '¡Rey activo!'),
          ex('ex_4', '8/5p2/8/8/8/6K1/8/7k w - - 1 2', 'g3', 'h3', 'Paso 4: Lleva tu Rey a h3.', 'Lleva el rey a h3.', '¡Rey en posición ganadora!'),
          ex('ex_5', '8/5p2/8/8/8/7K/8/7k w - - 2 3', 'h3', 'g4', 'Paso 5: Mueve tu Rey a g4.', 'Mueve el rey a g4.', '¡Método de eliminación dominado!')
        ]
      },
      {
        id: 'l102_tactica_maniobras_tranquilas',
        number: 102,
        title: 'Táctica oculta en jugadas tranquilas (Stille Züge)',
        category: 'maestria',
        steps: [
          th('El Silencio que Mata', 'La táctica no sólo son sacrificios estruendosos; las jugadas más bellas y devastadoras son silenciosas maniobras sin jaque que amenazan un mate imparable.', '4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1'),
          ex('ex_1', '4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1', 'a1', 'a8', 'Paso 1: Da Jaque Mate en a8 con tu Torre.', 'Lleva tu torre a a8.', '¡Jaque Mate fulminante!'),
          ex('ex_2', '8/4P3/4K3/8/8/8/8/R6k w - - 0 1', 'e7', 'e8', 'Paso 2: Corona tu peón en Dama en e8.', 'Corona en Dama.', '¡Dama coronada!', 'q'),
          ex('ex_3', '8/4P3/8/8/8/8/8/R3K2k w - - 0 1', 'e7', 'e8', 'Paso 3: Corona en Dama en e8.', 'Avanza a e8 coronando en Dama.', '¡Coronación exitosa!', 'q'),
          ex('ex_4', '4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 4: Lleva tu Torre a a8 dando jaque.', 'Mueve la torre a a8.', '¡Jaque en la 8ª fila!'),
          ex('ex_5', 'R3k3/8/8/8/8/8/8/4K3 w - - 1 2', 'e1', 'e2', 'Paso 5: Acerca tu Rey a e2.', 'Mueve el rey a e2.', '¡Jugadas tranquilas dominadas!')
        ]
      },
      {
        id: 'l103_transicion_finales_gm',
        number: 103,
        title: 'Transición a finales de Gran Maestro',
        category: 'finales',
        steps: [
          th('La Conversión Impecable', 'Un Gran Maestro calcula la simplificación exacta al final 10 jugadas antes, sabiendo con certeza matemática que la estructura resultante está ganada.', '4k3/8/8/8/8/8/8/4K3 w - - 0 1'),
          ex('ex_1', '4k3/8/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 1: Avanza tu Rey a e2.', 'Mueve tu rey a e2.', '¡Rey hacia el centro!'),
          ex('ex_2', '4k3/8/8/8/8/8/4K3/8 w - - 0 1', 'e2', 'e3', 'Paso 2: Continúa a e3 con tu Rey.', 'Avanza el rey a e3.', '¡Rey activo!'),
          ex('ex_3', '4k3/8/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 3: Avanza tu Rey a e4.', 'Lleva el rey a e4.', '¡Rey en el centro!'),
          ex('ex_4', '4k3/8/8/8/4K3/8/8/8 w - - 0 1', 'e4', 'e5', 'Paso 4: Infiltra tu Rey a e5.', 'Mueve el rey a e5.', '¡Rey dominante!'),
          ex('ex_5', '4k3/8/8/4K3/8/8/8/8 w - - 0 1', 'e5', 'e6', 'Paso 5: Toma la oposición directa frente al rey negro.', 'Avanza a e6.', '¡Final de Gran Maestro dominado!')
        ]
      },
      {
        id: 'l104_conversion_ventajas_minimas',
        number: 104,
        title: 'Conversión técnica de ventajas mínimas',
        category: 'maestria',
        steps: [
          th('El Estilo Karpov / Carlsen', 'Torturar al rival con una micro-ventaja posicional (mejor estructura o casilla) hasta provocar el error definitivo sin darle ningún contrajuego.', '8/8/8/4P3/8/8/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/4P3/8/8/8/4K2k w - - 0 1', 'e5', 'e6', 'Paso 1: Avanza tu peón a e6 con técnica impecable.', 'Mueve el peón a e6.', '¡Avance técnico!'),
          ex('ex_2', '8/8/4P3/8/8/8/8/4K2k w - - 0 1', 'e6', 'e7', 'Paso 2: Continúa a e7 con el peón.', 'Avanza a e7.', '¡A un paso de la Dama!'),
          ex('ex_3', '8/4P3/8/8/8/8/8/4K2k w - - 0 1', 'e7', 'e8', 'Paso 3: Corona en Dama en e8.', 'Corona en Dama.', '¡Dama en el tablero!', 'q'),
          ex('ex_4', '4Q3/8/8/8/8/8/8/4K2k w - - 0 1', 'e8', 'e4', 'Paso 4: Centraliza tu Dama a e4.', 'Mueve tu dama a e4.', '¡Dama al centro!'),
          ex('ex_5', '8/8/8/8/4Q3/8/8/4K2k w - - 1 2', 'e4', 'h7', 'Paso 5: Da Jaque Mate en h7.', 'Lleva la dama a h7.', '¡Conversión de ventajas mínimas dominada!')
        ]
      },
      {
        id: 'l105_presion_tiempo',
        number: 105,
        title: 'Manejo del apuro de tiempo (Zeitnot)',
        category: 'maestria',
        steps: [
          th('Mantener la Calma con Segundos', 'Cuando te quedan menos de 60 segundos en el reloj: haz jugadas forzadas, sólidas y sin complicaciones tácticas innecesarias.', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'h2', 'h3', 'Paso 1: Juega una jugada sólida y rápida como h2-h3.', 'Avanza el peón a h3.', '¡Jugada segura y rápida!'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla el peón a d6.', 'Mueve el peón a d6.', '¡Estructura reforzada!'),
          ex('ex_3', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQkq - 0 2', 'e1', 'g1', 'Paso 3: Enroca corto rápido de e1 a g1.', 'Mueve tu rey a g1.', '¡Rey seguro bajo presión de tiempo!'),
          ex('ex_4', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQ1RK1 b - - 0 1', 'c8', 'e6', 'Paso 4: Desarrolla tu Alfil a e6.', 'Mueve el alfil a e6.', '¡Pieza activa!'),
          ex('ex_5', 'r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N1P/PPP2PPP/R1BQ1RK1 w - - 0 1', 'c1', 'g5', 'Paso 5: Clava al caballo en f6 con tu Alfil en g5.', 'Mueve tu alfil a g5.', '¡Manejo del apuro de tiempo dominado!')
        ]
      },
      {
        id: 'l106_psicologia_torneo',
        number: 106,
        title: 'Psicología competitiva en partidas FIDE',
        category: 'maestria',
        steps: [
          th('La Batalla Mental', 'Lasker decía: "El ajedrez es una lucha entre dos personas". Juega al rival: crea problemas prácticos donde el oponente se sienta incómodo.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Plantea la Variante del Cambio de la Ruy López jugando Axc6.', 'Captura en c6 con el alfil.', '¡Presión psicológica y estructural!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd3', 'Paso 2: Sostén tu centro con d2-d3.', 'Avanza el peón a d3.', '¡Centro blindado!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Juegas con negras. Juega d7-d6.', 'Mueve el peón a d6.', '¡Defensa sólida!'),
          ex('ex_4', 'r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey protegido!'),
          ex('ex_5', 'r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Clava el caballo con tu Alfil en g4.', 'Mueve el alfil a g4.', '¡Psicología competitiva dominada!')
        ]
      },
      {
        id: 'l107_analisis_propio',
        number: 107,
        title: 'Análisis crítico post-mortem de partidas',
        category: 'maestria',
        steps: [
          th('Aprender de las Derrotas', 'Botvinnik creó la escuela soviética basada en el análisis riguroso de tus propias partidas. Descubre tus puntos de inflexión y errores típicos.', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'c4', 'f7', 'Paso 1: Analiza el golpe táctico Axf7+.', 'Captura en f7 con el alfil.', '¡Punto de inflexión analizado!'),
          ex('ex_2', 'r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2', 'd1', 'h5', 'Paso 2: Analiza la entrada de Dama en h5.', 'Lleva tu dama a h5.', '¡Ataque coordinado verificado!'),
          ex('ex_3', 'r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3', 'h5', 'h4', 'Paso 3: Analiza la retirada Dh4.', 'Mueve tu dama a h4.', '¡Profundidad en el análisis!'),
          ex('ex_4', 'r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3', 'g6', 'g5', 'Paso 4: Juegas con negras. Analiza la defensa g6-g5.', 'Avanza el peón a g5.', '¡Defensa examinada!'),
          ex('ex_5', 'r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4', 'h4', 'e4', 'Paso 5: Captura el caballo en e4 con tu Dama.', 'Captura en e4 con la dama.', '¡Análisis crítico post-mortem dominado!')
        ]
      },
      {
        id: 'l108_preparacion_fide',
        number: 108,
        title: 'Preparación de repertorio para torneos',
        category: 'maestria',
        steps: [
          th('El Arsenal del Campeón', 'Un repertorio FIDE completo cuenta con respuestas sólidas con blancas y negras contra 1.e4, 1.d4, 1.c4 y líneas secundarias.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
          ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e2', 'e4', 'Paso 1: Muestra tu repertorio de 1.e4.', 'Avanza el peón a e4.', '¡1.e4 en el tablero!'),
          ex('ex_2', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'g1', 'f3', 'Paso 2: Desarrolla tu Caballo a f3.', 'Mueve tu caballo a f3.', '¡Desarrollo estándar!'),
          ex('ex_3', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3', 'f1', 'c4', 'Paso 3: Elige la Apertura Italiana con Ac4.', 'Lleva tu alfil a c4.', '¡Italiana seleccionada!'),
          ex('ex_4', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', 'd2', 'd3', 'Paso 4: Sostén tu centro con d2-d3.', 'Avanza el peón a d3.', '¡Línea sólida!'),
          ex('ex_5', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5', 'e1', 'g1', 'Paso 5: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Repertorio de torneos dominado!')
        ]
      },
      {
        id: 'l109_ataques_reyes_opuestos',
        number: 109,
        title: 'Carrera de peones en enroques opuestos',
        category: 'tactica',
        steps: [
          th('Ataque a Bayoneta', 'Con enroques en flancos opuestos no hay profilaxis que valga: ¡el primero en abrir líneas contra el Rey rival con sus peones da mate y gana!', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1'),
          ex('ex_1', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQ - 0 1', 'h2', 'h3', 'Paso 1: Lanza tu peón de "h" hacia adelante.', 'Avanza el peón a h3.', '¡Bayoneta en marcha!'),
          ex('ex_2', 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R b KQ - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla el peón a d6.', 'Mueve el peón a d6.', '¡Estructura consolidada!'),
          ex('ex_3', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N1P/PPP2PPP/R1BQK2R w KQ - 0 2', 'c1', 'g5', 'Paso 3: Clava el caballo en f6 con tu Alfil en g5.', 'Mueve tu alfil a g5.', '¡Clavada demoledora!'),
          ex('ex_4', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R b KQ - 1 2', 'h7', 'h6', 'Paso 4: Juegas con negras. Cuestiona al alfil con h7-h6.', 'Avanza el peón a h6.', '¡Pregunta al alfil!'),
          ex('ex_5', 'r1bq1rk1/ppp2pp1/2np1n1p/2b1p1B1/2B1P3/2NP1N1P/PPP2PPP/R2QK2R w KQ - 0 3', 'g5', 'h4', 'Paso 5: Mantén la presión retirando tu Alfil a h4.', 'Mueve el alfil a h4.', '¡Carrera de enroques opuestos dominada!')
        ]
      },
      {
        id: 'l110_gran_maestro_junvill',
        number: 110,
        title: 'Graduación: Gran Maestro Junvill (Maestría Total)',
        category: 'maestria',
        steps: [
          th('La Cumbre del Ajedrez', 'Has completado los 110 puntos de aprendizaje del currículo Junvill. Posees la visión táctica, cálculo y profundidad estratégica de un verdadero Maestro del Ajedrez.', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1'),
          ex('ex_1', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 1 (Prueba Táctica Final): Remata con Jaque Mate en a8.', 'Lleva tu torre a a8.', '¡Jaque Mate perfecto!'),
          ex('ex_2', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4', 'f3', 'f7', 'Paso 2 (Prueba de Ataque): Asesta Jaque Mate en f7 con tu Dama.', 'Captura en f7 con tu dama.', '¡Jaque Mate!'),
          ex('ex_3', '5r1k/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1', 'g1', 'g8', 'Paso 3 (Prueba de Coordinación): Da Jaque Mate Árabe en g8.', 'Lleva tu torre a g8.', '¡Jaque Mate Árabe!'),
          ex('ex_4', '3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1', 'e7', 'e8', 'Paso 4 (Prueba de Finales): Corona tu peón en Dama protegida por tu Torre en e8.', 'Corona en Dama en e8.', '¡Dama coronada y defendida!', 'q'),
          ex('ex_5', '3k4/4Q3/4K3/8/8/8/8/8 w - - 0 1', 'e7', 'd7', 'Paso 5 (Graduación Absoluta): Asesta el Jaque Mate definitivo con tu Dama en d7.', 'Da mate con tu dama en d7.', '¡¡FELICITACIONES GRAN MAESTRO JUNVILL!! Has completado al 100% las 110 lecciones interactivas de la academia.')
        ]
      }
    ]
  };
}
