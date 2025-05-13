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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const calculateDough = () => {
    const now = new Date();
    const bakeTime = new Date(targetTime);
    const hoursUntilBake = (bakeTime - now) / 1000 / 3600;

    if (hoursUntilBake < 8) {
      alert('❗️Fermentation time too short. AVPN recommends at least 8–24 hours. Please choose a later baking time.');
      setResult(null);
      return;
    }

    const doughWeight = pizzaCount * pizzaSize;
    const hydrationRatio = hydration / 100;
    const flour = doughWeight / (1 + hydrationRatio);
    const water = flour * hydrationRatio;
    const salt = flour * 0.03;

    let yeast;
    if (yeastType === 'dry') {
      yeast = flour * 0.001;
    } else if (yeastType === 'fresh') {
      yeast = flour * 0.0025;
    } else {
      yeast = flour * 0.20;
    }

    const waterPct = hydration;
    const saltPct = (salt / flour) * 100;
    const yeastPct = (yeast / flour) * 100;

    const mixTime = now;
    const restTime = new Date(mixTime.getTime() + 20 * 60 * 1000);
    const ballTime = new Date(bakeTime.getTime() - 2 * 60 * 60 * 1000);
    const bulkStart = restTime;
    const bulkEnd = ballTime;

    setResult({
      flour,
      water,
      salt,
      yeast,
      yeastType,
      targetTime,
      hoursUntilBake,
      waterPct,
      saltPct,
      yeastPct,
      mixTime,
      restTime,
      bulkStart,
      bulkEnd,
      ballTime,
      bakeTime,
    });
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1>Neapolitan Pizza Dough Calculator</h1>
      </div>

      <div className="input-box">
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
      </div>

      {result && (
        <>
          <div className="result-section">
            <h3>📦 Dough Recipe</h3>
            <table className="recipe-table">
              <tbody>
                <tr><td>Flour</td><td>{result.flour.toFixed(1)} g</td><td>(100%)</td></tr>
                <tr><td>Water</td><td>{result.water.toFixed(1)} g</td><td>({result.waterPct.toFixed(1)}%)</td></tr>
                <tr><td>Salt</td><td>{result.salt.toFixed(1)} g</td><td>({result.saltPct.toFixed(2)}%)</td></tr>
                <tr>
                  <td>{result.yeastType === 'sourdough' ? 'Sourdough Starter' : 'Yeast'}</td>
                  <td>{result.yeast.toFixed(2)} g</td>
                  <td>({result.yeastPct.toFixed(3)}%)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '1.5rem' }}><strong>Fermentation Time:</strong> ~{result.hoursUntilBake.toFixed(1)} hours</p>
          </div>

          <div className="result-section">
            <h3>🧭 Example Timeline</h3>
            <ul className="timeline">
                <li>
                  <strong>🕒 Mix:</strong><br />
                  <span>{formatDate(result.mixTime)}</span>
                </li>
                <li>
                  <strong>🛌 Rest (20 min):</strong><br />
                  <span>Until {formatDate(result.restTime)}</span>
                </li>
                <li>
                  <strong>📦 Bulk Fermentation ({result.hoursUntilBake > 16 ? 'Cold Ferment' : 'Room Temp'})</strong><br />
                  <span>
                    Duration: {Math.floor((result.bulkEnd - result.bulkStart) / 3600000)}h {Math.round(((result.bulkEnd - result.bulkStart) % 3600000) / 60000)}m<br />
                    {formatDate(result.bulkStart)} → {formatDate(result.bulkEnd)}
                  </span>
                </li>
                <li>
                  <strong>🍥 Balling:</strong><br />
                  <span>{formatDate(result.ballTime)}</span>
                </li>
                <li>
                  <strong>🔥 Ready to bake:</strong><br />
                  <span>{formatDate(result.bakeTime)}</span>
                </li>
            </ul>

            {result.hoursUntilBake > 24 && (
              <p className="warning">
                ⚠️ Your fermentation exceeds 24 hours. Make sure you're cold fermenting the dough in a fridge (~4°C) and bring it to room temperature at least 1–2 hours before balling.
              </p>
            )}
            {result.yeastType === 'sourdough' && result.hoursUntilBake < 18 && (
              <p className="warning">
                ⚠️ AVPN recommends longer fermentation (20–24h) when using sourdough starter. Consider adjusting your target bake time.
              </p>
            )}
          </div>

          <div className="result-section">
            <h3>📜 AVPN Official Fermentation Recommendations</h3>
            <ul className="avpn-guidelines">
              <li>🕒 Total fermentation: minimum 8 hours, ideally 16–24 hours</li>
              <li>🌡️ Dough temperature: ~22–25°C during room-temp fermentation</li>
              <li>❄️ Cold fermentation (if fermentation {'>'}24h) must be done at 4–6°C with low yeast</li>
              <li>⚖️ Recommended yeast:
                <ul>
                  <li>• Dry yeast: 0.1–0.2%</li>
                  <li>• Fresh yeast: 0.2–0.3%</li>
                  <li>• Sourdough starter: ~20% of flour weight</li>
                </ul>
              </li>
              <li>⏲️ Balling should be done approximately 2 hours before baking</li>
              <li>🥣 Dough must be kneaded until smooth and elastic, then rested before bulk fermentation</li>
              <li>🧬 Sourdough requires an active, refreshed starter and tighter temperature control</li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>🔗 Official References:</strong></p>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                📄 <a href="https://www.pizzanapoletana.org/public/pdf/Disciplinare-2024-ENG.pdf" target="_blank" rel="noopener noreferrer">
                  2024 AVPN Guidelines (PDF)
                </a><br />
                🌐 <a href="https://www.pizzanapoletana.org/en/ricetta_pizza_napoletana" target="_blank" rel="noopener noreferrer">
                  AVPN Pizza Napoletana Recipe (Webpage)
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
