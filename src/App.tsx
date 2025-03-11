import React from 'react';
import Gallery from './components/Gallery';
import Logo from './components/Logo';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Simplified background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
          {[...Array(12)].map((_, i) => (
            <div key={`v-${i}`} className="h-full w-px bg-white/30 absolute" style={{ left: `${(i + 1) * 8.333}%` }}></div>
          ))}
          {[...Array(12)].map((_, i) => (
            <div key={`h-${i}`} className="w-full h-px bg-white/30 absolute" style={{ top: `${(i + 1) * 8.333}%` }}></div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Logo />
        </div>
        <Gallery />
      </div>
    </div>
  );
}

export default App;
