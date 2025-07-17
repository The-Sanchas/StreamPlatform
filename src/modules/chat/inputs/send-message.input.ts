import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class SendMessageInput {
    
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public text: string


    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    public streamid: string
}