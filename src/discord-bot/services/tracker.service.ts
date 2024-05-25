import {Injectable} from "../../decorators/injectable.decorator";
import {Strapi} from "@strapi/types";
import {Player, Player_Plain} from "../../api/player/content-types/player/player";


@Injectable()
export class TrackerService {

  private strapi: Strapi = global.strapi;
  private async _trackPlayer(discordId: string, track: boolean): Promise<Player_Plain | Error> {
    const player = await this.strapi.service('api::player.player').findByDiscordId(discordId);
    if (!player) {
      return new Error('Joueur introuvable, veuillez d\'abord vous inscrire avec la commande /register');
    }
    return await this.strapi.service('api::player.player').update(player.id, {
      data: {
        track
      }
    });
  }

  public async trackPlayer(discordId: string) {
    return this._trackPlayer(discordId, true);
  }

  public async untrackPlayer(discordId: string) {
    return this._trackPlayer(discordId, false);
  }
}
