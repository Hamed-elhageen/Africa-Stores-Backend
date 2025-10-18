import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/db/repos/cart.repository';
import { CartModel } from 'src/db/models/cart.model';
import { ProductRepository } from 'src/db/repos/product.repository';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  imports: [CartModel, ProductModule],
  exports: [CartService, CartRepository]
})
export class CartModule { }
