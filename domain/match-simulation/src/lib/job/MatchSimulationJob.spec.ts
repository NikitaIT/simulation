import { delay } from '@./utils';
import { MatchSimulation, Team } from '../entity';
import { MatchSimulationJob } from './MatchSimulationJob';
import { FakeLogger } from '@./framework';
import { Goal } from '../event';

describe('Given MatchSimulationJob', () => {
  const team1Id = 0;
  const team2Id = 1;
  const create = () =>
    new MatchSimulation(new Team(team1Id), new Team(team2Id));
  const createLogger = () =>
    new (class Logger extends FakeLogger {
      q: string[] = [];
      info(...args: any[]): void {
        this.q.push(...args);
      }
    })();
  it.todo('1s per test is too long and unsafe, make it generator based');
  it('user should be able to start/stop/restart the simulation', async () => {
    const logger = createLogger();
    const job = new MatchSimulationJob(
      logger,
      { intervalSec: 0.2, timeoutSec: 0.6 },
      () => 1
    );
    const simulation = create();
    job.start(simulation).catch(() => {
      //Timeout aborted
    });
    // console.log('simulation0', [...simulation['domainEventsQueue']]);
    await delay(2_10);
    job.pause(simulation);
    expect(simulation['domainEventsQueue'].length).toEqual(1);
    await delay(4_10);
    job.restart(simulation).catch(() => {
      //Timeout aborted
    });
    expect(simulation['domainEventsQueue'].length).toEqual(1);
    await delay(2_10);
    expect(simulation['domainEventsQueue'].length).toEqual(2);
    await delay(4_10);
    expect(simulation['domainEventsQueue'].length).toEqual(4);

    job.pause(simulation);
    await delay(2_00);
  });
  it('Each simulation should last not more than timeoutSec seconds', async () => {
    const logger = createLogger();
    const timeMtp = 50; // WARN: < 200 too small for concurrent tests
    const job = new MatchSimulationJob(
      logger,
      { intervalSec: (2 * timeMtp) / 1000, timeoutSec: (6 * timeMtp) / 1000 },
      () => Date.now()
    );
    const simulation = create();
    job.start(simulation).catch(() => {
      //Timeout aborted
    });

    [1, 2, 3, 4, 5, 6, 7].forEach((x) => {
      delay(x * timeMtp).then(() => logger.info(x + ' sec'));
    });

    await delay(1 * timeMtp);
    expect(simulation['domainEventsQueue'].length).toEqual(0);
    await delay(1.5 * timeMtp); // 2.5
    expect(simulation['domainEventsQueue'].length).toEqual(1);
    await delay(2.5 * timeMtp); // 5
    expect(simulation['domainEventsQueue'].length).toEqual(2);
    await delay(5 * timeMtp);
    expect(simulation['domainEventsQueue'].length).toEqual(3);

    expect(simulation.isStarted).toEqual(false);

    job.pause(simulation);
    // console.log(
    //   logger.q.join('\r\n'),
    //   JSON.stringify(simulation['domainEventsQueue'], null, 2)
    // );
    await delay(1 * timeMtp);
  });
  it('Each simulation should last not more than timeoutSec seconds (unless manually finished by the user before timeoutSec seconds elapses)', async () => {
    const logger = createLogger();
    const timeMtp = 50; // WARN: < 200 too small for concurrent tests
    const simulation = create();
    try {
      const job = new MatchSimulationJob(
        logger,
        { intervalSec: 2 * (timeMtp / 1000), timeoutSec: 6 * (timeMtp / 1000) },
        () => Date.now()
      );
      job.start(simulation).catch(() => {
        //Timeout aborted
      });

      [1, 2, 3, 4, 5, 6, 7].forEach((x) => {
        delay(x * timeMtp).then(() => logger.info(x + ' sec'));
      });

      await delay(1 * timeMtp);
      expect(simulation['domainEventsQueue'].length).toEqual(0);
      await delay(1 * timeMtp);
      expect(simulation['domainEventsQueue'].length).toEqual(1);
      await delay(3 * timeMtp);
      expect(simulation['domainEventsQueue'].length).toEqual(2);
      job.pause(simulation);
      await delay(1 * timeMtp);
      expect(simulation['domainEventsQueue'].length).toEqual(2);
      job.restart(simulation);
      await delay(2 * timeMtp);
      expect(simulation['domainEventsQueue'].length).toEqual(3);
    } finally {
      // console.log(
      //   logger.q.join('\r\n'),
      //   JSON.stringify(simulation['domainEventsQueue'], null, 2)
      // );
    }
    await delay(1 * timeMtp);
  }, 7000);
  it('Every intervalSec seconds random team scores exactly 1 goal.', async () => {
    // ... check next test
  });
  it('The first goal is scored at the intervalSec-th second, last goal is scored at the (timeoutSec/intervalSec)-th second.', async () => {
    const timeMtp = 50; // WARN: < 200 too small for concurrent tests
    const simulation = create();
    const config = {
      intervalSec: 2 * (timeMtp / 1000),
      timeoutSec: 6 * (timeMtp / 1000),
    };
    const job = new MatchSimulationJob(new FakeLogger(), config, () =>
      Date.now()
    );
    job.start(simulation);

    await delay(7 * timeMtp);
    const [g1, g2, g3] = (simulation['domainEventsQueue'] as Goal[]).map(
      (x) => x.data.happenedAtSec
    );
    expect(g1).toEqual(config.intervalSec);
    expect(g2).toEqual(config.intervalSec * 2);
    expect(g3).toEqual(config.intervalSec * 3);
    //
  });
});
