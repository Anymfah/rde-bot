import {env} from "@strapi/utils";
import {login, Misc, ModernWarfare, ModernWarfare3, platforms, telescopeLogin} from 'call-of-duty-api';
import {App} from "../app";

export class CodApi {

  /**
   * Strapi instance
   */
  public app: App;

  /**
   * UnoID
   */
  public unoId: string = env('COD_UNOID');

  /**
   * App instance
   * @param app
   */
  public constructor(app: App) {
    this.app = app;
    this.init().then(r => r);
  }

  private async init() {
    await this.login();
    const data = await this.getData();
    console.log('DATA:',data);
  }

  public async login() {
    await telescopeLogin(env('COD_ACCOUNT'), env('COD_PASSWORD'));
    login(env('COD_SSOTOKEN'));
  }

  public async getData() {
    //return await ModernWarfare.combatHistory('Anym#3630220', platforms.Battlenet);
    return ModernWarfare3.matches(this.unoId);
  }
}
