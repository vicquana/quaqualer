
import React, { useEffect, useState } from 'react';

interface WinAnimationProps {
  amount: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ amount }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Fireworks/Particle simulation with simple CSS */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-1000" />
      
      <div className="relative text-center animate-bounce">
        <div className="text-6xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] scale-125 mb-4 italic">
          恭喜中獎！
        </div>
        <div className="text-4xl md:text-6xl font-black text-white bg-red-600 px-8 py-4 rounded-2xl shadow-2xl border-4 border-yellow-400">
          ${amount.toLocaleString()}
        </div>
        
        {/* Simple Particle Burst */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: ['#fbbf24', '#ef4444', '#f59e0b', '#ffffff'][i % 4],
              animation: `particle-${i} 1.5s ease-out forwards`,
              transform: `rotate(${i * 18}deg) translateY(0)`,
            }}
          />
        ))}
      </div>

      <style>{`
        ${[...Array(20)].map((_, i) => `
          @keyframes particle-${i} {
            0% { transform: rotate(${i * 18}deg) translateY(0) scale(1); opacity: 1; }
            100% { transform: rotate(${i * 18}deg) translateY(-300px) scale(0); opacity: 0; }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default WinAnimation;
