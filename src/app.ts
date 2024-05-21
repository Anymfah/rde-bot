import {Strapi} from "@strapi/types";
import DiscordBot from "./discord-bot/discord-bot";
import CodApi from "./cod-api/cod-api";


export default class App {

  /**
   * Strapi instance
   */
  public strapi: Strapi;

  /**
   * Discord bot instance
   */
  public discordBot: typeof DiscordBot;

  /**
   * CodApi instance
   */
  public codApi: typeof CodApi;

  /**
   * Constructor
   * @param strapi
   */
  public constructor(strapi: Strapi) {
    this.strapi = strapi;
    this.codApi = CodApi;
    this.codApi.strapi = strapi;
    this.discordBot = DiscordBot;
    this.discordBot.strapi = strapi;

    this._init().then(r => r);
  }

  private async _init() {
    await this.discordBot.init();
    console.log('App initialized');

  }
}
