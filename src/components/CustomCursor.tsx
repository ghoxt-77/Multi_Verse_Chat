
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    // Check for interactive elements to change cursor style
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.closest('[role="button"]') !== null;
      
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Animation frame for smooth cursor movement
    let animationFrame: number;
    
    const animateCursor = () => {
      setPosition(prev => {
        const dx = (targetPosition.x - prev.x) * 0.15;
        const dy = (targetPosition.y - prev.y) * 0.15;
        
        return {
          x: prev.x + dx,
          y: prev.y + dy
        };
      });
      
      animationFrame = requestAnimationFrame(animateCursor);
    };
    
    animationFrame = requestAnimationFrame(animateCursor);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, targetPosition]);

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
      {/* Main cursor */}
      <div 
        className={cn(
          "fixed z-50 pointer-events-none transition-all duration-100",
          isClicking ? "scale-75" : "",
          isHovering ? "scale-150" : ""
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)"
        }}
      >
        {/* Outer ring with contrasting color */}
        <div 
          className={cn(
            "absolute -inset-2 rounded-full",
            "bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink",
            "opacity-80 blur-sm",
            isClicking ? "scale-90 opacity-100" : "",
            isHovering ? "scale-75" : ""
          )}
          style={{
            animation: "pulse 2s infinite ease-in-out"
          }}
        />
        
        {/* Inner circle with contrasting color */}
        <div 
          className={cn(
            "relative w-5 h-5 bg-neon-green rounded-full",
            "flex items-center justify-center transition-all duration-200",
            isClicking ? "bg-neon-pink" : "",
            isHovering ? "bg-neon-blue" : ""
          )}
        >
          <div className="w-2 h-2 bg-dark-lighter rounded-full" />
        </div>
      </div>
      
      {/* Trail effect */}
      <div 
        className={cn(
          "fixed z-40 w-10 h-10 rounded-full pointer-events-none",
          "bg-gradient-to-r from-neon-green/20 to-neon-blue/20 blur-md"
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.6s cubic-bezier(0.23, 1, 0.32, 1), top 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          opacity: 0.6
        }}
      />
      
      {/* Second trailing element */}
      <div 
        className={cn(
          "fixed z-40 w-8 h-8 rounded-full pointer-events-none",
          "bg-gradient-to-r from-neon-pink/30 to-neon-purple/30 blur-md"
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.3s cubic-bezier(0.23, 1, 0.32, 1), top 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          opacity: 0.7
        }}
      />
    </>
  );
};

export default CustomCursor;
