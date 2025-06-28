import { CreateStreamInput } from './inputs/create-stream.input';
import { randomBytes } from 'crypto';
import type { Prisma, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FiltersInput } from './inputs/filters.input';
import { FileUpload } from 'graphql-upload'; // 
import * as sharp from 'sharp'
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { StorageService } from '../libs/storage/storage.service';
import { ChangeStreamTumbnailInput } from './inputs/change-stream-tumbnail.input';

@Injectable()
export class StreamService {

    public constructor(private readonly prismaService: PrismaService, private readonly storageService: StorageService){}

    public async findAll(input: FiltersInput = {}){

        const { take, skip, searchTerm } = input

        const whereClouse = searchTerm ? this.findBySerchTermFilter(searchTerm) : undefined

        const streams = await this.prismaService.stream.findMany({
            take: take ?? 12,
            skip: skip ?? 0,
            where: {
                user: {
                    isDeactivated: false
                }, 
                ...whereClouse
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return streams
    }

   public async findRandom(){

        const total = await this.prismaService.stream.count({
            where: {
                user: {
                    isDeactivated: false
                }
            }
        })

        const randomIndexes = new Set<number>()

        while(randomIndexes.size < 4) {
            const randomIndex = Math.floor(Math.random() * total)

            randomIndexes.add(randomIndex)
        }

        const streams = await this.prismaService.stream.findMany({
            where: {
                user: {
                    isDeactivated: false
                }
            },
            include: {
                user: true
            },
            take: total,
            skip: 0
        })

        return Array.from(randomIndexes).map(index => streams[index])

   } 

   public async changeInfo(user: User, input: ChangeStreamInfoInput, ){
        const { title, categoryId, id } = input

        await this.prismaService.stream.update({
            where: {
                id: id
            }, 
            data: {
                title: title
            }
        })

        return true 
   }

   public async changeTombnail(user: User, file: FileUpload, input: ChangeStreamTumbnailInput){


    const stream = await this.findById(user, input)
    const { id } = input


    if(stream.thumbnailUrl){
        await this.storageService.remove(stream.thumbnailUrl)
    }

    const chunks: Buffer[] = []

    for await(const chunk of file.createReadStream()){
        chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const fileName = `/streams/${user.username}.webp`

    if(file.filename && file.filename.endsWith('.gif')){

        const processedBuffer = await sharp(buffer, {animated: true })
        .resize(1280, 720)
        .webp()
        .toBuffer()

        await this.storageService.upload(
            processedBuffer, 
            fileName, 
            'image/webp'
        )
    } else {
        
        const processedBuffer = await sharp(buffer)
        .resize(1280, 720)
        .webp()
        .toBuffer()

        await this.storageService.upload(
            processedBuffer, 
            fileName, 
            'image/webp'
        )
    }

    await this.prismaService.stream.update({
        where: {
            id: id
        },
        data: {
            thumbnailUrl: fileName
        }
    })

    return true
}


    public async removeThumbnail(user: User, input: ChangeStreamTumbnailInput){

        const { id } = input

        const stream = await this.findById(user, input)

        if(!stream.thumbnailUrl){
            return
        }

        await this.storageService.remove(stream.thumbnailUrl)

        await this.prismaService.stream.update({
            where: {
                id: id
            },
            data: {
                thumbnailUrl: null
            }
        })

        return true
    }

    public async createStream(user: User, input: CreateStreamInput){

        const { title } = input

        return await this.prismaService.stream.create({
            data: {
                title: title,
                userId: user.id
            }
        })
    }

    private async findById(user: User, input: ChangeStreamTumbnailInput){

        const { id } = input

        const stream = await this.prismaService.stream.findUnique({
            where: {
                id: id,
                userId: user.id
            }
        })

        return stream
    }

    private findBySerchTermFilter(searchTerm: string):Prisma.StreamWhereInput {
        return {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    },
                    user: {
                        username: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        }
    }
}
