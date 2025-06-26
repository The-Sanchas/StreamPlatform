import { use } from 'react';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
// import * as Upload from 'graphql-upload/Upload.js'
import { FileUpload } from 'graphql-upload'; // 
import * as sharp from 'sharp'
import { StorageService } from '../../libs/storage/storage.service';
import { User } from '@/prisma/generated';
import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { SocialLinksInput, SocialLinksOrderInput } from './inputs/social-links.input';

@Injectable()
export class ProfileService {

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly storageService: StorageService
    ){}

    public async changeAvatar(user: User, file: FileUpload){

        if(user.avatar){
            await this.storageService.remove(user.avatar)
        }

        const chunks: Buffer[] = []

        for await(const chunk of file.createReadStream()){
            chunks.push(chunk)
        }

        const buffer = Buffer.concat(chunks)

        const fileName = `/channels/${user.username}.webp`

        if(file.filename && file.filename.endsWith('.gif')){

            const processedBuffer = await sharp(buffer, {animated: true })
            .resize(512, 512)
            .webp()
            .toBuffer()

            await this.storageService.upload(
                processedBuffer, 
                fileName, 
                'image/webp'
            )
        } else {
            
            const processedBuffer = await sharp(buffer)
            .resize(512, 512)
            .webp()
            .toBuffer()

            await this.storageService.upload(
                processedBuffer, 
                fileName, 
                'image/webp'
            )
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                avatar: fileName
            }
        })

        return true
    }


    public async removeAvatar(user: User){

        if(!user.avatar){
            return
        }

        await this.storageService.remove(user.avatar)

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                avatar: null
            }
        })

        return true
    }

    public async changeInfo(user: User, input: ChangeProfileInfoInput){
        const { dispayName, bio, username } = input

        const usernameExists = this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if(usernameExists && username == user.username){
            throw new ConflictException('Это имя пользователя уже занято')
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                username,
                dispayName,
                bio
            }
        })
        return true
    }

    public async findSocialLink(user: User){
        return await this.prismaService.socialLink.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                position: 'asc'
            }
        })
    }

    public async createSocialLink(user: User, input: SocialLinksInput){

        const { title, url } = input

        const lastSocialLink = await this.prismaService.socialLink.findFirst({
            where: {
                userId: user.id
            },
            orderBy: {
                position: 'desc'
            }
        })

        const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1

        await this.prismaService.socialLink.create({
            data: {
                title,
                url,
                position: newPosition,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        return true
    }

    public async reorderSocialLinks(list: SocialLinksOrderInput[]){
        if(!list.length){
            return
        }

        const updatePromisess = list.map(socialLink => {
            return this.prismaService.socialLink.update({
                where:{
                    id: socialLink.id
                },
                data: {
                    position: socialLink.position
                }
            })
        })

        await Promise.all(updatePromisess)

        return true
    }

    public async updateSocialLink(id: string, input: SocialLinksInput){

        const { title, url } = input

        await this.prismaService.socialLink.update({
            where: {
                id
            },
            data: {
                title,
                url,
                }
            })

        return true
    }

    public async removeSicialLink(id: string){
        await this.prismaService.socialLink.delete({
            where: {
                id
            }
        })
        return true
    }
}
