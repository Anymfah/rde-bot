import {Injectable} from "../decorators/injectable.decorator";
import {Match_Plain} from "../api/match/content-types/match/match";
import * as fs from "fs";
import {matchDuration, replaceTokens} from "./parser.utils";
import nodeHtmlToImage from "node-html-to-image";
import {MatchPlayer} from "../cod-api/interfaces/match-details.interface";
import {ModesConstant} from "./templates/modes.constant";


@Injectable()
export class MatchParser{

  private match: Match_Plain;

  public async parse(match: Match_Plain) {
    this.match = match;
    return await this.build();
  }

  public async build() {
    let template = fs.readFileSync('./src/parsers/templates/match.template.html', 'utf8');
    let bgFileImage = './public/maps/' + this.match.map + '.jpg';
    if (!fs.existsSync(bgFileImage)) {
      bgFileImage = './public/maps/' + this.match.map + '.webp';
    }
    if (!fs.existsSync(bgFileImage)) {
      bgFileImage = './public/maps/' + this.match.map + '.png';
    }
    if (!fs.existsSync(bgFileImage)) {
      bgFileImage = './public/maps/snd.jpg';
    }
    // Date to number first
    template = replaceTokens(template, {
      styles: '<style>' + fs.readFileSync('./src/parsers/templates/assets/match.css', 'utf8') + '</style>',
      bgMap: this._imageBuffer(bgFileImage),
      mapName: this.match.mapName,
      date: new Date(parseInt(this.match.utcStartTime, 10) * 1000).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
      }),
      duration: matchDuration(this.match.utcStartTime, this.match.utcEndTime),
      mode: ModesConstant.find(mode => mode.name === this.match.mode)?.label ?? this.match.mode,
      axisWin: this.match.axisScore > this.match.alliesScore ? ' win' : '',
      alliesWin: this.match.alliesScore > this.match.axisScore ? ' win' : '',
      axisScore: this.match.axisScore,
      alliesScore: this.match.alliesScore,
      axisTeamPlayers: this._renderTeam(JSON.parse(this.match.teamAxis)),
      alliesTeamPlayers: this._renderTeam(JSON.parse(this.match.teamAllies)),
    });

    return await nodeHtmlToImage({
      transparent: false,
      html: template,
      puppeteerArgs: {
        args: ['--no-sandbox'],
      },
    }) as Buffer;
  }

  private _renderTeam(team: MatchPlayer[]): string {
    let Trs = '';
    for (const player of team) {
      const premiumPlayer = this.match.players
        .find(premPlayer => premPlayer.nametag === player.username);
      const tracked = premiumPlayer ? ' class="tracked"' : '';
      Trs += `<tr${tracked}>
          <td class="player">${player.username}</td>
          <td class="score">${player.score}</td>
          <td class="kills">${player.kills}</td>
        </tr>`;
    }

    return Trs;
  }

  private _imageBuffer(src: string) {
    if (!fs.existsSync(src)) {
      return '';
    }
    const mapImage = fs.readFileSync(src);
    const base64Image = Buffer.from(mapImage).toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  }

}
