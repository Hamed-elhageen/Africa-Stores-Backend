import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { seedUsers } from './seed-users';
// import { seedCategories } from './seed-categories';
// import { seedProducts } from './seed-products';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🌱 Starting database seeding...');
  await seedUsers(app);
//   await seedCategories(app);
//   await seedProducts(app);

  await app.close();
  console.log('✅ Seeding completed');
}

bootstrap().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
