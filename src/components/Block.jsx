const Block = ({ block }) => {
  let dragGhost = null;

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

    dragGhost = document.createElement("div");
    dragGhost.className = "drag-ghost-board";

    dragGhost.style.gridTemplateColumns = `repeat(${block.shape[0].length}, 52px)`;
    dragGhost.style.gridTemplateRows = `repeat(${block.shape.length}, 52px)`;

    block.shape.forEach((row) => {
      row.forEach((cell) => {
        const ghostCell = document.createElement("div");

        ghostCell.className =
          cell === 1
            ? `drag-ghost-cell ${block.color}`
            : "drag-ghost-cell empty";

        dragGhost.appendChild(ghostCell);
      });
    });

    document.body.appendChild(dragGhost);

    const fullCellSize = 58;

    e.dataTransfer.setDragImage(
      dragGhost,
      offsetCol * fullCellSize + 26,
      offsetRow * fullCellSize + 26
    );
  };

  const handleDragEnd = () => {
    const ghosts = document.querySelectorAll(".drag-ghost-board");

    ghosts.forEach((ghost) => {
      ghost.remove();
    });
  };

  return (
    <div
      className="block"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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