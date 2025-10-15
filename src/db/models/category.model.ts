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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
export class Category {
    @Prop({
        required: true, type: String, unique: true, index: {
            name: 'category_name_index'
        }
    })
    name: string
    @Prop({ unique: true, type: String })
    slug: string      // it will be in the url of the category
    @Prop({ required: true, type: Types.ObjectId, ref: UserModelName })
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: UserModelName })
    updatedBy: Types.ObjectId
    @Prop(raw({ secure_url: String, public_id: String }))
    image: Image
    @Prop({ type: String })
    cloudFolder: string

}
export const CategorySchema = SchemaFactory.createForClass(Category)

CategorySchema.virtual('productsCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
})

export const CategoryModelName = Category.name;

// export const CategoryModel = MongooseModule.forFeature([{
//     name: CategoryModelName,
//     schema: CategorySchema
// }])
export const CategoryModel = MongooseModule.forFeatureAsync([{
    name: CategoryModelName,
    useFactory: (configService: ConfigService, fileUploadService: FileUploadService) => {
        CategorySchema.pre('save', function (next) {
            if (this.isModified("name")) {
                this.slug = slugify(this.name)
            }
            return next();
        })
        CategorySchema.post('deleteOne', { document: true, query: false }, async function (doc) {
            const categoryFolder = doc.cloudFolder;
            const rootFolder = configService.get<string>('CLOUD_ROOT_FOLDER')!;
            await fileUploadService.deleteFolder(`${rootFolder}/categories/${categoryFolder}`);
        })
        return CategorySchema;
    },
    inject: [ConfigService, FileUploadService],
    imports: [FileUploadModule]
}])

export type CategoryDocument = HydratedDocument<Category>

