import React from 'react';

const MysticalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-pulse" />
      
      {/* Mystical particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-pulse"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Floating mystical symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {['☾', '☽', '✦', '✧', '⟐', '⟡', '◊', '◈'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-6xl animate-bounce"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 4 + 3 + 's'
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Cosmic rays */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
            style={{
              width: '200%',
              top: Math.random() * 100 + '%',
              left: '-50%',
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `shimmer ${Math.random() * 3 + 2}s infinite linear`
            }}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(var(--rotation)); }
            100% { transform: translateX(100%) rotate(var(--rotation)); }
          }
        `
      }} />
    </div>
  );
};

export default MysticalBackground;