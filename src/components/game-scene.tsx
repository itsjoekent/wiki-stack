import classNames from 'classnames';
import { reducer } from '@/game/reducer';
import { selectIsFadingToEndState, selectIsReadyToPlay } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { TableDragContext } from './table-drag-context';
import { Timer } from './timer';

export function GameScene() {
  const [isReadyToPlay, isFadingToEndState] = useReducer(reducer, selectIsReadyToPlay, selectIsFadingToEndState);

  if (!isReadyToPlay) {
    return (
      <div className="game-scene --loading">
        <p>Loading...</p>
      </div>
    );
  }

  const classes = classNames('game-scene', { '--fading': isFadingToEndState });

  return (
    <div className={classes}>
      <Timer />
      <TableDragContext />
    </div>
  );
}
