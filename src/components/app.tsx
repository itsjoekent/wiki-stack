import { reducer } from '@/game/reducer';
import { selectScene } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { GameScene } from './game-scene';

export function App() {
  const [scene] = useReducer(reducer, selectScene);

  return (
    <main className="flex justify-center width-full height-full min-h-screen p-4 bg-emerald-800">
      {scene === 'game' && <GameScene />}
    </main>
  );
}
