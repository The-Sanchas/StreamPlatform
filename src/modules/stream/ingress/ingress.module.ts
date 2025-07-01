import { Module } from '@nestjs/common';
import { IngressService } from './ingress.service';
import { IngressResolver } from './ingress.resolver';
import { StreamService } from '../stream.service';

@Module({
  providers: [IngressResolver, IngressService, StreamService],
})
export class IngressModule {}
