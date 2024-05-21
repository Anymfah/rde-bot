import {BaseCommand} from "./base-command";
import {Me, platforms} from "call-of-duty-api";
import {env} from "@strapi/utils";
import strapi from "@strapi/strapi";


export class TestCommand extends BaseCommand {
  public name = 'test';

  public description = 'Test command';

  public async run(interaction: any) {
    //const data = await Me.connectedAccounts(env('COD_UNOID'), platforms.Uno);
    //const data = await Me.loggedInIdentities();
    //const data = await Me.settings(env('COD_UNOID'), platforms.Uno);
    /*const friendFeed = await Me.friendFeed(env('COD_UNOID'), platforms.Uno);
    const eventFeed = await Me.eventFeed();
    console.log(friendFeed);
    console.log(eventFeed);*/
    //const user = await this.strapi.entityService.findMany('api::player.player');

    //const user = await this.strapi.entityService.findMany('plugin::users-permissions.user');
    const user = await this.strapi.entityService.findMany('api::player.player', {
      filters: {
        discordId: '247083370167664641'
      }
    });

    console.log('USER', user);

    await interaction.reply('Test command');
  }
}
