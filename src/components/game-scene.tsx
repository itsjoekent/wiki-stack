import { reducer } from '@/game/reducer';
import { selectIsReadyToPlay } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { TableDragContext } from './table-drag-context';
import { Timer } from './timer';

export function GameScene() {
  const [isReadyToPlay] = useReducer(reducer, selectIsReadyToPlay);

  if (!isReadyToPlay) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      <Timer />
      <TableDragContext />
    </div>
  );
}
