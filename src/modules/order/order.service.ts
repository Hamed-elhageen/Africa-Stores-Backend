import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/db/models/user.model';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { OrderRepository } from 'src/db/repos/order.repository';
import { PaymentMethod } from 'src/db/models/order.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly _cartService: CartService,
    private readonly _productService: ProductService,
    private readonly _orderRepository: OrderRepository
  ) {
  }
  async create(data: CreateOrderDto, user: UserDocument) {
    const useId = user._id;
    // user id 
    // check cart 
    const cart = await this._cartService.getCart(useId);
    if (!cart || !cart.data.products.length) {
      throw new NotFoundException('empty cart ');
    }
    // check products
    let totalPrice = 0;
    for (const product of cart.data.products) {
      const prod = await this._productService.checkProductExists(product.productId);
      if (!this._productService.instock(prod, product.quantity)) {
        throw new BadRequestException(`Product ${prod.name} is not in stock `);
      }
      totalPrice += prod.finalPrice * product.quantity;
    }

    // create order
    const order = await this._orderRepository.create({
      ...data,
      cart: cart.data._id,
      user: useId,
      price: totalPrice
    })
    if (order.paymentMethod == PaymentMethod.cash) {
      const products = cart.data.products;
      for (const item of products) {
        await this._productService.updateStock(item.productId, item.quantity, false);
      }
      return { data: order, message: 'Order created successfully and paid cash' };
    }
    // payment process  >> update stock  // socekt 

    return { data: order, message: 'Order created successfully' };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
