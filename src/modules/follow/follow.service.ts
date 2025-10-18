import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FollowService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findMyFollowers(user: User){

        const followers = this.prismaService.follow.findMany({
            where: {
                followingId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                follower: true
            }
        })

        return followers
    }

    public async findMyFollowings(user: User){

        const following = this.prismaService.follow.findMany({
            where: {
                followerId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                following: true
            }
        })

        return following
    }

    public async follow(user: User, channelId: string){
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if(!channel){
            throw new NotFoundException('Канал не найден')
        }

        if(channel.id === user.id){
            throw new ConflictException('Нельза подписаться на самого себя')
        }

        const existingFollow = await this.prismaService.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if(existingFollow){
            throw new ConflictException('Вы уже подписанны на этот канал')
        }

        await this.prismaService.follow.create({
            data: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        return true
    }

    public async unfollow(user: User, channelId: string){
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if(!channel){
            throw new NotFoundException('Канал не найден')
        }

        if(channel.id === user.id){
            throw new ConflictException('Нельза отписаться от самого себя')
        }

        const existingFollow = await this.prismaService.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: channel.id
            }
        })

        if(!existingFollow){
            throw new ConflictException('Вы не подписанны на этот канал')
        }

        await this.prismaService.follow.delete({
            where: {
                id: existingFollow.id,
                followerId: user.id,
                followingId: channel.id
            }
        })

        return true
    }
}
