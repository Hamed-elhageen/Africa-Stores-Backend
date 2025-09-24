import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Role } from "../enums/user.enum"
import { HydratedDocument } from "mongoose"
import { hash } from "src/common/security/hash.util"

// schema class 
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, type: String })
    name: string

    @Prop({ required: true, unique: true, type: String, lowercase: true })
    email: string

    @Prop({ required: true, type: String })
    password: string

    @Prop({ type: Boolean, default: false })
    accoutAcctivated: boolean

    @Prop({ required: true, enum: Role, default: Role.user })
    role: Role
}

const userSchema = SchemaFactory.createForClass(User)

userSchema.pre('save', function (next) {
    if (this.isModified("password")) {
        this.password = hash(this.password)
    }
    return next();
}
)
export const UserModelName = User.name



// model 
export const UserModel = MongooseModule.forFeature([{
    name: UserModelName,
    schema: userSchema
}])


// userdoucment   (type)
export type UserDocument = HydratedDocument<User>