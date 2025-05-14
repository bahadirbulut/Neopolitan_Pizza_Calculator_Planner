// New file for title animation component
import React, { useState, useEffect, useRef } from 'react';
import { useTransition, animated } from '@react-spring/web';

const AnimatedTitle = ({ title }) => {
  // Split the title into words for animation
  const words = title.split(' ');
  const [items, setItems] = useState([]);
  const ref = useRef([]);
  
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: 'perspective(600px) rotateX(0deg)',
      color: '#8fa5b6',
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: 'perspective(600px) rotateX(180deg)', color: '#28d79f' },
      { transform: 'perspective(600px) rotateX(0deg)', color: 'var(--italian-red)' },
    ],
    leave: [{ color: '#c23369' }, { innerHeight: 0 }, { opacity: 0, height: 0 }],
    update: { color: '#28b4d7' },
    trail: 400,
  });

  // Reset animation
  const reset = () => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    setItems([]);
    
    // Add each word with a delay
    words.forEach((word, i) => {
      ref.current.push(
        setTimeout(() => {
          setItems(prevItems => [...prevItems, word]);
        }, i * 400)
      );
    });
  };

  // Run animation on mount and cleanup on unmount
  useEffect(() => {
    reset();
    
    // Repeat the animation every 20 seconds
    const interval = setInterval(reset, 20000);
    
    return () => {
      clearInterval(interval);
      ref.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div style={{ cursor: 'pointer' }} onClick={reset}>
      <div style={{ position: 'relative' }}>
        {transitions((style, item, _, index) => (
          <animated.div
            style={{
              ...style,
              overflow: 'hidden',
              display: 'inline-block',
              marginRight: '8px',
              textAlign: 'center',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              willChange: 'transform, opacity, height',
            }}
          >
            <animated.div style={{ overflow: 'hidden', height: style.innerHeight }}>
              {item}
            </animated.div>
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedTitle;