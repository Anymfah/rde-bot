



export interface WeaponClassStats {
  name: string;
  topWeaponName: string;
  topWeaponkills: number;
  topWeapondeaths: number;
  totalKillsByWeaponClass: number;
  classType: string;
  order: number;
  totalDeathsByWeaponClass: number;
  kdRatioByWeaponClass: string;
  topWeaponKdRatio: string;
  topWeaponRestricted?: boolean;
}
