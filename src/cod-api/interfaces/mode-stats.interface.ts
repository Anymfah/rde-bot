import {MapStats} from "./map-stats.interface";

export interface ModeStats {
  name: string;
  kills: number;
  deaths: number;
  shots: number;
  score: number;
  timePlayed: number;
  kdRatio: string;
  wins: number;
  loss: number;
  assists: number;
  winLossRatio: string;
  scorePerMinute: number;
  avgKillsPerGame: string;
  totalGamesPlayed: number;
  headshots: number;
  damage: number;
  maps: MapStats[];
}
