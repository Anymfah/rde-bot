import {FullDataDto} from "../interfaces/data.dto";

export class FullDataPlayer {

  private _hasSDHCData: boolean;

  public lastUpdate: Date;
  public killDeathRatio: string;
  public winLossRatio: string;
  public kills: number;
  public deaths: number;
  public damage: number;
  public assists: number;
  public headshots: number;
  public hits: number;
  public totalGamesPlayed: number;
  public wins: number;
  public losses: number;
  public level: number;
  public highestKillStreak: number;
  public highestKillsPerGame: number;
  public sd_hc_kills?: number;
  public sd_hc_deaths?: number;
  public sd_hc_shots?: number;
  public sd_hc_score?: number;
  public sd_hc_timePlayed?: number;
  public sd_hc_kdRatio?: string;
  public sd_hc_wins?: number;
  public sd_hc_losses?: number;
  public sd_hc_winLossRatio?: string;
  public sd_hc_avgKillsPerGame?: string;
  public sd_hc_totalGamesPlayed?: number;

  public constructor(dataDto: FullDataDto) {
    console.log('data: ', dataDto.data.data);
    const data = dataDto.data.data;
    this.lastUpdate = new Date();
    this.killDeathRatio = data.genericStats.killDeathRatio;
    this.kills = data.genericStats.kills;
    this.deaths = data.genericStats.deaths;
    this.damage = data.genericStats.damage;
    this.assists = data.genericStats.assists;
    this.headshots = data.genericStats.headshots;
    this.hits = data.genericStats.hits;
    this.totalGamesPlayed = data.genericStats.totalGamesPlayed;
    this.wins = data.genericStats.wins;
    this.losses = data.genericStats.losses;
    this.level = data.genericStats.level;
    this.highestKillStreak = data.genericStats.highestKillStreak;
    this.highestKillsPerGame = data.genericStats.highestKillsPerGame;
    this.winLossRatio = data.genericStats.winLossRatio;

    const sdhcData = data.modeStats.find((mode) => mode.name === 'hc_sd_hc');
    if (sdhcData != null) {
      this.sd_hc_kills = sdhcData.kills;
      this.sd_hc_deaths = sdhcData.deaths;
      this.sd_hc_shots = sdhcData.shots;
      this.sd_hc_score = sdhcData.score;
      this.sd_hc_timePlayed = sdhcData.timePlayed;
      this.sd_hc_kdRatio = sdhcData.kdRatio;
      this.sd_hc_wins = sdhcData.wins;
      this.sd_hc_losses = sdhcData.losses;
      this.sd_hc_winLossRatio = sdhcData.winLossRatio;
      this.sd_hc_avgKillsPerGame = sdhcData.avgKillsPerGame;
      this.sd_hc_totalGamesPlayed = sdhcData.totalGamesPlayed;
    }
  }
}
