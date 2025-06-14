/**
 * player service
 */

import { factories } from '@strapi/strapi';
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {Player, Player_Plain} from "../content-types/player/player";

export default factories.createCoreService('api::player.player', ({ strapi }) => ({
  /**
   * Find player by discord id
   * @param discordId
   */
  async findByDiscordId(discordId: string): Promise<Player | null> {
    const findUser = await strapi.entityService.findMany('api::player.player', {
      filters: {
        discordId: discordId,
      },
    });

    return (findUser[0] as unknown) as Player ?? null;
  },

  /**
   * Find player by unoid
   * @param unoid
   */
  async findByUnoId(unoid: string): Promise<Player | null> {
    const findUser = await strapi.entityService.findMany('api::player.player', {
      filters: {
        unoid: unoid,
      },
    });

    return (findUser[0] as unknown) as Player ?? null;
  },

  /**
   * Find player via interaction command author
   * @deprecated use findByDiscordId instead
   * @param interaction
   */
  async findByInteraction(interaction: ChatInputCommandInteraction<CacheType>): Promise<Player | null> {
    const discordId = interaction.user.id;
    return this.findByDiscordId(discordId);
  },

  /**
   * Find players via their nametag
   */
  async findByNametag(nametag: string): Promise<Player_Plain | undefined> {
    const findPlayer = await strapi.entityService.findMany('api::player.player', {
      filters: {
        nametag: nametag,
      },
    });

    if (!findPlayer.length) {
      return undefined;
    }

    return findPlayer[0] as Player_Plain;
  }
}));
