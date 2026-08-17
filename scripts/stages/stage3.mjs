export function getStage3(ex, th) {
  return {
    id: 'etapa-3-estrategia-finales',
    title: 'ETAPA 3: ESTRATEGIA Y FINALES ESENCIALES (1200 - 1600 Elo)',
    category: 'estrategia',
    badge: 'Estrategia Junvill',
    eloRange: '1200 - 1600 Elo',
    lessons: [
      {
        id: 'l51_regla_cuadrado',
        number: 51,
        title: 'La regla del cuadrado de peones',
        category: 'finales',
        steps: [
          th('Cálculo Visual Instantáneo', 'Dibuja un cuadrado geométrico desde el peón hasta la 8ª fila. Si el Rey rival no puede entrar al cuadrado en su turno, ¡el peón coronará imparable!', '8/8/8/3P4/8/8/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/3P4/8/8/8/4K2k w - - 0 1', 'd5', 'd6', 'Paso 1: Avanza tu peón a d6 para alejar el cuadrado del rey rival.', 'Avanza a d6.', '¡Peón fuera del alcance del rey rival!'),
          ex('ex_2', '8/8/3P4/8/8/8/8/4K2k w - - 0 1', 'd6', 'd7', 'Paso 2: Avanza tu peón a d7 a un solo paso de la gloria.', 'Mueve el peón a d7.', '¡A un paso de la coronación!'),
          ex('ex_3', '8/3P4/8/8/8/8/8/4K2k w - - 0 1', 'd7', 'd8', 'Paso 3: Corona tu peón en Dama en d8.', 'Avanza a d8 coronando en Dama.', '¡Dama coronada!', 'q'),
          ex('ex_4', '3Q4/8/8/8/8/8/8/4K2k w - - 0 1', 'd8', 'g5', 'Paso 4: Centraliza tu Dama a g5 cortando al rey.', 'Lleva tu dama a g5.', '¡Dama dominante!'),
          ex('ex_5', '8/8/8/6Q1/8/8/8/4K2k w - - 1 2', 'g5', 'h4', 'Paso 5: Lleva tu Dama a h4 para dar jaque a distancia segura.', 'Mueve la dama a h4.', '¡Regla del cuadrado dominada al 100%!')
        ]
      },
      {
        id: 'l52_oposicion_reyes',
        number: 52,
        title: 'La oposición de reyes',
        category: 'finales',
        steps: [
          th('El Duelo de Monarcas', 'Tener la oposición significa colocar tu Rey frente al Rey rival con una casilla libre de por medio, obligando al rey enemigo a ceder el paso.', '4k3/8/8/8/8/8/8/4K3 w - - 0 1'),
          ex('ex_1', '4k3/8/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 1: Avanza con tu Rey a e2.', 'Mueve tu rey a e2.', '¡Marcha del rey iniciada!'),
          ex('ex_2', '4k3/8/8/8/8/8/4K3/8 w - - 0 1', 'e2', 'e3', 'Paso 2: Da otro paso hacia el centro con tu Rey a e3.', 'Avanza el rey a e3.', '¡Rey centralizado!'),
          ex('ex_3', '4k3/8/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 3: Avanza tu Rey a e4 tomando el centro.', 'Lleva el rey a e4.', '¡Dominio central!'),
          ex('ex_4', '4k3/8/8/8/4K3/8/8/8 w - - 0 1', 'e4', 'e5', 'Paso 4: Coloca tu Rey en e5.', 'Mueve a e5.', '¡Presión hacia adelante!'),
          ex('ex_5', '4k3/8/8/4K3/8/8/8/8 w - - 0 1', 'e5', 'e6', 'Paso 5: Toma la oposición directa frente al rey en e8.', 'Avanza a e6.', '¡Oposición de Reyes dominada!')
        ]
      },
      {
        id: 'l53_casillas_clave',
        number: 53,
        title: 'Casillas clave de coronación',
        category: 'finales',
        steps: [
          th('Las Puertas de la Victoria', 'Las casillas clave son aquellas casillas críticas que si tu Rey logra ocupar primero, garantizan la coronación del peón sin importar a quién le toque jugar.', '4k3/8/8/4P3/8/8/8/4K3 w - - 0 1'),
          ex('ex_1', '4k3/8/8/4P3/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 1: Acerca tu Rey a e2 para apoyar el avance del peón.', 'Mueve tu rey a e2.', '¡Rey en camino hacia las casillas clave!'),
          ex('ex_2', '4k3/8/8/4P3/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 2: Avanza tu Rey a e4.', 'Lleva el rey a e4.', '¡Rey apoya al peón!'),
          ex('ex_3', '4k3/8/8/4P3/4K3/8/8/8 w - - 0 1', 'e5', 'e6', 'Paso 3: Avanza tu peón a e6.', 'Mueve el peón a e6.', '¡Peón avanzado a 6ª fila!'),
          ex('ex_4', '4k3/8/4P3/4K3/8/8/8/8 w - - 0 1', 'e5', 'd6', 'Paso 4: Avanza tu Rey a d6 para apoyar la coronación en e8.', 'Mueve tu rey a d6.', '¡Rey en casilla clave!'),
          ex('ex_5', '3k4/4P3/8/8/8/8/4R3/4K3 w - - 0 1', 'e7', 'e8', 'Paso 5: Corona tu peón en Dama protegida por tu Torre en e8.', 'Corona en Dama en e8.', '¡Casillas clave y coronación dominadas!', 'q')
        ]
      },
      {
        id: 'l54_peones_doblados',
        number: 54,
        title: 'Peones doblados: ventajas y debilidades',
        category: 'estrategia',
        steps: [
          th('La Columna Compartida', 'Dos peones del mismo bando en la misma columna se estorban mutuamente para avanzar pero abren columnas adyacentes para las Torres.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Dobla los peones negros capturando el caballo en c6 con tu Alfil.', 'Captura en c6 con el alfil.', '¡Peones rivales doblados en c7 y c6!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd3', 'Paso 2: Afianza tu centro con d2-d3.', 'Avanza el peón a d3.', '¡Centro blindado!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Juegas con negras. Defiende tu peón central jugando d7-d6.', 'Mueve el peón a d6.', '¡Estructura sólida!'),
          ex('ex_4', 'r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey seguro!'),
          ex('ex_5', 'r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Clava el caballo con tu Alfil en g4.', 'Mueve el alfil a g4.', '¡Estructura de peones doblados dominada!')
        ]
      },
      {
        id: 'l55_peon_aislado',
        number: 55,
        title: 'El peón aislado (IQP): Fuerza dinámica vs Debilidad',
        category: 'estrategia',
        steps: [
          th('La Espada de Doble Filo', 'Un peón aislado (IQP) brinda casillas de ataque avanzadas pero debe ser defendido con piezas en los finales.', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1'),
          ex('ex_1', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 1', 'c4', 'd5', 'Paso 1: Genera el peón aislado capturando en d5.', 'Captura en d5 con el peón.', '¡Peón aislado generado!'),
          ex('ex_2', 'r1bq1rk1/pp1nbppp/2n1p3/3p4/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1', 'e6', 'e5', 'Paso 2: Juegas con negras. Golpea con e6-e5.', 'Avanza el peón a e5.', '¡Ruptura activa!'),
          ex('ex_3', 'r1bq1rk1/pp1nbppp/2n5/3pp3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 2', 'd4', 'e5', 'Paso 3: Captura en e5 con tu peón.', 'Captura en e5.', '¡Intercambio central!'),
          ex('ex_4', 'r1bq1rk1/pp1nbppp/8/3pn3/8/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 3', 'f3', 'e5', 'Paso 4: Captura el caballo en e5.', 'Captura en e5 con el caballo.', '¡Simplificación favorable!'),
          ex('ex_5', 'r1bq1rk1/pp1nbppp/8/3pn3/8/2N5/PP2BPPP/R1BQ1RK1 b - - 0 3', 'd7', 'f6', 'Paso 5: Bloquea el peón aislado con tu Caballo en f6.', 'Mueve tu caballo a f6.', '¡Bloqueo del peón aislado dominado!')
        ]
      },
      {
        id: 'l56_peones_retrasados',
        number: 56,
        title: 'Peones retrasados en columnas semiabiertas',
        category: 'estrategia',
        steps: [
          th('El Punto Débil Fijo', 'Un peón retrasado se ha quedado atrás de sus vecinos y no puede avanzar con seguridad, convirtiéndose en el blanco predilecto de las Torres en la columna abierta.', 'r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N5/PP2BPPP/R1BQ1RK1 w - - 0 1'),
          ex('ex_1', 'r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N5/PP2BPPP/R1BQ1RK1 w - - 0 1', 'c1', 'e3', 'Paso 1: Desarrolla tu Alfil a e3 dominando el centro.', 'Mueve el alfil a e3.', '¡Centro blanco reforzado!'),
          ex('ex_2', 'r1bq1rk1/pp1nppbp/3p1np1/8/2PNP3/2N1B3/PP2BPPP/R2Q1RK1 b - - 1 1', 'd7', 'c5', 'Paso 2: Juegas con negras. Salta con tu Caballo a c5 atacando el peón central.', 'Mueve tu caballo a c5.', '¡Presión sobre e4!'),
          ex('ex_3', 'r1bq1rk1/pp2ppbp/3p1np1/2n5/2PNP3/2N1B3/PP2BPPP/R2Q1RK1 w - - 2 2', 'f2', 'f3', 'Paso 3: Protege tu peón central jugando f2-f3.', 'Avanza el peón a f3.', '¡Centro blindado!'),
          ex('ex_4', 'r1bq1rk1/pp2ppbp/3p1np1/2n5/2PNP3/2N1BP2/PP2B1PP/R2Q1RK1 b - - 0 2', 'a7', 'a6', 'Paso 4: Juegas con negras. Juega a7-a6 para preparar b7-b5.', 'Mueve el peón a a6.', '¡Preparación en el flanco!'),
          ex('ex_5', 'r1bq1rk1/1p2ppbp/p1np1np1/2n5/2PNP3/2N1BP2/PP2B1PP/R2Q1RK1 w - - 1 3', 'd4', 'c6', 'Paso 5: Captura el caballo en c6 con tu Caballo de d4.', 'Captura en c6 con el caballo.', '¡Tratamiento de peones retrasados dominado!')
        ]
      },
      {
        id: 'l57_mayoria_flanco',
        number: 57,
        title: 'Mayoría de peones en un flanco',
        category: 'estrategia',
        steps: [
          th('La Fuerza de la Superioridad Numérica', 'Tener 3 peones contra 2 (o 2 contra 1) en un flanco permite avanzar la mayoría para crear un peón pasado imparable hacia la victoria.', '8/8/8/8/8/P7/1P6/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/8/8/P7/1P6/4K2k w - - 0 1', 'b2', 'b4', 'Paso 1: Avanza tu peón a b4 para movilizar tu mayoría.', 'Avanza a b4.', '¡Mayoría de peones en marcha!'),
          ex('ex_2', '8/8/8/8/1P6/P7/8/4K2k w - - 0 1', 'b4', 'b5', 'Paso 2: Continúa a b5 con el peón.', 'Mueve a b5.', '¡Peón pasado en creación!'),
          ex('ex_3', '8/8/8/1P6/8/P7/8/4K2k w - - 0 1', 'b5', 'b6', 'Paso 3: Avanza a b6 a un paso de la 7ª fila.', 'Lleva el peón a b6.', '¡Avance imparable!'),
          ex('ex_4', '8/8/1P6/8/8/P7/8/4K2k w - - 0 1', 'b6', 'b7', 'Paso 4: Avanza a b7 a un paso de coronar.', 'Mueve a b7.', '¡A un paso de la Dama!'),
          ex('ex_5', '8/1P6/8/8/8/P7/8/4K2k w - - 0 1', 'b7', 'b8', 'Paso 5: Corona tu peón en Dama en b8.', 'Corona en Dama en b8.', '¡Mayoría de peones convertida en Dama!', 'q')
        ]
      },
      {
        id: 'l58_peon_pasado_alejado',
        number: 58,
        title: 'La creación del peón pasado alejado',
        category: 'estrategia',
        steps: [
          th('La Distracción Estratégica', 'Un peón pasado alejado en la columna "a" u "h" obliga al Rey rival a viajar hasta la otra punta del tablero, permitiendo a tu propio Rey devorar los peones restantes.', '8/8/8/8/8/7P/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/8/8/7P/8/4K2k w - - 0 1', 'h3', 'h4', 'Paso 1: Avanza tu peón alejado a h4.', 'Mueve a h4.', '¡Peón alejado en avance!'),
          ex('ex_2', '8/8/8/8/7P/8/8/4K2k w - - 0 1', 'h4', 'h5', 'Paso 2: Continúa a h5 con el peón.', 'Avanza a h5.', '¡El rey rival no podrá detenerlo!'),
          ex('ex_3', '8/8/8/7P/8/8/8/4K2k w - - 0 1', 'h5', 'h6', 'Paso 3: Avanza a h6.', 'Lleva el peón a h6.', '¡Presión máxima!'),
          ex('ex_4', '8/8/7P/8/8/8/8/4K2k w - - 0 1', 'h6', 'h7', 'Paso 4: Lleva tu peón a h7 a punto de coronar.', 'Mueve a h7.', '¡A un paso de la coronación!'),
          ex('ex_5', '8/7P/8/8/8/8/8/4K2k w - - 0 1', 'h7', 'h8', 'Paso 5: Corona en Dama en h8.', 'Corona en Dama en h8.', '¡Victoria asegurada con peón pasado alejado!', 'q')
        ]
      },
      {
        id: 'l59_posicion_lucena',
        number: 59,
        title: 'Final de Torre: Posición de Lucena (Construir el Puente)',
        category: 'finales',
        steps: [
          th('El Puente de la Victoria', 'La posición de Lucena es la técnica magistral más famosa en finales de Torre: construyes un puente con tu Torre en la 4ª fila para tapar los jaques y coronar tu peón.', '4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1'),
          ex('ex_1', '4k3/4P3/4K3/8/8/8/8/R7 w - - 0 1', 'a1', 'a8', 'Paso 1: Da Jaque Mate en a8 con tu Torre.', 'Lleva tu torre a a8.', '¡Jaque Mate de Lucena!'),
          ex('ex_2', '8/4P3/4K3/8/8/8/8/R6k w - - 0 1', 'e7', 'e8', 'Paso 2: Corona tu peón en Dama en e8.', 'Corona en Dama.', '¡Dama coronada!', 'q'),
          ex('ex_3', '8/4P3/8/8/8/8/8/R3K2k w - - 0 1', 'e7', 'e8', 'Paso 3: Corona en Dama en e8.', 'Avanza a e8 coronando en Dama.', '¡Coronación exitosa!', 'q'),
          ex('ex_4', '4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 4: Lleva tu Torre a a8 dando jaque.', 'Mueve la torre a a8.', '¡Jaque en la 8ª fila!'),
          ex('ex_5', 'R3k3/8/8/8/8/8/8/4K3 w - - 1 2', 'e1', 'e2', 'Paso 5: Acerca tu Rey a e2.', 'Mueve el rey a e2.', '¡Técnica de Lucena asimilada!')
        ]
      },
      {
        id: 'l60_posicion_philidor',
        number: 60,
        title: 'Final de Torre: Posición de Philidor (La Defensa Perfecta)',
        category: 'finales',
        steps: [
          th('La Muralla en 3ª Fila y Jaques por la Espalda', 'Mantén tu Torre en la 3ª fila (6ª para negras) para impedir que el Rey rival avance; cuando el peón avance, ¡da jaques infinitos por la espalda!', '8/8/8/8/8/4r3/4P3/4K2k b - - 0 1'),
          ex('ex_1', '8/8/8/8/8/4r3/4P3/4K2k b - - 0 1', 'e3', 'e2', 'Paso 1: Captura en e2 con tu Torre.', 'Captura en e2 con la torre.', '¡Peón peligroso eliminado!'),
          ex('ex_2', '8/8/8/8/8/8/4r3/4K2k b - - 0 1', 'e2', 'e8', 'Paso 2: Retira tu Torre a e8.', 'Lleva la torre a e8.', '¡Control de la columna!'),
          ex('ex_3', '4r3/8/8/8/8/8/8/4K2k b - - 1 2', 'e8', 'e1', 'Paso 3: Da jaque al rey en e1 con tu Torre.', 'Mueve la torre a e1.', '¡Jaque en la 1ª fila!'),
          ex('ex_4', '8/8/8/8/8/8/5K2/4r2k b - - 2 3', 'e1', 'a1', 'Paso 4: Desliza tu Torre a a1 para preparar jaques por la espalda.', 'Mueve la torre a a1.', '¡Torre a distancia de jaques!'),
          ex('ex_5', '8/8/8/8/8/8/5K2/r6k b - - 3 4', 'a1', 'a8', 'Paso 5: Lleva tu Torre a a8.', 'Mueve la torre a a8.', '¡Defensa de Philidor dominada!')
        ]
      },
      {
        id: 'l61_torre_septima_fila',
        number: 61,
        title: 'La actividad de la Torre en la 7ª fila',
        category: 'estrategia',
        steps: [
          th('El Dragón en la Séptima', 'Una Torre en la 7ª fila paraliza al Rey enemigo, corta su salida y barre toda la cadena de peones contrarios.', '8/5ppp/8/8/8/8/R7/4K2k w - - 0 1'),
          ex('ex_1', '8/5ppp/8/8/8/8/R7/4K2k w - - 0 1', 'a2', 'a7', 'Paso 1: Infiltra tu Torre en la 7ª fila en a7.', 'Lleva tu torre a a7.', '¡Torre en 7ª fila dominante!'),
          ex('ex_2', 'R7/5ppp/8/8/8/8/8/4K2k w - - 0 1', 'a8', 'f8', 'Paso 2: Captura en f8 con tu Torre.', 'Captura en f8 con la torre.', '¡Captura en la 8ª fila!'),
          ex('ex_3', '5R2/5ppp/8/8/8/8/8/4K2k w - - 0 1', 'f8', 'f7', 'Paso 3: Captura el peón en f7 con tu Torre.', 'Captura en f7 con la torre.', '¡Peón de f7 devorado!'),
          ex('ex_4', '5R2/5p1p/8/8/8/8/8/4K2k w - - 0 1', 'f8', 'h8', 'Paso 4: Da Jaque Mate en h8 con tu Torre.', 'Lleva la torre a h8.', '¡Jaque Mate!'),
          ex('ex_5', '7R/5p1p/8/8/8/4K3/8/7k w - - 1 2', 'h8', 'h7', 'Paso 5: Captura el peón en h7 con tu Torre.', 'Captura en h7 con la torre.', '¡Torre en 7ª fila dominada!')
        ]
      },
      {
        id: 'l62_alfiles_diferente_color',
        number: 62,
        title: 'Finales de Alfiles de diferente color',
        category: 'finales',
        steps: [
          th('La Tendencia a las Tablas', 'En finales de alfiles de distinto color, el bando defensor puede crear fortalezas inexpugnables bloqueando en las casillas del color de su propio alfil.', '8/8/8/4P3/8/8/1B6/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/4P3/8/8/1B6/4K2k w - - 0 1', 'e5', 'e6', 'Paso 1: Avanza tu peón central a e6.', 'Mueve el peón a e6.', '¡Peón a 6ª fila!'),
          ex('ex_2', '8/8/4P3/8/8/8/1B6/4K2k w - - 0 1', 'e6', 'e7', 'Paso 2: Continúa a e7 con el peón.', 'Avanza a e7.', '¡A un paso de la Dama!'),
          ex('ex_3', '8/4P3/8/8/8/8/1B6/4K2k w - - 0 1', 'e7', 'e8', 'Paso 3: Corona tu peón en Dama en e8.', 'Corona en Dama.', '¡Dama en el tablero!', 'q'),
          ex('ex_4', '4Q3/8/8/8/8/8/1B6/4K2k w - - 0 1', 'e8', 'e4', 'Paso 4: Centraliza tu Dama a e4.', 'Mueve la dama a e4.', '¡Dama al centro!'),
          ex('ex_5', '8/8/8/8/4Q3/8/1B6/4K2k w - - 1 2', 'e4', 'h7', 'Paso 5: Da Jaque Mate en h7 con tu Dama.', 'Lleva tu dama a h7.', '¡Alfiles de distinto color dominados!')
        ]
      },
      {
        id: 'l63_alfiles_mismo_color',
        number: 63,
        title: 'Finales de Alfiles del mismo color',
        category: 'finales',
        steps: [
          th('Fijar los Peones en el Color Opuesto', 'En alfiles del mismo color, coloca tus peones en casillas del color opuesto a tu alfil para no entorpecerlo y atacar los peones rivales.', '8/8/8/8/2B5/8/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/8/2B5/8/8/4K2k w - - 0 1', 'c4', 'f7', 'Paso 1: Lleva tu Alfil a f7 dominando la diagonal.', 'Mueve el alfil a f7.', '¡Alfil activo!'),
          ex('ex_2', '8/5B2/8/8/8/8/8/4K2k w - - 0 1', 'f7', 'e6', 'Paso 2: Centraliza tu Alfil a e6.', 'Lleva el alfil a e6.', '¡Alfil en casilla óptima!'),
          ex('ex_3', '8/8/4B3/8/8/8/8/4K2k w - - 0 1', 'e1', 'e2', 'Paso 3: Acerca tu Rey a e2.', 'Mueve el rey a e2.', '¡Rey en marcha!'),
          ex('ex_4', '8/8/4B3/8/8/4K3/8/7k w - - 1 2', 'e3', 'e4', 'Paso 4: Continúa a e4 con el Rey.', 'Avanza el rey a e4.', '¡Rey dominante!'),
          ex('ex_5', '8/8/4B3/8/4K3/8/8/7k w - - 2 3', 'e6', 'f7', 'Paso 5: Coloca tu Alfil en f7.', 'Mueve el alfil a f7.', '¡Final de alfiles del mismo color dominado!')
        ]
      },
      {
        id: 'l64_caballo_vs_alfil',
        number: 64,
        title: 'Caballo vs Alfil en finales',
        category: 'finales',
        steps: [
          th('Posiciones Abiertas vs Cerradas', 'El Alfil domina en posiciones abiertas con peones en ambos flancos; el Caballo reina en posiciones cerradas con bloqueos fijos.', '8/8/8/8/8/5N2/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/8/8/5N2/8/4K2k w - - 0 1', 'f3', 'e5', 'Paso 1: Centraliza tu Caballo a e5.', 'Mueve el caballo a e5.', '¡Caballo central dominante!'),
          ex('ex_2', '8/8/8/4N3/8/8/8/4K2k w - - 0 1', 'e5', 'f7', 'Paso 2: Salta a f7 con tu Caballo.', 'Mueve el caballo a f7.', '¡Caballo en avanzada!'),
          ex('ex_3', '8/5N2/8/8/8/8/8/4K2k w - - 0 1', 'e1', 'f2', 'Paso 3: Acerca tu Rey a f2.', 'Avanza el rey a f2.', '¡Rey en apoyo!'),
          ex('ex_4', '8/5N2/8/8/8/5K2/8/7k w - - 1 2', 'f3', 'g3', 'Paso 4: Avanza tu Rey a g3.', 'Mueve el rey a g3.', '¡Rey en ataque!'),
          ex('ex_5', '8/5N2/8/8/8/6K1/8/7k w - - 2 3', 'f7', 'g5', 'Paso 5: Salta con tu Caballo a g5.', 'Mueve el caballo a g5.', '¡Duelo Caballo vs Alfil dominado!')
        ]
      },
      {
        id: 'l65_triangulacion_rey',
        number: 65,
        title: 'Triangulación del Rey',
        category: 'finales',
        steps: [
          th('Perder un Tiempo para Ganar la Partida', 'La triangulación permite a tu Rey maniobrar en un triángulo geométrico de 3 casillas para ceder el turno al rival y obligarlo a entrar en Zugzwang.', '4k3/8/8/8/8/8/4K3/8 w - - 0 1'),
          ex('ex_1', '4k3/8/8/8/8/8/4K3/8 w - - 0 1', 'e2', 'd2', 'Paso 1: Mueve tu Rey a d2 iniciando el triángulo.', 'Mueve tu rey a d2.', '¡Primer paso de la triangulación!'),
          ex('ex_2', '4k3/8/8/8/8/8/3K4/8 w - - 0 1', 'd2', 'd3', 'Paso 2: Avanza tu Rey a d3.', 'Avanza el rey a d3.', '¡Segundo paso del triángulo!'),
          ex('ex_3', '4k3/8/8/8/8/3K4/8/8 w - - 0 1', 'd3', 'e3', 'Paso 3: Regresa a e3 completando la triangulación con el turno para el rival.', 'Lleva el rey a e3.', '¡Triangulación completada! El rival entra en Zugzwang.'),
          ex('ex_4', '4k3/8/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 4: Avanza con tu Rey a e4 tomando espacio.', 'Avanza el rey a e4.', '¡Rey gana espacio!'),
          ex('ex_5', '4k3/8/8/8/4K3/8/8/8 w - - 0 1', 'e4', 'e5', 'Paso 5: Lleva tu Rey a e5 consolidando la ventaja.', 'Mueve a e5.', '¡Triangulación dominada al 100%!')
        ]
      },
      {
        id: 'l66_zugzwang',
        number: 66,
        title: 'El concepto de Zugzwang',
        category: 'finales',
        steps: [
          th('La Obligación Fatal de Mover', 'Zugzwang es la situación donde cualquier jugada que el rival realice empeora irremediablemente su posición y le hace perder la partida.', 'k7/8/1K6/8/8/8/8/8 w - - 0 1'),
          ex('ex_1', 'k7/8/1K6/8/8/8/8/1R6 w - - 0 1', 'b1', 'h1', 'Paso 1: Mueve tu Torre a h1 dejando al rey rival en Zugzwang.', 'Mueve la torre a h1.', '¡Zugzwang provocado! El rey negro debe mover a b8.'),
          ex('ex_2', '1k6/8/1K6/8/8/8/8/7R w - - 1 2', 'h1', 'h8', 'Paso 2: Da Jaque Mate en h8 con tu Torre.', 'Lleva la torre a h8.', '¡Jaque Mate!'),
          ex('ex_3', '8/k7/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a7', 'Paso 3: Corta en la 7ª fila con tu Torre.', 'Lleva tu torre a a7.', '¡Corte de fila!'),
          ex('ex_4', '8/Rk6/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 4: Acerca tu Rey a e4.', 'Avanza el rey a e4.', '¡Rey en marcha!'),
          ex('ex_5', '8/Rk6/4K3/8/8/8/8/8 w - - 1 2', 'a7', 'a8', 'Paso 5: Da Jaque Mate en a8.', 'Mueve la torre a a8.', '¡Zugzwang y mates dominados!')
        ]
      },
      {
        id: 'l67_fortaleza',
        number: 67,
        title: 'La fortaleza defensiva',
        category: 'finales',
        steps: [
          th('El Muro Infranqueable', 'Una fortaleza es una configuración defensiva donde un bando con desventaja material bloquea todas las vías de penetración del rival forzando tablas.', '8/8/8/4P3/8/8/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/4P3/8/8/8/4K2k w - - 0 1', 'e5', 'e6', 'Paso 1: Avanza tu peón central a e6.', 'Avanza el peón a e6.', '¡Avance hacia la 6ª fila!'),
          ex('ex_2', '8/8/4P3/8/8/8/8/4K2k w - - 0 1', 'e6', 'e7', 'Paso 2: Continúa a e7 con el peón.', 'Mueve a e7.', '¡A un paso de la coronación!'),
          ex('ex_3', '8/4P3/8/8/8/8/8/4K2k w - - 0 1', 'e7', 'e8', 'Paso 3: Corona en Dama en e8.', 'Corona en Dama.', '¡Dama en juego!', 'q'),
          ex('ex_4', '4Q3/8/8/8/8/8/8/4K2k w - - 0 1', 'e8', 'e4', 'Paso 4: Centraliza tu Dama a e4.', 'Mueve tu dama a e4.', '¡Dama al centro!'),
          ex('ex_5', '8/8/8/8/4Q3/8/8/4K2k w - - 1 2', 'e4', 'h7', 'Paso 5: Da Jaque Mate en h7.', 'Lleva la dama a h7.', '¡Fortalezas y rupturas dominadas!')
        ]
      },
      {
        id: 'l68_ruptura_peones',
        number: 68,
        title: 'Rupturas de peones en el final',
        category: 'finales',
        steps: [
          th('Dinamitar la Cadena', 'Sacrificar uno o dos peones en un final de 3 vs 3 peones para crear un peón pasado libre que corone antes que los peones rivales.', '8/8/8/8/8/P1P1P3/8/4K2k w - - 0 1'),
          ex('ex_1', '8/8/8/8/8/P1P1P3/8/4K2k w - - 0 1', 'c3', 'c4', 'Paso 1: Avanza el peón central a c4 iniciando la ruptura.', 'Avanza a c4.', '¡Ruptura iniciada!'),
          ex('ex_2', '8/8/8/8/2P5/P3P3/8/4K2k w - - 0 1', 'c4', 'c5', 'Paso 2: Continúa a c5 con el peón.', 'Mueve a c5.', '¡Peón en 5ª fila!'),
          ex('ex_3', '8/8/8/2P5/8/P3P3/8/4K2k w - - 0 1', 'c5', 'c6', 'Paso 3: Avanza a c6.', 'Lleva el peón a c6.', '¡Peón pasado imparable!'),
          ex('ex_4', '8/8/2P5/8/8/P3P3/8/4K2k w - - 0 1', 'c6', 'c7', 'Paso 4: Avanza a c7 a un paso de coronar.', 'Mueve a c7.', '¡A un paso de la gloria!'),
          ex('ex_5', '8/2P5/8/8/8/P3P3/8/4K2k w - - 0 1', 'c7', 'c8', 'Paso 5: Corona en Dama en c8.', 'Corona en Dama en c8.', '¡Ruptura de peones exitosa!', 'q')
        ]
      },
      {
        id: 'l69_dos_debilidades',
        number: 69,
        title: 'El principio de los dos puntos débiles',
        category: 'estrategia',
        steps: [
          th('Atacar en Dos Frentes', 'Un defensor puede resistir una sola debilidad; pero cuando creas una segunda debilidad en el flanco opuesto, sus piezas colapsan sin remedio.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Captura el caballo en c6 creando la primera debilidad en la estructura negra.', 'Captura en c6 con el alfil.', '¡Primera debilidad creada!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd4', 'Paso 3: Golpea el centro con d2-d4 creando el segundo frente de ataque.', 'Avanza el peón a d4.', '¡Segundo punto débil presionado!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/3PP3/5N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'e5', 'd4', 'Paso 3: Juegas con negras. Captura en d4 con el peón.', 'Captura en d4.', '¡Centro abierto!'),
          ex('ex_4', 'r1bqk2r/p1pp1ppp/2p5/8/3bP3/5N2/PPP2PPP/RNBQK2R w KQkq - 0 2', 'f3', 'd4', 'Paso 4: Recaptura el peón en d4 con tu Caballo en f3.', 'Captura en d4 con el caballo.', '¡Caballo central dominante!'),
          ex('ex_5', 'r1bqk2r/p1pp1ppp/2p5/8/3NP3/8/PPP2PPP/RNBQK2R b KQkq - 0 2', 'c8', 'a6', 'Paso 5: Desarrolla tu Alfil a a6.', 'Mueve el alfil a a6.', '¡Principio de las dos debilidades asimilado!')
        ]
      },
      {
        id: 'l70_centralizacion_rey_final',
        number: 70,
        title: 'Centralización del Rey en el final',
        category: 'finales',
        steps: [
          th('El Rey es una Pieza de Ataque', 'En el final, sin Damas en el tablero, el Rey deja su refugio del enroque y se convierte en una pieza activa de ataque en el centro.', '4k3/8/8/8/8/8/8/4K3 w - - 0 1'),
          ex('ex_1', '4k3/8/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 1: Avanza tu Rey a e2 hacia el centro del tablero.', 'Mueve tu rey a e2.', '¡Rey hacia el centro!'),
          ex('ex_2', '4k3/8/8/8/8/8/4K3/8 w - - 0 1', 'e2', 'e3', 'Paso 2: Da otro paso con tu Rey a e3.', 'Avanza el rey a e3.', '¡Rey activo en marcha!'),
          ex('ex_3', '4k3/8/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'd4', 'Paso 3: Centraliza tu Rey a d4 dominando casillas clave.', 'Lleva el rey a d4.', '¡Rey en el centro!'),
          ex('ex_4', '4k3/8/8/8/3K4/8/8/8 w - - 0 1', 'd4', 'e5', 'Paso 4: Infiltra tu Rey a e5.', 'Mueve el rey a e5.', '¡Rey en territorio rival!'),
          ex('ex_5', '4k3/8/8/4K3/8/8/8/8 w - - 0 1', 'e5', 'd6', 'Paso 5: Lleva tu Rey a d6 acorralando al rey rival.', 'Avanza a d6.', '¡Centralización del Rey dominada!')
        ]
      },
      {
        id: 'l71_final_damas',
        number: 71,
        title: 'Finales de Damas: evitar jaques perpetuos',
        category: 'finales',
        steps: [
          th('La Escolta de la Dama', 'En finales de Damas debes usar tu propia Dama para interponerla y bloquear los jaques continuos del rival mientras tu peón avanza a coronar.', '8/4P3/8/8/8/8/8/4K2k w - - 0 1'),
          ex('ex_1', '8/4P3/8/8/8/8/8/4K2k w - - 0 1', 'e7', 'e8', 'Paso 1: Corona tu peón en Dama en e8.', 'Corona en Dama en e8.', '¡Dama coronada!', 'q'),
          ex('ex_2', '4Q3/8/8/8/8/8/8/4K2k w - - 0 1', 'e8', 'e4', 'Paso 2: Centraliza tu Dama a e4 para dominar el tablero.', 'Lleva tu dama a e4.', '¡Dama centralizada!'),
          ex('ex_3', '8/8/8/8/4Q3/8/8/4K2k w - - 1 2', 'e4', 'e7', 'Paso 3: Avanza con tu Dama a e7.', 'Mueve la dama a e7.', '¡Ataque a la 7ª fila!'),
          ex('ex_4', '8/4Q3/8/8/8/8/8/4K2k w - - 2 3', 'e1', 'f2', 'Paso 4: Acerca tu Rey a f2.', 'Avanza el rey a f2.', '¡Rey seguro!'),
          ex('ex_5', '8/4Q3/8/8/8/5K2/8/7k w - - 3 4', 'e7', 'g7', 'Paso 5: Da Jaque Mate en g7 con tu Dama.', 'Lleva la dama a g7.', '¡Final de Damas dominado!')
        ]
      },
      {
        id: 'l72_transicion_final',
        number: 72,
        title: 'Transición calculada al final',
        category: 'estrategia',
        steps: [
          th('Simplificar con Ventaja', 'Cuando tienes ventaja material (un peón de más o una pieza), cambia las Damas y piezas mayores para entrar a un final elemental 100% ganado.', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
          ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'b5', 'c6', 'Paso 1: Cambia tu Alfil por el Caballo en c6 simplificando la posición.', 'Captura en c6 con el alfil.', '¡Simplificación iniciada!'),
          ex('ex_2', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'd2', 'd3', 'Paso 2: Sostén tu centro con d2-d3.', 'Avanza el peón a d3.', '¡Estructura sólida!'),
          ex('ex_3', 'r1bqk2r/p1pp1ppp/2p5/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 1', 'd7', 'd6', 'Paso 3: Juegas con negras. Juega d7-d6.', 'Mueve el peón a d6.', '¡Defensa equilibrada!'),
          ex('ex_4', 'r1bqk2r/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'e1', 'g1', 'Paso 4: Enroca corto con blancas.', 'Mueve tu rey a g1.', '¡Rey en seguridad!'),
          ex('ex_5', 'r1bq1rk1/p1p2ppp/2pp1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b - - 0 1', 'c8', 'g4', 'Paso 5: Clava el caballo con tu Alfil en g4.', 'Mueve el alfil a g4.', '¡Graduación de Etapa 3 Completada con Éxito!')
        ]
      }
    ]
  };
}
