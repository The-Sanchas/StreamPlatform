import { 
    type ArgumentMetadata, 
    Injectable, 
    type PipeTransform, 
    BadRequestException 
} from "@nestjs/common";
import { ReadStream } from "fs";
import { validateFileFormat, validateFileSize } from "../utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform{
    public async transform(value: any, metadata: ArgumentMetadata){
        if(!value.filename){
            throw new BadRequestException('Файл не загружен')
        }

        const { filename, constReadStream } = value

        const fileStream = constReadStream() as ReadStream

        const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        const isFileFormatValid = validateFileFormat(filename, allowedFormats)

        if(!isFileFormatValid){
            throw new BadRequestException('Не поддерживаемый формат файла')
        }

        const isFileValidSize = await validateFileSize(fileStream, 10 * 1024 * 1024)

        if(!isFileValidSize){
            throw new BadRequestException('Размер файла превышает 10 МБ')
        }

        return value
    }

}