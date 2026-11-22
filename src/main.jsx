import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    {/* HashRouter: GitHub Pages has no server rewrites, so routes live after the '#'. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
