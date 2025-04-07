
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Apply custom cursor styles to the body
  useEffect(() => {
    document.body.style.cursor = 'none';
    
    // Add cursor-none class to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
      el.classList.add('cursor-none');
    });
    
    return () => {
      document.body.style.cursor = '';
      
      // Remove cursor-none class
      interactiveElements.forEach(el => {
        el.classList.remove('cursor-none');
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor point */}
      <div 
        className={cn(
          "fixed z-50 pointer-events-none transition-transform duration-100",
          isClicking ? "scale-90" : ""
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)" 
        }}
      >
        {/* Outer glowing ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full opacity-70 blur-md" />
        
        {/* Inner circle */}
        <div className="relative w-4 h-4 bg-geek rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
      
      {/* Trail effect */}
      <div 
        className="fixed z-40 w-8 h-8 rounded-full pointer-events-none bg-geek/30 blur-sm"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.2s ease-out, left 0.5s ease-out, top 0.5s ease-out"
        }}
      />
    </>
  );
};

export default CustomCursor;
