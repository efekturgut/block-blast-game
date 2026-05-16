import Cell from "./Cell";

const Board = ({
  board = [],
  previewCells = [],
  invalidPreviewCells = [],
  clearingCells = [],
  previewColor,
  onBlockDragOver,
  onBlockDragLeave,
  onBlockDrop,
}) => {
  const isPreviewCell = (row, col) => {
    return previewCells.some((cell) => cell.row === row && cell.col === col);
  };

  const isInvalidPreviewCell = (row, col) => {
    return invalidPreviewCells.some(
      (cell) => cell.row === row && cell.col === col
    );
  };

  const isClearingCell = (row, col) => {
    return clearingCells.some((cell) => cell.row === row && cell.col === col);
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            rowIndex={rowIndex}
            colIndex={colIndex}
            previewColor={isPreviewCell(rowIndex, colIndex) ? previewColor : null}
            isInvalidPreview={isInvalidPreviewCell(rowIndex, colIndex)}
            isClearing={isClearingCell(rowIndex, colIndex)}
            onDragOver={(e) => onBlockDragOver(e, rowIndex, colIndex)}
            onDragLeave={onBlockDragLeave}
            onDrop={(e) => onBlockDrop(e, rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;