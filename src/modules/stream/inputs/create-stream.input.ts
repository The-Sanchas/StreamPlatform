import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateStreamInput {

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public title: string
}