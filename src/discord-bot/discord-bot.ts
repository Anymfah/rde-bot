import {Client, GatewayIntentBits, CacheType, Interaction} from "discord.js";
import {env} from "@strapi/utils";
import {COMMANDS} from "./constants/commands.const";
import {Injectable, Inject} from "../decorators/injectable.decorator";
import {StrapiService} from "../services/strapi.service";

@Injectable()
export default class DiscordBot {

  public constructor(
    @Inject(StrapiService) private strapiService: StrapiService
  ) {}

  /**
   * Discord client instance
   */
  public client: Client = new Client({intents: [GatewayIntentBits.Guilds]});

  /**
   * Commands
   */
  private _commands = COMMANDS;
  public commands = [];

  public async init() {
    console.log('STRAPI SERVICE', this.strapiService);
    this.commands = this._commands.map(command => new command(global.strapi));
    console.log('Discord bot initialized');
    await this.client.login(env('DISCORD_BOT_TOKEN'));
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });
    this.client.on('interactionCreate', async interaction => {
      this._interactionHandler(interaction);
    });
  }

  /**
   * Interaction handler
   * @param interaction
   */
  private _interactionHandler(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.commands.find(command => command.name === interaction.commandName);
    if (!command) return;
    command.run(interaction).then(r => r);
  }
}
