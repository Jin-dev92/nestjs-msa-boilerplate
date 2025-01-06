type ParamReturnType<P> = {
  [key in keyof P]: P[key];
};

type WhereClauseType<P> = {
  where: ParamReturnType<P> | NonNullable<unknown>;
  skip: number;
  take: number;
};

export class WhereClauseParser<P> {
  private readonly dto: P;
  private params: ParamReturnType<P> = {} as ParamReturnType<P>;
  private skip: number = 0;
  private take: number = 10;

  constructor(dto: P) {
    this.dto = dto;
  }

  public parse(): WhereClauseType<P> {
    const keys = Object.keys(this.dto);
    if (keys.length === 0) {
      return {
        where: {},
        skip: this.skip,
        take: this.take,
      };
    }
    for (const key of keys) {
      if (['skip', 'take'].includes(key)) {
        this[key] = this.dto[key];
        continue;
      }
      this.params[key] = this.dto[key];
    }

    return {
      where: this.params,
      skip: this.skip,
      take: this.take,
    };
  }
}
