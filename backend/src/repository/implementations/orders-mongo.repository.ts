import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrdersRepository } from '../interfaces/orders-repository.interface';
import { OrderDto, OrderItemDto } from 'src/orders/dto/order.dto';
import { Film, FilmDocument } from 'src/films/film.schema';
import { OrderResultDto } from 'src/orders/dto/order-result.dto';
import { CreateFilmDto } from 'src/films/dto/film.dto';
import { ScheduleItemDto } from 'src/films/dto/schedule.dto';

// normalize ticket data: mongoDB uses 'filmId' instead of 'film'
type IncomingTicket = OrderItemDto & { film: string };

@Injectable()
export class MongoOrdersRepository implements IOrdersRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async create(
    dto: OrderDto,
  ): Promise<{ items: OrderResultDto[]; total: number }> {
    const results: OrderResultDto[] = [];

    const normalizedTickets = (dto.tickets as IncomingTicket[]).map(
      (ticket) => ({
        ...ticket,
        filmId: ticket.film,
      }),
    );

    const normalizedDto = {
      ...dto,
      tickets: normalizedTickets,
    };

    for (const ticket of normalizedDto.tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const film = await this.findFilmById(ticket.filmId);
      const session = this.findSessionById(film, ticket.session);

      this.ensureSeatAvailable(session, place);

      session.taken.push(place);
      await film.save();

      results.push(this.buildOrderResult(ticket));
    }

    return {
      items: results,
      total: results.length,
    };
  }

  private async findFilmById(filmId: string) {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) throw new NotFoundException(`Film with id ${filmId} not found`);
    return film;
  }

  private findSessionById(film: CreateFilmDto, sessionId: string) {
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session)
      throw new NotFoundException(`Session with id ${sessionId} not found`);

    return session;
  }

  private ensureSeatAvailable(session: ScheduleItemDto, place: string) {
    if (session.taken.includes(place))
      throw new ConflictException(`Seat ${place} is already taken`);
  }

  private buildOrderResult(ticket: IncomingTicket): OrderResultDto {
    return {
      filmId: ticket.filmId,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
    };
  }
}
