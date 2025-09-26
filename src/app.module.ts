import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomMailerModule } from './modules/mailer/mailer.module';


@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI')
    })
  }), CustomMailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

