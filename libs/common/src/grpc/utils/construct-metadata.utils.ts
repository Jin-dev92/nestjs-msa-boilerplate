import { Metadata } from '@grpc/grpc-js';
import { v4 } from 'uuid';

export const constructMetadataUtils = (
  callerClass: string,
  callerMethod: string,
  prevMetadata?: Metadata,
) => {
  const metadata = prevMetadata ?? new Metadata();
  const traceId = metadata.getMap()['trace-id'] ?? v4();
  metadata.set('trace-id', traceId.toString());
  metadata.set('client-class', callerClass);
  metadata.set('client-method', callerMethod);
  return metadata;
};

export class MetaDataBuilder {
  metadata: Metadata;
  traceId: string;

  constructor(prevMetaData?: Metadata) {
    this.metadata = prevMetaData ?? new Metadata();
    this.traceId = this.metadata.getMap()['trace-id'].toString() ?? v4();
  }

  setClientMethod(clientMethod: string) {
    this.metadata.set('client-method', clientMethod);
    return this;
  }

  setClientClass(clientClass: string) {
    this.metadata.set('client-class', clientClass);
    return this;
  }

  setTraceId(traceId: string = v4()) {
    this.metadata.set('trace-id', traceId);
    return this;
  }

  build() {
    return this.metadata;
  }
}
