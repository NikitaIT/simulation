export interface DomainEvent<T extends object = object> {
  readonly type: string;
  readonly version: number;
  data: T;
}

export class BaseEvent<T extends object> implements DomainEvent<T> {
  constructor(
    public readonly type: string,
    public readonly version: number,
    public data: T
  ) {}
}
