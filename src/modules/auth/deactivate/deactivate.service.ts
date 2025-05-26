import { TokenType, type User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { destroySession } from '@/src/shared/utils/session.util';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { MailService } from '../../libs/mail/mail.service';
import { DeactivateAccauntInput } from './inputs/deactevate-accaunt.input';

@Injectable()
export class DeactivateService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
        ){}

    public async deactivate(
        req: Request,
        input: DeactivateAccauntInput, 
        user: User, 
        userAgent: string
    ){
        const { email, password, pin } = input

        if(user.email !== email) {
            throw new BadRequestException('Неверная почта')
        }

        const isValidatePassword = await verify(user.password, password)

        if(!isValidatePassword){
            throw new BadRequestException('Неверный пароль')
        }

        if(!pin){
            await this.sendDeactivateToken(req, user, userAgent)

            return {message: 'Требуется код подтверждения'}
        }

        await this.validateDeactivateToken(req, pin)

        return { user }

    }

    public async validateDeactivateToken(req: Request, token: string){
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.DEACTIVATE_ACCAUNT            
            }
        })
        if (!existingToken) {
            throw new NotFoundException("Token not found")
        }
        const hasExpired = new Date(existingToken.expiresIn) < new Date()
    
        if (hasExpired) {
            throw new BadRequestException("Token has expired")
        }
    
        await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isDeactivated: true,
                deactivatedAt: new Date()
            }
        })
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCAUNT 
            }
        })
        
        return destroySession(req, this.configService)
    }

    public async sendDeactivateToken(req: Request, user: User, userAgent: string){
        const deactivateToken = await generateToken(
            this.prismaService,
            user,
            TokenType.MAIL_VERIFY,
            false
        )

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendDeactivateToken(user.email, deactivateToken.token, metadata)

        return true
    }
}