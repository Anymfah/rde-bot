import {BaseCommand} from "./base-command";
import {inject} from "../../decorators/injectable.decorator";
import {TrackerService} from "../services/tracker.service";
import {CacheType, ChatInputCommandInteraction} from "discord.js";


export class Track extends BaseCommand {

  private readonly _trackService = inject(TrackerService);
  public name = 'track';

  public description = 'Track a player';

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    const discordId = interaction.user.id;
    const player = await this._trackService.trackPlayer(discordId);
    if (player instanceof Error) {
      await interaction.reply(player.message);
      return;
    } else {
      await interaction.reply('Joueur '+ player.nametag + ' suivi');
    }
  }

}
