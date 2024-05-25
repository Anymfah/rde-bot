/**
 * player-match service
 */

import { factories } from '@strapi/strapi';
import {GenericStats} from "../../../cod-api/interfaces/generic-stats.interface";

export default factories.createCoreService('api::player-match.player-match', ({ strapi }) => ({

  /**
   * Create playerMatchStat from CodApi match data
   */
  async createFromApi(playerId: number, matchId: number, matchDataStats: GenericStats) {
    const findPlayerMatchStat = await strapi.entityService.findMany('api::player-match.player-match', {
      filters: {
        player: {
          id: playerId,
        },
        match: {
          id: matchId,
        }
      },
    });
    if (!findPlayerMatchStat.length) {
      return await strapi.entityService.create('api::player-match.player-match', {
        data: {
          player: playerId,
          match: matchId,
          placement: matchDataStats.placement,
          score: matchDataStats.score,
          kills: matchDataStats.kills,
          deaths: matchDataStats.deaths,
          assists: matchDataStats.assists,
          damage: matchDataStats.damage,
          headshots: matchDataStats.headshots,
          shots: matchDataStats.shots,
          hits: matchDataStats.hits,
          highestKillStreak: matchDataStats.highestKillStreak,
          playerUtcConnectTimeSeconds: matchDataStats.playerUtcConnectTimeSeconds,
          playerUtcDisconnectTimeSeconds: matchDataStats.playerUtcDisconnectTimeSeconds,
          killDeathRatio: matchDataStats.killDeathRatio,
        }
      });
    } else {
      return findPlayerMatchStat[0];
    }
  }
}));
