import {CacheType, Client, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder} from "discord.js";
import {Strapi} from "@strapi/types";


export abstract class BaseCommand {

  /**
   * Strapi instance
   */
  public strapi?: Strapi;

  /**
   * The name of the command
   */
  public abstract name: string;

  /**
   * The description of the command
   */
  public description = '';

  public constructor(strapi?: Strapi) {
    if (strapi)
      this.strapi = strapi;
  }

  /**
   * Run the command
   * @param interaction The interaction object
   */
  public abstract run(interaction: Interaction<CacheType>): Promise<void>;

  /**
   * Set the options of the command
   * @param command
   */
  public options(command: SlashCommandBuilder):
    SlashCommandBuilder | SlashCommandOptionsOnlyBuilder {
    return command;
  }

  public getApplicationCommand() {
    const command = new SlashCommandBuilder()
      .setName(this.name).setDescription(this.description);
    return this.options(command);
  }
}
