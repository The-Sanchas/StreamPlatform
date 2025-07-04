import { 
    DeleteObjectCommand,
    type DeleteObjectCommandInput,
    PutObjectCommand, 
    type PutObjectCommandInput, 
    S3Client
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {

    private readonly client: S3Client
    private readonly backet: string

    public constructor(public readonly configservice: ConfigService ){
        this.client = new S3Client({
            region: this.configservice.getOrThrow<string>('HETZNER_REGION'),
            endpoint: this.configservice.getOrThrow<string>('HETZNER_S3_URL'),
            credentials: {
              accessKeyId: this.configservice.getOrThrow<string>('HETZNER_S3_ACCES_KEY'),
              secretAccessKey: this.configservice.getOrThrow<string>('HETZNER_S3_SECRET_KEY'),
            },
            forcePathStyle: true // 👈 ОБЯЗАТЕЛЬНО для Hetzner!
          })
          
          this.backet = this.configservice.getOrThrow<string>('HETZNER_BUCKET_NAME')
        }
    public async upload(buffer: Buffer, key: string, mimetype: string){
        const command: PutObjectCommandInput = {
            Bucket: this.backet,
            Key: String(key),
            Body: buffer,
            ContentType: mimetype,
            ACL: 'public-read'
        }

        try {

            await this.client.send(new PutObjectCommand(command))

        } catch(error){
            throw error
        }
    }

    public async remove(key: string){

        const command: DeleteObjectCommandInput = {
            Bucket: this.backet,
            Key: String(key)
        }

        try {

            await this.client.send(new DeleteObjectCommand(command))

        } catch(error){
            throw error
        }
    }

}
