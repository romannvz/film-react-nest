import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/film.schema';
import { CreateFilmDto } from '../../films/dto/film.dto';
import { IFilmsRepository } from '../interfaces/films-repository.interface';

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async create(dto: CreateFilmDto): Promise<Film> {
    return new this.filmModel(dto).save();
  }
}
