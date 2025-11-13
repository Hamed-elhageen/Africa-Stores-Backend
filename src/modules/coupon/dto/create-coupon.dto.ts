import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsBoolean, Matches } from 'class-validator';
import { DiscountType } from 'src/db/models/coupon.model';

export class CreateCouponDto {
    @IsString()
    code: string;

    @IsEnum(DiscountType)
    type: DiscountType;

    @IsNumber()
    value: number;

    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'expiryDate must be in format YYYY-MM-DD',
    })
    expiryDate: string;

    @IsOptional()
    @IsNumber()
    maxUsage?: number;

    @IsOptional()
    @IsString()
    description?: string;
}
