import { useState } from 'react';
import './App.css';

function App() {
  const [pizzaCount, setPizzaCount] = useState(4);
  const [pizzaSize, setPizzaSize] = useState(250);
  const [hydration, setHydration] = useState(60);
  const [flourType, setFlourType] = useState('00');
  const [yeastType, setYeastType] = useState('dry');
  const [targetTime, setTargetTime] = useState('2025-05-13T20:00');
  const [result, setResult] = useState(null);

  const calculateDough = () => {
    const doughWeight = pizzaCount * pizzaSize;
    const hydrationRatio = hydration / 100;
    const flour = doughWeight / (1 + hydrationRatio);
    const water = flour * hydrationRatio;
    let yeast;
    const hoursUntilBake = (new Date(targetTime) - new Date()) / 1000 / 3600;

    if (yeastType === 'dry') {
      yeast = flour * (0.1 / 100);
    } else if (yeastType === 'fresh') {
      yeast = flour * (0.25 / 100);
    } else {
      yeast = flour * (20 / 100);
    }

    const salt = flour * 0.03;
    setResult({ flour, water, salt, yeast, yeastType, targetTime, hoursUntilBake });
  };

  return (
    <div className="container">
      <h1>Neapolitan Pizza Dough Calculator</h1>

      <label>Number of Pizzas:</label>
      <input type="number" value={pizzaCount} onChange={e => setPizzaCount(Number(e.target.value))} />

      <label>Size per Pizza (grams):</label>
      <input type="number" value={pizzaSize} onChange={e => setPizzaSize(Number(e.target.value))} />

      <label>Hydration %:</label>
      <input type="number" value={hydration} onChange={e => setHydration(Number(e.target.value))} />

      <label>Flour Type:</label>
      <select value={flourType} onChange={e => setFlourType(e.target.value)}>
        <option value="00">00 Flour</option>
        <option value="manitoba">Manitoba</option>
      </select>

      <label>Yeast Type:</label>
      <select value={yeastType} onChange={e => setYeastType(e.target.value)}>
        <option value="dry">Dry Yeast</option>
        <option value="fresh">Fresh Yeast</option>
        <option value="sourdough">Sourdough</option>
      </select>

      <label>Target Cooking Time:</label>
      <input type="datetime-local" value={targetTime} onChange={e => setTargetTime(e.target.value)} />

      <button onClick={calculateDough}>Calculate Dough</button>

      {result && (
        <div className="result">
          <h2>Dough Recipe</h2>
          <p>Flour: {result.flour.toFixed(1)} g</p>
          <p>Water: {result.water.toFixed(1)} g</p>
          <p>Salt: {result.salt.toFixed(1)} g</p>
          <p>{result.yeastType === 'sourdough' ? 'Sourdough Starter' : 'Yeast'}: {result.yeast.toFixed(1)} g</p>
          <p>Fermentation Time: ~{result.hoursUntilBake.toFixed(1)} hours</p>

          <h3>Example Timeline</h3>
          <ul>
            <li>Mix ingredients: Now</li>
            <li>Knead and rest 20 min</li>
            <li>Bulk rise: {result.hoursUntilBake < 10 ? 'Room temp' : 'Cold ferment + Room'}</li>
            <li>Ball and proof: 2 hours before baking</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

