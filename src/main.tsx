import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/app';
import './game/side-effects';

import './index.css';

// Seed script for 'unusual-starters.json'
// import * as proxy from './game/proxy';
// proxy
//   .fetchPageData('https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles')
//   .then(({ links }) => {
//     const urls = links.map((link => link.url))
//     console.log(JSON.stringify({ options: urls }, null, 2));
//   });

// reducer.registerActionCompletedListener(console.log);
// reducer.registerStateChangedListener(console.log);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
