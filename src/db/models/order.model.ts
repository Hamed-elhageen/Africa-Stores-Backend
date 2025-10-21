import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, HydrateOptions, ObjectId, Types } from "mongoose";
import { UserModelName } from "./user.model";
import type { Image } from "src/common/types/image.type";
import slugify from "slugify";
import { CategoryModelName } from "./category.model";
import { CartModelName } from "./cart.model";
export enum OrderStatus {
    placed = 'placed',
    shipped = 'shipped',
    onWay = 'onWay',
    delivered = 'delivered',
    cancelled = 'cancelled',
    refended = 'refended'
}
export enum PaymentMethod {
    card = 'card',
    cash = 'cash'
}
@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, type: Types.ObjectId, ref: UserModelName })
    user: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: CartModelName })
    cart: Types.ObjectId;

    @Prop({ required: true, type: String })
    phone: string;

    @Prop({ required: true, type: String })
    address: string

    @Prop({ required: true, type: String, enum: OrderStatus, default: OrderStatus.placed })
    orderStatus: OrderStatus

    @Prop({ required: true, type: Number })
    price: number

    @Prop({ required: true, type: String, enum: PaymentMethod, default: PaymentMethod.cash })
    paymentMethod: PaymentMethod

    @Prop({ required: false, type: { secure_url: String, public_id: String } })
    invoice: Image;

    @Prop({ type: Boolean, default: false })
    paid: boolean;

    @Prop({ type: String })
    payment_intent: string; // for stripe integration 

}
export const OrderSchema = SchemaFactory.createForClass(Order)

export const OrderModelName = Order.name;

export const OrderModel = MongooseModule.forFeature([{
    name: OrderModelName,
    schema: OrderSchema
}])


export type OrderDocument = HydratedDocument<Order>

