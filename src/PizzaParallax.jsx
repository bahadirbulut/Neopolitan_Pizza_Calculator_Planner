import React, { useEffect, useState, useRef } from 'react';
import './PizzaParallax.css';

const PizzaParallax = ({ children, language }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  
  // Texts for different languages
  const texts = {
    en: {
      title: "Neapolitan Pizza",
      subtitle: "Authentic and Traditional",
      scroll: "Scroll down to get started"
    },
    tr: {
      title: "Napoliten Pizza",
      subtitle: "Otantik ve Geleneksel",
      scroll: "Başlamak için aşağı kaydırın"
    }
  };
  
  const t = texts[language] || texts.en;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Trigger a small animation on first load
    const timer = setTimeout(() => {
      const tomato = document.querySelector('.parallax-tomato');
      const basil = document.querySelector('.parallax-basil');
      
      if (tomato) tomato.style.transform = 'rotate(5deg)';
      if (basil) basil.style.transform = 'rotate(-30deg)';
      
      setTimeout(() => {
        if (tomato) tomato.style.transform = 'rotate(0deg)';
        if (basil) basil.style.transform = 'rotate(-25deg)';
      }, 300);
    }, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <div className="pizza-parallax-root" ref={containerRef}>
      {/* Background elements with parallax effect */}
      <div 
        className="parallax-background"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      ></div>
      
      {/* Flour dust */}
      <div 
        className="parallax-flour-1"
        style={{ transform: `translate(${scrollY * 0.2}px, ${scrollY * -0.1}px)` }}
      ></div>
      
      <div 
        className="parallax-flour-2"
        style={{ transform: `translate(${scrollY * -0.15}px, ${scrollY * -0.05}px)` }}
      ></div>
      
      {/* Title with parallax effect */}
      <div 
        className="parallax-title-container"
        style={{ 
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.4}px))`, 
          opacity: Math.max(0, 1 - scrollY * 0.0015) 
        }}
      >
        <h1 className="parallax-main-title">{t.title}</h1>
        <h2 className="parallax-subtitle">{t.subtitle}</h2>
        <div className="scroll-indicator">
          {t.scroll}
          <div className="scroll-arrow">↓</div>
        </div>
      </div>
      
      {/* Tomato element */}
      <div 
        className="parallax-tomato"
        style={{ transform: `translate(${scrollY * -0.2}px, ${scrollY * 0.3}px) rotate(${scrollY * 0.05}deg)` }}
      ></div>
      
      {/* Basil element */}
      <div 
        className="parallax-basil"
        style={{ transform: `translate(${scrollY * 0.25}px, ${scrollY * 0.25}px) rotate(${-25 + scrollY * -0.05}deg)` }}
      ></div>
      
      {/* Main content with slight parallax */}
      <div 
        className="parallax-content"
        style={{ transform: scrollY > 100 ? 'translateY(0)' : `translateY(${100 - scrollY}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default PizzaParallax;