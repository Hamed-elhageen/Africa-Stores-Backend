import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { FileUploadService } from "./fileupload.service";

@Module({
    providers: [FileUploadService, CloudinaryProvider],
    exports: [FileUploadService, CloudinaryProvider]
})

export class FileUploadModule { }