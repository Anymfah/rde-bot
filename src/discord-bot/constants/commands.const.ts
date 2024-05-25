import {BaseCommand} from "../commands/base-command";
import {Strapi} from "@strapi/types";
import {StatsCommand} from "../commands/stats.command";
import {TestCommand} from "../commands/test.command";
import {Inscription} from "../commands/inscription";
import {Track} from "../commands/track.command";
import {LastGameCommand} from "../commands/last-game.command";

type CommandConstructor<T extends BaseCommand> = new () => T;
export const COMMANDS: CommandConstructor<BaseCommand>[] = [
  StatsCommand,
  TestCommand,
  Inscription,
  Track,
  LastGameCommand
];
