import { CloudinaryProvider } from './cloudinary.provider';
import { Inject } from "@nestjs/common";
import { CLOUDINARY } from "src/common/constants/constants";
import { v2 as Cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Image } from 'src/common/types/image.type';

export class FileUploadService {
    constructor(@Inject(CLOUDINARY) private cloudinary: typeof Cloudinary) { }

    // upload to cloudnairy 
    async uploadCloud(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error)
                return resolve(result!)
            }).end(buffer)
        })
    }

    async saveFileToCloud(file: Express.Multer.File[], options: UploadApiOptions) {
        let savesFiles: Image[] = []
        for (const f of file) {
            let buffer = f.buffer;
            const { secure_url, public_id } = await this.uploadCloud(buffer, options);
            savesFiles.push({ secure_url, public_id });
        }
        return savesFiles;
    }

    async deleteFiles(publicIds: string[]) {
        await this.cloudinary.api.delete_resources(publicIds);
    }

    async deleteFolder(folderPath: string ) {
        await this.cloudinary.api.delete_resources_by_prefix(folderPath);
        const subFolders = await this.cloudinary.api.sub_folders(folderPath);
        if (subFolders.folders.length)
            for (const sub of subFolders.folders) {
                await this.deleteFolder(sub.path);
            }
        await this.cloudinary.api.delete_folder(folderPath);
    }
} 