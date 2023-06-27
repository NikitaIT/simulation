import { BaseEvent } from '@nba-node/framework';

export interface GoalData {
  matchId: string;
  teamId: string;
  happenedAtSec: number;
  score: [number, number]; // we can delete this param and implement MatchStarted/MatchEnded events
}

export class Goal extends BaseEvent<GoalData> {
  static readonly type = 'GOAL';
  static readonly v = 0;
  constructor(args: GoalData) {
    super(Goal.type, Goal.v, args);
  }
}
