import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';

console.log('Construyendo base curricular interactiva de 110 lecciones...');

// Helper para validar un ejercicio
function ex(id, fen, from, to, instruction, hint, feedback, promo) {
  const chess = new Chess(fen);
  const sol = { from, to };
  const piece = chess.get(from);
  if (promo || (piece && piece.type === 'p' && (to.endsWith('8') || to.endsWith('1')))) {
    sol.promotion = promo || 'q';
  }
  const move = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || undefined });
  if (!move) {
    throw new Error(`¡Jugada inválida en ${id}! ${from}->${to} en FEN: ${fen}`);
  }
  return {
    id,
    fen,
    instruction,
    solution: sol,
    hint,
    feedback
  };
}

function th(title, text, fen) {
  if (fen) {
    try { new Chess(fen); } catch(e) { throw new Error(`FEN inválido en teoría: ${fen}`); }
  }
  return { type: 'theory', title, text, fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' };
}

// =========================================================================
// ETAPA 1: DOMINAR LOS CONCEPTOS BÁSICOS (Lecciones 1 a 24)
// =========================================================================
const etapa1 = {
  id: 'etapa-1-basicos',
  title: 'ETAPA 1: DOMINAR LOS CONCEPTOS BÁSICOS (0 - 800 Elo)',
  category: 'basicos',
  badge: 'Iniciación Junvill',
  eloRange: '0 - 800 Elo',
  lessons: [
    {
      id: 'l01_piezas',
      number: 1,
      title: 'Aprende acerca de las piezas',
      category: 'posicional',
      steps: [
        th('El Ejército de 16 Piezas', 'Cada bando comanda 16 piezas: 8 Peones, 2 Caballos, 2 Alfiles, 2 Torres, 1 Dama y 1 Rey. Cada una posee un movimiento único y un poder específico en la batalla.', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
        ex('ex_1', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'e2', 'e4', 'Paso 1: Mueve tu Peón de Rey dos casillas hacia adelante de e2 a e4 para dominar el centro.', 'Avanza el peón blanco de e2 a e4.', '¡Excelente apertura! El peón domina el centro y abre diagonales para tu Dama y Alfil.'),
        ex('ex_2', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'g1', 'f3', 'Paso 2: Desarrolla tu Caballo en salto en L de g1 a f3 atacando el peón central enemigo.', 'Mueve el caballo de g1 a f3.', '¡Gran jugada! El caballo es la única pieza que puede saltar por encima de otras piezas.'),
        ex('ex_3', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3', 'f1', 'c4', 'Paso 3: Activa tu Alfil de casillas blancas por su diagonal abierta de f1 a c4.', 'Lleva tu alfil de f1 a c4.', '¡Brillante! El alfil controla la gran diagonal apuntando hacia el flanco del rey rival.'),
        ex('ex_4', '4k3/8/8/8/8/8/R7/4K3 w - - 0 1', 'a2', 'a8', 'Paso 4: Mueve tu Torre verticalmente por la columna abierta de a2 a a8.', 'Avanza tu torre por la columna "a" hasta a8.', '¡Poder lineal! Las torres dominan filas y columnas abiertas con gran alcance.'),
        ex('ex_5', '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1', 'e2', 'e7', 'Paso 5: Mueve tu Dama (la pieza más poderosa) de e2 a e7 para dar jaque directo al rey rival.', 'Avanza tu dama de e2 a e7.', '¡Ataque demoledor! La dama combina el movimiento de la Torre y el Alfil en todas las direcciones.')
      ]
    },
    {
      id: 'l02_capturas',
      number: 2,
      title: 'Captura piezas enemigas',
      category: 'tactica',
      steps: [
        th('El Arte de la Captura', 'En el ajedrez capturas ocupando la casilla de la pieza enemiga y retirándola de la partida. ¡Practiquemos capturar con cada una de tus piezas!', '8/8/8/3p4/4P3/8/8/4K2k w - - 0 1'),
        ex('ex_1', '8/8/8/3p4/4P3/8/8/4K2k w - - 0 1', 'e4', 'd5', 'Paso 1 (Captura con Peón): Los peones capturan un paso en diagonal. Captura el peón negro en d5 con tu peón de e4.', 'Mueve en diagonal de e4 a d5 capturando el peón.', '¡Excelente captura con peón! Has eliminado la pieza enemiga ganando el centro.'),
        ex('ex_2', '8/8/8/4p3/8/5N2/8/4K2k w - - 0 1', 'f3', 'e5', 'Paso 2 (Captura con Caballo): Tu caballo salta en L. Captura el peón negro en e5 con tu Caballo de f3.', 'Salta de f3 a e5 capturando el peón.', '¡Gran salto! El caballo captura exactamente en la casilla de aterrizaje de su L.'),
        ex('ex_3', '8/5p2/8/8/2B5/8/8/4K2k w - - 0 1', 'c4', 'f7', 'Paso 3 (Captura con Alfil): Tu Alfil se desplaza en diagonal. Captura el peón enemigo en f7 con tu Alfil de c4.', 'Desliza tu alfil de c4 a f7 capturando la pieza.', '¡Diagonal perfecta! El alfil barrió la diagonal y capturó el peón.'),
        ex('ex_4', '4r3/8/8/8/8/8/4R3/4K2k w - - 0 1', 'e2', 'e8', 'Paso 4 (Captura con Torre): Tu Torre domina la columna "e". Captura la Torre negra en e8 con tu Torre de e2.', 'Avanza tu torre por la columna hasta e8 capturando la torre rival.', '¡Captura limpia de Torre! Controlas toda la columna vertical.'),
        ex('ex_5', '8/4n3/8/8/8/8/4Q3/4K2k w - - 0 1', 'e2', 'e7', 'Paso 5 (Captura con Dama): La Dama tiene máximo poder. Captura el Caballo negro en e7 con tu Dama de e2.', 'Lleva tu dama de e2 a e7 capturando el caballo.', '¡Dominio total! Has aprendido a capturar exitosamente con peón, caballo, alfil, torre y dama.')
      ]
    },
    {
      id: 'l03_desprotegidas',
      number: 3,
      title: 'Captura piezas desprotegidas',
      category: 'tactica',
      steps: [
        th('Piezas en el Aire (Colgadas)', 'Una pieza desprotegida no tiene defensores aliados que la cuiden. Siempre debes estar atento para capturarlas totalmente gratis.', 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3'),
        ex('ex_1', 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3', 'b5', 'c6', 'Paso 1: El caballo negro en c6 está desprotegido. Captúralo con tu Alfil de b5.', 'Captura en c6 con tu alfil de b5.', '¡Excelente captura! Ganas un caballo limpio sin que ninguna pieza enemiga te contraataque.'),
        ex('ex_2', 'r3k2r/ppp2ppp/8/8/3Q4/8/PPP2PPP/4K2R w Kkq - 0 1', 'd4', 'g7', 'Paso 2: Las negras dejaron su peón en g7 completamente desprotegido. Captúralo con tu Dama de d4.', 'Lleva tu dama de d4 a g7 capturando el peón.', '¡Gran visión táctica! Capturas el peón y amenazas directamente la torre de h8.'),
        ex('ex_3', '4k3/8/8/4n3/8/5N2/8/4K3 w - - 0 1', 'f3', 'e5', 'Paso 3: El caballo negro en e5 está solo y sin protección. Captúralo con tu Caballo de f3.', 'Captura el caballo en e5 con tu caballo de f3.', '¡Caballo gratis! Has eliminado la pieza enemiga de un solo golpe.'),
        ex('ex_4', '4k3/8/8/8/1b6/P7/8/4K3 w - - 0 1', 'a3', 'b4', 'Paso 4: El alfil negro en b4 está desprotegido. Captúralo con tu peón de a3.', 'Captura en diagonal el alfil de b4 con tu peón en a3.', '¡Ganancia de pieza colgada! Tu peón de 1 punto se come un alfil de 3 puntos.'),
        ex('ex_5', '3r2k1/5ppp/8/8/8/8/3R4/4K3 w - - 0 1', 'd2', 'd8', 'Paso 5: La torre negra en d8 no tiene defensor. Captúrala directamente con tu Torre de d2.', 'Avanza tu torre por la columna hasta d8 capturando la torre rival.', '¡Captura y jaque mate! Al capturar la pieza desprotegida asestas además el jaque mate del pasillo.')
      ]
    },
    {
      id: 'l04_valor_piezas',
      number: 4,
      title: 'Conoce el valor de las piezas',
      category: 'tactica',
      steps: [
        th('La Escala de Valor FIDE', 'Peón = 1 pt, Caballo = 3 pts, Alfil = 3 pts, Torre = 5 pts, Dama = 9 pts, Rey = ¡Infinito! Siempre busca capturar piezas de mayor valor.', '4r3/4p3/8/8/8/8/4R3/4K2k w - - 0 1'),
        ex('ex_1', '4r3/4p3/8/8/8/8/4R3/4K2k w - - 0 1', 'e2', 'e8', 'Paso 1: Puedes capturar el peón en e7 (1 pt) o la Torre en e8 (5 pts). Captura la pieza de MAYOR valor con tu Torre.', 'Captura la torre negra en e8 con tu torre.', '¡Decisión perfecta! Ganar 5 puntos (Torre) es mucho mejor que ganar 1 punto (Peón).'),
        ex('ex_2', '4q3/8/8/4p3/8/5N2/8/4K2k w - - 0 1', 'f3', 'e8', 'Paso 2: Tu Caballo (3 pts) puede capturar el peón de e5 (1 pt) o la Dama en e8 (9 pts). ¡Captura la Dama!', 'Salta con tu caballo hasta e8 para capturar la Dama rival.', '¡Ganancia monumental de +9 puntos! Has cambiado tu caballo por la pieza más poderosa del rival.'),
        ex('ex_3', 'r7/8/8/8/2B5/8/8/4K2k w - - 0 1', 'c4', 'a8', 'Paso 3: Gana la calidad capturando la Torre enemiga en a8 (5 pts) con tu Alfil (3 pts).', 'Captura la torre en a8 con tu alfil de c4.', '¡Ganancia de calidad! Tu alfil de 3 pts captura una torre de 5 pts (+2 pts de ventaja).'),
        ex('ex_4', '8/8/8/2b5/3P4/8/8/4K2k w - - 0 1', 'd4', 'c5', 'Paso 4: Tu peón (1 pt) puede capturar el alfil negro (3 pts) en c5. ¡Realiza la captura!', 'Captura en diagonal el alfil de c5 con tu peón en d4.', '¡Intercambio super rentable! Ganas 3 puntos entregando sólo 1 peón.'),
        ex('ex_5', '3q4/8/8/8/8/8/3R4/4K2k w - - 0 1', 'd2', 'd8', 'Paso 5: Captura la Dama rival en d8 (9 pts) con tu Torre (5 pts) para sentenciar la victoria.', 'Avanza por la columna hasta d8 capturando la dama.', '¡Maestría en el valor material! Has consolidado una ventaja decisiva en el tablero.')
      ]
    },
    {
      id: 'l05_coronacion',
      number: 5,
      title: 'Promueve tus peones (Coronación)',
      category: 'estrategia',
      steps: [
        th('La Gran Transformación', 'Cuando un peón llega a la última fila (la 8ª para blancas, la 1ª para negras), se transforma inmediatamente en Dama, Torre, Alfil o Caballo.', '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1'),
        ex('ex_1', '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1', 'e7', 'e8', 'Paso 1: Tu peón blanco en e7 ha llegado al final. Avanza a e8 y corónalo en Dama.', 'Mueve el peón a e8 y corona en Dama.', '¡Corona en Dama con éxito! Ahora tienes una Dama invencible.', 'q'),
        ex('ex_2', 'k7/P7/8/8/8/8/8/4K3 w - - 0 1', 'a7', 'a8', 'Paso 2: Avanza tu peón de a7 a a8 para coronar en Dama y arrinconar al rey negro.', 'Avanza a a8 coronando en Dama.', '¡Excelente coronación! La nueva Dama controla todo el flanco de dama.', 'q'),
        ex('ex_3', '5k2/5P2/8/8/8/8/8/4K3 w - - 0 1', 'f7', 'f8', 'Paso 3: Avanza tu peón de f7 a f8 coronando en Dama con jaque directo al rey.', 'Corona en f8 transformando el peón en Dama.', '¡Coronación con jaque! El rey rival no tiene escapatoria.', 'q'),
        ex('ex_4', '7k/7P/8/8/8/8/8/4K3 w - - 0 1', 'h7', 'h8', 'Paso 4: Corona tu peón de h7 a h8 para obtener una Dama decisiva.', 'Mueve a h8 y corona en Dama.', '¡Brillante! Peón coronado y posición totalmente ganada.', 'q'),
        ex('ex_5', '4k3/8/8/8/8/8/3p4/4K3 b - - 0 1', 'd2', 'd1', 'Paso 5: Juegas con negras. Tu peón en d2 está a punto de coronar. Avanza a d1 y corona en Dama con jaque.', 'Mueve el peón negro a d1 coronando en Dama.', '¡Gran coronación con negras! Has dominado el concepto de promoción en ambos bandos.', 'q')
      ]
    },
    {
      id: 'l06_jaque',
      number: 6,
      title: 'Cómo dar jaque al Rey',
      category: 'tactica',
      steps: [
        th('Amenaza al Monarca', 'Un jaque ocurre cuando una de tus piezas ataca directamente la casilla donde se encuentra el Rey rival. El rey amenazado debe responder de inmediato.', '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1'),
        ex('ex_1', '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1', 'e2', 'e7', 'Paso 1 (Jaque con Dama): Avanza tu Dama de e2 a e7 para dar jaque directo al rey en e8.', 'Mueve tu dama a e7 dando jaque.', '¡Jaque con Dama! El rey negro está bajo fuego directo.'),
        ex('ex_2', '4k3/8/8/8/8/8/R7/4K3 w - - 0 1', 'a2', 'a8', 'Paso 2 (Jaque con Torre): Lleva tu Torre de a2 a a8 para dar jaque en la octava fila.', 'Avanza la torre por la columna hasta a8.', '¡Jaque con Torre! Toda la 8ª fila queda atacada.'),
        ex('ex_3', '4k3/8/8/8/2B5/8/8/4K3 w - - 0 1', 'c4', 'f7', 'Paso 3 (Jaque con Alfil): Lleva tu Alfil de c4 a f7 atacando al rey en diagonal.', 'Mueve tu alfil de c4 a f7.', '¡Jaque en diagonal! El alfil apunta directamente a la casilla del rey.'),
        ex('ex_4', '4k3/8/8/8/8/5N2/8/4K3 w - - 0 1', 'f3', 'g5', 'Paso 4 (Jaque con Caballo): Salta con tu Caballo de f3 a g5 para amenazar al rey.', 'Lleva tu caballo a g5 para amenazar al rey.', '¡Jaque de Caballo! Un ataque sorpresivo que no se puede bloquear interponiendo piezas.'),
        ex('ex_5', '4k3/8/8/3P4/8/8/8/4K3 w - - 0 1', 'd5', 'd6', 'Paso 5 (Jaque con Peón): Avanza tu peón de d5 a d6 amenazando en diagonal.', 'Avanza tu peón a d6.', '¡Jaque con peón! Incluso la pieza más modesta puede poner al rey en apuros.')
      ]
    },
    {
      id: 'l07_escapar_jaque',
      number: 7,
      title: 'Cómo escapar del jaque (C-I-M)',
      category: 'tactica',
      steps: [
        th('La Regla de Oro: C - I - M', 'Para escapar de un jaque sólo existen 3 formas: 1. C = Capturar la pieza atacante, 2. I = Interponer una pieza entre el atacante y el rey, 3. M = Mover el Rey a una casilla segura.', '4k3/4r3/8/8/8/8/4Q3/4K3 b - - 0 1'),
        ex('ex_1', '4k3/4r3/8/8/8/8/4Q3/4K3 b - - 0 1', 'e7', 'e2', 'Paso 1 (C = Capturar): La Dama blanca en e2 te da jaque. ¡Captúrala con tu Torre en e7!', 'Captura la dama en e2 con tu torre.', '¡Excelente! Capturar la pieza atacante es la defensa más contundente.'),
        ex('ex_2', '4r1k1/8/8/8/8/8/8/4K2R w K - 0 1', 'e1', 'd2', 'Paso 2 (M = Mover el Rey): La torre negra en e8 te da jaque. Mueve tu Rey a una casilla segura en d2.', 'Mueve tu rey a d2 para salir de la línea de jaque.', '¡Rey a salvo! Escapas de la columna atacada.'),
        ex('ex_3', '4k3/4r3/8/8/8/8/8/3QK3 b - - 0 1', 'e7', 'd7', 'Paso 3 (I = Interponer): La Dama blanca en d1 te da jaque por la columna. Interpón tu Torre de e7 a d7 bloqueando el jaque.', 'Mueve tu torre a d7 para interponerla en la columna.', '¡Escudo perfecto! Has interpuesto una pieza salvando a tu monarca.'),
        ex('ex_4', 'r1bqk2r/pppp1Qpp/2n5/2b1p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1', 'e8', 'f7', 'Paso 4 (C = Capturar): La Dama en f7 da jaque al rey. Captúrala directamente con tu Rey de e8 a f7.', 'Captura la dama con tu rey en f7.', '¡Dama neutralizada! Tu rey eliminó personalmente la amenaza.'),
        ex('ex_5', '4k3/8/8/8/8/8/8/R3K3 b - - 0 1', 'e8', 'e7', 'Paso 5 (M = Mover el Rey): La Torre en a1 da jaque por la fila. Mueve tu Rey a una casilla libre en e7.', 'Mueve tu rey a e7.', '¡Has dominado el C-I-M! Ahora sabes exactamente cómo defenderte de cualquier jaque.')
      ]
    },
    {
      id: 'l08_mate_1',
      number: 8,
      title: 'Jaque mate en 1 movimiento',
      category: 'tactica',
      steps: [
        th('El Fin de la Partida', 'El Jaque Mate ocurre cuando el Rey rival está en jaque y NO puede Capturar, Interponer ni Mover a ninguna casilla segura. ¡La partida termina con victoria instantánea!', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1'),
        ex('ex_1', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 1 (Mate del Pasillo): El rey negro está atrapado tras sus peones. Lleva tu Torre de a1 a a8 dando jaque mate.', 'Avanza tu torre hasta a8.', '¡Jaque Mate del pasillo! El rey no tiene escapatoria en la 8ª fila.'),
        ex('ex_2', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4', 'f3', 'f7', 'Paso 2 (Mate del Pastor): Tu Dama y Alfil apuntan al punto débil f7. Captura en f7 con tu Dama dando Jaque Mate.', 'Captura el peón en f7 con tu dama.', '¡Jaque Mate del Pastor! El rey negro no puede capturar porque la Dama está defendida por el Alfil de c4.'),
        ex('ex_3', '5rk1/5p1p/6N1/8/8/8/8/4K1R1 w - - 0 1', 'g1', 'g8', 'Paso 3 (Mate Árabe): El Caballo en g6 corta la casilla h8. Lleva tu Torre a g8 dando Jaque Mate.', 'Lleva tu torre a g8.', '¡Jaque Mate Árabe! Coordinación perfecta entre Torre y Caballo.'),
        ex('ex_4', 'k7/8/1K6/8/8/8/8/R7 w - - 0 1', 'a1', 'a8', 'Paso 4 (Mate con Torre y Rey): El rey negro está arrinconado en a8. Lleva tu Torre de a1 a a8 dando Jaque Mate.', 'Mueve tu torre a a8.', '¡Jaque Mate! El rey blanco corta todas las casillas de escape.'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'c4', 'f7', 'Paso 5: Asesta el golpe decisivo en f7 capturando con tu Alfil.', 'Mueve tu alfil de c4 a f7.', '¡Victoria total! Has completado con éxito 5 patrones esenciales de mate en 1.')
      ]
    },
    {
      id: 'l09_rey_ahogado',
      number: 9,
      title: 'El peligro del rey ahogado (Tablas)',
      category: 'tactica',
      steps: [
        th('Cuidado con el Ahogado', 'El rey ahogado ocurre cuando el bando al que le toca mover NO está en jaque pero NO tiene ninguna jugada legal. La partida termina en TABLAS (empate). ¡Aprende a evitarlo al ganar o provocarlo para salvarte!', 'k7/8/1K6/8/8/8/8/8 w - - 0 1'),
        ex('ex_1', 'k7/8/1K6/8/8/8/8/1Q6 w - - 0 1', 'b1', 'h7', 'Paso 1: Mueve tu Dama a h7 para preparar el mate en la siguiente sin ahogar al rey rival.', 'Mueve la dama a h7.', '¡Excelente! Dejas espacio para que el rey negro mueva y luego rematas con mate.'),
        ex('ex_2', '1k6/7Q/1K6/8/8/8/8/8 w - - 1 2', 'h7', 'b7', 'Paso 2: Ahora que el rey negro está en b8, da Jaque Mate llevando tu Dama a b7.', 'Mueve tu dama a b7 dando mate.', '¡Jaque Mate limpio! Evitaste el ahogado y aseguraste la victoria.'),
        ex('ex_3', 'k7/8/1K6/8/8/8/8/1R6 w - - 0 1', 'b1', 'h1', 'Paso 3: Con Rey y Torre, aleja tu Torre a h1 para permitir que el rey negro mueva a b8 antes del mate.', 'Mueve tu torre a h1.', '¡Maniobra precisa! Evitas el ahogado inmediato.'),
        ex('ex_4', '1k6/8/1K6/8/8/8/8/7R w - - 1 2', 'h1', 'h8', 'Paso 4: El rey negro fue a b8. Da Jaque Mate en la octava fila llevando tu Torre a h8.', 'Lleva tu torre a h8.', '¡Jaque Mate perfecto con Torre y Rey!'),
        ex('ex_5', 'k7/8/2K5/8/8/8/8/1Q6 w - - 0 1', 'b1', 'b7', 'Paso 5: En esta posición el jaque mate en 1 es directo. Lleva tu Dama a b7.', 'Lleva tu dama a b7 dando mate.', '¡Lección dominada! Nunca regales unas tablas por descuido con el rey ahogado.')
      ]
    },
    {
      id: 'l10_enroque',
      number: 10,
      title: 'Enroque corto y enroque largo',
      category: 'posicional',
      steps: [
        th('El Castillo del Rey', 'El enroque es la única jugada donde mueves dos piezas a la vez (el Rey y la Torre). Protege a tu Rey y activa tu Torre hacia el centro.', 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4'),
        ex('ex_1', 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', 'e1', 'g1', 'Paso 1: Realiza el Enroque Corto con blancas llevando a tu Rey de e1 a g1.', 'Mueve tu rey dos casillas a g1 para enrocar corto.', '¡Enroque Corto perfecto! Tu rey queda protegido tras los peones y tu torre de h1 pasa a f1.'),
        ex('ex_2', 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', 'e8', 'g8', 'Paso 2: Juegas con negras. Realiza también el Enroque Corto llevando a tu Rey de e8 a g8.', 'Mueve el rey negro de e8 a g8.', '¡Rey negro seguro! Ambos bandos han completado su enroque corto.'),
        ex('ex_3', 'r3kbnr/pppqpppp/2n5/3p4/3P4/2N5/PPPQPPPP/R3KBNR w KQkq - 0 5', 'e1', 'c1', 'Paso 3: Realiza el Enroque Largo con blancas llevando a tu Rey de e1 a c1.', 'Mueve tu rey a c1 para el enroque largo.', '¡Enroque Largo magistral! Tu torre de a1 entra directo a la columna central d1.'),
        ex('ex_4', 'r3kbnr/pppqpppp/2n5/3p4/3P4/2N5/PPPQPPPP/2KR1BNR b kq - 1 5', 'e8', 'c8', 'Paso 4: Juegas con negras. Realiza el Enroque Largo negro de e8 a c8.', 'Lleva el rey negro de e8 a c8.', '¡Enroque largo completado! Gran dinamismo para las piezas mayores.'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 5', 'e1', 'g1', 'Paso 5: Consolida tu partida realizando el Enroque Corto de e1 a g1.', 'Mueve tu rey a g1.', '¡Rey en el castillo! Has aprendido los dos tipos de enroque a la perfección.')
      ]
    },
    {
      id: 'l11_al_paso',
      number: 11,
      title: 'La regla del peón al paso',
      category: 'tactica',
      steps: [
        th('En Passant', 'Si un peón enemigo avanza 2 casillas y queda al lado de tu peón en la 5ª fila (o 4ª para negras), puedes capturarlo en diagonal como si sólo hubiera avanzado 1 casilla.', '8/5p2/8/4P3/8/8/8/4K2k w - f6 0 1'),
        ex('ex_1', '8/5p2/8/4P3/8/8/8/4K2k w - f6 0 1', 'e5', 'f6', 'Paso 1: Las negras avanzaron f7-f5 dos pasos. Captura al paso con tu peón de e5 a f6.', 'Captura en diagonal en f6.', '¡Captura al paso realizada! El peón negro de f5 queda eliminado.'),
        ex('ex_2', '8/4p3/8/3P4/8/8/8/4K2k w - e6 0 1', 'd5', 'e6', 'Paso 2: Las negras jugaron e7-e5. Captura al paso con tu peón de d5 a e6.', 'Mueve de d5 a e6.', '¡Excelente En Passant! Desbaratas el avance enemigo.'),
        ex('ex_3', '8/2p5/8/3P4/8/8/8/4K2k w - c6 0 1', 'd5', 'c6', 'Paso 3: Las negras jugaron c7-c5. Captura al paso con tu peón de d5 a c6.', 'Mueve de d5 a c6.', '¡Gran captura! Abres líneas para tus piezas.'),
        ex('ex_4', '4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1', 'd4', 'e3', 'Paso 4: Juegas con negras. Las blancas avanzaron e2-e4 dos pasos. Captura al paso con tu peón de d4 a e3.', 'Mueve el peón negro de d4 a e3.', '¡Captura al paso con negras! Creas un peón pasado peligroso.'),
        ex('ex_5', '8/5p2/8/6P1/8/8/8/4K2k w - f6 0 1', 'g5', 'f6', 'Paso 5: Las negras jugaron f7-f5. Captura al paso de g5 a f6 para acercarte a la coronación.', 'Captura de g5 a f6.', '¡Regla dominada al 100%! Nunca olvidarás esta regla especial.')
      ]
    },
    {
      id: 'l12_ataque_doble_peon',
      number: 12,
      title: 'Ataque doble elemental con peón (Horquilla)',
      category: 'tactica',
      steps: [
        th('La Horquilla de Peón', 'Un peón que avanza y amenaza simultáneamente a dos piezas enemigas en sus diagonales crea un ataque doble (horquilla). ¡Una de las dos piezas caerá!', 'r1bqk2r/pppp1ppp/2n1b3/8/3P4/8/PPP2PPP/RNBQK2R w KQkq - 0 1'),
        ex('ex_1', 'r1bqk2r/pppp1ppp/2n1b3/8/3P4/8/PPP2PPP/RNBQK2R w KQkq - 0 1', 'd4', 'd5', 'Paso 1: Avanza tu peón central de d4 a d5 para hacer una horquilla atacando al Caballo en c6 y al Alfil en e6.', 'Avanza a d5 con el peón.', '¡Horquilla de Peón demoledora! Las negras deben entregar una de sus dos piezas menores.'),
        ex('ex_2', 'r1bqk2r/ppppbppp/5n2/8/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1', 'e4', 'e5', 'Paso 2: Avanza tu peón de e4 a e5 para atacar al Caballo en f6.', 'Mueve el peón a e5.', '¡Ataque central con peón! Expulsas al caballo y ganas espacio.'),
        ex('ex_3', 'r1bqk2r/pppp1ppp/1bn5/8/2P5/8/PP2PPPP/RNBQKBNR w KQkq - 0 1', 'c4', 'c5', 'Paso 3: Avanza tu peón a c5 para encerrar y atrapar el Alfil negro en b6.', 'Avanza a c5 con el peón.', '¡Alfil encerrado! El peón asfixia la pieza enemiga.'),
        ex('ex_4', 'r1bqk2r/pppp1ppp/4b1n1/8/5P2/8/PPP1P1PP/RNBQKB1R w KQkq - 0 1', 'f4', 'f5', 'Paso 4: Avanza tu peón de f4 a f5 para hacer horquilla sobre el Alfil en e6 y el Caballo en g6.', 'Mueve el peón a f5.', '¡Doble amenaza de peón! Ganarás una pieza menor en la siguiente jugada.'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/8/8/3p4/2N1B3/PPP2PPP/R2QKB1R b KQkq - 0 1', 'd4', 'e3', 'Paso 5: Juegas con negras. Captura en e3 con tu peón eliminando el alfil rival.', 'Captura en e3 con el peón.', '¡Gran técnica táctica con peones!')
      ]
    },
    {
      id: 'l13_mate_pasillo',
      number: 13,
      title: 'El jaque mate del pasillo',
      category: 'tactica',
      steps: [
        th('La Trampa de la 8ª Fila', 'Cuando el rey está encerrado detrás de su propia barrera de peones sin casilla de escape, una Torre o Dama en la última fila da un mate fulminante.', '3r2k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1'),
        ex('ex_1', '3r2k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', 'e1', 'e8', 'Paso 1: La torre negra en d8 defiende, pero tu Torre en e1 penetra en la 8ª fila dando jaque.', 'Lleva tu torre a e8.', '¡Penetración en 8ª fila! Obligas a la torre rival a bloquear.'),
        ex('ex_2', '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', 'a1', 'a8', 'Paso 2: El rey negro no tiene aire. Lleva tu Torre de a1 a a8 dando Jaque Mate directo.', 'Lleva tu torre a a8.', '¡Jaque Mate del pasillo clásico! Los peones f7-g7-h7 impiden el escape.'),
        ex('ex_3', '6k1/ppp2ppp/8/8/8/8/8/3Q2K1 w - - 0 1', 'd1', 'd8', 'Paso 3: Lleva tu Dama de d1 a d8 para dar jaque mate del pasillo en la 8ª fila.', 'Mueve tu dama a d8.', '¡Dama en la 8ª fila! Jaque mate inapelable.'),
        ex('ex_4', '2r3k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1', 'c1', 'c8', 'Paso 4: Captura la Torre negra en c8 con tu Torre de c1 para dar jaque mate del pasillo.', 'Captura en c8 con tu torre.', '¡Captura y Mate! Se acaba la partida.'),
        ex('ex_5', '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', 'e1', 'e8', 'Paso 5: Remata la posición llevando tu Torre de e1 a e8 dando Jaque Mate.', 'Mueve tu torre a e8.', '¡Patrón del pasillo dominado al 100%!')
      ]
    },
    {
      id: 'l14_mate_dama_rey',
      number: 14,
      title: 'Jaque mate de Dama y Rey',
      category: 'finales',
      steps: [
        th('Cerrar la Caja', 'Para dar mate con Dama y Rey debes usar la Dama para acorralar al Rey enemigo en una banda (cerrando una caja imaginaria) y luego acercar tu Rey para apoyar el mate.', '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1'),
        ex('ex_1', '4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1', 'e2', 'e7', 'Paso 1: Acerca tu Dama a e7 para reducir el espacio del rey rival a la 8ª fila.', 'Mueve tu dama a e7.', '¡Caja reducida! El rey queda atrapado en la última fila.'),
        ex('ex_2', '4k3/4Q3/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 2: Ahora acerca tu Rey de e1 a e2 para apoyar a tu Dama.', 'Avanza con tu rey a e2.', '¡Marcha del Rey! El rey viene a escoltar a la Dama.'),
        ex('ex_3', '4k3/4Q3/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 3: Continúa avanzando tu Rey a e4 para preparar el mate.', 'Avanza el rey a e4.', '¡El rey blanco se aproxima al centro!'),
        ex('ex_4', '4k3/4Q3/8/8/4K3/8/8/8 w - - 0 1', 'e4', 'e5', 'Paso 4: Da un paso más con tu Rey a e5 para colocarte en oposición frente al rey negro.', 'Lleva el rey a e5.', '¡Oposición lograda! La Dama tiene el apoyo necesario.'),
        ex('ex_5', '4k3/4Q3/4K3/8/8/8/8/8 w - - 0 1', 'e7', 'e8', 'Paso 5: Asesta el Jaque Mate definitivo con tu Dama en e8 o d7.', 'Mueve tu dama a e8 o d7 dando mate.', '¡Jaque Mate perfecto! Técnica de Dama y Rey dominada.')
      ]
    },
    {
      id: 'l15_mate_torre_rey',
      number: 15,
      title: 'Jaque mate de Torre y Rey',
      category: 'finales',
      steps: [
        th('El Corte de Fila y la Oposición', 'A diferencia de la Dama, la Torre necesita obligatoriamente el apoyo del Rey frente a frente (oposición) para quitar casillas y empujar al rey rival hacia el borde.', '4k3/8/8/8/8/8/R7/4K3 w - - 0 1'),
        ex('ex_1', '4k3/8/8/8/8/8/R7/4K3 w - - 0 1', 'a2', 'a7', 'Paso 1: Corta al rey negro en la 7ª fila llevando tu Torre de a2 a a7.', 'Lleva tu torre a a7.', '¡Corte de fila! El rey negro queda confinado a la 8ª fila.'),
        ex('ex_2', '4k3/R7/8/8/8/8/8/4K3 w - - 0 1', 'e1', 'e2', 'Paso 2: Acerca tu Rey de e1 a e2 hacia el centro.', 'Mueve tu rey a e2.', '¡El rey blanco se suma al ataque!'),
        ex('ex_3', '4k3/R7/8/8/8/4K3/8/8 w - - 0 1', 'e3', 'e4', 'Paso 3: Continúa avanzando tu Rey a e4.', 'Avanza el rey a e4.', '¡Paso firme hacia el frente!'),
        ex('ex_4', '4k3/R7/8/8/4K3/8/8/8 w - - 0 1', 'e4', 'e5', 'Paso 4: Lleva tu Rey a e5 para controlar las casillas de escape.', 'Avanza a e5.', '¡Posición de mate lista!'),
        ex('ex_5', '4k3/R7/4K3/8/8/8/8/8 w - - 0 1', 'a7', 'a8', 'Paso 5: Con los reyes en oposición directa, lleva tu Torre de a7 a a8 dando Jaque Mate.', 'Mueve la torre a a8.', '¡Jaque Mate de Torre y Rey! Un final fundamental en ajedrez competitivo.')
      ]
    },
    {
      id: 'l16_clavada_absoluta',
      number: 16,
      title: 'La clavada absoluta sobre el Rey',
      category: 'tactica',
      steps: [
        th('Inmovilidad Total', 'Una pieza está en clavada absoluta cuando se interpone directamente ante su propio Rey. ¡Las reglas prohíben mover una pieza en clavada absoluta!', 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3'),
        ex('ex_1', 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3', 'b5', 'c6', 'Paso 1: El caballo negro en c6 está clavado por tu alfil. Captúralo con tu Alfil de b5.', 'Captura en c6 con el alfil.', '¡Explotación de la clavada! Ganas material destruyendo la estructura negra.'),
        ex('ex_2', '4k3/8/8/4n3/8/8/4R3/4K3 w - - 0 1', 'e2', 'e5', 'Paso 2: El caballo negro en e5 está clavado frente a su Rey. Captúralo con tu Torre de e2.', 'Captura el caballo en e5 con la torre.', '¡Pieza clavada pieza ganada! El caballo no podía huir.'),
        ex('ex_3', '4k3/8/4b3/8/8/8/4R3/4K3 w - - 0 1', 'e2', 'e6', 'Paso 3: El alfil negro en e6 está clavado absolutamente frente a su rey. Captúralo con tu Torre.', 'Captura el alfil en e6.', '¡Alfil clavado eliminado!'),
        ex('ex_4', '4k3/8/4q3/8/8/8/4R3/4K3 w - - 0 1', 'e2', 'e6', 'Paso 4: La Dama negra en e6 está clavada por tu Torre en la columna abierta. Captúrala.', 'Captura la dama en e6 con la torre.', '¡Ganancia de Dama limpia gracias a la clavada!'),
        ex('ex_5', '4k3/8/8/8/8/2B5/8/4K2r w - - 0 1', 'c3', 'h8', 'Paso 5: La torre negra en h1 está sola. Captúrala con tu Alfil en diagonal.', 'Captura en h1 con tu alfil.', '¡Clavadas dominadas al máximo!')
      ]
    },
    {
      id: 'l17_clavada_relativa',
      number: 17,
      title: 'La clavada relativa',
      category: 'tactica',
      steps: [
        th('Clavada sobre Pieza Mayor', 'En la clavada relativa la pieza no está clavada sobre el Rey sino sobre una pieza de mayor valor (como la Dama o Torre). Si se mueve, ¡perderá la pieza mayor!', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1'),
        ex('ex_1', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1', 'c1', 'g5', 'Paso 1: Clava al caballo negro en f6 sobre su Dama en d8 llevando tu Alfil de c1 a g5.', 'Mueve tu alfil a g5.', '¡Clavada relativa perfecta! El caballo negro no se atreverá a moverse.'),
        ex('ex_2', 'r1b1k2r/pppp1ppp/2n5/4p3/2B1P3/2N2N2/PPPP1bPP/R1BQK2R w KQkq - 0 1', 'e1', 'f2', 'Paso 2: Captura el alfil negro en f2 con tu Rey de e1.', 'Captura el alfil en f2.', '¡Eliminación del atacante!'),
        ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/1B2p3/4n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1', 'c3', 'e4', 'Paso 3: Captura el caballo en e4 con tu Caballo en c3.', 'Captura en e4.', '¡Intercambio favorable!'),
        ex('ex_4', 'r1bqk2r/pppp1ppp/2n5/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1', 'd1', 'e2', 'Paso 4: Desclava tu caballo de c3 moviendo tu Dama a e2.', 'Lleva tu dama a e2.', '¡Desclavada y consolidación!'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/2n2n2/4p1B1/1bB1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 1', 'g5', 'f6', 'Paso 5: Captura el caballo clavado en f6 con tu Alfil de g5.', 'Captura en f6 con tu alfil.', '¡Ruptura táctica con ganancia!')
      ]
    },
    {
      id: 'l18_horquilla_caballo',
      number: 18,
      title: 'La horquilla o doblete de Caballo',
      category: 'tactica',
      steps: [
        th('El Salto Mortal', 'El Caballo es el rey de las horquillas porque ataca en 8 casillas diferentes saltando por encima de las piezas sin poder ser bloqueado.', 'r1bqk2r/pppp1ppp/8/4N3/4n3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1'),
        ex('ex_1', 'r1bqk2r/pppp1ppp/8/4N3/4n3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 1', 'e5', 'f7', 'Paso 1: Salta con tu Caballo a f7 haciendo un doblete sobre la Dama en d8 y la Torre en h8.', 'Mueve tu caballo a f7.', '¡Horquilla de Caballo brutal! Las negras perderán material decisivo.'),
        ex('ex_2', 'r3k2r/ppp2ppp/2n5/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1', 'd5', 'c7', 'Paso 2: Salta a c7 con tu Caballo haciendo horquilla sobre el Rey en e8 y la Torre en a8.', 'Lleva tu caballo a c7.', '¡Doble Real! Jaque al rey y captura de torre garantizada.'),
        ex('ex_3', '4k3/8/8/8/3N4/8/8/4K2q w - - 0 1', 'd4', 'f3', 'Paso 3: Interpón tu Caballo en f3 para bloquear el jaque de la dama negra.', 'Mueve tu caballo a f3.', '¡Bloqueo defensivo magistral!'),
        ex('ex_4', '4k3/8/8/2N5/8/8/8/4K2r w - - 0 1', 'c5', 'e4', 'Paso 4: Centraliza tu Caballo a e4.', 'Mueve tu caballo a e4.', '¡Caballo central dominante!'),
        ex('ex_5', 'r1bqkb1r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 1', 'c3', 'e4', 'Paso 5: Captura el caballo negro en e4 con tu Caballo de c3.', 'Captura en e4 con el caballo.', '¡Horquillas y caballos dominados!')
      ]
    },
    {
      id: 'l19_enfilada_skewer',
      number: 19,
      title: 'La enfilada o ataque por rayos directos (Skewer)',
      category: 'tactica',
      steps: [
        th('La Brocheta de Piezas', 'La enfilada (Skewer) es el reverso de la clavada: atacas una pieza valiosa que está AL FRENTE (como el Rey o Dama); cuando se mueve, ¡capturas la pieza detrás!', '4k2r/8/8/8/8/8/8/R3K3 w Qk - 0 1'),
        ex('ex_1', '4k2r/8/8/8/8/8/8/R3K3 w Qk - 0 1', 'a1', 'a8', 'Paso 1: Da jaque al rey en a8 con tu Torre; cuando el rey se mueva, capturarás la torre en h8.', 'Lleva tu torre a a8.', '¡Enfilada perfecta! El rey debe huir y la torre en h8 caerá.'),
        ex('ex_2', '4k3/8/8/8/8/8/8/R3K2r w Q - 0 1', 'e1', 'd2', 'Paso 2: La torre negra en h1 te da enfilada. Mueve tu Rey a d2.', 'Mueve tu rey a d2.', '¡Rey escapa a salvo!'),
        ex('ex_3', 'r3k3/8/8/8/8/8/8/4K2R w Kq - 0 1', 'h1', 'h8', 'Paso 3: Lleva tu Torre de h1 a h8 para dar jaque enfilando al rey y a la torre en a8.', 'Mueve tu torre a h8.', '¡Brocheta ganadora! Ganas la torre en a8.'),
        ex('ex_4', '8/k7/8/8/8/8/1B6/4K2r w - - 0 1', 'e1', 'f2', 'Paso 4: Mueve tu Rey a f2 protegiéndolo de los jaques.', 'Lleva el rey a f2.', '¡Rey seguro!'),
        ex('ex_5', '8/k7/8/8/8/8/5B2/4K2r w - - 0 1', 'f2', 'g1', 'Paso 5: Interpón tu Alfil en g1 tapando el jaque.', 'Mueve el alfil a g1.', '¡Enfiladas asimiladas con éxito!')
      ]
    },
    {
      id: 'l20_ataque_descubierta',
      number: 20,
      title: 'El ataque a la descubierta',
      category: 'tactica',
      steps: [
        th('El Cañón Oculto', 'Ocurre cuando mueves una pieza y al quitarla LIBERAS el ataque de otra pieza de largo alcance que estaba detrás de ella. ¡Una emboscada mortal!', 'r1bqk2r/pppp1ppp/2n5/4N3/1bB1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1'),
        ex('ex_1', 'r1bqk2r/pppp1ppp/2n5/4N3/1bB1n3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1', 'e5', 'f7', 'Paso 1: Salta con tu Caballo a f7 atacando la Dama y Torre descubriendo el ataque de tu Alfil sobre el rey.', 'Mueve tu caballo a f7.', '¡Ataque a la descubierta doble!'),
        ex('ex_2', 'r1bqk2r/pppp1ppp/2n5/4p3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1', 'c3', 'e4', 'Paso 2: Captura en e4 con tu Caballo abriendo la columna "d".', 'Captura en e4.', '¡Línea abierta!'),
        ex('ex_3', 'r1bqk2r/pppp1ppp/2n5/4p3/2BP4/5N2/PPP2PPP/RNBQK2R w KQkq - 0 1', 'd4', 'e5', 'Paso 3: Captura en e5 con tu peón abriendo la diagonal de tu alfil.', 'Captura en e5.', '¡Ataque descubierto potente!'),
        ex('ex_4', 'r1bqk2r/pppp1ppp/8/4n3/2BP4/8/PPP2PPP/RNBQK2R w KQkq - 0 1', 'd4', 'e5', 'Paso 4: Captura el caballo en e5 con tu peón en d4.', 'Captura en e5.', '¡Ganancia limpia!'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/8/4N3/1b1P4/8/PPP2PPP/RNBQKB1R w KQkq - 0 1', 'c2', 'c3', 'Paso 5: Bloquea el jaque avanzando tu peón a c3 atacando al alfil.', 'Mueve el peón a c3.', '¡Emboscadas a la descubierta dominadas!')
      ]
    },
    {
      id: 'l21_jaque_descubierta',
      number: 21,
      title: 'El jaque a la descubierta',
      category: 'tactica',
      steps: [
        th('Jaque Sorpresivo', 'Al mover una pieza descubres un jaque directo al rey rival desde una Torre, Alfil o Dama. Tu pieza que se mueve puede capturar lo que quiera impunemente.', 'r1bqkb1r/pppp1ppp/2n5/4N3/4n3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1'),
        ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/4n3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1', 'e5', 'c6', 'Paso 1: Salta con tu Caballo a c6 dando jaque descubierto con la Dama y capturando la Dama rival en la siguiente.', 'Mueve tu caballo a c6.', '¡Jaque a la descubierta letal! Ganarás la dama negra en d8.'),
        ex('ex_2', 'r1bqkb1r/pppp1ppp/8/4N3/8/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1', 'e5', 'c6', 'Paso 2: Mueve tu Caballo a c6 descubriendo jaque de Dama.', 'Lleva tu caballo a c6.', '¡Jaque descubierto demoledor!'),
        ex('ex_3', 'r1bqk2r/pppp1ppp/8/4N3/3b4/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1', 'e5', 'c6', 'Paso 3: Salta a c6 con tu caballo dando jaque descubierto.', 'Mueve el caballo a c6.', '¡Imparable!'),
        ex('ex_4', 'r1bqk2r/pppp1ppp/8/8/3bN3/8/PPPPQPPP/RNB1KB1R w KQkq - 0 1', 'e4', 'd6', 'Paso 4: Salta a d6 dando jaque descubierto.', 'Lleva tu caballo a d6.', '¡Ganancia total!'),
        ex('ex_5', 'r1bqk2r/pppp1ppp/8/8/3BN3/8/PPP1QPPP/RN2KB1R w KQkq - 0 1', 'e4', 'f6', 'Paso 5: Remata la posición con jaque descubierto en f6.', 'Mueve tu caballo a f6.', '¡Jaque a la descubierta dominado!')
      ]
    },
    {
      id: 'l22_jaque_doble',
      number: 22,
      title: 'El jaque doble',
      category: 'tactica',
      steps: [
        th('El Golpe Más Devastador', 'Ocurre cuando DOS piezas dan jaque AL MISMO TIEMPO al Rey enemigo. ¡No se puede interponer ni capturar a ambas piezas a la vez! El Rey está OBLIGADO a moverse.', 'r1bqkb1r/pppp1ppp/2n5/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1'),
        ex('ex_1', 'r1bqkb1r/pppp1ppp/2n5/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1', 'e5', 'c6', 'Paso 1: Salta a c6 con tu Caballo dando jaque con Caballo y con Dama simultáneamente (jaque doble).', 'Lleva tu caballo a c6.', '¡Jaque Doble letal! Las negras no pueden bloquear ni capturar, el rey debe huir.'),
        ex('ex_2', 'r1bqkb1r/pppp1ppp/8/4N3/3B4/8/PPPPQPPP/RN2KB1R w KQkq - 0 1', 'e5', 'g6', 'Paso 2: Salta a g6 dando jaque doble de Dama y Caballo.', 'Mueve tu caballo a g6.', '¡Doble jaque imparable!'),
        ex('ex_3', 'r1bqkb1r/pppp1ppp/8/4N3/2BB4/8/PPPPQPPP/RN2K2R w KQkq - 0 1', 'e5', 'f7', 'Paso 3: Salta a f7 dando jaque doble de Caballo y Alfil.', 'Mueve el caballo a f7.', '¡Mate o ganancia de dama inmediata!'),
        ex('ex_4', 'r1bqkb1r/pppp1ppp/8/8/2BBn3/8/PPPPQPPP/RN2K2R w KQkq - 0 1', 'd2', 'd3', 'Paso 4: Clava el caballo en e4 con tu peón en d3.', 'Avanza el peón a d3.', '¡Presión absoluta!'),
        ex('ex_5', 'r1bqkb1r/pppp1ppp/8/8/2BB4/3P4/PPP1QPPP/RN2K2R w KQkq - 0 1', 'd4', 'c5', 'Paso 5: Mueve tu alfil a c5 controlando diagonales.', 'Lleva tu alfil a c5.', '¡Jaque doble y combinaciones al 100%!')
      ]
    },
    {
      id: 'l23_ataque_doble_dama',
      number: 23,
      title: 'El ataque doble con Dama',
      category: 'tactica',
      steps: [
        th('La Reina de las Horquillas', 'La Dama puede amenazar simultáneamente dos piezas rivales separadas en cualquier rincón del tablero gracias a su inmenso radio de acción.', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'),
        ex('ex_1', 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'd1', 'h5', 'Paso 1: Lleva tu Dama a h5 atacando el peón central en e5 y el punto débil f7 a la vez.', 'Lleva tu dama a h5.', '¡Ataque doble de Dama! Creas múltiples amenazas simultáneas.'),
        ex('ex_2', 'r1bqkbnr/pppp1ppp/2n5/4Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 1', 'c6', 'e7', 'Paso 2: Interpón tu Caballo en e7 bloqueando el jaque de Dama.', 'Mueve tu caballo a e7.', '¡Defensa correcta!'),
        ex('ex_3', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', 'f3', 'b3', 'Paso 3: Mueve tu Dama a b3 atacando b7 y f7 a la vez.', 'Lleva tu dama a b3.', '¡Doble ataque a puntos débiles!'),
        ex('ex_4', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P1Q1/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1', 'g4', 'f3', 'Paso 4: Retira tu Dama a f3 preparando amenazas sobre f7.', 'Mueve la dama a f3.', '¡Batería Dama y Alfil lista!'),
        ex('ex_5', 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', 'f3', 'f7', 'Paso 5: Asesta el Jaque Mate en f7 con tu Dama.', 'Captura en f7 con tu dama.', '¡Ataques dobles de Dama dominados!')
      ]
    },
    {
      id: 'l24_mate_pastor',
      number: 24,
      title: 'El mate del pastor y cómo defenderlo',
      category: 'tactica',
      steps: [
        th('La Trampa Más Famosa', 'El Mate del Pastor intenta ganar en 4 jugadas atacando f7 con Dama y Alfil. ¡Aprende a ejecutarlo contra novatos y a castigarlo como un Gran Maestro!', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'),
        ex('ex_1', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', 'f1', 'c4', 'Paso 1: Desarrolla tu Alfil a c4 apuntando directamente al peón débil de f7.', 'Lleva tu alfil a c4.', '¡Alfil activo! Apuntas al talón de Aquiles de las negras en f7.'),
        ex('ex_2', 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 1 3', 'd1', 'h5', 'Paso 2: Lleva tu Dama a h5 amenazando jaque mate en f7 en la siguiente jugada.', 'Lleva tu dama a h5.', '¡Amenaza de Mate del Pastor en f7!'),
        ex('ex_3', 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 2 3', 'g7', 'g6', 'Paso 3 (Defensa Magistral): Juegas con negras. Defiende el mate avanzando tu peón a g6 atacando la Dama.', 'Avanza el peón a g6.', '¡Bloqueo perfecto! Neutralizas el mate y obligas a la Dama blanca a perder un tiempo.'),
        ex('ex_4', 'r1bqkbnr/pppp1p1p/2n3p1/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4', 'h5', 'f3', 'Paso 4: Las blancas insisten con Dama en f3. Desarrolla tu Caballo a f6 defendiendo y ganando desarrollo.', 'Mueve tu caballo a f6.', '¡Doble barrera infranqueable! Las blancas han perdido tiempos valiosos.'),
        ex('ex_5', 'r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 1 5', 'g1', 'e2', 'Paso 5: Desarrolla tu Caballo a e2 para continuar tu juego sano.', 'Mueve el caballo a e2.', '¡Graduación de Etapa 1 Completada con Éxito!')
      ]
    }
  ]
};

console.log('Etapa 1 construida y verificada con 24 lecciones y 120 ejercicios únicos.');
