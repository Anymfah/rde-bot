import {RecentMatch} from "./recent-match.interface";
import {GenericStats} from "./generic-stats.interface";
import {WeaponStats} from "./weapon-stats.interface";
import {ModeStats} from "./mode-stats.interface";
import {MatchInfo} from "./match-details.interface";
import {WeaponClassStats} from "./weapon-class-stats.interface";


export interface FullDataDto {
  status: string;
  data: {
    success: string;
    data: {
      matches: RecentMatch[];
      genericStats: GenericStats;
      weaponStats: WeaponStats[];
      weaponClassStats: WeaponClassStats[];
      modeStats: ModeStats[];
      equipmentStats: unknown[];
      killStreaks: WeaponStats[];
      gamertag: string;
    }
  }
}

export interface MatchInfoDto {
  status: string;
  data: {
    success: string;
    data: MatchInfo;
  }
}
