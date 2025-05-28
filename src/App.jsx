import React, { useRef, useEffect, useState } from 'react';
import Doors from './components/Doors';
import Score from './components/Score';
import { shuffle } from './utils';

import './index.scss';

function App() {
  const [currentAction, setCurrentAction] = useState('');
  const [results, setResults] = useState([])
  const [speed, setSpeed] = useState(1000);
  const [amountHidden, setAmountHidden] = useState(4);
  const [amountRevealed, setAmountRevealed] = useState(2);

  const amountOfSteps = 5;
  const selected = useRef();
  const doors = useRef([]);
  const playInterval = useRef();

  const startRound = async () => {
    setCurrentAction('start a new round');
    return new Promise((resolve) => {
      doors.current = shuffle(Array.from({ length: amountHidden }, (_, i) => (
        {
          id: `door-${i}`,
          hasPrize: i === 0,
          open: false,
          chosen: false
        }
      )));
      selected.current = null;
      setTimeout(resolve, speed);
    });
  }

  const chooseDoor = async () => {
    setCurrentAction('player picks a door');
    return new Promise((resolve) => {
      selected.current = Math.floor(Math.random() * amountHidden);
      setTimeout(resolve, speed);
    });
  }

  const revealNonWinning = async () => {
    setCurrentAction('reveal n non-winning doors');
    return new Promise((resolve) => {
      let revealed = 0;
      while (revealed < amountRevealed) {
        let doorToOpen = Math.floor(Math.random() * amountHidden);
        while (doors.current[doorToOpen].hasPrize || doorToOpen === selected.current) {
          doorToOpen = Math.floor(Math.random() * amountHidden);
        }
        doors.current[doorToOpen].open = true;
        revealed += 1;
      }
      setTimeout(resolve, speed);
    })
  }

  const changeChoice = async () => {
    setCurrentAction('switching or staying:')
    return new Promise((resolve) => {
      if (Math.random() > .5) {
        setCurrentAction('switching or staying: switching');
        selected.current = doors.current.findIndex((door, index) => !door.open && index !== selected);
      } else {
        setCurrentAction('switching or staying: staying');
      }
      setTimeout(resolve, speed);
    })
  }

  const finishRound = async () => {
    setCurrentAction('ending round:');
    return new Promise((resolve) => {
      doors.current.forEach(door => {
        door.open = true;
      });
      if (doors.current[selected.current].hasPrize) {
        setCurrentAction('ending round: player won!');
      }
      else {
        setCurrentAction('ending round: player lost');
      }

      setTimeout(resolve, speed);
    })
  }

  const playGame = async () => {
    await startRound();
    await chooseDoor();
    await revealNonWinning();
    await changeChoice();
    await finishRound();
  }

  useEffect(() => {
    playInterval.current = setInterval(playGame, (speed * (amountOfSteps + 1)))
    playGame();
    return (() => {
      clearInterval(playInterval.current);
    })
  }, [])

  return (
    <div className="app">
      <h1 className="action">{currentAction}</h1>
      <Doors
        doors={doors.current}
        selected={selected.current}
        amountHidden={amountHidden}
        amountRevealed={amountRevealed}
      />
      <Score
        results={results}
      />
    </div>
  );
}

export default App;
