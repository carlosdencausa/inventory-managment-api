import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WarehouseEntity {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  updated_at: Date | null;

  @IsDate()
  deleted_at: Date | null;
}
