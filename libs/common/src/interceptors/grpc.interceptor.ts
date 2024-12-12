import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { dayjs } from '@libs/common';

export class GrpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const requestTime = dayjs();
    const data = context.switchToRpc().getData();
    const ctx = context.switchToRpc().getContext();
    const metaData = ctx.getMap();

    const targetClass = context.getClass();
    const targetHandler = context.getHandler();

    const traceId = metaData['trace-id'];
    const clientClass = metaData['client-class'];
    const clientMethod = metaData['client-method'];
    const clientService = metaData['client-service'];

    const from = `${clientService}.${clientClass}.${clientMethod}`;
    const to = `${targetClass.name}.${targetHandler.name}`;

    const log = {
      traceId,
      from,
      to,
      data,
      timestamp: requestTime.toISOString(),
    };

    return next.handle().pipe(
      map((value, index) => {
        const responseTime = requestTime.unix() - dayjs().unix();
        console.log({ ...log, responseTime });
      }),
    );
  }
}
