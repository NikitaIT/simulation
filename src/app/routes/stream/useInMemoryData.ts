import {
  MatchSimulation,
  Team,
  MatchSimulationsRepository,
  MatchSimulationJob,
  MatchSimulationJobConfig,
} from '@nba-node/domain/match-simulation';
import { Logger } from '@nba-node/framework';

export function useInMemoryData(
  logger: Logger,
  config: MatchSimulationJobConfig
) {
  // todo: use week map
  const entityMap = new Map([
    [
      MatchSimulation,
      new Map([
        [1, new MatchSimulation(new Team('Germany'), new Team('Poland'), 1)],
        [2, new MatchSimulation(new Team('Brazil'), new Team('Mexico'), 2)],
        [3, new MatchSimulation(new Team('Argentina'), new Team('Uruguai'), 3)],
      ]),
    ],
  ]);

  // todo: inject to handler by type
  const repo = new MatchSimulationsRepository(
    entityMap.get(MatchSimulation) // todo: replace with UoW
  );

  const job = new MatchSimulationJob(logger, config);

  return { repo, job, entityMap };
}
