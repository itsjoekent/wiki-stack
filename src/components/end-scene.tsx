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
      <p>Highest stack: {highestStack.count} cards</p>
      <p>Total correct: {totalCorrect}</p>
      <p>Time played: {timePlayed} seconds</p>
      {!!correctLinks && (
        <div>
          {correctLinks.map(({ from, to }) => (
            <div key={`${from.url}-${to.url}`}>
              <p>
                {from.title} links to {to.title}
              </p>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => resetGame()}>Play again</button>
      <h2>Stacks</h2>
      {stacksWithpages.map((stack, index) => (
        <div key={index}>
          <h3>Stack {index + 1}</h3>
          <ul>
            {stack.map((page) => (
              <li key={page.url}>
                <p>{page.title}</p>
                <p>{page.description}</p>
                <a href={page.url} target="_blank" rel="noopener noreferrer">
                  {page.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
