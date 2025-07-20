import type { User } from "@/prisma/generated";
import { FollowModel } from "@/src/modules/follow/model/follow.model";
import { StreamModel } from "@/src/modules/stream/model/stream.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SocialLinkModel } from "../../profile/model/social-link.model";

@ObjectType()
export class UserModel implements User{
    @Field(() => ID)
    public id: string

    @Field(() => String)
    public email: string

    @Field(() => String)
    public password: string

    @Field(() => String)
    public username: string

    @Field(() => String)
    public dispayName: string

    @Field(() => String, {nullable: true})
    public avatar: string

    @Field(() => String, {nullable: true})
    public bio: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date

    @Field(() => Boolean)
    public isVerefied: boolean

    @Field(() => Boolean)
    public isDeactivated: boolean

    @Field(() => Date, { nullable: true })
    public deactivatedAt: Date

    @Field(() => [SocialLinkModel])
    public  socialLinks: SocialLinkModel[]

    @Field(() => [FollowModel])
    public  followers: FollowModel[]

    @Field(() => [FollowModel])
    public  followings: FollowModel[]

    @Field(() => [StreamModel])
    public  stream: StreamModel

    @Field(() => Boolean)
    public isEmailVerefied: boolean

    @Field(() => Boolean)
    public isTotpEnabled: boolean;

    @Field(() => String, {nullable: true})
    public totpSecret: string

}