import {BaseCommand} from "./base-command";
import {inject} from "../../decorators/injectable.decorator";
import CodApi from "../../cod-api/cod-api";
import {CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {platforms} from "call-of-duty-api";
import {Player} from "../../api/player/content-types/player/player";
import {CryptoService} from "../services/crypto.service";


export class Register extends BaseCommand {

  private cryptoService = inject(CryptoService);
  private codApi = inject(CodApi);

  public name = 'register';
  public description = 'Enregister manuellement un joueur';

  public options(command: SlashCommandBuilder) {
    return command

      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
      .addUserOption(option => option.setName('discord')
        .setDescription('Le tag Discord du joueur à enregistrer')
        .setRequired(true)
      )
      .addStringOption(option => option.setName('joueur')
        .setDescription('Le tag du joueur à enregistrer')
        .setRequired(true)
      )
      // Player Activision email
      .addStringOption(option => option.setName('activision_email')
        .setDescription('L\'email dde votre compte Activision')
        .setDescription('Vos identifiants seront chiffrés et stockés en toute sécurité. Supprimez-les via /desinscrire.')
      )
      // Player Activision password
      .addStringOption(option => option.setName('activision_password')
        .setDescription('Le mot de passe de votre compte Activision')
        .setDescription('Vos identifiants seront chiffrés et stockés en toute sécurité. Supprimez-les via /desinscrire.')
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
    const unoidData = await this.codApi.searchPlayer(player, platform as platforms);
    const activisionEmail = interaction.options.getString('activision_email');
    const activisionPassword = interaction.options.getString('activision_password');
    let encryptedActivisionPassword = '';
    if (activisionPassword != null) {
      encryptedActivisionPassword = this.cryptoService.encrypt(activisionPassword);
    }

    if (unoidData instanceof Error) {
      await interaction.reply('Erreur lors de la recherche du joueur');
      return;
    }

    // Show roles as a string list (separated by commas)
    const roles = interaction.member['_roles'].join(',');

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
          track: false,
          unoid,
          roles,
          email: activisionEmail,
          password: encryptedActivisionPassword
        }
      });
    } else {
      await this.strapi.entityService.update('api::player.player', user.id, {
        data: {
          discordId,
          nametag: player,
          unoid,
          track: false,
          roles,
          email: activisionEmail,
          password: encryptedActivisionPassword
        } as Partial<Player>
      });
    }
    await interaction.reply('Joueur ' + player + ' enregistré');
  }
}
