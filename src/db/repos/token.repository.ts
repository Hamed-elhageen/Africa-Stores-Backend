import { Injectable } from "@nestjs/common";
import { tokenDocument, tokenModelName } from "../models/token.model";
import { AbstractRepository } from "./abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TokenRepository extends AbstractRepository<tokenDocument> {
    constructor(@InjectModel(tokenModelName) Token: Model<tokenDocument>) {
        super(Token)
    }
}