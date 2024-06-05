

export interface TelescopeLoginUmbrellaResponse {
  unoUsername: string;
  accessExpires: number;
  accessToken: string;
  unoID: number;
}
export interface TelescopeLoginResponse {
  status:number;
  statusText:string;
  data: {
    umbrella: TelescopeLoginUmbrellaResponse;
  }
}

export interface TelescopeLoginErrorNestedResponse {
  name: string;
  msg: string;
  lsCode: string;
}
export interface TelescopeLoginErrorResponse {
  error: TelescopeLoginErrorNestedResponse;
}
