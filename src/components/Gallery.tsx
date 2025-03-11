import React, { useState, useEffect, useRef } from 'react';
import { artworks } from '../data/artworks';
import { ArtworkType } from '../types';
import ArtworkDetail from './ArtworkDetail';
import gsap from 'gsap';

const Gallery: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [revealedArtworks, setRevealedArtworks] = useState<Set<number>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate loading delay for smoother transitions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleArtworkSelect = (artwork: ArtworkType) => {
    setSelectedArtwork(artwork);
    
    // Mark artwork as revealed
    setRevealedArtworks(prev => {
      const newSet = new Set(prev);
      newSet.add(artwork.id);
      return newSet;
    });
  };
  
  const handleCloseDetail = () => {
    setSelectedArtwork(null);
  };

  // Convert Google Drive link to thumbnail URL
  const getThumbnailUrl = (url: string) => {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
    }
    return url;
  };

  // Handle hover effects
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Determine if artwork has been revealed
  const isArtworkRevealed = (id: number) => {
    return revealedArtworks.has(id);
  };
  
  return (
    <div className="relative" ref={galleryRef}>
      <div className="container mx-auto px-4 py-12">
        {/* Gallery header */}
        <div className="mb-16 relative">
          <div className="w-full h-px bg-white/20 mb-8"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tighter">
                DIGITAL SURREALISM
              </h1>
              <p className="text-gray-400 max-w-2xl leading-relaxed">
                A collection of AI-generated surrealist artworks exploring the boundaries between 
                consciousness and digital dreams. Each piece represents a unique intersection of 
                human creativity and machine interpretation.
              </p>
            </div>
            
            <div className="font-mono text-xs text-white/50 uppercase tracking-wider">
              <div className="flex flex-col items-end">
                <span>COLLECTION 01</span>
                <span>BRUTALIST SURREALISM</span>
                <span>2024—2025</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-px bg-white/20 mt-8"></div>
        </div>
        
        {/* Enhanced Brutalist Grid Layout */}
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Main grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2">
            {artworks.map((artwork, index) => {
              const isRevealed = isArtworkRevealed(artwork.id);
              
              return (
                <div 
                  key={artwork.id}
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => handleArtworkSelect(artwork)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Artwork container with brutalist frame */}
                  <div 
                    className="relative aspect-[4/5] overflow-hidden border border-white/10 transition-all duration-500"
                    style={{ 
                      borderWidth: '0.5px',
                      boxShadow: hoveredIndex === index ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'none'
                    }}
                  >
                    {/* Mystery overlay - only shown if not revealed */}
                    {!isRevealed && (
                      <div 
                        className="absolute inset-0 z-20 bg-black flex items-center justify-center overflow-hidden"
                        style={{
                          opacity: hoveredIndex === index ? 0.7 : 0.9,
                          transition: 'opacity 0.5s ease'
                        }}
                      >
                        <div className="relative">
                          {/* Mysterious code/ID */}
                          <div 
                            className="font-mono text-xs text-white/70 absolute -top-6 left-1/2 transform -translate-x-1/2"
                            style={{
                              letterSpacing: '0.2em',
                              opacity: hoveredIndex === index ? 1 : 0.5,
                              transition: 'opacity 0.3s ease'
                            }}
                          >
                            {`SR-${String(artwork.id).padStart(3, '0')}`}
                          </div>
                          
                          {/* Mysterious symbol */}
                          <div 
                            className="text-white font-mono text-4xl transform transition-all duration-500"
                            style={{
                              opacity: hoveredIndex === index ? 1 : 0.3,
                              transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)',
                              letterSpacing: '0.1em'
                            }}
                          >
                            {artwork.id % 3 === 0 ? '◈' : artwork.id % 3 === 1 ? '◎' : '⧫'}
                          </div>
                          
                          {/* Reveal text */}
                          <div 
                            className="font-mono text-xs text-white/70 absolute -bottom-6 left-1/2 transform -translate-x-1/2 uppercase"
                            style={{
                              letterSpacing: '0.2em',
                              opacity: hoveredIndex === index ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          >
                            Reveal
                          </div>
                        </div>
                        
                        {/* Brutalist grid overlay for mystery state */}
                        <div 
                          className="absolute inset-0 grid grid-cols-4 grid-rows-5 pointer-events-none opacity-30"
                          style={{ opacity: hoveredIndex === index ? 0.5 : 0.2 }}
                        >
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className="border border-white/10" style={{ borderWidth: '0.5px' }}></div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Artwork image with grayscale filter */}
                    <div 
                      className="w-full h-full transition-all duration-500 ease-out"
                      style={{ 
                        filter: (hoveredIndex === index || isRevealed) ? 'grayscale(0%) contrast(1.1)' : 'grayscale(100%) contrast(0.9)',
                        transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                        opacity: isRevealed ? 1 : hoveredIndex === index ? 0.9 : 0.7
                      }}
                    >
                      <img
                        src={getThumbnailUrl(artwork.imageUrl)}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                        style={{ 
                          objectPosition: 'center',
                          WebkitUserDrag: 'none',
                          userSelect: 'none'
                        }}
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Optimized noise overlay - CSS based instead of SVG */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{ 
                        opacity: hoveredIndex === index ? 0.1 : 0.05,
                        backgroundImage: 'url("data:image/png;base64,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")',
                        backgroundRepeat: 'repeat',
                        mixBlendMode: 'overlay',
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    
                    {/* Simplified brutalist grid overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ opacity: 0.1 }}
                    >
                      <div className="w-full h-px bg-white/30 absolute top-1/4"></div>
                      <div className="w-full h-px bg-white/30 absolute top-2/4"></div>
                      <div className="w-full h-px bg-white/30 absolute top-3/4"></div>
                      <div className="h-full w-px bg-white/30 absolute left-1/4"></div>
                      <div className="h-full w-px bg-white/30 absolute left-2/4"></div>
                      <div className="h-full w-px bg-white/30 absolute left-3/4"></div>
                    </div>
                    
                    {/* Artwork info overlay - appears on hover */}
                    <div 
                      className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
                      style={{ 
                        opacity: hoveredIndex === index ? 1 : 0,
                        transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease'
                      }}
                    >
                      <h3 className="text-lg font-bold font-mono tracking-tight text-white">
                        {artwork.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-300 font-mono">{artwork.year}</span>
                        <span className="text-xs text-gray-300 font-mono">#{String(artwork.id).padStart(3, '0')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Brutalist label - always visible */}
                  <div className="mt-2 mb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-mono tracking-tight text-white/80">
                        {isRevealed ? artwork.title : `ARTWORK #${String(artwork.id).padStart(3, '0')}`}
                      </h4>
                      <span className="text-xs text-white/50 font-mono">{artwork.year.split(' ')[0]}</span>
                    </div>
                    <div className="w-full h-px bg-white/10 mt-2"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Brutalist footer element */}
          <div className="mt-16 pt-8 border-t border-white/10" style={{ borderWidth: '0.5px' }}>
            <div className="flex justify-between items-center">
              <div className="font-mono text-xs text-white/50">
                TOTAL ARTWORKS: {artworks.length}
              </div>
              <div className="font-mono text-xs text-white/50">
                REVEALED: {revealedArtworks.size} / {artworks.length}
              </div>
              <div className="font-mono text-xs text-white/50">
                SURREALISTLY © 2024—2025
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Artwork detail modal */}
      {selectedArtwork && (
        <ArtworkDetail 
          artwork={selectedArtwork}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Gallery;
