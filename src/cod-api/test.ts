import 'dotenv/config';
import {Connexion} from "./models/connexion";

class TestApi {

  //account = 'shaq.press@gmail.com';
  //password: 'Mahira1405!';
  account = process.env.COD_ACCOUNT;
  password = process.env.COD_PASSWORD;
  instance: Connexion;

  public constructor() {
    console.log('TELESCOPE LOGIN ENV:', process.env.ALLOW_TELESCOPE_LOGIN);
    this.init().then(r => r);
  }

  async init() {
    console.log('Working')
    this.instance = new Connexion(this.account, this.password, '1234567890');
    await this.runTests();
    await new Promise(resolve => setTimeout(resolve, 999000));
  }

  async runTests() {
    const login = await this.instance.login();
    console.log('Login:', login);

    const fullData = await this.instance.fullData();
    console.log('Full Data:', fullData);
  }
}

new TestApi();
