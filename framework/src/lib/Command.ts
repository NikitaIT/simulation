import { Either } from '@sweet-monads/either';

export interface CommandHandler<TCommand extends Command> {
  handle(command: TCommand): Either<unknown, unknown>;
}

/**
 * EmptyObject used as base line for extendable args without bc
 */
export interface Command<T extends object = object> {
  readonly type: string;
  readonly version: number;
  readonly data: T;
}

/**
 * EmptyObject used as base line for extendable args without bc
 */
export class BaseCommand<T extends object> implements Command<T> {
  constructor(
    public readonly type: string,
    public readonly version: number,
    public data: T
  ) {}
}
