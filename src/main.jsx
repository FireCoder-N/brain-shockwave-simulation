import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './i18n/index.js';
import App from './App.jsx';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    {/* Suspense: a saved non-English language is loaded on demand before first render. */}
    <Suspense fallback={null}>
      {/* HashRouter: GitHub Pages has no server rewrites, so routes live after the '#'. */}
      <HashRouter>
        <App />
      </HashRouter>
    </Suspense>
  </StrictMode>,
);
