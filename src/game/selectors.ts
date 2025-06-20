import type { GameState, Page } from './types';

export function selectScene(state: GameState) {
  return state.scene;
}

export function selectStacks(state: GameState) {
  return state.stacks;
}

export function selectStacksWithPages(state: GameState) {
  const stacks = selectStacks(state);
  return stacks.map((stack) => stack.map((url) => selectPage(state, url)));
}

export function selectStack(state: GameState, stackIndex: number) {
  const stacks = selectStacks(state);
  if (stackIndex < 0 || stackIndex >= stacks.length) throw new Error('Invalid stack index');

  return stacks[stackIndex];
}

export function selectStackWithPages(state: GameState, stackIndex: number) {
  const stack = selectStack(state, stackIndex);
  return stack.map((url) => selectPage(state, url));
}

export function selectTopOfStack(state: GameState, stackIndex: number) {
  const stack = selectStack(state, stackIndex);
  if (stack.length === 0) throw new Error('Stack is empty');

  return stack[stack.length - 1];
}

export function selectTopOfStackPage(state: GameState, stackIndex: number) {
  const url = selectTopOfStack(state, stackIndex);
  return selectPage(state, url);
}

export function selectIncorrectStackIndex(state: GameState) {
  if (state.endState.isGameOver && state.endState.reason === 'incorrect') {
    return state.endState.stackIndex;
  }

  return null;
}

export function selectIsTableReady(state: GameState) {
  return selectStacks(state).length > 0 && state.deck.length > 0;
}

export function selectDeck(state: GameState) {
  return state.deck;
}

export function selectAllPageUrls(state: GameState) {
  return Object.keys(state.pages);
}

export function selectPage(state: GameState, url: string) {
  return state.pages[url];
}

export function selectDeckPages(state: GameState) {
  const deck = selectDeck(state);
  return deck.map((url) => selectPage(state, url)).filter(Boolean);
}

export function selectPageLink(
  state: GameState,
  pageUrl: string,
  linkUrl: string,
) {
  const page = selectPage(state, pageUrl);
  if (!page) return false;

  return page.links.find((link) => link.url === linkUrl);
}

export function selectPagesHaveRelation(
  state: GameState,
  leftPageUrl: string,
  rightPageUrl: string,
) {
  const leftPage = selectPage(state, leftPageUrl);
  const rightPage = selectPage(state, rightPageUrl);

  if (!leftPage || !rightPage) return false;

  return !!(
    selectPageLink(state, leftPageUrl, rightPageUrl) ||
    selectPageLink(state, rightPageUrl, leftPageUrl)
  );
}

export function selectIsReadyToPlay(state: GameState) {
  return state.isReadyToPlay;
}

export function selectIsGameOver(state: GameState) {
  return state.endState.isGameOver;
}

export function selectGameOverReason(state: GameState) {
  return state.endState.isGameOver ? state.endState.reason : null;
}

export function selectTimerTimeoutId(state: GameState) {
  return state.timer.timeoutId;
}

export function selectTimerEndsAt(state: GameState) {
  return state.timer.endsAt;
}

export function selectIsFadingToEndState(state: GameState) {
  return state.fadeToEndScreen;
}

export function selectHighestStackCount(state: GameState) {
  const stacks = selectStacks(state);
  const incorrectStackIndex = selectIncorrectStackIndex(state);

  const [count, index] = stacks.reduce((max, stack, index) => {
    const length = (stack.length) - (incorrectStackIndex === index ? 1 : 0);
    if (length > max[0]) {
      return [length, index];
    }
    return max;
  }, [0, 0]);

  return { count, index };
}

export function selectTotalCorrect(state: GameState) {
  const stacks = selectStacks(state);
  const endReason = selectGameOverReason(state);

  const totalCards = stacks.reduce((acc, stack) => acc + stack.length, 0) - stacks.length;

  if (endReason === 'incorrect') {
    return totalCards - 1;
  }

  return totalCards;
}

export function selectTimePlayed(state: GameState) {
  const startedAt = state.startedAt;
  const endsAt = state.endedAt;

  if (!startedAt || !endsAt) return 0;

  return Math.floor((endsAt - startedAt) / 1000);
}

export function selectCorrectLinksForIncorrectGuess(state: GameState) {
  let incorrectPage: Page | null = null;

  const incorrectStackIndex = selectIncorrectStackIndex(state);
  if (incorrectStackIndex === null) {
    incorrectPage = selectDeckPages(state)[0];
  } else {
    incorrectPage = selectTopOfStackPage(state, incorrectStackIndex);
  }

  const topPages = selectStacks(state).map((_stack, index) =>
    selectTopOfStackPage(state, index),
  ).filter((_page, index) => index !== incorrectStackIndex);

  return topPages
    .map((page) => {
      let link = selectPageLink(state, incorrectPage.url, page.url);
      if (link) {
        return { from: incorrectPage, to: page, link };
      }

      link = selectPageLink(state, page.url, incorrectPage.url);
      if (link) {
        return { from: page, to: incorrectPage, link };
      }

      return null;
    })
    .filter((val) => val !== null);
}

export function selectGameMode(state: GameState) {
  return state.mode;
}
