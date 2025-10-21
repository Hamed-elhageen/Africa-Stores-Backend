import { OrderModelName } from './../models/order.model';
import { OrderDocument } from "../models/order.model";
import { AbstractRepository } from "./abstract.repository";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class OrderRepository extends AbstractRepository<OrderDocument> {
    constructor(@InjectModel(OrderModelName) order: Model<OrderDocument>) {
        super(order)
    }
}