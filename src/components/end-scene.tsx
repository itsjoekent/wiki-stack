import { setScene, resetGame, startGame } from '@/game/actions';
import { reducer } from '@/game/reducer';
import {
  selectCorrectLinksForIncorrectGuess,
  selectHighestStackCount,
  selectTimePlayed,
  selectTotalCorrect,
  selectStacksWithPages,
  selectIncorrectStackIndex,
  selectGameMode,
} from '@/game/selectors';
import { Mode } from '@/game/types';
import { useReducer } from '@/lib/reducer';
import classNames from 'classnames';

export function EndScene() {
  const [
    totalCorrect,
    highestStack,
    timePlayed,
    correctLinks,
    stacksWithpages,
    incorrectStackIndex,
    mode,
  ] = useReducer(
    reducer,
    selectTotalCorrect,
    selectHighestStackCount,
    selectTimePlayed,
    selectCorrectLinksForIncorrectGuess,
    selectStacksWithPages,
    selectIncorrectStackIndex,
    selectGameMode
  );

  const oppositeMode: Mode = mode === 'normal' ? 'whimsical' : 'normal';

  return (
    <div className="end-scene">
      <h1>Game Over</h1>
      <div className="end-scene__container --bordered">
        <p>
          Highest stack: {highestStack.count} card
          {highestStack.count !== 1 ? 's' : ''}
        </p>
        <p>Total correct: {totalCorrect}</p>
        <p>Time played: {timePlayed} seconds</p>
      </div>
      {!!correctLinks && (
        <ul className="end-scene__container --bordered end-scene__correct-links">
          {correctLinks.map(({ from, to, link }) => (
            <li key={`${from.url}-${to.url}`}>
              <p>
                <b>
                  <a href={from.url} target="_blank">
                    {from.title}
                  </a>
                </b>{' '}
                links to{' '}
                <b>
                  <a href={to.url} target="_blank">
                    {to.title}
                  </a>
                </b>
              </p>
              <blockquote>{link.context}</blockquote>
            </li>
          ))}
        </ul>
      )}
      <div className="end-scene__actions">
        <button onClick={() => resetGame()}>Play again</button>
        <a
          className="end-scene__alt"
          onClick={() => startGame({ mode: oppositeMode })}
        >
          Switch to {oppositeMode} mode
        </a>
        <a
          className="end-scene__alt"
          onClick={() => setScene({ scene: 'intro' })}
        >
          Back to homepage
        </a>
      </div>
      {stacksWithpages.map((stack, stackIndex) => (
        <div key={stackIndex} className="end-scene__container end-scene__stack">
          <h3>Stack {stackIndex + 1}</h3>
          <ul>
            {stack.map((page, pageIndex) => (
              <li
                key={page.url}
                className={classNames('end-scene__card', {
                  '--incorrect':
                    stackIndex === incorrectStackIndex &&
                    pageIndex === stack.length - 1,
                })}
              >
                <div className="end-scene__card-header">
                  <img src={page.imageSrc} alt={page.imageAlt} />
                  <h4>{page.title}</h4>
                </div>
                <p>{page.description}</p>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="end-scene__card-link"
                >
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
