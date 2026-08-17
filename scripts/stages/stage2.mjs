export function getStage2(ex, th) {
  return {
    id: 'etapa-2-tactica',
    title: 'ETAPA 2: TÁCTICA FUNDAMENTAL Y COMBINACIONES (800 - 1200 Elo)',
    category: 'tactica',
    badge: 'Táctica Junvill',
    eloRange: '800 - 1200 Elo',
    lessons: [
      {
        id: 'l25_sobrecarga',
        number: 25,
        title: 'La pieza sobrecargada',
        category: 'tactica',
        steps: [
          th('Exceso de Responsabilidades', 'Una pieza está sobrecargada cuando debe defender dos o más objetivos críticos al mismo tiempo. Al atacar uno de ellos, el otro queda indefenso.', 'r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K1NR w KQkq - 0 1'),
          ex('ex_1', 'r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/R1B1K1NR w KQkq - 0 1', 'f3', 'f7', 'Paso 1: El peón de f7 defiende al rey pero está sobrecargado. Captura en f7 con tu Dama.', 'Captura en f7 con tu dama.', '¡Ataque a la debilidad sobrecargada! Ganancia decisiva.'),
          ex('ex_2', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1', 'd2', 'd8', 'Paso 2: La torre negra en d8 está sobrecargada defendiendo el mate del pasillo. Captúrala.', 'Captura en d8 con tu torre.', '¡Sobrecarga explotada! Jaque mate del pasillo.'),
          ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'd3', 'e4', 'Paso 4: Captura el caballo en e4 con tu peón en d3.', 'Captura en e4.', '¡Intercambio ganador!'),
          ex('ex_4', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'd1', 'e2', 'Paso 4: Mueve tu Dama a e2 para clavar al caballo.', 'Lleva tu dama a e2.', '¡Presión táctica sobre la pieza!'),
          ex('ex_5', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 5: Captura el caballo en c6 eliminando el defensor del peón central.', 'Captura en c6 con el alfil.', '¡Sobrecargas y defensores dominados!')
        ]
      },
      {
        id: 'l26_pieza_atrapada',
        number: 26,
        title: 'La pieza atrapada o encerrada',
        category: 'tactica',
        steps: [
          th('Sin Casillas de Escape', 'Una pieza activa que penetra en territorio rival sin vías de retorno puede quedar completamente atrapada y cazada con peones o piezas menores.', 'r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk1nr/pppp1ppp/2n5/b3p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1', 'b2', 'b4', 'Paso 1: Avanza tu peón a b4 atacando al Alfil negro en a5.', 'Avanza el peón a b4.', '¡Alfil encerrado! El alfil negro se queda sin diagonales seguras.'),
          ex('ex_2', 'r1bqk1nr/pppp1ppp/2n5/1b2p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 1', 'c4', 'b5', 'Paso 2: Captura el alfil en b5 con tu Alfil de c4.', 'Captura en b5 con el alfil.', '¡Pieza atrapada eliminada!'),
          ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1', 'c3', 'b4', 'Paso 3: Captura el alfil negro en b4 con tu peón en c3.', 'Captura en b4 con el peón.', '¡Ganancia material neta!'),
          ex('ex_4', 'r1bqk2r/pppp1ppp/1bn5/8/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd4', 'Paso 4: Avanza tu peón central a d4.', 'Avanza el peón a d4.', '¡Centro dominante y piezas rivales limitadas!'),
          ex('ex_5', 'r1bqk2r/pppp1ppp/1bn5/4p3/3PP3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1', 'd4', 'd5', 'Paso 5: Avanza a d5 con el peón para asfixiar al caballo negro.', 'Mueve el peón a d5.', '¡Atrapamiento y dominio posicional!')
        ]
      },
      {
        id: 'l27_despeje_casillas',
        number: 27,
        title: 'Despeje de casillas',
        category: 'tactica',
        steps: [
          th('Ceder el Paso a la Gloria', 'A veces una de tus piezas estorba la casilla óptima donde otra pieza más contundente daría jaque mate o ganaría la partida. ¡Despéjala con energía!', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'c4', 'f7', 'Paso 1: Sacrifica tu Alfil en f7 dando jaque para liberar casillas para tu Dama.', 'Captura en f7 con el alfil.', '¡Despeje violento! El rey negro pierde el enroque.'),
          ex('ex_2', 'r1bqkb1r/pppp1Bpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R b KQkq - 0 1', 'e8', 'e7', 'Paso 2: Mueve el rey negro a e7.', 'Mueve el rey a e7.', '¡Rey descolocado!'),
          ex('ex_3', 'r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2', 'd2', 'd3', 'Paso 3: Expulsa al caballo negro avanzando d2-d3.', 'Avanza el peón a d3.', '¡Líneas abiertas para el ataque blanco!'),
          ex('ex_4', 'r1bq1b1r/ppppkBpp/2n5/4N3/4P3/8/PPP2PPP/RNBQK2R w KQ - 0 1', 'c1', 'g5', 'Paso 4: Lleva tu Alfil a g5 dando jaque al rey en e7.', 'Mueve tu alfil a g5.', '¡Ataque coordinado decisivo!'),
          ex('ex_5', 'r1bq1b1r/ppppkBpp/2n5/6B1/4P3/8/PPP2PPP/RN1QK2R b KQ - 1 1', 'e7', 'f7', 'Paso 5: Captura el alfil en f7 con el rey.', 'Captura en f7 con el rey.', '¡Despejes y ataques fulminantes!')
        ]
      },
      {
        id: 'l28_despeje_lineas',
        number: 28,
        title: 'Despeje de líneas o columnas',
        category: 'tactica',
        steps: [
          th('Abrir la Autopista', 'Consiste en avanzar o cambiar un peón o pieza menor para abrir de par en par una columna o diagonal para las piezas pesadas.', 'r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1', 'c3', 'e4', 'Paso 1: Captura en e4 con tu Caballo abriendo la columna "d".', 'Captura en e4 con el caballo.', '¡Columna semiabierta lista para la Dama!'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n5/4p3/3PN3/5N2/PPP2PPP/R1BQKB1R b KQkq - 0 1', 'e5', 'd4', 'Paso 2: Captura en d4 con el peón negro.', 'Captura en d4.', '¡Centro abierto!'),
          ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/8/3pN3/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 1', 'f3', 'd4', 'Paso 3: Recaptura en d4 con tu Caballo en f3.', 'Captura en d4 con el caballo.', '¡Pieza centralizada con líneas abiertas!'),
          ex('ex_4', 'r1bqk2r/pppp1ppp/8/8/3nN3/8/PPP2PPP/R1BQKB1R w KQkq - 0 1', 'd1', 'd4', 'Paso 4: Captura el caballo en d4 con tu Dama dominando el centro.', 'Captura en d4 con tu dama.', '¡Dama en el centro con total control!'),
          ex('ex_5', 'r1bqk2r/pppp1ppp/8/8/3QN3/8/PPP2PPP/R1B1KB1R b KQkq - 0 1', 'e8', 'g8', 'Paso 5: Enroca corto con negras para poner a tu Rey a salvo.', 'Enroca corto de e8 a g8.', '¡Líneas despejadas!')
        ]
      },
      {
        id: 'l29_intercepcion_lineas',
        number: 29,
        title: 'Intercepción de líneas',
        category: 'tactica',
        steps: [
          th('Cortar la Comunicación', 'Interponer una pieza en la intersección de dos líneas defensivas enemigas para cortar la protección mutua entre sus piezas.', 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'c1', 'd2', 'Paso 1: Desarrolla tu Alfil a d2 interceptando la clavada del alfil negro sobre tu caballo.', 'Mueve tu alfil a d2.', '¡Intercepción defensiva! Tu caballo queda libre de ataduras.'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/2bP1N2/PPPB1PPP/R2QK2R w KQkq - 0 1', 'b2', 'c3', 'Paso 2: Captura en c3 con tu peón en b2.', 'Captura en c3 con el peón.', '¡Estructura reforzada!'),
          ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/2PP1N2/P1PB1PPP/R2QK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Avanza tu peón a d6.', 'Mueve el peón a d6.', '¡Defensa sólida!'),
          ex('ex_4', 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/P1PB1PPP/R2QK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey protegido!'),
          ex('ex_5', 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/P1PB1PPP/R2Q1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Clava el caballo en f3 con tu Alfil en g4.', 'Mueve el alfil a g4.', '¡Intercepción y desarrollo!')
        ]
      },
      {
        id: 'l30_rayos_x',
        number: 30,
        title: 'Rayos X tácticos',
        category: 'tactica',
        steps: [
          th('Ver a Través de las Piezas', 'Los Rayos X permiten a una pieza de largo alcance (Dama, Torre, Alfil) ejercer presión o defensa a través de una pieza enemiga o aliada.', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1'),
          ex('ex_1', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1', 'd2', 'd8', 'Paso 1: Tu Torre en d2 ejerce rayos X sobre la 8ª fila. Captura en d8 dando mate.', 'Captura en d8 con tu torre.', '¡Rayos X demoledores! Ganancia de partida.'),
          ex('ex_2', '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', 'd1', 'd8', 'Paso 2: Lleva tu Torre de d1 a d8 dando Jaque Mate.', 'Mueve la torre a d8.', '¡Mate del pasillo ejecutado!'),
          ex('ex_3', '8/5p2/8/8/8/8/8/4K2k w - - 0 1', 'e1', 'f2', 'Paso 3: Acerca tu Rey a f2.', 'Mueve el rey a f2.', '¡Final ganado!'),
          ex('ex_4', '8/5p2/8/8/8/8/5K2/7k w - - 1 2', 'f2', 'g3', 'Paso 4: Avanza con tu Rey a g3.', 'Lleva el rey a g3.', '¡Rey arrincona al rival!'),
          ex('ex_5', '8/5p2/8/8/8/6K1/8/7k w - - 2 3', 'g3', 'h3', 'Paso 5: Coloca tu Rey en h3.', 'Mueve el rey a h3.', '¡Rayos X y técnica de finales dominada!')
        ]
      },
      {
        id: 'l31_jaque_perpetuo',
        number: 31,
        title: 'Jaque perpetuo como salvación',
        category: 'tactica',
        steps: [
          th('El Recurso del Náufrago', 'Cuando estás en desventaja de material pero el Rey enemigo no puede escapar de una serie interminable de jaques, puedes forzar TABLAS por jaque continuo.', '6k1/5ppp/8/8/8/8/5q2/7K b - - 0 1'),
          ex('ex_1', '6k1/5ppp/8/8/8/8/5q2/7K b - - 0 1', 'f2', 'f1', 'Paso 1: Juegas con negras. Da jaque en f1 con tu Dama.', 'Mueve tu dama a f1.', '¡Primer jaque salvador!'),
          ex('ex_2', '6k1/5ppp/8/8/8/8/8/5q1K w - - 1 2', 'h1', 'h2', 'Paso 2: El rey blanco se ve obligado a mover a h2.', 'Mueve el rey a h2.', '¡Rey obligado a moverse!'),
          ex('ex_3', '6k1/5ppp/8/8/8/8/8/5q1K b - - 1 2', 'f1', 'h3', 'Paso 3: Da jaque con Dama en h3.', 'Mueve tu dama a h3.', '¡Jaque continuo! El rey no tiene refugio.'),
          ex('ex_4', '6k1/5ppp/8/8/8/8/7K/7q w - - 1 1', 'h2', 'g3', 'Paso 4: Mueve tu Rey a g3.', 'Mueve el rey a g3.', '¡Rey bajo asedio!'),
          ex('ex_5', '6k1/5ppp/8/8/8/6K1/8/7q b - - 2 1', 'h1', 'g2', 'Paso 5: Da jaque en g2 forzando las tablas por repetición.', 'Mueve tu dama a g2.', '¡Tablas salvadas por Jaque Perpetuo!')
        ]
      },
      {
        id: 'l32_ahogado_salvador',
        number: 32,
        title: 'Ahogado como recurso salvador',
        category: 'tactica',
        steps: [
          th('La Trinchera Inexpugnable', 'Entregar tus últimas piezas activas para quedar sin jugadas legales en una posición donde NO estás en jaque salva medio punto milagroso.', 'k7/8/1K6/8/8/8/8/7R w - - 0 1'),
          ex('ex_1', 'k7/8/1K6/8/8/8/8/7R w - - 0 1', 'h1', 'h8', 'Paso 1: Da Jaque Mate en h8 con tu Torre.', 'Lleva tu torre a h8.', '¡Mate limpio!'),
          ex('ex_2', '8/k7/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a7', 'Paso 2: Corta en la 7ª fila con tu Torre.', 'Mueve la torre a a7.', '¡Corte de fila!'),
          ex('ex_3', '8/Rk6/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 3: Acerca tu Rey a e2.', 'Avanza el rey a e2.', '¡Rey en marcha!'),
          ex('ex_4', '8/Rk6/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 4: Continúa a e4 con tu Rey.', 'Mueve el rey a e4.', '¡Rey centralizado!'),
          ex('ex_5', '8/Rk6/4K3/8/8/8/8/8 w - - 0 1', 'a7', 'a8', 'Paso 5: Da Jaque Mate en a8.', 'Lleva la torre a a8.', '¡Técnica de ahogado y mate asimilada!')
        ]
      },
      {
        id: 'l33_atraccion',
        number: 33,
        title: 'Sacrificio de atracción',
        category: 'tactica',
        steps: [
          th('El Cebo Irresistible', 'Sacrificar material para forzar al Rey o Dama enemigo a situarse en una casilla fatal donde recibirá un doblete, clavada o jaque mate.', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/2B1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'c4', 'f7', 'Paso 1: Atrae al rey negro a f7 sacrificando tu Alfil.', 'Captura en f7 con tu alfil.', '¡Atracción mortal! El rey negro queda en campo abierto.'),
          ex('ex_2', 'r1bq1b1r/ppppkBpp/2n5/4N3/4n3/8/PPPP1PPP/RNBQK2R w KQ - 1 2', 'd1', 'h5', 'Paso 2: Lleva tu Dama a h5 con jaque al rey.', 'Lleva tu dama a h5.', '¡Ataque coordinado!'),
          ex('ex_3', 'r1bq1b1r/ppppkB1p/2n3p1/4N2Q/4n3/8/PPPP1PPP/RNB1K2R w KQ - 0 3', 'h5', 'h4', 'Paso 3: Retira tu Dama a h4.', 'Mueve tu dama a h4.', '¡Presión continua!'),
          ex('ex_4', 'r1bq1b1r/ppppkB1p/2n3p1/4N3/4n2Q/8/PPPP1PPP/RNB1K2R b KQ - 1 3', 'g6', 'g5', 'Paso 4: Juegas con negras. Defiende con g6-g5.', 'Avanza el peón a g5.', '¡Defensa activa!'),
          ex('ex_5', 'r1bq1b1r/ppppkB1p/2n5/4N1p1/4n2Q/8/PPPP1PPP/RNB1K2R w KQ - 0 4', 'h4', 'e4', 'Paso 5: Captura el caballo en e4 con tu Dama.', 'Captura en e4 con la dama.', '¡Atracción y victoria total!')
        ]
      },
      {
        id: 'l34_desviacion',
        number: 34,
        title: 'Sacrificio de desviación',
        category: 'tactica',
        steps: [
          th('Alejar al Guardián', 'Forzar a una pieza enemiga a abandonar la casilla o línea que defendía, permitiéndote penetrar con un golpe decisivo.', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1'),
          ex('ex_1', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1', 'd2', 'd8', 'Paso 1: Desvía a la torre negra de la defensa de la 8ª fila.', 'Captura en d8 con tu torre.', '¡Desviación y Jaque Mate!'),
          ex('ex_2', '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', 'd1', 'd8', 'Paso 2: Da mate en la octava fila con Torre en d8.', 'Mueve la torre a d8.', '¡Mate del pasillo!'),
          ex('ex_3', '8/5p2/8/8/8/8/5K2/7k w - - 0 1', 'f2', 'g3', 'Paso 3: Avanza tu Rey a g3.', 'Mueve el rey a g3.', '¡Rey activo!'),
          ex('ex_4', '8/5p2/8/8/8/6K1/8/7k w - - 1 2', 'g3', 'h3', 'Paso 4: Lleva tu Rey a h3.', 'Lleva el rey a h3.', '¡Rey en posición ganadora!'),
          ex('ex_5', '8/5p2/8/8/8/7K/8/7k w - - 2 3', 'h3', 'g4', 'Paso 5: Mueve tu Rey a g4.', 'Mueve el rey a g4.', '¡Desviaciones dominadas!')
        ]
      },
      {
        id: 'l35_destruccion_defensa',
        number: 35,
        title: 'Destrucción de la defensa',
        category: 'tactica',
        steps: [
          th('Derribar la Muralla', 'Eliminar la pieza o peón clave que sostiene la estructura defensiva enemiga para dar paso a un ataque imparable.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Destruye el caballo defensor en c6 capturándolo con tu Alfil.', 'Captura en c6 con el alfil.', '¡Defensor eliminado!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'f3', 'e5', 'Paso 2: Captura el peón central en e5 que ha quedado indefenso.', 'Captura en e5 con tu caballo.', '¡Peón central capturado!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 1', 'd8', 'e7', 'Paso 3: Juegas con negras. Desarrolla tu Dama a e7 atacando al caballo.', 'Lleva tu dama a e7.', '¡Contragolpe!'),
          ex('ex_4', 'r1b1k2r/p1ppqppp/2p5/4N3/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 1 2', 'd2', 'd4', 'Paso 4: Defiende tu Caballo central avanzando el peón a d4.', 'Avanza el peón a d4.', '¡Cadena de peones inquebrantable!'),
          ex('ex_5', 'r1b1k2r/p1ppqppp/2p5/4N3/3PP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2', 'f7', 'f6', 'Paso 5: Juegas con negras. Expulsa al caballo jugando f7-f6.', 'Mueve el peón a f6.', '¡Destrucción de defensas completada!')
        ]
      },
      {
        id: 'l36_debilidad_septima_octava',
        number: 36,
        title: 'La debilidad de la 7ª y 8ª fila',
        category: 'tactica',
        steps: [
          th('Invasión en las Filas Decisivas', 'Una Torre o Dama infiltrada en la 7ª u 8ª fila devora peones indefensos y coordina ataques de mate contra el Rey.', 'r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1'),
          ex('ex_1', 'r4rk1/5ppp/8/8/8/8/R7/4K3 w - - 0 1', 'a2', 'a8', 'Paso 1: Invade la 8ª fila con tu Torre en a8.', 'Lleva tu torre a a8.', '¡Invasión letal!'),
          ex('ex_2', 'R4rk1/5ppp/8/8/8/8/8/4K3 w - - 1 2', 'a8', 'f8', 'Paso 2: Captura la Torre en f8 dando Jaque Mate.', 'Captura en f8 con tu torre.', '¡Jaque Mate en la 8ª fila!'),
          ex('ex_3', '5rk1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 3: Lleva tu Torre a a8.', 'Mueve la torre a a8.', '¡Presión en la 8ª fila!'),
          ex('ex_4', 'R4rk1/5ppp/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 4: Centraliza tu Rey a e2.', 'Mueve tu rey a e2.', '¡Rey en camino!'),
          ex('ex_5', 'R4rk1/5ppp/8/8/8/4K3/8/8 w - - 1 2', 'e3', 'e4', 'Paso 5: Continúa con tu Rey a e4.', 'Avanza el rey a e4.', '¡Filas 7ª y 8ª dominadas!')
        ]
      },
      {
        id: 'l37_mate_arabe',
        number: 37,
        title: 'El mate árabe',
        category: 'tactica',
        steps: [
          th('La Pareja Legendaria', 'El mate árabe combina una Torre en la esquina (h8/g8) y un Caballo en f6/f3 que corta la casilla de escape del rey rival.', '5rk1/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1'),
          ex('ex_1', '5rk1/5p1p/5N2/8/8/8/8/4K1R1 w - - 0 1', 'g1', 'g8', 'Paso 1: Lleva tu Torre a g8 dando Jaque Mate Árabe con apoyo del caballo en f6.', 'Mueve la torre a g8.', '¡Jaque Mate Árabe!'),
          ex('ex_2', '6k1/5p1p/5N2/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 2: Da mate en la octava fila con Torre en a8.', 'Lleva la torre a a8.', '¡Jaque Mate perfecto!'),
          ex('ex_3', '8/5p1p/5N1k/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a7', 'Paso 3: Lleva tu Torre a a7 cortando al rey.', 'Mueve la torre a a7.', '¡Corte de fila!'),
          ex('ex_4', '8/R4p1p/5N1k/8/8/8/8/4K3 w - - 1 2', 'e1', 'e2', 'Paso 4: Acerca tu Rey a e2.', 'Avanza el rey a e2.', '¡Rey activo!'),
          ex('ex_5', '8/R4p1p/5N1k/8/8/4K3/8/8 w - - 2 3', 'a7', 'f7', 'Paso 5: Captura el peón en f7 con tu Torre.', 'Captura en f7 con la torre.', '¡Mate árabe y combinaciones dominadas!')
        ]
      },
      {
        id: 'l38_mate_anastasia',
        number: 38,
        title: 'El mate de Anastasia',
        category: 'tactica',
        steps: [
          th('El Pasillo Lateral', 'Un Caballo en e7 corta las casillas de escape g8 y g6 mientras una Torre en la columna "h" abierta asesta el mate definitivo.', '5rk1/4Nppp/8/8/8/8/8/4K2R w - - 0 1'),
          ex('ex_1', '5rk1/4Nppp/8/8/8/8/8/4K2R w - - 0 1', 'h1', 'h7', 'Paso 1: Lleva tu Torre a h7 dando Jaque Mate de Anastasia.', 'Lleva tu torre a h7.', '¡Jaque Mate de Anastasia fulminante!'),
          ex('ex_2', '5rk1/4Nppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 2: Da jaque mate en a8.', 'Mueve la torre a a8.', '¡Mate en 8ª fila!'),
          ex('ex_3', '8/4Nppp/7k/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a6', 'Paso 3: Corta en la 6ª fila con tu Torre.', 'Lleva la torre a a6.', '¡Corte de fila!'),
          ex('ex_4', '8/4Nppp/R6k/8/8/8/8/4K3 w - - 1 2', 'e1', 'e2', 'Paso 4: Mueve tu Rey a e2.', 'Avanza el rey a e2.', '¡Rey en marcha!'),
          ex('ex_5', '8/4Nppp/R6k/8/8/4K3/8/8 w - - 2 3', 'a6', 'f6', 'Paso 5: Lleva tu Torre a f6.', 'Mueve la torre a f6.', '¡Mate de Anastasia completado!')
        ]
      },
      {
        id: 'l39_mate_boden',
        number: 39,
        title: 'El mate de Boden',
        category: 'tactica',
        steps: [
          th('Las Diagonales Cruzadas', 'Dos Alfiles en diagonales cruzadas dan jaque mate al Rey atrapado entre sus propias piezas.', '2kr4/ppp2ppp/8/8/2B5/8/8/2B1K3 w - - 0 1'),
          ex('ex_1', '2kr4/ppp2ppp/8/8/2B5/8/8/2B1K3 w - - 0 1', 'c4', 'f7', 'Paso 1: Captura el peón en f7 con tu Alfil.', 'Captura en f7 con el alfil.', '¡Ataque cruzado de alfiles!'),
          ex('ex_2', '2kr4/ppp2Bpp/8/8/8/8/8/2B1K3 b - - 0 1', 'd8', 'd7', 'Paso 2: Mueve la torre a d7.', 'Lleva la torre a d7.', '¡Defensa pasiva!'),
          ex('ex_3', '2kr4/pppr1Bpp/8/8/8/8/8/2B1K3 w - - 1 2', 'c1', 'g5', 'Paso 3: Clava la torre llevando tu Alfil a g5.', 'Mueve el alfil a g5.', '¡Clavada letal de alfil!'),
          ex('ex_4', '2kr4/pppr1Bpp/8/6B1/8/8/8/4K3 b - - 2 2', 'd7', 'f7', 'Paso 4: Captura el alfil en f7 con la torre.', 'Captura en f7 con la torre.', '¡Intercambio forzado!'),
          ex('ex_5', '2kr4/ppp2rpp/8/6B1/8/8/8/4K3 w - - 0 3', 'g5', 'd8', 'Paso 5: Captura la torre en d8 con tu Alfil.', 'Captura en d8 con tu alfil.', '¡Mate de Boden y alfiles dominados!')
        ]
      },
      {
        id: 'l40_mate_blackburne',
        number: 40,
        title: 'El mate de Blackburne',
        category: 'tactica',
        steps: [
          th('Alfiles y Caballo Coordinados', 'Dos Alfiles apuntando al enroque combinados con un Caballo en salto dan un mate espectacular descubierto por Joseph Blackburne.', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'c1', 'g5', 'Paso 1: Clava al caballo en f6 con tu Alfil en g5.', 'Lleva tu alfil a g5.', '¡Clavada al caballo del enroque!'),
          ex('ex_2', 'r1bqk2r/pppp1ppp/2n2n2/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1QK2R b KQkq - 1 1', 'h7', 'h6', 'Paso 2: Expulsa al alfil con h7-h6.', 'Mueve el peón a h6.', '¡Pregunta al alfil!'),
          ex('ex_3', 'r1bqk2r/pppp1pp1/2n2n1p/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1QK2R w KQkq - 0 2', 'g5', 'h4', 'Paso 3: Retira tu Alfil manteniendo la clavada en h4.', 'Mueve el alfil a h4.', '¡Clavada persistente!'),
          ex('ex_4', 'r1bqk2r/pppp1pp1/2n2n1p/2b1p3/2B1P2B/3P1N2/PPP2PPP/RN1QK2R b KQkq - 1 2', 'd7', 'd6', 'Paso 4: Desarrolla el peón central a d6.', 'Mueve el peón a d6.', '¡Estructura consolidada!'),
          ex('ex_5', 'r1bqk2r/ppp2pp1/2np1n1p/2b1p3/2B1P2B/3P1N2/PPP2PPP/RN1QK2R w KQkq - 0 3', 'b1', 'c3', 'Paso 5: Desarrolla tu Caballo a c3.', 'Mueve tu caballo a c3.', '¡Mate de Blackburne asimilado!')
        ]
      },
      {
        id: 'l41_mate_greco',
        number: 41,
        title: 'El mate de Greco',
        category: 'tactica',
        steps: [
          th('Apertura de la Columna Torre', 'Abrir la columna "h" tras un sacrificio contra el peón de g7/h7 permite un mate directo con Torre y Alfil en el enroque.', '6k1/5ppp/8/8/2B5/8/8/4K2R w K - 0 1'),
          ex('ex_1', '6k1/5ppp/8/8/2B5/8/8/4K2R w K - 0 1', 'c4', 'f7', 'Paso 1: Captura en f7 con tu Alfil dando jaque.', 'Captura en f7 con el alfil.', '¡Ataque a la debilidad del rey!'),
          ex('ex_2', '5k2/5Bpp/8/8/8/8/8/4K2R w K - 0 1', 'h1', 'h7', 'Paso 2: Captura el peón en h7 con tu Torre.', 'Captura en h7 con la torre.', '¡Columna "h" abierta!'),
          ex('ex_3', '5k2/5B1R/8/8/8/8/8/4K3 w - - 0 1', 'f7', 'e6', 'Paso 3: Retira tu Alfil a e6 cortando al rey.', 'Mueve el alfil a e6.', '¡Corte de casillas!'),
          ex('ex_4', '5k2/7R/4B3/8/8/8/8/4K3 w - - 1 2', 'e1', 'e2', 'Paso 4: Acerca tu Rey a e2.', 'Avanza el rey a e2.', '¡Rey en apoyo!'),
          ex('ex_5', '5k2/7R/4B3/8/8/4K3/8/8 w - - 2 3', 'h7', 'f7', 'Paso 5: Da Jaque Mate llevando tu Torre a f7.', 'Mueve la torre a f7.', '¡Mate de Greco ejecutado!')
        ]
      },
      {
        id: 'l42_mate_coz',
        number: 42,
        title: 'El mate de la coz (Smothered Mate)',
        category: 'tactica',
        steps: [
          th('Asfixiado por sus Propias Tropas', 'El Rey enemigo está completamente rodeado por sus propias piezas. Un solo Caballo salta y asesta el jaque mate sin que el Rey pueda escapar.', '6k1/5ppp/8/8/8/5N2/8/4K2R w K - 0 1'),
          ex('ex_1', '6k1/5ppp/8/8/8/5N2/8/4K2R w K - 0 1', 'f3', 'g5', 'Paso 1: Salta con tu Caballo a g5 apuntando a h7 y f7.', 'Mueve el caballo a g5.', '¡Caballo agresivo hacia el enroque!'),
          ex('ex_2', '6k1/5ppp/8/6N1/8/8/8/4K2R w K - 1 2', 'g5', 'h7', 'Paso 2: Captura en h7 con tu Caballo dando jaque.', 'Captura en h7 con el caballo.', '¡Jaque en el flanco de rey!'),
          ex('ex_3', '7k/5ppp/8/8/8/8/8/4K2R w K - 2 3', 'h1', 'h7', 'Paso 3: Captura en h7 con tu Torre dando Jaque Mate.', 'Captura en h7 con la torre.', '¡Jaque Mate!'),
          ex('ex_4', 'k7/8/1K6/8/8/8/8/R7 w - - 0 1', 'a1', 'a7', 'Paso 4: Corta al rey en a7 con tu Torre.', 'Mueve la torre a a7.', '¡Corte de fila!'),
          ex('ex_5', 'k7/R7/1K6/8/8/8/8/8 w - - 1 2', 'a7', 'a8', 'Paso 5: Da Jaque Mate en a8.', 'Lleva la torre a a8.', '¡Mate de la coz y patrones de asfixia dominados!')
        ]
      },
      {
        id: 'l43_mate_morphy',
        number: 43,
        title: 'El mate de Morphy',
        category: 'tactica',
        steps: [
          th('El Alfil Inmortal', 'Paul Morphy popularizó este mate donde un Alfil corta la diagonal de escape del Rey en la esquina mientras una Torre en la columna abierta da mate.', '5rk1/5p1p/8/8/2B5/8/8/4K2R w K - 0 1'),
          ex('ex_1', '5rk1/5p1p/8/8/2B5/8/8/4K2R w K - 0 1', 'c4', 'f7', 'Paso 1: Captura en f7 con tu Alfil.', 'Captura en f7 con el alfil.', '¡Ataque a la esquina rival!'),
          ex('ex_2', '5rk1/5B1p/8/8/8/8/8/4K2R w K - 0 1', 'h1', 'g1', 'Paso 2: Lleva tu Torre a g1 dando jaque en la columna.', 'Lleva tu torre a g1.', '¡Jaque por la columna abierta!'),
          ex('ex_3', '5rk1/5B1p/8/8/8/8/8/4K1R1 w - - 1 2', 'f7', 'e6', 'Paso 3: Retira tu Alfil a e6.', 'Mueve el alfil a e6.', '¡Alfil cortando casillas!'),
          ex('ex_4', '5rk1/7p/4B3/8/8/8/8/4K1R1 w - - 2 3', 'e1', 'e2', 'Paso 4: Mueve tu Rey a e2.', 'Avanza el rey a e2.', '¡Rey en juego!'),
          ex('ex_5', '5rk1/7p/4B3/8/8/4K3/8/6R1 w - - 3 4', 'g1', 'g8', 'Paso 5: Lleva tu Torre a g8 dando Jaque Mate de Morphy.', 'Lleva la torre a g8.', '¡Mate de Morphy completado!')
        ]
      },
      {
        id: 'l44_mate_reti',
        number: 44,
        title: 'El mate de Réti',
        category: 'tactica',
        steps: [
          th('La Sorpresa de Richard Réti', 'Un Alfil apoyado por una Torre asesta jaque mate al Rey encerrado en el centro tras un sacrificio de Dama.', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'd3', 'e4', 'Paso 1: Captura el caballo en e4 con tu peón.', 'Captura en e4 con el peón.', '¡Ganancia de pieza menor!'),
          ex('ex_2', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 2: Desarrolla el peón central a d6.', 'Mueve el peón a d6.', '¡Defensa sólida!'),
          ex('ex_3', 'r1bqkb1r/ppp2ppp/2np4/2B1P3/4P3/5N2/PPP2PPP/RN1QKB1R w KQkq - 0 1', 'c5', 'a3', 'Paso 3: Retira tu Alfil a a3.', 'Mueve el alfil a a3.', '¡Diagonal abierta!'),
          ex('ex_4', 'r1bqkb1r/ppp2ppp/2np4/4P3/4P3/B4N2/PPP2PPP/RN1QKB1R b KQkq - 1 1', 'c6', 'e5', 'Paso 4: Centraliza el caballo a e5.', 'Mueve tu caballo a e5.', '¡Caballo al centro!'),
          ex('ex_5', 'r1bqkb1r/ppp2ppp/3p4/4n3/4P3/B4N2/PPP2PPP/RN1QKB1R w KQkq - 2 2', 'f3', 'e5', 'Paso 5: Captura el caballo en e5 con tu Caballo en f3.', 'Captura en e5 con el caballo.', '¡Mate de Réti y coordinación de piezas dominada!')
        ]
      },
      {
        id: 'l45_mate_damiano',
        number: 45,
        title: 'El mate de Damiano',
        category: 'tactica',
        steps: [
          th('Peón Cuña y Dama Asesina', 'Un peón propio en g6 o f6 clava una cuña en el enroque negro permitiendo a la Dama dar mate en h7 o g7.', '6k1/5ppp/6P1/8/8/8/8/4K2R w K - 0 1'),
          ex('ex_1', '6k1/5ppp/6P1/8/8/8/8/4K2R w K - 0 1', 'h1', 'h7', 'Paso 1: Captura en h7 con tu Torre dando Jaque Mate.', 'Captura en h7 con la torre.', '¡Jaque Mate de Damiano!'),
          ex('ex_2', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 2: Da jaque mate en la 8ª fila con tu Torre.', 'Mueve la torre a a8.', '¡Mate del pasillo!'),
          ex('ex_3', '8/k7/8/8/8/8/8/4K2R w - - 0 1', 'h1', 'h7', 'Paso 3: Corta en la 7ª fila con tu Torre.', 'Lleva tu torre a h7.', '¡Corte de fila!'),
          ex('ex_4', '8/k6R/8/8/8/4K3/8/8 w - - 1 2', 'e3', 'e4', 'Paso 4: Acerca tu Rey a e4.', 'Avanza el rey a e4.', '¡Rey al centro!'),
          ex('ex_5', '8/k6R/4K3/8/8/8/8/8 w - - 2 3', 'h7', 'a7', 'Paso 5: Da Jaque Mate en a7 con tu Torre.', 'Lleva la torre a a7.', '¡Patrón de Damiano asimilado!')
        ]
      },
      {
        id: 'l46_sacrificio_h7',
        number: 46,
        title: 'El sacrificio clásico de Alfil en h7 (Regalo Griego)',
        category: 'tactica',
        steps: [
          th('El Regalo Griego', 'El sacrificio clásico Axh7+ destruye el escudo de peones del enroque enemigo, permitiendo la entrada mortal de Cg5+ y Dh5.', 'r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1'),
          ex('ex_1', 'r1bq1rk1/ppp2ppp/2n5/3p4/2B1P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 1', 'c4', 'd5', 'Paso 1: Captura el peón central en d5 con tu Alfil.', 'Captura en d5 con el alfil.', '¡Presión central!'),
          ex('ex_2', 'r1bq1rk1/ppp2ppp/2n5/3B4/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 1', 'c6', 'e7', 'Paso 2: Desarrolla el caballo a e7.', 'Mueve el caballo a e7.', '¡Caballo defensivo!'),
          ex('ex_3', 'r1bq1rk1/ppp1nppp/8/3B4/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 1 2', 'd5', 'f7', 'Paso 3: Captura en f7 con tu Alfil dando jaque.', 'Captura en f7 con el alfil.', '¡Sacrificio demoledor sobre el enroque!'),
          ex('ex_4', 'r1bq1rk1/ppp1nBpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R b KQ - 0 2', 'f8', 'f7', 'Paso 4: Captura el alfil en f7 con la torre.', 'Captura en f7 con la torre.', '¡Rey expuesto!'),
          ex('ex_5', 'r1bq2k1/ppp1nrpp/8/8/4P3/5N2/PPP2PPP/R1BQK2R w KQ - 0 3', 'd1', 'd8', 'Paso 5: Captura la Dama en d8 con tu Dama.', 'Captura la dama en d8.', '¡Regalo Griego y ataque al enroque dominado!')
        ]
      },
      {
        id: 'l47_molino_viento',
        number: 47,
        title: 'El molino de viento (Windmill)',
        category: 'tactica',
        steps: [
          th('La Máquina de Capturar', 'Una serie alternada de jaques descubiertos con Torre y Alfil permite a la Torre capturar múltiples piezas enemigas sin que el rival pueda defenderse.', '6k1/5ppp/8/8/2B5/8/8/4K1R1 w - - 0 1'),
          ex('ex_1', '6k1/5ppp/8/8/2B5/8/8/4K1R1 w - - 0 1', 'g1', 'g7', 'Paso 1: Captura en g7 con tu Torre dando jaque.', 'Captura en g7 con la torre.', '¡Primer giro del Molino de Viento!'),
          ex('ex_2', '6k1/5pRp/8/8/2B5/8/8/4K3 w - - 0 1', 'g7', 'f7', 'Paso 2: Captura en f7 con tu Torre dando jaque descubierto de Alfil.', 'Captura en f7 con la torre.', '¡Jaque descubierto!'),
          ex('ex_3', '6k1/5R1p/8/8/2B5/8/8/4K3 w - - 0 1', 'f7', 'g7', 'Paso 3: Regresa a g7 con la Torre para dar jaque directo.', 'Mueve la torre a g7.', '¡Giro continuo del molino!'),
          ex('ex_4', '6k1/5pRp/8/8/2B5/4K3/8/8 w - - 1 2', 'g7', 'h7', 'Paso 4: Captura el peón en h7 con tu Torre.', 'Captura en h7 con la torre.', '¡Tercera pieza devorada por el molino!'),
          ex('ex_5', '6k1/5p1R/8/8/2B5/4K3/8/8 w - - 0 3', 'h7', 'f7', 'Paso 5: Remata la posición con Torre en f7.', 'Mueve la torre a f7.', '¡Molino de viento asimilado al 100%!')
        ]
      },
      {
        id: 'l48_ataque_f7_f2',
        number: 48,
        title: 'Ataque fulminante sobre f7 / f2',
        category: 'tactica',
        steps: [
          th('El Talón de Aquiles', 'La casilla f7 (f2 para blancas) es la más débil al inicio porque sólo está defendida por el propio Rey. ¡Explotarla genera victorias fulgurantes!', 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'f3', 'g5', 'Paso 1: Salta con tu Caballo a g5 atacando f7 junto con el Alfil.', 'Mueve el caballo a g5.', '¡Ataque Fegatello sobre f7 iniciado!'),
          ex('ex_2', 'r1bqkbnr/pppp1ppp/2n5/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 1 1', 'd7', 'd5', 'Paso 2: Juegas con negras. Bloquea la diagonal con d7-d5.', 'Avanza el peón a d5.', '¡Contragolpe central!'),
          ex('ex_3', 'r1bqkbnr/ppp2ppp/2n5/3p2N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 2', 'c4', 'd5', 'Paso 3: Captura en d5 con tu Alfil.', 'Captura en d5 con el alfil.', '¡Presión redoblada!'),
          ex('ex_4', 'r1bqkbnr/ppp2ppp/2n5/3B2N1/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 2', 'd8', 'g5', 'Paso 4: Juegas con negras. Captura el caballo en g5 con tu Dama.', 'Captura en g5 con la dama.', '¡Defensa dinámica!'),
          ex('ex_5', 'r1b1kbnr/ppp2ppp/2n5/3B2q1/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 3', 'd5', 'c6', 'Paso 5: Captura el caballo en c6 con tu Alfil.', 'Captura en c6 con el alfil.', '¡Puntos débiles f7/f2 dominados!')
        ]
      },
      {
        id: 'l49_sacrificio_e6',
        number: 49,
        title: 'El sacrificio posicional de pieza en e6',
        category: 'tactica',
        steps: [
          th('Dinamitar la Defensa Siciliana y Francesa', 'Sacrificar un Caballo o Alfil en e6 destruye el centro enemigo e impide que el Rey rival pueda coordinar su enroque.', 'r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1'),
          ex('ex_1', 'r1bqkbnr/pp1p1ppp/2n1p3/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1', 'd4', 'e6', 'Paso 1: Sacrifica tu Caballo en e6 atacando la Dama y destruyendo los peones rivales.', 'Mueve tu caballo a e6.', '¡Sacrificio temático en e6!'),
          ex('ex_2', 'r1bqkbnr/pp1p1ppp/2n1N3/8/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 0 1', 'f7', 'e6', 'Paso 2: Captura en e6 con el peón negro.', 'Captura en e6 con el peón.', '¡Estructura negra dinamitada!'),
          ex('ex_3', 'r1bqkbnr/pp1p2pp/2n1p3/8/4P3/8/PPP2PPP/RNBQKB1R w KQkq - 0 2', 'd1', 'h5', 'Paso 3: Lleva tu Dama a h5 dando jaque al rey debilitado.', 'Lleva tu dama a h5.', '¡Ataque fulminante al rey!'),
          ex('ex_4', 'r1bqkbnr/pp1p2pp/2n1p3/7Q/4P3/8/PPP2PPP/RNB1KB1R b KQkq - 1 2', 'g7', 'g6', 'Paso 4: Juegas con negras. Bloquea con g7-g6.', 'Avanza el peón a g6.', '¡Bloqueo!'),
          ex('ex_5', 'r1bqkbnr/pp1p3p/2n1p1p1/7Q/4P3/8/PPP2PPP/RNB1KB1R w KQkq - 0 3', 'h5', 'f3', 'Paso 5: Retira tu Dama a f3 manteniendo una presión aplastante.', 'Mueve la dama a f3.', '¡Sacrificios en e6 asimilados!')
        ]
      },
      {
        id: 'l50_peones_pasados_medio_juego',
        number: 50,
        title: 'Peones pasados avanzados en el medio juego',
        category: 'estrategia',
        steps: [
          th('El Monstruo en 6ª y 7ª Fila', 'Un peón pasado avanzado en la 6ª o 7ª fila paraliza al ejército rival y vale tanto como una pieza mayor.', '3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1'),
          ex('ex_1', '3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1', 'e7', 'e8', 'Paso 1: Corona tu peón pasado a Dama protegida por tu Torre en e8.', 'Avanza a e8 coronando en Dama.', '¡Coronación imparable y defendida!', 'q'),
          ex('ex_2', '1k6/P7/8/8/8/8/R7/4K3 w - - 0 1', 'a7', 'a8', 'Paso 2: Corona tu peón en a8 con el respaldo de tu Torre en a2.', 'Corona en a8.', '¡Dama protegida en el flanco de dama!', 'q'),
          ex('ex_3', 'k7/1PK5/8/8/8/8/8/8 w - - 0 1', 'b7', 'b8', 'Paso 3: Corona con Jaque Mate en b8 protegido por tu Rey en c7.', 'Corona en b8.', '¡Coronación triunfal con Jaque Mate!', 'q'),
          ex('ex_4', '6k1/7P/8/8/8/8/7R/4K3 w - - 0 1', 'h7', 'h8', 'Paso 4: Corona en h8 defendido por tu Torre en h2.', 'Corona en h8.', '¡Dama blindada en la esquina!', 'q'),
          ex('ex_5', '4k3/3r4/8/8/8/8/3p4/4K3 b - - 0 1', 'd2', 'd1', 'Paso 5: Juegas con negras. Corona en d1 defendido por tu Torre en d7.', 'Corona en d1 con negras.', '¡Graduación de Etapa 2 Completada con Éxito!', 'q')
        ]
      }
    ]
  };
}
