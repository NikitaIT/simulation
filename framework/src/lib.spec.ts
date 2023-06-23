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
  it('AggregateRoot domainEventsQueue should be 0', () => {
    const agg = new AggregateRoot();
    expect(agg['domainEventsQueue'].length).toEqual(0);
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
    expect(agg['domainEventsQueue'].length).toEqual(1);
  });

  it('Entity Should be abstract', () => {
    // @ts-expect-error Should be abstract
    new Entity();
  });

  it('Entity Should works', () => {
    class A extends Entity {}
    class B extends Entity {}
    const a = new A('1');
    const b = new B('1');
    expect(typeof a.getHashCode()).toBe('number');
    expect(a.equals({})).toBe(false);
    expect(a.equals(a)).toBe(true);
    expect(a.equals(new A('2'))).toBe(false);
    expect(new A(0).equals(new A(0))).toBe(false);
  });
  it.todo('Entity Should equals with same id');
  it.failing('Entity Should equals with same id', () => {
    class A extends Entity {}
    class B extends Entity {}
    const a = new A('1');
    const b = new B('1');
    expect(a.equals(b)).toBe(false);
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
  it('FakeLogger Should works', () => {
    const t: Logger = new FakeLogger();
    t.error('');
    t.info('');
    t.warn('');
    t.fatal('');
    t.silent('');
    t.trace('');
    t.debug('');
    expect(t.level).toEqual('');
  });
});
