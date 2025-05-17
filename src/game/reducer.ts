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
  startedAt: null,
  endedAt: null,
  timer: {
    endsAt: null,
    timeoutId: null,
  },
  fadeToEndScreen: false,
};

export const reducer = new Reducer(initialState);
