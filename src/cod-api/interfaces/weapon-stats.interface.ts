

export interface WeaponStats {
  name: string;
  className: string;
  kills: number;
  aiAgentKills: number;
  extracted: number;
  deaths: number;
  shots: number;
  headshots: number;
  damage: number;
  hits: number;
  kdRatio: string;
  accuracy: string;
  headshotPercentage: string;
  hudImage: string;
  imageIcon: string;
  label: string;
  uses: number;
  classLabel: string;
  restricted?: boolean;
}
