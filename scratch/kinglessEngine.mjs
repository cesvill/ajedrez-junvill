/**
 * Motor Ligero y AI para Minijuegos Pedagógicos Sin Rey (Kingless Chess Engine)
 * Compatible con la API de chess.js para tableros interactivos y bots.
 */

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export class KinglessChess {
  constructor(fen = '8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1') {
    this._turn = 'w';
    this._board = Array(8).fill(null).map(() => Array(8).fill(null));
    this._history = [];
    this._moveCount = 0;
    this.load(fen);
  }

  load(fen) {
    const parts = fen.trim().split(' ');
    const boardPart = parts[0];
    this._turn = parts[1] || 'w';

    this._board = Array(8).fill(null).map(() => Array(8).fill(null));
    const rows = boardPart.split('/');

    for (let r = 0; r < 8; r++) {
      const rowStr = rows[r] || '8';
      let c = 0;
      for (let i = 0; i < rowStr.length; i++) {
        const char = rowStr[i];
        if (char >= '1' && char <= '8') {
          c += parseInt(char, 10);
        } else {
          const color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase();
          if (c < 8) {
            this._board[r][c] = { type, color };
            c++;
          }
        }
      }
    }
  }

  turn() {
    return this._turn;
  }

  get(square) {
    const { r, c } = this._squareToCoords(square);
    if (r < 0 || r > 7 || c < 0 || c > 7) return null;
    return this._board[r][c];
  }

  board() {
    return this._board.map(row => [...row]);
  }

  fen() {
    const rowStrings = [];
    for (let r = 0; r < 8; r++) {
      let emptyCount = 0;
      let rowStr = '';
      for (let c = 0; c < 8; c++) {
        const piece = this._board[r][c];
        if (!piece) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rowStr += emptyCount;
            emptyCount = 0;
          }
          const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
          rowStr += char;
        }
      }
      if (emptyCount > 0) {
        rowStr += emptyCount;
      }
      rowStrings.push(rowStr);
    }
    return `${rowStrings.join('/')} ${this._turn} - - 0 ${Math.floor(this._moveCount / 2) + 1}`;
  }

  moves(options = {}) {
    const legalMoves = [];
    const targetSquare = options.square;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this._board[r][c];
        if (!piece || piece.color !== this._turn) continue;

        const sq = this._coordsToSquare(r, c);
        if (targetSquare && targetSquare !== sq) continue;

        const pieceMoves = this._generatePieceMoves(r, c, piece);
        legalMoves.push(...pieceMoves);
      }
    }

    if (options.verbose) {
      return legalMoves;
    }
    return legalMoves.map(m => m.san);
  }

  move(moveInput) {
    let from, to, promotion;
    if (typeof moveInput === 'string') {
      from = moveInput.slice(0, 2);
      to = moveInput.slice(2, 4);
      promotion = moveInput.slice(4, 5) || 'q';
    } else {
      from = moveInput.from;
      to = moveInput.to;
      promotion = moveInput.promotion || 'q';
    }

    const availableMoves = this.moves({ square: from, verbose: true });
    const match = availableMoves.find(m => m.to === to);
    if (!match) {
      return null;
    }

    const fromCoords = this._squareToCoords(from);
    const toCoords = this._squareToCoords(to);
    const movingPiece = this._board[fromCoords.r][fromCoords.c];
    const targetPiece = this._board[toCoords.r][toCoords.c];

    this._board[fromCoords.r][fromCoords.c] = null;

    let finalPiece = movingPiece;
    let isPromo = false;
    if (movingPiece.type === 'p') {
      if ((movingPiece.color === 'w' && toCoords.r === 0) || (movingPiece.color === 'b' && toCoords.r === 7)) {
        finalPiece = { type: promotion.toLowerCase(), color: movingPiece.color };
        isPromo = true;
      }
    }

    this._board[toCoords.r][toCoords.c] = finalPiece;
    this._turn = this._turn === 'w' ? 'b' : 'w';
    this._moveCount++;

    const resultMove = {
      from,
      to,
      color: movingPiece.color,
      piece: movingPiece.type,
      captured: targetPiece ? targetPiece.type : null,
      promotion: isPromo ? promotion : null,
      san: match.san,
      flags: targetPiece ? 'c' : 'n'
    };

    this._history.push(resultMove);
    return resultMove;
  }

  isGameOver() {
    // 1. Victoria inmediata por coronación a la 8ª fila (blancas) o 1ª (negras)
    for (let c = 0; c < 8; c++) {
      const pTop = this._board[0][c];
      if (pTop && pTop.color === 'w') return true;
      const pBot = this._board[7][c];
      if (pBot && pBot.color === 'b') return true;
    }

    // 2. Si un bando no tiene piezas restantes
    let whitePieces = 0;
    let blackPieces = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this._board[r][c];
        if (p) {
          if (p.color === 'w') whitePieces++;
          else blackPieces++;
        }
      }
    }
    if (whitePieces === 0 || blackPieces === 0) return true;

    // 3. Si el jugador en turno no tiene movimientos legales
    return this.moves().length === 0;
  }

  isCheckmate() {
    return false;
  }

  isCheck() {
    return false;
  }

  isDraw() {
    return false;
  }

  _generatePieceMoves(r, c, piece) {
    const moves = [];
    const sq = this._coordsToSquare(r, c);

    if (piece.type === 'p') {
      const dir = piece.color === 'w' ? -1 : 1;
      const startRow = piece.color === 'w' ? 6 : 1;

      // Avance 1 casilla
      const nextR = r + dir;
      if (nextR >= 0 && nextR < 8 && !this._board[nextR][c]) {
        const toSq = this._coordsToSquare(nextR, c);
        const isPromo = (piece.color === 'w' && nextR === 0) || (piece.color === 'b' && nextR === 7);
        moves.push({
          from: sq,
          to: toSq,
          piece: 'p',
          color: piece.color,
          captured: null,
          promotion: isPromo ? 'q' : null,
          san: isPromo ? `${toSq}=Q` : toSq
        });

        // Avance 2 casillas desde fila inicial
        const doubleR = r + (dir * 2);
        if (r === startRow && !this._board[doubleR][c]) {
          const doubleToSq = this._coordsToSquare(doubleR, c);
          moves.push({
            from: sq,
            to: doubleToSq,
            piece: 'p',
            color: piece.color,
            captured: null,
            promotion: null,
            san: doubleToSq
          });
        }
      }

      // Capturas en diagonal
      const captureCols = [c - 1, c + 1];
      for (const capC of captureCols) {
        if (capC >= 0 && capC < 8 && nextR >= 0 && nextR < 8) {
          const victim = this._board[nextR][capC];
          if (victim && victim.color !== piece.color) {
            const toSq = this._coordsToSquare(nextR, capC);
            const isPromo = (piece.color === 'w' && nextR === 0) || (piece.color === 'b' && nextR === 7);
            const san = `${FILES[c]}x${toSq}${isPromo ? '=Q' : ''}`;
            moves.push({
              from: sq,
              to: toSq,
              piece: 'p',
              color: piece.color,
              captured: victim.type,
              promotion: isPromo ? 'q' : null,
              san
            });
          }
        }
      }
    } else if (piece.type === 'n') {
      const knightDeltas = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightDeltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const victim = this._board[nr][nc];
          if (!victim || victim.color !== piece.color) {
            const toSq = this._coordsToSquare(nr, nc);
            const san = `N${victim ? 'x' : ''}${toSq}`;
            moves.push({
              from: sq,
              to: toSq,
              piece: 'n',
              color: piece.color,
              captured: victim ? victim.type : null,
              promotion: null,
              san
            });
          }
        }
      }
    } else if (piece.type === 'r' || piece.type === 'b' || piece.type === 'q') {
      const dirs = [];
      if (piece.type === 'r' || piece.type === 'q') {
        dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }
      if (piece.type === 'b' || piece.type === 'q') {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }

      const pChar = piece.type.toUpperCase();
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (true) {
          const nr = r + (dr * step);
          const nc = c + (dc * step);
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;

          const victim = this._board[nr][nc];
          const toSq = this._coordsToSquare(nr, nc);

          if (!victim) {
            moves.push({
              from: sq,
              to: toSq,
              piece: piece.type,
              color: piece.color,
              captured: null,
              promotion: null,
              san: `${pChar}${toSq}`
            });
          } else {
            if (victim.color !== piece.color) {
              moves.push({
                from: sq,
                to: toSq,
                piece: piece.type,
                color: piece.color,
                captured: victim.type,
                promotion: null,
                san: `${pChar}x${toSq}`
              });
            }
            break;
          }
          step++;
        }
      }
    }

    return moves;
  }

  _squareToCoords(sq) {
    if (!sq || sq.length < 2) return { r: -1, c: -1 };
    const c = FILES.indexOf(sq[0].toLowerCase());
    const r = RANKS.indexOf(sq[1]);
    return { r, c };
  }

  _coordsToSquare(r, c) {
    return `${FILES[c]}${RANKS[r]}`;
  }
}

/**
 * Función de Evaluación Heurística para Minijuegos Sin Rey
 */
export const evaluateKinglessPosition = (game) => {
  const board = game.board();
  let score = 0;

  const PIECE_WEIGHTS = { p: 100, n: 320, b: 330, r: 500, q: 900 };

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_WEIGHTS[piece.type] || 100;
      let posBonus = 0;

      if (piece.type === 'p') {
        // Bonificación exponencial por avance hacia la coronación
        if (piece.color === 'w') {
          const rankFromBottom = 7 - r;
          posBonus = rankFromBottom * 35;
          if (r === 0) posBonus += 20000; // ¡Victoria inmediata!
        } else {
          posBonus = r * 35;
          if (r === 7) posBonus += 20000; // ¡Victoria inmediata!
        }
      } else if (piece.type === 'n') {
        // Caballos en el centro
        const centerDist = Math.abs(3.5 - r) + Math.abs(3.5 - c);
        posBonus = (7 - centerDist) * 10;
      }

      if (piece.color === 'w') {
        score += (baseVal + posBonus);
      } else {
        score -= (baseVal + posBonus);
      }
    }
  }

  return score;
};

/**
 * Algoritmo Minimax con Poda Alfa-Beta para Bots en Minijuegos Sin Rey
 */
export const getBestKinglessBotMove = (fen, difficulty = 2) => {
  const game = new KinglessChess(fen);
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const isMaximizing = game.turn() === 'w';
  const depth = Math.min(3, Math.max(1, difficulty));

  let bestMove = legalMoves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  // Barajar movimientos para variedad
  const shuffledMoves = [...legalMoves].sort(() => Math.random() - 0.5);

  for (const move of shuffledMoves) {
    const simGame = new KinglessChess(fen);
    simGame.move(move);

    // Si este movimiento corona de inmediato, tomarlo sin dudar
    if (simGame.isGameOver()) {
      return move;
    }

    const moveVal = minimax(simGame, depth - 1, -Infinity, Infinity, !isMaximizing);

    if (isMaximizing) {
      if (moveVal > bestValue) {
        bestValue = moveVal;
        bestMove = move;
      }
    } else {
      if (moveVal < bestValue) {
        bestValue = moveVal;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateKinglessPosition(game);
  }

  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) {
    return evaluateKinglessPosition(game);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const sim = new KinglessChess(game.fen());
      sim.move(move);
      const ev = minimax(sim, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const sim = new KinglessChess(game.fen());
      sim.move(move);
      const ev = minimax(sim, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}
