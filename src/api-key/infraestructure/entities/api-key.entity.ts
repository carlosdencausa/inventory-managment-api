import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ApiKeyEntity {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  api_key: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  warehouse: number | null;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  updated_at: Date | null;

  @IsDate()
  deleted_at: Date | null;
}
