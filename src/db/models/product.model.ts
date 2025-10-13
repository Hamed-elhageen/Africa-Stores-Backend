import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, HydrateOptions, ObjectId, Types } from "mongoose";
import { UserModelName } from "./user.model";
import type { Image } from "src/common/types/image.type";
import slugify from "slugify";
import { FileUploadService } from "src/common/services/fileupload/fileupload.service";
import { ConfigService } from "@nestjs/config";
import { FileUploadModule } from "src/common/services/fileupload/fileupload.module";
import { CategoryModelName } from "./category.model";

@Schema({ timestamps: true })
export class Product {
    @Prop({
        required: true, type: String, unique: true, index: {
            name: 'product_name_index'
        },
        set: function (value: string) {
            this.slug = slugify(value);
            return value;
        }
    })
    name: string
    @Prop({ unique: true, type: String })
    slug: string      // it will be in the url of the product

    @Prop({ required: true, type: Types.ObjectId, ref: UserModelName })
    createdBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: UserModelName })
    updatedBy: Types.ObjectId

    @Prop(raw({ secure_url: String, public_id: String }))
    thumbnail: Image

    @Prop({ type: [raw({ secure_url: String, public_id: String })] })
    images: Image[]

    @Prop({ required: true, type: Types.ObjectId, ref: CategoryModelName })
    category: Types.ObjectId

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String })
    cloudFolder: string

    @Prop({ required: true, type: Number, min: 1 })
    stock: number

    @Prop({ required: true, type: Number })
    price: number

    @Prop({
        type: Number,
        min: 0,
        max: 100,
        set: function (value: number) {
            const discount = typeof value === 'number' ? value : 0;
            const price = typeof this.price === 'number' ? this.price : 0;
            this.finalPrice = price - (price * discount) / 100;
            return discount;
        },
    })
    discount: number;
    @Prop({
        type: Number, default: function () {
            return Number(this.price);
        }
    })
    finalPrice: number

    @Prop({ type: String, default: "Real Madrid" })
    club: string

    @Prop({ type: Number, min: 0, max: 5 })
    rating: number

}
export const productSchema = SchemaFactory.createForClass(Product)

export const productModelName = Product.name;

// export const productModel = MongooseModule.forFeature([{
//     name: productModelName,
//     schema: productSchema
// }])
export const productModel = MongooseModule.forFeatureAsync([{
    name: productModelName,
    useFactory: (configService: ConfigService, fileUploadService: FileUploadService) => {
        productSchema.pre('save', function (next) {
            if (this.isModified("name")) {
                this.slug = slugify(this.name)
            }
            return next();
        })
        productSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
          await fileUploadService.deleteFolder(doc.cloudFolder);
        })
        return productSchema;
    },
    inject: [ConfigService, FileUploadService],
    imports: [FileUploadModule]
}]) 

export type productDocument = HydratedDocument<Product>

