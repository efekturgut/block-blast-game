import React from 'react'
import Cell from './Cell'

export default function Board({ cells, onCellClick }) {
  return (
    <div className="board">
      {cells.map((cell, index) => (
        <Cell key={index} value={cell} onClick={() => onCellClick(index)} />
      ))}
    </div>
  )
}
