import {BaseCommand} from "./base-command";
import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Misc, platforms} from "call-of-duty-api";
import {Player} from "../../api/player/content-types/player/player";


export class Inscription extends BaseCommand {
  public name = 'inscription';

  public description = 'Enregistrez un joueur';

  public options(command: SlashCommandBuilder) {
    return command.addUserOption(option => option.setName('discord')
        .setDescription('Le tag Discord du joueur à enregistrer')
        .setRequired(true)
    )
      .addStringOption(option => option.setName('joueur')
        .setDescription('Le tag du joueur à enregistrer')
        .setRequired(true)
    )
    // Add the platform option (choice)
      .addStringOption(option => option.setName('plateforme')
        .setDescription('La plateforme du joueur')
        .addChoices(
          {name: 'Battle.net', value: platforms.Battlenet},
          {name: 'Activision', value: platforms.Activision},
          {name: 'Playstation', value: platforms.PSN},
          {name: 'Xbox', value: platforms.XBOX},
          {name: 'Steam', value: platforms.Steam},
          {name: 'Uno', value: platforms.Uno},
          {name: 'iOS', value: platforms.ios},
          {name: 'Toutes', value: platforms.All}
        )
    );
  }

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    console.log('interaction', interaction);
    const discordUser = interaction.options.getUser('discord');
    const player = interaction.options.getString('joueur');
    const platform = interaction.options.getString('plateforme') ?? platforms.Activision;
    const unoidData = await Misc.search(player, platform as platforms);

    // Show roles as a string list (separated by commas)
    const roles = interaction.member['_roles'].join(',');

    console.log('roles', roles);

    // @ts-ignore
    if (unoidData.status !== 'success' || unoidData.data.length === 0) {
      await interaction.reply('Joueur non trouvé, le tag n\'existe pas');
      return;
    }
    // @ts-ignore
    const unoid = unoidData.data[0]?.accountId;
    console.log('unoid', unoidData);

    // UID
    const discordId = discordUser.id;

    // Get the player from the database via discordId
    // If the player does not exist, create it
    const findUser = await this.strapi.entityService.findMany('api::player.player', {
      filters: {
        discordId: discordId
      }
    });

    const user = findUser[0] ?? null;

    if (!user) {
      await this.strapi.entityService.create('api::player.player', {
        data: {
          discordId,
          nametag: player,
          unoid,
          roles
        }
      });
    } else {
      await this.strapi.entityService.update('api::player.player', user.id, {
        data: {
          discordId,
          nametag: player,
          unoid,
          roles
        } as Partial<Player>
      });
    }
    await interaction.reply('Joueur ' + player + ' enregistré');
  }
}
