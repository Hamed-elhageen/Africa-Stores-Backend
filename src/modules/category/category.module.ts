import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel } from 'src/db/models/category.model';
import { CategoryRepository } from 'src/db/repos/category.repository';

@Module({
  imports: [CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule { }
