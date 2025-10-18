import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChannelService {

    public constructor(private readonly prismaService: PrismaService){}

    public async findRecomendedChannels(){
        const channels = await this.prismaService.user.findMany({
            where: {
                isDeactivated: false
            },
            orderBy: {
                followings: {
                    _count: 'desc'
                }
            },
            include: {
                stream: true
            },
            take: 7
        })

        return channels
    }

    public async findByUsername(username: string){
        const channel = await this.prismaService.user.findUnique({
            where: {
                username,
                isDeactivated: false
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                stream: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        category: true
                    }
                },
                followings: true
            }
        })

        if(!channel){
            throw new NotFoundException('Канал не найден')
        }

        return channel
    }

    public async findFollowersCountByChannel(channelId: string){
        const followers = await this.prismaService.follow.count({
            where: {
                following: {
                    id: channelId
                }
            }
        })

        return followers
    }
}
