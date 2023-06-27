import { randomInt } from 'crypto';
import { delay, timeout } from '@nba-node/utils';
import { MatchSimulation } from '../entity';
import { Logger } from '@nba-node/framework';
import { setMaxListeners } from 'node:events';
export type MatchSimulationJobConfig = {
  intervalSec: number;
  timeoutSec: number;
};
// todo: use generators, persist ac in job context
export class MatchSimulationJob {
  constructor(
    private log: Logger,
    private config: MatchSimulationJobConfig,
    private now: () => number = () => Date.now()
  ) {}
  async start(simulation: MatchSimulation) {
    if (simulation.isStarted) {
      return;
    }
    const { intervalSec, timeoutSec } = this.config;
    // const concurrentTrasholdMs = 10;
    // const timeoutSec = realTimeoutSec + concurrentTrasholdMs;

    simulation.start(this.now());
    const currentSpentTimeMsec = () => this.now() - simulation.startTime;
    // intervalSec * x + y = current
    // x = current - y / intervalSec
    const intervalsSpent = () =>
      Math.floor(currentSpentTimeMsec() / (intervalSec * 1000)) + 1;

    const nextTry = () =>
      intervalSec * 1000 * intervalsSpent() - currentSpentTimeMsec();

    const lastTry = () =>
      Math.max(timeoutSec * 1000 - currentSpentTimeMsec(), 0);
    this.log.info(
      `intervalsSpent=${intervalsSpent()} intervalSec=${intervalSec * 1000}`
    );
    this.log.info(
      `Simulation started intervalSec=${intervalSec} timeoutSec=${timeoutSec} currentSpentTimeMsec=${currentSpentTimeMsec()}`
    );

    const ac = new AbortController();
    const maxIntervals = 100;
    setMaxListeners(maxIntervals, ac.signal);

    simulation.renewAC(ac); // hack instead of concurrent state, should be replaced with events

    if (lastTry() === 0) {
      this.log.info(`lastTry=${lastTry()} expired`);
      return;
    }
    const next = nextTry();
    this.log.info(`wait for nextTry=${next}`);
    await delay(next, ac.signal);

    const randomGoal = async (currentTry: number) => {
      this.log.info(`nextTry=${currentTry} started`);
      if (!simulation.isStarted) {
        this.log.info(`simulation not isStarted started, abort`);
        ac.abort();
        return;
      }
      const nextGoalTeam = randomInt(0, 2) as 1 | 0;
      simulation.incCurrentTime(intervalSec);
      simulation.goal(nextGoalTeam);
      this.log.info(
        `Goal created with currentTimeSec=${simulation.currentTimeSec}`
      );

      if (Math.abs(simulation.currentTimeSec - timeoutSec) <= 0.0001) {
        this.log.info(
          `simulation.currentTimeSec=${simulation.currentTimeSec} expired by timeoutSec=${timeoutSec}`
        );
        ac.abort();
        simulation.pause();
        return;
      }

      const next = nextTry();
      this.log.info(`wait for nextTry=${next}`);
      return delay(next, ac.signal).then(() => randomGoal(next));
    };
    const last = lastTry();
    this.log.info(`wait for lastTry=${last}`);
    await Promise.race([
      randomGoal(next),
      timeout(last, ac.signal).catch((e) => {
        this.log.info(`simulation timeout`);
        // simulation.pause(); only abort signal, it's paused in randomGoal in race
        return e;
      }),
    ]);
  }

  pause(simulation: MatchSimulation) {
    simulation.pause();
    this.log.info(`simulation paused`);
  }

  async restart(simulation: MatchSimulation) {
    simulation.end();
    this.log.info(`simulation ended and restart planned`);
    return this.start(simulation);
  }
}
