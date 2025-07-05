import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class SendMessageInput {
    
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public text: string
}