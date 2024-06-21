import {BaseCommand} from "./base-command";
import {inject} from "../../decorators/injectable.decorator";
import {TrackerService} from "../services/tracker.service";
import {CacheType, ChatInputCommandInteraction} from "discord.js";


export class Untrack extends BaseCommand {

  private readonly _trackService = inject(TrackerService);
  public name = 'untrack';

  public description = 'Track a player';

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    const discordId = interaction.user.id;
    const player = await this._trackService.untrackPlayer(discordId);
    if (player instanceof Error) {
      await interaction.reply(player.message);
      return;
    } else {
      await interaction.reply('Vous n\'êtes plus suivi : '+ player.nametag);
    }
  }

}
