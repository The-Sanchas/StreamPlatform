import { IngressInput } from 'livekit-server-sdk';
import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateStreamInput } from '../inputs/create-stream.input';
import { IngressService } from './ingress.service';
// import { PrismaService } from '@/src/core/prisma/prisma.service';
import { StreamService } from '../stream.service';

@Resolver('Ingress')
export class IngressResolver {
  public constructor(private readonly ingressService: IngressService, private readonly streamService: StreamService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'createStreamWithIngress' })
  public async createStreamWithIngress(
    @Authorized() user: User,
    @Args('data') input: CreateStreamInput,
    @Args('ingressType') ingressType: IngressInput
  ){

    const stream = await this.streamService.createStream(user, input)

     return  await this.ingressService.create(user, stream, ingressType)
  }
}
