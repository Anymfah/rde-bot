
export interface MatchPlayer {
  kills: number;
  score: number;
  damage: number;
  team: string;
  username: string;
  player?: number;
}
export interface MatchInfo {
  mode: string;
  utcStartTime: string;
  utcEndTime: string;
  axisScore: number;
  alliesScore: number;
  map: string;
  players: {
    axis: MatchPlayer[];
    allies: MatchPlayer[];
  }
}
