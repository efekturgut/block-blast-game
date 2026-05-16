import { useState } from "react";
import Board from "../components/Board";
import BlockTray from "../components/BlockTray";
import { blockShapes } from "../data/blockShapes";
import {
  playPlaceSound,
  playClearSound,
  playFullClearSound,
  playGameOverSound,
} from "../utils/soundEffects";

const Game = () => {
  const createEmptyBoard = () => {
    return Array.from({ length: 8 }, () => Array(8).fill(0));
  };

  const getRandomBlocks = () => {
    const comboSets = [
      [10, 10, 11],
      [10, 12, 4],
      [1, 11, 13],
      [8, 13, 4],
      [9, 5, 4],
      [3, 6, 4],
      [12, 11, 1],
      [14, 15, 4],
    ];

    const shouldUseComboSet = Math.random() < 0.55;

    if (shouldUseComboSet) {
      const randomSet =
        comboSets[Math.floor(Math.random() * comboSets.length)];

      return randomSet.map((id, index) => {
        const shape = blockShapes.find((block) => block.id === id);

        return {
          ...shape,
          instanceId: `${shape.id}-${Date.now()}-${index}`,
        };
      });
    }

    const shuffled = [...blockShapes].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 3).map((shape, index) => ({
      ...shape,
      instanceId: `${shape.id}-${Date.now()}-${index}`,
    }));
  };

  const [board, setBoard] = useState(createEmptyBoard());
  const [availableBlocks, setAvailableBlocks] = useState(getRandomBlocks());
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const [previewCells, setPreviewCells] = useState([]);
  const [invalidPreviewCells, setInvalidPreviewCells] = useState([]);
  const [previewColor, setPreviewColor] = useState(null);

  const [bonusText, setBonusText] = useState("");
  const [clearingCells, setClearingCells] = useState([]);

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

  const canPlaceBlock = (block, startRow, startCol, currentBoard = board) => {
    const cells = getBlockCells(block, startRow, startCol);

    for (const cell of cells) {
      if (
        cell.row < 0 ||
        cell.row >= 8 ||
        cell.col < 0 ||
        cell.col >= 8 ||
        currentBoard[cell.row][cell.col] !== 0
      ) {
        return false;
      }
    }

    return true;
  };

  const canPlaceBlockAnywhere = (block, currentBoard) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (canPlaceBlock(block, row, col, currentBoard)) {
          return true;
        }
      }
    }

    return false;
  };

  const checkGameOver = (blocks, currentBoard) => {
    const hasMove = blocks.some((block) =>
      canPlaceBlockAnywhere(block, currentBoard)
    );

    if (!hasMove) {
        playGameOverSound();
      setIsGameOver(true);
    }
  };

  const showBonusText = (text) => {
    setBonusText(text);

    setTimeout(() => {
      setBonusText("");
    }, 1200);
  };

 const clearFullLines = (currentBoard) => {
  const newBoard = currentBoard.map((row) => [...row]);

  const fullRows = [];
  const fullCols = [];

  for (let row = 0; row < 8; row++) {
    const isFullRow = newBoard[row].every((cell) => cell !== 0);

    if (isFullRow) {
      fullRows.push(row);
    }
  }

  for (let col = 0; col < 8; col++) {
    let isFullCol = true;

    for (let row = 0; row < 8; row++) {
      if (newBoard[row][col] === 0) {
        isFullCol = false;
        break;
      }
    }

    if (isFullCol) {
      fullCols.push(col);
    }
  }

  const cellsToClear = [];

  for (const row of fullRows) {
    for (let col = 0; col < 8; col++) {
      cellsToClear.push({ row, col });
    }
  }

  for (const col of fullCols) {
    for (let row = 0; row < 8; row++) {
      const alreadyAdded = cellsToClear.some(
        (cell) => cell.row === row && cell.col === col
      );

      if (!alreadyAdded) {
        cellsToClear.push({ row, col });
      }
    }
  }

  if (cellsToClear.length === 0) {
    return newBoard;
  }

playClearSound();
  setClearingCells(cellsToClear);

  for (const cell of cellsToClear) {
    newBoard[cell.row][cell.col] = 0;
  }

  const isBoardCompletelyEmpty = newBoard.every((row) =>
    row.every((cell) => cell === 0)
  );

  setScore((prevScore) => {
    let extraScore = cellsToClear.length * 10;

    if (isBoardCompletelyEmpty) {
      extraScore += 500;
    }

    return prevScore + extraScore;
  });

  if (isBoardCompletelyEmpty) {
      playFullClearSound();
    showBonusText("FULL CLEAR +500");
  }

  setTimeout(() => {
    setClearingCells([]);
    setBoard(newBoard);
  }, 260);

  return currentBoard;
};

const placeBlock = (block, startRow, startCol) => {
  let newBoard = board.map((row) => [...row]);
  const cells = getBlockCells(block, startRow, startCol);
for (const cell of cells) {
  newBoard[cell.row][cell.col] = block.color;
}

playPlaceSound();

setScore((prevScore) => prevScore + cells.length);

  const boardAfterClearCheck = clearFullLines(newBoard);

  setBoard(boardAfterClearCheck);
  return boardAfterClearCheck;
};
  const clearPreview = () => {
    setPreviewCells([]);
    setInvalidPreviewCells([]);
    setPreviewColor(null);
  };

  const handleBlockDragOver = (e, rowIndex, colIndex) => {
    e.preventDefault();

    if (isGameOver) return;

    const blockData = e.dataTransfer.getData("block");
    if (!blockData) return;

    const draggedBlock = JSON.parse(blockData);

    const startRow = rowIndex - (draggedBlock.offsetRow || 0);
    const startCol = colIndex - (draggedBlock.offsetCol || 0);

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
    // Drag sırasında titreme olmasın diye boş bırakıyoruz.
  };

  const handleBlockDrop = (e, rowIndex, colIndex) => {
    e.preventDefault();

    if (isGameOver) return;

    const blockData = e.dataTransfer.getData("block");
    if (!blockData) return;

    const droppedBlock = JSON.parse(blockData);

    const startRow = rowIndex - (droppedBlock.offsetRow || 0);
    const startCol = colIndex - (droppedBlock.offsetCol || 0);

    const canPlace = canPlaceBlock(droppedBlock, startRow, startCol);

    if (!canPlace) {
      clearPreview();
      return;
    }

    const updatedBoard = placeBlock(droppedBlock, startRow, startCol);
    clearPreview();

    setAvailableBlocks((prevBlocks) => {
      let updatedBlocks = prevBlocks.filter(
        (block) => block.instanceId !== droppedBlock.instanceId
      );

      if (updatedBlocks.length === 0) {
        updatedBlocks = getRandomBlocks();
      }

      setTimeout(() => {

        checkGameOver(updatedBlocks, updatedBoard);
      }, 0);

      return updatedBlocks;
    });
  };
const handleRestartGame = () => {
  setBoard(createEmptyBoard());
  setAvailableBlocks(getRandomBlocks());
  setScore(0);
  setIsGameOver(false);
  setBonusText("");
  clearPreview();
};
  return (
    <main className="game-page">
      <h1>Block Blast</h1>

      <div className="score-box">
        <span>Skor</span>
        <strong>{score}</strong>
      </div>

      {bonusText && <div className="bonus-text">{bonusText}</div>}

      <div className="game-container">
        <Board
          board={board}
          previewCells={previewCells}
          invalidPreviewCells={invalidPreviewCells}
           clearingCells={clearingCells}
          previewColor={previewColor}
          onBlockDragOver={handleBlockDragOver}
          onBlockDragLeave={handleBlockDragLeave}
          onBlockDrop={handleBlockDrop}
        />

        {!isGameOver && <BlockTray blocks={availableBlocks} />}

       {isGameOver && (
  <div className="game-over-box">
    <h2>Oyun Bitti</h2>
    <p>Skorun: {score}</p>

    <button className="restart-game-btn" onClick={handleRestartGame}>
      Tekrar Başla
    </button>
  </div>
)}
      </div>
    </main>
  );
};

export default Game;