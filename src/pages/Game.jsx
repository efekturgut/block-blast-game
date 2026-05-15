import { useState } from "react";
import Board from "../components/Board";

const Game = () => {
  const createEmptyBoard = () => {
    return Array.from({ length: 8 }, () => Array(8).fill(0));
  };

  const [board, setBoard] = useState(createEmptyBoard());

  return (
    <main className="game-page">
      <h1>Block Blast</h1>

      <div className="game-container">
        <Board board={board} />
      </div>
    </main>
  );
};

export default Game;