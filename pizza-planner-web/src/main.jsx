import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global reset and body styling
import './App.css';   // Specific component styling

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
