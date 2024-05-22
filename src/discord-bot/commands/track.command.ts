import {BaseCommand} from "./base-command";


export class Track extends BaseCommand {
  public name = 'track';

  public description = 'Track a player';

  public constructor() {
    super();
  }

  public async run(interaction: any) {
    console.log('track command called', interaction);
    await interaction.reply('Track command');
  }

}
