import React, { useState, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { PieceIcon } from '../../assets/pieces';
import { audioManager } from '../../engine/audio';
import { useUser } from '../../context/UserContext';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const THEME_COLORS = {
  board_emerald: { light: '#ffffff', dark: '#689838', border: '#4d7527' },
  board_wood: { light: '#eedab2', dark: '#b88b4a', border: '#5c3a21' },
  board_royal: { light: '#e0e7ff', dark: '#3730a3', border: '#1e1b4b' },
  board_cyber: { light: '#334155', dark: '#0f172a', border: '#020617' },
  board_crimson: { light: '#fee2e2', dark: '#991b1b', border: '#7f1d1d' },
};

export const ChessBoard = ({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation = 'white',
  interactive = true,
  onMove = null,
  lastMove = null,
  animatingMove = null,
  showLegalMoves = null,
  customHighlights = {},
  hintQuadrant = null,
  hintSquare = null,
  dangerSquares = [],
  allowFreeMove = false
}) => {
  const { currentUser } = useUser();
  const shouldShowLegalMoves = showLegalMoves !== null 
    ? showLegalMoves 
    : (currentUser?.systemSettings?.highlightMoves !== false);
  
  // Estado síncrono puro: cero doble render por useEffect
  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch (e) {
      console.error("Invalid FEN:", fen, e);
      return new Chess();
    }
  }, [fen]);

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [draggedSquare, setDraggedSquare] = useState(null);
  const boardRef = useRef(null);

  // Derivación reactiva síncrona: jamás bloquea ni cancela el clic inmediato del usuario
  const validSelectedSquare = useMemo(() => {
    if (!selectedSquare) return null;
    const piece = game.get(selectedSquare);
    if (!piece) return null;
    if (!allowFreeMove && piece.color !== game.turn()) return null;
    return selectedSquare;
  }, [selectedSquare, game, allowFreeMove]);

  const activeLegalMoves = useMemo(() => {
    if (!validSelectedSquare) return [];
    try {
      return game.moves({ square: validSelectedSquare, verbose: true });
    } catch (e) {
      return [];
    }
  }, [validSelectedSquare, game]);

  const activeThemeKey = currentUser?.boardTheme || 'board_emerald';
  const themeColors = THEME_COLORS[activeThemeKey] || THEME_COLORS.board_emerald;

  const isFlipped = orientation === 'black';
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;

  const handleSquareClick = (square) => {
    if (!interactive || animatingMove) return;

    if (validSelectedSquare) {
      if (validSelectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      let move = activeLegalMoves.find(m => m.to === square);
      // Soporte En Passant Intuitivo: si el usuario hace clic directamente en el peón enemigo (ej. f5) en lugar de la casilla vacía (f6)
      if (!move) {
        move = activeLegalMoves.find(m => 
          m.flags && m.flags.includes('e') && (
            (m.color === 'w' && square === `${m.to[0]}5`) ||
            (m.color === 'b' && square === `${m.to[0]}4`)
          )
        );
      }

      if (move) {
        executeMove({ from: validSelectedSquare, to: move.to, promotion: 'q' });
        setSelectedSquare(null);
        return;
      }
    }

    const piece = game.get(square);
    if (piece && (allowFreeMove || piece.color === game.turn())) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  };

  const executeMove = (moveObj) => {
    try {
      const clonedGame = new Chess(game.fen());
      const moveResult = clonedGame.move(moveObj);
      if (moveResult) {
        if (clonedGame.isCheckmate() || clonedGame.isCheck()) {
          audioManager.playCheck();
        } else if (moveResult.captured) {
          audioManager.playCapture();
        } else {
          audioManager.playMove();
        }

        if (onMove) {
          onMove(moveResult, clonedGame.fen());
        }
      }
    } catch (err) {
      console.warn("Movimiento no permitido", err);
    }
  };

  const handleDragStart = (e, square) => {
    if (!interactive || animatingMove) return;
    const piece = game.get(square);
    if (piece && (allowFreeMove || piece.color === game.turn())) {
      setDraggedSquare(square);
      setSelectedSquare(square);
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', square);
      }
    }
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    if (!interactive || !draggedSquare || animatingMove) return;

    const moves = game.moves({ square: draggedSquare, verbose: true });
    let move = moves.find(m => m.to === targetSquare);

    // Soporte En Passant Intuitivo: si el usuario arrastra su peón directamente encima del peón enemigo (ej. f5 en lugar de f6)
    if (!move) {
      move = moves.find(m => 
        m.flags && m.flags.includes('e') && (
          (m.color === 'w' && targetSquare === `${m.to[0]}5`) ||
          (m.color === 'b' && targetSquare === `${m.to[0]}4`)
        )
      );
    }

    if (move) {
      executeMove({ from: draggedSquare, to: move.to, promotion: 'q' });
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isInQuadrant = (square) => {
    if (!hintQuadrant) return false;
    const file = square[0];
    const rank = parseInt(square[1]);
    
    if (hintQuadrant === 'kingside') return ['e', 'f', 'g', 'h'].includes(file);
    if (hintQuadrant === 'queenside') return ['a', 'b', 'c', 'd'].includes(file);
    if (hintQuadrant === 'center') return ['d', 'e'].includes(file) && [4, 5].includes(rank);
    if (hintQuadrant === 'white_camp') return rank <= 4;
    if (hintQuadrant === 'black_camp') return rank >= 5;
    return false;
  };

  const isKingInCheck = (square) => {
    if (!game.isCheck()) return false;
    const piece = game.get(square);
    return piece && piece.type === 'k' && piece.color === game.turn();
  };

  // Coordenadas para la pieza animada en vuelo ("Lift & Glide")
  const getFlyingCoords = () => {
    if (!animatingMove) return null;
    const fromFile = animatingMove.from[0];
    const fromRank = parseInt(animatingMove.from[1]);
    const toFile = animatingMove.to[0];
    const toRank = parseInt(animatingMove.to[1]);

    let fCol = fromFile.charCodeAt(0) - 97;
    let fRow = 8 - fromRank;
    let tCol = toFile.charCodeAt(0) - 97;
    let tRow = 8 - toRank;

    if (orientation === 'black') {
      fCol = 7 - fCol;
      fRow = 7 - fRow;
      tCol = 7 - tCol;
      tRow = 7 - tRow;
    }

    return {
      startX: fCol * 100,
      startY: fRow * 100,
      targetX: tCol * 100,
      targetY: tRow * 100
    };
  };

  const flyingCoords = getFlyingCoords();

  // Flecha direccional SVG sutil y translúcida
  const getMoveArrowCoords = () => {
    if (animatingMove || !lastMove || !lastMove.from || !lastMove.to) return null;
    const fromFile = lastMove.from[0];
    const fromRank = parseInt(lastMove.from[1]);
    const toFile = lastMove.to[0];
    const toRank = parseInt(lastMove.to[1]);

    let fCol = fromFile.charCodeAt(0) - 97;
    let fRow = 8 - fromRank;
    let tCol = toFile.charCodeAt(0) - 97;
    let tRow = 8 - toRank;

    if (orientation === 'black') {
      fCol = 7 - fCol;
      fRow = 7 - fRow;
      tCol = 7 - tCol;
      tRow = 7 - tRow;
    }

    const rawX1 = fCol * 12.5 + 6.25;
    const rawY1 = fRow * 12.5 + 6.25;
    const rawX2 = tCol * 12.5 + 6.25;
    const rawY2 = tRow * 12.5 + 6.25;

    const dx = rawX2 - rawX1;
    const dy = rawY2 - rawY1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;

    const startOffset = 2.2;
    const endOffset = 4.6;

    const x1 = rawX1 + (dx / dist) * startOffset;
    const y1 = rawY1 + (dy / dist) * startOffset;
    const x2 = rawX2 - (dx / dist) * endOffset;
    const y2 = rawY2 - (dy / dist) * endOffset;

    return { x1, y1, x2, y2 };
  };

  const arrowCoords = getMoveArrowCoords();

  return (
    <div className="chessboard-wrapper">
      <div className="chessboard-container" ref={boardRef} style={{ background: themeColors.border }}>
        <div className="board-grid" style={{ borderColor: themeColors.border, position: 'relative' }}>
          {displayRanks.map((rank, rIdx) =>
            displayFiles.map((file, fIdx) => {
              const square = `${file}${rank}`;
              const isLight = (rIdx + fIdx) % 2 === 0;
              const piece = game.get(square);
              const isSelected = validSelectedSquare === square;
              const isAnimatingSource = animatingMove && animatingMove.from === square;
              const isLastMoveFrom = !animatingMove && lastMove && lastMove.from === square;
              const isLastMoveTo = !animatingMove && lastMove && lastMove.to === square;
              const legalMove = activeLegalMoves.find(m => m.to === square);
              const isCheck = isKingInCheck(square);
              const isHint = hintSquare === square;
              const isQuad = isInQuadrant(square);

              const isDanger = Array.isArray(dangerSquares) && dangerSquares.includes(square);

              let squareClasses = `board-square ${isLight ? 'light' : 'dark'}`;
              if (isSelected) squareClasses += ' square-selected';
              if (isLastMoveFrom) squareClasses += ' last-move-from';
              if (isLastMoveTo) squareClasses += ' last-move-to';
              if (isCheck) squareClasses += ' square-check';
              if (isDanger) squareClasses += ' square-danger-threat';

              let bgStyle = isLight ? themeColors.light : themeColors.dark;
              if (isHint) bgStyle = '#fef08a';

              return (
                <div
                  key={square}
                  className={squareClasses}
                  style={{
                    backgroundColor: bgStyle,
                    boxShadow: isQuad ? 'inset 0 0 0 3px #f59e0b' : undefined
                  }}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                  data-square={square}
                >
                  {/* Coordenadas */}
                  {fIdx === 0 && (
                    <span className="square-coord rank" style={{ color: isLight ? themeColors.dark : themeColors.light }}>
                      {rank}
                    </span>
                  )}
                  {rIdx === 7 && (
                    <span className="square-coord file" style={{ color: isLight ? themeColors.dark : themeColors.light }}>
                      {file}
                    </span>
                  )}

                  {/* Indicador de jugada legal (si está habilitado en los ajustes) */}
                  {shouldShowLegalMoves && legalMove && !piece && (
                    legalMove.flags && legalMove.flags.includes('e') 
                      ? <div className="legal-capture-ring" title="Captura al paso" /> 
                      : <div className="legal-dot" />
                  )}
                  {shouldShowLegalMoves && legalMove && piece && <div className="legal-capture-ring" />}

                  {/* Indicador visual de Alerta de Peligro (Pieza amenazada por el rival) */}
                  {isDanger && piece && <div className="danger-threat-indicator" title="¡Pieza amenazada por el rival!" />}

                  {/* Pieza en el tablero (oculta en el origen durante el vuelo) */}
                  {piece && !isAnimatingSource && (
                    <div
                      draggable={interactive && !animatingMove && (allowFreeMove || piece.color === game.turn())}
                      onDragStart={(e) => handleDragStart(e, square)}
                      className={`chess-piece ${draggedSquare === square ? 'dragging' : ''}`}
                      style={{ position: 'relative', zIndex: 4 }}
                    >
                      <PieceIcon piece={piece.type} color={piece.color} />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Pieza en Elevación y Vuelo Animado ("Lift and Glide") */}
          {animatingMove && flyingCoords && (
            <div
              className="flying-piece-container"
              style={{
                '--startX': `${flyingCoords.startX}%`,
                '--startY': `${flyingCoords.startY}%`,
                '--targetX': `${flyingCoords.targetX}%`,
                '--targetY': `${flyingCoords.targetY}%`
              }}
            >
              <PieceIcon piece={animatingMove.piece.type} color={animatingMove.piece.color} />
            </div>
          )}

          {/* Flecha Direccional SVG Sutil y Translúcida (Z-Index 2 por detrás de las piezas) */}
          {arrowCoords && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              <defs>
                <marker
                  id="move-arrow"
                  markerWidth="5"
                  markerHeight="5"
                  refX="3.5"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 5 2.5, 0 5" fill="rgba(245, 158, 11, 0.45)" />
                </marker>
              </defs>
              <line
                x1={`${arrowCoords.x1}%`}
                y1={`${arrowCoords.y1}%`}
                x2={`${arrowCoords.x2}%`}
                y2={`${arrowCoords.y2}%`}
                stroke="rgba(245, 158, 11, 0.45)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                markerEnd="url(#move-arrow)"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
