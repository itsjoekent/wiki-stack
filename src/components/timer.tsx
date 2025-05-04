import { useEffect, useRef, useState } from 'react';
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

  const intervalId = useRef<number | null>(null);
  const displayRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isGameOver || !timerEndsAt) {
      return;
    }

    let timeLeft = formatTimeLeft(Math.max(timerEndsAt - Date.now(), 0));

    intervalId.current = setInterval(() => {
      timeLeft = formatTimeLeft(Math.max(timerEndsAt - Date.now(), 0));

      if (displayRef.current) {
        displayRef.current.textContent = timeLeft;
      }
    }, 50);

    return () => {
      setDisplayValue(timeLeft);

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

  return (
    <div>
      <h2>Timer</h2>
      {gameOverReason === 'time' && <span>{formatTimeLeft(0)}</span>}
      {gameOverReason !== 'time' && (
        <span ref={displayRef}>{displayValue}</span>
      )}
    </div>
  );
}
