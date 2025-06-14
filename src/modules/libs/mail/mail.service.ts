import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { DeactevateTemplate } from './templates/deactivate.template';
import { PasswordRecaveryTemplate } from './templates/password-recavery.template';
import { VerificationTemplate } from './templates/verification.template';
import { AccauntDeletionTemplate } from './templates/accaunt-deletion.template';

@Injectable()
export class MailService {
    public constructor (
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ){}

    public async sendVerificationToken( email: string, token: string){
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(VerificationTemplate({ domain, token }))

        return this.sendMail(email, 'Верифиация аккаунта', html)
    }

    public async sendPasswordResetToken( 
        email: string,
        token: string,
        metadata: SessionMetadata
    ){
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(PasswordRecaveryTemplate({ domain, token, metadata }))

        return this.sendMail(email, 'Сброс пароля', html)

    }

    public async sendDeactivateToken( 
        email: string,
        token: string,
        metadata: SessionMetadata
    ){
        const html = await render(DeactevateTemplate({ token, metadata }))

        return this.sendMail(email, 'Деактивация аккаунта', html)

    }

    public async sendAccountDeletion(email: string){
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(AccauntDeletionTemplate({ domain }))

        return this.sendMail(email, 'Удаление аккаунта', html)
    }

    private sendMail(email: string, subject: string, html: string){
        return this.mailerService.sendMail({
            to: email,
            subject,
            html
        })
    }
}
