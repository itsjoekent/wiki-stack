import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import * as actions from './game/actions';
import { GameScene } from './game/components';
import { reducer } from './game/reducer';
import './game/side-effects';

reducer.registerActionCompletedListener(console.log);
// reducer.registerStateChangedListener(console.log);
actions.setScene({ scene: 'game' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameScene />
  </StrictMode>,
);
