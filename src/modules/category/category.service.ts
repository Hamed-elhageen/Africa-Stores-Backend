import { populate } from 'dotenv';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { isValidObjectId, Types } from 'mongoose';
import { CategoryRepository } from 'src/db/repos/category.repository';
import { FileUploadService } from 'src/common/services/fileupload/fileupload.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PaginationDto } from './dto/pagnition.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _CategoryRepository: CategoryRepository,
    private readonly _FileUpload: FileUploadService,
    private readonly _ConfigService: ConfigService,
    private readonly _ProductService: ProductService,
  ) { }

  async create(data: CreateCategoryDto, userId: Types.ObjectId, file: Express.Multer.File) {
    const categoryExists = await this._CategoryRepository.findOne({
      filter: { name: data.name },
    });
    if (categoryExists) {
      throw new ConflictException("Category with this name already exists");
    }
    if (!file) {
      throw new BadRequestException("Category image is required");
    }
    const rootFolder = this._ConfigService.get<string>('CLOUD_ROOT_FOLDER')!;
    const cloudFolder = data.name.toLowerCase().replace(/\s+/g, '-') + '-' + uuid().split('-')[0];
    const results = await this._FileUpload.saveFileToCloud(
      [file],
      { folder: `${rootFolder}/categories/${cloudFolder}`, }
    );

    if (!results.length) {
      throw new InternalServerErrorException("Failed to upload category image");
    }
    const category = await this._CategoryRepository.create({
      name: data.name,
      cloudFolder,
      createdBy: userId,
      image: results[0],
    });

    return { data: category, message: "Category created successfully" };
  }

  async findAll(pagination: PaginationDto) {
    const categories = await this._CategoryRepository.findAll({
      sort: { createdAt: -1 }, populate: [
        { path: 'createdBy', select: '_id name email' },
        { path: 'productsCount' }
      ],

    },);
    if (!categories.data.length) {
      throw new NotFoundException('No categories found');
    }
    return { data: categories.data, pagination: categories.pagination, message: 'Categories fetched successfully', success: true };
  }

  async findOne(id: Types.ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this._CategoryRepository.findOne({ filter: { _id: id }, populate: [{ path: 'createdBy', select: '_id name email' }, { path: 'productsCount' }] });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return { data: category, message: 'Category fetched successfully', success: true };
  }

  async update(id: Types.ObjectId, data: UpdateCategoryDto, userId: Types.ObjectId, file: Express.Multer.File) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this._CategoryRepository.findOne({ filter: { _id: id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    category.updatedBy = userId;
    if (file) {
      const public_id = category.image?.public_id;
      const results = await this._FileUpload.saveFileToCloud(
        [file],
        { public_id }
      );
      category.image = results[0];
    }
    Object.assign(category, data);
    await category.save();
    return {
      data: category,
      message: 'Category updated successfully',
      success: true
    };
  }

  async remove(id: Types.ObjectId, userId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({ filter: { _id: id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this._ProductService.removeProductsByCategory(id);
    await category.deleteOne();
    return {
      data: {},
      success: true,
      message: 'Category deleted successfully',
    };
  }
  async removeAll() {
    const { deletedCount, deletedDocs } = await this._CategoryRepository.deleteMany({});
    if (deletedCount === 0) {
      throw new NotFoundException('No categories found');
    }
    const rootFolder = this._ConfigService.get<string>('CLOUD_ROOT_FOLDER')!;
    for (const doc of deletedDocs) {
      if (doc.cloudFolder) {
        await this._FileUpload.deleteFolder(`${rootFolder}/categories/${doc.cloudFolder}`);
      }
    }
    return {
      data: {},
      success: true,
      message: 'All categories deleted successfully',
    };
  }
}