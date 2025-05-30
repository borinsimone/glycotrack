import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

console.log('Main.jsx loading...'); // Debug log

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement); // Debug log

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('App rendered'); // Debug log
} else {
  console.error('Root element not found!');
}
