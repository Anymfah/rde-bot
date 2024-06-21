import {Strapi} from "@strapi/types";
import DiscordBot from "./discord-bot/discord-bot";
import CodApi from "./cod-api/cod-api";
import {diContainer} from "./di-container";
import {TrackerService} from "./discord-bot/services/tracker.service";
import {MatchParser} from "./parsers/match.parser";
import {CryptoService} from "./discord-bot/services/crypto.service";
import {StatsParser} from "./parsers/stats.parser";


export default class App {

  /**
   * Strapi instance
   */
  public strapi: Strapi;

  public crypto = diContainer.get(CryptoService);
  public matchParser = diContainer.get(MatchParser);
  public statsParser = diContainer.get(StatsParser);
  public trackerService = diContainer.get(TrackerService);
  public codApi = diContainer.get(CodApi);
  public discordBot = diContainer.get(DiscordBot);

  /**
   * Constructor
   * @param strapi
   */
  public constructor(strapi: Strapi) {
    this.strapi = strapi;

    this._init().then(r => r);
  }

  private async _init() {
    await this.discordBot.init();
    console.log('App initialized');

  }
}
