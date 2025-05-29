import * as constants from './constants';
import { reducer } from './reducer';
import * as selectors from './selectors';
import type { GameState, Mode } from './types';
import { randomArrayShuffle } from './utils';

export type SetSceneActionPayload = {
  scene: GameState['scene'];
};

export const setSceneActionName = 'set_scene';

export const setScene = reducer.defineAction<SetSceneActionPayload>(
  setSceneActionName,
  ({ state, payload }) => {
    state.scene = payload.scene;
  },
);

export type SetupGameActionPayload = {
  stacks: GameState['stacks'];
  pages: GameState['pages'];
  deck: GameState['deck'];
};

export const setupGameActionName = 'setup_game';

export const setupGame = reducer.defineAction<SetupGameActionPayload>(
  setupGameActionName,
  ({ state, payload }) => {
    state.stacks = payload.stacks;
    state.pages = payload.pages;
    state.deck = payload.deck;
  },
);

export type BulkAddPagesActionPayload = {
  pages: GameState['pages'];
};

export const bulkAddPagesActionName = 'bulk_add_pages';

export const bulkAddPages = reducer.defineAction<BulkAddPagesActionPayload>(
  bulkAddPagesActionName,
  ({ state, payload }) => {
    state.pages = {
      ...state.pages,
      ...payload.pages,
    };
  },
);

export type SetReadyToPlayActionPayload = {
  isReadyToPlay: GameState['isReadyToPlay'];
};

export const setReadyToPlayActionName = 'set_ready_to_play';

export const setReadyToPlay = reducer.defineAction<SetReadyToPlayActionPayload>(
  setReadyToPlayActionName,
  ({ state, payload }) => {
    state.startedAt = Date.now();
    state.isReadyToPlay = payload.isReadyToPlay;
    state.timer.endsAt = Date.now() + constants.INITIAL_TIMER_MS;
  },
);

export type PushTopOfDeckToStackActionPayload = {
  stackIndex: number;
};

export const pushTopOfDeckToStackActionName = 'push_top_of_deck_to_stack';

export const pushTopOfDeckToStack =
  reducer.defineAction<PushTopOfDeckToStackActionPayload>(
    pushTopOfDeckToStackActionName,
    ({ state, payload }) => {
      const deck = [...state.deck];
      const stacks = [...state.stacks];

      if (deck.length === 0) throw new Error('Deck is empty');

      const url = deck.shift();
      if (!url) throw new Error('No URL found in deck');

      const targetStack = stacks[payload.stackIndex];
      if (!targetStack) throw new Error('Invalid stack index');

      const hasRelation = selectors.selectPagesHaveRelation(
        state,
        url,
        selectors.selectTopOfStack(state, payload.stackIndex),
      );

      if (hasRelation) {
        state.timer.endsAt =
          (state.timer.endsAt ?? Date.now()) + constants.TIMER_BOOST_MS;
      } else {
        state.endedAt = Date.now();
        state.endState = {
          isGameOver: true,
          reason: 'incorrect',
          stackIndex: payload.stackIndex,
        };
      }

      targetStack.push(url);
      state.stacks = stacks;

      const updatedDeck = deck.filter((url) => {
        return stacks.some((_stack, index) => {
          const stackUrl = selectors.selectTopOfStack(state, index);
          return selectors.selectPagesHaveRelation(state, stackUrl, url);
        });
      });
      state.deck = updatedDeck;
    },
  );

export type AddAndReshuffleDeckActionPayload = {
  addToDeck: GameState['deck'];
  preserveTopCards: number;
};

export const addAndReshuffleDeckActionName = 'add_and_reshuffle_deck';

export const addAndReshuffleDeck =
  reducer.defineAction<AddAndReshuffleDeckActionPayload>(
    addAndReshuffleDeckActionName,
    ({ state, payload }) => {
      const topCards = state.deck.slice(0, payload.preserveTopCards);
      const restOfDeck = [
        ...state.deck.slice(payload.preserveTopCards),
        ...payload.addToDeck,
      ];
      const shuffledDeck = randomArrayShuffle(restOfDeck);
      state.deck = [...topCards, ...shuffledDeck];
    },
  );

export type UpdateTimerTimeoutIdActionPayload = {
  timeoutId: GameState['timer']['timeoutId'];
};

export const updateTimerTimeoutIdActionName = 'update_timer_timeout_id';

export const updateTimerTimeoutId =
  reducer.defineAction<UpdateTimerTimeoutIdActionPayload>(
    updateTimerTimeoutIdActionName,
    ({ state, payload }) => {
      state.timer.timeoutId = payload.timeoutId;
    },
  );

export const setTimerExpiredActionName = 'set_timer_expired';

export const setTimerExpired = reducer.defineAction(
  setTimerExpiredActionName,
  ({ state }) => {
    state.endedAt = Date.now();

    state.timer = {
      ...state.timer,
      endsAt: null,
      timeoutId: null,
    };

    state.endState = {
      isGameOver: true,
      reason: 'time',
    };
  },
);

export const setFadeToEndScreenActionName = 'set_fade_to_end_screen';

export const setFadeToEndScreen = reducer.defineAction(
  setFadeToEndScreenActionName,
  ({ state }) => {
    state.fadeToEndScreen = true;
  },
);

export const resetGameActionName = 'reset_game';

function internalReset(state: GameState) {
  state.scene = 'game';
  state.stacks = [];
  state.deck = [];
  state.startedAt = null;
  state.endedAt = null;
  state.isReadyToPlay = false;
  state.timer = {
    endsAt: null,
    timeoutId: null,
  };
  state.endState = {
    isGameOver: false,
  };
  state.fadeToEndScreen = false;
}

export const resetGame = reducer.defineAction(resetGameActionName, ({ state }) => {
  internalReset(state);
});

export const startGameActionName = 'start_game';

export type startGameActionPayload = {
  mode: Mode
};

export const startGame = reducer.defineAction<startGameActionPayload>(
  startGameActionName,
  ({ state, payload }) => {
    internalReset(state);
    state.mode = payload.mode;
  },
);
