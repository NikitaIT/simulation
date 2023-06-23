import {
  AggregateRoot,
  Entity,
  BaseEvent,
  Logger,
  FakeLogger,
  BaseCommand,
} from './lib';
import { BaseLogger } from 'pino';

describe('framework', () => {
  it.each([1, '', undefined])('AggregateRoot should work', (id) => {
    expect(new AggregateRoot(id).id).toEqual(id);
  });

  it('AggregateRoot onEvent should be function', () => {
    const agg = new AggregateRoot();
    expect(typeof agg['onEvent']).toEqual('function');
  });

  it('AggregateRoot onEvent should be exec on addDomainEvent', async () => {
    const event = new BaseEvent('EVENT_NAME', 0, {});
    class A extends AggregateRoot {
      emit() {
        this.addDomainEvent(event);
      }
    }
    const agg = new A();

    queueMicrotask(() => agg.emit());

    const eventInQ = await new Promise((resolve) => agg['onEvent'](resolve));

    expect(eventInQ).toEqual(event);
  });

  it('Entity Should be abstract', () => {
    // @ts-expect-error Should be abstract
    new Entity();
  });

  it('BaseEvent Should work', () => {
    new BaseEvent('EVENT_NAME', 0, {});
    new BaseEvent('EVENT_NAME', 1, {});
  });

  it('BaseCommand Should work', () => {
    new BaseCommand('COMMAND_NAME', 0, {});
    new BaseCommand('COMMAND_NAME', 1, {});
  });

  it('FakeLogger Should be Logger', () => {
    const t: Logger = new FakeLogger();
    expect(t).toBe(t);
  });

  it('FakeLogger Should be Pino.BaseLogger', () => {
    const t: BaseLogger = new FakeLogger();
    expect(t).toBe(t);
  });
});
