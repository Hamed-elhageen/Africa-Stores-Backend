import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/decorators/auth/roles.decorator';
import { Role } from 'src/db/enums/user.enum';
import { CurrentUser } from 'src/common/decorators/auth/currentUser.decorator';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public } from 'src/common/decorators/auth/public.decorator';
import { PaginationDto } from './dto/pagnition.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(@Body() data: CreateCategoryDto,
    @CurrentUser('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File) {
    return this.categoryService.create(data, userId, file);
  }

  @Get()
  @Public()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findAll(pagination);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: Types.ObjectId) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(@Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() data: UpdateCategoryDto,
    @CurrentUser('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File) {
    return this.categoryService.update(id, data, userId, file);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @CurrentUser('_id') userId: Types.ObjectId) {
    return this.categoryService.remove(id, userId);
  }
  @Delete('delete/all')
  @Roles(Role.admin)
  removeAll() {
    return this.categoryService.removeAll();
  }
}
