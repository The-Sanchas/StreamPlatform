import type { Stream, User } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";
import { CategoryModel } from "../../category/models/category.model";
import { ChatMessagesModel } from "../../chat/models/chat-message.model";
import { ChatSettingsModel } from "../../chat/models/chat-settings.model";

@ObjectType()
export class StreamModel implements Stream{
    @Field(() => ID)
    public id: string

    @Field(() => String)
    public title: string

    @Field(() => String, {nullable: true})
    public thumbnailUrl: string

    @Field(() => String, {nullable: true})
    public ingressId: string

    @Field(() => String, {nullable: true})
    public serverUrl: string

    @Field(() => String, {nullable: true})
    public steamKey: string

    @Field(() => Boolean)
    public isLive: boolean

    @Field(() => UserModel)
    public user: UserModel

    @Field(() => String)
    public userId: string

    @Field(() => [ChatMessagesModel])
    public chatMessage: ChatMessagesModel[]

    @Field(() => ChatSettingsModel)
    public chatSettings: ChatSettingsModel

    @Field(() => CategoryModel)
    public category: CategoryModel

    @Field(() => String)
    public categoryId: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date
}