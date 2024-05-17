import {Client} from "discord.js";


export abstract class BaseCommand {

  /**
   * Discord client instance
   */
  public client: Client;

  /**
   * The name of the command
   */
  public abstract name: string;

  /**
   * The description of the command
   */
  public description = '';



  /**
   * @constructor
   * @param client
   */
  public constructor(client: Client) {
    this.client = client;
    this.run().then(r => r);
  }

  /**
   * Run the command
   */
  public abstract run(): Promise<void>;

  public getApplicationCommand() {
    return {
      name: this.name,
      description: this.description,
    }
  }
}
