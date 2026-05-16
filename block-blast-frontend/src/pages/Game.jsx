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

  const createBlockInstance = (shape, index) => {
  return {
    ...shape,
    instanceId: `${shape.id}-${Date.now()}-${Math.random()}-${index}`,
  };
};

const canBlockFitAnywhereOnBoard = (block, currentBoard) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cells = [];

      for (let shapeRow = 0; shapeRow < block.shape.length; shapeRow++) {
        for (
          let shapeCol = 0;
          shapeCol < block.shape[shapeRow].length;
          shapeCol++
        ) {
          if (block.shape[shapeRow][shapeCol] === 1) {
            cells.push({
              row: row + shapeRow,
              col: col + shapeCol,
            });
          }
        }
      }

      const canFit = cells.every(
        (cell) =>
          cell.row >= 0 &&
          cell.row < 8 &&
          cell.col >= 0 &&
          cell.col < 8 &&
          currentBoard[cell.row][cell.col] === 0
      );

      if (canFit) {
        return true;
      }
    }
  }

  return false;
};

const getPlayableBlocks = (currentBoard) => {
  return blockShapes.filter((block) =>
    canBlockFitAnywhereOnBoard(block, currentBoard)
  );
};

const getSmartBlocks = (currentBoard) => {
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

  const playableBlocks = getPlayableBlocks(currentBoard);

  if (playableBlocks.length === 0) {
    return [];
  }

  const shouldTryComboSet = Math.random() < 0.55;

  if (shouldTryComboSet) {
    const shuffledComboSets = [...comboSets].sort(() => Math.random() - 0.5);

    for (const comboSet of shuffledComboSets) {
      const comboBlocks = comboSet
        .map((id) => blockShapes.find((block) => block.id === id))
        .filter(Boolean);

      const hasAtLeastOnePlayableBlock = comboBlocks.some((block) =>
        canBlockFitAnywhereOnBoard(block, currentBoard)
      );

      if (hasAtLeastOnePlayableBlock) {
        return comboBlocks.map((shape, index) =>
          createBlockInstance(shape, index)
        );
      }
    }
  }

  const shuffledPlayableBlocks = [...playableBlocks].sort(
    () => Math.random() - 0.5
  );

  const selectedBlocks = [];

  selectedBlocks.push(shuffledPlayableBlocks[0]);

  const otherBlocks = [...blockShapes].sort(() => Math.random() - 0.5);

  for (const block of otherBlocks) {
    if (selectedBlocks.length === 3) break;

    selectedBlocks.push(block);
  }

  return selectedBlocks.map((shape, index) =>
    createBlockInstance(shape, index)
  );
};


  const [board, setBoard] = useState(createEmptyBoard());
const [availableBlocks, setAvailableBlocks] = useState(() =>
  getSmartBlocks(createEmptyBoard())
);
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
  if (blocks.length === 0) {
    playGameOverSound();
    setIsGameOver(true);
    return;
  }

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
  const finalBoard = currentBoard.map((row) => [...row]);

  const fullRows = [];
  const fullCols = [];

  for (let row = 0; row < 8; row++) {
    const isFullRow = finalBoard[row].every((cell) => cell !== 0);

    if (isFullRow) {
      fullRows.push(row);
    }
  }

  for (let col = 0; col < 8; col++) {
    let isFullCol = true;

    for (let row = 0; row < 8; row++) {
      if (finalBoard[row][col] === 0) {
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
    return currentBoard;
  }

  playClearSound();

  setClearingCells(cellsToClear);

  for (const cell of cellsToClear) {
    finalBoard[cell.row][cell.col] = 0;
  }

  const isBoardCompletelyEmpty = finalBoard.every((row) =>
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
    setBoard(finalBoard);
  }, 260);

  return finalBoard;
};

const placeBlock = (block, startRow, startCol) => {
  const newBoard = board.map((row) => [...row]);
  const cells = getBlockCells(block, startRow, startCol);

  for (const cell of cells) {
    newBoard[cell.row][cell.col] = block.color;
  }

  playPlaceSound();

  setScore((prevScore) => prevScore + cells.length);

  setBoard(newBoard);

  const finalBoard = clearFullLines(newBoard);

  return finalBoard;
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
  updatedBlocks = getSmartBlocks(updatedBoard);
}
      setTimeout(() => {

        checkGameOver(updatedBlocks, updatedBoard);
      }, 0);

      return updatedBlocks;
    });
  };
const handleTouchDrop = (droppedBlock, rowIndex, colIndex) => {
  if (isGameOver) return;

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
      updatedBlocks = getSmartBlocks(updatedBoard);
    }

    setTimeout(() => {
      checkGameOver(updatedBlocks, updatedBoard);
    }, 0);

    return updatedBlocks;
  });
};






const handleRestartGame = () => {
  setBoard(createEmptyBoard());
 setAvailableBlocks(getSmartBlocks(createEmptyBoard()));
  setScore(0);
  setIsGameOver(false);
  setBonusText("");
  clearPreview();
};
  return (
    <main className="game-page">
      <h1>Nazlı'nın Blokları</h1>

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

        {!isGameOver && (
  <BlockTray blocks={availableBlocks} onTouchDrop={handleTouchDrop} />
)}

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