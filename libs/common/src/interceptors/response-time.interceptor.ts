import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { dayjs } from '@libs/common';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  private readonly LATENCY_LIMIT: number = 2000;

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const responseTime = dayjs().unix();
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(() => {
        const diff = dayjs().unix() - responseTime;
        if (diff > this.LATENCY_LIMIT) {
          throw new RequestTimeoutException(
            `응답시간이 너무 깁니다. 최대 허용 응답 시간: ${this.LATENCY_LIMIT}ms`,
          );
        }
        console.log(
          `[${request.method}]${request.path}:Response time: ${diff}ms`,
        );
      }),
    );
  }
}
