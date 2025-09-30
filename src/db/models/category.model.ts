import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, HydrateOptions, ObjectId, Types } from "mongoose";
import { UserModelName } from "./user.model";
import type { Image } from "src/common/types/image.type";
import slugify from "slugify";

@Schema({ timestamps: true })
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
    @Prop(raw({ secure_url: String, public_id: String }))
    image: Image
    @Prop({ type: String })
    cloudFolder: string

}
export const CategorySchema = SchemaFactory.createForClass(Category)
CategorySchema.pre('save', function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name)
    }
    return next();
})
export const CategoryModelName = Category.name;

export const CategoryModel = MongooseModule.forFeature([{
    name: CategoryModelName,
    schema: CategorySchema
}])

export type CategoryDocument = HydratedDocument<Category>

