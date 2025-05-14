// App.jsx
import { useState, useRef } from 'react';
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
import { Typography, useMediaQuery } from '@mui/material';
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
  const yeastFermentationHours = { dry: 8, fresh: 12, sourdough: 16 };
  const recipeRef = useRef(null);
  const [expandedStep, setExpandedStep] = useState(null);
  
  // Flour characteristics by type
  const flourCharacteristics = {
    '00': { 
      hydrationRange: [55, 62], 
      proteinContent: '11-13.5%', 
      description: 'Fine Italian flour ideal for Neapolitan pizza',
      saltPercentage: 3.0,
      yeastMultiplier: 1.0
    },
    'bread': { 
      hydrationRange: [60, 65], 
      proteinContent: '12-14%', 
      description: 'High protein content, great structure',
      saltPercentage: 2.5,
      yeastMultiplier: 0.9
    },
    'allpurpose': { 
      hydrationRange: [60, 65], 
      proteinContent: '10-12%', 
      description: 'Versatile flour with moderate protein',
      saltPercentage: 2.5,
      yeastMultiplier: 1.1
    },
    'manitoba': { 
      hydrationRange: [65, 70], 
      proteinContent: '14-15%', 
      description: 'Very strong Canadian flour for long fermentation',
      saltPercentage: 2.8,
      yeastMultiplier: 0.8
    },
    'whole': { 
      hydrationRange: [65, 75], 
      proteinContent: '13-14%', 
      description: 'Whole wheat flour, more rustic flavor',
      saltPercentage: 2.2,
      yeastMultiplier: 1.2
    },
    'semolina': { 
      hydrationRange: [55, 65], 
      proteinContent: '12-13%', 
      description: 'Durum wheat flour, adds texture and flavor',
      saltPercentage: 2.8,
      yeastMultiplier: 1.0
    },
    'spelt': { 
      hydrationRange: [65, 75], 
      proteinContent: '11-13%', 
      description: 'Ancient grain with nutty flavor, less gluten',
      saltPercentage: 2.0,
      yeastMultiplier: 1.3
    },
    'rye': { 
      hydrationRange: [70, 85], 
      proteinContent: '9-11%', 
      description: 'Distinctive flavor, use in combination with wheat flour',
      saltPercentage: 2.0,
      yeastMultiplier: 1.4
    }
  };
  
  // Check if the screen is mobile-sized
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const toLocalDatetimeInputValue = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
    const getInitialTargetTime = (type) => {
    const localNow = new Date();
    // Add fermentation hours plus 10 minutes (600000 ms)
    return new Date(localNow.getTime() + (yeastFermentationHours[type] * 60 * 60 * 1000) + 600000);
  };
  const defaultTargetTime = getInitialTargetTime(yeastType);
  const [targetTime, setTargetTime] = useState(() => toLocalDatetimeInputValue(defaultTargetTime));  
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState('');
  const [suggestedTime, setSuggestedTime] = useState(null);
  const [guidelinesExpanded, setGuidelinesExpanded] = useState(false);
  // Define detailed instructions for each timeline step based on AVPN guidelines
  const timelineInstructions = {
    mix: "Mix the ingredients starting with water (room temperature), then dissolve the salt. Gradually add small amounts of flour, mixing continuously, then add yeast. Knead vigorously for 10-15 minutes until the dough is smooth and elastic with no lumps. The finished dough should be soft, smooth, and sticky to the touch.",
    rest: "Allow the dough mass to rest on a work surface covered with a damp cloth, or in a food container for about 20-30 minutes. This initial rest period allows the dough to relax and begin gluten formation, making it easier to portion later.",
    bulk: "For room temperature fermentation, maintain the dough at 22-25°C. For longer fermentation time (over 16 hours), place in refrigerator (4-6°C). The dough must be stored in sealed food containers to prevent surface drying. Rising time varies based on temperature and yeast type following AVPN standards.",
    balling: "Divide the dough into balls (200-280g each depending on desired pizza size) using a spatula or scraper. Minimal handling is required, and the dough should only be shaped by folding the edges from bottom to top. Ball shaping should be completed in a few seconds. Place shaped balls in proofing boxes with a light dusting of flour between them.",
    bake: "TRADITIONAL WOOD-FIRED OVEN: Heat to 430-480°C with cooking surface at 380-430°C. Using a pizza peel, stretch the dough disc by hand to 3mm thickness (1-2cm for the crust border). Add toppings and bake for 60-90 seconds, rotating as needed.\n\nHOME OVEN METHOD: Place a pizza stone or steel on the middle-top rack and preheat at maximum temperature (250-290°C) for at least 45-60 minutes. Stretch dough as above. For best results, use a pizza peel to launch onto the hot stone. Bake for 4-6 minutes until the crust is golden and charred in spots. If your oven has a broiler/grill function, switch to it for the final minute to char the crust."
  };

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

    const minHoursRequired = {
      dry: 8,
      fresh: 12,
      sourdough: 16,
    };    
    const requiredHours = minHoursRequired[yeastType];
    const earliestValidTime = new Date(now.getTime() + requiredHours * 60 * 60 * 1000 + 600000); // Add 10 minutes (600000 ms)

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
    
    // Use flour-specific salt percentage
    const saltPercentage = flourCharacteristics[flourType].saltPercentage / 100;
    const salt = flour * saltPercentage;

    // Adjust yeast based on flour type
    const yeastMultiplier = flourCharacteristics[flourType].yeastMultiplier;
    let yeast;
    if (yeastType === 'dry') {
      yeast = flour * 0.001 * yeastMultiplier;
    } else if (yeastType === 'fresh') {
      yeast = flour * 0.0025 * yeastMultiplier;
    } else {
      yeast = flour * 0.20 * yeastMultiplier;
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
    
    // Scroll to recipe section after calculation is successful
    setTimeout(() => {
      if (recipeRef.current) {
        recipeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
        <p className="header-tagline">Based on AVPN authentic guidelines</p>
      </div>
      <div className="input-box">
        <label>Number of Pizzas:</label>
        <input type="number" value={pizzaCount} onChange={e => setPizzaCount(Number(e.target.value))} />

        <label>Size per Pizza (grams):</label>
        <input type="number" value={pizzaSize} onChange={e => setPizzaSize(Number(e.target.value))} />

        <label>Hydration %:</label>
        <input type="number" value={hydration} onChange={e => setHydration(Number(e.target.value))} />        
        <label>Flour Type:</label>
        <select value={flourType} onChange={e => {
          const newFlourType = e.target.value;
          setFlourType(newFlourType);
          
          // Adjust hydration to middle of recommended range for the selected flour
          const [minHydration, maxHydration] = flourCharacteristics[newFlourType].hydrationRange;
          const recommendedHydration = Math.round((minHydration + maxHydration) / 2);
          setHydration(recommendedHydration);
        }}>
          <option value="00">00 Flour (Neapolitan)</option>
          <option value="bread">Bread Flour</option>
          <option value="allpurpose">All-Purpose Flour</option>
          <option value="manitoba">Manitoba Flour</option>
          <option value="whole">Whole Wheat Flour</option>
          <option value="semolina">Semolina Flour</option>
          <option value="spelt">Spelt Flour</option>
          <option value="rye">Rye Flour</option>
        </select>

        <label>Yeast Type:</label>        
        <select value={yeastType} onChange={e => {
            const selectedType = e.target.value;
            setYeastType(selectedType);
            const newTime = new Date(Date.now() + (yeastFermentationHours[selectedType] * 60 * 60 * 1000) + 600000);
            setTargetTime(toLocalDatetimeInputValue(newTime));
          }}> 
          <option value="dry">Dry Yeast</option>
          <option value="fresh">Fresh Yeast</option>
          <option value="sourdough">Sourdough</option>
        </select>

        <label>Target Cooking Time:</label>
        <input type="datetime-local" value={targetTime} onChange={e => setTargetTime(e.target.value)} />

        <button onClick={calculateDough} className="calculate-button">
          <span className="button-icon">🧮</span>
          Calculate Dough
        </button>

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
          <div className="result-section recipe" ref={recipeRef}>
            <h3>📦 Dough Recipe</h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <div className="flour-info">
                <h4>{flourCharacteristics[flourType].description}</h4>
                <p><strong>Protein Content:</strong> {flourCharacteristics[flourType].proteinContent}</p>
                <p><strong>Recommended Hydration:</strong> {flourCharacteristics[flourType].hydrationRange[0]}-{flourCharacteristics[flourType].hydrationRange[1]}%</p>
              </div>
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
            </motion.div>
          </div>          
          <div className="result-section timeline">
            <h3>🧭 Example Timeline</h3>
            <Timeline position={isMobile ? "alternate" : "right"}>
              {[
                { time: result.mixTime, title: 'Mix', desc: timelineInstructions.mix, icon: <AccessTimeIcon />, color: 'primary' },
                { time: result.restTime, title: 'Rest', desc: timelineInstructions.rest, icon: <HotelIcon />, color: 'secondary' },
                {
                  time: result.bulkStart,
                  title: 'Bulk Fermentation',
                  desc: timelineInstructions.bulk,
                  icon: <InventoryIcon sx={{ color: '#fff' }} />, dotColor: getYeastColor(yeastType)
                },
                { time: result.ballTime, title: 'Balling', desc: timelineInstructions.balling, icon: <CircleIcon />, color: 'success' },
                { time: result.bakeTime, title: 'Ready to Bake', desc: timelineInstructions.bake, icon: <LocalFireDepartmentIcon />, color: 'error' },
              ].map((step, idx) => (
                <TimelineItem key={idx} sx={{ alignItems: 'center' }}>
                  <TimelineOppositeContent 
                    sx={{ 
                      flex: {xs: 0.3, sm: 0.5, md: 0.8}, 
                      textAlign: 'right', 
                      pr: {xs: 1, sm: 2, md: 3}, 
                      fontSize: {xs: '0.85rem', sm: '0.9rem', md: '0.95rem'}, 
                      color: 'gray', 
                      minWidth: {xs: '70px', sm: '80px', md: '90px'}, 
                      alignSelf: 'center' 
                    }}
                  >
                    {formatDate(step.time)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={step.color || 'grey'} sx={step.dotColor ? { backgroundColor: step.dotColor } : {}}>
                      {step.icon}
                    </TimelineDot>
                    {idx < 4 && <TimelineConnector />}
                  </TimelineSeparator>                  <TimelineContent>
                    <motion.div initial={{ opacity: 0, translateY: 30 }} whileInView={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                      <Typography variant="h6" 
                        onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        sx={{ 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          color: expandedStep === idx ? '#e63946' : 'inherit',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {step.title}
                        <span style={{ fontSize: '0.9rem', marginLeft: '8px' }}>
                          {expandedStep === idx ? '▼' : '▶'}
                        </span>
                      </Typography>                      {expandedStep === idx ? (
                        <Typography sx={{ 
                          mt: 1, 
                          p: 1.5, 
                          backgroundColor: 'rgba(230, 57, 70, 0.05)', 
                          borderLeft: '3px solid #e63946',
                          borderRadius: '0 4px 4px 0',
                          transition: 'all 0.3s ease'
                        }} className="instruction-section">
                          {step.desc}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                          {step.desc.substring(0, 60)}...
                        </Typography>
                      )}
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>          
          <div className="result-section guidelines">
            <h3 
              onClick={() => setGuidelinesExpanded(!guidelinesExpanded)} 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              📜 AVPN Official Guidelines Summary
              <span style={{ fontSize: '1rem' }}>
                {guidelinesExpanded ? '▼' : '▶'}
              </span>
            </h3>
            
            {guidelinesExpanded && (
              <>
                <ul className="avpn-guidelines">
                  <li><strong>🌾 Flour Specifications:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Type 00 flour with W value between 250-320</li>
                      <li>Protein content: 11-13.5%</li>
                      <li>Absorption rate: 55-62%</li>
                    </ul>
                  </li>
                  <li><strong>🧂 Ingredient Percentages:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Water: <strong>55-62%</strong> of flour weight (hydration)</li>
                      <li>Salt: <strong>2-3%</strong> of flour weight</li>
                      <li>Fresh Yeast: <strong>0.2-0.3%</strong> of flour weight</li>
                      <li>Dry Yeast: <strong>0.1-0.2%</strong> of flour weight</li>
                      <li>Sourdough Starter: <strong>5-20%</strong> of flour weight</li>
                    </ul>
                  </li>
                  <li><strong>🕒 Fermentation Requirements:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Direct Method with Fresh Yeast: minimum <strong>8-12 hours</strong></li>
                      <li>Direct Method with Dry Yeast: minimum <strong>8 hours</strong></li>
                      <li>Sourdough Method: minimum <strong>16-24 hours</strong></li>
                      <li>Poolish Method: minimum <strong>16-18 hours</strong> (4-6h for pre-ferment + 12h for dough)</li>
                      <li>Biga Method: minimum <strong>18-24 hours</strong> (6-18h for pre-ferment + 12h for dough)</li>
                    </ul>
                  </li>
                  <li><strong>🌡️ Temperature Controls:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Room Temperature Fermentation: <strong>22-25°C</strong></li>
                      <li>Cold Fermentation: <strong>4-6°C</strong></li>
                      <li>Dough Temperature after Mixing: <strong>23-25°C</strong></li>
                    </ul>
                  </li>
                  <li><strong>🥣 Preparation Process:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Mixing: 10-15 minutes until smooth texture</li>
                      <li>First Rest: 20-30 minutes at room temperature</li>
                      <li>Bulk Fermentation: 6-24 hours depending on method</li>
                      <li>Balling: Form dough balls of 200-280g</li>
                      <li>Final Proof: Approximately <strong>2 hours</strong> before baking</li>
                    </ul>
                  </li>
                  <li><strong>🍕 Cooking Specifications:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>Oven Temperature: <strong>430-480°C</strong></li>
                      <li>Cooking Surface: <strong>380-430°C</strong></li>
                      <li>Cooking Time: <strong>60-90 seconds</strong></li>
                      <li>Traditional Wood-fired Oven Recommended</li>
                      <li>Final Diameter: 22-35cm with raised border (cornicione) of 1-2cm</li>
                    </ul>
                  </li>
                  <li><strong>⚠️ Important Notes:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li>No mechanical or automated press devices allowed</li>
                      <li>Manual handling and stretching only</li>
                      <li>No rolling pins or mechanical dough shaping</li>
                      <li>No oils or fats in the dough (except on the surface for storage)</li>
                    </ul>
                  </li>
                </ul>
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>🔗 Official References:</strong></p>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    📄 <a href="https://www.pizzanapoletana.org/public/pdf/Disciplinare-2024-ENG.pdf" target="_blank" rel="noopener noreferrer">2024 AVPN Guidelines (PDF)</a><br />
                    🌐 <a href="https://www.pizzanapoletana.org/en/ricetta_pizza_napoletana" target="_blank" rel="noopener noreferrer">AVPN Pizza Napoletana Recipe (Webpage)</a>
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
