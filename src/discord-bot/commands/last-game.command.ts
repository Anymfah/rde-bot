import {BaseCommand} from "./base-command";
import {AttachmentBuilder, CacheType, ChatInputCommandInteraction} from "discord.js";
import {inject} from "../../decorators/injectable.decorator";
import {MatchParser} from "../../parsers/match.parser";

export class LastGameCommand extends BaseCommand {

  private matchParser = inject(MatchParser);

  public name = 'last-game';
  public description = 'Montrez votre dernière partie';

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log('last-game command called');
    await interaction.deferReply();

    const lastMatch = await this.strapi.service('api::match.match').findLastMatchByInteraction(interaction);

    if (!lastMatch) {
      await interaction.editReply('Aucune partie trouvée');
      return;
    }

    await interaction.followUp({files: [
      new AttachmentBuilder(await this.matchParser.parse(lastMatch))
      ]});
    console.log('LAST MATCH', lastMatch);
  }
}
