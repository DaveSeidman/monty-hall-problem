import React, { useEffect, useRef } from "react";
import './index.scss';

const Results = ({ results }) => {
  const roundsRef = useRef();
  const switched = results.filter(r => r.switched).length;
  const switchedAndWon = results.filter(r => r.switched && r.won).length;
  const stayed = results.filter(r => !r.switched).length;
  const stayedAndWon = results.filter(r => !r.switched && r.won).length;

  useEffect(() => {
    if (roundsRef.current) {
      console.log(roundsRef.current.scrollHeight)
      roundsRef.current.scrollTo({ top: roundsRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [results.length]);

  return (
    <div className="results">
      <div ref={roundsRef} className="results-rounds">
        {results.map((result, idx) => (
          <div key={idx} className="results-rounds-round">
            <span className={result.won ? 'won' : 'lost'}>
              <span>{result.switched ? `switched` : 'stayed'}</span>
              <span>{result.won ? '⭐️' : '❌'}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="results-totals">
        <div className="results-totals-stayed">
          Stayed and won: {stayed > 0 ? Math.round((stayedAndWon / stayed) * 100) : 0}%
        </div>
        <div className="results-totals-switched">
          Switched and won: {switched > 0 ? Math.round((switchedAndWon / switched) * 100) : 0}%
        </div>
      </div>
    </div>
  )
}

export default Results;
