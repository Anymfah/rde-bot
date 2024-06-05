import {BaseCommand} from "../commands/base-command";
import {StatsCommand} from "../commands/stats.command";
import {TestCommand} from "../commands/test.command";
import {Login} from "../commands/login";
import {Track} from "../commands/track.command";
import {LastGameCommand} from "../commands/last-game.command";
import {Register} from "../commands/register";

type CommandConstructor<T extends BaseCommand> = new () => T;
export const COMMANDS: CommandConstructor<BaseCommand>[] = [
  StatsCommand,
  TestCommand,
  Login,
  Track,
  LastGameCommand,
  Register
];
