const Cell = ({ value, previewColor, isInvalidPreview, onDrop, onDragOver, onDragLeave }) => {
  let className = "cell";

  if (value !== 0) {
    className += ` filled ${value}`;
  }

  if (previewColor) {
    className += ` preview ${previewColor}`;
  }

  if (isInvalidPreview) {
    className += " invalid-preview";
  }

  return (
    <div
      className={className}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    ></div>
  );
};

export default Cell;