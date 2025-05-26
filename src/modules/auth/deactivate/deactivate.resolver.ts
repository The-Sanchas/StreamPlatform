import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthModel } from '../account/models/auth.model';
import { DeactivateService } from './deactivate.service';
import { DeactivateAccauntInput } from './inputs/deactevate-accaunt.input';

@Resolver('Deactivate')
export class DeactivateResolver {
  public constructor(private readonly deactivateService: DeactivateService) {}


  @Authorization()
  @Mutation(() => AuthModel, {name: 'deactivateAccaunt'})
  public async deactivate(
    @Context() {req}: GqlContext,
    @Args('data') input: DeactivateAccauntInput,
    @Authorized() user: User,
    @UserAgent() userAgent: string
    ) {
      return this.deactivateService.deactivate(req, input, user, userAgent)
  }
}

