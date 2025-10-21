import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { OrderRepository } from 'src/db/repos/order.repository';
import { OrderModel } from 'src/db/models/order.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  imports: [CartModule, ProductModule, OrderModel],
})
export class OrderModule { }
