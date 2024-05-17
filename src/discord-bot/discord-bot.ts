import {Client, REST, Routes, GatewayIntentBits, CacheType, Interaction} from "discord.js";
import {env} from "@strapi/utils";
import {App} from "../app";
import {BaseCommand} from "./commands/base-command";
import {StatsCommand} from "./commands/stats.command";

type CommandConstructor<T extends BaseCommand> = new (client: Client) => T;
export default class DiscordBot {

  /**
   * App instance
   */
  public app: App;

  /**
   * Discord rest instance
   */
  public rest: REST;

  /**
   * Discord client instance
   */
  public client: Client = new Client({intents: [GatewayIntentBits.Guilds]});

  /**
   * Commands
   */
  private _commands: CommandConstructor<BaseCommand>[] = [
    StatsCommand,
  ];
  public commands = this._commands.map(command => new command(this.client));

  /**
   * App instance
   * @param app
   */
  public constructor(app: App) {
    this.app = app;

    this.rest = new REST({version: '10'}).setToken(env('DISCORD_BOT_TOKEN'));
    this._init().then(r => r);
  }


  private async _init() {
    console.log('Discord bot initialized');
    await this._removeGuildCommands(env('DISCORD_GUILD_ID'));
    //await this._setCommands();
    await this._setGuildCommands(env('DISCORD_GUILD_ID'));
    await this.client.login(env('DISCORD_BOT_TOKEN'));
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });
    this.client.on('interactionCreate', async interaction => {
      this._interactionHandler(interaction);
    });
  }

  /**
   * Set commands for the bot
   */
  private async _setCommands() {
    try {
      console.log('Started refreshing application (/) commands.');
      await this.rest.put(Routes.applicationCommands(env('DISCORD_CLIENT_ID')), {
        body: this.commands.map(command => command.getApplicationCommand()),
      });
      console.log('Successfully reloaded application (/) commands.')

    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Remove all commands
   */
  private async _removeCommands() {
    try {
      await this.rest.put(Routes.applicationCommands(env('DISCORD_CLIENT_ID')), {
        body: [],
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Remove all guild commands
   * @param guildId Guild ID
   */
  private async _removeGuildCommands(guildId: string) {
    try {
      console.log(`Started removing application (/) commands for guild ${guildId}`);
      await this.rest.put(Routes.applicationGuildCommands(env('DISCORD_CLIENT_ID'), guildId), {
        body: [],
      });
      console.log(`Successfully removed application (/) commands for guild ${guildId}.`)
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Set guild commands
   * @param guildId
   */
  private async _setGuildCommands(guildId: string) {
    try {
      console.log(`Started refreshing application (/) commands for guild ${guildId}`);
      await this.rest.put(Routes.applicationGuildCommands(env('DISCORD_CLIENT_ID'), guildId), {
        body: this.commands.map(command => command.getApplicationCommand()),
      });
      console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`)
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Interaction handler
   * @param interaction
   */
  private _interactionHandler(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.commands.find(command => command.name === interaction.commandName);
    if (!command) return;
    command.run().then(r => r);
  }
}
