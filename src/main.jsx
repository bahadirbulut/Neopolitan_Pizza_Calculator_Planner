import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global reset and body styling
import './App.css';   // Specific component styling
import './fonts.css'; // Import the fonts CSS file
import { ErrorBoundary } from './ErrorBoundary.jsx';

// Import debug utilities - make this conditional to prevent issues in production
if (process.env.NODE_ENV !== 'production') {
  import('./debug.jsx').catch(err => console.error('Debug tools failed to load:', err));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
