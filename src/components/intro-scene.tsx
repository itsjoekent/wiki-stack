import { marked } from 'marked';
import { startGame } from '@/game/actions';

const howToPlayContent = marked.parse(`
## How to Play
Find the links between Wikipedia pages.

- Each Wikipedia page is represented as a card.
- The game board has 4 stacks of cards, and an infinite deck.
- Drag cards from the deck to the stack you think the card shares a link with.
- For example, if the deck card is for [Conspiracy Theory](https://en.wikipedia.org/wiki/Conspiracy_theory), you could drag it to the stack with the card for the [Central Intelligence Agency](https://en.wikipedia.org/wiki/Central_Intelligence_Agency).
`);

const aboutContent = marked.parse(`
## About WikiStack

I made WikiStack as a fun alternative to Wikiracing [[1]](https://en.wikipedia.org/wiki/Wikiracing). I got the inspiration for the gameplay playing Speed [[2]](https://en.wikipedia.org/wiki/Speed_(card_game)) with a friend in the park.

Unlike the AI training programs bombarding Wikipedia with traffic [[3]](https://arstechnica.com/information-technology/2025/04/ai-bots-strain-wikimedia-as-bandwidth-surges-50/), WikiStack is built to responsibly use caching [[4]](https://en.wikipedia.org/wiki/Cache_(computing)), which means we generate very little traffic to Wikipedia.

I firmly believe Wikipedia is one of the best websites on the internet. But it's also under relentless attack from right-wing billionaires that hate platforms they can't control [[5]](https://www.newyorker.com/news/the-lede/elon-musk-also-has-a-problem-with-wikipedia). So I wanted to make a game to celebrate Wikipedia. If you enjoy this game, or get any value of being able to quickly learn almost anything imaginable, you should [donate to Wikipedia!](https://donate.wikimedia.org/w/index.php)
`);

export function IntroScene() {
  return (
    <div className="intro-scene">
      <h1>Welcome to WikiStack</h1>
      <div className="actions">
        <button onClick={() => startGame({ mode: 'normal' })}>
          Normal mode
        </button>
        <p>or</p>
        <button onClick={() => startGame({ mode: 'whimsical' })}>
          ✨ Whimsical ✨ mode
        </button>
      </div>

      <div className="intro-scene__content" dangerouslySetInnerHTML={{ __html: howToPlayContent }} />
      <div className="intro-scene__content" dangerouslySetInnerHTML={{ __html: aboutContent }} />
    </div>
  );
}
