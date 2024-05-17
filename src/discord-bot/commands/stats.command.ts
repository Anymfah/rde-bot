import {BaseCommand} from "./base-command";

export class StatsCommand extends BaseCommand {
  public name = 'stats';

  public description = 'Montrez vos stats MW3';

  public async run() {
    console.log('stats command called');
  }
}
