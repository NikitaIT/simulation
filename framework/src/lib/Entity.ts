export abstract class Entity {
  #id: number | string;
  constructor(id?: number | string) {
    if (!Number.isNaN(id) || typeof id === 'string') {
      this.id = id;
    }
  }

  public get id(): number | string {
    return this.#id;
  }
  protected set id(x: number | string) {
    this.#id = x;
  }

  public equals(obj: unknown): boolean {
    if (!(obj instanceof Entity)) return false;

    const other = obj;

    if (this == other) return true;

    if (other.getRealType() != other.getRealType()) return false;

    if (this.id == 0 || other.id == 0) return false;

    return this.id == other.id;
  }

  // todo
  // public static bool operator ==(Entity a, Entity b)
  // {
  //     if (a is null && b is null)
  //         return true;

  //     if (a is null || b is null)
  //         return false;

  //     return a.Equals(b);
  // }

  // public static bool operator !=(Entity a, Entity b)
  // {
  //     return !(a == b);
  // }

  public getHashCode(): number {
    return this.hashCode(this.getRealType().toString() + this.id);
  }

  private getRealType(): { toString(): string } {
    // unwrap proxy
    return Object.getPrototypeOf(this).constructor.name;
  }

  // todo: move
  protected hashCode(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xffffffff;
  }
}
