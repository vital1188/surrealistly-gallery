import React, { useRef, useEffect, useState } from 'react';
import { ArtworkType } from '../types';
import gsap from 'gsap';
import { X } from 'lucide-react';
import Watermark from './Watermark';

interface ArtworkDetailProps {
  artwork: ArtworkType;
  onClose: () => void;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [showNeonFlicker, setShowNeonFlicker] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const tvNoiseRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate modal opening
    if (modalRef.current && contentRef.current && imageRef.current && infoRef.current) {
      // Set initial states
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
      gsap.set(imageRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(infoRef.current, { opacity: 0, x: 20 });
      
      // Create timeline for modal animations
      const tl = gsap.timeline();
      
      // Fade in the modal background
      tl.to(modalRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        duration: 0.4,
        ease: "power2.out"
      });
      
      // Animate the content
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.1);
      
      // Animate the image
      tl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      }, 0.2);
      
      // Animate the info
      tl.to(infoRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.3);

      // Animate title and description
      if (titleRef.current && descriptionRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 10 });
        gsap.set(descriptionRef.current, { opacity: 0 });
        
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.5,
          ease: "power2.out"
        });
        
        gsap.to(descriptionRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 0.7,
          ease: "power2.out"
        });
      }

      // Start image hue-rotate animation
      if (imageContainerRef.current) {
        gsap.to(imageContainerRef.current, {
          filter: "hue-rotate(10deg)",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }
    
    // Add escape key listener
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Add hover effect to close button
    if (closeButtonRef.current) {
      closeButtonRef.current.addEventListener('mouseenter', () => {
        gsap.to(closeButtonRef.current, {
          rotation: 90,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      closeButtonRef.current.addEventListener('mouseleave', () => {
        gsap.to(closeButtonRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
    
    // Occasional neon flickering effect (less frequent)
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to flicker (reduced from 20%)
        setShowNeonFlicker(true);
        
        // Show TV noise effect
        if (tvNoiseRef.current) {
          gsap.to(tvNoiseRef.current, {
            opacity: 0.3,
            duration: 0.1
          });
        }
        
        // Add neon glow to image container
        if (imageContainerRef.current) {
          gsap.to(imageContainerRef.current, {
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3)',
            filter: 'brightness(1.2) contrast(1.1) hue-rotate(5deg)',
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
          
          // Remove neon glow
          if (imageContainerRef.current) {
            gsap.to(imageContainerRef.current, {
              boxShadow: 'none',
              filter: 'hue-rotate(10deg)',
              duration: 0.2
            });
          }
        }, Math.random() * 200 + 100); // Random duration between 100-300ms
      }
    }, 5000); // Check less frequently (every 5 seconds instead of 3)
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
      clearInterval(flickerInterval);
    };
  }, []);
  
  const handleClose = () => {
    // Animate modal closing
    if (modalRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: onClose
      });
      
      // Fade out the content
      tl.to(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      });
      
      // Fade out the modal background
      tl.to(modalRef.current, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: 0.3,
        ease: "power2.in"
      }, 0.1);
    }
  };

  // Convert Google Drive link to thumbnail URL
  const getThumbnailUrl = (url: string) => {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[0]}&sz=w1000`;
    }
    return url;
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-0"
      onClick={handleClose}
    >
      {/* Simplified background grid - static CSS instead of component */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-5 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={`v-${i}`} className="h-full w-px bg-white/30 absolute" style={{ left: `${(i + 1) * 12.5}%` }}></div>
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="w-full h-px bg-white/30 absolute" style={{ top: `${(i + 1) * 16.666}%` }}></div>
        ))}
      </div>
      
      <div 
        ref={contentRef}
        className="bg-zinc-900 border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-hidden opacity-0 relative"
        style={{ borderWidth: '0.5px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Image section */}
          <div ref={imageRef} className="w-full md:w-2/3 relative">
            {/* Optimized TV Noise effect */}
            <div 
              ref={tvNoiseRef}
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ 
                opacity: 0,
                backgroundImage: 'url("data:image/png;base64,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")',
                backgroundRepeat: 'repeat',
                mixBlendMode: 'screen',
                transition: 'opacity 0.3s ease'
              }}
            />
            
            <div
              ref={imageContainerRef}
              className="h-full relative"
              style={{
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <img 
                src={getThumbnailUrl(artwork.imageUrl)} 
                alt={artwork.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                style={{ 
                  WebkitUserDrag: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
                loading="eager" // Force immediate loading for the detail view
              />
              
              {/* Neon flicker scanlines - simplified */}
              {showNeonFlicker && (
                <div 
                  className="absolute inset-0 pointer-events-none z-30"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
                    backgroundSize: '100% 4px',
                    mixBlendMode: 'overlay'
                  }}
                />
              )}
            </div>
            
            {/* Watermark overlay */}
            <Watermark />
            
            {/* Simplified brutalist grid overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-px bg-white/20 absolute top-1/4"></div>
              <div className="w-full h-px bg-white/20 absolute top-2/4"></div>
              <div className="w-full h-px bg-white/20 absolute top-3/4"></div>
              <div className="h-full w-px bg-white/20 absolute left-1/4"></div>
              <div className="h-full w-px bg-white/20 absolute left-2/4"></div>
              <div className="h-full w-px bg-white/20 absolute left-3/4"></div>
            </div>
          </div>
          
          {/* Info section */}
          <div 
            ref={infoRef}
            className="w-full md:w-1/3 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="font-mono text-xs tracking-wider text-white/70">
                  {artwork.artist} / {artwork.year}
                </div>
                <button 
                  ref={closeButtonRef}
                  onClick={handleClose}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h2 
                ref={titleRef}
                className="text-3xl font-bold mb-6 font-mono tracking-tight"
              >
                {artwork.title}
              </h2>
              
              <p 
                ref={descriptionRef}
                className="text-gray-300 mb-8 leading-relaxed"
              >
                {artwork.description}
              </p>
            </div>
            
            {/* Brutalist design elements */}
            <div className="mt-auto">
              <div className="w-full h-px bg-white/20 mb-4" style={{ height: '0.5px' }}></div>
              <div className="flex justify-between items-center">
                <div className="font-mono text-xs text-white/50">
                  ID: {String(artwork.id).padStart(3, '0')}
                </div>
                <div className="font-mono text-xs text-white/50">
                  SURREALISTLY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
