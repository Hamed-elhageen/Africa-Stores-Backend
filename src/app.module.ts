import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomMailerModule } from './modules/mailer/mailer.module';
import { CategoryModule } from './modules/category/category.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ProductModule } from './modules/product/product.module';
import { ResendMailModule } from './modules/mailer/resend-mail.module';


@Module({
  imports: [UserModule, AuthModule , ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      })
    }), CustomMailerModule, CategoryModule, ProductModule , ResendMailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

