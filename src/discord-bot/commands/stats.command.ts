import {BaseCommand} from "./base-command";
import {AttachmentBuilder, CacheType, ChatInputCommandInteraction, Interaction, SlashCommandBuilder} from "discord.js";
import {env} from "@strapi/utils";
import {FullDataDto} from "../../cod-api/interfaces/data.dto";
import CodApi from "../../cod-api/cod-api";
import {inject} from "../../decorators/injectable.decorator";
import {StatsParser} from "../../parsers/stats.parser";
import {Player_Plain} from "../../api/player/content-types/player/player";

export class StatsCommand extends BaseCommand {

  private codApi = inject(CodApi);
  private statsParser = inject(StatsParser);
  public name = 'stats';

  public description = 'Montrez vos stats MW3';

  public options(command: SlashCommandBuilder) {
    return command.addUserOption(option => option.setName('discorduser')
      .setDescription('le tag discord du joueur'));
  }

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    //console.log('stats command called', interaction);
    await interaction.deferReply();
    const optionUser = interaction.options.getUser('discorduser');
    const discordId = optionUser?.id ?? interaction.user.id;
    const player = await this.strapi.service('api::player.player').findByDiscordId(discordId) as Player_Plain;
    //console.log('PLAYER', player);
    if (!player || !player.unoid || !player.email || !player.password) {
      await interaction.followUp({
        content: 'Vous n\'êtes pas enregistré, faites /login pour vous enregistrer',
        ephemeral: true
      });
      return;
    }
    const data = await this.codApi.getFullData(player.unoid);
    if (data instanceof Error) {
      await interaction.followUp({
        content: 'Erreur lors de la récupération des données, veuillez réessayer plus tard',
        ephemeral: true
      });
      return;
    }
    const img = await this.statsParser.parse(data);
    await interaction.followUp({files: [
        new AttachmentBuilder(img)
      ]});
  }
}
