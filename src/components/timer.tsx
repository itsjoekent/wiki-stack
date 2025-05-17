import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { reducer } from '@/game/reducer';
import {
  selectTimerEndsAt,
  selectIsGameOver,
  selectGameOverReason,
} from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { formatTimeLeft } from '@/game/utils';

export function Timer() {
  const [timerEndsAt, isGameOver, gameOverReason] = useReducer(
    reducer,
    selectTimerEndsAt,
    selectIsGameOver,
    selectGameOverReason,
  );

  const [displayValue, setDisplayValue] = useState<string>('00:000');
  const [warning, setWarning] = useState(false);

  const intervalId = useRef<number | null>(null);
  const displayRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isGameOver || !timerEndsAt) {
      return;
    }

    let timeLeftDisplay = formatTimeLeft(Math.max(timerEndsAt - Date.now(), 0));

    intervalId.current = setInterval(() => {
      const timeLeft = Math.max(timerEndsAt - Date.now(), 0);
      timeLeftDisplay = formatTimeLeft(timeLeft);

      if (timeLeft <= 5000) {
        setWarning(true);
      } else {
        setWarning(false);
      }

      if (displayRef.current) {
        const [seconds, milliseconds] = timeLeftDisplay.split('.');
        displayRef.current.setHTMLUnsafe(`${seconds}.<span class="--small">${milliseconds}</span>`);
      }
    }, 50);

    return () => {
      setDisplayValue(timeLeftDisplay);

      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      intervalId.current = null;
    };
  }, [timerEndsAt, isGameOver]);

  useEffect(() => {
    if (isGameOver && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, [isGameOver]);

  const timerClass = classNames('game-timer', {
    '--expired': gameOverReason === 'time',
    '--warning': warning,
  });

  return (
    <div className={timerClass}>
      {gameOverReason === 'time' && <span>00.<span className="--small">000</span></span>}
      {gameOverReason !== 'time' && (
        <span ref={displayRef}>
          {displayValue.split('.')[0]}.<span className="--small">{displayValue.split('.')[1]}</span>
        </span>
      )}
      <p>seconds left</p>
    </div>
  );
}
