import dotenv from "dotenv";
import axios, {AxiosResponse} from "axios";
import {env} from "@strapi/utils";
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
  private readonly unoId: string;
  private unoUsername: string;
  private accessToken: string;
  private accessExpires: number;
  public loggedIn: boolean = false;

  private baseHeaders = {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    cookie: "new_SiteId=cod;ACT_SSO_LOCALE=en_US;country=US;"
  }

  public constructor(username: string, password: string, unoId: string) {
    this.email = username;
    this.password = password;
    this.unoId = unoId;

    // TODO: FOR TESTING PURPOSES
    this.login().then(r => r)
    new Promise(resolve => setTimeout(resolve, 5000000))
      .then(() => {});
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
        console.log('Response', response.data);
        this.accessExpires = response.data.umbrella.accessExpires;
        this.accessToken = response.data.umbrella.accessToken;
        this.unoUsername = encodeURIComponent(response.data.umbrella.unoUsername);
        this.baseTelescopeHeaders.authorization = `Bearer ${this.accessToken}`;
        this.loggedIn = true;
        console.log('\x1b[36m%s\x1b[0m', 'Login to COD success');
      } else {
        return new Error('L\'identifiant ou le mot de passe est incorrect');
      }
    } catch (e) {
      return new Error('L\'identifiant ou le mot de passe est incorrect');
    }

    // TODO: FOR TESTING PURPOSES
    const fullData = await this.fullData();
    console.log('Full data', fullData);
    const matches = await this.matches();
    console.log('Matches', matches);
    const match = await this.match('-8806849168311851727');
    console.log('Match', match);
  }

  private async request(endpoint: string) {
    if (!this.loggedIn && env('ALLOW_TELESCOPE_LOGIN') === 'true') {
      await this.login();
    } else if (!this.loggedIn) {
      console.log("\x1b[31m", '[ERROR] Telescope login disabled by env', "\x1b[0m")
      return new Error('Telescope login disabled by env');
    }
    try {
      return await axios.get(endpoint, {
        headers: this.baseTelescopeHeaders
      });
    } catch (e) {
      console.error('Error while fetching data', e);
      return new Error('Error while fetching data');
    }
  }

  public async fullData() {
    return await this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/lifetime?language=french&unoId=${this.unoUsername}`);
  }

  public async matches() {
    return await this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/matches?language=french&unoId=${this.unoUsername}`);
  }

  public match(matchId: string) {
    return this.request(`${this.baseTelescopeUrl}${this.apiTelescopePath}/cr/v1/title/jup/match/${matchId}?language=french&unoId=${this.unoUsername}`);
  }
}

new Connexion(process.env.COD_ACCOUNT, process.env.COD_PASSWORD, process.env.COD_UNOID);
