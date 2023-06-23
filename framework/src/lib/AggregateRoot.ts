import EventEmitter from 'node:events';
import { DomainEvent } from './DomainEvent';
import { Entity } from './Entity';

export class AggregateRoot extends Entity {
  #domainEventsQueue: Readonly<DomainEvent>[] = [];
  #emmiter = new EventEmitter();
  /**
   * Virtual private member, only for external access
   */
  private get domainEventsQueue(): readonly Readonly<DomainEvent>[] {
    return this.#domainEventsQueue;
  }
  private onEvent(fn: (event: DomainEvent) => void) {
    this.#emmiter.on('event', fn);
  }
  /**
   * Handled in same domain context
   *
   */
  protected addDomainEvent(x: Readonly<DomainEvent>) {
    this.#domainEventsQueue.push(x);
    this.#emmiter.emit('event', x);
  }
}
