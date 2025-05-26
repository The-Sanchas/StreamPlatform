import { Field, ObjectType } from '@nestjs/graphql';
import { Secret } from 'otpauth';


@ObjectType()
export class TotpModel {

    @Field(() => String)
    public qrcodeUrl: string

    @Field(() => String)
    public secret: Secret
}