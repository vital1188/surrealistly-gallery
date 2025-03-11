import React, { useState, useRef, useEffect } from 'react';
import { ArtworkType } from '../types';
import gsap from 'gsap';

interface MonolithProps {
  artwork: ArtworkType;
  index: number;
  setSelectedArtwork: (artwork: ArtworkType) => void;
}

const Monolith: React.FC<MonolithProps> = ({ artwork, index, setSelectedArtwork }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNeonFlicker, setShowNeonFlicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const tvNoiseRef = useRef<HTMLDivElement>(null);
  
  // Convert Google Drive link to thumbnail URL
  const getThumbnailUrl = (url: string) => {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
    }
    return url;
  };

  // Animation for lines when hovering
  useEffect(() => {
    if (!linesRef.current) return;
    
    const lines = linesRef.current.querySelectorAll('.line');
    
    if (isHovered) {
      gsap.to(lines, {
        width: '100%',
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.out'
      });
      
      // Add hover effects
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          backgroundColor: 'rgba(30, 30, 30, 0.3)',
          duration: 0.3
        });
      }
      
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -5,
          textShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
          duration: 0.4
        });
      }
      
      if (imageContainerRef.current) {
        gsap.to(imageContainerRef.current, {
          filter: 'grayscale(0%) brightness(1.1)',
          duration: 0.5
        });
      }
    } else {
      gsap.to(lines, {
        width: index % 2 === 0 ? '60%' : '40%',
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.in'
      });
      
      // Remove hover effects
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          duration: 0.3
        });
      }
      
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: 0,
          textShadow: '0 0 0px rgba(255, 255, 255, 0)',
          duration: 0.4
        });
      }
      
      if (imageContainerRef.current) {
        gsap.to(imageContainerRef.current, {
          filter: 'grayscale(100%) brightness(0.8)',
          duration: 0.5
        });
      }
    }
  }, [isHovered, index]);

  // Initial animation on mount
  useEffect(() => {
    if (!containerRef.current || !linesRef.current) return;
    
    const lines = linesRef.current.querySelectorAll('.line');
    
    gsap.set(lines, { width: 0 });
    
    gsap.to(lines, {
      width: index % 2 === 0 ? '60%' : '40%',
      duration: 0.8,
      stagger: 0.05,
      delay: 0.1 + (index * 0.1),
      ease: 'power3.out'
    });
    
    // Set initial states
    if (imageContainerRef.current) {
      gsap.set(imageContainerRef.current, { filter: 'grayscale(100%) brightness(0.8)' });
    }
  }, [index]);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 1.05 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }
  };

  // Random neon flickering effect
  useEffect(() => {
    // Randomly trigger neon flicker effect
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to flicker
        setShowNeonFlicker(true);
        
        // Show TV noise effect
        if (tvNoiseRef.current) {
          gsap.to(tvNoiseRef.current, {
            opacity: 0.5,
            duration: 0.1
          });
        }
        
        // Show image briefly with neon glow
        if (imageContainerRef.current) {
          gsap.to(imageContainerRef.current, {
            clipPath: 'inset(0% 0% 0% 0%)',
            filter: 'grayscale(0%) brightness(1.2) contrast(1.2)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.5)',
            duration: 0.1
          });
        }
        
        // Hide after a brief moment
        setTimeout(() => {
          setShowNeonFlicker(false);
          
          // Hide TV noise
          if (tvNoiseRef.current) {
            gsap.to(tvNoiseRef.current, {
              opacity: 0,
              duration: 0.2
            });
          }
          
          // Hide image
          if (imageContainerRef.current && !isHovered) {
            gsap.to(imageContainerRef.current, {
              clipPath: 'inset(0% 100% 0% 0%)',
              filter: 'grayscale(100%) brightness(0.8)',
              boxShadow: 'none',
              duration: 0.2
            });
          }
        }, Math.random() * 200 + 100); // Random duration between 100-300ms
      }
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(flickerInterval);
  }, [isHovered]);

  return (
    <div 
      ref={containerRef}
      className="mb-12 relative cursor-pointer"
      onClick={() => setSelectedArtwork(artwork)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Lines visualization */}
        <div 
          ref={linesRef}
          className="w-full md:w-1/3 flex flex-col gap-1"
        >
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`line h-px bg-white ${i % 3 === 0 ? 'opacity-80' : 'opacity-40'}`}
              style={{ 
                width: 0,
                transformOrigin: index % 2 === 0 ? 'left' : 'right'
              }}
            />
          ))}
        </div>
        
        {/* Artwork preview */}
        <div 
          className="w-full md:w-2/3 overflow-hidden relative"
        >
          {/* TV Noise effect */}
          <div 
            ref={tvNoiseRef}
            className="absolute inset-0 z-10 pointer-events-none tv-noise"
            style={{ 
              opacity: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              mixBlendMode: 'screen'
            }}
          />
          
          {/* Artwork image (hidden initially, revealed on hover or flicker) */}
          <div 
            ref={imageContainerRef}
            className="relative overflow-hidden"
            style={{ 
              height: '180px',
              clipPath: isHovered || showNeonFlicker ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
              transition: isHovered ? 'clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              boxShadow: showNeonFlicker ? '0 0 15px rgba(255, 255, 255, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.5)' : 'none'
            }}
          >
            <img
              ref={imageRef}
              src={getThumbnailUrl(artwork.imageUrl)}
              alt={artwork.title}
              className="w-full h-full object-cover opacity-0"
              style={{ 
                objectPosition: 'center',
                WebkitUserDrag: 'none',
                userSelect: 'none'
              }}
              onLoad={handleImageLoad}
            />
            
            {/* Surrealist glitch effect overlay */}
            {(isHovered || showNeonFlicker) && isLoaded && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 mix-blend-overlay opacity-30 z-10 glitch-effect"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 z-20 animate-glitch-slide"></div>
              </div>
            )}
            
            {/* Neon flicker scanlines */}
            {showNeonFlicker && (
              <div 
                className="absolute inset-0 pointer-events-none z-30 scanlines"
                style={{
                  background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
                  backgroundSize: '100% 4px',
                  mixBlendMode: 'overlay',
                  animation: 'scanline 0.1s linear infinite'
                }}
              />
            )}
          </div>
          
          {/* Artwork title */}
          <h3 
            ref={titleRef}
            className="text-xl font-bold mt-4 font-mono tracking-tight"
          >
            {artwork.title}
          </h3>
          
          {/* Artwork metadata */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400 font-mono">
            <span>{artwork.year}</span>
            <span>#{String(artwork.id).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
      
      {/* Brutalist design element - bottom line */}
      <div className="w-full h-px bg-white/10 mt-8"></div>
    </div>
  );
};

export default Monolith;
