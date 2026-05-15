import { useState } from "react";
import Board from "../components/Board";
import BlockTray from "../components/BlockTray";
import { blockShapes } from "../data/blockShapes";

const Game = () => {
  const createEmptyBoard = () => {
    return Array.from({ length: 8 }, () => Array(8).fill(0));
  };

  const getRandomBlocks = () => {
    const shuffled = [...blockShapes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const [board, setBoard] = useState(createEmptyBoard());
  const [availableBlocks, setAvailableBlocks] = useState(getRandomBlocks());

  const [previewCells, setPreviewCells] = useState([]);
  const [invalidPreviewCells, setInvalidPreviewCells] = useState([]);
  const [previewColor, setPreviewColor] = useState(null);

  const getBlockCells = (block, startRow, startCol) => {
    const cells = [];

    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col] === 1) {
          cells.push({
            row: startRow + row,
            col: startCol + col,
          });
        }
      }
    }

    return cells;
  };

  const canPlaceBlock = (block, startRow, startCol) => {
    const cells = getBlockCells(block, startRow, startCol);

    for (const cell of cells) {
      if (
        cell.row < 0 ||
        cell.row >= 8 ||
        cell.col < 0 ||
        cell.col >= 8 ||
        board[cell.row][cell.col] !== 0
      ) {
        return false;
      }
    }

    return true;
  };

  const placeBlock = (block, startRow, startCol) => {
    const newBoard = board.map((row) => [...row]);
    const cells = getBlockCells(block, startRow, startCol);

    for (const cell of cells) {
      newBoard[cell.row][cell.col] = block.color;
    }

    setBoard(newBoard);
  };

  const clearPreview = () => {
    setPreviewCells([]);
    setInvalidPreviewCells([]);
    setPreviewColor(null);
  };

const handleBlockDragOver = (e, rowIndex, colIndex) => {
  e.preventDefault();

  const blockData = e.dataTransfer.getData("block");
  if (!blockData) return;

  const draggedBlock = JSON.parse(blockData);

  const startRow = rowIndex - draggedBlock.offsetRow;
  const startCol = colIndex - draggedBlock.offsetCol;

  const cells = getBlockCells(draggedBlock, startRow, startCol);
  const canPlace = canPlaceBlock(draggedBlock, startRow, startCol);

  if (canPlace) {
    setPreviewCells(cells);
    setInvalidPreviewCells([]);
    setPreviewColor(draggedBlock.color);
  } else {
    setPreviewCells([]);
    setInvalidPreviewCells(cells);
    setPreviewColor(null);
  }
};

  const handleBlockDragLeave = () => {
    // Çok hızlı temizlemesin diye boş bırakıyoruz.
    // Drop veya yeni dragOver zaten preview'i güncelliyor.
  };
const handleBlockDrop = (e, rowIndex, colIndex) => {
  e.preventDefault();

  const blockData = e.dataTransfer.getData("block");
  if (!blockData) return;

  const droppedBlock = JSON.parse(blockData);

  const startRow = rowIndex - droppedBlock.offsetRow;
  const startCol = colIndex - droppedBlock.offsetCol;

  const canPlace = canPlaceBlock(droppedBlock, startRow, startCol);

  if (!canPlace) {
    clearPreview();
    return;
  }

  placeBlock(droppedBlock, startRow, startCol);
  clearPreview();

  setAvailableBlocks((prevBlocks) => {
    const updatedBlocks = prevBlocks.filter(
      (block) => block.id !== droppedBlock.id
    );

    if (updatedBlocks.length === 0) {
      return getRandomBlocks();
    }

    return updatedBlocks;
  });
};

  return (
    <main className="game-page">
      <h1>Block Blast</h1>

      <div className="game-container">
        <Board
          board={board}
          previewCells={previewCells}
          invalidPreviewCells={invalidPreviewCells}
          previewColor={previewColor}
          onBlockDragOver={handleBlockDragOver}
          onBlockDragLeave={handleBlockDragLeave}
          onBlockDrop={handleBlockDrop}
        />

        <BlockTray blocks={availableBlocks} />
      </div>
    </main>
  );
};

export default Game;