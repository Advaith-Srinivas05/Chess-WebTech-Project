import React, { useMemo, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import Chess from 'chess.js';
import Engine from './engine';
import './css/PlayComputer.css';

const PlayVsStockfish = () => {
  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 18
  };

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const chessboardRef = useRef(null);

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5) || "q"
        });
        setGamePosition(game.fen());
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q"
    });

    if (move === null) return false;
    setGamePosition(game.fen());

    if (!game.game_over() && !game.in_draw()) {
      const newTimeout = setTimeout(findBestMove, 2000); // Find best move after 2 seconds
      setCurrentTimeout(newTimeout);
    }

    return true;
  }

  const customPieces = useMemo(() => {
    const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
    const pieceComponents = {};
    pieces.forEach(piece => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/img/chesspieces/${piece}.png)`,
            backgroundSize: "100%"
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  return (
    <div className="board-wrapper">
      <Chessboard
        id="PlayVsStockfish"
        arePremovesAllowed={true} // Enable premoves
        position={gamePosition}
        isDraggablePiece={({ piece }) => piece[0] === "w"} // White pieces are draggable
        onPieceDrop={onDrop}
        boardWidth={550}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
        }}
        customDarkSquareStyle={{
          backgroundColor: "#779952"
        }}
        customLightSquareStyle={{
          backgroundColor: "#edeed1"
        }}
        customPieces={customPieces}
        ref={chessboardRef} // Chessboard ref for clearing premoves
      />

      <div className="button-container">
        {Object.entries(levels).map(([level, depth]) => (
          <button
            key={level}
            id={`button-${level.replace(/\s/g, '').toLowerCase()}`}
            className={`button ${depth === stockfishLevel ? 'button-active' : ''}`}
            onClick={() => setStockfishLevel(depth)}
          >
            {level}
          </button>
        ))}

        <button
          id='button-new'
          className="button"
          onClick={() => {
            game.reset();
            setGamePosition(game.fen());
            chessboardRef.current?.clearPremoves(); // Clear premoves
            clearTimeout(currentTimeout); // Clear any timeouts
          }}
        >
          New Game
        </button>

        <button
          id='button-undo'
          className="button"
          onClick={() => {
            game.undo();
            game.undo(); // Undo twice to undo computer's move
            setGamePosition(game.fen());
            chessboardRef.current?.clearPremoves(); // Clear premoves
            clearTimeout(currentTimeout); // Clear any timeouts
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default PlayVsStockfish;
