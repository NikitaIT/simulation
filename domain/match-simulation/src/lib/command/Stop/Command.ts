import { MatchSimulationJob } from '../../job/MatchSimulationJob';
import { MatchSimulationsRepository } from '../../repository/MatchSimulationsRepository';
import { BaseCommand, CommandHandler, Logger } from '@nba-node/framework';
import { Either, left } from '@sweet-monads/either';

export interface StopArgs {
  matchIds: string[];
}

class Handler implements CommandHandler<Stop> {
  constructor(
    private repo: MatchSimulationsRepository,
    private job: MatchSimulationJob,
    private log: Logger
  ) {}
  handle(command: Stop): Either<unknown, unknown> {
    this.repo
      .getByIds(command.data.matchIds.map((x) => parseInt(x, 10)))
      .map((x) => this.job.pause(x));

    this.log.info('finish');

    return left('ok');
  }
}

export class Stop extends BaseCommand<StopArgs> {
  static readonly type = 'STOP';
  static readonly v = 0;
  constructor(args: StopArgs) {
    super(Stop.type, Stop.v, args);
  }
  static Handler = Handler;
}
