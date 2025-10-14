// src/modules/mailer/resend-mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendMailService {
    private resend: Resend;
    private from: string;

    constructor(private readonly configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
        this.from = this.configService.get<string>('RESEND_FROM')!;
        // console.log(this.from , this.resend)
    }

    async sendOtpEmail(email: string, otp: string) {
        try {
           const results =  await this.resend.emails.send({
                from: this.from,
                to: email,
                subject: 'Account Activation - Africa Store',
                html: `<p>Your OTP code is <b>${otp}</b></p>`,
            });
            console.log(results);
            return true;
        } catch (error) {
            console.error('Resend email error:', error);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }
    async sendEmail(email: string, otp: string) {
        try {
            await this.resend.emails.send({
                from: this.from,
                to: email,
                subject: 'Account Activation - Africa Store',
                html: `<p>Your OTP code is <b>${otp}</b></p>`,
            });

            return true;
        } catch (error) {
            console.error('Resend email error:', error);
            throw new InternalServerErrorException('Failed to send verification email');
        }
    }
}
