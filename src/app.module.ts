import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI')
    })
  }), MailerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      transport: {
        host: configService.get<string>('MAIL_HOST'),
        port:465,
        secure:true,
        auth: {
          user: configService.get<string>('MAIL_USER'),
          pass: configService.get<string>('MAIL_PASS')
        },
        tls:{
          rejectUnauthorized:false
        }
      }
    })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

