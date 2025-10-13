import { productModel, productModelName } from './../models/product.model';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from "./abstract.repository"
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { productDocument } from '../models/product.model';

@Injectable()
export class ProductRepository extends AbstractRepository<productDocument> {
    constructor(@InjectModel(productModelName) product: Model<productDocument>) {
        super(product)
    }
}