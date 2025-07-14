import { Injectable, Inject } from '@nestjs/common';
import { CreateFilmDto } from './dto/film.dto';
import {
  FILMS_REPOSITORY_TOKEN,
  IFilmsRepository,
} from 'src/repository/interfaces/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY_TOKEN)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll() {
    return this.filmsRepository.findAll();
  }

  async findById(id: string) {
    return this.filmsRepository.findById(id);
  }

  async create(filmDto: CreateFilmDto) {
    return this.filmsRepository.create(filmDto);
  }
}
