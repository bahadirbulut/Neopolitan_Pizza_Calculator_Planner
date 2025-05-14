import React from 'react';
import ReactDOM from 'react-dom/client';

// Create a debug component to show the calculation process
const CalculatorDebug = () => {
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)', 
        color: 'white',
        fontFamily: 'monospace',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '500px',
        maxHeight: '200px',
        overflow: 'auto'
      }}
    >
      <h3 style={{ margin: '0 0 8px 0' }}>Debug Console</h3>
      <p>Check the browser console (F12) for detailed errors</p>
      <div>
        <button onClick={() => console.clear()} style={{ marginRight: '5px' }}>Clear Console</button>
        <button onClick={() => window.location.reload()}>Reload App</button>
      </div>
    </div>
  );
};

// Render the debug component to the DOM in a separate div
const debugRoot = document.createElement('div');
debugRoot.id = 'debug-root';
document.body.appendChild(debugRoot);

ReactDOM.createRoot(debugRoot).render(
  <React.StrictMode>
    <CalculatorDebug />
  </React.StrictMode>
);