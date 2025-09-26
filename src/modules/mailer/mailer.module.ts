import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule], // so we can use .env variables
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    service: 'gmail',
                    auth: {
                        user: config.get<string>('MAIL_USER'),
                        pass: config.get<string>('MAIL_PASS'),
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                },
                defaults: {
                    from: `"Africa Store" <${config.get<string>('MAIL_USER')}>`,
                },
                template: {
                    dir: join(process.cwd(), '..', 'templates'), // put templates in src/templates
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    exports: [MailerModule],
})
export class CustomMailerModule { }
