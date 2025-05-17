import * as actions from './actions';
import * as constants from './constants';
import * as proxy from './proxy';
import { reducer } from './reducer';
import * as selectors from './selectors';
import type { Page } from './types';
import { pickDeckCards, randomArrayPick, randomArrayShuffle } from './utils';

// Load the initial game data
reducer.registerStateChangedListener(async (event) => {
  const previousScene = selectors.selectScene(event.data.previousState);
  const scene = selectors.selectScene(event.data.updatedState);

  if (previousScene === scene || scene !== 'game') return;

  const isTableReady = selectors.selectIsTableReady(event.data.updatedState);
  if (isTableReady) return;

  // TODO: Add more pages to the starter list
  const { options } = await import('./starters.json');
  const starters = randomArrayPick(options, constants.TOTAL_STACKS);

  const starterPages = await Promise.all(
    starters.map((starter) => proxy.fetchPageData(starter)),
  );

  const pages = starterPages.reduce(
    (acc, page) => {
      acc[page.url] = page;
      return acc;
    },
    {} as Record<string, Page>,
  );

  const stacks = Object.keys(pages).map((url) => [url]);
  const deck = stacks
    .map((stack) =>
      pickDeckCards(pages[stack[0]], constants.PAGES_TO_ADD_ON_DROP, []),
    )
    .flat();

  const shuffledDeck = randomArrayShuffle(deck);

  actions.setupGame({
    deck: shuffledDeck,
    pages,
    stacks,
  });
});

// Load the page data for cards in the deck that are not already loaded
reducer.registerStateChangedListener(async (event) => {
  const scene = selectors.selectScene(event.data.updatedState);
  if (scene !== 'game') return;

  const isGameOver = selectors.selectIsGameOver(event.data.updatedState);
  if (isGameOver) return;

  const deck = selectors.selectDeck(event.data.updatedState);

  const missingPages = deck.filter((url, index) => {
    if (index > 4) return false;

    const page = selectors.selectPage(event.data.updatedState, url);

    return !page && !proxy.isLoadingPageData(url);
  });

  if (!missingPages.length) return;

  const pageData = await Promise.all(
    missingPages.map((url) => proxy.fetchPageData(url)),
  );

  const pages = pageData.reduce(
    (acc, page, index) => {
      acc[page.url] = page;

      // Handle redirects
      if (missingPages[index] !== page.url) {
        acc[missingPages[index]] = page;
      }

      return acc;
    },
    {} as Record<string, Page>,
  );

  actions.bulkAddPages({ pages });
});

// Confirm the game is ready to play
reducer.registerStateChangedListener(async (event) => {
  const scene = selectors.selectScene(event.data.updatedState);
  if (scene !== 'game') return;

  const isGameOver = selectors.selectIsGameOver(event.data.updatedState);
  if (isGameOver) return;

  const isReadyToPlay = selectors.selectIsReadyToPlay(event.data.updatedState);
  if (isReadyToPlay) return;

  const deck = selectors.selectDeck(event.data.updatedState);
  const isTableReady = selectors.selectIsTableReady(event.data.updatedState);

  if (!deck.length && !isTableReady) return;

  const firstCard = deck[0];
  const page = selectors.selectPage(event.data.updatedState, firstCard);
  if (!page) return;

  // TODO: Preload all page images

  actions.setReadyToPlay({ isReadyToPlay: true });
});

// When a page is added to a stack, add more pages to the deck based on the stack update
reducer.registerActionCompletedListener(async (event) => {
  if (event.data.type !== actions.pushTopOfDeckToStackActionName) return;

  const scene = selectors.selectScene(event.data.updatedState);
  if (scene !== 'game') return;

  const isReadyToPlay = selectors.selectIsReadyToPlay(event.data.updatedState);
  if (!isReadyToPlay) return;

  const isGameOver = selectors.selectIsGameOver(event.data.updatedState);
  if (isGameOver) return;

  const { stackIndex } = event.data
    .payload as actions.PushTopOfDeckToStackActionPayload;

  const topOfStackUrl = selectors.selectTopOfStack(
    event.data.updatedState,
    stackIndex,
  );

  const existingPages = selectors.selectAllPageUrls(event.data.updatedState);
  let page = selectors.selectPage(event.data.updatedState, topOfStackUrl);

  if (!page) {
    page = await proxy.fetchPageData(topOfStackUrl);
    actions.bulkAddPages({ pages: { [page.url]: page } });
  }

  const possibleAddedDeckPages = page.links.filter((pageLink) =>
    existingPages.includes(pageLink.url),
  ).map((pageLink) => pageLink.url);

  const addedDeckPages = pickDeckCards(
    page,
    constants.PAGES_TO_ADD_ON_DROP,
    possibleAddedDeckPages,
  );

  actions.addAndReshuffleDeck({
    addToDeck: addedDeckPages,
    preserveTopCards: 2,
  });
});

// Keep the timer updated when the state changes
reducer.registerStateChangedListener(async (event) => {
  const scene = selectors.selectScene(event.data.updatedState);
  if (scene !== 'game') return;

  const isReadyToPlay = selectors.selectIsReadyToPlay(event.data.updatedState);
  if (!isReadyToPlay) return;

  const isGameOver = selectors.selectIsGameOver(event.data.updatedState);
  const previousTimeoutId = selectors.selectTimerTimeoutId(
    event.data.previousState,
  );

  if (isGameOver) {
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }
    return;
  }

  const timerEndsAt = selectors.selectTimerEndsAt(event.data.updatedState);
  if (!timerEndsAt) return;

  const previousTimerEndsAt = selectors.selectTimerEndsAt(
    event.data.previousState,
  );
  if (timerEndsAt === previousTimerEndsAt) return;

  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  const timeLeft = Math.max(timerEndsAt - Date.now(), 0);
  const updatedTimeoutId = setTimeout(() => {
    actions.setTimerExpired();
  }, timeLeft);

  actions.updateTimerTimeoutId({ timeoutId: updatedTimeoutId });
});

// Handle the game over state transition
reducer.registerStateChangedListener(async (event) => {
  const scene = selectors.selectScene(event.data.updatedState);
  if (scene !== 'game') return;

  const wasGameOver = selectors.selectIsGameOver(event.data.previousState);
  const isGameOverNow = selectors.selectIsGameOver(event.data.updatedState);
  
  if (!wasGameOver && isGameOverNow) {
    setTimeout(() => {
      actions.setFadeToEndScreen();
    }, 1000);

    setTimeout(() => {
      actions.setScene({ scene: 'game-over' });
    }, 2000);
  }
});

// TODO: Preload all page images
