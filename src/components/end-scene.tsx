import { resetGame } from '@/game/actions';
import { reducer } from '@/game/reducer';
import {
  selectCorrectLinksForIncorrectGuess,
  selectHighestStackCount,
  selectTimePlayed,
  selectTotalCorrect,
  selectStacksWithPages,
  selectIncorrectStackIndex,
} from '@/game/selectors';
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
  ] = useReducer(
    reducer,
    selectTotalCorrect,
    selectHighestStackCount,
    selectTimePlayed,
    selectCorrectLinksForIncorrectGuess,
    selectStacksWithPages,
    selectIncorrectStackIndex,
  );

  return (
    <div className="end-scene">
      <h1>Game Over</h1>
      <div className="end-scene__container --bordered">
        <p>Highest stack: {highestStack.count} card{highestStack.count !== 1 ? 's' : ''}</p>
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
              <blockquote>
                {link.context}
              </blockquote>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => resetGame()}>Play again</button>
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
                <a href={page.url} target="_blank" rel="noopener noreferrer" className="end-scene__card-link">
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
