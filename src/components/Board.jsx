import Cell from "./Cell";

const Board = ({ board = [] }) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
          />
        ))
      )}
    </div>
  );
};

export default Board;