import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/db/repos/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _CategoryRepository: CategoryRepository
  ) { }
  
  async create(data: CreateCategoryDto, userId: Types.ObjectId) {
    const category = await this._CategoryRepository.create({ ...data, createdBy: userId });
    return { data: category, message: "Category created successfully" };
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
