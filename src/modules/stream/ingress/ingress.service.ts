import type { Stream, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateIngressOptions, IngressAudioEncodingPreset, IngressInput, IngressVideoEncodingPreset } from 'livekit-server-sdk';
import { LivekitService } from '../../libs/livekit/livekit.service';

@Injectable()
export class IngressService {

    public constructor(
        private readonly prismaService: PrismaService, 
        private readonly livekitService: LivekitService
    ){}

    public async create(user: User, stream: Stream, ingressType: IngressInput){

        await this.resetIngress(user, stream)

        const options: CreateIngressOptions = {
            name: user.username,
            roomName: user.id,
            participantName: user.username,
            participantIdentity: user.id
        }

        if(ingressType === IngressInput.WHIP_INPUT){
            options.bypassTranscoding = true
        } else {
            options.video = {
                source: 1,
                preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS
            }
            options.audio = {
                source: 2,
                preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS
            }
        }

        const ingress = await this.livekitService.ingress.createIngress(ingressType, options)

        if(!ingress || !ingress.url || !ingress.streamKey){
            throw new BadRequestException('Не удалось создать входной поток')
        }

        await this.prismaService.stream.update({
            where: {
                userId: user.id,
                id: stream.id
            },
            data: {
                ingressId: ingress.ingressId,
                serverUrl: ingress.url,
                steamKey: ingress.streamKey
            }
        })

        return true
        
    }

    private async resetIngress(user: User, stream: Stream){
        const ingresses = await this.livekitService.ingress.listIngress({
            roomName: user.id
        })

        const rooms = await this.livekitService.room.listRooms([user.id])

        for(const room of rooms){
            await this.livekitService.room.deleteRoom(room.name)
        }

        for(const ingress of ingresses){
            if(ingress.ingressId){
                await this.livekitService.ingress.deleteIngress(ingress.ingressId)
            }
        }
    }
}
