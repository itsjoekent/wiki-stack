import type { GameState } from './types';

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

export function selectPageHasLink(
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

  return (
    selectPageHasLink(state, leftPageUrl, rightPageUrl) ||
    selectPageHasLink(state, rightPageUrl, leftPageUrl)
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
