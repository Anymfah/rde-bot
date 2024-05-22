import {Injectable} from "../decorators/injectable.decorator";
import {Strapi} from "@strapi/types";


@Injectable()
export class StrapiService {
  private readonly strapi: any;

  public constructor() {
    this.strapi = global.strapi;
    return this.strapi;
  }
}
