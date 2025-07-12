import type { ChatSettings } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { StreamModel } from "../../stream/model/stream.model";

@ObjectType()
export class ChatSettingsModel implements ChatSettings{
    @Field(() => ID)
    public id: string

    @Field(() => Boolean)
    public isChatEnabled: boolean

    @Field(() => Boolean)
    public isChatFollowersOnly: boolean

    @Field(() => Boolean)
    public isChatPremiumFollowersOnly: boolean

    @Field(() => StreamModel)
    public stream: StreamModel

    @Field(() => String)
    public streamId: string

    @Field(() => Date)
    public createdAt: Date

    @Field(() => Date)
    public updatedAt: Date
}