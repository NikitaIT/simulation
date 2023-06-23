import { Goal } from '../event';
import { MatchSimulation } from './MatchSimulation';
import { Team } from './Team';

describe('Given MatchSimulation', () => {
  const team1Id = 0;
  const team2Id = 1;
  const firstGoal = 10;
  const create = () =>
    new MatchSimulation(new Team(team1Id), new Team(team2Id));
  it('Should be created', () => {
    create();
  });
  it('Should works without side effects', () => {
    const simulation = create();
    simulation.start(1);
    simulation.goal(0);
    simulation.goal(1);
    simulation.pause();
    simulation.start(2);
  });
  it('pause Should be idempotent', () => {
    const simulation = create();
    simulation.pause();
    simulation.pause();
  });
  it('start Should be idempotent', () => {
    const simulation = create();
    simulation.start(1);
    simulation.start(2);
    const sameTime = 1;
    simulation.start(sameTime);
    simulation.start(sameTime);
  });
  it.each([team1Id, team2Id])('pause Should be idempotent', (teamId: 1 | 0) => {
    const simulation = create();
    simulation.start(1);
    simulation.incCurrentTime(firstGoal);
    simulation.goal(teamId);
    const goal = simulation['domainEventsQueue'][0] as Goal;
    expect(goal.type).toEqual(Goal.type);
    expect(goal.data.teamId).toEqual('' + teamId);
    expect(goal.data.happenedAtSec).toEqual(firstGoal);
  });
  it('Goals after restart should have same happenedAtSec', () => {
    const simulation = create();
    simulation.start(1);
    simulation.incCurrentTime(firstGoal);
    simulation.goal(team1Id);
    simulation.end();
    simulation.start(1);
    simulation.incCurrentTime(firstGoal);
    simulation.goal(team1Id);
    const [goal1, goal2] = simulation['domainEventsQueue'] as [Goal, Goal];
    expect(goal1.data.happenedAtSec).toEqual(goal2.data.happenedAtSec);
  });
  it('NoStartTime', () => {
    const simulation = create();
    expect(() => simulation.start(0)).toThrowError(
      MatchSimulation.errors.NoStartTime
    );
  });
  it('GoalBeforeStart', () => {
    const simulation = create();
    simulation.pause();
    expect(() => simulation.goal(0)).toThrowError(
      MatchSimulation.errors.GoalBeforeStart
    );
  });
  it.todo('test it');
  it.todo('should exists because ...');
});
