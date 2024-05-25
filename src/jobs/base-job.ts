import {inject, Injectable} from "../decorators/injectable.decorator";
import {Strapi} from "@strapi/types";
import CodApi from "../cod-api/cod-api";

@Injectable()
export abstract class BaseJob {
  private _initialized = false;
  protected strapi: Strapi;
  protected codApi: CodApi;

  private init() {
    this._initialized = true;
    this.strapi = global.strapi;
    this.codApi = inject(CodApi);
  }

  public run() {
    if (!this._initialized) {
      this.init();
    }
    this.job();
  }

  /**
   * The job to run
   */
  public abstract job(): void;
}
