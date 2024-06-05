import {BaseCommand} from "./base-command";
import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits} from "discord.js";
import {Misc, platforms} from "call-of-duty-api";
import {Player} from "../../api/player/content-types/player/player";
import {inject} from "../../decorators/injectable.decorator";
import CodApi from "../../cod-api/cod-api";
import {CryptoService} from "../services/crypto.service";
import {Connexion} from "../../cod-api/models/connexion";


export class Login extends BaseCommand {

  private codApi = inject(CodApi);
  private cryptoService = inject(CryptoService);

  public name = 'login';

  public description = 'Se connecter à votre compte Activision pour récupérer vos stats';

  public options(command: SlashCommandBuilder) {
    return command
      // Player Activision email
      .addStringOption(option => option.setName('activision_email')
        .setDescription('L\'email dde votre compte Activision')
        .setDescription('Vos identifiants seront chiffrés et stockés en toute sécurité. Supprimez-les via /desinscrire.')
        .setRequired(true)
      )
      // Player Activision password
      .addStringOption(option => option.setName('activision_password')
        .setDescription('Le mot de passe de votre compte Activision')
        .setDescription('Vos identifiants seront chiffrés et stockés en toute sécurité. Supprimez-les via /desinscrire.')
        .setRequired(true)
      );
  }

  public async run(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.deferReply({ephemeral: true});
    await interaction.followUp('Enregistrement en cours...');
    const discordId = interaction.user.id;
    const activisionEmail = interaction.options.getString('activision_email');
    const activisionPassword = interaction.options.getString('activision_password');

    const encryptedActivisionPassword = this.cryptoService.encrypt(activisionPassword);

    const login = await new Connexion(activisionEmail, activisionPassword, '1234567890').login();

    if (login instanceof Error) {
      await interaction.followUp('Erreur lors de la connexion au compte Activision, vos identifiants sont incorrects');
      return;
    }
    const playerTag = login.data.umbrella.unoUsername;
    const unoid = login.data.umbrella.unoID;
    await interaction.followUp({
      content: 'Connexion réussie',
      ephemeral: true
    });

    // Show roles as a string list (separated by commas)
    const roles = interaction.member['_roles'].join(',');

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
          nametag: playerTag,
          unoid,
          roles,
          track: false,
          email: activisionEmail,
          password: encryptedActivisionPassword
        }
      });
    } else {
      await this.strapi.entityService.update('api::player.player', user.id, {
        data: {
          discordId,
          nametag: playerTag,
          unoid,
          roles,
          email: activisionEmail,
          password: encryptedActivisionPassword
        } as Partial<Player>
      });
    }
    await interaction.editReply('Joueur ' + playerTag + ' enregistré');
  }
}
