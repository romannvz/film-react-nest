import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IOrdersRepository } from '../interfaces/orders-repository.interface';
import { OrderDto, OrderItemDto } from 'src/orders/dto/order.dto';
import { OrderResultDto } from 'src/orders/dto/order-result.dto';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import {
  FILMS_REPOSITORY_TOKEN,
  IFilmsRepository,
} from '../interfaces/films-repository.interface';

@Injectable()
export class PostgresOrdersRepository implements IOrdersRepository {
  constructor(
    @Inject(FILMS_REPOSITORY_TOKEN)
    private readonly filmsRepo: IFilmsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: OrderDto,
  ): Promise<{ items: OrderResultDto[]; total: number }> {
    const results: OrderResultDto[] = [];

    await this.dataSource.transaction(async (manager) => {
      for (const ticket of dto.tickets) {
        const place = `${ticket.row}:${ticket.seat}`;

        if (!(await this.filmsRepo.findById(ticket.filmId)))
          throw new NotFoundException(
            `Film with id ${ticket.filmId} not found`,
          );

        const session = await this.findSessionById(
          manager,
          ticket.session,
          ticket.filmId,
        );

        this.ensureSeatAvailable(session, place);

        session.taken = this.appendTaken(session.taken, place);
        await manager.save(session);

        results.push(this.buildOrderResult(ticket));
      }
    });

    return {
      items: results,
      total: results.length,
    };
  }

  private async findSessionById(
    manager: EntityManager,
    sessionId: string,
    filmId: string,
  ) {
    const session = await manager.findOne(ScheduleEntity, {
      where: { id: sessionId, filmId },
    });

    if (!session)
      throw new NotFoundException(
        `Session with id ${sessionId} not found for film ${filmId}`,
      );

    return session;
  }

  private ensureSeatAvailable(session: ScheduleEntity, place: string) {
    const taken = this.parseTaken(session.taken);
    if (taken.includes(place))
      throw new ConflictException(
        `Seat ${place} is already taken for session ${session.id}`,
      );
  }

  private buildOrderResult(ticket: OrderItemDto): OrderResultDto {
    return {
      filmId: ticket.filmId,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
    };
  }

  private parseTaken(value: string): string[] {
    return value ? value.split(',') : [];
  }

  private appendTaken(value: string, place: string): string {
    const taken = this.parseTaken(value);
    if (!taken.includes(place)) taken.push(place);

    return taken.join(',');
  }
}
