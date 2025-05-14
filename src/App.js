import React from 'react';
import TitleAnimation from './components/TitleAnimation';
import CheckReactVersion from './components/CheckReactVersion';
import './App.css';

function App() {
  return (
    <div className="container">
      <CheckReactVersion />
      
      <header className="app-header">
        <div className="title-container">
          <h1 className="animated-title">
            <TitleAnimation title="Neapolitan Pizza Dough Calculator" />
          </h1>
        </div>
      </header>
    </div>
  );
}

export default App;