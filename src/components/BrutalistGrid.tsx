import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import gsap from 'gsap';

interface BrutalistGridProps {
  columns?: number;
  rows?: number;
  color?: string;
  opacity?: number;
  interactive?: boolean;
  showTVNoise?: boolean;
  showNeonFlicker?: boolean;
}

const BrutalistGrid: React.FC<BrutalistGridProps> = ({
  columns = 12,
  rows = 8,
  color = 'white',
  opacity = 0.05,
  interactive = true,
  showTVNoise = true,
  showNeonFlicker = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSquare, setActiveSquare] = useState<number | null>(null);
  const [squares, setSquares] = useState<Array<{ x: number, y: number, rotation: number, noiseOpacity: number, neonGlow: boolean }>>([]);
  
  // Initialize squares positions
  useEffect(() => {
    const initialSquares = Array(columns * rows).fill(0).map(() => ({
      x: 0,
      y: 0,
      rotation: 0,
      noiseOpacity: 0,
      neonGlow: false
    }));
    setSquares(initialSquares);
  }, [columns, rows]);

  // TV Noise effect
  useEffect(() => {
    if (!showTVNoise || !noiseCanvasRef.current) return;
    
    const canvas = noiseCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Generate TV noise
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.floor(Math.random() * 255);
        data[i] = noise;     // red
        data[i + 1] = noise; // green
        data[i + 2] = noise; // blue
        data[i + 3] = Math.random() * 50; // alpha (semi-transparent)
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    // Animation loop for TV noise
    let animationId: number;
    const animate = () => {
      generateNoise();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [showTVNoise]);

  // Animate grid on mount
  useEffect(() => {
    if (gridRef.current) {
      // Animate grid lines
      const gridItems = gridRef.current.querySelectorAll('.grid-item');
      
      gsap.fromTo(gridItems, 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: opacity, 
          scale: 1, 
          duration: 1.5, 
          stagger: {
            amount: 1,
            grid: [columns, rows],
            from: "center"
          },
          ease: "power3.out"
        }
      );
    }
  }, [columns, rows, opacity]);

  // Neon flickering effect
  useEffect(() => {
    if (!showNeonFlicker) return;
    
    const flickerInterval = setInterval(() => {
      // Randomly select a cell to flicker
      const randomIndex = Math.floor(Math.random() * squares.length);
      
      // Create a new array with the updated cell
      const newSquares = [...squares];
      
      // Toggle neon glow for the selected cell
      newSquares[randomIndex] = {
        ...newSquares[randomIndex],
        neonGlow: true
      };
      
      setSquares(newSquares);
      
      // Turn off the neon glow after a short delay
      setTimeout(() => {
        const updatedSquares = [...newSquares];
        updatedSquares[randomIndex] = {
          ...updatedSquares[randomIndex],
          neonGlow: false
        };
        setSquares(updatedSquares);
      }, Math.random() * 200 + 50); // Random duration between 50-250ms
    }, 500); // Flicker every 500ms
    
    return () => clearInterval(flickerInterval);
  }, [squares, showNeonFlicker]);

  // Handle square activation
  const handleSquareActivate = (index: number) => {
    if (!interactive) return;
    
    setActiveSquare(index);
    
    // Create ripple effect from the activated square
    if (gridRef.current) {
      const gridItems = gridRef.current.querySelectorAll('.grid-item');
      const centerX = index % columns;
      const centerY = Math.floor(index / columns);
      
      gridItems.forEach((item, i) => {
        const x = i % columns;
        const y = Math.floor(i / columns);
        
        // Calculate distance from center
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(columns, 2) + Math.pow(rows, 2));
        const normalizedDistance = distance / maxDistance;
        
        gsap.to(item, {
          opacity: opacity * (1 + (1 - normalizedDistance)),
          scale: 1 + (0.2 * (1 - normalizedDistance)),
          duration: 0.5,
          ease: "power2.out"
        });
      });
      
      // Increase TV noise opacity for the active square
      const newSquares = [...squares];
      newSquares[index] = {
        ...newSquares[index],
        noiseOpacity: 0.5, // Increase noise opacity
        neonGlow: true // Activate neon glow
      };
      setSquares(newSquares);
      
      // Reset noise opacity and neon glow after a delay
      setTimeout(() => {
        const updatedSquares = [...newSquares];
        updatedSquares[index] = {
          ...updatedSquares[index],
          noiseOpacity: 0,
          neonGlow: false
        };
        setSquares(updatedSquares);
      }, 800);
    }
  };

  // Handle square deactivation
  const handleSquareDeactivate = () => {
    if (!interactive || activeSquare === null) return;
    
    setActiveSquare(null);
    
    // Reset all squares
    if (gridRef.current) {
      const gridItems = gridRef.current.querySelectorAll('.grid-item');
      
      gridItems.forEach((item) => {
        gsap.to(item, {
          opacity: opacity,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    }
  };

  // Handle square drag
  const handleDrag = (index: number, e: any, data: { x: number, y: number }) => {
    if (!interactive) return;
    
    const newSquares = [...squares];
    newSquares[index] = {
      ...newSquares[index],
      x: data.x,
      y: data.y,
      rotation: (Math.abs(data.x) + Math.abs(data.y)) * 0.1,
      noiseOpacity: 0.3 // Add noise during drag
    };
    setSquares(newSquares);
    
    // Update neighboring squares
    const x = index % columns;
    const y = Math.floor(index / columns);
    
    const neighbors = [
      { x: x-1, y: y },
      { x: x+1, y: y },
      { x: x, y: y-1 },
      { x: x, y: y+1 }
    ].filter(pos => 
      pos.x >= 0 && pos.x < columns && 
      pos.y >= 0 && pos.y < rows
    );
    
    neighbors.forEach(pos => {
      const neighborIndex = pos.y * columns + pos.x;
      const neighborSquare = newSquares[neighborIndex];
      
      if (neighborSquare) {
        newSquares[neighborIndex] = {
          ...neighborSquare,
          x: neighborSquare.x + (data.x * 0.1),
          y: neighborSquare.y + (data.y * 0.1),
          rotation: neighborSquare.rotation + (Math.abs(data.x) + Math.abs(data.y)) * 0.02,
          noiseOpacity: 0.1 // Add slight noise to neighbors
        };
      }
    });
    
    setSquares(newSquares);
  };

  // Handle square drag stop
  const handleDragStop = () => {
    if (!interactive) return;
    
    // Animate squares back to original position
    const newSquares = squares.map(square => ({
      ...square,
      x: 0,
      y: 0,
      rotation: 0,
      noiseOpacity: 0 // Reset noise
    }));
    
    setSquares(newSquares);
    
    if (gridRef.current) {
      const gridItems = gridRef.current.querySelectorAll('.grid-item');
      
      gridItems.forEach((item, i) => {
        gsap.to(item, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        });
      });
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* TV Noise canvas */}
      {showTVNoise && (
        <canvas 
          ref={noiseCanvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 0.05 }}
        />
      )}
      
      {/* Grid */}
      <div 
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          opacity: 0.8
        }}
      >
        {squares.map((square, index) => (
          <Draggable
            key={index}
            disabled={!interactive}
            onStart={() => handleSquareActivate(index)}
            onDrag={(e, data) => handleDrag(index, e, data)}
            onStop={handleDragStop}
            position={{ x: square.x, y: square.y }}
          >
            <div 
              className={`grid-item ${activeSquare === index ? 'z-10' : ''}`}
              style={{ 
                borderColor: color,
                borderWidth: '0.5px', // Finer lines for sleeker look
                opacity: opacity,
                transform: `rotate(${square.rotation}deg)`,
                transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                pointerEvents: interactive ? 'auto' : 'none',
                cursor: interactive ? 'grab' : 'default',
                position: 'relative',
                boxShadow: square.neonGlow ? `0 0 8px 2px rgba(255, 255, 255, 0.7), inset 0 0 8px 2px rgba(255, 255, 255, 0.7)` : 'none'
              }}
              onMouseEnter={() => handleSquareActivate(index)}
              onMouseLeave={handleSquareDeactivate}
            >
              {/* TV Noise overlay for each cell */}
              {showTVNoise && square.noiseOpacity > 0 && (
                <div 
                  className="absolute inset-0 tv-noise"
                  style={{ 
                    opacity: square.noiseOpacity,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'screen'
                  }}
                />
              )}
              
              {/* Neon flicker effect */}
              {showNeonFlicker && square.neonGlow && (
                <div 
                  className="absolute inset-0 neon-flicker"
                  style={{
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
                    animation: 'neonFlicker 0.2s ease-in-out'
                  }}
                />
              )}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default BrutalistGrid;
