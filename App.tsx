
import React, { useState, useEffect, useCallback } from 'react';
import { GameType, ScratchCardData, GameStats } from './types';
import { generateCard } from './utils/lotteryLogic';
import CardContainer from './components/CardContainer';
import WinAnimation from './components/WinAnimation';
import StatsPanel from './components/StatsPanel';

const App: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<ScratchCardData | null>(null);
  const [stats, setStats] = useState<GameStats>({
    totalSpent: 0,
    totalWon: 0,
    gamesPlayed: 0,
    winsCount: 0
  });
  const [showWinAnim, setShowWinAnim] = useState(false);
  const [selectedType, setSelectedType] = useState<GameType>(GameType.LUCKY_777);

  const drawNewCard = useCallback((type: GameType) => {
    const newCard = generateCard(type);
    setCurrentCard(newCard);
    setStats(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + newCard.price,
      gamesPlayed: prev.gamesPlayed + 1
    }));
    setShowWinAnim(false);
  }, []);

  useEffect(() => {
    // Initial card
    drawNewCard(GameType.LUCKY_777);
  }, [drawNewCard]);

  const handleReveal = () => {
    if (!currentCard) return;
    
    if (currentCard.isWinner) {
      setStats(prev => ({
        ...prev,
        totalWon: prev.totalWon + currentCard.totalPrize,
        winsCount: prev.winsCount + 1
      }));
      setShowWinAnim(true);
    }
  };

  return (
    <div className="min-h-screen bg-red-950 flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black tracking-tighter text-yellow-500 drop-shadow-lg">
          刮刮樂<span className="text-white">大師</span>
        </h1>
        <div className="bg-red-800 px-4 py-2 rounded-full border-2 border-yellow-600 shadow-lg">
          <span className="text-yellow-400 font-bold mr-2">餘額:</span>
          <span className="text-white font-mono text-xl">
            ${(stats.totalWon - stats.totalSpent).toLocaleString()}
          </span>
        </div>
      </header>

      {/* Main Game Section */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Scratch Area */}
        <section className="flex flex-col items-center">
          {currentCard && (
            <CardContainer 
              key={currentCard.id} 
              card={currentCard} 
              onReveal={handleReveal} 
            />
          )}

          {/* Controls */}
          <div className="mt-8 grid grid-cols-1 gap-4 w-full max-w-xs">
            <div className="flex justify-between items-center gap-2">
              <button 
                onClick={() => setSelectedType(GameType.LUCKY_777)}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${selectedType === GameType.LUCKY_777 ? 'bg-yellow-500 text-red-900 border-2 border-white scale-105' : 'bg-red-800 text-red-300'}`}
              >
                幸運 777 ($100)
              </button>
              <button 
                onClick={() => setSelectedType(GameType.GOLD_RUSH)}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${selectedType === GameType.GOLD_RUSH ? 'bg-yellow-500 text-red-900 border-2 border-white scale-105' : 'bg-red-800 text-red-300'}`}
              >
                黃金大寶藏 ($200)
              </button>
              <button 
                onClick={() => setSelectedType(GameType.NEW_YEAR_FUKU)}
                className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${selectedType === GameType.NEW_YEAR_FUKU ? 'bg-yellow-500 text-red-900 border-2 border-white scale-105' : 'bg-red-800 text-red-300'}`}
              >
                金兔報喜 ($500)
              </button>
            </div>
            
            <button 
              onClick={() => drawNewCard(selectedType)}
              className="w-full py-4 bg-gradient-to-b from-yellow-400 to-yellow-600 text-red-900 font-black text-xl rounded-xl shadow-[0_4px_0_rgb(180,100,0)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              換一張刮刮樂
            </button>
          </div>
        </section>

        {/* Right Side: Educational Info & History */}
        <aside className="w-full">
          <StatsPanel stats={stats} currentGameType={selectedType} />
          
          <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/10">
            <h4 className="text-lg font-bold text-gray-300 mb-2">玩法說明</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>1. 選擇想玩的刮刮樂面額。</li>
              <li>2. 使用手指或滑鼠在灰色區域「刮開」覆蓋膜。</li>
              <li>3. 若「您的號碼」中有任一號碼與「中獎號碼」相同，即得該號碼下方對應獎金。</li>
              <li>4. 刮開面積超過 65% 會自動幫您全開。</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-gray-500 text-xs">
        <p>© 2024 台灣刮刮樂大師模擬器 | 僅供機率教育與娛樂使用</p>
        <p className="mt-1">小賭怡情，大賭傷身。請理性對待博弈遊戲。</p>
      </footer>

      {/* Modals & Animations */}
      {showWinAnim && currentCard && (
        <WinAnimation amount={currentCard.totalPrize} />
      )}
    </div>
  );
};

export default App;
