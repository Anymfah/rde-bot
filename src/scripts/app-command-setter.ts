import {COMMANDS} from "../discord-bot/constants/commands.const";
import {REST, Routes} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

class AppCommandSetter {

  /**
   * Discord rest instance
   */
  public rest: REST;

  /**
   * Commands list
   */
  private _commands = COMMANDS;
  public commands = [];
  public constructor() {
    console.log('\x1b[36m%s\x1b[0m', 'Start setting commands');
    this.rest = new REST({version: '10'}).setToken(process.env.DISCORD_BOT_TOKEN);
    this.commands = this._commands.map(command => new command());
    this._setGuildCommands(process.env.DISCORD_GUILD_ID).then(r => r);
  }

  /**
   * Set guild commands
   * @param guildId
   */
  private async _setGuildCommands(guildId: string) {
    try {
      console.log('Started refreshing application (/) commands.');
      await this.rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId), {
        body: this.commands.map(command => command.getApplicationCommand()),
      });
      console.log('Successfully reloaded application (/) commands.')

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
      await this.rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId), {
        body: [],
      });
      console.log(`Successfully removed application (/) commands for guild ${guildId}.`)
    } catch (error) {
      console.error(error);
    }
  }
}

new AppCommandSetter();
