import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Logo: React.FC = () => {
  const lRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);
  const tmRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (lRef.current && yRef.current && tmRef.current) {
      // Initial position
      gsap.set(lRef.current, { 
        rotate: 0,
        y: 0,
        transformOrigin: 'center bottom'
      });
      
      gsap.set(yRef.current, { 
        rotate: 0,
        y: 0,
        x: 0,
        transformOrigin: 'center top'
      });
      
      // Animation timeline
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 6 });
      
      // L kicks Y animation
      tl.to(lRef.current, { 
        rotate: 15, 
        duration: 0.3, 
        ease: "power2.out" 
      })
      .to(lRef.current, { 
        rotate: 25, 
        duration: 0.2, 
        ease: "power1.in" 
      })
      .to(yRef.current, { 
        rotate: 45, 
        y: 40, 
        x: 20, 
        duration: 0.5, 
        ease: "power2.in" 
      }, "-=0.1")
      .to(lRef.current, { 
        rotate: 0, 
        duration: 0.5, 
        ease: "elastic.out(1, 0.3)",
        delay: 0.1
      })
      .to(yRef.current, { 
        rotate: 90, 
        y: 60, 
        x: 40, 
        duration: 0.4, 
        ease: "power1.in" 
      }, "-=0.3")
      .to(yRef.current, { 
        rotate: 0, 
        y: 0, 
        x: 0, 
        duration: 0.8, 
        ease: "elastic.out(1, 0.3)",
        delay: 1
      });
    }
  }, []);

  return (
    <div className="logo-container font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight relative py-4">
      <h1 className="inline-block">
        SURREALIST
        <span ref={lRef} className="inline-block">L</span>
        <span ref={yRef} className="inline-block">Y</span>
        <span ref={tmRef} className="text-sm align-super ml-1">TM</span>
      </h1>
    </div>
  );
};

export default Logo;
