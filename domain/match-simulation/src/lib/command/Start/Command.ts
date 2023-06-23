import { Either, left } from '@sweet-monads/either';
import { MatchSimulationJob, MatchSimulationsRepository } from '../..';
import { BaseCommand, CommandHandler, Logger } from '@./framework';

export interface StartArgs {
  matchIds: string[];
}

class Handler implements CommandHandler<Start> {
  constructor(
    private repo: MatchSimulationsRepository,
    private job: MatchSimulationJob,
    private log: Logger
  ) {}
  handle(command: Start): Either<unknown, unknown> {
    this.repo
      .getByIds(command.data.matchIds.map((x) => parseInt(x, 10)))
      .map((x) => this.job.start(x));

    this.log.info('started');

    return left('ok');
  }
}

export class Start extends BaseCommand<StartArgs> {
  static readonly type = 'START';
  static readonly v = 0;
  constructor(args: StartArgs) {
    super(Start.type, Start.v, args);
  }

  static Handler = Handler;
}
