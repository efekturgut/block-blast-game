const Block = ({ block }) => {
  const handleDragStart = (e) => {
    const targetCell = e.target.closest(".block-cell");

    const offsetRow = Number(targetCell?.dataset.row || 0);
    const offsetCol = Number(targetCell?.dataset.col || 0);

    e.dataTransfer.setData(
      "block",
      JSON.stringify({
        ...block,
        offsetRow,
        offsetCol,
      })
    );

    const blockGrid = e.currentTarget.querySelector(".block-grid");
    const dragGhost = blockGrid.cloneNode(true);

    dragGhost.classList.add("drag-ghost");
    document.body.appendChild(dragGhost);

    const cellSize = 36;

    e.dataTransfer.setDragImage(
      dragGhost,
      offsetCol * cellSize + 16,
      offsetRow * cellSize + 16
    );

    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  return (
    <div className="block" draggable onDragStart={handleDragStart}>
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
              data-row={rowIndex}
              data-col={colIndex}
              className={`block-cell ${cell === 1 ? block.color : "empty"}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Block;