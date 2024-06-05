import {factories} from '@strapi/strapi';
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {Match_Plain} from "../content-types/match/match";
import {Player_Plain} from "../../player/content-types/player/player";

/**
 * match service
 */

export default factories.createCoreService('api::match.match', ({ strapi }) => ({

  /**
   * does Match already exist
   */
  async matchExist(matchId: string): Promise<boolean> {
    const findMatch = await strapi.entityService.findMany('api::match.match', {
      filters: {
        matchId,
      },
    });
    return !!findMatch.length;
  },

  /**
   * Get Match by MatchId
   * @param matchId
   */
  async getMatchByMatchId(matchId: string): Promise<Match_Plain | null> {
    const match = await strapi.entityService.findMany('api::match.match', {
      filters: {
        matchId,
      },
      populate: '*'
    }) as Match_Plain[];

    return match[0] ?? null;
  },

  async findLastMatchByDiscordId(discordId: string): Promise<Match_Plain | null> {
    const player = await strapi.entityService.findMany('api::player.player', {
      filters: {
        discordId,
      },
      populate: ['matches']
    }) as Player_Plain[];
    if (!player) {
      return null;
    }

    // Last match is last created match in player.matches
    const lastMatches = player[0].matches.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Get last match with full data
    const lastMatch = await strapi.entityService.findOne('api::match.match', lastMatches[0].id, {
      populate: '*'
    }) as Match_Plain;

    return lastMatch ?? null;
  },

  /**
   * Find Match via interaction command author
   */
  async findLastMatchByInteraction(interaction: ChatInputCommandInteraction<CacheType>): Promise<Match_Plain | null> {
    const discordId = interaction.user.id;
    return this.findLastMatchByDiscordId(discordId);
  }

}));
