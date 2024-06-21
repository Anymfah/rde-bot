import dotenv from "dotenv";
import axios, {AxiosResponse} from "axios";
import {env} from "@strapi/utils";
import {FullDataDto, MatchInfoDto} from "../interfaces/data.dto";
dotenv.config();

export class Connexion {


  private baseTelescopeUrl: string = "https://telescope.callofduty.com";
  private apiTelescopePath: string = "/api/ts-api";
  private baseTelescopeHeaders: any =  {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,fr;q=0.7,nl;q=0.6,et;q=0.5",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Chromium";v="118", "Microsoft Edge";v="118", "Not=A?Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
  };
  private readonly email: string;
  private readonly password: string;
  public readonly unoId: string;
  private unoUsername: string;
  private accessToken: string;
  private accessExpires: number;
  public loggedIn: boolean = false;
  public sessionTime: Date;

  private baseHeaders = {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    cookie: "new_SiteId=cod;ACT_SSO_LOCALE=en_US;country=US;"
  }

  public constructor(email: string, password: string, unoId: string) {
    this.email = email;
    this.password = password;
    this.unoId = unoId;
  }

  public async login() {
    console.log('Start login');
    const body: string = JSON.stringify({
      platform: "ios",
      hardwareType: "ios",
      auth: {
        email: this.email,
        password: this.password
      },
      version: 1492
    });

    // Axios request
    try {
      const response: AxiosResponse<any> = await axios.post("https://wzm-ios-loginservice.prod.demonware.net/v1/login/uno/?titleID=7100&client=shg-cod-jup-bnet",
        body,
        {
          headers: this.baseHeaders
        });
      if (response.status === 200) {
        this.accessExpires = response.data.umbrella.accessExpires;
        this.accessToken = response.data.umbrella.accessToken;
        this.unoUsername = encodeURIComponent(response.data.umbrella.unoUsername);
        this.baseTelescopeHeaders.authorization = `Bearer ${this.accessToken}`;
        this.loggedIn = true;
        this.sessionTime = new Date();
        console.log('\x1b[36m%s\x1b[0m', 'Login to COD success');
        return response;
      } else {
        return new Error('L\'identifiant ou le mot de passe est incorrect');
      }
    } catch (e) {
      return new Error('L\'identifiant ou le mot de passe est incorrect');
    }
  }

  private async request(endpoint: string) {
    // Check if session is still valid (6 hours)
    const sessionValid = this.sessionTime != null ? new Date().getTime() - this.sessionTime.getTime() < 21600000 : false;
    if (!this.loggedIn && env('ALLOW_TELESCOPE_LOGIN') === 'true' && !sessionValid) {
      await this.login();
    } else if (!this.loggedIn) {
      console.log("\x1b[31m", '[ERROR] Telescope login disabled by env', "\x1b[0m")
      return new Error('Telescope login disabled by env');
    }
    try {
      const response: AxiosResponse<any> = await axios.get(endpoint, {
        headers: this.baseTelescopeHeaders
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('Error while fetching data');
      }
    } catch (e) {
      console.error('Error while fetching data', e);
      return new Error('Error while fetching data');
    }
  }

  public async fullData(): Promise<FullDataDto | Error> {
    return await this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/lifetime?language=french&unoId=${this.unoUsername}`) as FullDataDto | Error;
  }

  public async matches(): Promise<FullDataDto | Error> {
    return await this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/matches?language=french&unoId=${this.unoUsername}`) as FullDataDto | Error;
  }

  public async match(matchId: string): Promise<MatchInfoDto | Error> {
    return await this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/match/${matchId}?language=french&unoId=${this.unoUsername}`) as MatchInfoDto | Error;
  }
}

//new Connexion(process.env.COD_ACCOUNT, process.env.COD_PASSWORD, process.env.COD_UNOID);
