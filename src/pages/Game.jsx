import { useState } from "react";
import Board from "../components/Board";
import BlockTray from "../components/BlockTray";
import { blockShapes } from "../data/blockShapes";

const Game = () => {
  const createEmptyBoard = () => {
    return Array.from({ length: 8 }, () => Array(8).fill(0));
  };

  const [board, setBoard] = useState(createEmptyBoard());

  const [availableBlocks, setAvailableBlocks] = useState([
    blockShapes[0],
    blockShapes[1],
    blockShapes[2],
  ]);

  const [selectedBlock, setSelectedBlock] = useState(null);

  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
  };

  return (
    <main className="game-page">
      <h1>Block Blast</h1>

      <div className="game-container">
        <Board board={board} />

        <BlockTray
          blocks={availableBlocks}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
        />
      </div>
    </main>
  );
};

export default Game;