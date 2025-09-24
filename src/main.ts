import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( new ValidationPipe({whitelist: true ,forbidNonWhitelisted: true}) )
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT', 3000)
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}
bootstrap();
