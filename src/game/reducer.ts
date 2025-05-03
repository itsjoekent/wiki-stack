import { Reducer } from '@/lib/reducer';
import { GameState } from './types';

export const initialState: GameState = {
  scene: 'intro',
  pages: {},
  stacks: [],
  deck: [],
  isReadyToPlay: false,
  endState: {
    isGameOver: false,
  },
  timer: {
    endsAt: null,
    timeoutId: null,
  },
};

export const reducer = new Reducer(initialState);
