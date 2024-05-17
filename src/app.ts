import {Strapi} from "@strapi/types";
import DiscordBot from "./discord-bot/discord-bot";
import {CodApi} from "./cod-api/cod-api";


export class App {

  /**
   * Strapi instance
   */
  public strapi: Strapi;

  /**
   * Discord bot instance
   */
  public discordBot: DiscordBot;

  /**
   * CodApi instance
   */
  public codApi: CodApi;

  /**
   * Constructor
   * @param strapi
   */
  public constructor(strapi: Strapi) {
    this.strapi = strapi;
    this.init();
  }

  public init() {
    this.codApi = new CodApi(this);
    this.discordBot = new DiscordBot(this);
  }
}
