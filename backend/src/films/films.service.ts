import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateFilmDto } from './dto/film.dto';
import { Film } from './film.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<Film[]> {
    return this.filmsRepository.findAll();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmsRepository.findById(id);
  }

  async create(filmDto: CreateFilmDto): Promise<Film> {
    return this.filmsRepository.create(filmDto);
  }
}
