const Cell = ({
  value,
  previewColor,
  isInvalidPreview,
  isClearing,
  onDrop,
  onDragOver,
  onDragLeave,
}) => {
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

  if (isClearing) {
    className += " clearing";
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