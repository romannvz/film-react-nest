import { Injectable, Inject } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import {
  ORDERS_REPOSITORY_TOKEN,
  IOrdersRepository,
} from '../repository/interfaces/orders-repository.interface';
import { OrderResultDto } from './dto/order-result.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDERS_REPOSITORY_TOKEN)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async orderTickets(
    OrderDto: OrderDto,
  ): Promise<{ items: OrderResultDto[]; total: number }> {
    return this.ordersRepository.create(OrderDto);
  }
}
