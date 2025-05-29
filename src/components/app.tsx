import { reducer } from '@/game/reducer';
import { selectScene } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { GameScene } from './game-scene';
import { EndScene } from './end-scene';
import { IntroScene } from './intro-scene';

export function App() {
  const [scene] = useReducer(reducer, selectScene);

  return (
    <main className="app">
      {scene === 'intro' && <IntroScene />}
      {scene === 'game' && <GameScene />}
      {scene === 'game-over' && <EndScene />}
    </main>
  );
}
