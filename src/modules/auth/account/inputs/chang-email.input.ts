import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()
export class ChancgEmailInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string
}