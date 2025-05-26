import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import type { Request } from 'express';
import { VerificationInput } from './inputs/verification.input';
import { TokenType, User } from '@/prisma/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { saveSession } from '@/src/shared/utils/session.util';
import { generateToken } from '@/src/shared/utils/generate-token.util';

@Injectable()
export class VerificationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService   
    ){}

    public async verify(req: Request, input: VerificationInput, userAgent: string) {
        const { token } = input

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.MAIL_VERIFY            
            }
        })
        if (!existingToken) {
            throw new NotFoundException("Token not found")
        }
        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException("Token has expired")
        }

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isEmailVerefied: true
            }
        })
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.MAIL_VERIFY 
            }
        })
        const metadata = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metadata)
    }

    public async sendVerificationToken(user: User){
        const verificationToken = await generateToken(
            this.prismaService,
            user,
            TokenType.MAIL_VERIFY,
        )

        await this.mailService.sendVerificationToken(user.email, verificationToken.token)

        return true
    } 
}