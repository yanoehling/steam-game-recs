import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  review: string;

  @IsString()
  @IsNotEmpty()
  dev: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsArray()
  @IsNotEmpty()
  category: string[];
}

export class GetGameDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}