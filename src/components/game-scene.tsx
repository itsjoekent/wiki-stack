import { reducer } from '@/game/reducer';
import { selectIsReadyToPlay } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { TableDragContext } from './table-drag-context';
import { Timer } from './timer';

export function GameScene() {
  const [isReadyToPlay] = useReducer(reducer, selectIsReadyToPlay);

  if (!isReadyToPlay) {
    return (
      <div className="game-scene game-scene__loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="game-scene">
      <Timer />
      <TableDragContext />
    </div>
  );
}
