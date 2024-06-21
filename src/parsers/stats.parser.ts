import {Injectable} from "../decorators/injectable.decorator";
import {Player_Plain} from "../api/player/content-types/player/player";
import * as fs from "fs";
import {replaceTokens} from "./parser.utils";
import nodeHtmlToImage from "node-html-to-image";


@Injectable()
export class StatsParser {
  private player: Player_Plain;

  public async parse(player: Player_Plain) {
    this.player = player;
    return await this.build();
  }

  public async build(): Promise<Buffer | null> {
    let template = fs.readFileSync('./src/parsers/templates/stats.template.html', 'utf8');
    const data = {
      styles: '<style>' + fs.readFileSync('./src/parsers/templates/assets/stats.css', 'utf8') + '</style>',
      sd_hc_winLossRatio: this.player.sd_hc_winLossRatio,
      sd_hc_kdRatio: this.player.sd_hc_kdRatio,
      nametag: this.player.nametag,
      kills: this.player.kills,
      deaths: this.player.deaths,
      assists: this.player.assists,
      // Accuracy (%) = (Total Shots Landed / Total Shots Fired) * 100
      accuracy: ((this.player.hits / this.player.shots) * 100)?.toFixed(2) ?? 0,
      wins: this.player.wins,
      losses: this.player.losses,
      totalGamesPlayed: this.player.totalGamesPlayed,
      // Total time played in hours (seconds to hours)
      totalTimePlayed: (this.player.totalTimePlayed / 3600)?.toFixed(2) ?? 0,
      sd_hc_kills: this.player.sd_hc_kills,
      sd_hc_deaths: this.player.sd_hc_deaths,
      sd_hc_avgKillsPerGame: this.player.sd_hc_avgKillsPerGame,
      sd_hc_wins: this.player.sd_hc_wins,
      sd_hc_losses: this.player.sd_hc_loss,
      sd_hc_totalGamesPlayed: this.player.sd_hc_totalGamesPlayed,
      sd_hc_timePlayed: (this.player.sd_hc_timePlayed / 3600)?.toFixed(2) ?? 0,

      /**
       * % of kd_ratio to 2 (if kd_ratio > 2, 100%) rounded
       */
      sd_hc_kd_ratio_percent: (Math.min(Math.round((parseFloat(this.player.sd_hc_kdRatio) / 2) * 100), 100) + '%'),

      /**
       * % of win_loss_ratio to 6 (if win_loss_ratio > 5, 100%)
       */
      sd_hc_win_loss_ratio_percent: (Math.min(Math.round((parseFloat(this.player.sd_hc_winLossRatio) / 6) * 100), 100) + '%'),
    };
    console.log('data: ', data);
    template = replaceTokens(template, data);



    try {
      console.log('Rendering image...');
      const img = await nodeHtmlToImage({
        transparent: false,
        html: template,
        puppeteerArgs: {
          headless: "new",
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }) as Buffer;
      //console.log('Image rendered', img);
      return img;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
