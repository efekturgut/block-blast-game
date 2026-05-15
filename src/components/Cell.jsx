const Cell = ({ value }) => {
  return (
    <div className={`cell ${value === 1 ? "filled" : ""}`}></div>
  );
};

export default Cell;