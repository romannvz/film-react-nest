import { IsString, IsNumber, IsInt } from 'class-validator';

export class OrderResultDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsNumber()
  price: number;
}
