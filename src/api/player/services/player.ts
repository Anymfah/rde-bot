/**
 * player service
 */

import { factories } from '@strapi/strapi';
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {Player} from "../content-types/player/player";

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
   * @param interaction
   */
  async findByInteraction(interaction: ChatInputCommandInteraction<CacheType>): Promise<Player | null> {
    const discordId = interaction.user.id;
    return this.findByDiscordId(discordId);
  }
}));
