import React, { useRef, useEffect, useState } from 'react';
import Doors from './components/Doors';
import Results from './components/Results';
import { shuffle } from './utils';

import './index.scss';

function App() {
  const [currentAction, setCurrentAction] = useState('');
  const [speed, setSpeed] = useState(3000);
  const [amountHidden, setAmountHidden] = useState(3);
  const [amountRevealed, setAmountRevealed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const amountOfSteps = 5;

  const selected = useRef(null);
  const switched = useRef(false);
  const doors = useRef([]);
  const results = useRef([]);
  const playInterval = useRef();

  const startRound = async () => {
    setCurrentAction('start a new round');
    return new Promise(resolve => {
      doors.current = shuffle(
        Array.from({ length: amountHidden }, (_, i) => ({
          id: `door-${i}`,
          hasPrize: i === 0,
          open: false,
          chosen: false,
        }))
      );
      selected.current = null;
      setTimeout(resolve, speed || 50);
    });
  };

  const chooseDoor = async () => {
    setCurrentAction('player picks a door');
    return new Promise(resolve => {
      selected.current = Math.floor(Math.random() * amountHidden);
      setTimeout(resolve, speed || 50);
    });
  };

  const revealNonWinning = async () => {
    setCurrentAction(`reveal ${amountRevealed} non-winning doors`);
    return new Promise(resolve => {
      let revealed = 0;
      while (revealed < amountRevealed) {
        let doorToOpen = Math.floor(Math.random() * amountHidden);
        while (
          doors.current[doorToOpen].hasPrize ||
          doorToOpen === selected.current
        ) {
          doorToOpen = Math.floor(Math.random() * amountHidden);
        }
        doors.current[doorToOpen].open = true;
        revealed++;
      }
      setTimeout(resolve, speed || 50);
    });
  };

  const changeChoice = async () => {
    setCurrentAction('switching or staying:');
    return new Promise(resolve => {
      if (Math.random() > 0.5) {
        switched.current = true;
        selected.current = doors.current.findIndex(
          (door, index) => !door.open && index !== selected.current
        );
        setCurrentAction('switching or staying: switching');
      } else {
        switched.current = false;
        setCurrentAction('switching or staying: staying');
      }
      setTimeout(resolve, speed || 50);
    });
  };

  const finishRound = async () => {
    setCurrentAction('ending round:');
    return new Promise(resolve => {
      doors.current.forEach(d => (d.open = true));
      const didWin = doors.current[selected.current]?.hasPrize;
      setCurrentAction(
        didWin
          ? 'ending round: player won!'
          : 'ending round: player lost'
      );
      results.current.push({
        id: `result-${results.current.length}`,
        switched: switched.current,
        won: !!didWin,
      });
      setTimeout(resolve, speed || 50);
    });
  };

  const playGame = async () => {
    await startRound();
    await chooseDoor();
    await revealNonWinning();
    await changeChoice();
    await finishRound();
  };

  // START/STOP effect
  useEffect(() => {
    // clean up old interval
    clearInterval(playInterval.current);

    if (isRunning) {
      // run one immediately...
      playGame();
      // ...then schedule
      playInterval.current = setInterval(
        playGame,
        (speed || 50) * (amountOfSteps + 1)
      );
    }

    return () => clearInterval(playInterval.current);
  }, [isRunning, speed, amountHidden, amountRevealed]);

  return (
    <div className="app">
      <div className="controls">
        <div>
          <label>Speed: {speed} ms</label>
          <input type="range" min={0} max={10000} step={1000} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
        <div>
          <label>Door Amount: {amountHidden}</label>
          <input type="range" min={3} max={10} step={1} value={amountHidden} onChange={e => {
            const newAmt = Number(e.target.value);
            setAmountHidden(newAmt);
            if (amountRevealed >= newAmt) {
              setAmountRevealed(newAmt - 1);
            }
          }}
          />
        </div>
        <div>
          <label>Doors Revealed: {amountRevealed}</label>
          <input type="range" min={1} max={amountHidden - 1} step={1} value={amountRevealed} onChange={e => setAmountRevealed(Number(e.target.value))} />
        </div>
        <button onClick={() => setIsRunning(running => !running)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>

      <h1 className="action">{currentAction}</h1>
      <Doors
        doors={doors.current}
        selected={selected.current}
        amountHidden={amountHidden}
        amountRevealed={amountRevealed}
      />
      <Results results={results.current} />
    </div>
  );
}

export default App;
