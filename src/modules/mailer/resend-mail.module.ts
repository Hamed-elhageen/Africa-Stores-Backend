// src/modules/mailer/resend-mail.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResendMailService } from './resend-mail.service';

@Module({
    imports: [ConfigModule],
    providers: [ResendMailService],
    exports: [ResendMailService],
})
export class ResendMailModule { }
