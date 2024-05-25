import {BaseCommand} from "./base-command";


export class TestCommand extends BaseCommand {
  public name = 'test';

  public description = 'Test command';

  public async run(interaction: any) {

    // Get "to_publish_matches" from strapi


    await interaction.reply('Test command');
  }
}
