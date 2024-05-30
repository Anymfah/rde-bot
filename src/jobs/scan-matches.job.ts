import {inject, Injectable} from "../decorators/injectable.decorator";
import {BaseJob} from "./base-job";
import {Player_Plain} from "../api/player/content-types/player/player";
import {RecentMatch} from "../cod-api/interfaces/recent-match.interface";
import {MatchPlayer} from "../cod-api/interfaces/match-details.interface";
import DiscordBot from "../discord-bot/discord-bot";
import {MatchParser} from "../parsers/match.parser";
import {Match_Plain} from "../api/match/content-types/match/match";


@Injectable()
export class ScanMatchesJob extends BaseJob {

  private discordBot = inject(DiscordBot);
  private devTest = false;
  private matchParser = inject(MatchParser);
  public newMatchesIds: string[] = [];

  public async job() {

    console.log('Scan matches job started');

    /*if (this.devTest) {
      console.log('Dev test enabled, skipping job');
      return;
    }*/

    this.newMatchesIds = [];
    //this.reportMatches();


    // Get All players with track enabled
    const players = await this.strapi.entityService.findMany('api::player.player', {
      filters: {
        track: true
      }
    }) as Player_Plain[];
    console.log('Players to scan', players.length);
    /**
     * Scan loop
     */
    for (const player of players) {
      // Get full data
      const recentMatches = await this.codApi.getRecentMatches(player.unoid);
      if (recentMatches instanceof Error) {
        console.error('Error while getting recent matches', recentMatches);
        continue;
      }
      await this._manageMatchesForPlayer(player, recentMatches.data.data.matches);
    }

    // Send discord notification for all new matches
    await this.reportMatches();

    this.devTest = true;
  }

  /**
   * Manage matches for player
   * @param player
   * @param recentMatches
   * @private
   */
  private async _manageMatchesForPlayer(player: Player_Plain, recentMatches: RecentMatch[]) {
    console.log('Matches:', recentMatches.length, 'for player', player.nametag, recentMatches);
    for (const match of recentMatches) {
      const matchExist = await this.strapi.service('api::match.match').matchExist(match.matchId);
      if (matchExist) {
        // TODO: Maybe we can fill data of the tracked player for this match, since it is advanced Data
        continue;
      }

      // Get match data by ID from COD API
      const matchData = await this.codApi.getMatchInfo(player.unoid, match.matchId);
      if (matchData instanceof Error) {
        continue;
      }
      // Get all players from match (found in DB)
      const allies = await this._fillTeamPlayers(matchData.data.data.players.allies);
      const axis = await this._fillTeamPlayers(matchData.data.data.players.axis);

      // Create match
      const newMatch = await this.strapi.entityService.create('api::match.match', {
        data: {
          matchId: match.matchId,
          map: matchData.data.data.map,
          mode: matchData.data.data.mode,
          mapName: match.mapName,
          players: [...allies, ...axis]
            .filter(p => p.player !== undefined)
            .map(p => p.player),

          axisScore: matchData.data.data.axisScore,
          alliesScore: matchData.data.data.alliesScore,
          utcStartTime: matchData.data.data.utcStartTime,
          utcEndTime: matchData.data.data.utcEndTime,

          // Json data
          teamAxis: JSON.stringify(axis),
          teamAllies: JSON.stringify(allies),
        }
      });

      // Add match to new matches
      this.newMatchesIds.push(match.matchId);
      console.log('New match created', newMatch);
    }
  }

  /**
   * Make relation of a team player nametag with a player
   * Return MatchPlayer or MatchPlayer with player id (from DB)
   */
  private async _fillTeamPlayers(matchPlayers: MatchPlayer[]): Promise<MatchPlayer[]> {
    for (const matchPlayer of matchPlayers) {
      const player = await this.strapi.service('api::player.player').findByNametag(matchPlayer.username);
      if (player) {
        matchPlayer.player = player.id;
      }
    }
    return matchPlayers;
  }

  /**
   * Report matches to discord
   */
  public async reportMatches() {
    if (this.newMatchesIds.length === 0) {
      console.log('No new matches to report');
      return;
    }
    const channel = this.discordBot.guild.channels.cache.get('1004861969360240692');
    if (!channel) {
      console.error('Channel not found');
      return;
    }

    for (const matchId of this.newMatchesIds) {
      const match: Match_Plain | null = await this.strapi.service('api::match.match').getMatchByMatchId(matchId);

      if (match == null) {
        console.error('Match not found in database', matchId);
        continue;
      }

      // Parse match
      const matchImage = await this.matchParser.parse(match);
      // Send test to channel
      channel.send({files: [matchImage]});
    }


  }
}
