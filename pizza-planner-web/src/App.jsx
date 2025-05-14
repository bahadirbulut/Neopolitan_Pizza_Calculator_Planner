// App.jsx
import { useState } from 'react';
import './App.css';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import InventoryIcon from '@mui/icons-material/Inventory';
import CircleIcon from '@mui/icons-material/Circle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion } from 'framer-motion';

function App() {
  const [pizzaCount, setPizzaCount] = useState(4);
  const [pizzaSize, setPizzaSize] = useState(250);
  const [hydration, setHydration] = useState(60);
  const [flourType, setFlourType] = useState('00');
  const [yeastType, setYeastType] = useState('dry');
  const [targetTime, setTargetTime] = useState('2025-05-13T20:00');
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState('');
  const [suggestedTime, setSuggestedTime] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const toLocalDatetimeInputValue = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const calculateDough = () => {
    const now = new Date();
    const bakeTime = new Date(targetTime);
    const hoursUntilBake = (bakeTime - now) / 1000 / 3600;

    const minHoursRequired = {
      dry: 8,
      fresh: 12,
      sourdough: 16,
    };

    const requiredHours = minHoursRequired[yeastType];
    const earliestValidTime = new Date(now.getTime() + requiredHours * 60 * 60 * 1000 + 60 * 1000);

    if (hoursUntilBake < requiredHours) {
      const formattedEarliest = formatDate(earliestValidTime);
      setWarning(
        `⚠️ Fermentation time too short for ${yeastType.toUpperCase()} yeast.\n` +
        `🕒 AVPN recommends at least ${requiredHours} hours.\n` +
        `📅 Earliest valid baking time: ${formattedEarliest}`
      );
      setSuggestedTime(toLocalDatetimeInputValue(earliestValidTime));
      setResult(null);
      return;
    } else {
      setWarning('');
      setSuggestedTime(null);
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
      waterPct: hydration,
      saltPct: (salt / flour) * 100,
      yeastPct: (yeast / flour) * 100,
      mixTime,
      restTime,
      bulkStart,
      bulkEnd,
      ballTime,
      bakeTime,
    });
  };

  const getYeastColor = (type) => {
    switch (type) {
      case 'sourdough': return '#8e44ad';
      case 'fresh': return '#f39c12';
      default: return '#3498db';
    }
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

        {warning && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            color: '#856404',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setWarning('');
                setSuggestedTime(null);
              }}
              style={{
                position: 'absolute',
                top: '6px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#856404'
              }}
            >✖</button>
            {warning}
            {suggestedTime && (
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  onClick={() => setTargetTime(suggestedTime)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffeeba',
                    border: '1px solid #f5c06d',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#856404'
                  }}
                >
                  Set Suggested Time
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {result && (
        <>
          <div className="result-section recipe">
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
            <p style={{ marginTop: '1.5rem' }}>
              <strong>Fermentation Time:</strong> ~{result.hoursUntilBake.toFixed(1)} hours
            </p>
          </div>

          <div className="result-section timeline">
            <h3>🧭 Example Timeline</h3>
            <Timeline position="right">
              {[
                { time: result.mixTime, title: 'Mix', desc: 'Start combining your ingredients.', icon: <AccessTimeIcon />, color: 'primary' },
                { time: result.restTime, title: 'Rest', desc: 'Let the dough relax 20 min.', icon: <HotelIcon />, color: 'secondary' },
                {
                  time: result.bulkStart,
                  title: 'Bulk Fermentation',
                  desc: `${result.hoursUntilBake > 16 ? 'Cold ferment' : 'Room temp'} for ${Math.floor((result.bulkEnd - result.bulkStart) / 3600000)}h ${Math.round(((result.bulkEnd - result.bulkStart) % 3600000) / 60000)}m`,
                  icon: <InventoryIcon sx={{ color: '#fff' }} />, dotColor: getYeastColor(yeastType)
                },
                { time: result.ballTime, title: 'Balling', desc: 'Shape dough balls 2h before bake.', icon: <CircleIcon />, color: 'success' },
                { time: result.bakeTime, title: 'Ready to Bake', desc: 'Fire up your oven and enjoy 🍕', icon: <LocalFireDepartmentIcon />, color: 'error' },
              ].map((step, idx) => (
                <TimelineItem key={idx} sx={{ alignItems: 'center' }}>
                  <TimelineOppositeContent sx={{ flex: 0.8, textAlign: 'right', pr: 3, fontSize: '0.95rem', color: 'gray', minWidth: '90px', alignSelf: 'center' }}>
                    {formatDate(step.time)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={step.color || 'grey'} sx={step.dotColor ? { backgroundColor: step.dotColor } : {}}>
                      {step.icon}
                    </TimelineDot>
                    {idx < 4 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <motion.div initial={{ opacity: 0, translateY: 30 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                      <Typography variant="h6">{step.title}</Typography>
                      <Typography>{step.desc}</Typography>
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>

          <div className="result-section guidelines">
            <h3>📜 AVPN Official Fermentation Recommendations</h3>
            <ul className="avpn-guidelines">
              <li><strong>🕒 Total Fermentation:</strong><br />- <strong>Dry Yeast:</strong> Minimum <strong>8 hours</strong><br />- <strong>Fresh Yeast:</strong> Minimum <strong>12 hours</strong><br />- <strong>Sourdough Starter:</strong> Minimum <strong>16 hours</strong> (ideally 24h+)</li>
              <li><strong>🌡️ Dough Temperature:</strong> ~22–25°C during room-temp fermentation</li>
              <li><strong>❄️ Cold Fermentation:</strong> If fermentation &gt; 24h, store at <strong>4–6°C</strong> with low yeast</li>
              <li><strong>⚖️ Recommended Yeast Amounts:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                  <li>Dry Yeast: <strong>0.1–0.2%</strong></li>
                  <li>Fresh Yeast: <strong>0.2–0.3%</strong></li>
                  <li>Sourdough Starter: <strong>~20%</strong> of flour weight</li>
                </ul>
              </li>
              <li><strong>⏲️ Balling:</strong> Should be done approximately <strong>2 hours</strong> before baking</li>
              <li><strong>🥣 Dough Handling:</strong> Must be kneaded until smooth and elastic, then rested before bulk fermentation</li>
              <li><strong>🧬 Sourdough:</strong> Requires an active, refreshed starter and tighter temperature control</li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>🔗 Official References:</strong></p>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                📄 <a href="https://www.pizzanapoletana.org/public/pdf/Disciplinare-2024-ENG.pdf" target="_blank" rel="noopener noreferrer">2024 AVPN Guidelines (PDF)</a><br />
                🌐 <a href="https://www.pizzanapoletana.org/en/ricetta_pizza_napoletana" target="_blank" rel="noopener noreferrer">AVPN Pizza Napoletana Recipe (Webpage)</a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
