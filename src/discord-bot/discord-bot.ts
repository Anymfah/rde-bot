import {Client, REST, Routes, GatewayIntentBits, CacheType, Interaction} from "discord.js";
import {env} from "@strapi/utils";
import {BaseCommand} from "./commands/base-command";
import {StatsCommand} from "./commands/stats.command";
import {TestCommand} from "./commands/test.command";
import {Strapi} from "@strapi/types";
import {Inscription} from "./commands/inscription";
import {COMMANDS} from "./constants/commands.const";

export default new class DiscordBot {

  /**
   * Strapi instance
   */
  public strapi: Strapi;

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
    this.commands = this._commands.map(command => new command(this.strapi));
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
