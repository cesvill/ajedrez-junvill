/**
 * Utilidad para cálculo y ordenamiento de piezas capturadas / perdidas
 * Orden de valor: Dama (q: 9), Torre (r: 5), Alfil (b: 3), Caballo (n: 3), Peón (p: 1)
 */

const PIECE_ORDER = ['q', 'r', 'b', 'n', 'p'];
const PIECE_VALUES = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 };

const STARTING_PIECES = {
  w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
  b: { p: 8, n: 2, b: 2, r: 2, q: 1 }
};

/**
 * Calcula las piezas capturadas a partir del FEN actual
 * @param {string} fen 
 * @returns {{ whiteCaptured: Array<{type: string, count: number}>, blackCaptured: Array<{type: string, count: number}>, whiteAdvantage: number, blackAdvantage: number }}
 */
export const getCapturedPieces = (fen) => {
  if (!fen) {
    return {
      whiteCaptured: [],
      blackCaptured: [],
      whiteAdvantage: 0,
      blackAdvantage: 0
    };
  }

  const currentPieces = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };

  const boardPart = fen.split(' ')[0] || '';
  for (const char of boardPart) {
    if (char >= '1' && char <= '8') continue;
    if (char === '/') continue;

    const isWhite = char === char.toUpperCase();
    const type = char.toLowerCase();
    if (type !== 'k' && currentPieces[isWhite ? 'w' : 'b'][type] !== undefined) {
      currentPieces[isWhite ? 'w' : 'b'][type]++;
    }
  }

  // Las piezas blancas perdidas (capturadas por las Negras)
  const whiteLost = [];
  let whiteMaterialLost = 0;

  // Las piezas negras perdidas (capturadas por las Blancas)
  const blackLost = [];
  let blackMaterialLost = 0;

  for (const type of PIECE_ORDER) {
    const missingWhite = Math.max(0, STARTING_PIECES.w[type] - currentPieces.w[type]);
    if (missingWhite > 0) {
      whiteLost.push({ type, count: missingWhite });
      whiteMaterialLost += missingWhite * PIECE_VALUES[type];
    }

    const missingBlack = Math.max(0, STARTING_PIECES.b[type] - currentPieces.b[type]);
    if (missingBlack > 0) {
      blackLost.push({ type, count: missingBlack });
      blackMaterialLost += missingBlack * PIECE_VALUES[type];
    }
  }

  // Ventaja de material:
  // Si las negras perdieron más que las blancas -> ventaja para las Blancas
  const materialDiff = blackMaterialLost - whiteMaterialLost;

  return {
    // Piezas capturadas por las Blancas (piezas negras perdidas)
    capturedByWhite: blackLost,
    // Piezas capturadas por las Negras (piezas blancas perdidas)
    capturedByBlack: whiteLost,
    // Ventaja material de Blancas (ej: +3)
    whiteAdvantage: materialDiff > 0 ? materialDiff : 0,
    // Ventaja material de Negras (ej: +2)
    blackAdvantage: materialDiff < 0 ? Math.abs(materialDiff) : 0
  };
};

// Símbolos Unicode estilizados de piezas para renderizado ultraligero
export const PIECE_SYMBOLS = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};
