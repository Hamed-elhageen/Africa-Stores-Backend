import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from "./abstract.repository"
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CartDocument, CartModelName } from '../models/cart.model';

@Injectable()
export class CartRepository extends AbstractRepository<CartDocument> {
    constructor(@InjectModel(CartModelName) cart: Model<CartDocument>) {
        super(cart)
    }
}