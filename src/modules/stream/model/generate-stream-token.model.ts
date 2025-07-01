import type { Stream, User } from "@/prisma/generated";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserModel } from "../../auth/account/models/user.model";

@ObjectType()
export class GenersteStreamTokenModel{
    @Field(() => ID)
    public token: string

    
}