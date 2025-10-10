import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../db/models/user.model'; // adjust path
import { NestApplication, NestApplicationContext } from '@nestjs/core';
import { generateFakeFromSchema } from './generators/faker-generator';
import { INestApplicationContext } from '@nestjs/common';

export async function seedUsers(app: INestApplicationContext) {
  // Get the Mongoose model from Nest context
  const userModel = app.get<Model<User>>(getModelToken(User.name));

  const schemaObj = (userModel as any).schema.obj;

  const fakeUsers = Array.from({ length: 10 }).map(() =>
    generateFakeFromSchema(schemaObj)
  );

  await userModel.insertMany(fakeUsers);
  console.log('✅ Users seeded');
}
