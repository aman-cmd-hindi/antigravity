import { useState, useEffect } from 'react';

export default function useTilt(active = true) {
  const [style, setStyle] = useState({});
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (e) => setIsTouch(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!active || isTouch) {
    return { style: {}, onMouseMove: null, onMouseLeave: null };
  }

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Subtle 8-degree maximum rotation
    const rotateY = ((x - xc) / xc) * 8;
    const rotateX = -((y - yc) / yc) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
    });
  };

  return {
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  };
}
