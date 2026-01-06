
import React, { useEffect, useState } from 'react';
import { playWinSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WinAnimationProps {
  amount: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ amount }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play the win sound on mount
    playWinSound();
    
    // Trigger high-quality confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Initial big burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#ef4444', '#f59e0b', '#ffffff', '#dc2626']
    });

    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-1000" />
      
      <div className="relative text-center z-10">
        <div className="animate-bounce-slow">
           <div className="text-7xl md:text-9xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] mb-6 italic uppercase tracking-tighter">
            恭喜中獎！
          </div>
          <div className="inline-block transform hover:scale-110 transition-transform duration-300">
            <div className="text-5xl md:text-7xl font-black text-white bg-gradient-to-r from-red-600 to-red-800 px-12 py-6 rounded-3xl shadow-[0_20px_50px_rgba(220,38,38,0.5)] border-4 border-yellow-400 relative overflow-hidden group">
              <span className="relative z-10">${amount.toLocaleString()}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="text-4xl text-yellow-400">★</div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default WinAnimation;
