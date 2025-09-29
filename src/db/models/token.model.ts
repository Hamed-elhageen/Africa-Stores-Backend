import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UserModelName } from './user.model';
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { TokenType } from '../enums/token.enum';

// schema class 
@Schema({ timestamps: true })
export class Token {
    @Prop({ required: true, type: String })
    token: string

    @Prop({ required: true, type: Types.ObjectId, ref: UserModelName })
    user: Types.ObjectId

    @Prop({ enum: TokenType, required: true, default: TokenType.access })
    type: TokenType

    @Prop({ type: Date })
    expiredAt: Date

    @Prop({ type: Boolean, default: true })
    isValid: boolean




}

const tokenSchema = SchemaFactory.createForClass(Token)
tokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 })
tokenSchema.pre('save', function (next) {
    if (this.isNew) {
        const configService = new ConfigService();
        let secretToken = "";
        switch (this.type) {
            case TokenType.access:
                secretToken = configService.get<string>('TOKEN_SECRET')!;
                break;
            case TokenType.refresh:
                secretToken = configService.get<string>('REFRESH_TOKEN_SECRET')!;
                break;
        }

        try {
            const payload: any = jwt.verify(this.token, secretToken);
            this.expiredAt = new Date(payload.exp * 1000);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
    next();
});


export const tokenModelName = Token.name



// model 
export const tokenModel = MongooseModule.forFeature([{
    name: tokenModelName,
    schema: tokenSchema
}])


// tokendoucment   (type)
export type tokenDocument = HydratedDocument<Token>