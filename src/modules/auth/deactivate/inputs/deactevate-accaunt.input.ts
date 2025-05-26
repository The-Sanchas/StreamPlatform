import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

@InputType()
export class DeactivateAccauntInput {

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string

    
    @Field(() => String, {  nullable: true }) 
    public pin?: string
}