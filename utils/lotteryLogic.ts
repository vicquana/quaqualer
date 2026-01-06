
import { GameType, ScratchCardData } from '../types';

const PRIZE_POOL = [0, 0, 0, 100, 100, 200, 200, 500, 1000, 5000, 100000];

export const generateCard = (type: GameType): ScratchCardData => {
  const id = Math.random().toString(36).substr(2, 9);
  const winningNumbersCount = type === GameType.NEW_YEAR_FUKU ? 3 : 2;
  const yourNumbersCount = 10;
  
  // Decide if this card is a winner based on typical Taiwanese odds (approx 30%)
  const winProbability = 0.33;
  const willWin = Math.random() < winProbability;
  
  const winningNumbers: number[] = [];
  while (winningNumbers.length < winningNumbersCount) {
    const num = Math.floor(Math.random() * 50) + 1;
    if (!winningNumbers.includes(num)) winningNumbers.push(num);
  }

  const yourNumbers = [];
  let totalPrize = 0;

  for (let i = 0; i < yourNumbersCount; i++) {
    let num: number;
    let isWinner = false;
    let prize = 0;

    if (willWin && i === 0) { // Force at least one win if decided
      num = winningNumbers[0];
      isWinner = true;
      prize = PRIZE_POOL[Math.floor(Math.random() * (PRIZE_POOL.length - 3)) + 3];
    } else {
      num = Math.floor(Math.random() * 50) + 1;
      // Ensure it doesn't accidentally win if not meant to
      if (!willWin && winningNumbers.includes(num)) {
        num = (num + 1) % 50 || 50;
      }
      isWinner = winningNumbers.includes(num);
      if (isWinner) {
        prize = PRIZE_POOL[Math.floor(Math.random() * (PRIZE_POOL.length - 3)) + 3];
      }
    }
    
    if (isWinner) totalPrize += prize;
    yourNumbers.push({ number: num, prize, isWinner });
  }

  // Shuffle your numbers
  yourNumbers.sort(() => Math.random() - 0.5);

  return {
    id,
    type,
    title: getTitle(type),
    price: getPrice(type),
    winningNumbers,
    yourNumbers,
    totalPrize,
    isRevealed: false,
    isWinner: totalPrize > 0
  };
};

const getTitle = (type: GameType) => {
  switch (type) {
    case GameType.LUCKY_777: return '幸運 777';
    case GameType.GOLD_RUSH: return '黃金大寶藏';
    case GameType.NEW_YEAR_FUKU: return '金兔報喜';
  }
};

const getPrice = (type: GameType) => {
  switch (type) {
    case GameType.LUCKY_777: return 100;
    case GameType.GOLD_RUSH: return 200;
    case GameType.NEW_YEAR_FUKU: return 500;
  }
};

export const getProbabilityInfo = (type: GameType) => {
  return {
    winRate: "33.15%",
    returnRate: "62.5%",
    topPrize: type === GameType.NEW_YEAR_FUKU ? "500萬" : "100萬",
    description: "刮刮樂的設計期望值通常為負數，這意味著長期玩下來，平均每刮一張都會虧損約 30-40% 的成本。這是一種機率遊戲，僅供娛樂。"
  };
};
