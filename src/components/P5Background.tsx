import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a new p5 instance
    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      const particleCount = 50;
      
      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        size: number;
        color: number;
        
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.2, 0.2));
          this.size = p.random(1, 3);
          this.color = p.random(150, 255);
        }
        
        update() {
          this.pos.add(this.vel);
          
          // Wrap around edges
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
          if (this.pos.y > p.height) this.pos.y = 0;
        }
        
        display() {
          p.noStroke();
          p.fill(this.color, this.color, this.color, 30);
          p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
        }
        
        connect(particles: Particle[]) {
          particles.forEach(other => {
            const d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (d < 100) {
              const alpha = p.map(d, 0, 100, 30, 0);
              p.stroke(255, 255, 255, alpha);
              p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
          });
        }
      }
      
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
      };
      
      p.draw = () => {
        p.clear();
        
        // Update and display particles
        particles.forEach(particle => {
          particle.update();
          particle.display();
          particle.connect(particles);
        });
      };
      
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };
    
    // Create new p5 instance
    const p5Instance = new p5(sketch, containerRef.current);
    
    // Cleanup
    return () => {
      p5Instance.remove();
    };
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default P5Background;
