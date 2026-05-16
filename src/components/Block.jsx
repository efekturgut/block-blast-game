import { useRef } from "react";

const Block = ({ block, onTouchDrop }) => {
  const ghostRef = useRef(null);
  const frameRef = useRef(null);

  const getCssNumber = (variableName, fallback) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .replace("px", "")
      .trim();

    return Number(value) || fallback;
  };

  const getCellValues = () => {
    const cellSize = getCssNumber("--cell-size", 52);
    const cellGap = getCssNumber("--cell-gap", 6);

    return {
      cellSize,
      cellGap,
      cellWithGap: cellSize + cellGap,
      halfCell: cellSize / 2,
    };
  };

  const removeAllGhosts = () => {
    document.querySelectorAll(".touch-drag-ghost, .drag-ghost").forEach((el) => {
      el.remove();
    });

    ghostRef.current = null;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const createGhost = (className) => {
    removeAllGhosts();

    const { cellSize, cellGap } = getCellValues();

    const ghost = document.createElement("div");
    ghost.className = className;

    ghost.style.display = "grid";
    ghost.style.gap = `${cellGap}px`;
    ghost.style.gridTemplateColumns = `repeat(${block.shape[0].length}, ${cellSize}px)`;
    ghost.style.gridTemplateRows = `repeat(${block.shape.length}, ${cellSize}px)`;

    block.shape.forEach((row) => {
      row.forEach((cell) => {
        const ghostCell = document.createElement("div");

        ghostCell.className =
          cell === 1
            ? `ghost-cell ${block.color}`
            : "ghost-cell empty";

        ghostCell.style.width = `${cellSize}px`;
        ghostCell.style.height = `${cellSize}px`;
        ghostCell.style.borderRadius = cellSize <= 38 ? "9px" : "12px";

        ghost.appendChild(ghostCell);
      });
    });

    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    return ghost;
  };

  const moveGhost = (ghost, x, y, offsetRow, offsetCol) => {
    const { cellWithGap, halfCell } = getCellValues();

    const nextX = x - offsetCol * cellWithGap - halfCell;
    const nextY = y - offsetRow * cellWithGap - halfCell;

    ghost.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
  };

  const getOffsets = (target) => {
    const targetCell = target.closest(".block-cell");

    return {
      offsetRow: Number(targetCell?.dataset.row || 0),
      offsetCol: Number(targetCell?.dataset.col || 0),
    };
  };

  const handleDragStart = (e) => {
    const { offsetRow, offsetCol } = getOffsets(e.target);

    e.dataTransfer.setData(
      "block",
      JSON.stringify({
        ...block,
        offsetRow,
        offsetCol,
      })
    );

    const ghost = createGhost("drag-ghost");
    const { cellWithGap, halfCell } = getCellValues();

    e.dataTransfer.setDragImage(
      ghost,
      offsetCol * cellWithGap + halfCell,
      offsetRow * cellWithGap + halfCell
    );

    setTimeout(() => {
      removeAllGhosts();
    }, 0);
  };

  const handleDragEnd = () => {
    removeAllGhosts();
  };

  const handlePointerDown = (e) => {
    if (e.pointerType !== "touch") return;

    e.preventDefault();
    e.stopPropagation();

    const { offsetRow, offsetCol } = getOffsets(e.target);

    const draggedBlock = {
      ...block,
      offsetRow,
      offsetCol,
    };

    const ghost = createGhost("touch-drag-ghost");
    moveGhost(ghost, e.clientX, e.clientY, offsetRow, offsetCol);

    const handlePointerMove = (moveEvent) => {
      moveEvent.preventDefault();

      const x = moveEvent.clientX;
      const y = moveEvent.clientY;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        moveGhost(ghost, x, y, offsetRow, offsetCol);
      });
    };

    const finishTouchDrag = (upEvent) => {
      upEvent.preventDefault();

      ghost.style.display = "none";

      const targetElement = document.elementFromPoint(
        upEvent.clientX,
        upEvent.clientY
      );

      const targetCellElement = targetElement?.closest(".cell");

      if (targetCellElement) {
        const rowIndex = Number(targetCellElement.dataset.row);
        const colIndex = Number(targetCellElement.dataset.col);

        onTouchDrop(draggedBlock, rowIndex, colIndex);
      }

      removeAllGhosts();

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishTouchDrag);
      window.removeEventListener("pointercancel", cancelTouchDrag);
    };

    const cancelTouchDrag = () => {
      removeAllGhosts();

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishTouchDrag);
      window.removeEventListener("pointercancel", cancelTouchDrag);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });

    window.addEventListener("pointerup", finishTouchDrag, {
      passive: false,
    });

    window.addEventListener("pointercancel", cancelTouchDrag, {
      passive: false,
    });
  };

  return (
    <div
      className="block"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
    >
      <div
        className="block-grid"
        style={{
          gridTemplateColumns: `repeat(${block.shape[0].length}, var(--tray-cell-size))`,
          gridTemplateRows: `repeat(${block.shape.length}, var(--tray-cell-size))`,
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