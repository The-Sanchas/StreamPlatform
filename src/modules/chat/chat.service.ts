import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';

@Injectable()
export class ChatService {
    public constructor(private readonly prismaService: PrismaService){}


    public async create(streamId: string){
        return await this.prismaService.chatSettings.create({
            data: {
                streamId: streamId
            }
        })
    }

    public async findMessageByStream(streamId: string){

        const messages = await this.prismaService.chatMessage.findMany({
            where: {
                streamid: streamId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        })
        return messages
    }

    public async sendMessage(userId: string, streamId: string, input: SendMessageInput){
        const { text } = input

        const stream = await this.prismaService.stream.findUnique({
            where: {
                id: streamId
            }
        })

        if(!stream){
            throw new NotFoundException("стрим не найден")
        }

        if(!stream.isLive){
            throw new BadRequestException("Стрим сейчас не онлайн")
        }

        await this.prismaService.chatMessage.create({
            data: {
                text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                stream: {
                    connect: {
                        id: streamId
                    }
                }
            }
        })
        return true
    }

    public async changeChatSettings(user: User, input: ChangeChatSettingsInput){
        const { isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly } = input

        const stream = await this.prismaService.stream.findFirst({
            where: {
                userId: user.id,
                isLive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })


        await this.prismaService.chatSettings.update({
            where: {
                streamId: stream.id
            },
            data: {
                isChatEnabled,
                isChatFollowersOnly,
                isChatPremiumFollowersOnly
            }
        })

        return true
    }


}
