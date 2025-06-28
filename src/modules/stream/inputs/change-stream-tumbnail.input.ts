import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ChangeStreamTumbnailInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public id: string
}