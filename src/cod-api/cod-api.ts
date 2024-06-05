import {env} from "@strapi/utils";
import {login, Misc, ModernWarfare3, platforms, telescopeLogin} from 'call-of-duty-api';
import {Strapi} from "@strapi/types";
import {FullDataDto, MatchInfoDto} from "./interfaces/data.dto";
import {FullDataPlayer} from "./models/full-data.player";
import {Player} from "../api/player/content-types/player/player";
import {inject, Injectable} from "../decorators/injectable.decorator";
import {Connexion} from "./models/connexion";
import {CryptoService} from "../discord-bot/services/crypto.service";

@Injectable()
export default class CodApi {

  private cryptoService = inject(CryptoService);

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

  /**
   * Connexions instances
   */
  private instances: Connexion[] = [];

  public constructor() {
    console.log('COD LOGIN ENV:', env('ALLOW_COD_LOGIN'));
    console.log('TELESCOPE LOGIN ENV:', env('ALLOW_TELESCOPE_LOGIN'));
    this.init().then(r => r);
  }

  private async init() {
    // TODO: Comment only for develop faster
    //await this.fullLogin();
  }

  public async getInstance(unoId: string): Promise<Connexion | null>{
    const instance = this.instances.find(i => i.unoId === unoId);
    if (instance) {
      return instance;
    }
    const player = await this.strapi.service('api::player.player').findByUnoId(unoId);
    console.log('player:', player);
    if (!player || !player.email || !player.password) {
      return null;
    }
    const unencryptedPassword = this.cryptoService.decrypt(player.password);
    const newConnexion = new Connexion(player.email, unencryptedPassword, unoId);
    this.instances.push(newConnexion);
    return newConnexion;
  }

  public async fullLogin() {
    console.log('Start login');
    await this.codLogin();
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

  public async login(email: string, password: string) {

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
      const instance = await this.getInstance(unoId);
      if (instance instanceof Error) {
        return new Error('Error while fetching data');
      }
      const updatedData = await instance.fullData() as FullDataDto | Error;
      //return updatedData;
      if (updatedData instanceof Error) {
        return new Error('Error while fetching data');
      }
      console.log('data:', updatedData);
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
      const instance = await this.getInstance(unoId);
      if (instance == null) {
        return new Error('Error while fetching data');
      }
      const matches = await instance.matches() as FullDataDto | Error;
      if (matches instanceof Error) {
        return new Error('Error while fetching data');
      } else {
        return matches;
      }
    } else {
      console.log("\x1b[31m", '[ERROR] Telescope login disabled by env', "\x1b[0m")
      return new Error('Telescope login disabled by env');
    }
  }

  public async getMatchInfo(unoId: string, matchId: string): Promise<MatchInfoDto | Error> {
    if (env('ALLOW_TELESCOPE_LOGIN') === 'true') {
      const instance = await this.getInstance(unoId);
      if (instance instanceof Error) {
        return new Error('Error while fetching data');
      }
      const match = await instance.match(matchId) as MatchInfoDto | Error;
      if (match instanceof Error) {
        return new Error('Error while fetching data');
      } else {
        return match;
      }
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
