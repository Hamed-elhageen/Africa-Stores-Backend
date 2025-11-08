// mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private brevoClient: TransactionalEmailsApi;

  constructor() {
    this.brevoClient = new TransactionalEmailsApi();
    // Set your API key from environment variable
    this.brevoClient.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY || '',
    );

    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY environment variable is missing');
    }
    if (!process.env.MAIL_FROM) {
      throw new Error('MAIL_FROM environment variable is missing');
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    if (!to) throw new Error('Recipient email is required');

    const message: SendSmtpEmail = {
      sender: { name: 'Africa Store', email: process.env.MAIL_FROM }, // verified sender
      to: [{ email: to }], // recipients
      subject,
      htmlContent: html,
    };

    try {
      const result = await this.brevoClient.sendTransacEmail(message);
      console.log('✅ Email sent successfully:', result.body);
      return {
        success: true,
        message: 'Email sent successfully',
        data: result.body,
      };
    } catch (error: any) {
      console.error('❌ Email sending failed:', error.response?.body || error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to send email',
        details: error.response?.body || error,
      });
    }
  }
}
