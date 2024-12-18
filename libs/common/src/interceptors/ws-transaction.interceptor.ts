import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class WsTransactionInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const client = context.switchToWs().getClient();
    const session = await this.connection.startSession();
    client.data.mongooseSession = session;
    return next.handle().pipe(
      catchError(async (error) => {
        await session.abortTransaction();
        throw error;
      }),
      tap(async () => {
        await session.commitTransaction();
      }),
      finalize(async () => {
        await session.endSession();
      }),
    );
  }
}
