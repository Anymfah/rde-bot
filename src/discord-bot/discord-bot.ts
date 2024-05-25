import {Client, GatewayIntentBits, CacheType, Interaction} from "discord.js";
import {env} from "@strapi/utils";
import {COMMANDS} from "./constants/commands.const";
import {Injectable} from "../decorators/injectable.decorator";

@Injectable()
export default class DiscordBot {

  /**
   * Discord client instance
   */
  public client: Client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  /**
   * Discord rDe guild
   */
  public guild;

  /**
   * Commands
   */
  private _commands = COMMANDS;
  public commands = [];

  public constructor() {
    console.log('Discord bot constructor called')
  }

  public async init() {
    console.log('Initializing discord bot')
    this.commands = this._commands.map(command => new command());
    console.log('Discord bot initialized');

    this.client.on('ready', () => {
      this.guild = this.client.guilds.cache.get(env('DISCORD_GUILD_ID'));
      console.log(`Logged in as ${this.client.user?.tag}! For guild ${this.guild.name}`);
    });
    this.client.on('interactionCreate', async interaction => {
      this._interactionHandler(interaction);
    });
    await this.client.login(env('DISCORD_BOT_TOKEN'));
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
