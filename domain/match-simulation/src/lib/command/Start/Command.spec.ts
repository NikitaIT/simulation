import { MatchSimulationJob } from '../../job/MatchSimulationJob';
import { MatchSimulationsRepository } from '../../repository/MatchSimulationsRepository';
import { Start as Command } from './Command';
import { FakeLogger } from '@nba-node/framework';
import { MatchSimulation } from '../../entity/MatchSimulation';
import { Team } from '../../entity';
describe('Given Restart', () => {
  it('Should be created', () => {
    new Command({ matchIds: [] });
  });
  it('Should be handled without errors', () => {
    const handler = new Command.Handler(
      new MatchSimulationsRepository(new Map()),
      new MatchSimulationJob(new FakeLogger(), {
        intervalSec: 0.1,
        timeoutSec: 0.2,
      }),
      new FakeLogger()
    );
    const command = new Command({ matchIds: [] });
    const result = handler.handle(command);
    expect(result.isLeft()).toEqual(true);
  });
  it('Should be handled without errors', () => {
    const handler = new Command.Handler(
      new MatchSimulationsRepository(
        new Map([
          [1, new MatchSimulation(new Team(''), new Team(''))],
          [2, new MatchSimulation(new Team(''), new Team(''))],
        ])
      ),
      new MatchSimulationJob(new FakeLogger(), {
        intervalSec: 0.1,
        timeoutSec: 0.2,
      }),
      new FakeLogger()
    );
    const command = new Command({ matchIds: ['1', '2'] });
    const result = handler.handle(command);
    expect(result.isLeft()).toEqual(true);
  });
});
