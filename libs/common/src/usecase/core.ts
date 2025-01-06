export abstract class UseCase<I = any, O = NonNullable<unknown>> {
  abstract execute(dto: I): O;
}
