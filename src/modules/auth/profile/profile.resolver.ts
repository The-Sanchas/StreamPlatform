import { Query , Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
// import * as Upload from 'graphql-upload/Upload.ts'
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.ts'
import { GraphQLUpload, FileUpload } from 'graphql-upload'; 
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinksInput, SocialLinksOrderInput } from './inputs/social-links.input';
import { SocialLinkModel } from './model/social-link.model';

@Resolver('Profile')
export class ProfileResolver {
  public constructor(private readonly profileService: ProfileService) {}


  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
  public async changeAvatar(
    @Authorized() user: User, 
    @Args('avatar', {type: () => GraphQLUpload}, FileValidationPipe) avatar: FileUpload){
    return this.profileService.changeAvatar(user, avatar)
  }


  @Authorization()
  @Mutation(() => Boolean, { name: 'removeProfileAvatar' })
  public async removeAvatar(@Authorized() user: User){
    return this.profileService.removeAvatar(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileInfo' })
  public async changeInfo(
    @Authorized() user: User,
    @Args('data') input:  ChangeProfileInfoInput
  ){
    return this.profileService.changeInfo(user, input)
  }

  @Authorization()
  @Query(() => [SocialLinkModel], { name: 'findSocialLink' })
  public async findSocialLink(@Authorized() user: User){
    return this.profileService.findSocialLink(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'createSocialLink' })
  public async createSocialLink(
    @Authorized() user: User,
    @Args('data') input:  SocialLinksInput
  ){
    return this.profileService.createSocialLink(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'reorderSocialLink' })
  public async reorderSocialLink(@Args('list', {type:()=>[SocialLinksOrderInput]}) list:  SocialLinksOrderInput[]){
    return this.profileService.reorderSocialLinks(list)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'updateSocialLink' })
  public async updateSocialLink(
    @Args('id') id: string,
    @Args('data') input:  SocialLinksInput
  ){
    return this.profileService.updateSocialLink(id, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSocialLink' })
  public async removeSocialLink(
    @Args('id') id: string,
  ){
    return this.profileService.removeSicialLink(id)
  }


}
