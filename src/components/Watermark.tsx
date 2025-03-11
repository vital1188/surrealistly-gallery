import React from 'react';

interface WatermarkProps {
  text?: string;
}

const Watermark: React.FC<WatermarkProps> = ({ text = "Surrealistly" }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Main centered watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    text-white text-opacity-20 font-bold text-3xl md:text-4xl rotate-[-20deg]">
        {text}
      </div>
      
      {/* Pattern of smaller watermarks */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {[...Array(9)].map((_, i) => (
          <div 
            key={i} 
            className="flex items-center justify-center text-white text-opacity-10 
                      font-mono text-xs md:text-sm rotate-[-15deg]"
            style={{ 
              transform: `rotate(${-15 + (i * 5)}deg)`,
              opacity: 0.05 + (i * 0.01)
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watermark;
