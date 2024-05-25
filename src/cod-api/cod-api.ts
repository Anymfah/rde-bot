import {env} from "@strapi/utils";
import {login, Misc, ModernWarfare3, platforms, telescopeLogin} from 'call-of-duty-api';
import {Strapi} from "@strapi/types";
import {FullDataDto, MatchInfoDto} from "./interfaces/data.dto";
import {FullDataPlayer} from "./models/full-data.player";
import {Player} from "../api/player/content-types/player/player";
import {Injectable} from "../decorators/injectable.decorator";

@Injectable()
export default class CodApi {

  /**
   * Logged in telescope
   */
  public loggedInTeleScope = false;

  /**
   * Logged in COD
   */
  public loggedInCOD = false;


  /**
   * Strapi instance
   */
  public strapi: Strapi = global.strapi;

  public constructor() {
    this.init().then(r => r);
  }

  private async init() {
    // TODO: Comment only for develop faster
    //await this.fullLogin();
  }

  public async fullLogin() {
    console.log('Start login');
    await this.telecopeLogin();
    await this.codLogin();
  }

  public async telecopeLogin() {
    try {
      await telescopeLogin(env('COD_ACCOUNT'), env('COD_PASSWORD'));
      this.loggedInTeleScope = true;
      console.log('\x1b[36m%s\x1b[0m', 'Login to telescope success');
    } catch (e) {
      console.error('Login error', e);
    }
  }

  public async codLogin() {
    try {
      login(env('COD_SSOTOKEN'));
      this.loggedInCOD = true;
      console.log('\x1b[36m%s\x1b[0m', 'Login to COD success');
    } catch (e) {
      console.error('Login error', e);
    }
  }

  public async getFullData(unoId: string): Promise<Player | Error> {
    // First we check if the player is registered
    const player = await this.strapi.service('api::player.player').findByUnoId(unoId);
    if (!player) {
      return new Error('Player not found');
    }
    // Check last update check (Must be older than 15 minutes)
    let needsUpdate = false;
    const lastUpdate = player.lastUpdate != null ? new Date(player.lastUpdate) : new Date(0);
    const diff = new Date().getTime() - lastUpdate.getTime();
    if (diff > 900000) {
      needsUpdate = true;
    }
    if (!needsUpdate) {
      return player;
    } else if (env('ALLOW_TELESCOPE_LOGIN') === 'true') {
      if (!this.loggedInTeleScope) {
        await this.telecopeLogin();
      }
      const updatedData = await ModernWarfare3.fullData(unoId) as FullDataDto;
      //return updatedData;
      if (updatedData.status !== 'success') {
        return new Error('Error while fetching data');
      }
      const data = new FullDataPlayer(updatedData);
      // Update player data
      return (await this.strapi.entityService.update('api::player.player', player.id, {data: data as any}) as unknown) as Player;
    } else {
      console.log("\x1b[31m", '[ERROR] Telescope not logged in, retrieving obsolete data', "\x1b[0m")
      return player;
    }
  }

  public async getRecentMatches(unoId: string): Promise<FullDataDto | Error> {
    if (env('ALLOW_TELESCOPE_LOGIN') === 'true') {
      if (!this.loggedInTeleScope) {
        await this.telecopeLogin();
      }
      return await ModernWarfare3.matches(unoId) as FullDataDto;
    } else {
      console.log("\x1b[31m", '[ERROR] Telescope login disabled by env', "\x1b[0m")
      return new Error('Telescope login disabled by env');
    }
  }

  public async getMatchInfo(unoId: string, matchId: string): Promise<MatchInfoDto | Error> {
    if (env('ALLOW_TELESCOPE_LOGIN') === 'true') {
      if (!this.loggedInTeleScope) {
        await this.telecopeLogin();
      }
      return await ModernWarfare3.matchInfo(unoId, matchId) as MatchInfoDto;
    } else {
      console.log("\x1b[31m", '[ERROR] Telescope login disabled by env', "\x1b[0m")
      return new Error('Telescope login disabled by env');
    }
  }

  public async searchPlayer(player: string, platform: string) {
    if (env('ALLOW_COD_LOGIN') === 'true') {
      if (!this.loggedInCOD) {
        await this.codLogin();
      }
      return await Misc.search(player, platform as platforms);
    } else {
      return new Error('COD login disabled by env');
    }
  }
}
