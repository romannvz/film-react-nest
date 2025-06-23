import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsFQDN,
} from 'class-validator';

export class ScheduleItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsInt()
  hall: number;

  @IsInt()
  rows: number;

  @IsInt()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  taken?: string[];
}

export class CreateFilmDto {
  @IsString()
  title: string;

  @IsString()
  director: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsFQDN({}, { message: 'image должен быть корректным URL' })
  image: string;

  @IsFQDN({}, { message: 'cover должен быть корректным URL' })
  cover: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  schedule: ScheduleItemDto[];
}
