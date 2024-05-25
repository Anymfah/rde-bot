import {GenericStats} from "./generic-stats.interface";
import {WeaponStats} from "./weapon-stats.interface";


export interface RecentMatch {
  matchId: string;
  map: string;
  mapName: string;
  mode: string;
  topWeapon: WeaponStats;
  genericStats: GenericStats;
  acquisitions?: number;
  schematics?: number;
}
