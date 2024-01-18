import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private ordersRepository: Repository<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const result = this.ordersRepository.create({
      ...createOrderDto,
    });

    return await this.ordersRepository.save(result);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find();
  }

  async findOneOrderOrFail(id: string): Promise<Order | null> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOneOrderOrFail(id);
    Object.assign(order, updateOrderDto);

    return await this.ordersRepository.save(order);
  }

  async deleteOrder(id: string) {
    const order = await this.findOneOrderOrFail(id);
    this.ordersRepository.remove(order);
  }
}