import {BaseCommand} from "./base-command";
import {CacheType, ChatInputCommandInteraction, Interaction, SlashCommandBuilder} from "discord.js";
import {env} from "@strapi/utils";
import {FullDataDto} from "../../cod-api/interfaces/data.dto";
import CodApi from "../../cod-api/cod-api";
import {inject} from "../../decorators/injectable.decorator";

export class StatsCommand extends BaseCommand {

  private codApi = inject(CodApi);
  public name = 'stats';

  public description = 'Montrez vos stats MW3';

  public options(command: SlashCommandBuilder) {
    return command.addUserOption(option => option.setName('discorduser')
      .setDescription('le tag discord du joueur'));
  }

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    //console.log('stats command called', interaction);
    const optionUser = interaction.options.getUser('discorduser');
    const discordId = optionUser?.id ?? interaction.user.id;
    const player = await this.strapi.service('api::player.player').findByDiscordId(discordId);
    //console.log('PLAYER', player);
    if (!player || !player.unoid ) {
      await interaction.reply('Vous n\'êtes pas enregistré, faites /inscription pour vous enregistrer');
      return;
    }
    const data = await this.codApi.getFullData(player.unoid);

    /*const matches = await CodApi.getRecentMatches(player.unoid);
    const matchTestId = matches.data.data.matches[0].matchId;*/
    //console.log('DATA:',data);
    /*console.log('MATCHES:',matches);*/
    // @ts-ignore
    /*console.log('MATCH TEST ID:',matchTestId);*/
    // @ts-ignore
    /*const matcheTest = await CodApi.getMatchInfo(player.unoid, "7415183088385615242");
    console.log('MATCH TEST:',matcheTest);*/
    const kdRation = 'test';
    await interaction.reply(`Votre ratio K/D est de ${kdRation}`);
  }
}
