
import React, { useState } from 'react';
import { ScratchCardData } from '../types';
import ScratchCanvas from './ScratchCanvas';
import { playRevealSound } from '../utils/audio';

interface CardContainerProps {
  card: ScratchCardData;
  onReveal: () => void;
}

const CardContainer: React.FC<CardContainerProps> = ({ card, onReveal }) => {
  const [revealed, setRevealed] = useState(false);

  const handleComplete = () => {
    setRevealed(true);
    playRevealSound();
    onReveal();
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-yellow-500 rounded-xl shadow-2xl overflow-hidden border-8 border-yellow-600 p-4 select-none">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 0)', backgroundSize: '20px 20px' }} />
      
      {/* Card Header */}
      <div className="relative z-0 text-center mb-4">
        <h2 className="text-3xl font-black text-red-700 italic drop-shadow-md">{card.title}</h2>
        <div className="bg-red-700 text-white inline-block px-3 py-1 rounded-full text-xs font-bold mt-1">
          售價 ${card.price}
        </div>
      </div>

      {/* Main Scratch Area */}
      <div className="grid grid-cols-1 gap-4 h-full">
        {/* Winning Numbers Area */}
        <div className="bg-red-100 rounded-lg p-2 border-2 border-red-300">
          <p className="text-[10px] font-bold text-red-800 text-center mb-1">中獎號碼</p>
          <div className="flex justify-center gap-4">
            {card.winningNumbers.map((num, i) => (
              <div key={i} className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-black text-red-800 border-2 border-red-400 shadow-inner">
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Your Numbers Area */}
        <div className="bg-white/80 rounded-lg p-3 grid grid-cols-2 gap-2 flex-grow relative min-h-[300px]">
          {card.yourNumbers.map((item, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-1 rounded border ${item.isWinner && revealed ? 'bg-yellow-200 border-yellow-500 scale-105 transition-transform' : 'border-gray-200'}`}>
              <span className={`text-2xl font-black ${item.isWinner && revealed ? 'text-red-600' : 'text-gray-800'}`}>
                {item.number}
              </span>
              <span className="text-[10px] font-bold text-gray-500">
                ${item.prize.toLocaleString()}
              </span>
              {item.isWinner && revealed && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] px-1 rounded-sm animate-bounce">
                  中
                </div>
              )}
            </div>
          ))}

          {/* Overlay Canvas */}
          <ScratchCanvas 
            width={340} 
            height={320} 
            onComplete={handleComplete} 
            color="#d1d5db" 
          />
        </div>
      </div>
      
      {/* Festive Decorations */}
      <div className="absolute bottom-2 right-2 text-red-600 opacity-20 pointer-events-none">
         <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
      </div>
    </div>
  );
};

export default CardContainer;
