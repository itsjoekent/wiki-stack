import { resetGame } from '@/game/actions';
import { reducer } from '@/game/reducer';
import {
  selectCorrectLinksForIncorrectGuess,
  selectHighestStackCount,
  selectTimePlayed,
  selectTotalCorrect,
  selectStacksWithPages,
} from '@/game/selectors';
import { useReducer } from '@/lib/reducer';

export function EndScene() {
  const [totalCorrect, highestStack, timePlayed, correctLinks, stacksWithpages] = useReducer(
    reducer,
    selectTotalCorrect,
    selectHighestStackCount,
    selectTimePlayed,
    selectCorrectLinksForIncorrectGuess,
    selectStacksWithPages,
  );

  return (
    <div className="end-scene">
      <h1>Game Over</h1>
      <div className="end-scene__container --bordered">
        <h2>Stats</h2>
        <p>Highest stack: {highestStack.count} cards</p>
        <p>Total correct: {totalCorrect}</p>
        <p>Time played: {timePlayed} seconds</p>
      </div>
      {!!correctLinks && (
        <ul className="end-scene__container --bordered end-scene__correct-links">
          <h2>Correct links</h2>
          {correctLinks.map(({ from, to }) => (
            <li key={`${from.url}-${to.url}`}>
              <p>
                <b>{from.title}</b> links to <b>{to.title}</b>
              </p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => resetGame()}>Play again</button>
      {stacksWithpages.map((stack, index) => (
        <div key={index} className="end-scene__container end-scene__stack">
          <h3>Stack {index + 1}</h3>
          <ul>
            {stack.map((page) => (
              <li key={page.url} className="end-scene__card">
                <div className="end-scene__card-header">
                  <img src={page.imageSrc} alt={page.imageAlt} />
                  <h4>{page.title}</h4>
                </div>
                <p>{page.description}</p>
                <a href={page.url} target="_blank" rel="noopener noreferrer">
                  Open Wikipedia page in new tab
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
