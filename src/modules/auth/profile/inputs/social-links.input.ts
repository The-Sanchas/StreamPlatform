import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class SocialLinksInput {

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public title: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public url: string
}


@InputType()
export class SocialLinksOrderInput {

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public id: string

    @Field(() => Number)
    @IsNumber()
    @IsNotEmpty()
    public position: number
}