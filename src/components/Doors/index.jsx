import React, { useState, useEffect, useRef } from "react";
import './index.scss';

const Doors = ({ doors, selected, amountHidden, amountRevealed }) => {

  return (
    <div className="doors">
      {doors.map((door, index) => (
        <div
          key={door.id}
          className={`doors-door ${selected === index ? 'selected' : ''} ${door.open ? 'open' : ''}`}
          style={{ maxWidth: `${100 / doors.length}%` }}
        >
          <h1>Door #{index + 1}</h1>
          <p>{door.hasPrize ? '⭐️' : '❌'}</p>
        </div>
      ))}
    </div>
  )


}

export default Doors;