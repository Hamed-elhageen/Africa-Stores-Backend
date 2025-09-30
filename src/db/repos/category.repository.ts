import { CategoryModel, CategoryModelName } from './../models/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from "./abstract.repository"
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CategoryDocument } from '../models/category.model';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
    constructor(@InjectModel(CategoryModelName) category: Model<CategoryDocument>) {
        super(category)
    }
}