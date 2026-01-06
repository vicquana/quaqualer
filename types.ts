
export enum GameType {
  LUCKY_777 = 'LUCKY_777',
  GOLD_RUSH = 'GOLD_RUSH',
  NEW_YEAR_FUKU = 'NEW_YEAR_FUKU'
}

export interface ScratchCardData {
  id: string;
  type: GameType;
  title: string;
  price: number;
  winningNumbers: number[];
  yourNumbers: {
    number: number;
    prize: number;
    isWinner: boolean;
  }[];
  totalPrize: number;
  isRevealed: boolean;
  isWinner: boolean;
}

export interface GameStats {
  totalSpent: number;
  totalWon: number;
  gamesPlayed: number;
  winsCount: number;
}
