import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FilmEntity } from '../../films/entities/film.entity';
import { IFilmsRepository } from '../interfaces/films-repository.interface';
import { CreateFilmDto } from '../../films/dto/film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';

@Injectable()
export class PostgresFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepo: Repository<FilmEntity>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmRepo.find({ relations: ['schedule'] });
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return await this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }

  async create(dto: CreateFilmDto): Promise<FilmEntity> {
    return await this.filmRepo.manager.transaction(async (manager) => {
      const film = manager.create(FilmEntity, {
        ...dto,
        schedule: [],
      });

      const savedFilm = await manager.save(film);

      if (dto.schedule?.length) {
        const scheduleEntities = dto.schedule.map((item) =>
          manager.create(ScheduleEntity, {
            ...item,
            filmId: savedFilm.id,
            taken: '',
          }),
        );

        await manager.save(scheduleEntities);
      }
      return savedFilm;
    });
  }
}
