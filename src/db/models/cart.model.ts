import { MongooseModule, Prop, raw, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, HydrateOptions, ObjectId, Types } from "mongoose";
import { UserModelName } from "./user.model";
import type { Image } from "src/common/types/image.type";
import slugify from "slugify";
import { FileUploadService } from "src/common/services/fileupload/fileupload.service";
import { ConfigService } from "@nestjs/config";
import { FileUploadModule } from "src/common/services/fileupload/fileupload.module";
import { productModelName } from "./product.model";

@Schema({
    timestamps: true,

})
export class Cart {
    @Prop({ required: true, type: Types.ObjectId, ref: UserModelName })
    user: Types.ObjectId
    @Prop([{ productId: { type: Types.ObjectId, ref: productModelName, required: true }, quantity: { type: Number, default: 1 }, price: { type: Number } }])
    products: {
        productId: Types.ObjectId,
        quantity: number,
        price: number
    }[];

}
export const CartSchema = SchemaFactory.createForClass(Cart)

// CartSchema.virtual('productsCount', {
//     ref: 'Product',
//     localField: '_id',
//     foreignField: 'Cart',
//     count: true
// })

export const CartModelName = Cart.name;

export const CartModel = MongooseModule.forFeature([{
    name: CartModelName,
    schema: CartSchema
}])
// export const CartModel = MongooseModule.forFeatureAsync([{
//     name: CartModelName,
//     useFactory: (configService: ConfigService, fileUploadService: FileUploadService) => {
//         // CartSchema.pre('save', function (next) {
//         //     if (this.isModified("name")) {
//         //         this.slug = slugify(this.name)
//         //     }
//         //     return next();
//         // })
//         // CartSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
//         //     const CartFolder = doc.cloudFolder;
//         //     const rootFolder = configService.get<string>('CLOUD_ROOT_FOLDER')!;
//         //     await fileUploadService.deleteFolder(`${rootFolder}/categories/${CartFolder}`);
//         // })
//         // return CartSchema;
//     },
//     injrect: [ConfigService, FileUploadService],
//     impots: [FileUploadModule]
// }])

export type CartDocument = HydratedDocument<Cart>

