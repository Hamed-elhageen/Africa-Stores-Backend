import { InjectModel } from '@nestjs/mongoose';
import { OtpDocument, OtpModelName } from './../models/otp.model';
import { AbstractRepository } from "./abstract.repository"
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpRepository extends AbstractRepository<OtpDocument> {
    constructor(@InjectModel(OtpModelName) OTP: Model<OtpDocument>) {
        super(OTP)
    }
}