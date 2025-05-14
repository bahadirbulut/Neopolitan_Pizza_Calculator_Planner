// App.jsx - Main component for the Neapolitan Pizza Calculator
// Note: Custom favicon is defined in index.html
console.log('App.jsx is loading...'); // Debug message to check if the file loads

import { useState, useRef, useLayoutEffect } from 'react';
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
import { Typography, useMediaQuery, FormControlLabel, Switch } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import InventoryIcon from '@mui/icons-material/Inventory';
import CircleIcon from '@mui/icons-material/Circle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useSpring, animated, config } from 'react-spring';
import React from 'react';
import PizzaParallax from './PizzaParallax';

// Language translations
// ...existing code for translations...

// Helper component for expandable content with react-spring
const ExpandableContent = ({ isVisible, children }) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isVisible, contentRef]);

  const animation = useSpring({
    height: isVisible ? contentHeight : 0,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-10px)',
    config: config.gentle,
  });

  return (
    <animated.div style={{ ...animation, overflow: 'hidden' }}>
      <div ref={contentRef}>
        {children}
      </div>
    </animated.div>
  );
};

const getYeastColor = (type) => {
  console.log('getYeastColor called with type:', type); // Debug log
  switch (type) {
    case 'sourdough': return '#8e44ad'; // Purple for sourdough
    case 'fresh': return 'var(--italian-red)'; // Red for fresh yeast
    default: return 'var(--italian-green)'; // Green for dry yeast
  }
};

function App() {  
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  
  // ...existing state and methods...

  // Use animation springs for various sections
  const recipeSpring = useSpring({
    opacity: result ? 1 : 0,
    transform: result ? 'translateY(0px)' : 'translateY(20px)',
    config: config.gentle,
    delay: result ? 200 : 0,
  });

  const timelineSpring = useSpring({
    opacity: result ? 1 : 0,
    transform: result ? 'translateY(0px)' : 'translateY(20px)',
    config: config.gentle,
    delay: result ? 400 : 0, 
  });

  const guidelinesSpring = useSpring({
    opacity: result ? 1 : 0,
    transform: result ? 'translateY(0px)' : 'translateY(20px)',
    config: config.gentle,
    delay: result ? 600 : 0,
  });

  return (
    <PizzaParallax language={language}>
      <div className="container">        
        <div className="app-header">
          <div className="title-container">
            <h1>{t.appTitle}</h1>
            <p className="header-tagline">{t.tagline}</p>
          </div>        
          <div className="language-toggle">
            <FormControlLabel
              control={
                <Switch
                  checked={language === 'tr'}
                  onChange={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              }            
              label={language === 'en' ? 'Türkçe' : 'English'}
              sx={{ 
                margin: '0',
                '& .MuiFormControlLabel-label': {
                  fontSize: isMobile ? '0.7rem' : '0.9rem',
                  fontWeight: 'bold'
                },
                '@media (max-width: 400px)': {
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.65rem'
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="input-box">
          {/* ... your input fields here ... */}
        </div>
        
        {warning && (
          <div style={{ /* ... warning styles ... */ }}>
            {/* ... warning content ... */}
          </div>
        )}
        
        {result && (
          <>          
            <animated.div style={recipeSpring} className="result-section recipe" ref={recipeRef}>
              {/* ... recipe content ... */}
            </animated.div>
            <animated.div style={timelineSpring} className="result-section timeline">
              {/* ... timeline content ... */}
            </animated.div>          
            <animated.div style={guidelinesSpring} className="result-section guidelines">
              {/* ... guidelines content ... */}
            </animated.div>
          </>
        )}
      </div>
    </PizzaParallax>
  );
}

export default App;