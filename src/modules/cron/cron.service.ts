import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MailService } from '../libs/mail/mail.service';
import { Cron } from '@nestjs/schedule';
import { StorageService } from '../libs/storage/storage.service';

@Injectable()
export class CronService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailservice: MailService,
        private readonly storageService: StorageService
    ){}

    // @Cron('*/10 * * * * *')
    @Cron('0 0 * * *')
    public async deleteDeactivareAccounts(){
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const deactivateAccount = await this.prismaService.user.findMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })

        for(const user of deactivateAccount){
            await this.mailservice.sendAccountDeletion(user.email)

            await this.storageService.remove(user.avatar)
        }

        console.log('Deactivate Account: ', deactivateAccount)

        await this.prismaService.user.deleteMany({
            where: {
                isDeactivated: true,
                deactivatedAt: {
                    lte: sevenDaysAgo
                }
            }
        })
    }
}
