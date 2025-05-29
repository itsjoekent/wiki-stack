import { startGame } from '@/game/actions';

export function IntroScene() {
  return (
    <div className="intro-scene">
      <h1>Welcome to WikiStack</h1>
      <button onClick={() => startGame({ mode: 'normal' })}>Normal mode</button>
      <button onClick={() => startGame({ mode: 'whimsical' })}>
        Whimsical mode
      </button>

      <h2>How to Play</h2>
      <p>Find the links between Wikipedia pages</p>
      <ul>
        <li>Each Wikipedia page is represented as a card.</li>
        <li>The game board has 4 stacks of 4 cards, and a deck.</li>
        <li>
          Drag cards from the deck to the stack you think the card shares a link
          with.
        </li>
        <li>
          For example,{' '}
          <a href="https://en.wikipedia.org/wiki/Conspiracy_theory">
            Conspiracy Theory
          </a>
          {' links to '}
          <a href="https://en.wikipedia.org/wiki/Central_Intelligence_Agency">
            Central Intelligence Agency
          </a>
          .
        </li>
      </ul>
      <h2>About WikiStack</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        convallis vitae ex eu scelerisque. Donec sed mauris ullamcorper, varius
        magna non, aliquet ante. In consectetur condimentum semper. Cras maximus
        neque sed leo eleifend sodales. Aliquam ante est, sodales ac turpis
        quis, congue fermentum ipsum. Cras porta quam ac dui pellentesque, ut
        posuere leo rutrum. Quisque elementum magna eu nibh fermentum pharetra.
      </p>
    </div>
  );
}
