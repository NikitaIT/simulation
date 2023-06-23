import { Goal } from '../event';
import { AggregateRoot } from '@./framework';
import { Team } from './Team';

export class MatchSimulation extends AggregateRoot {
  static errors = {
    NoStartTime: 'MatchSimulation start without startTime',
    GoalBeforeStart: 'MatchSimulation goal before start',
  };
  constructor(
    public readonly homeTeam: Team,
    public readonly externalTeam: Team,
    id: number | string = 0,
    private readonly score: [number, number] = [0, 0],
    public startTime: number = 0,
    public isStarted: boolean = false,
    private _currentTimeSec: number = 0
  ) {
    super(id);
  }

  start(startTime: number) {
    if (!startTime) {
      throw new Error(MatchSimulation.errors.NoStartTime);
    }
    this.isStarted = true;
    if (this.startTime) return;

    this.startTime = startTime;
  }

  goal(homeOrExternal: 0 | 1) {
    if (!this.isStarted) {
      throw new Error(MatchSimulation.errors.GoalBeforeStart);
    }
    this.score[homeOrExternal]++;
    const team = homeOrExternal ? this.externalTeam : this.homeTeam;
    this.addDomainEvent(
      new Goal({
        teamId: '' + team.id,
        matchId: '' + this.id,
        score: [...this.score],
        happenedAtSec: this.currentTimeSec,
      })
    );
  }
  get currentTimeSec() {
    return this._currentTimeSec;
  }
  incCurrentTime(sec: number) {
    this._currentTimeSec += sec;
  }

  private resetScore() {
    this.score[0] = 0;
    this.score[1] = 0;
  }
  pause() {
    this.isStarted = false;
  }
  end() {
    this.pause();
    this.resetScore();
    this._currentTimeSec = 0;
    this.startTime = 0;
  }

  private ac: AbortController;

  renewAC(ac: AbortController) {
    if (this.ac) {
      this.ac.abort();
    }
    this.ac = ac;
  }
}
