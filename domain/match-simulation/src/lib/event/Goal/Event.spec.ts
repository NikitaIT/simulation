import { Goal as Event } from './Event';

describe('Given Goal', () => {
  it('Should be created', () => {
    const event = new Event({
      matchId: '1',
      teamId: '1',
      happenedAtSec: 10,
      score: [0, 1],
    });
    expect(event).toBe(event);
  });
  it.todo('should have matchId because ...');
  it.todo('should have teamId because ...');
  it.todo('should have happenedAtSec because ...');
  it.todo('should have score because ...');
});
