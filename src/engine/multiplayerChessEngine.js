/**
 * MultiplayerChessEngine.js
 * Motor autónomo de ajedrez multijugador para Ajedrez Junvill.
 * Soporta:
 * 1. Chaturaji (8x8 Védico con Dados para 4 jugadores)
 * 2. Four-Player Chess (14x14 en cruz para 4 jugadores)
 * 3. Three-Player Hexagonal (96 casillas trilobulares para 3 jugadores)
 * 4. 3-Man Circular Chess (144 casillas concéntricas para 3 jugadores)
 */

// ============================================================================
// 1. CHATURAJI (8x8 VÉDICO CON DADOS)
// ============================================================================

export const CHATURAJI_PLAYERS = ['red', 'green', 'yellow', 'black'];

export const CHATURAJI_CONFIG = {
  red: {
    name: 'Rojo',
    throne: { x: 0, y: 0 },
    colorHex: '#ef4444',
    pawnDir: { dx: 0, dy: 1 },
    pieces: [
      { type: 'k', x: 0, y: 0 }, // Rajá
      { type: 'n', x: 1, y: 0 }, // Ashva (Caballo)
      { type: 's', x: 2, y: 0 }, // Ratha (Barco)
      { type: 'e', x: 3, y: 0 }, // Gaja (Elefante / Torre)
      { type: 'p', x: 0, y: 1 },
      { type: 'p', x: 1, y: 1 },
      { type: 'p', x: 2, y: 1 },
      { type: 'p', x: 3, y: 1 }
    ]
  },
  green: {
    name: 'Verde',
    throne: { x: 0, y: 7 },
    colorHex: '#10b981',
    pawnDir: { dx: 1, dy: 0 },
    pieces: [
      { type: 'k', x: 0, y: 7 },
      { type: 'n', x: 0, y: 6 },
      { type: 's', x: 0, y: 5 },
      { type: 'e', x: 0, y: 4 },
      { type: 'p', x: 1, y: 7 },
      { type: 'p', x: 1, y: 6 },
      { type: 'p', x: 1, y: 5 },
      { type: 'p', x: 1, y: 4 }
    ]
  },
  yellow: {
    name: 'Amarillo',
    throne: { x: 7, y: 7 },
    colorHex: '#f59e0b',
    pawnDir: { dx: 0, dy: -1 },
    pieces: [
      { type: 'k', x: 7, y: 7 },
      { type: 'n', x: 6, y: 7 },
      { type: 's', x: 5, y: 7 },
      { type: 'e', x: 4, y: 7 },
      { type: 'p', x: 7, y: 6 },
      { type: 'p', x: 6, y: 6 },
      { type: 'p', x: 5, y: 6 },
      { type: 'p', x: 4, y: 6 }
    ]
  },
  black: {
    name: 'Negro',
    throne: { x: 7, y: 0 },
    colorHex: '#334155',
    pawnDir: { dx: -1, dy: 0 },
    pieces: [
      { type: 'k', x: 7, y: 0 },
      { type: 'n', x: 7, y: 1 },
      { type: 's', x: 7, y: 2 },
      { type: 'e', x: 7, y: 3 },
      { type: 'p', x: 6, y: 0 },
      { type: 'p', x: 6, y: 1 },
      { type: 'p', x: 6, y: 2 },
      { type: 'p', x: 6, y: 3 }
    ]
  }
};

export class ChaturajiGame {
  constructor() {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.players = [...CHATURAJI_PLAYERS];
    this.currentTurnIdx = 0;
    this.eliminated = new Set();
    this.currentDice = null;
    this.scores = { red: 0, green: 0, yellow: 0, black: 0 };
    this.capturedPieces = { red: [], green: [], yellow: [], black: [] };
    this.moveHistory = [];
    this.winner = null;
    this.initBoard();
    this.rollDice();
  }

  initBoard() {
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    CHATURAJI_PLAYERS.forEach(player => {
      const cfg = CHATURAJI_CONFIG[player];
      cfg.pieces.forEach(p => {
        this.board[p.y][p.x] = {
          type: p.type,
          owner: player,
          id: `${player}_${p.type}_${p.x}_${p.y}`
        };
      });
    });
  }

  get activePlayer() {
    return this.players[this.currentTurnIdx];
  }

  rollDice() {
    const diceValues = [2, 3, 4, 5];
    this.currentDice = diceValues[Math.floor(Math.random() * diceValues.length)];
    return this.currentDice;
  }

  getAllowedPieceTypes() {
    if (!this.currentDice) return [];
    if (this.currentDice === 2) return ['s'];
    if (this.currentDice === 3) return ['n'];
    if (this.currentDice === 4) return ['e'];
    if (this.currentDice === 5) return ['k', 'p'];
    return [];
  }

  getLegalMovesForPiece(x, y) {
    const piece = this.board[y]?.[x];
    if (!piece || piece.owner !== this.activePlayer) return [];
    const allowed = this.getAllowedPieceTypes();
    if (!allowed.includes(piece.type)) return [];

    const moves = [];
    const isInside = (nx, ny) => nx >= 0 && nx < 8 && ny >= 0 && ny < 8;

    if (piece.type === 'k') {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (isInside(nx, ny)) {
            const dest = this.board[ny][nx];
            if (!dest || dest.owner !== piece.owner) {
              moves.push({ from: { x, y }, to: { nx, ny } });
            }
          }
        }
      }
    } else if (piece.type === 'p') {
      const dir = CHATURAJI_CONFIG[piece.owner].pawnDir;
      const fx = x + dir.dx;
      const fy = y + dir.dy;
      if (isInside(fx, fy) && !this.board[fy][fx]) {
        moves.push({ from: { x, y }, to: { nx: fx, ny: fy } });
      }
      const diagonals = dir.dx === 0 
        ? [{ dx: -1, dy: dir.dy }, { dx: 1, dy: dir.dy }]
        : [{ dx: dir.dx, dy: -1 }, { dx: dir.dx, dy: 1 }];

      diagonals.forEach(d => {
        const cx = x + d.dx;
        const cy = y + d.dy;
        if (isInside(cx, cy)) {
          const dest = this.board[cy][cx];
          if (dest && dest.owner !== piece.owner) {
            moves.push({ from: { x, y }, to: { nx: cx, ny: cy } });
          }
        }
      });
    } else if (piece.type === 's') {
      const leaps = [
        { dx: -2, dy: -2 }, { dx: 2, dy: -2 },
        { dx: -2, dy: 2 }, { dx: 2, dy: 2 }
      ];
      leaps.forEach(l => {
        const nx = x + l.dx;
        const ny = y + l.dy;
        if (isInside(nx, ny)) {
          const dest = this.board[ny][nx];
          if (!dest || dest.owner !== piece.owner) {
            moves.push({ from: { x, y }, to: { nx, ny } });
          }
        }
      });
    } else if (piece.type === 'n') {
      const knightMoves = [
        { dx: -1, dy: -2 }, { dx: 1, dy: -2 },
        { dx: -2, dy: -1 }, { dx: 2, dy: -1 },
        { dx: -2, dy: 1 }, { dx: 2, dy: 1 },
        { dx: -1, dy: 2 }, { dx: 1, dy: 2 }
      ];
      knightMoves.forEach(km => {
        const nx = x + km.dx;
        const ny = y + km.dy;
        if (isInside(nx, ny)) {
          const dest = this.board[ny][nx];
          if (!dest || dest.owner !== piece.owner) {
            moves.push({ from: { x, y }, to: { nx, ny } });
          }
        }
      });
    } else if (piece.type === 'e') {
      const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
      dirs.forEach(d => {
        let step = 1;
        while (true) {
          const nx = x + d.dx * step;
          const ny = y + d.dy * step;
          if (!isInside(nx, ny)) break;
          const dest = this.board[ny][nx];
          if (!dest) {
            moves.push({ from: { x, y }, to: { nx, ny } });
          } else {
            if (dest.owner !== piece.owner) {
              moves.push({ from: { x, y }, to: { nx, ny } });
            }
            break;
          }
          step++;
        }
      });
    }

    return moves;
  }

  getAllLegalMovesForActivePlayer() {
    const moves = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = this.board[y][x];
        if (piece && piece.owner === this.activePlayer) {
          moves.push(...this.getLegalMovesForPiece(x, y));
        }
      }
    }
    return moves;
  }

  makeMove(fromX, fromY, toX, toY) {
    const legalMoves = this.getLegalMovesForPiece(fromX, fromY);
    const valid = legalMoves.find(m => m.to.nx === toX && m.to.ny === toY);
    if (!valid) return false;

    const movingPiece = this.board[fromY][fromX];
    const targetPiece = this.board[toY][toX];

    if (targetPiece) {
      const pointsMap = { p: 1, s: 2, n: 3, e: 4, k: 10 };
      this.scores[this.activePlayer] += (pointsMap[targetPiece.type] || 1);
      if (!this.capturedPieces[this.activePlayer]) this.capturedPieces[this.activePlayer] = [];
      this.capturedPieces[this.activePlayer].push({
        type: targetPiece.type,
        owner: targetPiece.owner
      });

      if (targetPiece.type === 'k') {
        this.eliminatePlayer(targetPiece.owner);
      }
    }

    if (movingPiece.type === 'k') {
      CHATURAJI_PLAYERS.forEach(rival => {
        if (rival !== movingPiece.owner) {
          const rivalThrone = CHATURAJI_CONFIG[rival].throne;
          if (toX === rivalThrone.x && toY === rivalThrone.y) {
            this.scores[movingPiece.owner] += 20;
          }
        }
      });
    }

    this.board[toY][toX] = movingPiece;
    this.board[fromY][fromX] = null;

    this.moveHistory.push({
      player: this.activePlayer,
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      piece: movingPiece.type,
      captured: targetPiece ? targetPiece.type : null,
      dice: this.currentDice
    });

    this.checkWinner();
    this.nextTurn();
    return true;
  }

  eliminatePlayer(player) {
    this.eliminated.add(player);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.board[y][x]?.owner === player) {
          this.board[y][x].owner = 'frozen';
        }
      }
    }
  }

  passTurn() {
    this.moveHistory.push({
      player: this.activePlayer,
      pass: true,
      dice: this.currentDice
    });
    this.nextTurn();
  }

  nextTurn() {
    if (this.winner) return;

    let iterations = 0;
    do {
      this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
      iterations++;
    } while (this.eliminated.has(this.players[this.currentTurnIdx]) && iterations < 10);

    this.rollDice();
  }

  checkWinner() {
    const activeCount = this.players.filter(p => !this.eliminated.has(p));
    if (activeCount.length === 1) {
      this.winner = activeCount[0];
    }
  }

  getCapturedSummary(player) {
    const list = this.capturedPieces?.[player] || [];
    const counts = {};
    list.forEach(p => {
      const key = `${p.type}_${p.owner}`;
      if (!counts[key]) counts[key] = { type: p.type, owner: p.owner, count: 0 };
      counts[key].count++;
    });
    return Object.values(counts);
  }
}

// ============================================================================
// 2. FOUR-PLAYER CHESS (14x14 EN CRUZ)
// ============================================================================

export const FOUR_PLAYERS = ['red', 'blue', 'yellow', 'green'];

export class FourPlayerGame {
  constructor(mode = 'ffa') {
    this.mode = mode; // 'ffa' o 'teams'
    this.board = Array(14).fill(null).map(() => Array(14).fill(null));
    this.players = [...FOUR_PLAYERS];
    this.currentTurnIdx = 0;
    this.eliminated = new Set();
    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };
    this.capturedPieces = { red: [], blue: [], yellow: [], green: [] };
    this.winner = null;
    this.moveHistory = [];
    this.initBoard();
  }

  static isOutOfBounds(x, y) {
    return (x < 3 || x > 10) && (y < 3 || y > 10);
  }

  initBoard() {
    this.board = Array(14).fill(null).map(() => Array(14).fill(null));

    // Red (Sur)
    const orderRed = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    orderRed.forEach((type, i) => {
      this.board[0][3 + i] = { type, owner: 'red', id: `red_${type}_${3+i}` };
      this.board[1][3 + i] = { type: 'p', owner: 'red', id: `red_p_${3+i}`, hasMoved: false };
    });

    // Blue (Oeste)
    const orderBlue = ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'];
    orderBlue.forEach((type, i) => {
      this.board[3 + i][0] = { type, owner: 'blue', id: `blue_${type}_${3+i}` };
      this.board[3 + i][1] = { type: 'p', owner: 'blue', id: `blue_p_${3+i}`, hasMoved: false };
    });

    // Yellow (Norte)
    const orderYellow = ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r'];
    orderYellow.forEach((type, i) => {
      this.board[13][3 + i] = { type, owner: 'yellow', id: `yellow_${type}_${3+i}` };
      this.board[12][3 + i] = { type: 'p', owner: 'yellow', id: `yellow_p_${3+i}`, hasMoved: false };
    });

    // Green (Este)
    const orderGreen = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    orderGreen.forEach((type, i) => {
      this.board[3 + i][13] = { type, owner: 'green', id: `green_${type}_${3+i}` };
      this.board[3 + i][12] = { type: 'p', owner: 'green', id: `green_p_${3+i}`, hasMoved: false };
    });
  }

  get activePlayer() {
    return this.players[this.currentTurnIdx];
  }

  areAllies(p1, p2) {
    if (!p1 || !p2) return false;
    if (p1 === p2) return true;
    if (this.mode === 'teams') {
      return (p1 === 'red' && p2 === 'yellow') || (p1 === 'yellow' && p2 === 'red') ||
             (p1 === 'blue' && p2 === 'green') || (p1 === 'green' && p2 === 'blue');
    }
    return false;
  }

  getLegalMovesForPiece(x, y) {
    const piece = this.board[y]?.[x];
    if (!piece || piece.owner !== this.activePlayer) return [];

    const moves = [];
    const isValidCell = (nx, ny) => {
      if (nx < 0 || nx > 13 || ny < 0 || ny > 13) return false;
      return !FourPlayerGame.isOutOfBounds(nx, ny);
    };

    const addMoveIfValid = (nx, ny) => {
      if (!isValidCell(nx, ny)) return false;
      const dest = this.board[ny][nx];
      if (!dest) {
        moves.push({ from: { x, y }, to: { nx, ny } });
        return true;
      }
      if (!this.areAllies(piece.owner, dest.owner)) {
        moves.push({ from: { x, y }, to: { nx, ny } });
      }
      return false;
    };

    if (piece.type === 'k') {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          addMoveIfValid(x + dx, y + dy);
        }
      }
    } else if (piece.type === 'n') {
      const jumps = [
        { dx: -1, dy: -2 }, { dx: 1, dy: -2 },
        { dx: -2, dy: -1 }, { dx: 2, dy: -1 },
        { dx: -2, dy: 1 }, { dx: 2, dy: 1 },
        { dx: -1, dy: 2 }, { dx: 1, dy: 2 }
      ];
      jumps.forEach(j => addMoveIfValid(x + j.dx, y + j.dy));
    } else if (piece.type === 'r' || piece.type === 'q') {
      const orthDirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
      orthDirs.forEach(d => {
        let step = 1;
        while (true) {
          const nx = x + d.dx * step;
          const ny = y + d.dy * step;
          if (!addMoveIfValid(nx, ny)) break;
          step++;
        }
      });
    }

    if (piece.type === 'b' || piece.type === 'q') {
      const diagDirs = [{ dx: 1, dy: 1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 }];
      diagDirs.forEach(d => {
        let step = 1;
        while (true) {
          const nx = x + d.dx * step;
          const ny = y + d.dy * step;
          if (!addMoveIfValid(nx, ny)) break;
          step++;
        }
      });
    }

    if (piece.type === 'p') {
      const forwardVectors = {
        red: { dx: 0, dy: 1 },
        blue: { dx: 1, dy: 0 },
        yellow: { dx: 0, dy: -1 },
        green: { dx: -1, dy: 0 }
      };
      const fwd = forwardVectors[piece.owner];

      const fx = x + fwd.dx;
      const fy = y + fwd.dy;
      if (isValidCell(fx, fy) && !this.board[fy][fx]) {
        moves.push({ from: { x, y }, to: { nx: fx, ny: fy } });
        if (!piece.hasMoved) {
          const f2x = x + fwd.dx * 2;
          const f2y = y + fwd.dy * 2;
          if (isValidCell(f2x, f2y) && !this.board[f2y][f2x]) {
            moves.push({ from: { x, y }, to: { nx: f2x, ny: f2y } });
          }
        }
      }

      const captureDiags = fwd.dx === 0 
        ? [{ dx: -1, dy: fwd.dy }, { dx: 1, dy: fwd.dy }]
        : [{ dx: fwd.dx, dy: -1 }, { dx: fwd.dx, dy: 1 }];

      captureDiags.forEach(cd => {
        const cx = x + cd.dx;
        const cy = y + cd.dy;
        if (isValidCell(cx, cy)) {
          const dest = this.board[cy][cx];
          if (dest && !this.areAllies(piece.owner, dest.owner)) {
            moves.push({ from: { x, y }, to: { nx: cx, ny: cy } });
          }
        }
      });
    }

    return moves;
  }

  getAllLegalMovesForActivePlayer() {
    const moves = [];
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 14; x++) {
        if (FourPlayerGame.isOutOfBounds(x, y)) continue;
        const piece = this.board[y][x];
        if (piece && piece.owner === this.activePlayer) {
          moves.push(...this.getLegalMovesForPiece(x, y));
        }
      }
    }
    return moves;
  }

  makeMove(fromX, fromY, toX, toY) {
    const legalMoves = this.getLegalMovesForPiece(fromX, fromY);
    const valid = legalMoves.find(m => m.to.nx === toX && m.to.ny === toY);
    if (!valid) return false;

    const movingPiece = this.board[fromY][fromX];
    const targetPiece = this.board[toY][toX];

    movingPiece.hasMoved = true;

    // Coronación al alcanzar la 8.ª casilla relativa
    if (movingPiece.type === 'p') {
      const reached8th = (movingPiece.owner === 'red' && toY >= 7) ||
                         (movingPiece.owner === 'blue' && toX >= 7) ||
                         (movingPiece.owner === 'yellow' && toY <= 6) ||
                         (movingPiece.owner === 'green' && toX <= 6);
      if (reached8th) {
        movingPiece.type = 'q';
      }
    }

    if (targetPiece) {
      const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 20 };
      this.scores[this.activePlayer] += (pieceValues[targetPiece.type] || 1);
      if (!this.capturedPieces[this.activePlayer]) this.capturedPieces[this.activePlayer] = [];
      this.capturedPieces[this.activePlayer].push({
        type: targetPiece.type,
        owner: targetPiece.owner
      });

      if (targetPiece.type === 'k') {
        this.eliminatePlayer(targetPiece.owner);
      }
    }

    this.board[toY][toX] = movingPiece;
    this.board[fromY][fromX] = null;

    this.moveHistory.push({
      player: this.activePlayer,
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      piece: movingPiece.type,
      captured: targetPiece ? targetPiece.type : null
    });

    this.checkWinner();
    this.nextTurn();
    return true;
  }

  eliminatePlayer(player) {
    this.eliminated.add(player);
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 14; x++) {
        if (this.board[y][x]?.owner === player) {
          this.board[y][x].owner = 'frozen';
        }
      }
    }
  }

  nextTurn() {
    if (this.winner) return;
    let count = 0;
    do {
      this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
      count++;
    } while (this.eliminated.has(this.players[this.currentTurnIdx]) && count < 10);

    const moves = this.getAllLegalMovesForActivePlayer();
    if (moves.length === 0 && !this.eliminated.has(this.activePlayer)) {
      this.eliminatePlayer(this.activePlayer);
      this.nextTurn();
    }
  }

  checkWinner() {
    const active = this.players.filter(p => !this.eliminated.has(p));
    if (this.mode === 'teams') {
      const team1Alive = !this.eliminated.has('red') || !this.eliminated.has('yellow');
      const team2Alive = !this.eliminated.has('blue') || !this.eliminated.has('green');
      if (!team1Alive) this.winner = 'Equipo Azul + Verde';
      else if (!team2Alive) this.winner = 'Equipo Rojo + Amarillo';
    } else {
      if (active.length === 1) {
        this.winner = active[0];
      }
    }
  }

  getCapturedSummary(player) {
    const list = this.capturedPieces?.[player] || [];
    const counts = {};
    list.forEach(p => {
      const key = `${p.type}_${p.owner}`;
      if (!counts[key]) counts[key] = { type: p.type, owner: p.owner, count: 0 };
      counts[key].count++;
    });
    return Object.values(counts);
  }
}

// ============================================================================
// 3. THREE-PLAYER CHESS (HEXAGONAL TRILOBULAR - 96 CASILLAS)
// ============================================================================

export const THREE_HEX_PLAYERS = ['white', 'black', 'red'];

export class ThreePlayerHexGame {
  constructor() {
    this.players = [...THREE_HEX_PLAYERS];
    this.currentTurnIdx = 0;
    this.eliminated = new Set();
    this.scores = { white: 0, black: 0, red: 0 };
    this.capturedPieces = { white: [], black: [], red: [] };
    this.winner = null;
    this.moveHistory = [];
    this.cells = {};
    this.initGraphAndPieces();
  }

  initGraphAndPieces() {
    this.cells = {};
    const sectors = ['A', 'B', 'C'];
    sectors.forEach((sec, sIdx) => {
      for (let r = 0; r < 4; r++) {
        for (let f = 0; f < 8; f++) {
          const id = `${sec}_${f}_${r}`;
          const colorClass = (f + r + sIdx) % 3;
          this.cells[id] = {
            id,
            sector: sec,
            file: f,
            rank: r,
            colorClass,
            piece: null
          };
        }
      }
    });

    const setupArmy = (sector, owner) => {
      const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
      backRank.forEach((type, f) => {
        this.cells[`${sector}_${f}_0`].piece = { type, owner, hasMoved: false };
      });
      for (let f = 0; f < 8; f++) {
        this.cells[`${sector}_${f}_1`].piece = { type: 'p', owner, hasMoved: false };
      }
    };

    setupArmy('A', 'white');
    setupArmy('B', 'black');
    setupArmy('C', 'red');
  }

  get activePlayer() {
    return this.players[this.currentTurnIdx];
  }

  getRay(startId, rayType) {
    const [startSec, fStr, rStr] = startId.split('_');
    const startF = parseInt(fStr, 10);
    const startR = parseInt(rStr, 10);
    const path = [];
    const visited = new Set([startId]);

    let sec = startSec;
    let f = startF;
    let r = startR;
    let dr = 0;
    let df = 0;

    if (rayType === 'N')  { dr = 1; df = 0; }
    else if (rayType === 'S')  { dr = -1; df = 0; }
    else if (rayType === 'E')  { dr = 0; df = 1; }
    else if (rayType === 'W')  { dr = 0; df = -1; }
    else if (rayType === 'NE') { dr = 1; df = 1; }
    else if (rayType === 'NW') { dr = 1; df = -1; }
    else if (rayType === 'SE') { dr = -1; df = 1; }
    else if (rayType === 'SW') { dr = -1; df = -1; }

    for (let step = 0; step < 12; step++) {
      let nextSec = sec;
      let nextF = f + df;
      let nextR = r + dr;
      let nextDr = dr;
      let nextDf = df;

      if (dr === 0) {
        if (nextF < 0 || nextF > 7) break;
      } else if (dr === -1) {
        if (nextR < 0 || nextF < 0 || nextF > 7) break;
      } else if (dr === 1) {
        if (df !== 0 && (nextF < 0 || nextF > 7)) break;

        if (nextR > 3) {
          // Cruzar costura hacia el sector contiguo en rango 3
          let seamSec = null;
          let seamF = f;
          if (sec === 'A') {
            seamSec = f <= 3 ? 'B' : 'C';
          } else if (sec === 'B') {
            seamSec = f <= 3 ? 'A' : 'C';
            if (f >= 4) seamF = 7 - f;
          } else if (sec === 'C') {
            seamSec = f <= 3 ? 'B' : 'A';
            if (f <= 3) seamF = 7 - f;
          }

          if (!seamSec) break;

          nextSec = seamSec;
          nextR = 3;
          nextDr = -1; // En el nuevo sector avanza hacia la base enemiga (rango 0)

          if (df === 0) {
            nextF = seamF;
            nextDf = 0;
          } else {
            if ((sec === 'B' && f >= 4) || (sec === 'C' && f <= 3)) {
              nextDf = -df;
            } else {
              nextDf = df;
            }
            nextF = seamF + nextDf;
            if (nextF < 0 || nextF > 7) break;
          }
        }
      }

      const nextId = `${nextSec}_${nextF}_${nextR}`;
      if (visited.has(nextId) || !this.cells[nextId]) break;
      visited.add(nextId);
      path.push(nextId);

      sec = nextSec;
      f = nextF;
      r = nextR;
      dr = nextDr;
      df = nextDf;
    }

    return path;
  }

  getAdjacentCells(id, direction) {
    const ray = this.getRay(id, direction);
    return ray.length > 0 ? [ray[0]] : [];
  }

  getLegalMovesForCell(cellId) {
    const cell = this.cells[cellId];
    if (!cell || !cell.piece || cell.piece.owner !== this.activePlayer) return [];
    const piece = cell.piece;
    const moves = [];

    const exploreRay = (dir) => {
      const ray = this.getRay(cellId, dir);
      for (const targetId of ray) {
        const targetCell = this.cells[targetId];
        if (!targetCell) break;
        if (!targetCell.piece) {
          moves.push({ from: cellId, to: targetId });
        } else {
          if (targetCell.piece.owner !== piece.owner) {
            moves.push({ from: cellId, to: targetId });
          }
          break; // Obstáculo bloquea la trayectoria
        }
      }
    };

    if (piece.type === 'r' || piece.type === 'q') {
      ['N', 'S', 'E', 'W'].forEach(exploreRay);
    }
    if (piece.type === 'b' || piece.type === 'q') {
      ['NE', 'NW', 'SE', 'SW'].forEach(exploreRay);
    }
    if (piece.type === 'k') {
      ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'].forEach(dir => {
        const ray = this.getRay(cellId, dir);
        if (ray.length > 0) {
          const targetId = ray[0];
          const targetCell = this.cells[targetId];
          if (targetCell && (!targetCell.piece || targetCell.piece.owner !== piece.owner)) {
            moves.push({ from: cellId, to: targetId });
          }
        }
      });
    }
    if (piece.type === 'n') {
      const orthDirs = ['N', 'S', 'E', 'W'];
      const targets = new Set();

      orthDirs.forEach(d1 => {
        const ray1 = this.getRay(cellId, d1);
        const perps = (d1 === 'N' || d1 === 'S') ? ['E', 'W'] : ['N', 'S'];

        if (ray1.length >= 2) {
          perps.forEach(d2 => {
            const ray2 = this.getRay(ray1[1], d2);
            if (ray2.length >= 1) targets.add(ray2[0]);
          });
        }
        if (ray1.length >= 1) {
          perps.forEach(d2 => {
            const ray2 = this.getRay(ray1[0], d2);
            if (ray2.length >= 2) targets.add(ray2[1]);
          });
        }
      });

      targets.forEach(tid => {
        const targetCell = this.cells[tid];
        if (targetCell && (!targetCell.piece || targetCell.piece.owner !== piece.owner)) {
          moves.push({ from: cellId, to: tid });
        }
      });
    }
    if (piece.type === 'p') {
      const homeSector = piece.owner === 'white' ? 'A' : piece.owner === 'black' ? 'B' : 'C';
      const isHome = cell.sector === homeSector;

      if (isHome) {
        const fwdRay = this.getRay(cellId, 'N');
        if (fwdRay.length > 0) {
          const step1 = fwdRay[0];
          if (!this.cells[step1]?.piece) {
            moves.push({ from: cellId, to: step1 });
            if (cell.rank === 1 && fwdRay.length > 1) {
              const step2 = fwdRay[1];
              if (!this.cells[step2]?.piece) {
                moves.push({ from: cellId, to: step2 });
              }
            }
          }
        }
        ['NE', 'NW'].forEach(d => {
          const dRay = this.getRay(cellId, d);
          if (dRay.length > 0) {
            const dest = this.cells[dRay[0]];
            if (dest && dest.piece && dest.piece.owner !== piece.owner) {
              moves.push({ from: cellId, to: dRay[0] });
            }
          }
        });
      } else {
        const fwdRay = this.getRay(cellId, 'S');
        if (fwdRay.length > 0) {
          const step1 = fwdRay[0];
          if (!this.cells[step1]?.piece) {
            moves.push({ from: cellId, to: step1 });
          }
        }
        ['SE', 'SW'].forEach(d => {
          const dRay = this.getRay(cellId, d);
          if (dRay.length > 0) {
            const dest = this.cells[dRay[0]];
            if (dest && dest.piece && dest.piece.owner !== piece.owner) {
              moves.push({ from: cellId, to: dRay[0] });
            }
          }
        });
      }
    }

    return moves;
  }

  getAllLegalMovesForActivePlayer() {
    const moves = [];
    Object.keys(this.cells).forEach(cid => {
      if (this.cells[cid].piece?.owner === this.activePlayer) {
        moves.push(...this.getLegalMovesForCell(cid));
      }
    });
    return moves;
  }

  makeMove(fromId, toId) {
    const legal = this.getLegalMovesForCell(fromId);
    const valid = legal.find(m => m.to === toId);
    if (!valid) return false;

    const sourceCell = this.cells[fromId];
    const destCell = this.cells[toId];
    const piece = sourceCell.piece;
    const captured = destCell.piece;

    if (captured) {
      this.scores[this.activePlayer] += (captured.type === 'k' ? 20 : 3);
      if (!this.capturedPieces[this.activePlayer]) this.capturedPieces[this.activePlayer] = [];
      this.capturedPieces[this.activePlayer].push({
        type: captured.type,
        owner: captured.owner
      });
      if (captured.type === 'k') {
        this.winner = this.activePlayer;
      }
    }

    const homeSector = piece.owner === 'white' ? 'A' : piece.owner === 'black' ? 'B' : 'C';
    if (piece.type === 'p' && destCell.rank === 0 && destCell.sector !== homeSector) {
      piece.type = 'q';
    }

    piece.hasMoved = true;
    destCell.piece = piece;
    sourceCell.piece = null;

    this.moveHistory.push({
      player: this.activePlayer,
      from: fromId,
      to: toId,
      piece: piece.type,
      captured: captured ? captured.type : null
    });

    if (!this.winner) {
      this.nextTurn();
    }
    return true;
  }

  nextTurn() {
    this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
  }

  getCapturedSummary(player) {
    const list = this.capturedPieces?.[player] || [];
    const counts = {};
    list.forEach(p => {
      const key = `${p.type}_${p.owner}`;
      if (!counts[key]) counts[key] = { type: p.type, owner: p.owner, count: 0 };
      counts[key].count++;
    });
    return Object.values(counts);
  }
}

// ============================================================================
// 4. 3-MAN CHESS (CIRCULAR CONCÉNTRICO - 144 CASILLAS)
// ============================================================================

export const THREE_CIRCULAR_PLAYERS = ['white', 'black', 'red'];

export class ThreePlayerCircularGame {
  constructor() {
    this.board = Array(6).fill(null).map(() => Array(24).fill(null));
    this.players = [...THREE_CIRCULAR_PLAYERS];
    this.currentTurnIdx = 0;
    this.eliminated = new Set();
    this.scores = { white: 0, black: 0, red: 0 };
    this.capturedPieces = { white: [], black: [], red: [] };
    this.winner = null;
    this.moveHistory = [];
    this.initBoard();
  }

  initBoard() {
    this.board = Array(6).fill(null).map(() => Array(24).fill(null));

    const setupArmy = (startRay, owner) => {
      const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
      backRank.forEach((type, i) => {
        const ray = (startRay + i) % 24;
        this.board[0][ray] = { type, owner, hasMoved: false };
      });
      for (let i = 0; i < 8; i++) {
        const ray = (startRay + i) % 24;
        this.board[1][ray] = { type: 'p', owner, hasMoved: false, movingInward: true };
      }
    };

    setupArmy(0, 'white');
    setupArmy(8, 'black');
    setupArmy(16, 'red');
  }

  get activePlayer() {
    return this.players[this.currentTurnIdx];
  }

  getLegalMovesForPiece(ring, ray) {
    const piece = this.board[ring]?.[ray];
    if (!piece || piece.owner !== this.activePlayer) return [];
    const moves = [];

    const checkDest = (targetRing, targetRay) => {
      const dest = this.board[targetRing]?.[targetRay];
      if (!dest) {
        moves.push({ from: { ring, ray }, to: { ring: targetRing, ray: targetRay } });
        return true;
      }
      if (dest.owner !== piece.owner) {
        moves.push({ from: { ring, ray }, to: { ring: targetRing, ray: targetRay } });
      }
      return false;
    };

    if (piece.type === 'r' || piece.type === 'q') {
      [1, -1].forEach(dir => {
        for (let step = 1; step < 24; step++) {
          const nextRay = (ray + dir * step + 24) % 24;
          if (!checkDest(ring, nextRay)) break;
        }
      });

      for (let r = ring - 1; r >= 0; r--) {
        if (!checkDest(r, ray)) break;
      }
      let crossedCenter = false;
      let currR = ring;
      let currRay = ray;
      while (true) {
        if (!crossedCenter) {
          currR++;
          if (currR > 5) {
            crossedCenter = true;
            currR = 5;
            currRay = (currRay + 12) % 24;
          }
        } else {
          currR--;
          if (currR < 0) break;
        }
        if (!checkDest(currR, currRay)) break;
      }
    }

    if (piece.type === 'b' || piece.type === 'q') {
      [1, -1].forEach(dRay => {
        for (let step = 1; ring - step >= 0; step++) {
          const nRing = ring - step;
          const nRay = (ray + dRay * step + 24) % 24;
          if (!checkDest(nRing, nRay)) break;
        }
        let cRing = ring;
        let cRay = ray;
        let crossed = false;
        for (let step = 1; step <= 12; step++) {
          if (!crossed) {
            cRing++;
            cRay = (cRay + dRay + 24) % 24;
            if (cRing > 5) {
              crossed = true;
              cRing = 5;
              cRay = (cRay + 12) % 24;
            }
          } else {
            cRing--;
            cRay = (cRay + dRay + 24) % 24;
            if (cRing < 0) break;
          }
          if (!checkDest(cRing, cRay)) break;
        }
      });
    }

    if (piece.type === 'k') {
      const ringDeltas = [-1, 0, 1];
      const rayDeltas = [-1, 0, 1];
      ringDeltas.forEach(dr => {
        rayDeltas.forEach(dy => {
          if (dr === 0 && dy === 0) return;
          const nRing = ring + dr;
          const nRay = (ray + dy + 24) % 24;
          if (nRing >= 0 && nRing <= 5) {
            checkDest(nRing, nRay);
          }
        });
      });
    }

    if (piece.type === 'n') {
      const knightOffsets = [
        { dr: 2, dy: 1 }, { dr: 2, dy: -1 },
        { dr: -2, dy: 1 }, { dr: -2, dy: -1 },
        { dr: 1, dy: 2 }, { dr: 1, dy: -2 },
        { dr: -1, dy: 2 }, { dr: -1, dy: -2 }
      ];
      knightOffsets.forEach(off => {
        const nRing = ring + off.dr;
        const nRay = (ray + off.dy + 24) % 24;
        if (nRing >= 0 && nRing <= 5) {
          checkDest(nRing, nRay);
        }
      });
    }

    if (piece.type === 'p') {
      const dir = piece.movingInward ? 1 : -1;
      let nextRing = ring + dir;
      let nextRay = ray;
      let flipsDir = false;

      if (nextRing > 5) {
        nextRing = 5;
        nextRay = (ray + 12) % 24;
        flipsDir = true;
      }

      if (nextRing >= 0 && nextRing <= 5 && !this.board[nextRing][nextRay]) {
        moves.push({ from: { ring, ray }, to: { ring: nextRing, ray: nextRay }, flipsDir });
      }

      [-1, 1].forEach(dRay => {
        let cRing = ring + dir;
        let cRay = (ray + dRay + 24) % 24;
        if (cRing > 5) {
          cRing = 5;
          cRay = (cRay + 12) % 24;
        }
        if (cRing >= 0 && cRing <= 5) {
          const dest = this.board[cRing][cRay];
          if (dest && dest.owner !== piece.owner) {
            moves.push({ from: { ring, ray }, to: { ring: cRing, ray: cRay } });
          }
        }
      });
    }

    return moves;
  }

  getAllLegalMovesForActivePlayer() {
    const moves = [];
    for (let r = 0; r < 6; r++) {
      for (let y = 0; y < 24; y++) {
        if (this.board[r][y]?.owner === this.activePlayer) {
          moves.push(...this.getLegalMovesForPiece(r, y));
        }
      }
    }
    return moves;
  }

  makeMove(fromRing, fromRay, toRing, toRay) {
    const legal = this.getLegalMovesForPiece(fromRing, fromRay);
    const valid = legal.find(m => m.to.ring === toRing && m.to.ray === toRay);
    if (!valid) return false;

    const moving = this.board[fromRing][fromRay];
    const target = this.board[toRing][toRay];

    if (valid.flipsDir) {
      moving.movingInward = false;
    }

    if (moving.type === 'p' && toRing === 0 && !moving.movingInward) {
      moving.type = 'q';
    }

    if (target) {
      this.scores[this.activePlayer] += (target.type === 'k' ? 20 : 3);
      if (!this.capturedPieces[this.activePlayer]) this.capturedPieces[this.activePlayer] = [];
      this.capturedPieces[this.activePlayer].push({
        type: target.type,
        owner: target.owner
      });
      if (target.type === 'k') {
        this.winner = this.activePlayer;
      }
    }

    this.board[toRing][toRay] = moving;
    this.board[fromRing][fromRay] = null;

    this.moveHistory.push({
      player: this.activePlayer,
      from: { ring: fromRing, ray: fromRay },
      to: { ring: toRing, ray: toRay },
      piece: moving.type,
      captured: target ? target.type : null
    });

    if (!this.winner) {
      this.nextTurn();
    }
    return true;
  }

  nextTurn() {
    this.currentTurnIdx = (this.currentTurnIdx + 1) % this.players.length;
  }

  getCapturedSummary(player) {
    const list = this.capturedPieces?.[player] || [];
    const counts = {};
    list.forEach(p => {
      const key = `${p.type}_${p.owner}`;
      if (!counts[key]) counts[key] = { type: p.type, owner: p.owner, count: 0 };
      counts[key].count++;
    });
    return Object.values(counts);
  }
}

// ============================================================================
// 5. IA BOT TÁCTICA PARA PARTIDAS MULTIJUGADOR
// ============================================================================

export function getBestMultiplayerBotMove(gameInstance, variant) {
  if (!gameInstance) return null;

  if (variant === 'chaturaji') {
    const moves = gameInstance.getAllLegalMovesForActivePlayer();
    if (moves.length === 0) return null;
    const pieceVal = { p: 10, s: 25, n: 35, e: 50, k: 500 };
    moves.sort((a, b) => {
      const destA = gameInstance.board[a.to.ny]?.[a.to.nx];
      const destB = gameInstance.board[b.to.ny]?.[b.to.nx];
      const valA = destA ? (pieceVal[destA.type] || 10) : 0;
      const valB = destB ? (pieceVal[destB.type] || 10) : 0;
      return (valB + Math.random() * 5) - (valA + Math.random() * 5);
    });
    return moves[0];
  }

  if (variant === 'four_player') {
    const moves = gameInstance.getAllLegalMovesForActivePlayer();
    if (moves.length === 0) return null;
    const pieceVal = { p: 10, n: 30, b: 35, r: 50, q: 90, k: 300 };
    moves.sort((a, b) => {
      const destA = gameInstance.board[a.to.ny]?.[a.to.nx];
      const destB = gameInstance.board[b.to.ny]?.[b.to.nx];
      const valA = destA ? (pieceVal[destA.type] || 10) : 0;
      const valB = destB ? (pieceVal[destB.type] || 10) : 0;
      return (valB + Math.random() * 5) - (valA + Math.random() * 5);
    });
    return moves[0];
  }

  if (variant === 'three_hex') {
    const moves = gameInstance.getAllLegalMovesForActivePlayer();
    if (moves.length === 0) return null;
    const pieceVal = { p: 10, n: 30, b: 35, r: 50, q: 90, k: 500 };
    moves.sort((a, b) => {
      const destA = gameInstance.cells[a.to]?.piece;
      const destB = gameInstance.cells[b.to]?.piece;
      const valA = destA ? (pieceVal[destA.type] || 10) : 0;
      const valB = destB ? (pieceVal[destB.type] || 10) : 0;
      return (valB + Math.random() * 5) - (valA + Math.random() * 5);
    });
    return moves[0];
  }

  if (variant === 'three_circular') {
    const moves = gameInstance.getAllLegalMovesForActivePlayer();
    if (moves.length === 0) return null;
    moves.sort((a, b) => {
      const destA = gameInstance.board[a.to.ring]?.[a.to.ray];
      const destB = gameInstance.board[b.to.ring]?.[b.to.ray];
      const valA = destA ? 50 : 0;
      const valB = destB ? 50 : 0;
      return (valB + Math.random() * 5) - (valA + Math.random() * 5);
    });
    return moves[0];
  }

  return null;
}
