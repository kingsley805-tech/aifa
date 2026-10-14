import React, { useRef, useState } from 'react';

/**
 * Interactive3DCard
 * Provides realistic 3D perspective mouse tilt with dynamic specular glare
 */
const Interactive3DCard = ({ children, className = '', depth = 20, glare = true }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Normalized tilt between -1 and 1
    const rotX = -((y - centerY) / centerY) * (depth / 1.5);
    const rotY = ((x - centerX) / centerX) * (depth / 1.5);

    setRotateX(rotX);
    setRotateY(rotY);

    if (glare) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.25,
      });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative w-full h-full preserve-3d">
        {children}
        
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(52, 211, 153, 0.45), transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Interactive3DCard;
