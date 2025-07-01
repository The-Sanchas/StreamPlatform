import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GraphQLUpload, FileUpload } from 'graphql-upload'; 
import { StreamModel } from './model/stream.model';
import { StreamService } from './stream.service';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { ChangeStreamTumbnailInput } from './inputs/change-stream-tumbnail.input';
import { CreateStreamInput } from './inputs/create-stream.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { GenersteStreamTokenModel } from './model/generate-stream-token.model';


@Resolver('Stream')
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'findAllStreams' })
  public async findAllStream(@Args('filters') input: FiltersInput){
    return this.streamService.findAll(input)
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  public async findRandom(){
    return this.streamService.findRandom()
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  public async chngeInfo(
    @Authorized() user: User,
    @Args('data') input: ChangeStreamInfoInput
  ){
    return this.streamService.changeInfo(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamTombnail' })
  public async changeTombnail(
    @Authorized() user: User,
    @Args('tombnail', {type: () => GraphQLUpload}, FileValidationPipe) tombnail: FileUpload,
    @Args('data') input: ChangeStreamTumbnailInput
  ){
    return this.streamService.changeTombnail(user, tombnail, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeStreamTombnail' })
  public async removeThumbnail(
    @Authorized() user: User,
    @Args('streamId') streamId: ChangeStreamTumbnailInput
  ){
    return this.streamService.removeThumbnail(user, streamId)
  }

  @Mutation(() => GenersteStreamTokenModel, { name: 'genersteStreamToken' })
  public async generateToken(@Args('data') input: GenerateStreamTokenInput){
    return this.streamService.generateStreamToken(input)
  }

  // @Authorization()
  // @Mutation(() => StreamModel, { name: 'createStream' })
  // public async createStream(
  //   @Authorized() user: User,
  //   @Args('data') input: CreateStreamInput
  // ){
  //   return this.streamService.createStream(user, input)
  // }

}
