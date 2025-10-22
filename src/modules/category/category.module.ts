import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel } from 'src/db/models/category.model';
import { CategoryRepository } from 'src/db/repos/category.repository';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { CloudinaryProvider } from 'src/common/services/fileupload/cloudinary.provider';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [CategoryModel, forwardRef(() => ProductModule)],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, FileUploadService, ConfigService, CloudinaryProvider],
  exports: [CategoryService, CategoryRepository]
})
export class CategoryModule { }
