import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/auth/roles.decorator';
import { Role } from 'src/db/enums/user.enum';
import { CurrentUser } from 'src/common/decorators/auth/currentUser.decorator';
import { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('image', 1, { storage: diskStorage({}) }))
  create(@Body() data: CreateCategoryDto, @CurrentUser('_id') userId: Types.ObjectId) {
    // console.log({ data });
    return this.categoryService.create(data, userId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
