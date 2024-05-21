import {BaseCommand} from "../commands/base-command";
import {Strapi} from "@strapi/types";
import {StatsCommand} from "../commands/stats.command";
import {TestCommand} from "../commands/test.command";
import {Inscription} from "../commands/inscription";

type CommandConstructor<T extends BaseCommand> = new (strapi:Strapi) => T;
export const COMMANDS: CommandConstructor<BaseCommand>[] = [
  StatsCommand,
  TestCommand,
  Inscription
];
