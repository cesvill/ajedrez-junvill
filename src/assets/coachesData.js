import React from 'react';

/**
 * Catálogo de Tutores y Entrenadores de Ajedrez Junvill
 * Incluye tutores seniors, jóvenes, hombres, mujeres, androide e infantil de fantasía
 */

export const COACHES_LIST = [
  {
    id: 'coach_aurelio',
    name: 'Don Aurelio',
    title: 'Maestro Veterano',
    ageGroup: 'senior',
    gender: 'male',
    role: 'Tutor de Fundamentos y Posición',
    color: '#b45309',
    tagline: 'Paciencia, desarrollo armonioso y juego clásico.',
    bio: 'Más de 40 años formando campeones nacionales. Explica con paciencia y enseña a no apresurarse.',
    greeting: 'Saludos, joven estratega. El ajedrez premia la paciencia y el buen juicio posicional.',
    praisePhrase: '¡Excelente visión! Esa jugada consolida nuestra posición como en las partidas de Capablanca.',
    warningPhrase: 'Cuidado, alumno. Analiza dos veces: esa casilla podría comprometer la seguridad del Rey.',
    hintPhrase: 'Busca la pieza que menos participa y llévala al centro del tablero.'
  },
  {
    id: 'coach_beatriz',
    name: 'Doña Beatriz',
    title: 'Gran Maestra Senior',
    ageGroup: 'senior',
    gender: 'female',
    role: 'Tutora de Cálculo y Finales',
    color: '#047857',
    tagline: 'Rigor táctico y precisión milimétrica.',
    bio: 'Excampeona olímpica y autora de libros de finales. Enseña a calcular con exactitud y no perdonar debilidades.',
    greeting: 'Bienvenido al entrenamiento. En el tablero cada tiempo cuenta; calculemos con total claridad.',
    praisePhrase: '¡Brillante cálculo! Has detectado el punto vulnerable de la estructura enemiga.',
    warningPhrase: '¡Atención! Esa jugada regala un tiempo valioso. Revisa las respuestas forzadas de tu rival.',
    hintPhrase: 'Mira la debilidad en la séptima fila o los peones retrasados.'
  },
  {
    id: 'coach_mateo',
    name: 'Mateo el Táctico',
    title: 'Joven Maestro FIDE',
    ageGroup: 'young',
    gender: 'male',
    role: 'Tutor de Ataque y Combinaciones',
    color: '#2563eb',
    tagline: 'Dinamismo, golpes tácticos y velocidad.',
    bio: 'Campeón juvenil continental. Le apasiona el juego agresivo, los sacrificios de pieza y las líneas abiertas.',
    greeting: '¡Qué tal! Listo para buscar jugadas activas y armar ataques demoledores.',
    praisePhrase: '¡Ufff, qué jugadón! Directo a la yugular del rival con iniciativa pura.',
    warningPhrase: '¡Ojo ahí! Si mueves esa pieza, dejas en el aire la casilla de escape.',
    hintPhrase: 'Fíjate en los jaques, capturas y amenazas directas. ¡El golpe táctico está cerca!'
  },
  {
    id: 'coach_valeria',
    name: 'Valeria la Estratega',
    title: 'Maestra y Divulgadora',
    ageGroup: 'young',
    gender: 'female',
    role: 'Tutora de Planes y Aperturas Modernas',
    color: '#db2777',
    tagline: 'Visualización clara, planes modernos y diversión.',
    bio: 'Streamer y divulgadora de ajedrez universitario. Explica conceptos complejos con analogías visuales sencillas.',
    greeting: '¡Hola! Vamos a encontrar los mejores planes y disfrutar cada partida al máximo.',
    praisePhrase: '¡Exacto! Esa jugada cumple a la perfección el plan de apertura que estudiamos.',
    warningPhrase: 'Ten cuidado con esa casilla: tu rival podría coordinar un tenedor o una clavada.',
    hintPhrase: 'Visualiza a dónde quiere ir tu pieza en 2 jugadas y asegura la casilla clave.'
  },
  {
    id: 'coach_junvill_king',
    name: 'Rey Sabio de Junvill',
    title: 'Guardián del Reino',
    ageGroup: 'fantasy',
    gender: 'fantasy',
    role: 'Tutor de Cuentos e Iniciación Infantil',
    color: '#d97706',
    tagline: 'Historias mágicas, amistad y honor de caballeros.',
    bio: 'El soberano del Reino de las 64 Casillas. Acompaña a niños y niñas en sus primeros pasos con cuentos mágicos.',
    greeting: '¡Bienvenido a nuestro reino! Mis caballeros y torres están listos para tu mando.',
    praisePhrase: '¡Magnífico movimiento, noble estratega! Todo el reino celebra tu valentía.',
    warningPhrase: '¡Cuidado, mi querido aprendiz! Un peón enemigo acecha en esa diagonal.',
    hintPhrase: 'Pide ayuda a tus nobles torres o al veloz corcel para abrir camino.'
  },
  {
    id: 'coach_ada',
    name: 'Ada-9000',
    title: 'Inteligencia Pedagógica',
    ageGroup: 'cyber',
    gender: 'cyber',
    role: 'Tutora Algorítmica y Precisión',
    color: '#8b5cf6',
    tagline: 'Evaluación cuántica de variantes y objetividad.',
    bio: 'Motor pedagógico neural diseñado para optimizar el rendimiento y detectar patrones de error con precisión.',
    greeting: 'Sistemas neuronales conectados. Modo tutoría analítica activado.',
    praisePhrase: 'Jugada óptima identificada. Evaluación de posición incrementada favorablemente.',
    warningPhrase: 'Alerta: la jugada seleccionada reduce la ventaja posicional en 1.8 peones.',
    hintPhrase: 'Filtrando vectores de ataque: prioriza el control de la columna semiabierta.'
  }
];

export const getCoachById = (id) => {
  return COACHES_LIST.find(c => c.id === id) || COACHES_LIST[0];
};
