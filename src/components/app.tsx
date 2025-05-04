import { reducer } from '@/game/reducer';
import { selectScene } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { GameScene } from './game-scene';

export function App() {
  const [scene] = useReducer(reducer, selectScene);

  return (
    <main className="app">
      {scene === 'game' && <GameScene />}
    </main>
  );
}
