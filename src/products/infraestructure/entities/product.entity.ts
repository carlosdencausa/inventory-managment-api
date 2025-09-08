import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

export class ProductEntity {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ean: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  measurement_unit: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  deleted_at: Date;

  constructor(partial?: Partial<ProductEntity>) {
    Object.assign(this, partial);
    this.created_at = partial?.created_at ?? new Date();
    this.updated_at = partial?.updated_at ?? null;
    this.deleted_at = partial?.deleted_at ?? null;
  }
}
