
import React from 'react';
import { GameStats, GameType } from '../types';
import { getProbabilityInfo } from '../utils/lotteryLogic';

interface StatsPanelProps {
  stats: GameStats;
  currentGameType: GameType;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, currentGameType }) => {
  const info = getProbabilityInfo(currentGameType);
  const net = stats.totalWon - stats.totalSpent;

  return (
    <div className="bg-red-800/50 rounded-xl p-4 mt-6 border border-red-700 text-sm">
      <h3 className="text-xl font-bold mb-3 border-b border-red-700 pb-2">📊 我的刮刮樂統計 (機率教育)</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-red-900/60 p-3 rounded-lg">
          <p className="text-gray-400">累計投入</p>
          <p className="text-xl font-bold">${stats.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-red-900/60 p-3 rounded-lg">
          <p className="text-gray-400">累計獎金</p>
          <p className="text-xl font-bold text-yellow-400">${stats.totalWon.toLocaleString()}</p>
        </div>
        <div className="bg-red-900/60 p-3 rounded-lg">
          <p className="text-gray-400">淨收益</p>
          <p className={`text-xl font-bold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${net.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-900/60 p-3 rounded-lg">
          <p className="text-gray-400">中獎次數</p>
          <p className="text-xl font-bold">{stats.winsCount} / {stats.gamesPlayed}</p>
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-700/50 p-3 rounded-lg">
        <h4 className="font-bold text-yellow-500 mb-1 flex items-center">
           <span className="mr-2">💡 機率小百科: {currentGameType}</span>
        </h4>
        <div className="space-y-1 text-xs text-yellow-100/80">
          <p>• 官方公告中獎率: <span className="text-yellow-400 font-bold">{info.winRate}</span></p>
          <p>• 平均回還率 (RTP): <span className="text-yellow-400 font-bold">{info.returnRate}</span></p>
          <p className="mt-2 leading-relaxed italic">{info.description}</p>
          <p className="mt-2 text-[10px] opacity-70">*註：大數法則告訴我們，參與次數越多，實際結果會越接近期望值（通常是虧損）。</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
