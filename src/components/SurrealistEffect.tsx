import React, { useRef, useEffect } from 'react';

const SurrealistEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Surrealist floating objects
    class FloatingObject {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 50 + 20;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`;
        this.speed = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
      }
      
      update(time: number) {
        // Surrealist floating motion
        this.x += Math.cos(this.angle + time * 0.001) * this.speed;
        this.y += Math.sin(this.angle + time * 0.001) * this.speed;
        
        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
      
      draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(time * 0.0005 * this.speed);
        
        // Draw wireframe icosahedron (simplified as polygon)
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        const sides = Math.floor(Math.random() * 3) + 3; // 3 to 5 sides
        const radius = this.size / 2;
        
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
        
        // Add some internal lines for wireframe effect
        for (let i = 0; i < sides - 2; i++) {
          const angle1 = (i / sides) * Math.PI * 2;
          const x1 = Math.cos(angle1) * radius;
          const y1 = Math.sin(angle1) * radius;
          
          for (let j = i + 2; j < sides; j++) {
            if (j !== i + 1 && j !== (i - 1 + sides) % sides) {
              const angle2 = (j / sides) * Math.PI * 2;
              const x2 = Math.cos(angle2) * radius;
              const y2 = Math.sin(angle2) * radius;
              
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }
        }
        
        ctx.restore();
      }
    }
    
    // Create floating objects
    const objects: FloatingObject[] = [];
    for (let i = 0; i < 15; i++) {
      objects.push(new FloatingObject());
    }
    
    // Animation loop
    let animationId: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw objects
      objects.forEach(obj => {
        obj.update(time);
        obj.draw(ctx, time);
      });
      
      // Add occasional glitch effect
      if (Math.random() < 0.01) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-60"
      style={{ 
        opacity: 0,
        animation: 'fadeIn 2s forwards',
      }}
    />
  );
};

export default SurrealistEffect;
