import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/film.schema';
import { CreateFilmDto } from '../films/dto/film.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async create(filmDto: CreateFilmDto): Promise<Film> {
    const film = new this.filmModel(filmDto);
    return film.save();
  }
}
