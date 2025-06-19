import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/film.schema';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async orderTickets(dto: OrderDto) {
    for (const ticket of dto.tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const film = await this.filmModel.findOne({ id: ticket.film });
      if (!film) {
        throw new NotFoundException(`Фильм с id ${ticket.film} не найден`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(
          `Сеанс с id ${ticket.session} не найден у фильма ${ticket.film}`,
        );
      }

      if (session.taken.includes(place)) {
        throw new ConflictException(
          `Место ${place} уже занято на сеансе ${ticket.session}`,
        );
      }

      session.taken.push(place);

      await film.save();
    }

    return {
      items: dto.tickets,
      total: dto.tickets.length,
    };
  }
}
