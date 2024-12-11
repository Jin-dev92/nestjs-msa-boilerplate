import { InterceptingCall, NextCall } from '@grpc/grpc-js';

export const traceInterceptor =
  (service: string) => (options, nextCall: NextCall) => {
    return new InterceptingCall(nextCall(options), {
      start: function (metadata, listener, next) {
        metadata.set('client-service', service);
        next(metadata, listener);
      },
    });
  };
