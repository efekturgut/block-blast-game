const Block = ({ block, isSelected, onSelect }) => {
  return (
    <div
      className={`block ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(block)}
    >
      <div
        className="block-grid"
        style={{
          gridTemplateColumns: `repeat(${block.shape[0].length}, 32px)`,
          gridTemplateRows: `repeat(${block.shape.length}, 32px)`,
        }}
      >
        {block.shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`block-cell ${cell === 1 ? block.color : "empty"}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Block;