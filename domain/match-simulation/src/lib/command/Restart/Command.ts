import { Either, left } from '@sweet-monads/either';
import { MatchSimulationJob } from '../../job/MatchSimulationJob';
import { MatchSimulationsRepository } from '../../repository/MatchSimulationsRepository';
import { BaseCommand, CommandHandler, Logger } from '@nba-node/framework';

export interface RestartArgs {
  matchIds: string[];
}

class Handler implements CommandHandler<Restart> {
  constructor(
    private repo: MatchSimulationsRepository,
    private job: MatchSimulationJob,
    private log: Logger
  ) {}
  handle(command: Restart): Either<unknown, unknown> {
    const ids = command.data.matchIds.map((x) => parseInt(x, 10));
    this.repo.getByIds(ids).map((x) => this.job.restart(x));

    this.log.info('restarted');

    return left('ok');
  }
}

export class Restart extends BaseCommand<RestartArgs> {
  static readonly type = 'RESTART';
  static readonly v = 0;
  constructor(args: RestartArgs) {
    super(Restart.type, Restart.v, args);
  }
  static Handler = Handler;
}
