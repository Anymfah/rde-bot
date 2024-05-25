import {CacheType, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder} from "discord.js";
import {Injectable} from "../../decorators/injectable.decorator";

@Injectable()
export abstract class BaseCommand {

  /**
   * Strapi instance
   */
  protected strapi = global.strapi;

  /**
   * The name of the command
   */
  public abstract name: string;

  /**
   * The description of the command
   */
  public description = '';

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
